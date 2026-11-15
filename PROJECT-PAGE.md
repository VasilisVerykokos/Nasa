<!--
AI note: drafted with Claude Code (Claude Opus 5.5) for Person B on 14 Nov 2026, from MASTER-PLAN.md (sections 1, 4, 5, 12, 18),
PROJECT-PAGE-CHOICES.md, verified-facts.md and the proof files in hotspot/web/public/proof. The team edits, checks and owns the final text.

HOW TO USE THIS DRAFT
- Every number comes from a script in the repository (named next to it). Every fact is marked VERIFIED in verified-facts.md.
- [NOT BUILT YET: ...]  Delete the line if the feature still does not work at the feature freeze (Sunday 07:30). Never describe something that does not work.
- [CHECK: ...]          Verify before submitting, then delete the marker.
- [FILL: ...]           Fill in, then delete the marker.
- [IMAGE n: ...]        At most five images, each with its one-line caption.
- Before submitting: Person B reads the whole page against verified-facts.md (TESTING.md, section 6), and the stronger English speaker reads it aloud once.
-->

# HOTSPOT

*Harmonized Observations of Thermal Sensors for Pyro-Occurrence Trends*

**NASA has watched fires from space since 2000 with two different instruments, MODIS and VIIRS. VIIRS sees far more fire than MODIS, so a simple fire record jumps in 2012, when VIIRS starts, even where nothing changed on the ground. HOTSPOT removes that jump. It gives every vegetation-fire detection over Greece a measured weight, so 26 years read on one scale. Pick any area, by drawing it or typing a point, and see a calendar of fire activity, month by month since November 2000, compared with the normal for each month. Every number traces back to NASA's detections, and we tested the method on years it never saw.**

- **Live app:** https://hotspots.gr/
- **Code (Apache-2.0):** https://github.com/VasilisVerykokos/Nasa
- **30-second video:** [FILL: public link]

[IMAGE 1: two lines of yearly hotspots for Greece, 2000 to 2025: the sensors simply added, and the harmonized record. Caption: "Simply adding the sensors makes 2012 count 4.5 times what MODIS alone saw (9,245 against 2,037 hotspots). The harmonized record has no jump." Source: `web/public/proof/proof1_yearly.json`.]

---

## 1. The challenge

### The problem

A fire hotspot is the centre of a satellite pixel that NASA's fire algorithm flagged as hot, usually a fire. NASA's FIRMS system has published them since November 2000, from two kinds of instrument:

| Instrument | Satellites | Pixel | Period |
|---|---|---|---|
| MODIS | Terra, Aqua | about 1 km | November 2000 to today (Aqua from July 2002) |
| VIIRS | S-NPP, NOAA-20 | 375 m | S-NPP from January 2012 to 2 November 2026; NOAA-20 from April 2018 |

NASA's challenge names three differences between them: **spatial resolution, sensitivity, and observation schedule**. Together they mean VIIRS reports several times more hotspots than MODIS for the same fires. Add the two records together and 2012 looks like a disaster year, when only the instrument changed.

The goal, in NASA's words: by the end, **"the sensor of origin no longer matters"**.

### The people we built it for

We asked ourselves who needs a fire record they can compare across 26 years. Our answer:

| Who | What matters to them | What they need |
|---|---|---|
| Rescuers and emergency responders | Preparing for the dangerous months and reducing the risk | Their own area compared with its history, in under a minute |
| Research teams and environmental scientists | Reliable data for research and applications | A consistent, documented record they can download and build on |

Both are in the audience the challenge names: early warning and emergency responders, scientists, land managers, and firefighters.

**Their questions, and how HOTSPOT answers each**

| They ask | HOTSPOT answers with |
|---|---|
| "When is the dangerous season here?" | The "normal year" row of the calendar and the peak season in words |
| "How does this fire compare with the worst on record here?" | The harmonized record, the top months and years, and our finding about 2007 |
| "My area, not the whole country" | Draw any shape, or type a point and a radius |
| "Can I put it in my report?" | Downloads of the calendar and of the hotspots themselves |
| "Can I trust this number?" | Seven proofs and stated limits, on this page. Hover any month to see how its number was made. |
| "Will it still work next year?" | The record ends on NOAA-20, which continues after S-NPP |
| "Can I use the data in my own research?" | The hotspots CSV with a weight on every row, and the open code |
| "Is this month unusual here?" | A "this month so far" card that compares the first days of the current month with the median of the same days in earlier years, and a "difference from normal" view of the calendar |

### Why now

- **S-NPP stopped delivering data on 2 November 2026.** Our record continues on NOAA-20, which is why NOAA-20 is the unit of the record.
- **The MODIS satellites are drifting.** Terra made its final orbit correction on 27 February 2020 and Aqua on 8 March 2021. They now pass at different times of day than before, so their newest data no longer compare with their old data.
- **Without harmonization, the 26 years since 2000 can't be compared with each other.** HOTSPOT joins them now, while the instruments still overlap.

---

## 2. The solution

### What it does

