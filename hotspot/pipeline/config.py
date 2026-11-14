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

MIN_DETECTIONS = 100  # plan, section 4, step 3: an F1 cell with fewer MODIS detections falls back to a pooled factor

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

# The current year (plan, section 4, step 6, and 9.6): NOAA-20 from the FIRMS Area API, from the day after the yearly files end
API_START = "2026-01-01"
API_SOURCES = {"SP": "VIIRS_NOAA20_SP", "NRT": "VIIRS_NOAA20_NRT"}  # standard where NASA has it, near-real-time after
API_BOX = "19.6,34.8,28.3,41.8"  # west,south,east,north: the rectangle around Greece; rows outside the outline are cut
API_DAYS = 5                     # the most days the Area API returns per request
CLIP_KM = 3                      # the outline is widened by 3 km: it is slightly tighter than FIRMS's own Greece files (Person B, Sat 18:40)
MASK_CELL_DEG = 0.01             # factory mask for NRT rows, which have no type column (GFED5NRT rule):
MASK_MAX_OTHER = 5               # a cell with more than 5 non-vegetation detections in the yearly files is a permanent heat source

PROOF_DIR =Path(__file__).resolve().parents[1] / "web" / "public" / "proof"

# EFFIS yearly burned area for Greece, ha (verified-facts.md, section 9.5; fires of about 30 ha or larger)
EFFIS_HA = {2006: 16294, 2007: 271715, 2008: 24988, 2009: 42807, 2010: 6472, 2011: 35713, 2012: 52487,
            2013: 19762, 2014: 14815, 2015: 11613, 2016: 31707, 2017: 20041, 2018: 12037, 2019: 10736,
            2020: 14915, 2021: 130744, 2022: 22480, 2023: 174773, 2024: 41948, 2025: 47819}

# Proof 7, the grid test (plan, sections 4 and 5): cell sizes in degrees, about 1, 5.5, 11 and 28 km north to south
GRID_CELLS_DEG = [0.01, 0.05, 0.1, 0.25]

# Proof 6, near-simultaneous Aqua and S-NPP passes (plan, section 5)
COINCIDENCE_MINUTES = [5, 10]  # largest time difference between an Aqua and an S-NPP hotspot of the same pass
COINCIDENCE_CELL_DEG = 0.1     # common cells, well above the MODIS pixel size
PASS_GAP_MINUTES = 30          # a longer gap between hotspots starts a new pass; adjacent orbits are about 100 minutes apart
