# AI note: written with Claude Code (Claude Sonnet 5.5), under the team's direction and review.
"""Write the open dataset: every cleaned Greek hotspot of the yearly NASA files (Nov 2000 to Dec 2025) with its weight,
and the factor table. Uses the project's own cleaning and weighting, so the file matches the website's database.

Run from the hotspot folder:  py -3.13 pipeline/export_dataset.py
Writes pipeline/data/release/hotspot_greece_harmonized_2000-2025.csv and hotspot_greece_factors.csv (ignored by Git;
they are attached to a GitHub release)."""
from pathlib import Path

from clean import load_all
from config import COUNTRY
from factors import fit
from harmonize import harmonize

OUT = Path(__file__).resolve().parent / "data" / "release"
COLS = ["acq_date", "acq_time", "latitude", "longitude", "source", "satellite", "daynight", "confidence", "frp", "weight"]


def build():
    df = load_all()
    factors = fit(df)
    h = harmonize(df, factors).sort_values(["acq_date", "acq_time", "source"], kind="stable")
    h = h.assign(country=COUNTRY, acq_date=h["acq_date"].dt.strftime("%Y-%m-%d"), weight=h["weight"].round(4))
    return h[COLS + ["country"]], factors


if __name__ == "__main__":
    h, factors = build()
    OUT.mkdir(parents=True, exist_ok=True)
    h.to_csv(OUT / "hotspot_greece_harmonized_2000-2025.csv", index=False)
    factors.to_csv(OUT / "hotspot_greece_factors.csv", index=False)
    print(f"{len(h):,} hotspots, {h['acq_date'].min()} to {h['acq_date'].max()}; weight 0 rows: {(h['weight'] == 0).sum():,}")
    print(h.groupby("source")["weight"].agg(["size", "sum"]).round(0).to_string())
    print(f"written to {OUT}")
