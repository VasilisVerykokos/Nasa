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
| 1 | Why can't you simply add the MODIS and VIIRS hotspots together? | VIIRS is sharper (375 m against 1 km), so it finds several times more hotspots for the same fires. Adding them makes fire activity seem to jump in 2012, when only the sensor changed. In Greece the jump is ____ times. | NEEDS NUMBER |
| 2 | How does your harmonization work, in one minute? | In the years both sensors flew, we count how many VIIRS hotspots there are for each MODIS hotspot. That ratio becomes a weight on every older MODIS hotspot. From 2012 we use VIIRS directly. A month's value is the sum of the weights in the chosen area. | READY |
| 3 | Why is the factor fitted on 2012 to 2019 only? | VIIRS data starts in January 2012, so it cannot start earlier. After 2019 the MODIS satellites drift: Terra's last orbit correction was February 2020 and Aqua's was March 2021. They then pass at a different time of day and see a different number of fires. Including those years would mix two effects. | READY |
| 4 | How is this different from GFED5NRT (Chen et al. 2026)? | Same core idea: scaling factors from the shared years, vegetation fires only, and we reuse their rule for masking factories. Differences: they produce gridded burned area and emissions at 0.25° for scientists, with factors for 14 regions and 16 land-cover types. We keep a weight on every single hotspot, so any drawn area is exact, and we built a tool a non-specialist can use. We did not do their viewing-angle correction; it needs image products that are not in the hotspot files. | READY, but one of us must read their method section first |
| 5 | Why did you fit on 2012 to 2019 when GFED5NRT used 2012 to 2022? | We chose to stop before the drift. If asked for evidence: we ran it both ways and the factor changed by ____ %. | OPEN until that check is run |
| 6 | Why are values before 2012 called estimates? | VIIRS was not in orbit, so nobody measured what it would have seen. The MODIS counts are real measurements; only the conversion is estimated. Comparisons inside the MODIS years barely depend on the factor, because it cancels out. | READY |
| 7 | How sure are you about the estimates? | We tested blind: fitted on 2012 to 2016, predicted 2017 to 2019 from MODIS alone, and compared with what VIIRS really saw. The error was ____ % for fire-season months. That error is the range shown on every estimate. | NEEDS NUMBER |
| 8 | Why one factor for the whole country? Fires differ. | We tested finer factors (by season, by 1° square) with the same blind test and kept the one with the smallest error: ____. We state as a limit that MODIS misses small agricultural burns more than forest fires. | NEEDS NUMBER |
| 9 | Why are there three VIIRS satellites but you use one at a time? | They share one orbit about 25 minutes apart, so the same fire is seen up to three times. Adding them would triple-count. | READY |
| 10 | What about the first two years, when only Terra existed? | Before July 2002 MODIS means Terra alone, so that period has its own factor, measured against Terra-only counts in the shared years. The first Aqua detection in the Greece files is 4 July 2002. The Terra-only factor is about twice the normal one (quick check: 7.86 against 3.41; pipeline: ____). | READY; number from the pipeline |
| 11 | Why NOAA-20 as the final unit? | S-NPP stopped delivering data on 2 November 2026. NOAA-20 continues, so the record ends on a sensor that is still flying. We link the two with a measured factor of ____. | NEEDS NUMBER |
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
| 16 | How do you know the pre-2012 numbers are sensible? | We compared our yearly record with the official EFFIS burned area for Greece, 2006 to 2025. 2007, the worst year, falls in the MODIS-only period and it ____. | NEEDS NUMBER |
| 17 | What can your tool not do? | It counts hotspots, not burned area. Fast fires between satellite passes leave few hotspots (Mati 2018). Clouds and smoke hide fires. Small areas have a wider uncertainty. The latest months are provisional. | READY |
| 18 | Does it work outside Greece? | The pipeline takes a country as a setting. We ran it for ____ and got ____. / We have only run Greece so far; the method is not specific to it. | OPEN until a second country is run |
| 19 | What is new here? | A hotspot-level record from 2000 that anyone can query for any area; the arithmetic shown behind every estimate; the proof inside the product; and measured ratios for the Mediterranean that we found published nowhere. | READY (re-check the "other tools start in 2012" claim) |
| 20 | What did you find that nobody could see before? | ____ (the finding, must-have 9, with its range). Expected from the quick check: 2007 had roughly twice the hotspot activity of 2021 or 2023 (about 21,200 NOAA-20-equivalent against 9,545 and 9,376). Do not say the order of 2021 and 2023 "matches" burned area: they are nearly equal in hotspots, while 2023 burned more hectares. | NEEDS NUMBER |

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
| ______ | ______ | ______ | ______ | ______ |
| ______ | ______ | ______ | ______ | ______ |
| ______ | ______ | ______ | ______ | ______ |

## New questions

Add any question you hear or think of here, with the time. Move it to a table above once it has an answer.

| When | Asked by | Question | Answer |
|---|---|---|---|
| Sat 17:30 | Team (Person B) | How do you keep keys out of a public repository? | Keys live only in `.env`, which Git ignores; the website holds only the public (publishable) key; Row Level Security blocks direct table reads; visitors can call only our four functions. |
| ______ | ______ | ______ | ______ |
| ______ | ______ | ______ | ______ |
