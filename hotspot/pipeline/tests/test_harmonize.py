# AI note: written with Claude Code (Claude Opus 5.5), under the team's direction and review.
import sys
from pathlib import Path

import pandas as pd
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from factors import fit  # noqa: E402
from harmonize import harmonize  # noqa: E402

SUMMER, WINTER = "2015-08-01", "2015-02-01"  # inside and outside the fire season (June to September)


def hs(source, satellite, date, daynight, n=1):
    """n made-up cleaned hotspots."""
    return pd.DataFrame({"source": [source] * n, "satellite": satellite, "acq_date": pd.Timestamp(date),
                         "daynight": daynight})


def table(*parts):
    return pd.concat(parts, ignore_index=True)


def factor(f, name, season, dn):
    return f.set_index(["name", "season", "daynight"]).loc[(name, season, dn), "factor"]


def test_known_ratio_of_3_gives_factor_3_per_season_and_ignores_months_outside_the_window():
    df = table(
        # fire season: S-NPP / MODIS = 6/2 by day, 12/4 by night -> 3; Terra only 6/1 and 12/1
        hs("SNPP", "S-NPP", SUMMER, "D", 6), hs("SNPP", "S-NPP", SUMMER, "N", 12),
        hs("MODIS", "Terra", SUMMER, "D", 1), hs("MODIS", "Aqua", SUMMER, "D", 1),
        hs("MODIS", "Terra", SUMMER, "N", 1), hs("MODIS", "Aqua", SUMMER, "N", 3),
        # rest of the year: 8/2 by day -> 4, 20/2 by night -> 10; Terra only 8/1 and 20/1
        hs("SNPP", "S-NPP", WINTER, "D", 8), hs("SNPP", "S-NPP", WINTER, "N", 20),
        hs("MODIS", "Terra", WINTER, "D", 1), hs("MODIS", "Aqua", WINTER, "D", 1),
        hs("MODIS", "Terra", WINTER, "N", 1), hs("MODIS", "Aqua", WINTER, "N", 1),
        hs("MODIS", "Aqua", "2021-08-01", "D", 50),        # after the fit window: ignored by F1
        hs("SNPP", "S-NPP", "2020-08-01", "D", 1), hs("NOAA20", "NOAA-20", "2020-08-01", "N", 3))
    f = fit(df, min_detections=1)
    assert factor(f, "F1 Terra + Aqua", "fire season", "D") == 3 and factor(f, "F1 Terra + Aqua", "fire season", "N") == 3
    assert factor(f, "F1 Terra + Aqua", "rest", "D") == 4 and factor(f, "F1 Terra + Aqua", "rest", "N") == 10
    assert factor(f, "F1 Terra only", "fire season", "D") == 6 and factor(f, "F1 Terra only", "rest", "N") == 20
    assert factor(f, "F2", "all", "all") == 3  # 3 NOAA-20 / 1 S-NPP, one number for the whole year
    counts = f.set_index(["name", "season", "daynight"]).loc[("F1 Terra + Aqua", "fire season", "D"), ["numerator", "denominator"]]
    assert counts.tolist() == [6, 2]


def test_fit_window_is_a_setting_for_the_blind_test():
    df = table(hs("SNPP", "S-NPP", SUMMER, "D", 3), hs("MODIS", "Terra", SUMMER, "D", 1),
               hs("SNPP", "S-NPP", SUMMER, "N", 3), hs("MODIS", "Terra", SUMMER, "N", 1),
               hs("SNPP", "S-NPP", WINTER, "D", 1), hs("MODIS", "Terra", WINTER, "D", 1),
               hs("SNPP", "S-NPP", WINTER, "N", 1), hs("MODIS", "Terra", WINTER, "N", 1),
               hs("SNPP", "S-NPP", "2017-08-01", "D", 10), hs("MODIS", "Terra", "2017-08-01", "D", 1),
               hs("SNPP", "S-NPP", "2020-08-01", "D", 1), hs("NOAA20", "NOAA-20", "2020-08-01", "D", 1))
    assert factor(fit(df, fit_end="2016-12-31", min_detections=1), "F1 Terra + Aqua", "fire season", "D") == 3
    assert factor(fit(df, min_detections=1), "F1 Terra + Aqua", "fire season", "D") == 13 / 2


def test_no_modis_hotspots_in_the_window_stops_instead_of_dividing_by_zero():
    with pytest.raises(ValueError):
        fit(table(hs("SNPP", "S-NPP", SUMMER, "D"), hs("MODIS", "Aqua", "2021-08-01", "D")))  # MODIS only after the window


def _cells(fire_day_modis):
    """Fire season by day: `fire_day_modis` MODIS and 3x as many S-NPP. Every other cell: 100 MODIS, 5x S-NPP."""
    return table(hs("MODIS", "Terra", SUMMER, "D", fire_day_modis), hs("SNPP", "S-NPP", SUMMER, "D", 3 * fire_day_modis),
                 hs("MODIS", "Terra", WINTER, "D", 100), hs("SNPP", "S-NPP", WINTER, "D", 500),
                 hs("MODIS", "Terra", SUMMER, "N", 100), hs("SNPP", "S-NPP", SUMMER, "N", 500),
                 hs("MODIS", "Terra", WINTER, "N", 100), hs("SNPP", "S-NPP", WINTER, "N", 500),
                 hs("SNPP", "S-NPP", "2020-08-01", "D"), hs("NOAA20", "NOAA-20", "2020-08-01", "D"))


