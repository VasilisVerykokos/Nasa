# AI note: written with Claude Code (Claude Sonnet 5.5), under the team's direction and review.
"""Empty and reload hotspots, factors, coverage and meta in Supabase, in one transaction (plan, sections 9.2 and 9.3).

Run from the hotspot folder:  py -3.13 pipeline/load_db.py     Prints row counts only, never a secret.
It holds the yearly files only (to 2025): run pipeline/update_daily.py straight after it to put the current year back."""
import json
from datetime import datetime, timezone
from pathlib import Path

import psycopg

from clean import load_all
from config import AQUA_START, COUNTRY, NOAA20_START, SNPP_START
from factors import fit
from harmonize import harmonize
from validate import blind_test

METHOD_VERSION = "1"
ROOT = Path(__file__).resolve().parents[1]
COLS = "acq_date, acq_time, latitude, longitude, source, satellite, daynight, confidence, frp, weight, quality, country"


def env() -> dict:
    out = {}
    for line in (ROOT / ".env").read_text(encoding="utf-8-sig").splitlines():
        if "=" in line and not line.strip().startswith("#"):
            k, v = line.split("=", 1)
            out[k.strip()] = v.strip()
    return out


def none_if_nan(v):
    return None if v != v else v


if __name__ == "__main__":
    df = load_all()
    factors = fit(df)
    h = harmonize(df, factors)
    err = blind_test(df)["summary"]["fire_season_month_error_pct"] / 100  # the range the app shows, as a fraction
    outline = json.loads((Path(__file__).parent / "evidence" / "greece.geojson").read_text(encoding="utf-8"))
    outline = json.dumps(outline["features"][0]["geometry"])

    meta = {"data_through": str(h["acq_date"].max().date()), "last_update": datetime.now(timezone.utc).isoformat(),
            "record_start": str(h["acq_date"].min().date()), "method_version": METHOD_VERSION,
            "switch_dates": {"aqua_start": AQUA_START, "snpp_start": SNPP_START, "noaa20_start": NOAA20_START},
            "f2": float(factors.loc[factors["name"] == "F2", "factor"].iloc[0]), "uncertainty": [-err, err]}

    e = env()
    with psycopg.connect(host=e["SUPABASE_DB_HOST"], port=5432, user=e["SUPABASE_DB_USER"],
                         password=e["SUPABASE_DB_PASSWORD"], dbname="postgres", sslmode="require",
                         connect_timeout=15) as c:  # one transaction: commits on success, rolls back on any error
        c.execute("truncate public.hotspots, public.factors, public.coverage, public.meta restart identity")
        with c.cursor() as cur, cur.copy(f"copy public.hotspots ({COLS}) from stdin") as cp:
            for r in h.itertuples(index=False):
                cp.write_row((r.acq_date.date(), r.acq_time, r.latitude, r.longitude, r.source, r.satellite, r.daynight,
                              none_if_nan(r.confidence), none_if_nan(r.frp), float(r.weight), "SP", COUNTRY))
        c.cursor().executemany(
            "insert into public.factors (name, season, daynight, numerator, denominator, factor, uses, start_date, end_date)"
            " values (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
            [(r.name, r.season, r.daynight, r.numerator, r.denominator, r.factor, r.uses, r.start, r.end)
             for r in factors.itertuples(index=False)])
        c.execute("insert into public.coverage (country, geom) values (%s, extensions.st_multi(extensions.st_setsrid("
                  "extensions.st_geomfromgeojson(%s), 4326)))", [COUNTRY, outline])
        c.cursor().executemany("insert into public.meta (key, value) values (%s, %s::jsonb)",
                               [(k, json.dumps(v)) for k, v in meta.items()])
        for t in ("hotspots", "factors", "coverage", "meta"):
            print(f"{t}: {c.execute(f'select count(*) from public.{t}').fetchone()[0]:,} rows")
        print(f"weight 0 rows: {c.execute('select count(*) from public.hotspots where weight = 0').fetchone()[0]:,}")
    print("meta:", {k: v for k, v in meta.items() if k != "last_update"})
    print("The current year is now empty: run  py -3.13 pipeline/update_daily.py")
