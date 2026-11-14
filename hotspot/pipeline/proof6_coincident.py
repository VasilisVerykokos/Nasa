# AI note: written with Claude Code (Claude Opus 5.5) for Person B, under the team's direction and review.
"""Proof 6 (plan, section 5): what the MODIS-to-VIIRS factor is made of.

On passes where Aqua and S-NPP saw Greece within a few minutes of each other, the fires are the same and only the
sensor differs. On common cells of about 0.1 degree the script measures:
  - sensitivity: the share of cells with S-NPP fire that Aqua also saw;
  - resolution: S-NPP pixels per Aqua pixel in the cells both saw.
It explains the factor; it does not replace it (F1 is fitted on monthly totals, plan section 4).
Uses the project's own cleaning step (clean.load_all).

Run from this folder:  py -3.13 proof6_coincident.py   ->  web/public/proof/proof6_coincident.json
"""
import json

import pandas as pd

from clean import load_all
from config import (COINCIDENCE_CELL_DEG, COINCIDENCE_MINUTES, FIT_END, FIT_START, PASS_GAP_MINUTES, PROOF_DIR)
from proof7_grid import cell_index

# Stated next to the result, as the plan asks (section 5). The numbers in braces come from the run.
LIMITS = [
    "Aqua only: Terra passes about three hours before VIIRS, so near-simultaneous passes are rare for it "
    "({terra} Terra hotspots had an S-NPP hotspot within {minutes} minutes, against {aqua} Aqua hotspots).",
    "The ratio on these passes ({coincident}) is lower than over all passes ({all_passes}), as expected: a pass where "
    "only S-NPP saw fire has no Aqua row and drops out. So this proof shows what the gap is made of; it does not "
    "measure the factor's size, which comes from monthly totals (plan, section 4).",
    "No large fires: the most Aqua pixels in one shared cell on one pass is {largest}.",
    "A small sample: {days} days with a coincident pass in eight years at the {minutes}-minute limit.",
    "A pass that detected nothing leaves no row in the files, so only passes where both sensors recorded something "
    "are counted. The share of cells Aqua also saw is therefore probably optimistic.",
    "Both satellites cover Greece on these passes, but a fire near the edge of one swath may lie outside the other's.",
]


def stamp(d: pd.DataFrame) -> pd.Series:
    """Date and UTC time of each hotspot as one timestamp, so a pass that crosses midnight stays together."""
    hhmm = d["acq_time"].astype(str).str.zfill(4)
    return d["acq_date"] + pd.to_timedelta(hhmm.str[:2].astype(int) * 60 + hhmm.str[2:].astype(int), unit="min")


def with_partner(a: pd.DataFrame, b: pd.DataFrame, minutes: int) -> pd.DataFrame:
    """Rows of `a` with a row of `b` of the same day/night flag at most `minutes` apart, anywhere in the area."""
    left = a.assign(t=stamp(a)).sort_values("t")
    right = b.assign(t=stamp(b))[["t", "daynight"]].sort_values("t")
    m = pd.merge_asof(left, right.assign(partner=right["t"]), on="t", by="daynight", direction="nearest",
                      tolerance=pd.Timedelta(minutes=minutes))
    return m[m["partner"].notna()].drop(columns="partner")


def coincidences(df: pd.DataFrame, minutes: int, cell_deg=COINCIDENCE_CELL_DEG, gap=PASS_GAP_MINUTES) -> dict:
    w = df[(df["acq_date"] >= FIT_START) & (df["acq_date"] <= FIT_END)]
    aqua, snpp, terra = (w[w["satellite"] == s] for s in ("Aqua", "S-NPP", "Terra"))
    both = pd.concat([with_partner(aqua, snpp, minutes).assign(sat="Aqua"),
                      with_partner(snpp, aqua, minutes).assign(sat="S-NPP")]).sort_values("t")
    both["pass_id"] = (both["t"].diff() > pd.Timedelta(minutes=gap)).cumsum()
    both["lat_c"], both["lon_c"] = cell_index(both["latitude"], cell_deg), cell_index(both["longitude"], cell_deg)

    cells = (both.groupby(["pass_id", "lat_c", "lon_c", "sat"]).size().unstack("sat", fill_value=0)
             .reindex(columns=["Aqua", "S-NPP"], fill_value=0))
    shared = cells[(cells["Aqua"] > 0) & (cells["S-NPP"] > 0)]
    count = lambda sat, dn: int(((both["sat"] == sat) & (both["daynight"] == dn)).sum())  # noqa: E731
    return {
        "max_minutes": minutes,
        "passes": int(both["pass_id"].nunique()),
        "days": int(both.groupby("pass_id")["t"].min().dt.normalize().nunique()),
        "aqua_hotspots_day": count("Aqua", "D"), "aqua_hotspots_night": count("Aqua", "N"),
        "snpp_per_aqua": round(int((both["sat"] == "S-NPP").sum()) / int((both["sat"] == "Aqua").sum()), 2),
        "snpp_per_aqua_day": round(count("S-NPP", "D") / count("Aqua", "D"), 2),
        "snpp_per_aqua_night": round(count("S-NPP", "N") / count("Aqua", "N"), 2),
        "snpp_cells_also_seen_by_aqua_pct": round(100 * len(shared) / int((cells["S-NPP"] > 0).sum()), 1),
        "aqua_cells_also_seen_by_snpp_pct": round(100 * len(shared) / int((cells["Aqua"] > 0).sum()), 1),
        "snpp_per_aqua_pixels_in_shared_cells": round(shared["S-NPP"].sum() / shared["Aqua"].sum(), 2),
        "largest_aqua_pixels_in_a_shared_cell": int(shared["Aqua"].max()),
        "terra_hotspots_with_a_match": len(with_partner(terra, snpp, minutes)),
    }


def monthly_ratio(df: pd.DataFrame) -> float:
    """S-NPP / Aqua over all passes of the window, for comparison with the coincidence ratios."""
    w = df[(df["acq_date"] >= FIT_START) & (df["acq_date"] <= FIT_END)]
    return round((w["satellite"] == "S-NPP").sum() / (w["satellite"] == "Aqua").sum(), 2)


if __name__ == "__main__":
    df = load_all()
    rows = [coincidences(df, m) for m in COINCIDENCE_MINUTES]
    first, all_passes = rows[0], monthly_ratio(df)
    filled = dict(terra=first["terra_hotspots_with_a_match"], minutes=first["max_minutes"],
                  aqua=first["aqua_hotspots_day"] + first["aqua_hotspots_night"], coincident=first["snpp_per_aqua"],
                  all_passes=all_passes, largest=first["largest_aqua_pixels_in_a_shared_cell"], days=first["days"])
    out = {"proof": 6, "what": "Aqua against S-NPP on near-simultaneous passes: sensitivity and resolution",
           "window": {"from": FIT_START, "to": FIT_END}, "cell_deg": COINCIDENCE_CELL_DEG,
           "snpp_per_aqua_all_passes": all_passes, "rows": rows, "limits": [s.format(**filled) for s in LIMITS]}
    PROOF_DIR.mkdir(parents=True, exist_ok=True)
    (PROOF_DIR / "proof6_coincident.json").write_text(json.dumps(out, indent=1) + "\n", encoding="utf-8")

    print(f"Proof 6, near-simultaneous Aqua and S-NPP passes, {FIT_START} to {FIT_END}, cells of {COINCIDENCE_CELL_DEG} deg")
    print(json.dumps({k: v for k, v in out.items() if k in ("snpp_per_aqua_all_passes", "rows")}, indent=1))
    print("Limits:", *out["limits"], sep="\n - ")
