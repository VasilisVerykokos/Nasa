# AI note: written with Claude Code (Claude Opus 5.5), under the team's direction and review.
"""Apply db/schema.sql to Supabase, then test it with a few made-up hotspots that are removed at the end.

Run from the hotspot folder:  py -3.13 db/apply_and_test.py
Prints only PASS/FAIL lines, never a password. Touches no row except its own (country = 'TEST-DB').
"""
import json
import math
import sys
from pathlib import Path

import psycopg

HERE = Path(__file__).resolve().parent
TAG = "TEST-DB"  # every made-up row carries this country, so cleanup can never hit real data

env = {}
for line in (HERE.parent / ".env").read_text(encoding="utf-8-sig").splitlines():
    if "=" in line and not line.strip().startswith("#"):
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip()

failed = False


def check(name, ok, note=""):
    global failed
    failed = failed or not ok
    print(f"{'PASS' if ok else 'FAIL'}  {name}  {note}".rstrip())


def box(w, s, e, n):
    return json.dumps({"type": "Polygon", "coordinates": [[[w, s], [e, s], [e, n], [w, n], [w, s]]]})


def raises(c, sql, params, text, anon=False):
    """True if the query fails with an error message containing `text`."""
    try:
        with c.transaction():
            if anon:
                c.execute("set local role anon")
            c.execute(sql, params).fetchall()
    except psycopg.Error as e:
        return text in str(e)
    return False


# Made-up hotspots in the South Atlantic, far from any real (Greek) data.
# (date, lon, lat, source, satellite, weight, quality); the last one is outside the test box.
ROWS = [
    ("2001-03-10", -30.1, -50.1, "MODIS", "Terra", 3.5, "SP"),
    ("2001-03-20", -30.2, -50.2, "MODIS", "Terra", 3.5, "SP"),
    ("2020-07-01", -30.3, -50.3, "NOAA20", "NOAA-20", 1.0, "NRT"),
    ("2020-07-02", -30.4, -50.4, "SNPP", "S-NPP", 0.0, "SP"),  # outside its period: counted, weight 0
    ("2020-07-03", -40.0, -50.0, "NOAA20", "NOAA-20", 1.0, "SP"),  # outside the box
]
AREA = box(-31, -51, -29, -49)
EXPECTED = {(2001, 3): (7.0, 2, 0, 0, 0), (2020, 7): (1.0, 0, 1, 1, 1)}  # value, modis, snpp, noaa20, provisional

with psycopg.connect(host=env["SUPABASE_DB_HOST"], port=5432, user=env["SUPABASE_DB_USER"],
                     password=env["SUPABASE_DB_PASSWORD"], dbname="postgres", sslmode="require",
                     connect_timeout=15, autocommit=True) as c:
    c.execute((HERE / "schema.sql").read_text(encoding="utf-8"))
    c.execute((HERE / "schema.sql").read_text(encoding="utf-8"))
    check("schema.sql applied twice without error", True)

    c.execute("delete from public.hotspots where country = %s", [TAG])  # leftovers from an interrupted run
    try:
        with c.cursor() as cur:
            cur.executemany("insert into public.hotspots (acq_date, acq_time, latitude, longitude, source, satellite,"
                            " daynight, confidence, frp, weight, quality, country)"
                            " values (%s, '1200', %s, %s, %s, %s, 'D', 'n', 1.0, %s, %s, %s)",
                            [(d, lat, lon, src, sat, w, q, TAG) for d, lon, lat, src, sat, w, q in ROWS])
        check("inserted made-up rows", True, f"({len(ROWS)} rows tagged {TAG})")

        rows = c.execute("select * from public.calendar(%s)", [AREA]).fetchall()
        got = {(r[0], r[1]): r[2:7] for r in rows}
        for ym, want in EXPECTED.items():
            check(f"calendar {ym[0]}-{ym[1]:02}", got.get(ym) == want, f"got {got.get(ym)}, want {want}")
        others = [r for r in rows if (r[0], r[1]) not in EXPECTED and any(r[2:])]
        check("calendar: every other month is zero", not others, f"non-zero: {others[:3]}" if others else "")
        check("calendar: months with no hotspots are returned too", got.get((2001, 4)) == (0.0, 0, 0, 0, 0))

        # so_far counts only days 1..D, D = day of the newest hotspot in the whole table (3 if only test rows exist)
        cut = c.execute("select extract(day from max(acq_date))::int from public.hotspots").fetchone()[0]
        so_far = {(r[0], r[1]): r[7] for r in rows}
        want_2001 = 3.5 * (10 <= cut) + 3.5 * (20 <= cut)  # test rows on 10 and 20 March 2001
        check("calendar so_far 2001-03", so_far.get((2001, 3)) == want_2001, f"got {so_far.get((2001, 3))}, want {want_2001} (days 1-{cut})")
        check("calendar so_far 2020-07", so_far.get((2020, 7)) == 1.0, f"got {so_far.get((2020, 7))}, want 1.0 (row on day 1)")

        n = len(c.execute("select * from public.month_points(%s, 2001, 3)", [AREA]).fetchall())
        check("month_points 2001-03", n == 2, f"got {n} rows")
        n = len(c.execute("select * from public.hotspots_export(%s, '2000-01-01', '2030-12-31', 0)", [AREA]).fetchall())
        check("hotspots_export", n == 4, f"got {n} rows")

        check("invalid shape is rejected", raises(c, "select * from public.calendar(%s)", ['{"type": "Polygon"}'],
                                                  "not a valid GeoJSON"))
        ring = [[-30 + 0.5 * math.cos(i / 100), -50 + 0.5 * math.sin(i / 100)] for i in range(600)]
        big = json.dumps({"type": "Polygon", "coordinates": [ring + [ring[0]]]})
        check("shape with 600 corners is rejected", raises(c, "select * from public.calendar(%s)", [big], "limit is 500"))

        check("visitors cannot read hotspots directly",
              raises(c, "select * from public.hotspots", None, "permission denied", anon=True))
        check("visitors cannot call the internal shape check",
              raises(c, "select public.area_shape(%s)", [AREA], "permission denied", anon=True))
        with c.transaction():
            c.execute("set local role anon")
            got_anon = {(r[0], r[1]): r[2:7] for r in c.execute("select * from public.calendar(%s)", [AREA])}
            meta = c.execute("select public.get_meta()").fetchone()[0]
        check("visitors can call calendar()", got_anon.get((2001, 3)) == EXPECTED[(2001, 3)])
        check("visitors can call get_meta()", set(meta) == {"meta", "factors", "coverage"})
        cfg = c.execute("select rolconfig from pg_roles where rolname = 'anon'").fetchone()[0]
        check("visitor time limit is 10 s", "statement_timeout=10s" in cfg, str(cfg))
    finally:
        n = c.execute("delete from public.hotspots where country = %s", [TAG]).rowcount
        print(f"cleanup: removed {n} made-up rows")

print("\nALL GOOD" if not failed else "\nSOMETHING FAILED")
sys.exit(1 if failed else 0)
