# AI note: written with Claude Code (Claude Opus 5.5) for Person B, under the team's direction and review.
# Proof 7 on tiny made-up data with answers counted by hand.
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from proof7_grid import grid_test  # noqa: E402


def hotspots(source, rows):
    return pd.DataFrame([{"source": source, "acq_date": pd.Timestamp(day), "latitude": lat, "longitude": lon}
                         for day, lat, lon in rows])


DF = pd.concat([
    hotspots("MODIS", [("2015-08-01", 38.90, 23.30),    # on a 0.01-degree grid line: stays in cell 3890
                       ("2015-08-01", 38.95, 23.30),    # same 0.1-degree cell as the first, another 0.01-degree cell
                       ("2015-08-02", 38.90, 23.30)]),  # same cell, next day: a new cell-day
    hotspots("SNPP", [("2015-08-01", 38.901, 23.301),   # same 0.01-degree cell and day as MODIS
                      ("2015-08-01", 38.99, 23.39),     # same 0.1-degree cell as MODIS, not the same 0.01-degree cell
                      ("2015-08-03", 38.50, 23.00),     # a day MODIS saw nothing
                      ("2025-08-01", 38.90, 23.30)]),   # outside the fit window: not counted
], ignore_index=True)


def test_counts_hotspots_and_cell_days_in_the_window():
    hot, fine, coarse = grid_test(DF, sizes=[0.01, 0.1])
    assert (hot["modis"], hot["snpp"], hot["ratio"]) == (3, 3, 1.0)
    assert (fine["modis"], fine["snpp"], fine["snpp_cells_also_seen_by_modis_pct"]) == (3, 3, 33.3)
    assert (coarse["modis"], coarse["snpp"], coarse["snpp_cells_also_seen_by_modis_pct"]) == (2, 2, 50.0)
    assert coarse["cell_km"] == 11.1
