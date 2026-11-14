# AI note: written with Claude Code (Claude Sonnet 5.5; last two tests by Claude Opus 5.5), under the team's direction and review.
import sys
from pathlib import Path

import pandas as pd
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from clean import clean  # noqa: E402


def rows(instrument, satellite, confs, types):
    return pd.DataFrame({"instrument": instrument, "satellite": satellite, "confidence": confs, "type": types,
                         "acq_date": "2021-08-05", "acq_time": "0100", "latitude": 38.9, "longitude": 23.3,
                         "daynight": "D", "frp": 1.0})


def test_modis_keeps_only_vegetation_fires_at_or_above_30():
    d = clean(rows("MODIS", "Terra", ["29", "30", "80", "80"], [0, 0, 0, 2]))
    assert list(d["confidence"]) == ["30", "80"]  # 29 is low, the type-2 row is a static source


def test_viirs_drops_low_confidence_and_non_vegetation():
    d = clean(rows("VIIRS", "N20", ["l", "n", "h", "n"], [0, 0, 0, 3]))
    assert list(d["confidence"]) == ["n", "h"]


def test_mixed_table_uses_each_rows_own_confidence_rule():
    d = clean(pd.concat([rows("VIIRS", "N", ["l", "n"], [0, 0]), rows("MODIS", "Terra", ["29", "30"], [0, 0])]))
    assert list(d["confidence"]) == ["n", "30"]


def test_unknown_satellite_code_stops_the_run():
    with pytest.raises(ValueError):
        clean(rows("VIIRS", "N21", ["n"], [0]))


def test_satellite_names_are_unified():
    assert clean(rows("MODIS", "Aqua", ["50"], [0]))["satellite"].iloc[0] == "Aqua"
    assert clean(rows("VIIRS", "N", ["n"], [0]))["satellite"].iloc[0] == "S-NPP"
    assert clean(rows("VIIRS", "N20", ["n"], [0]))["satellite"].iloc[0] == "NOAA-20"
