# AI note: written with Claude Code (Claude Opus 5.5), under the team's direction and review.
"""Proofs 1, 2, 4 and 5 (plan, section 5) as small data files for the website, a printed report, and the sanity
checks of plan section 9.7. The run stops before writing anything if a check fails."""
import json

import pandas as pd

from config import (BLIND_FIT_END, BLIND_TEST_END, BLIND_TEST_START, EFFIS_HA, F2_END, F2_START,
                    FIRE_SEASON_MONTHS, MIN_SQUARE_HOTSPOTS, NOAA20_START, PROOF_DIR, SNPP_START)
from factors import fit
from harmonize import f1, harmonize, noaa20_equivalent, yearly


def _year(d):
    return [d["acq_date"].dt.year.rename("year")]


def _month(d):
    return _year(d) + [d["acq_date"].dt.month.rename("month")]


def _square(d):  # the 1-degree square a hotspot falls in, named by its south-west corner
    return _year(d) + [(d["latitude"] // 1).astype(int).rename("lat"), (d["longitude"] // 1).astype(int).rename("lon")]


def blind_test(df: pd.DataFrame) -> dict:
    """Fit F1 on 2012-2016 only, predict S-NPP counts for 2017-2019 from MODIS alone, compare with what S-NPP saw."""
    blind = fit(df, fit_end=BLIND_FIT_END)
    test = df[(df["acq_date"] >= BLIND_TEST_START) & (df["acq_date"] <= BLIND_TEST_END)]
    modis, snpp = test[test["source"] == "MODIS"], test[test["source"] == "SNPP"]
    predicted = f1(modis, blind)

    def compare(by):
        t = pd.DataFrame({"predicted": predicted.groupby(by(modis)).sum(), "real": snpp.groupby(by(snpp)).size()})
        t = t.fillna(0)
        return t.assign(error_pct=100 * (t["predicted"] / t["real"] - 1))

    months = compare(_month)
    season = months[months.index.get_level_values("month").isin(FIRE_SEASON_MONTHS)]
    squares = compare(_square)
    squares = squares[squares["real"] >= MIN_SQUARE_HOTSPOTS]
    abs_err = lambda t: round(float(t["error_pct"].abs().mean()), 1)  # noqa: E731
    ta = blind[blind["name"] == "F1 Terra + Aqua"]
    return {"factors_2012_2016": {f"{s} {dn}": round(v, 3) for s, dn, v in zip(ta["season"], ta["daynight"], ta["factor"])},
            "years": compare(_year), "months": months,
            "squares": squares,
            "summary": {"yearly_error_pct": abs_err(compare(_year)),
                        "fire_season_month_error_pct": abs_err(season),
                        "fire_season_month_worst_pct": round(float(season["error_pct"].abs().max()), 1),
                        "square_year_error_pct": abs_err(squares), "square_years": len(squares)}}


def _total(df, eq, source, start, end):
    return eq[(df["source"] == source) & (df["acq_date"] >= start) & (df["acq_date"] <= end)].sum()


def _records(t: pd.DataFrame) -> list:
    return json.loads(t.reset_index().round(3).to_json(orient="records"))


if __name__ == "__main__":
    from clean import load_all

    df = load_all()
    factors = fit(df)
    h = harmonize(df, factors)
    eq = noaa20_equivalent(df, factors)
    years = yearly(h, factors)
    blind = blind_test(df)
    s = blind["summary"]
    month_h = h.groupby(_month(h))["weight"].sum()

    # Steps at the two joins, both sides in NOAA-20 units over the switch year
    join_2012 = 100 * (_total(df, eq, "MODIS", SNPP_START, "2012-12-31") / _total(df, eq, "SNPP", SNPP_START, "2012-12-31") - 1)
    join_2019 = 100 * (_total(df, eq, "SNPP", NOAA20_START, "2019-12-31") / _total(df, eq, "NOAA20", NOAA20_START, "2019-12-31") - 1)

    augusts = month_h.xs(8, level="month").sort_values(ascending=False)
    top_aug_viirs = set(augusts[augusts.index >= 2012].index[:2])

    checks = {
        "every year 2001-2025 has data": bool((years.loc[2001:2025, "harmonized"] > 0).all()) and len(years.loc[2001:2025]) == 25,
        f"2012 join step {join_2012:+.1f}% within the stated range ±{s['fire_season_month_error_pct']}%": abs(join_2012) <= s["fire_season_month_error_pct"],
        f"2019 join step {join_2019:+.1f}% within the stated range ±{s['fire_season_month_error_pct']}%": abs(join_2019) <= s["fire_season_month_error_pct"],
        "August 2021 and 2023 are the two highest Augusts since 2012": top_aug_viirs == {2021, 2023},
    }

    # Proof 4: harmonized years against EFFIS burned area
    effis = years[["harmonized"]].join(pd.Series(EFFIS_HA, name="effis_ha"), how="inner")
    # Proof 5: NOAA-20 against S-NPP x F2, month by month, over the F2 years
    both = df[(df["acq_date"] >= F2_START) & (df["acq_date"] <= F2_END) & df["source"].isin(["SNPP", "NOAA20"])]
    join5 = (both.assign(eq=eq).groupby(_month(both) + [both["source"]])["eq"].sum().unstack()
             [["NOAA20", "SNPP"]].set_axis(["noaa20", "snpp_x_f2"], axis=1))
    season5 = join5[join5.index.get_level_values("month").isin(FIRE_SEASON_MONTHS)]
    proof5_err = float((100 * (season5["snpp_x_f2"] / season5["noaa20"] - 1)).abs().mean())

    key = ["name", "season", "daynight"]
    change_2022 = 100 * (fit(df, fit_end="2022-12-31").set_index(key)["factor"] / factors.set_index(key)["factor"] - 1)

    print("Factors (fit Feb 2012 to Dec 2019; F2 2019 to 2025):")
    print(factors.to_string(index=False, float_format="%.3f"))
    print("\nPlan question 5. Change in F1 Terra + Aqua if fitted to Dec 2022 instead of Dec 2019 (%):",
          change_2022["F1 Terra + Aqua"].round(1).to_dict())
    print(f"\nProof 2, blind test. F1 fitted on 2012-2016 only: {blind['factors_2012_2016']}")
    print("Predicted against real S-NPP, by year:")
    print(blind["years"].round(1).to_string())
    print(f"Fire-season months ({FIRE_SEASON_MONTHS}), 2017-2019:")
    print(blind["months"][blind["months"].index.get_level_values("month").isin(FIRE_SEASON_MONTHS)].round(1).to_string())
    print(f"Summary: {s}")
    print(f"\nProof 4, harmonized hotspots against EFFIS burned area, {effis.index.min()}-{effis.index.max()}: "
          f"rank correlation (Spearman) {effis['harmonized'].corr(effis['effis_ha'], method='spearman'):.2f}, "
          f"Pearson {effis['harmonized'].corr(effis['effis_ha']):.2f}. "
          f"Top year by hotspots: {effis['harmonized'].idxmax()}, by burned area: {effis['effis_ha'].idxmax()}")
    print(f"\nProof 5, S-NPP x F2 against NOAA-20, fire-season months 2019-2025: mean miss {proof5_err:.1f}% "
          f"(F2 was fitted on these years, so this shows the month-to-month spread, not a blind error)")
    print("\nAugusts, harmonized, highest first:", augusts.head(6).round(0).astype(int).to_dict())
    print("\nSanity checks (plan, section 9.7):")
    for name, ok in checks.items():
        print(f"  {'PASS' if ok else 'FAIL'}  {name}")
    if not all(checks.values()):
        raise SystemExit("A sanity check failed. No proof files were written.")

    PROOF_DIR.mkdir(parents=True, exist_ok=True)
    out = {
        "factors.json": json.loads(factors.round(4).to_json(orient="records")),
        "proof1_yearly.json": _records(years.round(1)),
        "proof2_blind_test.json": {"summary": s, "factors_2012_2016": blind["factors_2012_2016"],
                                   "fire_season_months": FIRE_SEASON_MONTHS,
                                   **{k: _records(blind[k]) for k in ("years", "months", "squares")}},
        "proof4_effis.json": _records(effis.rename_axis("year")),
        "proof5_join.json": _records(join5),
        # The finding (must-have 9): every August of the record, with the blind-test ranges to put on the estimates
        "finding_augusts.json": {"fire_season_month_error_pct": s["fire_season_month_error_pct"],
                                 "yearly_error_pct": s["yearly_error_pct"],
                                 "augusts": _records(month_h.xs(8, level="month").round(1).rename("harmonized"))},
    }
    for name, data in out.items():
        (PROOF_DIR / name).write_text(json.dumps(data, indent=1), encoding="utf-8")
    print(f"\nWrote {', '.join(out)} to {PROOF_DIR}")
