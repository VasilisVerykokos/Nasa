<!-- AI note: written with Claude Code (Claude Opus 5.5) on 15 Nov 2026, under the team's direction and review. Every number comes from a file in hotspot/web/public/proof/. -->

# HOTSPOT

**HOTSPOT joins NASA's two satellite fire records, MODIS (from November 2000) and VIIRS (from 2012), into one consistent record for Greece, on a single scale. Pick any area and a date range and see how much it burned, month by month, against its normal year.**

- Live: **https://hotspots.gr/**
- How it works and the proofs: **https://hotspots.gr/#method**

Entry for the NASA Space Apps Challenge 2026, challenge *Harmonization of MODIS and VIIRS Hot Spots*. HOTSPOT stands for *Harmonized Observations of Thermal Sensors for Pyro-Occurrence Trends*.

## Why now

S-NPP, the first VIIRS satellite, stopped delivering fire data on 2 November 2026. Terra and Aqua, which carry MODIS, are planned to stop in 2027 (NASA LAADS, "MODIS to VIIRS transition"), and their orbits have been drifting since 2020 and 2021. Every long fire record that relies on MODIS must now be joined to VIIRS or it stops. HOTSPOT makes that join, measures how well it works, and ends on NOAA-20, which still flies.

## How it works

VIIRS sees the ground in 375 m squares, MODIS in 1 km squares, and VIIRS also notices small fires MODIS never sees. Simply adding the two records fakes a jump in 2012. So every hotspot gets a **weight** that turns it into a "NOAA-20-equivalent hotspot", and a month's value is the sum of the weights inside the area.

1. **Clean.** Keep vegetation fires (`type = 0`, which includes agricultural burns); drop low-confidence detections and fixed heat sources such as factories.
2. **One instrument at a time.** The VIIRS satellites fly the same orbit minutes apart, so adding them would count one fire twice. Terra and Aqua pass at different hours, so both are kept.
3. **Measure the factor F1** (VIIRS S-NPP hotspots per MODIS hotspot) from February 2012 to December 2019, when both flew and MODIS still kept its usual times. Separately for day and night, for the fire season (June to September) and the rest of the year, and for the Terra-only years before July 2002.
4. **Measure F2** (NOAA-20 per S-NPP) on 2019 to 2025.
5. **Splice:**

| Period | Source | Weight per hotspot |
|---|---|---|
| Nov 2000 to Jun 2002 | MODIS, Terra only | F1 (Terra only) × F2 |
| Jul 2002 to Jan 2012 | MODIS, Terra + Aqua | F1 (Terra + Aqua) × F2 |
| Feb 2012 to Dec 2018 | VIIRS S-NPP | F2 |
| Jan 2019 to today | VIIRS NOAA-20 | 1 |

The factors, as measured (`factors.json`):

| F1 | Fire season, day | Fire season, night | Rest of year, day | Rest of year, night |
|---|---|---|---|---|
| Terra + Aqua | 2.631 | 4.957 | 3.363 | 11.517 |
| Terra only | 5.826 | 8.134 | 9.201 | 9.133 * |

F2 = **1.042**. \* Too few MODIS night detections outside the fire season (83, minimum 100), so both seasons are pooled for this one.

Values before 2012 are "measured by MODIS, converted to VIIRS units". In the app, hovering an estimated month shows the arithmetic and its range.

## Proof

All numbers below are written by the scripts in `hotspot/pipeline/` into `hotspot/web/public/proof/`; the method page draws them as charts.