| The challenge asks for | HOTSPOT |
|---|---|
| "a map where users can draw the area of interest, or an option to enter latitude and longitude" | Both: draw a polygon or rectangle, or type latitude, longitude and radius. Presets for North Evia 2021, Evros 2023 and all of Greece. |
| "select a region and a specific date range" | A from and to month. The range chooses which years the screen shows; "normal" is always worked out from the whole record. |
| Hotspots "from the early 2000s to the present" | A calendar of years × months from November 2000, with a total for each year. It runs to the newest day NASA has published (a data stamp on the screen shows the date); the newest months are marked provisional. |
| "which periods of the year see more fires" | A "normal year" row (the median of each calendar month) and the peak season in words, such as "July to September" |
| "which years had more burning activity" | Year totals and the top 5 years |
| "compare the burning activity of the current month against the historical median" | One plain sentence for any month, for example "August 2021 was 15.6 times the normal August here, the highest August in 26 years" (North Evia: 3,252 hotspots against a normal of 208). The "this month so far" card does the same for the current month. |
| "anomalies against multi-year averages" | A "difference from normal" view of the calendar (each month against the median of that calendar month). The calendar CSV carries the median and the mean of every calendar month. |
| "accessible color ramps" | Every cell shows its number on hover, focus (arrow keys) or tap, and the whole calendar can be shown as a table that a screen reader can read. Estimated, missing and provisional months are marked with patterns as well as colour. The colours are the ColorBrewer YlOrRd ramp, which ColorBrewer lists as colour-blind safe. |
| "download analytics and visualizations" | The calendar as CSV and as an image |
| "A downloadable CSV File of hot spots detected during a search" | Every hotspot in the area, with all its columns and its harmonization weight |

The page also says clearly when an area lies outside Greece, when it had no hotspots, or when the connection is lost (with a "Try again" button), and it shows the date the data runs to.

[IMAGE 2: the North Evia calendar with the headline sentence and the rankings. Caption: "North Evia: August 2021 stands out in 26 years of the harmonized record."]

### How it works

**1. Clean.** We keep vegetation fires, including agricultural burns, which the challenge counts as burning activity. We remove low-confidence detections (for MODIS, exactly the official "low" class, below 30) and fixed heat sources such as factories, which would hide the fire signal. This matters more than it looks: 16.9% of S-NPP rows and 14.5% of NOAA-20 rows are not vegetation fires, against 1.6% of MODIS rows (`pipeline/clean.py`).

**2. Never add satellites that see the same thing.** What must stay constant across the record is the number of looks per day. Terra and Aqua pass at different times, so together they give four looks a day, and we add them. S-NPP and NOAA-20 see nearly the same fires: over 2019 to 2025, NOAA-20 recorded 1.04 hotspots for every S-NPP hotspot. Adding them would count most fires twice, so we use one at a time.

**3. Measure the MODIS-to-VIIRS factor ourselves.** We compare S-NPP with MODIS over February 2012 to December 2019, the years both flew before the MODIS orbits drifted. The factor differs by day and night and by season (`web/public/proof/factors.json`):

| S-NPP hotspots per MODIS hotspot | Day | Night |
|---|---|---|
| Fire season (June to September) | 2.63 | 4.96 |
| Rest of the year | 3.36 | 11.52 |

Before July 2002 only Terra flew, so that period has its own, larger factor.

**4. Link S-NPP to NOAA-20.** Over their shared years, 2019 to 2025, NOAA-20 saw 1.04 hotspots for every S-NPP hotspot (37,673 against 36,168).

**5. Give every hotspot a weight.** The unit of the record is the NOAA-20-equivalent hotspot. A month's value is the sum of the weights inside the chosen area.

| Period | Source | Weight per hotspot |
|---|---|---|
| Nov 2000 to Jun 2002 | MODIS, Terra only | Terra-only factor × 1.04 |
| Jul 2002 to Jan 2012 | MODIS, Terra and Aqua | factor × 1.04 |
| Feb 2012 to Dec 2018 | VIIRS S-NPP | 1.04 |
| Jan 2019 to today | VIIRS NOAA-20 | 1 |

Because the weight sits on each hotspot, any shape the user draws is exact, and the download is itself a harmonized dataset.

**Measured, then converted.** Values before 2012 are MODIS measurements converted to VIIRS units, so they are estimates, with a range of about ±26% (the blind-test error on fire-season months, proof 2). Comparisons inside the MODIS years barely depend on the factor, because both months are multiplied by nearly the same number. On hover, each estimated month shows its arithmetic, for example "August 2007: about 13,138 hotspots, an estimate (range 9,722 to 16,554). Measured by MODIS: 3,052 detections, converted to VIIRS units."

### Options we weighed

| Question | Options | Chosen | Why |
|---|---|---|---|
| How to make the sensors comparable | Add them; count grid cells instead of hotspots; a factor measured on the shared years | The factor | Adding fakes a jump of 4.5 times in 2012. A common grid only lowers the ratio from 3.41 to between 2.62 and 2.87, whatever the cell size (proof 7). |
| Which years to fit on | All shared years; 2012 to 2019 | 2012 to 2019 | The MODIS orbits drift after 2020 |
| One factor, or several | One for the whole year; day and night; day and night by season | Day and night by season | In the blind test, day and night factors alone gave a fire-season error of 37.4%. The season split cut the fire-season error from 37.4% to 26.3%. |
| Which VIIRS product | 375 m; 750 m | 375 m | FIRMS distributes the 375 m product, which sees smaller fires. The 750 m product, built for continuity with MODIS, would still need a factor. It is our proposed next step. |
| Unit of the record | MODIS-equivalent; NOAA-20-equivalent | NOAA-20-equivalent | It is the instrument that continues |
| What "normal" means | Mean; median | Median, with the mean in the CSV | One extreme year should not move "normal" |
| Coverage | The whole world; one country done fully | Greece | A complete small tool beats a half-working large one |

