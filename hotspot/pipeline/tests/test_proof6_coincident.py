# AI note: written with Claude Code (Claude Opus 5.5), under the team's direction and review.
# Proof 6 on tiny made-up data with answers counted by hand.
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from proof6_coincident import coincidences  # noqa: E402


def hotspots(satellite, rows):
    return pd.DataFrame([{"satellite": satellite, "acq_date": pd.Timestamp(day), "acq_time": hhmm, "daynight": dn,
                          "latitude": lat, "longitude": lon} for day, hhmm, dn, lat, lon in rows])


# Cells of 0.1 degree: A = (38.9, 23.3), B = (39.5, 22.5), C = (37.5, 22.0), D = (40.0, 21.5).
DF = pd.concat([
    # Pass 1, day, 3 minutes apart: Aqua sees cell A once; S-NPP sees A twice and B once.
    hotspots("Aqua", [("2015-08-01", "1100", "D", 38.91, 23.31)]),
    hotspots("S-NPP", [("2015-08-01", "1103", "D", 38.91, 23.31), ("2015-08-01", "1103", "D", 38.92, 23.32),
                       ("2015-08-01", "1103", "D", 39.51, 22.51)]),
    # Pass 2, night, 4 minutes apart across midnight: both see cell C once.
    hotspots("Aqua", [("2015-08-01", "2358", "N", 37.55, 22.05)]),
    hotspots("S-NPP", [("2015-08-02", "2", "N", 37.55, 22.05)]),  # acq_time without leading zeros, as in the files
    # Pass 3, day, 8 minutes apart: only within the 10-minute limit. Both see cell D once.
    hotspots("Aqua", [("2015-08-03", "1100", "D", 40.05, 21.55)]),
    hotspots("S-NPP", [("2015-08-03", "1108", "D", 40.05, 21.55)]),
    # Terra, 90 minutes before S-NPP: never a match. A coincident pair outside the window: not counted.
    hotspots("Terra", [("2015-08-01", "0930", "D", 38.91, 23.31)]),
    hotspots("Aqua", [("2021-08-01", "1100", "D", 38.91, 23.31)]),
    hotspots("S-NPP", [("2021-08-01", "1101", "D", 38.91, 23.31)]),
], ignore_index=True)


def test_five_minutes():
    r = coincidences(DF, 5)
    assert (r["passes"], r["days"]) == (2, 1)  # both passes start on 1 August (UTC)
    assert (r["aqua_hotspots_day"], r["aqua_hotspots_night"]) == (1, 1)
    assert (r["snpp_per_aqua_day"], r["snpp_per_aqua_night"], r["snpp_per_aqua"]) == (3.0, 1.0, 2.0)  # 4 / 2
    assert r["snpp_cells_also_seen_by_aqua_pct"] == 66.7  # A and C of A, B, C
    assert r["aqua_cells_also_seen_by_snpp_pct"] == 100.0
    assert r["snpp_per_aqua_pixels_in_shared_cells"] == 1.5  # (2 + 1) / (1 + 1)
    assert (r["largest_aqua_pixels_in_a_shared_cell"], r["terra_hotspots_with_a_match"]) == (1, 0)


def test_ten_minutes_adds_the_third_pass():
    r = coincidences(DF, 10)
    assert (r["passes"], r["days"], r["aqua_hotspots_day"]) == (3, 2, 2)
    assert r["snpp_per_aqua_day"] == 2.0  # 4 / 2
    assert r["snpp_cells_also_seen_by_aqua_pct"] == 75.0
    assert r["snpp_per_aqua_pixels_in_shared_cells"] == 1.33  # (2 + 1 + 1) / (1 + 1 + 1)