1. **Before and after** (`proof1_yearly.json`). Simply adding the sensors jumps from 2,524 hotspots in 2011 to 9,245 in 2012. The harmonized record goes from 8,789 to 7,494: no jump.
2. **Blind test** (`proof2_blind_test.json`). Fitted on 2012 to 2016 only, the method predicted 2017 to 2019 from MODIS alone. Against what VIIRS really counted it missed by **7.8%** for whole years (+11.2% in 2017, −3.0% in 2018, −9.3% in 2019), **26.3%** for fire-season months (worst 55.3%), and 26.3% for single 1° squares (32 square-years). The 26.3% is the range shown on every estimate.
3. **Two real fires against Copernicus maps** (`proof3_fires.json`). North Evia 2021: 1,117 hotspots up to the 5 August map (7,313 ha), 2,134 more by the 11 August map (50,909 ha). Evros 2023: 1,061 hotspots up to the 21 August map (8,529 ha), 1,863 more by the 23 August map (72,344 ha). The hotspots rise with the burned area.
4. **Against EFFIS burned area, 2006 to 2025** (`proof4_effis.json`). Both records put 2007 first: 22,224 harmonized hotspots and 271,715 ha. 2007 is in the MODIS-only years, so the independent record backs the estimate.
5. **The VIIRS join** (`proof5_join.json`). NOAA-20 against S-NPP × F2, month by month over 84 months of 2019 to 2025; for example August 2021: 6,893 against 6,982.
6. **What the factor is made of** (`proof6_coincident.json`). On 147 passes where Aqua and S-NPP saw Greece within 5 minutes, S-NPP recorded 4.39 times as many hotspots; only 22.1% of S-NPP's fire cells were also seen by Aqua (sensitivity), and in cells both saw S-NPP had 2.83 pixels per Aqua pixel (resolution).
7. **Why a common grid is not enough** (`proof7_grid.json`). S-NPP has 3.41 times MODIS's hotspots; counting grid cells with fire instead only lowers that to 2.62 to 2.87, whatever the cell size (1 to 28 km).

### The finding

**August 2007 had about 11,606 hotspots in Greece (range 8,554 to 14,659), against 6,893 in August 2021 and 5,736 in August 2023** (`finding_augusts.json`; range ±26.3% from the blind test). Even the low end of the 2007 range is above both, so on this record August 2007 burned more than either recent August. Without harmonization these months could not be compared: 2007 was counted by MODIS, 2021 and 2023 by VIIRS.

## Limits

- Values before 2012 are estimates. Small or cool fires MODIS never saw cannot be recovered; the factor corrects the average, not each fire.
- The factor is an average over fire types; an area dominated by one kind of fire, such as small agricultural burns, is corrected less exactly.
- A small area is less certain than the whole country.
- MODIS and VIIRS pass at different times of day.
- Clouds and thick smoke hide fires from both sensors. Short satellite outages are not corrected.
- The newest months are provisional until NASA releases the standard data (about 5 months later).
- Hotspots are not burned area, and a hotspot is the centre of a flagged pixel, not the exact position of the fire.
- Greece only.

## Use our data

The calendar behind the app is a public web address anyone can call for any area in Greece.

- **Address:** `https://gustnedusjcdxtppojfn.supabase.co/rest/v1/rpc/calendar` (POST)
- **Key:** send the header `apikey: sb_publishable_IUKSzrZ4JSuA_KnRl2PmdQ_TRSl0URG`. This is the publishable key, public by design: the website itself uses it, and the database lets it call only the app's read functions.
- **Send:** a JSON body `{"area": <GeoJSON Polygon or MultiPolygon>}`, coordinates as longitude then latitude, at most 500 corner points.
- **You get back:** one row per year and month of the whole record, from November 2000 to the current month. Months with no hotspots are rows of zeros, and so is every month of an area outside Greece.

| Column | Meaning |
|---|---|
| `year`, `month` | The month (1 to 12) |
| `value` | Harmonized burning activity: the sum of the weights, in NOAA-20-equivalent hotspots. This is the number the app shows. |
| `modis` | Raw count of cleaned MODIS (Terra + Aqua) hotspots in the area that month, any year |
| `snpp` | Raw count of cleaned VIIRS S-NPP hotspots |
| `noaa20` | Raw count of cleaned VIIRS NOAA-20 hotspots |
| `provisional` | How many of the month's hotspots are near-real-time data; above 0 means the month is provisional |
| `so_far` | `value` counting only days 1 to D of the month, where D is the day of the newest hotspot in the database. Its median over the years is the "same days" normal for the current month. |

The raw counts include detections outside their sensor's period (weight 0), so `value` is not their sum. An invalid area, or one with more than 500 corners, returns an error with a plain message.

Example (the official North Evia box):

```bash
curl -s -X POST "https://gustnedusjcdxtppojfn.supabase.co/rest/v1/rpc/calendar" \
  -H "apikey: sb_publishable_IUKSzrZ4JSuA_KnRl2PmdQ_TRSl0URG" \
  -H "Content-Type: application/json" \
  -d '{"area": {"type": "Polygon", "coordinates": [[[22.966, 38.674], [23.509, 38.674], [23.509, 39.063], [22.966, 39.063], [22.966, 38.674]]]}}'
```