[FILL: the team's own brainstorm and its photo, only if it took place (MASTER-PLAN section 18.3).]

### Proof

Every number below was produced by a script in the repository.

| # | Test | Result |
|---|---|---|
| 1 | Simple sum against harmonized record, 2000 to 2025 | The simple sum jumps 4.5 times in 2012. The harmonized record does not (image 1). |
| 2 | **Blind test:** fit the factor on 2012 to 2016 only, predict 2017 to 2019 from MODIS alone, compare with what VIIRS really counted | Whole years: off by 11.2%, 3.0% and 9.3% (average 7.8%). Fire-season months: 26.3% on average. Single 1° squares: 26.3%. (`proof2_blind_test.json`) |
| 3 | North Evia 2021 and Evros 2023, day by day, against the Copernicus burned-area maps | Timing, not size. Evros: hotspots peaked on 22 August 2023 (1,410), inside the biggest burned-area jump, 8,529 to 72,344 ha between the 21 and 23 August maps. North Evia: hotspots from 4 to 11 August 2021, peak on 5 August (752). Hotspots are not burned area (`proof3_fires.json`). |
| 4 | Harmonized yearly hotspots against official EFFIS burned area for Greece, 2006 to 2025 | Rank correlation 0.70 (Pearson 0.89). 2007 is the worst year in both. Before 2012 our record is an estimate, so this tests it against an independent source. |
| 5 | NOAA-20 against S-NPP × 1.04, month by month, 2019 to 2025 | Correlation 0.998: the last join is clean |
| 6 | Aqua against S-NPP on 147 days when they passed within 5 minutes of each other | Aqua saw only 22% of the places where S-NPP saw fire (sensitivity, the large part). Where both saw a fire, S-NPP gave 2.8 pixels per Aqua pixel (resolution, the small part). |
| 7 | The obvious alternative, a common grid, on 2012 to 2019 | The ratio falls only from 3.41 to 2.62–2.87, whatever the cell size. A grid can't bring back fires MODIS never saw. |

Proof 6 explains the factor but does not measure its size. On those passes the ratio is 4.4, against 6.0 over all passes, because a pass where only VIIRS saw fire leaves no MODIS record. Its other limits: Aqua only, no large fires in the sample, and 147 days in eight years.

[IMAGE 3: the blind test, predicted against real hotspots for 2017 to 2019. Caption: "Trained on 2012 to 2016 only, the method predicted the next three years within 12%." Source: `web/public/proof/proof2_blind_test.json`.]

### What we tested and changed

- **The science:** the first blind test over-predicted 11 of 12 summer months, by about 30% on average. So we measured a separate factor for June to September. It brought the fire-season error from 37% to 26%, and we kept it.
- **The people:** [FILL after the five-minute tests: "We tested with N people from outside the team. X did not work. We changed Y." If nothing failed, say that, and say who tested.]

[IMAGE 4: the paper wireframe beside the finished screen. Caption: "From paper sketch to the live app."]

### Limits

- Values before 2012 are estimates. Small or cool fires that MODIS never saw can't be recovered. The factor corrects totals, not single fires.
- The factor is an average over fire types. An area dominated by one type, such as agricultural burns, is corrected less exactly.
- A small area varies more than the whole country: 26.3% blind-test error for single 1° squares.
- MODIS and VIIRS pass at different times of day. Clouds and thick smoke hide fires from both.
- A hotspot is the centre of a flagged pixel, not the exact position of a fire.
- Hotspots are not burned area. NASA does not recommend them for estimating it, and a fast fire can burn a lot between two passes.
- The newest months are provisional until NASA releases its final data.

| A user asks | Can HOTSPOT answer? |
|---|---|
| Was August 2007 worse than August 2021 in Greece? | Yes, with a range |
| Which months normally have the most activity in a region? | Yes |
| Where exactly did a small fire burn in 2005? | No: fires MODIS missed are unknown |
| How many hotspots did one village have in one month of 2003? | Not reliably: the factor is an average |

---

## 3. Why it is important

### Who it helps, and the decisions it supports

Early warning and emergency responders, scientists, land managers and firefighters. HOTSPOT shows history, not a forecast: it helps them prepare, it doesn't predict fires.

1. **Planning:** when does the dangerous period normally start and end here? Patrols and readiness can follow the "normal year" row.
2. **After a fire:** how does this event compare with the worst on record here, across the change of instrument? The rankings and the finding below answer it.
3. **Alert:** is this month unusual for this area? The "this month so far" card answers it.

### What is new

**A finding nobody could make before.** Was 2007 worse than 2021 or 2023 in Greece? MODIS and VIIRS counts couldn't be compared, so nobody could say. On one scale, 2007 had about **22,224** NOAA-20-equivalent hotspots, about **2.3 times 2021** (9,545) and **2.4 times 2023** (9,376). Even if 2007 were 30% lower, it would still be more than one and a half times either year. EFFIS burned area also ranks 2007 first (271,715 ha). For 2021 and 2023 the order differs: by hotspots they are nearly equal, while by burned area 2023 is clearly larger (174,773 ha against 130,744 ha). The Evros fire of 2023 grew from 8,529 ha to 72,344 ha between 21 and 23 August, and 2023 has fewer hotspots per hectare burned than 2021.

| What exists | What it lacks | What HOTSPOT adds |
|---|---|---|
| NASA FIRMS fire map | [CHECK: does FIRMS offer any harmonized history? Check on the site before keeping this row.] Shows each instrument's hotspots separately | One record across the instruments, from 2000 |
| Public fire dashboards | [CHECK: which ones start in 2012? Check each on its own website, or delete this row.] | The twelve years before 2012, on the same scale |
| Any chart of hotspot counts | No way to see how a number was made | The factor table, the weights in every download, and seven proofs on this page |

We found no published VIIRS-to-MODIS ratio of hotspot counts for the Mediterranean (verified-facts.md, section 4.5). We did not search exhaustively, so we do not say none exists.

### Use it and build on it

- **Open code**, Apache-2.0, with the steps to rebuild everything from NASA's public files in the README. We followed the README from a fresh copy of the repository: the tests, the proofs and the dataset export run as written.
- **Open data:** every hotspot download carries its weight. The full harmonized dataset for Greece, 2000 to 2025 (153,804 hotspots, with a description of every column), is a GitHub release: https://github.com/VasilisVerykokos/Nasa/releases/tag/dataset-v1
- **Use our data:** the calendar behind the app is a public web address anyone can call for any area in Greece. The address, the key, what to send and what comes back are in the README, section "Use our data".

**Next steps** [CHECK: the team picks three of these four]

1. **More countries.** The pipeline takes the country as a setting, so the Mediterranean means running it and checking the proofs for each one.
2. **NASA's VIIRS 750 m continuity product as a bridge,** to separate the resolution effect cleanly.
3. **A citable, versioned dataset** that scientists can reference.
4. **An alert** when an area goes above its normal for the month.

---

## NASA data

- NASA FIRMS, MODIS Collection 6.1 active fire product (Terra and Aqua), yearly country files for Greece, 2000 to 2025
- NASA FIRMS, VIIRS 375 m active fire products (S-NPP and NOAA-20), yearly country files for Greece
- NASA FIRMS Area API: VIIRS NOAA-20 375 m, standard and near-real-time data for 2026, updated daily
- MODIS Collection 6 and 6.1 Active Fire Product User's Guide; FIRMS FAQ; NASA VIIRS Land, Active Fire Product page

## Space agency partner and other data

- Copernicus Emergency Management Service, activations EMSR527 (North Evia 2021) and EMSR686 (Evros 2023): areas of interest and burned-area products
- EFFIS (European Forest Fire Information System) Statistics Portal: yearly burned area for Greece, 2006 to 2025
- Natural Earth, 1:10m countries (public domain): the outline of Greece
- Map © OpenStreetMap contributors (ODbL)

## References

Every dataset, paper, library and service the project uses (plan, section 9.8).

### Libraries

| Name | Used for | Licence | Link |
|---|---|---|---|
| Vite | Builds and serves the website | MIT | https://vite.dev |
| React | The website's interface | MIT | https://react.dev |
| TypeScript | Typed JavaScript for the website | Apache-2.0 | https://www.typescriptlang.org |
| Vitest | Tests for the website's statistics | MIT | https://vitest.dev |
| jsdom | A fake browser for the website tests that click the calendar (tests only, not shipped) | MIT | https://github.com/jsdom/jsdom |
| Leaflet | The map on the website | BSD-2-Clause | https://leafletjs.com |
| Leaflet-Geoman (free edition) | Drawing a polygon or rectangle on the map | MIT | https://geoman.io |
| d3-scale-chromatic | The YlOrRd colour ramp of the calendar heatmap and year chart (ColorBrewer, Cynthia Brewer, Penn State, https://colorbrewer2.org; colour-blind safe) | ISC | https://github.com/d3/d3-scale-chromatic |
| marked 15.0.12 | Turns `web/content/method.md` into the text of the "Method and proof" view | MIT | https://marked.js.org |
| PostgreSQL | The database that holds the hotspots and runs the four functions | PostgreSQL License | https://www.postgresql.org |
| PostGIS | Map maths in the database: tests each hotspot against the drawn area | GPL-2.0-or-later | https://postgis.net |
| psycopg 3 | Connects the Python scripts to the database | LGPL-3.0 | https://www.psycopg.org |
| Python 3.13 | The data pipeline | PSF License | https://www.python.org |
| pandas | Reads, cleans, counts and weights the hotspots in the pipeline | BSD-3-Clause | https://pandas.pydata.org |
| SciPy | Rank correlation (Spearman) for proof 4, called by pandas | BSD-3-Clause | https://scipy.org |
| Requests | Downloads the current year from the NASA FIRMS Area API (`pipeline/update_daily.py`) | Apache-2.0 | https://requests.readthedocs.io |
| pytest | Tests for the pipeline | MIT | https://pytest.org |

### Datasets

| Name | Used for | Link |
|---|---|---|
| NASA FIRMS, MODIS Collection 6.1 active fire product (Terra and Aqua), yearly country files, Greece 2000 to 2025 | Hotspots before 2012, and the MODIS side of the factor F1 | https://firms.modaps.eosdis.nasa.gov |
| NASA FIRMS, VIIRS 375 m active fire products (S-NPP 2012 to 2025, NOAA-20 2018 to 2025), yearly country files, Greece | Hotspots from 2012; the factors F1 and F2 | https://firms.modaps.eosdis.nasa.gov |
| NASA FIRMS Area API and data-availability API, VIIRS NOAA-20 375 m, standard (VIIRS_NOAA20_SP) and near-real-time (VIIRS_NOAA20_NRT), 2026 | The current year, from 1 Jan 2026 to the newest day; rerun daily by `pipeline/update_daily.py` | https://firms.modaps.eosdis.nasa.gov/api/area/ |
| EFFIS Statistics Portal, yearly burned area for Greece, 2006 to 2025 | Proof 4: our yearly record against an independent one | https://forest-fire.emergency.copernicus.eu/apps/effis.statistics/estimates |
| Copernicus Emergency Management Service, activation EMSR686 (Evros 2023): burned-area products and area of interest | Dates and burned area of the Evros fire; the Evros preset box | https://mapping.emergency.copernicus.eu/activations/EMSR686/ |
| Copernicus Emergency Management Service, activation EMSR527 and its bulletin on fire events in the Mediterranean (North Evia 2021) | Start date and burned area of the North Evia fire; the North Evia preset box (area of interest AOI01 "Evia", read from the Delineation Monitoring 3 vector files) | https://mapping.emergency.copernicus.eu/activations/EMSR527/ |
| Natural Earth, 1:10m Admin 0 Countries (public domain) | The Greece outline: clipping and the coverage outline. Its land neighbours (Albania, North Macedonia, Bulgaria, Turkey; `pipeline/evidence/neighbours.geojson`) keep the 2026 clip from crossing a border | https://www.naturalearthdata.com |

### Papers and guides

| Reference | Used for |
|---|---|
| MODIS Collection 6 and 6.1 Active Fire Product User's Guide, version 1.0 (https://earthdata.nasa.gov/s3fs-public/2023-09/MODIS_C6_C6.1_Fire_User_Guide_1.0.pdf) | The MODIS confidence classes (table 11): we drop the low class, below 30 |
| NASA Space Apps Challenge 2026, "Harmonization of MODIS and VIIRS Hot Spots" (https://www.spaceappschallenge.org/2026/challenges/modis-and-viirs-hot-spots/) | The task, and NASA's wording of the goal |
| FIRMS FAQ, NASA Earthdata (https://www.earthdata.nasa.gov/data/tools/firms/faq) | What a hotspot is, satellite dates, the limits of hotspot data |
| NASA VIIRS Land, Active Fire Product (https://viirsland.gsfc.nasa.gov/Products/NASA/FireESDR.html) | The two VIIRS fire products (750 m and 375 m) |

### Services

| Name | Used for | Link |
|---|---|---|
| Supabase | Hosts the PostgreSQL + PostGIS database and the secure web address the website calls | https://supabase.com |
| OpenStreetMap tiles (© OpenStreetMap contributors, ODbL) | The background map | https://www.openstreetmap.org/copyright |
| GitHub Pages and GitHub Actions | Build and host the website on every push to `main`; GitHub Actions also runs the daily update (`.github/workflows/daily-update.yml`) | https://pages.github.com |

## Use of artificial intelligence

The code was written with Claude Code, under the team's direction and review. Every AI-assisted file carries a one-line note at its top, and every session is logged in `hotspot/AI_USE.md`. The team decided the method and can explain every step of it. AI tools used: Claude and Claude Code (planning, source checking, code, quick counts), Gemini (literature search, fact-checked), ChatGPT (a plain-language explanation of the topic in Greek; its suggestions were checked and not adopted). Impeccable (design review of the screen). No AI-generated images are used.

### AI use log

A dated log of AI help (plan, section 16). One line per piece of AI-assisted code or text.

| Date | Tool | Used for |
|---|---|---|
| 13 Nov 2026 | Gemini | Literature search on the sensors and the two fires. Results were fact-checked; see `verified-facts.md`. |
| 13 Nov 2026 | Claude | Checking sources in a browser; compiling `verified-facts.md`. |
| 13 to 14 Nov 2026 | Claude | Discussion of the approach, a quick feasibility look at the public Greek FIRMS files, drafting the master plan. |
| 14 Nov 2026 | Claude | Checking the plan against the judging criteria and the organisers' design steps; drafting `PROJECT-PAGE-CHOICES.md` and `JUDGE-QUESTIONS.md`. |
| 14 Nov 2026 | ChatGPT | A plain-language explanation of the topic in Greek for the second team member. Its suggestions (VIIRS 750 m as the main source, a 1 km grid, an alert system) were checked and not adopted. |
| 14 Nov 2026 | Claude | Fact-check of the ChatGPT conversation against NASA pages; quick counts on the Greece files (ratios, grid test, near-simultaneous passes); planning notes; re-running the counts on the first machine. |
| 14 Nov 2026 | Claude Code (Claude Sonnet 5.5) | `pipeline/config.py`, `pipeline/clean.py`, `pipeline/tests/test_clean.py` (from the AI notes in those files). |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5) | First run of the cleaning step; per-row confidence rule and unknown-satellite check in `clean.py`; `pipeline/factors.py`, `pipeline/harmonize.py`, `pipeline/tests/test_harmonize.py`; first factors and yearly totals. |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5) | `pipeline/validate.py` and `pipeline/tests/test_validate.py` (blind test, proofs 1, 2, 4 and 5 as files in `web/public/proof/`, sanity checks); a one-off check of a season split (not adopted); pipeline entries in `REFERENCES.md`. |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5) | Season split in `pipeline/factors.py`, `harmonize.py`, `validate.py` and their tests, after the team chose to adopt it; `season` column in the `factors` table of `db/schema.sql`. |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5) | Minimum-detections fallback in `pipeline/factors.py` and its tests, after a review finding; re-run of the proofs. |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5) | `db/schema.sql` (tables, security, the four database functions) and `db/apply_and_test.py` (applies it to Supabase and tests it with made-up rows); paging fix in `web/src/api/hotspots.ts` with its test. |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5) | `web/` set up with Vite, React, TypeScript and Vitest; `web/src/lib/stats/index.ts` (normal, comparison, headline, rankings, peak season, difference from normal, this month so far) and its tests `index.test.ts`. |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5) | `.github/workflows/pages.yml` (test, build, publish); `web/src/lib/geo` (circle from point + radius, presets, Greece check) and its tests; `web/src/components/AreaPicker.tsx` (Leaflet map with drawing, presets, point form); page skeleton in `App.tsx` and `index.css`. |
| 14 Nov 2026 | Claude Code (Claude Sonnet 5.5), Person B | `pipeline/evidence/`: the Evros 2023 and Evia 2021 Copernicus files and the EFFIS yearly table, typed from `verified-facts.md`; `greece.geojson`, cut from the Natural Earth 1:10m countries file; the repository-layout entry in the plan. |
| 14 Nov 2026 | Claude Code (Claude Sonnet 5.5), Person B | `WIREFRAME.md`: draft desktop and phone wireframes, component states, UI best-practice list from web research. |
| 14 Nov 2026 | Claude Code (Claude Sonnet 5.5), Person B | Design artifact "HOTSPOT Mockup": high-fidelity desktop, phone and Method and proof screens built from `WIREFRAME.md`. The numbers on it are invented layout data. Printed to `design/hotspot-mockup.pdf` and committed on 14 Nov, 18:45, for Person A. |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5) | `web/src/api/calendar.ts` (the `calendar` database call); `web/src/components/CalendarTable.tsx` (plain calendar with year totals and the normal year) and its test; loading, error, "no hotspots" and "outside Greece" messages in `App.tsx`. |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5), Person B | Read the official North Evia area from the Copernicus EMSR527 vector files and updated `pipeline/evidence/copernicus_evia_2021.json`; quick checks of the old and new Evia box and of the Greece outline against FIRMS's 2025 file (throwaway scripts, not in the repository); `web/content/ui-text.md` (every screen label and message) and `web/content/method.md` (method page text, merging the earlier `limits.md` draft), from the mockup and the plan, checked against `verified-facts.md`; matching edits to the planning files. |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5), Person B | Fixed the secrets in `.env.example` (restored the template, local excludes); merged `FOR-MASTER-PLAN.md` into the planning files and updated the teammate `CLAUDE.md`; `web/src/components/HeadlineCard.tsx` (must-have 4) and `Rankings.tsx` (must-have 5) with their tests, placed in `App.tsx`; wording fixes in `web/content/ui-text.md`; the Vitest drive-letter workaround in the plan. |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5), Person B | `web/src/components/Messages.tsx` (must-have 8: outside Greece, no hotspots, database unreachable with a "Try again" button, the database's own messages) and its test; the matching lines in `App.tsx`; wording note in `web/content/ui-text.md`; two decision-log rows. |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5), Person B | `web/src/api/meta.ts` (the `get_meta` call) and `web/src/components/DataStamp.tsx` (data stamp, "updated daily" only after a recent update) with its test; the matching lines in `App.tsx`; the `meta` key names in the plan and the decision log; a throwaway check of the live `get_meta` answer (not in the repository). |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5), Person B | `web/src/components/ExportBar.tsx` (must-have 6: calendar CSV and hotspots CSV), `web/src/lib/csv` (CSV builder, month span, file names) and `web/src/api/hotspots.ts` (paged `hotspots_export` call), with tests; the matching lines in `App.tsx`; CSV columns in the plan; decision-log rows; throwaway checks of the live database functions (not in the repository). |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5), Person B | Proof 7: `pipeline/proof7_grid.py` (grid test on the project's cleaning step, writes `web/public/proof/proof7_grid.json`) and `pipeline/tests/test_proof7_grid.py`; the grid sizes in `config.py`; the script's numbers in the plan, the facts file, the judge questions, the project-page choices and `web/content/method.md`. |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5), Person B | Fix in `web/src/api/hotspots.ts`: the export now pages through `hotspots_export`'s own `page` input (the first version would have cut files at 10,000 rows); `web/src/api/hotspots.test.ts` with a fake database; corrections in the plan, the decision log and `web/content/ui-text.md`. |
| 14 Nov 2026 | Claude Code (Claude Sonnet 5.5), Person A | `pipeline/load_db.py` (empties and reloads the four tables in one transaction) and `pipeline/check_db.py` (calls `calendar` over HTTPS with the public key and checks it against the pipeline); the matching decision-log rows. |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5), Person A | Calendar heatmap (must-have 3): `web/src/components/CalendarHeatmap.tsx` (SVG grid, two views, marks, legend, keyboard grid, "Show as table") and `web/src/lib/heatmap` (colour scales and the "show the arithmetic" text), with tests; "Download calendar (image)" in `ExportBar.tsx` (must-have 6); the one-line change in `App.tsx`; d3-scale-chromatic in `REFERENCES.md`; decision-log rows. |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5), Person A | "So far" card (must-have 12): `web/src/components/ThisMonthCard.tsx` with its test; `thisMonthSoFar()` in `web/src/lib/stats` now uses the same-days normal (`so_far`); phone layout of the heatmap (slides inside its box); "detection"/"detections" fix; the matching lines in `App.tsx`, `ui-text.md` and the decision log. Browser check of the heatmap run by Claude in Chrome. |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5), Person B | `TESTING.md` (manual checklist, five-minute outsider test script, feedback log, bug list, final pre-submission check) from the plan and `web/content/ui-text.md`; a pointer in the plan and a decision-log row; restored Person A's `AI_USE.md` line that a merge had dropped. |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5), Person B | Proof 6: `pipeline/proof6_coincident.py` (Aqua against S-NPP on passes within 5 and 10 minutes, on the project's cleaning step, limits written into `web/public/proof/proof6_coincident.json`) and `pipeline/tests/test_proof6_coincident.py`; shared `cell_index` in `proof7_grid.py`; three settings in `config.py`; the script's numbers in the plan, the facts file, the judge questions and the project-page choices. |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5), Person B | `PROJECT-PAGE.md`: draft of the Space Apps project page from the plan, the choices checklist, verified facts and the proof files, with markers for what is not built, not checked or not filled; pointer in the plan, decision-log row; corrected the proof 6 time in the plan files. |
| 14 Nov 2026 | Claude Code (Claude Sonnet 5.5), Person B | Date range (must-have 2): `web/src/components/DateRange.tsx`, rules in `web/src/lib/dates`, tests for both; small changes in `App.tsx` and `ExportBar.tsx` (hotspots CSV uses the dates); wording in `web/content/ui-text.md`; decision-log row. |
| 14 Nov 2026 | Claude Code (Claude Sonnet 5.5), Person B | Phone-width fix in `web/src/index.css`: the page grid columns can now shrink, so the calendar scrolls inside its own box. |
| 15 Nov 2026 | Claude Code (Claude Opus 5.5), Person A | Proof 3: `pipeline/proof3_fires.py` (daily harmonized hotspots for North Evia 2021 and Evros 2023 against the Copernicus burned-area maps, writes `web/public/proof/proof3_fires.json`) and `pipeline/tests/test_proof3_fires.py`; `validate.py` also writes `finding_augusts.json`; "Method and proof" view (must-haves 7 and 9): `web/src/components/MethodPage.tsx` (the finding, method.md text, factor and splice tables, proof charts in plain SVG with "Show as table") and its test, the header link in `App.tsx`, styles in `index.css`; marked in `REFERENCES.md`; decision-log rows. Later the same session: dark theme in `index.css`; the official North Evia box in `web/src/lib/geo` and `pipeline/check_db.py`; the 14,659 rounding fix in the planning files; the current year: `pipeline/update_daily.py` (FIRMS Area API, factory mask, clip to Greece without crossing a border) with `pipeline/tests/test_update_daily.py`, `pipeline/evidence/neighbours.geojson` (from Natural Earth), settings in `config.py`, notes in `load_db.py` and `check_db.py`, and the first load of 2026 into Supabase. |
| 15 Nov 2026 | Claude Code (Claude Opus 5.5), Person A | Key-safe error messages in `pipeline/update_daily.py` with a test in `pipeline/tests/test_update_daily.py`; the repository `README.md` rewritten (method, proofs and finding from the proof files, "Use our data" with a curl example run against the live database, rebuild steps); the "Use our data" section of `web/content/method.md` and its address and key slots in `web/src/components/MethodPage.tsx`, with a test; decision-log rows. |
| 15 Nov 2026 | Claude Code (Claude Opus 5.5), Person A | Raw-versus-harmonized switch (should-have 1): third view "Raw (sensors simply added)" in `web/src/components/CalendarHeatmap.tsx`; `rawOf`, `cellColor` and `describeRaw` in `web/src/lib/heatmap` with tests; decision-log row. |
| 15 Nov 2026 | Claude Code (Claude Sonnet 5.5), Person B | Fixes from a browser test of the live site, all in `web/`: calendar tooltip at the hovered, focused or tapped cell (`CalendarHeatmap.tsx`, `index.css`); code blocks and wide tables scroll inside their own box; method page wording (proof numbering 3a/3b, "Limits of proof N", the challenge explained, "The proofs"); calendar hint and Raw subtitle; headline month chosen inside the date range and "where a normal August has none" wording (`lib/stats`, `HeadlineCard.tsx`, `App.tsx`) with tests; point form labels, preset clears the point, typed numbers kept, focus to the result heading (`AreaPicker.tsx`); wider Greece coverage box (`lib/geo`) with a test; `content/ui-text.md` updated. |
| 15 Nov 2026 | Claude Code (Claude Opus 5.5), Person A | Trend and seasonal chart (should-haves 2 and 4): `web/src/lib/trend` (Mann-Kendall test with Sen's slope), `web/src/lib/season`, `web/src/components/YearTrend.tsx` and `SeasonChart.tsx` (plain SVG, "Show as table"), with tests; wording in `content/ui-text.md`; decision-log rows. Not mounted in `App.tsx` yet. |
| 15 Nov 2026 | Claude Code (Claude Sonnet 5.5), Person A | Daily update on GitHub Actions (should-have 7): `.github/workflows/daily-update.yml`, `pipeline/requirements.txt`, the factory mask saved as `pipeline/evidence/factory_mask.csv` (read by `pipeline/update_daily.py`, rewritten with `--build-mask`), `env()` in `pipeline/load_db.py` falls back to environment variables, temporary tables dropped at commit, two tests in `pipeline/tests/test_update_daily.py`; decision-log rows. |
| 15 Nov 2026 | Claude Code (Claude Sonnet 5.5), Person B | Hotspots download file name no longer says "hotspot" twice (`web/src/lib/csv/index.ts` and its test). |
| 15 Nov 2026 | Claude Code (Claude Sonnet 5.5), Person B | Fact check of `PROJECT-PAGE.md` against `verified-facts.md` and the proof files: corrected blind-test numbers, removed outdated "not built" markers, softened three claims; decision-log row in `JUDGE-QUESTIONS.md`. |
| 15 Nov 2026 | Claude Code (Claude Sonnet 5.5), Person B | Dataset release (value-add A): `pipeline/export_dataset.py` (writes the harmonized hotspot file and the factor file from the project's own cleaning and weighting) and `DATASET.md` (description of every column). |
| 15 Nov 2026 | Claude Code (Claude Sonnet 5.5), Person A | Scroll cue on the phone calendar: text line "Scroll sideways for September to December and the year totals." (shown only while the box is narrower than the calendar) and a soft right-edge fade, in `web/src/components/CalendarHeatmap.tsx` and `web/src/index.css`; test in `CalendarHeatmap.test.tsx`; wording in `web/content/ui-text.md`. |
| 15 Nov 2026 | Claude Code (Claude Sonnet 5.5), Person A | Share link (should-have 5): `web/src/lib/share` (write and read the address, with tests), preset ids in `lib/geo`, address kept up to date in `App.tsx`, start values in `AreaPicker.tsx` and `DateRange.tsx`, "Copy link" in `ExportBar.tsx`; wording in `content/ui-text.md`; decision-log row. |
| 15 Nov 2026 | Claude Code (Claude Sonnet 5.5), Person B | Rebuild check of the README from a fresh clone: 53 pipeline tests and 81 web tests pass, proofs 3, 6, 7 and the dataset export run; found that `scipy` was missing from the install line (README) and from `REFERENCES.md`, and added it. |
| 15 Nov 2026 | Claude Code (Claude Opus 5.5), Person A | Should-haves 3 and 8: click a calendar month to see its hotspots as dots on the map (`web/src/api/points.ts`, `MapLegend.tsx`, changes to `App.tsx`, `AreaPicker.tsx`, `CalendarHeatmap.tsx`, `HeadlineCard.tsx`), the coverage outline from `get_meta` (`api/meta.ts`); tests `App.test.tsx` and `api/points.test.ts` with `jsdom` (test-only); wording in `content/ui-text.md`; decision-log rows. |
| 15 Nov 2026 | Claude Code (Claude Sonnet 5.5), Person A | `hotspot/PIPELINE.md`: plain-words walk through the pipeline and the reason for each step, written from the code in `pipeline/` and the plan, section 4. |
| 15 Nov 2026 | Claude Code (Claude Opus 5.5), Person A | Design review of the website (two review agents and the Impeccable design checker), then the fixes: type scale and headline panel, one-line header, map column that stays in view, fold-out point form and phone date range, 44 px inputs, named draw tools, YlOrRd calendar colours with two-tone hatching, peak season hidden under 5 hotspots, year-chart axis fix, pasted share links load, shorter screen-reader announcements, Method page column (`web/src/index.css`, `App.tsx`, `AreaPicker.tsx`, `DateRange.tsx`, `ExportBar.tsx`, `ThisMonthCard.tsx`, `Rankings.tsx`, `YearTrend.tsx`, `CalendarHeatmap.tsx`, `Messages.tsx`, `lib/heatmap`, `lib/stats` and their tests); wording in `content/ui-text.md`; decision-log rows; `REFERENCES.md`. |
