# AI note: written with Claude Code (Claude Opus 5.5), under the team's direction and review.
"""Proof 3 (plan, section 5): two real fires, daily harmonized hotspots against the Copernicus burned-area maps.

For North Evia 2021 and Evros 2023, sums the hotspot weights per day inside the official Copernicus box, and for each
mapped date the hotspots since the previous map next to the burned area added since then. Both fires are in the NOAA-20
years, so a weight is 1 for a NOAA-20 hotspot and 0 otherwise. Uses the project's own cleaning and weighting.

Run from this folder:  py -3.13 proof3_fires.py   ->  web/public/proof/proof3_fires.json
"""
import json
from pathlib import Path

import pandas as pd

from config import PROOF_DIR

EVIDENCE = Path(__file__).resolve().parent / "evidence"
DAYS_AROUND = 2  # days shown before the start and after the last Copernicus date, so the quiet days are visible


def fires() -> list[dict]:
    """The two fires from the evidence files: name, box, first and last day, and the dated burned areas."""
    evia = json.loads((EVIDENCE / "copernicus_evia_2021.json").read_text(encoding="utf-8"))
    evros = json.loads((EVIDENCE / "copernicus_evros_2023.json").read_text(encoding="utf-8"))
    evros_maps = pd.read_csv(EVIDENCE / evros["burned_area_table"])
    return [
        {"name": "North Evia 2021", "box": evia["bounding_box"], "start": evia["start_date"],
         "end": evia["last_copernicus_product_date"],
         "maps": [{"date": m["date"], "ha": m["ha"]} for m in evia["burned_area"]]},
        {"name": "Evros 2023", "box": evros["bounding_box"], "start": evros["start_local"][:10],
         "end": evros_maps["image_date"].max(),
         "maps": [{"date": d, "ha": h} for d, h in zip(evros_maps["image_date"], evros_maps["burned_area_ha"])]},
    ]


def fire_days(h: pd.DataFrame, fire: dict) -> dict:
    """Daily harmonized hotspots in the fire's box, and per map the hotspots on the days since the previous map."""
    b = fire["box"]
    first = pd.Timestamp(fire["start"]) - pd.Timedelta(days=DAYS_AROUND)
    last = pd.Timestamp(fire["end"]) + pd.Timedelta(days=DAYS_AROUND)
    inside = h[h["longitude"].between(b["west"], b["east"]) & h["latitude"].between(b["south"], b["north"])]
    daily = (inside.groupby("acq_date")["weight"].sum()
             .reindex(pd.date_range(first, last, name="acq_date"), fill_value=0.0))
    maps, prev_date, prev_ha = [], first - pd.Timedelta(days=1), 0.0
    for m in fire["maps"]:
        d = pd.Timestamp(m["date"])
        # shortcut: a map counts the hotspots of whole days, prev map day excluded, its own day included; the image
        # time inside a day is not used, so a pass on the map day may fall after the image. Fine for daily totals.
        maps.append({"date": m["date"], "ha": m["ha"], "ha_added": round(m["ha"] - prev_ha, 1),
                     "hotspots_since_previous_map": round(float(daily[(daily.index > prev_date) & (daily.index <= d)].sum()), 1)})
        prev_date, prev_ha = d, m["ha"]
    peak = daily.idxmax()
    return {"name": fire["name"], "box": b, "start": fire["start"],
            "days": [{"date": d.strftime("%Y-%m-%d"), "hotspots": round(float(v), 1)} for d, v in daily.items()],
            "maps": maps, "peak_day": peak.strftime("%Y-%m-%d"), "peak_hotspots": round(float(daily.max()), 1),
            "total_hotspots": round(float(daily.sum()), 1)}


if __name__ == "__main__":
    from clean import load_all
    from factors import fit
    from harmonize import harmonize

    df = load_all()
    h = harmonize(df, fit(df))
    out = {"proof": 3, "what": "Daily harmonized hotspots inside the official Copernicus box, against the Copernicus burned-area maps",
           "note": "Hotspots are not burned area. A map's hotspots are those on the days after the previous map, up to and including its own day.",
           "fires": [fire_days(h, f) for f in fires()]}
    PROOF_DIR.mkdir(parents=True, exist_ok=True)
    (PROOF_DIR / "proof3_fires.json").write_text(json.dumps(out, indent=1) + "\n", encoding="utf-8")

    for f in out["fires"]:
        print(f"\n{f['name']}: peak {f['peak_hotspots']:.0f} hotspots on {f['peak_day']}, {f['total_hotspots']:.0f} in the window")
        print("  " + ", ".join(f"{d['date'][5:]} {d['hotspots']:.0f}" for d in f["days"]))
        for m in f["maps"]:
            print(f"  map {m['date']}: {m['ha']:>9,.0f} ha (+{m['ha_added']:,.0f}), hotspots since previous map {m['hotspots_since_previous_map']:.0f}")
    print(f"\nWrote {PROOF_DIR / 'proof3_fires.json'}")
