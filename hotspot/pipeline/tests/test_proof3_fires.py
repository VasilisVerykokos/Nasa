# AI note: written with Claude Code (Claude Opus 5.5), under the team's direction and review.
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from proof3_fires import fire_days, fires  # noqa: E402

FIRE = {"name": "Test fire", "box": {"west": 23.0, "south": 38.0, "east": 24.0, "north": 39.0},
        "start": "2021-08-03", "end": "2021-08-05", "maps": [{"date": "2021-08-03", "ha": 100}, {"date": "2021-08-05", "ha": 400}]}


def made_up():
    """Inside the box: weight 1 on 3 Aug (twice), 4 Aug and 5 Aug; a weight-0 row on 4 Aug; one row outside the box."""
    rows = [("2021-08-03", 38.5, 23.5, 1.0), ("2021-08-03", 38.5, 23.5, 1.0), ("2021-08-04", 38.5, 23.5, 1.0),
            ("2021-08-04", 38.5, 23.5, 0.0), ("2021-08-05", 38.5, 23.5, 1.0), ("2021-08-04", 40.0, 23.5, 1.0)]
    df = pd.DataFrame(rows, columns=["acq_date", "latitude", "longitude", "weight"])
    return df.assign(acq_date=pd.to_datetime(df["acq_date"]))


def test_daily_sums_inside_the_box_with_quiet_days_around():
    f = fire_days(made_up(), FIRE)
    days = {d["date"]: d["hotspots"] for d in f["days"]}
    assert list(days) == [f"2021-08-{d:02d}" for d in range(1, 8)]  # 2 days before the start, 2 after the end
    assert days == {"2021-08-01": 0, "2021-08-02": 0, "2021-08-03": 2, "2021-08-04": 1, "2021-08-05": 1,
                    "2021-08-06": 0, "2021-08-07": 0}
    assert (f["peak_day"], f["peak_hotspots"], f["total_hotspots"]) == ("2021-08-03", 2, 4)


def test_each_map_gets_the_hotspots_since_the_previous_map():
    maps = fire_days(made_up(), FIRE)["maps"]
    assert [(m["ha_added"], m["hotspots_since_previous_map"]) for m in maps] == [(100, 2), (300, 2)]


def test_the_evidence_files_give_both_fires():
    evia, evros = fires()
    assert evia["start"] == "2021-08-03" and evia["maps"][-1] == {"date": "2021-08-11", "ha": 50909}
    assert evros["start"] == "2023-08-19" and len(evros["maps"]) == 10 and evros["end"] == "2023-09-03"
