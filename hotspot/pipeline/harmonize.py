# AI note: written with Claude Code (Claude Opus 5.5), under the team's direction and review.
"""Give every cleaned hotspot a NOAA-20-equivalent weight, using the splice table (step 5 of the method)."""
import pandas as pd

from config import AQUA_START, NOAA20_START, SNPP_START
from factors import season


def f1(df: pd.DataFrame, factors: pd.DataFrame) -> pd.Series:
    """The F1 for each row's season and day/night: Terra only before Aqua's start, Terra + Aqua after."""
    f = factors.set_index(["name", "season", "daynight"])["factor"]
    key = pd.MultiIndex.from_arrays([season(df), df["daynight"]])
    pick = lambda name: pd.Series(f[name].reindex(key).to_numpy(), index=df.index)  # noqa: E731
    return pick("F1 Terra + Aqua").where(df["acq_date"] >= AQUA_START, pick("F1 Terra only"))


def noaa20_equivalent(df: pd.DataFrame, factors: pd.DataFrame) -> pd.Series:
    """What one hotspot is worth in NOAA-20 units, ignoring whether its sensor is the one in use on that date."""
    f2 = factors.set_index("name").loc["F2", "factor"]
    src = df["source"]
    eq = pd.Series(1.0, index=df.index)  # NOAA-20 is the unit
    eq[src == "SNPP"] = f2
    eq[src == "MODIS"] = (f1(df, factors) * f2)[src == "MODIS"]
    return eq


def harmonize(df: pd.DataFrame, factors: pd.DataFrame) -> pd.DataFrame:
    """Same table plus `weight`. Rows outside their sensor's period keep weight 0 (kept for the proof charts)."""
    t, src = df["acq_date"], df["source"]
    in_period = (((src == "MODIS") & (t < SNPP_START))
                 | ((src == "SNPP") & (t >= SNPP_START) & (t < NOAA20_START))
                 | ((src == "NOAA20") & (t >= NOAA20_START)))
    return df.assign(weight=noaa20_equivalent(df, factors).where(in_period, 0.0))


def yearly(h: pd.DataFrame, factors: pd.DataFrame) -> pd.DataFrame:
    """Harmonized table -> per year: raw counts per sensor, their naive sum, each older sensor in NOAA-20 units,
    and the harmonized total (proof 1)."""
    h = h.assign(as_noaa20=noaa20_equivalent(h, factors))
    year = h["acq_date"].dt.year.rename("year")
    by = h.groupby([year, "source"])
    t = by.size().unstack().reindex(columns=["MODIS", "SNPP", "NOAA20"]).fillna(0).astype(int)
    t["naive sum"] = t.sum(axis=1)
    t = t.join(by["as_noaa20"].sum().unstack()[["MODIS", "SNPP"]].add_suffix(" in N20 units"))
    t["harmonized"] = h.groupby(year)["weight"].sum()
    return t


if __name__ == "__main__":
    from clean import load_all
    from factors import fit

    df = load_all()
    factors = fit(df)
    print(factors.to_string(index=False, float_format="%.3f"))
    ta = factors[factors["name"] == "F1 Terra + Aqua"]
    print(f"\nF1 pooled over seasons and day+night (for comparison only, not used): "
          f"{ta['numerator'].sum()} / {ta['denominator'].sum()} = {ta['numerator'].sum() / ta['denominator'].sum():.3f}")
    print("\nYearly totals. Raw counts per sensor, naive sum of all three, each older sensor converted to NOAA-20 units,")
    print("and the harmonized record (sum of weights):")
    print(yearly(harmonize(df, factors), factors).round(0).astype("Int64").to_string())
