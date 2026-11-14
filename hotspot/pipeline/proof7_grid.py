# AI note: written with Claude Code (Claude Opus 5.5) for Person B, under the team's direction and review.
"""Proof 7 (plan, section 5): does a common grid harmonize MODIS and VIIRS?

Over the factor's fit window, counts MODIS (Terra + Aqua) and S-NPP first as hotspots, then as active cell-days
(grid cells with at least one hotspot on a day) for each cell size in config. If gridding were the answer, the
S-NPP / MODIS ratio would fall towards 1 as cells grow. Uses the project's own cleaning step (clean.load_all).

Run from this folder:  py -3.13 proof7_grid.py   ->  web/public/proof/proof7_grid.json
"""
import json

import pandas as pd

from clean import load_all
from config import FIT_END, FIT_START, GRID_CELLS_DEG, PROOF_DIR

KM_PER_DEGREE = 111.2  # north to south; east to west a cell is about a fifth narrower at Greek latitudes


def cell_index(v: pd.Series, size: float) -> pd.Series:
    """Grid cell number of each coordinate, counted from the south-west. The rounding keeps a point that lies exactly
    on a grid line (38.90 for 0.01-degree cells) in the cell it starts. // 1 rounds down, also below zero."""
    return ((v / size).round(6) // 1).astype(int)


def cell_days(d: pd.DataFrame, size: float) -> pd.DataFrame:
    """One row per (day, cell) with at least one hotspot."""
    return pd.DataFrame({"day": d["acq_date"], "lat": cell_index(d["latitude"], size),
                         "lon": cell_index(d["longitude"], size)}).drop_duplicates()


def grid_test(df: pd.DataFrame, sizes=GRID_CELLS_DEG) -> list[dict]:
    """The table of proof 7: hotspots, then cell-days per cell size, with the ratio and the overlap."""
    w = df[(df["acq_date"] >= FIT_START) & (df["acq_date"] <= FIT_END)]
    modis, snpp = w[w["source"] == "MODIS"], w[w["source"] == "SNPP"]
    rows = [{"counted": "hotspots", "cell_deg": None, "cell_km": None, "modis": len(modis), "snpp": len(snpp),
             "ratio": round(len(snpp) / len(modis), 2), "snpp_cells_also_seen_by_modis_pct": None}]
    for size in sizes:
        m, s = cell_days(modis, size), cell_days(snpp, size)
        both = len(s.merge(m, on=["day", "lat", "lon"]))
        rows.append({"counted": "cell-days", "cell_deg": size, "cell_km": round(size * KM_PER_DEGREE, 1),
                     "modis": len(m), "snpp": len(s), "ratio": round(len(s) / len(m), 2),
                     "snpp_cells_also_seen_by_modis_pct": round(100 * both / len(s), 1)})
    return rows


if __name__ == "__main__":
    rows = grid_test(load_all())
    out = {"proof": 7, "what": "S-NPP against MODIS (Terra + Aqua), as hotspots and as active cell-days on a common grid",
           "window": {"from": FIT_START, "to": FIT_END}, "rows": rows}
    PROOF_DIR.mkdir(parents=True, exist_ok=True)
    (PROOF_DIR / "proof7_grid.json").write_text(json.dumps(out, indent=1) + "\n", encoding="utf-8")

    print(f"Proof 7, grid test, {FIT_START} to {FIT_END}")
    print(f"{'counted':26} {'MODIS':>7} {'S-NPP':>7} {'ratio':>6} {'S-NPP cells MODIS also saw':>27}")
    for r in rows:
        name = "hotspots, no grid" if r["cell_deg"] is None else f"cell-days, {r['cell_deg']} deg (~{r['cell_km']} km)"
        seen = "" if r["snpp_cells_also_seen_by_modis_pct"] is None else f"{r['snpp_cells_also_seen_by_modis_pct']}%"
        print(f"{name:26} {r['modis']:>7,} {r['snpp']:>7,} {r['ratio']:>6} {seen:>27}")
    print(f"Wrote {PROOF_DIR / 'proof7_grid.json'}")
