# AI note: written with Claude Code (Claude Opus 5.5), under the team's direction and review.
import sys
from pathlib import Path

import pandas as pd
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from validate import blind_test  # noqa: E402


def made_up(modis_per_month_after_2016):
    """Every month Feb 2012 to Dec 2019 at one spot: S-NPP 6 day + 10 night, MODIS 2 day + 2 night
    (true F1: 3 by day, 5 by night). From 2017 MODIS gets a different count, to test that the blind fit never sees it."""
    rows = []
    for m in pd.date_range("2012-02-01", "2019-12-01", freq="MS"):
        k = modis_per_month_after_2016 if m.year >= 2017 else 2
        rows += [("SNPP", m, "D")] * 6 + [("SNPP", m, "N")] * 10 + [("MODIS", m, "D")] * k + [("MODIS", m, "N")] * k
        if m.year == 2019:
            rows += [("NOAA20", m, "D")]
    df = pd.DataFrame(rows, columns=["source", "acq_date", "daynight"])
    return df.assign(satellite=df["source"].map({"MODIS": "Terra", "SNPP": "S-NPP", "NOAA20": "NOAA-20"}),
                     latitude=38.5, longitude=23.5)


def test_blind_test_gives_zero_error_when_the_ratio_holds():
    s = blind_test(made_up(2))["summary"]
    assert s["yearly_error_pct"] == 0 and s["fire_season_month_error_pct"] == 0 and s["square_year_error_pct"] == 0
    assert s["square_years"] == 3  # one square, 2017 to 2019, each with 192 real S-NPP hotspots


def test_blind_test_fits_on_2012_to_2016_only():
    b = blind_test(made_up(4))  # MODIS doubles from 2017, S-NPP does not: the prediction is twice the truth
    assert b["factors_2012_2016"] == {"fire season D": 3.0, "fire season N": 5.0, "rest D": 3.0, "rest N": 5.0}
    assert b["years"]["error_pct"].tolist() == pytest.approx([100.0, 100.0, 100.0])
