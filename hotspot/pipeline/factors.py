# AI note: written with Claude Code (Claude Opus 5.5), under the team's direction and review.
"""F1 (S-NPP / MODIS) and F2 (NOAA-20 / S-NPP): one factor per country, from counts over shared months (plan, section 4).
F1 is split by season (fire season against the rest of the year) and by day/night; F2 is one number."""
import pandas as pd

from config import F2_END, F2_START, FIRE_SEASON_MONTHS, FIT_END, FIT_START

SEASONS = ["fire season", "rest"]


def season(d: pd.DataFrame) -> pd.Series:
    """'fire season' for the months in FIRE_SEASON_MONTHS, otherwise 'rest'."""
    return d["acq_date"].dt.month.isin(FIRE_SEASON_MONTHS).map({True: SEASONS[0], False: SEASONS[1]}).rename("season")


def _count(d: pd.DataFrame, start: str, end: str) -> pd.Series:
    """Hotspots per season and day/night between two dates, both included."""
    d = d[(d["acq_date"] >= start) & (d["acq_date"] <= end)]
    every = pd.MultiIndex.from_product([SEASONS, ["D", "N"]], names=["season", "daynight"])
    return d.groupby([season(d), d["daynight"]]).size().reindex(every, fill_value=0)


def _ratio(name, season_, daynight, top, bottom, start, end):
    if bottom == 0:
        raise ValueError(f"{name} {season_} {daynight}: no denominator hotspots between {start} and {end}")
    return {"name": name, "season": season_, "daynight": daynight, "numerator": int(top), "denominator": int(bottom),
            "factor": top / bottom, "start": start, "end": end}


def fit(df: pd.DataFrame, fit_start=FIT_START, fit_end=FIT_END, f2_start=F2_START, f2_end=F2_END) -> pd.DataFrame:
    """Cleaned table -> one row per factor with the counts it came from. Satellites are never added together,
    except Terra + Aqua, which are one MODIS record (plan, section 4, step 2)."""
    modis = df[df["source"] == "MODIS"]
    snpp = df[df["source"] == "SNPP"]
    snpp_fit = _count(snpp, fit_start, fit_end)
    rows = []
    for name, m in [("F1 Terra + Aqua", modis), ("F1 Terra only", modis[modis["satellite"] == "Terra"])]:
        m_fit = _count(m, fit_start, fit_end)
        rows += [_ratio(name, s, dn, snpp_fit[s, dn], m_fit[s, dn], fit_start, fit_end) for s in SEASONS for dn in "DN"]
    n20 = _count(df[df["source"] == "NOAA20"], f2_start, f2_end).sum()
    rows.append(_ratio("F2", "all", "all", n20, _count(snpp, f2_start, f2_end).sum(), f2_start, f2_end))
    return pd.DataFrame(rows)
