<!-- AI note: drafted with Claude Code (Claude Sonnet 5.5) for Person B on 15 Nov 2026, from pipeline/export_dataset.py and its output. The team checks and owns the text. -->

# HOTSPOT harmonized dataset for Greece, November 2000 to December 2025

Every vegetation-fire hotspot that NASA FIRMS published for Greece from 1 November 2000 to 31 December 2025, from MODIS (Terra, Aqua) and VIIRS (S-NPP, NOAA-20), each with a **weight** that puts all sensors on one scale. Add up the weights of any set of hotspots and the sum is comparable across the whole 26 years, whichever sensor saw them.

- **Unit:** the NOAA-20-equivalent hotspot. One NOAA-20 hotspot counts 1.
- **Made by:** `pipeline/export_dataset.py` in the repository. It uses the project's own cleaning step and weights, so the file matches the website's database for 2000 to 2025.
- **Source data:** NASA FIRMS yearly country files for Greece (standard, science-quality data): MODIS Collection 6.1 (1 km), VIIRS S-NPP and NOAA-20 (375 m). The year 2026 is not in this file; the website adds it from the FIRMS Area API and marks the newest months as provisional.
- **Method and proofs:** the "Method and proof" page of the website, and `README.md`.

## Files

| File | Rows | What it is |
|---|---|---|
| `hotspot_greece_harmonized_2000-2025.csv` | 153,804 | One row per hotspot, with its weight |
| `hotspot_greece_factors.csv` | 9 | The measured conversion factors the weights come from |

## Columns of the hotspot file

| Column | Meaning |
|---|---|
| `acq_date` | Date of the satellite pass, `YYYY-MM-DD`, in UTC as given by FIRMS |
| `acq_time` | Time of the pass, `HHMM` in UTC, kept as text so leading zeros stay |
| `latitude`, `longitude` | Centre of the flagged pixel, decimal degrees (WGS 84). It is the pixel's centre, not the exact place of the fire |
| `source` | The instrument family that gave the weight: `MODIS`, `SNPP` (VIIRS on S-NPP) or `NOAA20` (VIIRS on NOAA-20) |
| `satellite` | `Terra`, `Aqua`, `S-NPP` or `NOAA-20` |
| `daynight` | `D` for a daytime pass, `N` for a night-time pass |
| `confidence` | NASA's own rating, unchanged. MODIS: a number from 30 to 100 (percent). VIIRS: `n` (nominal) or `h` (high) |
| `frp` | Fire radiative power of the pixel, in megawatts, as given by FIRMS. Treat it with care: VIIRS saturates over intense fires |
| `weight` | The harmonization weight, in NOAA-20-equivalent hotspots. See below |
| `country` | Always `Greece` |

## How the weight works

Each sensor is used only in the period where it is the record's instrument. In every other period its rows stay in the file with `weight = 0`, so you can still see them, but a sum of `weight` never counts the same fire twice.

| Period | Instrument used | `weight` |
|---|---|---|
| 1 Nov 2000 to 31 Jan 2012 | MODIS (Terra only until 30 June 2002, then Terra and Aqua) | the MODIS-to-VIIRS factor × 1.04, between about 2.7 and 12 depending on day or night, season and Terra only or Terra + Aqua |
| 1 Feb 2012 to 31 Dec 2018 | VIIRS S-NPP | 1.04 |
| 1 Jan 2019 to 31 Dec 2025 | VIIRS NOAA-20 | 1 |

Rows with `weight = 0`: MODIS from February 2012 on, S-NPP before February 2012 and from 2019 on, NOAA-20 before 2019. They exist because the pipeline needs them for the proof charts.

**Cleaning applied before weighting** (nothing else was removed):

- Only vegetation fires (FIRMS `type = 0`). Volcanoes, other static land sources and offshore detections are removed.
- Low-confidence detections are removed: MODIS below 30, VIIRS `low`.

**Estimates and range.** Weights before February 2012 convert MODIS measurements to VIIRS units, so those months are estimates. The blind test (fit on 2012 to 2016, predict 2017 to 2019) missed fire-season months (June to September) by 26.3% on average. Use about ±26% as the range on single months before 2012.

## Columns of the factor file

| Column | Meaning |
|---|---|
| `name` | `F1 Terra + Aqua`, `F1 Terra only` (the MODIS-to-S-NPP factor) or `F2` (the S-NPP-to-NOAA-20 link) |
| `season` | `fire season` (June to September), `rest` (the other months), or `all` for F2 |
| `daynight` | `D`, `N`, or `all` for F2 |
| `numerator`, `denominator` | The hotspot counts the factor is the ratio of: S-NPP (or NOAA-20 for F2) over MODIS (or S-NPP for F2) |
| `factor` | `numerator / denominator` |
| `uses` | `own cell`, or a note when a cell had fewer than 100 MODIS detections and a pooled factor was used instead |
| `start`, `end` | The years the factor was fitted on: 2012-02-01 to 2019-12-31 for F1, 2019-01-01 to 2025-12-31 for F2 |

## Limits

- Values before 2012 are estimates. Small or cool fires that MODIS never saw cannot be recovered. The weight corrects totals, not single fires.
- The factor is an average over fire types. A small area varies more than the whole country (26.3% blind-test error for single 1° squares).
- A hotspot is the centre of a flagged pixel, not burned area. NASA does not recommend hotspots for estimating burned area.
- Clouds and thick smoke hide fires from every sensor.

## Citation and licence

Hotspots come from NASA FIRMS, which should be cited as the source (https://firms.modaps.eosdis.nasa.gov). The harmonization weights and the code are by the HOTSPOT team, released under Apache-2.0. See `REFERENCES.md` for every dataset and paper used.
