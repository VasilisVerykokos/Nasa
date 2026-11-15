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

- **Live app:** https://vasilisverykokos.github.io/Nasa/
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
- **The MODIS satellites are drifting.** Terra made its final orbit correction on 27 February 2020 and Aqua on 8 March 2021. They now pass at different times of day than before, so their newest data no longer compare with their old data. [CHECK: add "and are planned to stop in 2027" only if verified-facts.md marks it VERIFIED. Today it is second-hand.]
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
| "accessible color ramps" | Every cell shows its number on hover, focus (arrow keys) or tap, and the whole calendar can be shown as a table that a screen reader can read. Estimated, missing and provisional months are marked with patterns as well as colour. [CHECK: say "colour-blind-safe" only after testing the colours with a colour-blindness simulator.] |
| "download analytics and visualizations" | The calendar as CSV and as an image |
| "A downloadable CSV File of hot spots detected during a search" | Every hotspot in the area, with all its columns and its harmonization weight |

The page also says clearly when an area lies outside Greece, when it had no hotspots, or when the connection is lost (with a "Try again" button), and it shows the date the data runs to.

[IMAGE 2: the North Evia calendar with the headline sentence and the rankings. Caption: "North Evia: August 2021 stands out in 26 years of the harmonized record."]

### How it works

**1. Clean.** We keep vegetation fires, including agricultural burns, which the challenge counts as burning activity. We remove low-confidence detections (for MODIS, exactly the official "low" class, below 30) and fixed heat sources such as factories, which would hide the fire signal. This matters more than it looks: 16.9% of S-NPP rows and 14.5% of NOAA-20 rows are not vegetation fires, against 1.6% of MODIS rows (`pipeline/clean.py`).

**2. Never add satellites that see the same thing.** What must stay constant across the record is the number of looks per day. Terra and Aqua pass at different times, so together they give four looks a day, and we add them. S-NPP and NOAA-20 see nearly the same fires: over 2019 to 2025, NOAA-20 recorded 1.04 hotspots for every S-NPP hotspot. Adding them would count most fires twice, so we use one at a time. [CHECK: "they share one orbit, about 25 minutes apart" is still second-hand in verified-facts.md; add it only if verified.]

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

- **Open code**, Apache-2.0, with the steps to rebuild everything from NASA's public files in the README. [CHECK: the README's rebuild steps were tested on a clean machine (MASTER-PLAN section 18.6).]
- **Open data:** every hotspot download carries its weight. [NOT BUILT YET: the full harmonized dataset for Greece with a description of every column, as a GitHub release.]
- [FILL: "Use our data": the web address of the `calendar` function, what to send and what comes back (Person A).]

**Next steps** [CHECK: the team picks three of these four]

1. **More countries.** The pipeline takes the country as a setting, so the Mediterranean means running it and checking the proofs for each one.
2. **NASA's VIIRS 750 m continuity product as a bridge,** to separate the resolution effect cleanly.
3. **A citable, versioned dataset** that scientists can reference.
4. **An alert** when an area goes above its normal for the month.

---

## NASA data

- NASA FIRMS, MODIS Collection 6.1 active fire product (Terra and Aqua), yearly country files for Greece, 2000 to 2025
- NASA FIRMS, VIIRS 375 m active fire products (S-NPP and NOAA-20), yearly country files for Greece
- [CHECK: NASA FIRMS Area API for 2026, if the 2026 data is loaded]
- MODIS Collection 6 and 6.1 Active Fire Product User's Guide; FIRMS FAQ; NASA VIIRS Land, Active Fire Product page

## Space agency partner and other data

- Copernicus Emergency Management Service, activations EMSR527 (North Evia 2021) and EMSR686 (Evros 2023): areas of interest and burned-area products
- EFFIS (European Forest Fire Information System) Statistics Portal: yearly burned area for Greece, 2006 to 2025
- Natural Earth, 1:10m countries (public domain): the outline of Greece
- Map © OpenStreetMap contributors (ODbL)

## References

[FILL: copy `hotspot/REFERENCES.md` here in full on Sunday: every dataset, paper, library and service.]

## Use of artificial intelligence

The code was written with Claude Code, under the team's direction and review. Every AI-assisted file carries a one-line note at its top, and every session is logged in `hotspot/AI_USE.md`. The team decided the method and can explain every step of it. AI tools used: Claude and Claude Code (planning, source checking, code, quick counts), Gemini (literature search, fact-checked), ChatGPT (a plain-language explanation of the topic in Greek; its suggestions were checked and not adopted). [CHECK: add Impeccable only if it was used.] No AI-generated images are used. [FILL: copy `hotspot/AI_USE.md` here in full on Sunday.]
