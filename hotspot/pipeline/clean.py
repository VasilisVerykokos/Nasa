# AI note: written with Claude Code (Claude Sonnet 5.5; per-row filter and checks by Claude Opus 5.5), under the team's direction and review.
"""Read the raw FIRMS files, give them shared column names, and apply the cleaning filters."""
import pandas as pd

from config import (COUNTRY, MODIS_MIN_CONFIDENCE, RAW_DIR, SATELLITE_NAMES, SOURCES,
                    VEGETATION_FIRE_TYPE, VIIRS_DROP_CONFIDENCE)

COLUMNS = ["acq_date", "acq_time", "latitude", "longitude", "source", "satellite", "daynight", "confidence", "frp"]


def clean(raw: pd.DataFrame) -> pd.DataFrame:
    """Raw rows -> vegetation fires only, no low confidence. The confidence rule is chosen per row."""
    modis = raw["instrument"] == "MODIS"
    low = (modis & (pd.to_numeric(raw["confidence"], errors="coerce") < MODIS_MIN_CONFIDENCE)) | \
          (~modis & (raw["confidence"] == VIIRS_DROP_CONFIDENCE))
    d = raw[(raw["type"] == VEGETATION_FIRE_TYPE) & ~low].copy()
    unknown = set(d["satellite"]) - set(SATELLITE_NAMES)
    if unknown:
        raise ValueError(f"Unknown satellite codes: {unknown}")
    d["satellite"] = d["satellite"].map(SATELLITE_NAMES)
    d["acq_date"] = pd.to_datetime(d["acq_date"])
    return d


def read_raw(folder: str, raw_dir=RAW_DIR) -> pd.DataFrame:
    """All yearly files of one source folder, unchanged."""
    files = sorted((raw_dir / folder).glob(f"*_{COUNTRY}.csv"))
    return pd.concat(pd.read_csv(f, dtype={"acq_time": str, "confidence": str}) for f in files)


def load_all(raw_dir=RAW_DIR) -> pd.DataFrame:
    """All years of all sources, cleaned, as one table."""
    parts = []
    for folder, source in SOURCES.items():
        d = clean(read_raw(folder, raw_dir))
        d["source"] = source
        parts.append(d[COLUMNS])
    return pd.concat(parts, ignore_index=True)


if __name__ == "__main__":
    for folder, source in SOURCES.items():
        raw = read_raw(folder)
        veg = raw[raw["type"] == VEGETATION_FIRE_TYPE]
        kept = len(clean(raw))
        print(f"{source:7} raw {len(raw):6,}  not vegetation -{len(raw) - len(veg):6,}  "
              f"low confidence -{len(veg) - kept:5,}  kept {kept:6,}")
