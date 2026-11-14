# AI note: written with Claude Code (Claude Opus 5.5), under the team's direction and review.
import sys
from datetime import date
from pathlib import Path

import traceback

import pandas as pd
import pytest
import requests

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import update_daily  # noqa: E402
from update_daily import clean_api, factory_cells, windows  # noqa: E402

KEY = "abc123secretkey"


def failed_status(url, timeout):
    r = requests.Response()
    r.status_code, r.url, r.reason = 403, url, "Forbidden"
    return r


def no_connection(url, timeout):
    raise requests.ConnectionError(f"Max retries exceeded with url: {url}")


@pytest.mark.parametrize("fake_get", [failed_status, no_connection])
def test_a_failed_request_never_shows_the_key(monkeypatch, fake_get):
    monkeypatch.setattr(update_daily.requests, "get", fake_get)
    with pytest.raises(ConnectionError) as e:
        update_daily.fetch(KEY, "VIIRS_NOAA20_NRT", date(2026, 11, 1), date(2026, 11, 3))
    shown = "".join(traceback.format_exception(e.value))  # what a crash would print, chained errors included
    assert KEY not in shown
    assert "VIIRS_NOAA20_NRT 2026-11-01 to 2026-11-03" in str(e.value)
    if fake_get is failed_status:
        assert "HTTP 403" in str(e.value)


def test_requests_cover_every_day_in_steps_of_at_most_five():
    assert windows(date(2026, 1, 1), date(2026, 1, 12)) == [(date(2026, 1, 1), 5), (date(2026, 1, 6), 5), (date(2026, 1, 11), 2)]
    assert windows(date(2026, 1, 1), date(2026, 1, 1)) == [(date(2026, 1, 1), 1)]
    assert windows(date(2026, 1, 2), date(2026, 1, 1)) == []


def test_the_mask_flags_a_cell_with_six_non_vegetation_detections_and_not_one_with_five():
    six = [(38.505, 23.505, 2)] * 6     # cell (3850, 2350)
    five = [(39.005, 24.005, 2)] * 5    # cell (3900, 2400)
    fires = [(40.005, 22.005, 0)] * 20  # vegetation fires never make a cell a factory
    raw = pd.DataFrame(six + five + fires, columns=["latitude", "longitude", "type"])
    assert factory_cells(raw) == {(3850, 2350)}


def api_rows(with_type: bool):
    rows = [(38.5051, 23.5059, "104", "n", 2), (38.9, 23.2, "1130", "l", 0), (38.9, 23.2, "2348", "h", 0), (38.9, 23.2, "0001", "n", 2)]
    d = pd.DataFrame(rows, columns=["latitude", "longitude", "acq_time", "confidence", "type"])
    d = d.assign(acq_date="2026-08-01", satellite="N20", instrument="VIIRS", daynight="N", frp=1.0)
    return d if with_type else d.drop(columns="type")


def test_nrt_rows_without_a_type_drop_factory_cells_and_low_confidence():
    kept = clean_api(api_rows(with_type=False), mask={(3850, 2350)})
    assert kept["acq_time"].tolist() == ["2348", "0001"]  # factory cell and low confidence gone; the rest kept
    assert kept["satellite"].tolist() == ["NOAA-20"] * 2


def test_sp_rows_use_their_own_type_and_the_time_is_padded():
    kept = clean_api(api_rows(with_type=True), mask=set())
    assert kept["acq_time"].tolist() == ["2348"]  # type 2 rows and the low-confidence row dropped
    kept = clean_api(api_rows(with_type=True).assign(type=0, confidence="n"), mask=set())
    assert kept["acq_time"].tolist() == ["0104", "1130", "2348", "0001"]
