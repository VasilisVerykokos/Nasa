# Questions a judge may ask, and our answers

A living file. Update it while you build.

- Started 14 Nov 2026. Drafted with AI help (Claude); list it in the AI-use disclosure.
- **The answers are drafts.** Rewrite each one in your own words before the pitch. A judge can tell a memorised answer from an understood one.
- Fill every blank with numbers from the pipeline run, never from before 09:00 Saturday.
- Facts come from `verified-facts.md`. Details are in `MASTER-PLAN.md`.

**How to keep it current**

- When a decision changes in the build, change the answer here the same hour.
- When a mentor, a tester or a teammate asks something that is not here, add it under "New questions" at once, even without an answer.
- Before the pitch, both of you answer every question aloud once, without reading.

**Standing instruction for Claude Code (and for us).** Every time a decision is made during the build, do these three things in the same step, without being asked:

1. Add one row to the decision log at the bottom: time, what was decided, what the alternative was, why.
2. Update the answer of any question the decision touches, and set its status.
3. If the decision raises a question that is not listed, add it with its answer.

A "decision" is anything a judge could ask "why?" about: a threshold, a date, a cut feature, a library, a number that came out of the pipeline, a result that surprised us, something that failed and how we got round it. When a pipeline run produces a number that fills a blank, fill it and change NEEDS NUMBER to READY.

**Status:** READY = we can answer it now. NEEDS NUMBER = waiting for the pipeline. OPEN = we do not have a good answer yet.

---

## A. The method

