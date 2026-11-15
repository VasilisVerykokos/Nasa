<!-- AI note: written with Claude Code (Claude Sonnet 5.5), 15 Nov 2026, from the code in pipeline/ and MASTER-PLAN.md section 4, under the team's direction and review. -->

# The HOTSPOT pipeline, and why each step exists

HOTSPOT turns three NASA fire records for Greece into one record that can be compared across 26 years. This page walks through the pipeline in order. Every step says what it does and why we chose it. All settings live in `pipeline/config.py`.

## The problem in one paragraph

MODIS (Terra and Aqua, since 2000) sees squares about 1 km wide. VIIRS (S-NPP since 2012, NOAA-20 since 2018) sees squares of 375 m. VIIRS reports more hotspots for the same fires, and it also notices small fires MODIS never sees. If you simply merge the lists, the yearly count jumps in 2012 although nothing changed on the ground. The goal is that "the sensor of origin no longer matters".

## The steps

### 1. Read the raw files (`clean.py`)
We read NASA FIRMS yearly files for Greece: MODIS 2000 to 2025, S-NPP 2012 to 2025, NOAA-20 2018 to 2025.
**Why:** these are NASA's own standard files, fixed once published, so anyone can rebuild our numbers from the same inputs.

### 2. Clean (`clean.py`)
- Keep only `type = 0` (vegetation fires). This removes volcanoes, factories and offshore flares.
- Drop low-confidence rows: VIIRS `l`, and MODIS confidence below 30 (the official MODIS "low" class).

**Why:** VIIRS sees about ten times more fixed heat sources than MODIS (16.9% of S-NPP rows against 1.6% of MODIS are not vegetation fires). Without the filter the MODIS-to-VIIRS factor would come out too large. We keep agricultural burns because the challenge counts them as burning activity.

### 3. Never add satellites together (design rule)
We use one VIIRS satellite at a time, but we add Terra and Aqua.
**Why:** the VIIRS satellites fly the same orbit minutes apart and see the same fire, so adding them counts it two or three times. Terra and Aqua pass at different hours, so each pass is a genuinely new look. What must stay constant over 26 years is the number of looks per day. Before July 2002 only Terra flew, so that period needs its own factors.

### 4. Measure F1, the MODIS-to-VIIRS factor (`factors.py`)
F1 = S-NPP hotspots ÷ MODIS hotspots, over February 2012 to December 2019. We measure it separately for:
- day and night,
- the fire season (June to September) and the rest of the year,
- "Terra + Aqua" and "Terra only".

That is 8 numbers. A cell with fewer than 100 MODIS detections falls back to a pooled factor.

**Why these choices:**
- *The window* starts when VIIRS starts and stops before Terra's orbit began to drift (Feb 2020) and Aqua's (Mar 2021). Later MODIS data is not comparable.
- *Day and night* differ a lot (roughly 3 by day and 5.5 by night in the first quick check), so one number would be wrong for both.
- *Season split*: MODIS misses small agricultural burns more often than large summer forest fires, and the two happen at different times of year. We tested it and it won the blind test (fire-season error 37.4% down to 26.3%), so the team adopted it. Our rule was: keep a refinement only if it wins the blind test.
- *Why a factor and not a common grid*: we tested putting both sensors on a grid (`proof7_grid.py`). The ratio only falls from 3.4 to about 2.8, whatever the cell size. The rest is sensitivity (MODIS never sees small fires), which only a factor measured on the shared years can cover.

F1 holds the difference in pixel size, sensitivity and overpass time together. It is a factor for the whole MODIS record against VIIRS, not a pure "resolution" correction.

### 5. Measure F2, the S-NPP-to-NOAA-20 link (`factors.py`)
F2 = NOAA-20 ÷ S-NPP over the full shared years 2019 to 2025, one number.
**Why:** S-NPP stopped on 2 November 2026, so the record has to end on NOAA-20, which keeps flying. NOAA-20 is therefore the unit of the whole record.

### 6. Splice and weight (`harmonize.py`)
Every hotspot gets a `weight`, the number of NOAA-20 hotspots it is worth:

| Period | Source | Weight |
|---|---|---|
| Nov 2000 to Jun 2002 | MODIS, Terra only | F1 (Terra only) × F2 |
| Jul 2002 to Jan 2012 | MODIS, Terra + Aqua | F1 × F2 |
| Feb 2012 to Dec 2018 | VIIRS S-NPP | F2 |
| Jan 2019 onward | VIIRS NOAA-20 | 1 |

A month's value is the sum of the weights inside the area. Rows outside their sensor's period keep weight 0 rather than being deleted.
**Why:** one sensor per period keeps the number of looks constant. Keeping weight-0 rows means the proof charts can still compare sensors in their overlap years, and every number can be traced back to NASA's raw detections.

### 7. Check the method (`validate.py`)
- **Proof 1:** yearly totals, plain merge against harmonized. The plain merge jumps in 2012, the harmonized line does not.
- **Proof 2, the blind test:** refit F1 on 2012 to 2016, predict 2017 to 2019 from MODIS alone, and compare with what VIIRS really counted. Fire-season months miss by about 26%, whole years by about 7%.
- **Proof 4:** yearly hotspots against the official EFFIS burned area, 2006 to 2025, an independent record.
- **Proof 5:** NOAA-20 against S-NPP monthly, to show the last join is clean.
- Sanity checks stop the run before anything is written if a result is far from what we expect.

**Why:** a method that scales old counts needs evidence. The blind test gives a measured error from a real prediction, which is a stronger claim than a guess. That error becomes the "±X%" range on every estimated month. After the test we refit on the full window for the final record.

More proofs: `proof3_fires.py` (two real fires against Copernicus maps), `proof6_coincident.py` (what F1 is made of, using near-simultaneous Aqua and S-NPP passes), `proof7_grid.py` (why a grid fails).

### 8. Load the database (`load_db.py`)
Empties and reloads the hotspots, factors, coverage and meta tables in Supabase in one transaction.
**Why:** one transaction means the website never sees a half-loaded database, and running it again gives the same result.

### 9. Add the current year (`update_daily.py`)
Yearly files stop at 2025. 2026 comes from the FIRMS Area API, NOAA-20 only, 5 days per request. Standard data is used where NASA has it, near-real-time after that.
- Near-real-time rows have no `type` column, so a factory mask stands in: any 0.01° cell with more than 5 non-vegetation detections in the archive is a permanent heat source (the published GFED5NRT rule).
- Rows are cut to the Greece outline widened by 3 km, never into a neighbouring country.
- It replaces every row from 1 Jan 2026 in one transaction, so running it twice is safe and nothing changes if a download fails. NRT days turn into standard days by themselves.

**Why:** NOAA-20 has weight 1, so 2026 needs no conversion. The 3 km widening exists because the Natural Earth outline is slightly tighter than FIRMS's own Greece files: 1.5% of 2025 hotspots fell just outside it, which would have made 2026 look about 1.5% low. The newest months are marked provisional until NASA releases standard data (about 5 months later).

### 10. Publish the dataset (`export_dataset.py`, `check_db.py`)
`export_dataset.py` writes the cleaned, weighted hotspots (2000 to 2025) and the factor table as CSV for a GitHub release, described column by column in `DATASET.md`. `check_db.py` calls the public `calendar()` function the way the website does and checks the answers.
**Why:** the data is only useful to others if they can download it and cite a fixed version, and the check proves the live address works with the public key alone.

## Run order

```
py -3.13 pipeline/clean.py            # cleaning counts
py -3.13 pipeline/harmonize.py        # factors and yearly totals
py -3.13 pipeline/validate.py         # proofs 1, 2, 4, 5 and sanity checks
py -3.13 pipeline/load_db.py          # database, to 2025
py -3.13 pipeline/update_daily.py     # current year (run daily)
py -3.13 pipeline/check_db.py         # test the public calendar
py -3.13 pipeline/export_dataset.py   # release files
```

Run these from the `hotspot` folder. The README has the full rebuild steps.

## Limits we state openly
- Values before 2012 are estimates: the factor corrects the average, not each fire.
- The factor is an average over fire types, so an area dominated by one type is corrected less exactly.
- Small areas are less certain than the whole country.
- Hotspots are not burned area, and a hotspot is the centre of a flagged pixel, not the fire's exact position.
- Clouds and thick smoke hide fires from every sensor, and short satellite outages are not corrected.
