# AI note: written with Claude Code (Claude Sonnet 5.5), under the team's direction and review.
"""Call calendar() the way the website does (HTTPS POST, publishable key only) and check the answers (plan, section 9.7).

Run from the hotspot folder:  py -3.13 pipeline/check_db.py"""
import json
import sys
import time
from pathlib import Path

import requests

from clean import load_all
from factors import fit
from harmonize import harmonize
from load_db import env

E = env()
failed = False


def box(w, s, e, n):
    return {"type": "Polygon", "coordinates": [[[w, s], [e, s], [e, n], [w, n], [w, s]]]}


def calendar(area):
    """(HTTP status, answer, seconds) of one calendar() call; only the publishable key is sent."""
    t = time.time()
    r = requests.post(f"{E['SUPABASE_URL']}/rest/v1/rpc/calendar", json={"area": area},
                      headers={"apikey": E["SUPABASE_ANON_KEY"]}, timeout=30)
    return r.status_code, r.json(), time.time() - t


def check(name, ok, note=""):
    global failed
    failed = failed or not ok
    print(f"{'PASS' if ok else 'FAIL'}  {name}  {note}".rstrip())


def top_august(rows):
    aug = {r["year"]: r["value"] for r in rows if r["month"] == 8 and r["year"] >= 2012}
    return max(aug, key=aug.get)


GREECE_BOX = (19.6, 34.8, 28.3, 41.8)  # what the website sends for "All Greece" (web/src/lib/geo)
df = load_all()
h = harmonize(df, fit(df))
inside = h[h["longitude"].between(GREECE_BOX[0], GREECE_BOX[2]) & h["latitude"].between(GREECE_BOX[1], GREECE_BOX[3])]
mine = inside.groupby([inside["acq_date"].dt.year, inside["acq_date"].dt.month])["weight"].sum()
print(f"pipeline rows: {len(h):,}; inside the Greece rectangle: {len(inside):,}\n")

# 1. All Greece. The real outline has too many corners for the database, so the rectangle is the real test.
code, ans, sec = calendar(json.loads((Path(__file__).parent / "evidence" / "greece.geojson").read_text())["features"][0]["geometry"])
check("coverage outline is refused (over 500 corners, so the site cannot send it)", code != 200, f"({code}: {str(ans)[:90]}) {sec:.2f}s")
code, rows, sec = calendar(box(*GREECE_BOX))
check("All Greece rectangle answers", code == 200 and len(rows) > 300, f"{len(rows)} months, {sec:.2f}s")
rows = [r for r in rows if r["year"] <= h["acq_date"].dt.year.max()]  # the current year comes from update_daily.py, not the yearly files
bad =[(r["year"], r["value"], mine.get((r["year"], 8), 0)) for r in rows if r["month"] == 8
       and abs(r["value"] - mine.get((r["year"], 8), 0)) > 0.001 * max(mine.get((r["year"], 8), 0), 1e-9)]
check("All Greece: every August within 0.1% of the pipeline", not bad, f"{sum(r['month'] == 8 for r in rows)} Augusts compared, mismatches: {bad[:3]}")
print(f"      all months, largest relative gap: {max(abs(r['value'] - mine.get((r['year'], r['month']), 0)) / max(mine.get((r['year'], r['month']), 0), 1) for r in rows):.2e}")

# 2. Presets
code, rows, sec = calendar(box(22.966, 38.674, 23.509, 39.063))  # official EMSR527 box, as in web/src/lib/geo
check("North Evia: August 2021 is the highest August since 2012", code == 200 and top_august(rows) == 2021, f"top = {top_august(rows)}, {sec:.2f}s")
code, rows, sec = calendar(box(25.536, 40.749, 26.317, 41.261))
check("Evros: August 2023 is the highest August since 2012", code == 200 and top_august(rows) == 2023, f"top = {top_august(rows)}, {sec:.2f}s")

# 3. No fires: the Atlantic
code, rows, sec = calendar(box(-30, -50, -29, -49))
check("area with no fires returns zero rows, not an error", code == 200 and len(rows) > 300 and not any(r["value"] or r["modis"] or r["snpp"] or r["noaa20"] for r in rows),
      f"{len(rows)} months all zero, {sec:.2f}s")

print("\nALL GOOD" if not failed else "\nSOMETHING FAILED")
sys.exit(1 if failed else 0)