def test_cell_with_99_detections_falls_back_to_both_seasons_and_100_does_not():
    f = fit(_cells(99)).set_index(["name", "season", "daynight"])
    cell = f.loc[("F1 Terra + Aqua", "fire season", "D")]
    assert cell["factor"] == pytest.approx((297 + 500) / (99 + 100)) and cell["uses"].startswith("both seasons pooled")
    assert f.loc[("F1 Terra + Aqua", "rest", "D"), "uses"] == "own cell"  # the neighbour keeps its own ratio of 5

    cell = fit(_cells(100)).set_index(["name", "season", "daynight"]).loc[("F1 Terra + Aqua", "fire season", "D")]
    assert cell["factor"] == 3 and cell["uses"] == "own cell"


def test_day_or_night_still_under_the_minimum_pools_everything():
    df = table(hs("MODIS", "Terra", SUMMER, "D", 100), hs("SNPP", "S-NPP", SUMMER, "D", 300),
               hs("MODIS", "Terra", SUMMER, "N", 10), hs("SNPP", "S-NPP", SUMMER, "N", 100),   # 10 night in all
               hs("SNPP", "S-NPP", "2020-08-01", "D"), hs("NOAA20", "NOAA-20", "2020-08-01", "D"))
    cell = fit(df).set_index(["name", "season", "daynight"]).loc[("F1 Terra + Aqua", "fire season", "N")]
    assert cell["factor"] == pytest.approx(400 / 110) and cell["uses"].startswith("both seasons, day and night pooled")


FACTORS = pd.DataFrame({
    "name": ["F1 Terra + Aqua"] * 4 + ["F1 Terra only"] * 4 + ["F2"],
    "season": ["fire season", "fire season", "rest", "rest"] * 2 + ["all"],
    "daynight": ["D", "N", "D", "N", "D", "N", "D", "N", "all"],
    "factor": [3.0, 5.0, 4.0, 10.0, 8.0, 10.0, 9.0, 20.0, 1.1]})


@pytest.mark.parametrize("source, satellite, date, dn, weight", [
    # one hotspot in each of the four periods
    ("MODIS", "Terra", "2001-08-01", "D", 8 * 1.1),    # Terra only: F1 Terra only x F2
    ("MODIS", "Terra", "2001-08-01", "N", 10 * 1.1),
    ("MODIS", "Terra", "2001-02-01", "D", 9 * 1.1),
    ("MODIS", "Aqua", "2007-08-01", "N", 5 * 1.1),     # Terra + Aqua: F1 x F2
    ("MODIS", "Terra", "2007-08-01", "D", 3 * 1.1),
    ("MODIS", "Aqua", "2007-02-01", "N", 10 * 1.1),
    ("SNPP", "S-NPP", "2015-08-01", "D", 1.1),          # S-NPP: F2, whatever the season
    ("SNPP", "S-NPP", "2015-02-01", "N", 1.1),
    ("NOAA20", "NOAA-20", "2021-08-01", "N", 1.0),      # NOAA-20: the unit
    # the season edges
    ("MODIS", "Aqua", "2007-05-31", "D", 4 * 1.1), ("MODIS", "Aqua", "2007-06-01", "D", 3 * 1.1),
    ("MODIS", "Aqua", "2007-09-30", "D", 3 * 1.1), ("MODIS", "Aqua", "2007-10-01", "D", 4 * 1.1),
    # the switch days
    ("MODIS", "Terra", "2002-06-30", "D", 8 * 1.1), ("MODIS", "Aqua", "2002-07-04", "D", 3 * 1.1),
    ("MODIS", "Aqua", "2012-01-31", "D", 4 * 1.1), ("MODIS", "Aqua", "2012-02-01", "D", 0.0),
    ("SNPP", "S-NPP", "2012-02-01", "D", 1.1), ("SNPP", "S-NPP", "2018-12-31", "N", 1.1),
    ("SNPP", "S-NPP", "2019-01-01", "D", 0.0), ("NOAA20", "NOAA-20", "2018-12-31", "D", 0.0),
    ("NOAA20", "NOAA-20", "2019-01-01", "D", 1.0),
    # outside its sensor's period: weight 0
    ("MODIS", "Aqua", "2015-08-01", "D", 0.0), ("SNPP", "S-NPP", "2012-01-25", "D", 0.0),
    ("SNPP", "S-NPP", "2021-08-01", "D", 0.0), ("NOAA20", "NOAA-20", "2018-06-01", "D", 0.0),
])
def test_weight_follows_the_splice_table(source, satellite, date, dn, weight):
    w = harmonize(hs(source, satellite, date, dn), FACTORS)["weight"].iloc[0]
    assert w == pytest.approx(weight)


def test_rows_outside_their_period_are_kept_not_deleted():
    df = table(hs("MODIS", "Aqua", "2015-08-01", "D", 4), hs("SNPP", "S-NPP", "2015-08-01", "D", 2))
    assert len(harmonize(df, FACTORS)) == 6
