# AI note: written with Claude Code (Claude Sonnet 5.5), under the team's direction and review.
"""All pipeline settings. Nothing is hard-coded in the other modules (plan, section 9.2)."""
from pathlib import Path

RAW_DIR = Path(__file__).resolve().parent / "data" / "raw"
COUNTRY = "Greece"

# Folder name -> (short source name, satellite name). MODIS has Terra and Aqua in one file.
SOURCES = {"modis": "MODIS", "viirs-snpp": "SNPP", "viirs-jpss1": "NOAA20"}
SATELLITE_NAMES = {"T": "Terra", "A": "Aqua", "Terra": "Terra", "Aqua": "Aqua", "N": "S-NPP", "N20": "NOAA-20"}

# Cleaning (plan, section 4, step 1)
VEGETATION_FIRE_TYPE = 0
MODIS_MIN_CONFIDENCE = 30  # official "low" class is below 30 (MODIS C6/C6.1 user's guide, table 11)
VIIRS_DROP_CONFIDENCE = "l"

# Factor fit window (plan, section 4, step 3): MODIS orbits drift after Feb 2020 (Terra) and Mar 2021 (Aqua)
FIT_START, FIT_END = "2012-02-01", "2019-12-31"
AQUA_START = "2002-07-01"  # Aqua's first data is 4 Jul 2002; before this MODIS means Terra alone

# S-NPP to NOAA-20 link (plan, section 4, step 4): the full shared years
F2_START, F2_END = "2019-01-01", "2025-12-31"

# Splice dates (plan, section 4, step 5)
SNPP_START = "2012-02-01"
NOAA20_START = "2019-01-01"

# Blind test (plan, section 5, proof 2): refit F1 on 2012-2016, predict 2017-2019 from MODIS alone
BLIND_FIT_END = "2016-12-31"
BLIND_TEST_START, BLIND_TEST_END = "2017-01-01", "2019-12-31"
FIRE_SEASON_MONTHS = [6, 7, 8, 9]  # our choice: June to September. F1 has its own value for these months, and the range shown is the error on them
MIN_SQUARE_HOTSPOTS = 100  # a 1-degree square enters the small-area error only for years with this many real S-NPP hotspots

PROOF_DIR = Path(__file__).resolve().parents[1] / "web" / "public" / "proof"

# EFFIS yearly burned area for Greece, ha (verified-facts.md, section 9.5; fires of about 30 ha or larger)
EFFIS_HA = {2006: 16294, 2007: 271715, 2008: 24988, 2009: 42807, 2010: 6472, 2011: 35713, 2012: 52487,
            2013: 19762, 2014: 14815, 2015: 11613, 2016: 31707, 2017: 20041, 2018: 12037, 2019: 10736,
            2020: 14915, 2021: 130744, 2022: 22480, 2023: 174773, 2024: 41948, 2025: 47819}
