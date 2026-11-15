# AI note: written with Claude Code (Claude Opus 5.5), under the team's direction and review.
"""The current year (plan, section 4, step 6, and section 9.6): NOAA-20 hotspots from the FIRMS Area API.

Each run fetches every day from API_START to NASA's newest day, 5 days per request: standard data (SP) as far as NASA
has it, near-real-time (NRT) after that. It cleans them like the yearly files (NRT rows have no `type`, so a factory
mask stands in for it), cuts them to the Greece outline widened by CLIP_KM but never into a neighbouring country
(evidence/neighbours.geojson), and replaces every row from API_START in one
transaction. Running it twice gives the same result, and NRT days turn into SP days by themselves once NASA releases them.
Nothing in the database changes if a download fails.

Run once a day from the hotspot folder:  py -3.13 pipeline/update_daily.py     Prints counts only, never a secret.
The factory mask is read from evidence/factory_mask.csv, so the daily run needs no archive files (GitHub Actions has none).
Rewrite that file after the yearly files change:  py -3.13 pipeline/update_daily.py --build-mask
"""
import io
import json
import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

import pandas as pd
import requests

from clean import clean, read_raw
from config import (API_BOX, API_DAYS, API_SOURCES, API_START, CLIP_KM, COUNTRY, MASK_CELL_DEG, MASK_MAX_OTHER,
                    SOURCES, VEGETATION_FIRE_TYPE)
from load_db import COLS, env, none_if_nan
from proof7_grid import cell_index

API = "https://firms.modaps.eosdis.nasa.gov/api"
EVIDENCE = Path(__file__).resolve().parent / "evidence"
NEIGHBOURS = json.loads((EVIDENCE / "neighbours.geojson").read_text(encoding="utf-8"))
MASK_FILE = EVIDENCE / "factory_mask.csv"
NOT_VEGETATION = -1  # the type given to an NRT row in a factory cell, so clean() drops it like any non-vegetation row


def windows(first: date, last: date) -> list[tuple[date, int]]:
    """(start day, number of days) for each request, at most API_DAYS days each, covering first to last."""
    out, d = [], first
    while d <= last:
        days = min(API_DAYS, (last - d).days + 1)
        out.append((d, days))
        d += timedelta(days=days)
    return out


def _cells(d: pd.DataFrame):
    return zip(cell_index(d["latitude"], MASK_CELL_DEG), cell_index(d["longitude"], MASK_CELL_DEG))


def factory_cells(raw: pd.DataFrame) -> set:
    """GFED5NRT rule: a 0.01-degree cell with more than MASK_MAX_OTHER non-vegetation detections is a permanent heat source."""
    counts = pd.Series(list(_cells(raw[raw["type"] != VEGETATION_FIRE_TYPE])), dtype=object).value_counts()
    return set(counts[counts > MASK_MAX_OTHER].index)


def write_mask(mask: set, path=MASK_FILE) -> None:
    pd.DataFrame(sorted(mask), columns=["lat_cell", "lon_cell"]).to_csv(path, index=False)


def read_mask(path=MASK_FILE) -> set:
    return set(pd.read_csv(path).itertuples(index=False, name=None))


def clean_api(raw: pd.DataFrame, mask: set) -> pd.DataFrame:
    """API rows -> cleaned rows, by the same rules as the yearly files. Without a type column, a row is a vegetation
    fire unless it lies in a factory cell."""
    if "type" not in raw:
        raw = raw.assign(type=[NOT_VEGETATION if c in mask else VEGETATION_FIRE_TYPE for c in _cells(raw)])
    return clean(raw).assign(acq_time=lambda d: d["acq_time"].str.zfill(4))  # "104" -> "0104", as in the yearly files


def _get(url: str, key: str, what: str) -> str:
    """GET a FIRMS address. The address holds the key, so no error message may contain it: requests' own messages
    (bad status, no connection) repeat the address, and `from None` keeps them out of the traceback too."""
    try:
        r = requests.get(url, timeout=120)
    except requests.RequestException as e:
        raise ConnectionError(f"FIRMS could not be reached for {what} ({type(e).__name__}).") from None
    if not r.ok:
        raise ConnectionError(f"FIRMS answered HTTP {r.status_code} for {what}.")
    if key in r.text:  # FIRMS error pages can repeat the address; never let the key reach a message
        raise ValueError("FIRMS answered with an error that repeats the key (not shown). Check the key and the address.")
    return r.text


def available(key: str, source: str) -> tuple[date, date]:
    """First and last day NASA has for a source."""
    t = pd.read_csv(io.StringIO(_get(f"{API}/data_availability/csv/{key}/{source}", key, f"the available dates of {source}")))
    return date.fromisoformat(t["min_date"].iloc[0]), date.fromisoformat(t["max_date"].iloc[0])