| # | Question | Draft answer | Status |
|---|---|---|---|
| 1 | Why can't you simply add the MODIS and VIIRS hotspots together? | VIIRS is sharper (375 m against 1 km), so it finds several times more hotspots for the same fires. Adding them makes fire activity seem to jump in 2012, when only the sensor changed. In Greece the jump is 4.5 times in 2012 (9,245 hotspots when all sensors are added, against 2,037 from MODIS alone). Adding NOAA-20 from 2018 doubles it again: 2021 shows 20,869 added up, against 9,545 real NOAA-20 hotspots. | READY |
| 2 | How does your harmonization work, in one minute? | In the years both sensors flew, we count how many VIIRS hotspots there are for each MODIS hotspot. That ratio becomes a weight on every older MODIS hotspot. We measure it separately for day and night, and for the fire season (June to September) and the rest of the year, because MODIS catches a larger share of summer fires than of the small burns in other months. From 2012 we use VIIRS directly. A month's value is the sum of the weights in the chosen area. | READY |
| 3 | Why is the factor fitted on 2012 to 2019 only? | VIIRS data starts in January 2012, so it cannot start earlier. After 2019 the MODIS satellites drift: Terra's last orbit correction was February 2020 and Aqua's was March 2021. They then pass at a different time of day and see a different number of fires. Including those years would mix two effects. | READY |
| 4 | How is this different from GFED5NRT (Chen et al. 2026)? | Same core idea: scaling factors from the shared years, vegetation fires only, and we reuse their rule for masking factories. Differences: they produce gridded burned area and emissions at 0.25° for scientists, with factors for 14 regions and 16 land-cover types. We keep a weight on every single hotspot, so any drawn area is exact, and we built a tool a non-specialist can use. We did not do their viewing-angle correction; it needs image products that are not in the hotspot files. | READY, but one of us must read their method section first |
| 5 | Why did you fit on 2012 to 2019 when GFED5NRT used 2012 to 2022? | We chose to stop before the drift. If asked for evidence: we ran it both ways: fitting to December 2022 changes each F1 by less than 5% (fire season −4.4% by day, +3.8% by night; rest of the year +0.7% and −4.6%). In Greece the drift years move it little, so we stopped at 2019 on principle, not because it changed the result. | READY |
| 6 | Why are values before 2012 called estimates? | VIIRS was not in orbit, so nobody measured what it would have seen. The MODIS counts are real measurements; only the conversion is estimated. Comparisons inside the MODIS years barely depend on the factor, because it cancels out. | READY |
| 7 | How sure are you about the estimates? | We tested blind: fitted on 2012 to 2016, predicted 2017 to 2019 from MODIS alone, and compared with what VIIRS really saw. The error was 26% on average for fire-season months (June to September; worst month 55%), 7% for whole years, and 27% for single 1° squares per year. The 26% is the range shown on every estimate. Summer months are still more often over-predicted than under-predicted (9 of 12), so the true error leans upward. | READY |
| 8 | Why one factor for the whole country? Fires differ. | We tested finer factors (by season, by 1° square) with the same blind test and kept the one with the smallest error. A separate factor for June to September and for the rest of the year lowered the blind fire-season error from 37% to 26%, so we kept it. Finer squares were not tested for lack of time. We state as a limit that MODIS misses small agricultural burns more than forest fires. | READY (1° squares not tested) |
| 9 | Why are there three VIIRS satellites but you use one at a time? | They share one orbit about 25 minutes apart, so the same fire is seen up to three times. Adding them would triple-count. | READY |
| 10 | What about the first two years, when only Terra existed? | Before July 2002 MODIS means Terra alone, so that period has its own factor, measured against Terra-only counts in the shared years. The first Aqua detection in the Greece files is 4 July 2002. The Terra-only factor is about twice the normal one (pipeline, fire season: 5.83 by day and 8.13 by night, against 2.63 and 4.96 for Terra + Aqua; rest of the year: 9.20 and 20.12, against 3.36 and 11.52). We checked it on 2003 to 2011, years the fit never saw: Terra alone × the Terra-only factor and Terra + Aqua × the normal factor give yearly totals within about ±10% of each other in most years (0.82 to 1.15). Weak point: the Terra-only night factor outside the fire season rests on only 83 Terra detections; it touches 52 hotspots, 6% of the Terra-only period's total. | READY |
| 11 | Why NOAA-20 as the final unit? | S-NPP stopped delivering data on 2 November 2026. NOAA-20 continues, so the record ends on a sensor that is still flying. We link the two with a measured factor of 1.04 (37,673 NOAA-20 hotspots ÷ 36,168 S-NPP hotspots, 2019 to 2025). At the 2019 join, S-NPP converted to NOAA-20 units gives 3,618 and NOAA-20 counted 3,658: 1% apart. | READY |
| 12 | Why did you drop low-confidence detections, and why that MODIS cut-off? | To remove likely false alarms. For MODIS, "below 30" is the official low-confidence class (MODIS user's guide, table 11: low under 30, nominal 30 to under 80, high 80 to 100). It is the same class we drop for VIIRS, where it is marked "l". It removes about 4% to 6% of rows from each sensor. | READY |
| 13 | The challenge mentions industrial burning. Why did you remove it? | We keep vegetation fires, including agricultural burns. We remove fixed industrial heat sources, because a factory that is hot every day would hide the fire signal a fire officer is looking for. It is a stated choice. | READY |
| 14 | Why the median and not the average? | One extreme year, such as 2007 or 2023, would pull an average up and make every other year look calm. The median is not moved by one extreme. The mean is in the CSV for those who want it. | READY |
| 37 | Why do you add Terra and Aqua together, but not the VIIRS satellites? | What must stay constant is the number of looks per day. Terra and Aqua pass at different times, so each pass is a new observation: four looks a day. The VIIRS satellites pass within minutes of each other and see nearly the same thing, so we use one at a time: two looks a day. Adding them would raise the looks from 2 to 4 in 2018 with no change on the ground. | READY |
| 38 | Why not put both sensors on a common 1 km grid and count cells? | We tested it. The ratio falls from 3.4 to about 2.8 and stays there whatever the cell size. A grid fixes only the part where one fire lights several small pixels. Most of the gap is fires MODIS never saw, and no grid brings those back. | READY (grid rows counted on one machine; make it proof 7 to confirm) |
| 39 | NASA built the VIIRS 750 m product for continuity with MODIS. Why not use it? | We know it. FIRMS distributes only MODIS 1 km and VIIRS 375 m, and the challenge lists FIRMS and asks for the "greater detail" of VIIRS. The 750 m product also starts in 2012 and has no morning pass, so it would still need a factor. We name it as a next step: it would separate the resolution effect cleanly. | READY |
| 40 | What is your factor of about 3.4 actually made of? | Two things. Sensitivity: on days when Aqua and VIIRS pass within minutes, Aqua sees about 1 in 4 of the places where VIIRS sees fire. Resolution: where both see the same fire, VIIRS gives about 2.4 to 2.8 pixels for each MODIS pixel. It also holds the difference in overpass time, because Terra passes in the morning and VIIRS does not. | READY as a quick check; NEEDS NUMBER if proof 6 is built |
| 41 | Why does the type filter matter so much? | Rows that are not vegetation fires are 1.6% of MODIS but about 15% to 17% of VIIRS. VIIRS sees about ten times more fixed heat sources. Without the filter the factor would come out too large. | READY |
| 42 | What kind of question can your record not answer? | Where exactly a small fire burned in 2005, or how many hotspots one village had in one month of 2003. The method corrects totals, not single fires, and the factor is an average that does not hold for very small areas or counts. | READY |

## B. Proof and limits

| # | Question | Draft answer | Status |
|---|---|---|---|
| 15 | How do you know it matches real fires? | We compared daily hotspots with Copernicus burned-area maps for two fires. Evros 2023 grew from 8,529 ha to 72,344 ha between 21 and 23 August, and our hotspots show ____ on those days. | NEEDS NUMBER |
| 16 | How do you know the pre-2012 numbers are sensible? | We compared our yearly record with the official EFFIS burned area for Greece, 2006 to 2025. 2007, the worst year, falls in the MODIS-only period and it is also the highest year in our record. Ranked year by year, our hotspots and EFFIS burned area agree with a rank correlation of 0.71 (Pearson 0.89, pulled up by the big years 2007, 2021 and 2023). Hotspots are not burned area, so we do not expect a perfect match. | READY |
| 17 | What can your tool not do? | It counts hotspots, not burned area. Fast fires between satellite passes leave few hotspots (Mati 2018). Clouds and smoke hide fires. Small areas have a wider uncertainty. The latest months are provisional. | READY |
| 18 | Does it work outside Greece? | The pipeline takes a country as a setting. We ran it for ____ and got ____. / We have only run Greece so far; the method is not specific to it. | OPEN until a second country is run |
| 19 | What is new here? | A hotspot-level record from 2000 that anyone can query for any area; the arithmetic shown behind every estimate; the proof inside the product; and measured ratios for the Mediterranean that we found published nowhere. | READY (re-check the "other tools start in 2012" claim) |
| 20 | What did you find that nobody could see before? | Pipeline (day/night and season factors): 2007 had 22,224 NOAA-20-equivalent hotspots, about 2.3 times 2021 (9,545) and 2.4 times 2023 (9,376). For a whole year the blind test missed by 7% on average (worst 13%), so even 13% lower, 2007 is about twice either year. Close to the quick check (21,200). Do not say the order of 2021 and 2023 "matches" burned area: they are nearly equal in hotspots, while 2023 burned more hectares. | READY |

## C. The user and the design

| # | Question | Draft answer | Status |
|---|---|---|---|
| 21 | Who is your user? | Two groups, chosen by the team. Rescuers and emergency responders, who need to compare with history so they can prepare for the dangerous months. And research teams and environmental scientists, who need consistent data for their work. An example of the first: the duty officer of a regional fire service, responsible for one area. | READY |
| 22 | Did you talk to a real user? | ____ (Say exactly what happened: nobody, a mentor as a stand-in, or a real person. Do not stretch it.) | OPEN |
| 23 | What did you change after testing? | We tested with ____ people. ____ did not work. We changed ____. | OPEN until the test is done |
| 24 | What other solutions did you consider? | Adding the sensors, coarsening to a grid, harmonizing fire power, factors by land cover. See the options table in section 18.3 of the plan, plus our own brainstorm: ____. | READY, plus the brainstorm |
| 25 | Why Greece only? | A complete tool for one country beats a half-working one for the world. Greece has two fires everyone here remembers, which let us check the record against reality. | READY |
| 34 | How does a record of past fires help avoid future ones? | It does not predict or stop a fire. It shows when and where burning normally peaks in an area, including agricultural burns, so patrols, burning bans and readiness can be timed for the dangerous months. It helps people prepare and reduce the risk. | READY |
| 35 | Does it tell me the probability of fire? | No. It shows how much and how often each month burned over the past 26 years. That is a historical frequency, not a forecast. Forecasting needs weather and fuel data, which we left out on purpose. | READY |
| 36 | What does a researcher get that the NASA files do not give? | One record on one scale across the sensor change, a weight on every hotspot that shows the correction, a measured error, and open code to rebuild it. | READY, once the dataset release exists |

## D. Technology and the future

| # | Question | Draft answer | Status |
|---|---|---|---|
| 26 | How is it built? | NASA files go through a Python pipeline into a PostgreSQL database with map functions (Supabase). The website is React on GitHub Pages and asks the database for the area the user draws. | READY |
| 27 | Will it still work when MODIS is switched off in 2027? | Yes. The record already ends on NOAA-20, and MODIS is used only for the years before 2012. | READY |
| 28 | How is it kept up to date? | ____ (Daily update on our server / data through ____, updated by re-running the pipeline.) | OPEN until built |
| 29 | Can others use your data? | Yes. The code is Apache-2.0, the harmonized hotspots download as CSV, and the calendar function has an open web address. | READY |
| 30 | What comes next? | More countries by changing one setting, an alert when an area goes above its normal, and a citable dataset release. | READY, once the team confirms |

## E. AI and the rules

| # | Question | Draft answer | Status |
|---|---|---|---|
| 31 | What did the AI do, and what did you do? | AI tools helped with literature search, checking sources, planning discussion and writing code, all listed in our AI-use log. We chose the challenge, the region, the fires and the user, decided the method, reviewed every result, and can explain every step. | READY, and it must stay true |
| 32 | Whose idea was the harmonization method? | It follows published practice (GFED5NRT). We discussed the options with AI help, which we disclose, and we made each decision ourselves: ____ (name one you changed or argued about). | OPEN until the team has gone through section 4 |
| 33 | Did you start before the hackathon? | Before the start we did research and planning, and we downloaded the public NASA files under the organisers' email permission. No code existed before 09:00; the repository's first commit shows it. | READY (keep the email) |

---

## Decision log

One row per decision, newest at the bottom. This is the memory of the build: if someone asks "why did you do it that way?", the answer is here.

| When | What we decided | Instead of | Why | Question it answers |
|---|---|---|---|---|
| Sat 01:30 | Fit the factor on Feb 2012 to Dec 2019 | All shared years | MODIS orbits drift after 2020 | 3, 5 |
| Sat 01:30 | Switch to NOAA-20 on 1 Jan 2019 | 2018 | The NOAA-20 archive starts 1 Apr 2018, so 2018 is partial | 11 |
| Sat 01:30 | A separate factor for the Terra-only period | One MODIS factor | Aqua data starts in mid-2002 | 10 |
| Sat 02:00 | Supabase database, website on GitHub Pages | Own server on the VPS | Exact area queries with no server to maintain | 26 |
| Sat 10:45 | The current-month card became a must-have | A should-have | The challenge names that comparison twice | 28 |
| Sat 12:00 | The range on estimates comes from the blind-test error | Lowest and highest yearly ratio | It is the measured error of a real prediction | 7 |
| Sat afternoon | Our users are rescuers, research teams and environmental scientists. Their need is historical comparison for preparation. (Decided and written by the team.) | One "duty officer" user proposed during planning | The team's own view of who is helped; it also matches the challenge's audience | 21, 34, 35, 36 |
| Sat afternoon | We say "prepare and reduce the risk", not "avoid" or "predict" | Claiming prevention or probability | The tool shows history, not a forecast | 34, 35 |
| Sat afternoon | MODIS cut-off "below 30" confirmed as the official low class | Calling it our own convention | Verified in the MODIS user's guide, table 11 (second team member) | 12 |
| Sat afternoon | Keep the 375 m VIIRS product; name 750 m as a next step | 750 m as the main source (suggested by ChatGPT) | Not on FIRMS, still needs a factor, does not fit in 30 hours | 39 |
| Sat afternoon | A factor, not a common grid | Counting cells on a 1 km grid (suggested by ChatGPT) | Tested: the ratio stops at about 2.8 | 38 |
| Sat afternoon | No alert system and no day-by-day calendar | Both suggested by ChatGPT | The challenge asks for months and years against the median | 30 |
| Sat afternoon | Person B owns proofs 6 and 7 as scripts in the repository | Person A doing all analysis | She already ran both as quick checks; it costs A nothing | 38, 40 |
| Sat 17:08 | Cleaning: pick the confidence rule (MODIS below 30, VIIRS "l") row by row, and stop on an unknown satellite code | Decide from the first row of the file; let unknown codes become blank | A mixed table would have been filtered with the wrong rule without any error. Counts on the real files did not change: MODIS 43,623, S-NPP 70,197, NOAA-20 39,984 kept | 12, 41 |
| Sat 17:08 | F1 split by day and night; F2 one number for day and night together | F2 by day and night too | Plan, section 4: day/night matters for MODIS (3.04 against 5.54) because MODIS and VIIRS pass at different times; S-NPP and NOAA-20 share one orbit | 2, 11 |
| Sat 17:08 | First pipeline factors: F1 3.04 day, 5.54 night; Terra-only 7.52 day, 9.13 night; F2 1.04. All match the quick check exactly | | Fit 2012-02 to 2019-12 (F1), 2019 to 2025 (F2) | 1, 10, 11 |
| Sat 17:08 | Joins checked: in 2012, MODIS converted gives 7,519 and S-NPP converted 7,508 (0.1% apart); in 2019, S-NPP converted 3,618 against NOAA-20 3,658 (1%) | | The harmonized record has no fake jump at either join | 1, 7 |
| Sat 17:08 | 2001 (14,068) is real, not a bug: 1,453 Terra detections in Sep to Nov, small, daytime, in the northern plains | Treating it as an error | Spread over 74 days and many places; looks like agricultural burning, which we keep on purpose | New question below |
| Sat 17:08 | The run stops if a factor would divide by zero | Silently infinite weights | A blind-test refit on a short window could hit an empty count | 7 |
| Sat 17:26 | Database: visitors can call only our four functions; all tables are locked (Row Level Security with no rules, plus read rights removed). The functions run with the owner's rights inside a fixed search path | Public read rules on the tables | Nobody can download the whole table or run their own heavy queries; tested: a direct read as a visitor gets "permission denied" | 29, new question below |
| Sat 17:26 | `calendar` returns every month of the record, with zeros for months that had no hotspots | Only months with hotspots | The browser's median needs the zero months; a missing month would raise the normal | 14 |
| Sat 17:26 | Visitor time limit raised from Supabase's default 3 s to the planned 10 s | Keeping 3 s | Plan, section 9.4: an all-Greece calendar must not be cut off. Row caps still apply (20,000 map points, 200,000 export rows) | New question below |
| Sat 17:26 | `geom` is computed by the database from latitude and longitude | The loader writing it | One less thing the pipeline can get wrong | 26 |
| Sat 17:30 | Peak season = the calendar months with the highest normal, added from the top until they hold at least 60% of a normal year (`PEAK_SEASON_SHARE = 0.6` in `web/src/lib/stats`) | 50% (often a single month) or 80% (about half the year) | "Most of" a normal year, while still naming a short season a fire service can plan around | New question below |
| Sat 17:30 | "Difference from normal" (second calendar view) = the month's value minus its normal (median), in hotspots | A ratio | A ratio breaks when the normal is 0 | 14 |
| Sat 17:30 | A month is ranked against every finished month of that name, including those in the partial years 2000 and 2026; the normal uses only the complete years 2001 to 2025; the current month is never ranked | Ranking against 2001 to 2025 only | Gives "the highest in 26 years" as the plan writes it; a finished month is complete even when its year is not | 14 |
| Sat 17:30 | Complete years are worked out from the data (12 months present, not the current year), not written as 2001 to 2025 | Fixed years | Stays right when 2026 ends; relies on `calendar` returning zero months (decided 17:26) | 14 |
| Sat 17:45 | Map: Leaflet with the Leaflet-Geoman drawing tool | MapLibre | Free, no map key, and drawing a shape works out of the box | 26 |
| Sat 17:50 | The `Nasa` repository is made public; the website is built and published by a GitHub Actions workflow on every push to `main` (tests must pass first) | A new public repository with only the code | GitHub Pages needs a public repository on the free plan; the planning notes are removed from it at the end (plan, final checklist) | 26, 29 |
| Sat 17:43 | Blind test result: fire-season months miss by 37.4% on average (worst 70.2%), whole years by 9.3%, single 1° squares by 29.7% per year (32 square-years). The range shown on estimates is ±37% | The yearly error (9%) | Plan, section 4, step 7: the calendar shows months, and monthly errors are larger | 7 |
| Sat 17:43 | "Fire season" for the error = June to September (`FIRE_SEASON_MONTHS` in `pipeline/config.py`) | May to October; the app's peak-season rule | Our choice: the summer peak, one setting to change | 7 |
| Sat 17:43 | Error = the average of the absolute monthly misses in %; the worst month is reported too | Median; total miss ÷ total count | Simplest to explain; the worst month shows the spread honestly | 7 |
| Sat 17:43 | Small-area error: 1° squares, one value per square and year, only where S-NPP saw at least 100 hotspots that year | Every square | Squares with a handful of hotspots give meaningless percentages | 7, 17 |
| Sat 17:43 | Sanity check rewritten as "August 2021 and 2023 are the two highest Augusts **since 2012**". **Confirmed by the team at 17:52.** | The plan's "the two highest Augusts" | Harmonized August 2007 (13,138) is above both (6,893 and 5,736). That is our expected finding, so the check as the plan wrote it would contradict the plan itself | 20 |
| Sat 17:43 | Season split tested, not adopted. F1 in June to September 2.63 by day and 4.96 by night; rest of the year 3.36 and 11.52. It lowers the blind fire-season error from 37.4% to 26.4% and 2007 from 24,134 to 22,223. **Adopted by the team at 17:52 (row below).** | Adopting it now | The team asked for one country factor this round; the plan says a refinement that wins the blind test should be kept | 8, new question below |
| Sat 17:43 | Proof data saved as small JSON files in `web/public/proof/` by `pipeline/validate.py` | Reading them from the database | Plan, section 5: the proof page works even if the database is down | 15, 16 |
| Sat 17:52 | **Season split adopted (team decision).** F1 is now measured for June to September and for the rest of the year, each by day and night, for Terra + Aqua and for Terra only: 8 numbers. F2 stays one number | One F1 for the whole year | It wins the blind test (plan, section 4: keep a refinement only if it wins). Fire-season months 37.4% → 26.3%, whole years 9.3% → 7.0%, 1° squares 29.7% → 27.4% | 2, 7, 8, 10 |
| Sat 17:52 | New factors (Feb 2012 to Dec 2019). Terra + Aqua: fire season 2.63 day, 4.96 night; rest 3.36 day, 11.52 night. Terra only: fire season 5.83, 8.13; rest 9.20, 20.12. F2 1.04 | | Pipeline run | 10, 31 on the page |
| Sat 17:52 | New range on estimates: ±26% (blind test, fire-season months; worst month 55%) | ±37% with one factor | Measured error of the method we ship | 7 |
| Sat 17:52 | New finding: 2007 = 22,224 NOAA-20-equivalent hotspots (was 24,134), about 2.3 times 2021 and 2.4 times 2023 | | Pipeline run with the season split | 20 |
| Sat 17:52 | Keep the Terra-only night factor outside the fire season (20.1) although it rests on only 83 Terra detections | Falling back to a pooled factor | It touches 52 hotspots, 6% of the Terra-only period's total; a fallback rule would add code for little change. Stated as a weak point | 10 |
| Sat 17:52 | The database `factors` table gains a `season` column (key: name, season, daynight) in `db/schema.sql`. **Not yet applied to Supabase** | | Matches the new factor table | 26 |

## New questions

Add any question you hear or think of here, with the time. Move it to a table above once it has an answer.

| When | Asked by | Question | Answer |
|---|---|---|---|
| Sat 17:30 | Team (Person B) | How do you keep keys out of a public repository? | Keys live only in `.env`, which Git ignores; the website holds only the public (publishable) key; Row Level Security blocks direct table reads; visitors can call only our four functions. |
| Sat 17:08 (numbers 17:52) | Pipeline run | Why is 2001 so high (15,282, second only to 2007)? | Terra alone saw 1,453 hotspots in September to November 2001, against about 200 to 600 in the same months of later years. They are small, mostly daytime and in the northern farming plains, over 74 days, so they look like agricultural burning (not verified), which we keep on purpose. The Terra-only factor outside the fire season (9.2 by day) is large, so they weigh a lot. Say the cause is our reading, not a verified fact. |
| Sat 17:08 | Pipeline run | In 2023 MODIS converted gives 13,074, but NOAA-20 counted 9,376. Does the method fail? | 2023 is after the MODIS orbits started drifting, which is why those years are not used for the fit and MODIS is not used after Jan 2012. A year with a few very large fires (Evros) may also suit the average factor less well. These are likely reasons, not tested ones. In the fit years 2012 to 2017 the two agree much better. |
| Sat 17:26 | Database build | Your database is open to anyone on the web. Can someone steal or overload it? | Visitors cannot read any table. They can only call four functions, each with limits: a drawn shape of at most 500 corners, a 10-second time limit, at most 20,000 map points, and exports in pages of 10,000 that stop at 200,000 rows. The data is public NASA data anyway; the limits protect the free plan. The database password is only in a private file, never in the website. |
| Sat 17:43 | Pipeline run | Your blind test over-predicts the summer months. Is 2007 too high? | Yes, probably somewhat. With one factor for the whole year, 11 of 12 June-to-September months in the test were over-predicted, by about 30% on average, while whole years came out within 12%. MODIS seems to catch a larger share of summer fires than of the small burns in the rest of the year. So we adopted a separate factor for June to September (decided 17:52). It brings 2007 from 24,134 down to 22,224 and the blind fire-season error from 37% to 26%. 9 of 12 summer months are still over-predicted, so a little bias remains. Even 30% lower, 2007 would still be well above 2021 (9,545) and 2023 (9,376), so the finding holds. |
| Sat 17:30 | Website build | How do you decide which months are the "peak season"? | We take the months with the highest normal (median) values, largest first, until together they hold 60% of a normal year's hotspots, and name them as a phrase such as "July to September". 60% is our choice: lower often names one month, higher names half the year. It is one constant, easy to change. |
| ______ | ______ | ______ | ______ |