It returns 313 rows; August 2021 reads:

```json
{"year":2021,"month":8,"value":3252,"modis":700,"snpp":3954,"noaa20":3252,"provisional":0,"so_far":3251}
```

**Limits:** each request may run for at most 10 seconds (all of Greece takes about 6). The database is on Supabase's free plan, whose monthly data allowance is shared with the website, so please keep requests modest; the answer is small. If the database ever moves, this address changes and this section will be updated.

**The whole dataset in one file.** Every cleaned Greek hotspot of 2000 to 2025 with its weight, the factor table and a description of every column are a GitHub release: https://github.com/VasilisVerykokos/Nasa/releases/tag/dataset-v1 (the files are made by `pipeline/export_dataset.py`; the column description is [hotspot/DATASET.md](hotspot/DATASET.md)).

## Rebuild everything

You need Python 3.13, Node 26 with npm 11, a free Supabase project with the PostGIS extension switched on (Database → Extensions, schema `extensions`), and a free NASA FIRMS MAP_KEY. On Windows, start Python with `py -3.13`; elsewhere use `python3.13`.

1. Get the code and the Python packages:

   ```bash
   git clone https://github.com/VasilisVerykokos/Nasa.git
   cd Nasa/hotspot
   py -3.13 -m pip install pandas scipy requests "psycopg[binary]" pytest
   ```

2. Copy `.env.example` to `.env` and fill in: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY` (not used by the current scripts), `SUPABASE_DB_PASSWORD`, `SUPABASE_DB_HOST`, `SUPABASE_DB_USER`, `FIRMS_MAP_KEY`. Create `web/.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (the same URL and publishable key). Never commit either file.

3. Download NASA FIRMS's yearly country files for Greece (no login) into `pipeline/data/raw/`, keeping NASA's names: `modis/modis_{year}_Greece.csv` (2000 to 2025), `viirs-snpp/viirs-snpp_{year}_Greece.csv` (2012 to 2025) and `viirs-jpss1/viirs-jpss1_{year}_Greece.csv` (2018 to 2025), from `https://firms.modaps.eosdis.nasa.gov/data/country/{folder}/{year}/{file}`.

4. Run these from the `hotspot` folder, in this order:

   ```bash
   py -3.13 db/apply_and_test.py              # create the tables and functions (db/schema.sql) and test them
   py -3.13 -m pytest pipeline/tests          # the pipeline's tests
   py -3.13 pipeline/validate.py              # factors, proofs 1, 2, 4, 5 and the finding -> web/public/proof/
   py -3.13 pipeline/proof3_fires.py          # proof 3
   py -3.13 pipeline/proof6_coincident.py     # proof 6
   py -3.13 pipeline/proof7_grid.py           # proof 7
   py -3.13 pipeline/export_dataset.py       # the open dataset (CSV files) -> pipeline/data/release/
   py -3.13 pipeline/load_db.py               # load 2000 to 2025 into the database
   py -3.13 pipeline/check_db.py              # call the public calendar address and compare it with the pipeline
   py -3.13 pipeline/update_daily.py          # add the current year from the FIRMS API; run once a day
   ```

5. Start the website:

   ```bash
   cd web
   npm ci
   npm test
   npm run dev
   ```

GitHub Actions (`.github/workflows/pages.yml`) tests, builds and publishes the website to GitHub Pages on every push to `main`.

## Data and references

- **NASA FIRMS:** MODIS Collection 6.1 and VIIRS 375 m (S-NPP, NOAA-20) active fire products, yearly country files and the Area API. https://firms.modaps.eosdis.nasa.gov
- **Partner data, used to test the method:** Copernicus Emergency Management Service burned-area maps (activations EMSR527, North Evia 2021, and EMSR686, Evros 2023) and EFFIS yearly burned area for Greece.
- Natural Earth (the Greece outline); © OpenStreetMap contributors (the background map).
- Every dataset, paper, library and service: [hotspot/REFERENCES.md](hotspot/REFERENCES.md).

HOTSPOT is not endorsed by NASA.

## AI use

The code was written with Claude Code, under the team's direction and review. Every tool and what it was used for is logged in [hotspot/AI_USE.md](hotspot/AI_USE.md), and each AI-written file says so in its first line.

## Team

- ____________________
- ____________________

## Licence

Apache License 2.0. See [LICENSE](LICENSE).