def fetch(key: str, source: str, first: date, last: date) -> pd.DataFrame:
    """Every row of a source from first to last. Stops with an error on any answer that is not hotspot data."""
    parts = []
    for start, days in windows(first, last):
        end = start + timedelta(days=days - 1)
        text = _get(f"{API}/area/csv/{key}/{source}/{API_BOX}/{days}/{start}", key, f"{source} {start} to {end}")
        t = pd.read_csv(io.StringIO(text), dtype={"acq_time": str, "confidence": str})
        if "acq_date" not in t:
            raise ValueError(f"FIRMS answered something that is not hotspot data for {source} {start}: {text[:120]!r}")
        if len(t) and not t["acq_date"].between(str(start), str(end)).all():
            raise ValueError(f"FIRMS returned days outside {start} to {end} for {source}")
        parts.append(t)
    return pd.concat(parts, ignore_index=True)


if __name__ == "__main__":
    if "--build-mask" in sys.argv:  # needs pipeline/data/raw; the result is committed
        write_mask(factory_cells(pd.concat(read_raw(folder) for folder in SOURCES)))
        sys.exit(f"Wrote {MASK_FILE}")
    import psycopg

    e = env()
    key = e["FIRMS_MAP_KEY"]
    start = date.fromisoformat(API_START)
    sp_end = available(key, API_SOURCES["SP"])[1]
    nrt_start, nrt_end = available(key, API_SOURCES["NRT"])
    mask = read_mask()

    parts, masked = [], 0
    if sp_end >= start:
        parts.append(clean_api(fetch(key, API_SOURCES["SP"], start, sp_end), mask).assign(quality="SP"))
    nrt_first = max(start, sp_end + timedelta(days=1), nrt_start)
    if nrt_end >= nrt_first:
        nrt_raw = fetch(key, API_SOURCES["NRT"], nrt_first, nrt_end)
        masked = sum(c in mask for c in _cells(nrt_raw))
        parts.append(clean_api(nrt_raw, mask).assign(quality="NRT"))
    rows = pd.concat(parts, ignore_index=True)
    if rows.empty:
        raise SystemExit("No rows came back from FIRMS. The database was not changed.")
    through = max(sp_end, nrt_end)

    with psycopg.connect(host=e["SUPABASE_DB_HOST"], port=5432, user=e["SUPABASE_DB_USER"],
                         password=e["SUPABASE_DB_PASSWORD"], dbname="postgres", sslmode="require",
                         connect_timeout=15) as c:  # one transaction: commits on success, rolls back on any error
        c.execute(f"create temp table new_rows on commit drop as select {COLS} from public.hotspots limit 0")
        with c.cursor() as cur, cur.copy(f"copy new_rows ({COLS}) from stdin") as cp:
            for r in rows.itertuples(index=False):
                # NOAA-20 from 2019 on is the record's unit, so its weight is 1 (plan, section 4, step 5)
                cp.write_row((r.acq_date.date(), r.acq_time, r.latitude, r.longitude, "NOAA20", r.satellite, r.daynight,
                              none_if_nan(r.confidence), none_if_nan(r.frp), 1.0, r.quality, COUNTRY))
        c.execute("create temp table neighbours on commit drop as select extensions.st_setsrid(extensions.st_geomfromgeojson("
                  "f->>'geometry'), 4326) geom from jsonb_array_elements(%s::jsonb) f", [json.dumps(NEIGHBOURS["features"])])
        deleted = c.execute("delete from public.hotspots where acq_date >= %s", [start]).rowcount
        # Kept: within CLIP_KM of Greece (the coast of the outline is coarse) and not inside a neighbouring country
        # (the margin must not let in fires across a land border).
        inserted = c.execute(
            f"insert into public.hotspots ({COLS}) select {COLS} from new_rows n"
            " cross join lateral (select extensions.st_setsrid(extensions.st_makepoint(n.longitude, n.latitude), 4326) p) pt"
            " where exists (select 1 from public.coverage g where g.country = %s and extensions.st_dwithin("
            "   pt.p::extensions.geography, g.geom::extensions.geography, %s))"
            " and not exists (select 1 from neighbours b where extensions.st_intersects(pt.p, b.geom))",
            [COUNTRY, CLIP_KM * 1000]).rowcount
        meta = {"data_through": str(through), "last_update": datetime.now(timezone.utc).isoformat()}
        c.cursor().executemany("insert into public.meta (key, value) values (%s, %s::jsonb)"
                               " on conflict (key) do update set value = excluded.value",
                               [(k, json.dumps(v)) for k, v in meta.items()])
        by = c.execute("select quality, count(*), min(acq_date), max(acq_date) from public.hotspots"
                       " where acq_date >= %s group by quality order by 1", [start]).fetchall()

    print(f"{datetime.now(timezone.utc):%Y-%m-%d %H:%M} UTC  {start} to {through}: fetched and cleaned {len(rows):,} rows, "
          f"{len(rows) - inserted:,} outside Greece (+{CLIP_KM} km, not in a neighbour) cut, {inserted:,} stored (replacing {deleted:,}).")
    print(f"  factory cells in the mask: {len(mask):,}; NRT rows in those cells, dropped: {masked:,}")
    for q, n, lo, hi in by:
        print(f"  {q}: {n:,} rows, {lo} to {hi}")
