# MASTER PLAN: HOTSPOT, one consistent fire record from MODIS + VIIRS hotspots

NASA Space Apps Challenge 2026, challenge "Harmonization of MODIS and VIIRS Hot Spots".

- Written Saturday 14 Nov 2026, 01:30 local time, **before the 09:00 start**. It is planning only and contains **no code**. Nothing in it may be built before 09:00.
- **Updated Saturday 14 Nov, 10:45**, against the official judging criteria shown at the Local Event and the full challenge text. Changed: the judging table (section 2), the challenge checklist and must-haves 3, 5, 6, 8 and 12 (section 3), the method refinements (section 4), the schedule (sections 10 and 11) and the project page outline (section 12). Section 18, on the organisers' six design steps, was added the same morning.
- **Merged Saturday afternoon:** the second team member's notes (`FOR-MASTER-PLAN.md`, written after the start). Her counts were re-run on this machine and match exactly. Changed: the skip list (section 3), the method (section 4: looks-per-day rule, type-filter numbers, why a grid fails, limits), proofs 6 and 7 (section 5), expected values (section 9.7), the team split (section 11), ChatGPT in the AI log (sections 7 and 16).
- **Merged Saturday 17:40, on the second machine (Person B):** the rest of `FOR-MASTER-PLAN.md`, which is now deleted. Added: the challenge's difficulty and subjects (section 1), the 750 m side check and the grid-test overlap share (sections 3 and 4), the expected values for proof 6 (section 5), the Greece outline extent (section 9.1), the fake-jump numbers, the Aqua-only ratio and the finding's range (section 9.7), the key check before every push and a `.gitignore` line (section 9.8). Everything else in that note was already here or in `verified-facts.md`.
- Drafted with AI help (Claude) from the team's discussion. List this in the AI-use disclosure (section 16).
- Companion file: `verified-facts.md` in this folder. Every fact used here comes from it, with its status (verified, second-hand, unverified). When the two files differ, the facts file wins.

---

## 0. Read this first

**Settle before 09:00 (allowed, because it is not building):**

1. The local deadline is **Sunday 15:00**, which gives 30 hours from Saturday 09:00. Ask the Local Lead about the pitch format.
2. Confirm every team member is registered at the same Local Event.
3. Have accounts ready: GitHub, Supabase, and a free NASA FIRMS MAP_KEY.
4. Sleep.

**Three changes I made while writing this plan (not discussed before):**

1. **Terra-only period.** Aqua data starts in July 2002 (verified on 14 Nov: the FIRMS FAQ says July 2002, and the first Aqua detection in the Greece files is 4 July 2002). From November 2000 to June 2002 MODIS means Terra alone, so that period needs its own scaling factor.
2. **Switch to NOAA-20 on 1 January 2019, not 2018.** The NOAA-20 archive starts on 1 April 2018, so 2018 is a partial year.
3. **A fourth proof:** harmonized yearly hotspots against the official EFFIS burned area for Greece, 2006 to 2025. The numbers are already in the facts file.

**About the quick-check numbers.** The Greece numbers from our chat (ratio about 3.4, August 2021 = 6,703 hotspots, and so on) came from a quick look before the start. Treat them as feasibility research only. Do not put them on the project page. The pipeline recomputes everything after 09:00. On 14 Nov, after the start, the same counts were made again on both team machines and agree (section 9.7, expected values). They are still only targets; the page uses the pipeline's numbers.

---

## 1. Topic and goal

**The challenge asks for:** a web app that merges MODIS (1 km, since November 2000) and VIIRS (375 m, since 2012) fire hotspots from NASA FIRMS into one consistent record, and shows a "burning activity calendar" (months × years) for an area and date range the user chooses. It should compare a month with the historical median, use colour ramps everyone can read, and let the user download the hotspots as CSV. Difficulty on the challenge page: Intermediate and Advanced. Subjects: Earth Science, Software.

**Our project in one sentence:** pick any area in Greece and see 26 years of fire activity on one consistent scale, with proof that the scale is consistent.

**Why this can win**

- The hard part of the challenge is the harmonization, and most teams will simply add the sensors together. We measure the correction, test it blind, and show the proof.
- Existing public tools we looked at (Global Forest Watch, Our World in Data) start their fire record in 2012. Ours starts in 2000. Re-check this claim before writing it on the project page.
- No published VIIRS-to-MODIS count ratio exists for the Mediterranean, and no published hotspot counts exist for our two case-study fires (facts file, section 4.5). Our numbers would be new.
- A small tool that fully works beats a big one that half works. Greece first, more only if everything else is finished.

**Case studies:** North Evia, August 2021, and Evros/Dadia, August to September 2023. Mati 2018 is not a case study: it burned about 1,300 ha in hours and left few hotspots. Mention it only as a stated limit of satellite hotspots.

**Project name: HOTSPOT**, written without dots. Subtitle, given once: "Harmonized Observations of Thermal Sensors for Pyro-Occurrence Trends". Before committing, look at the Teams tab on the challenge page for similar names.

**Team name:** not decided. Reuse HOTSPOT or pick a separate one: ______________________

**Awards that fit:** Best Use of Data, Best Use of Science, Local Impact.

---

## 2. Rules we must not break

Full list with sources: facts file, section 1.

| Rule | What we do |
|---|---|
| No work before Saturday 09:00 | A brand-new repository created after 09:00. No AEGIS code is reused. |
| Demo is a 30-second video OR at most 7 slides | Going over means no Global Judging. We make a 30-second video. |
| Everything in English, all links public, no login | Test every link in a private browser window before submitting. |
| Every source, library and dataset is cited | `REFERENCES.md` is filled in as we go, not at the end. |
| Open source | Apache-2.0 licence file from the first commit. |
| AI use is disclosed | `AI_USE.md` log, a note in the README, a header note in AI-written files, watermark on any AI image. |
| AI must not come up with the idea | The team must own the idea and be able to explain every step of the method. Read section 4 until you can explain it without notes, and change what you disagree with. |
| At least one NASA data source | NASA FIRMS is the core of the project. |
| No NASA logos, nobody under 18 in the materials | Screen recording only. |

### Judging criteria

Each is scored 1 to 5. The questions below are the official wording, copied from the slide shown at the Local Event on 14 Nov 2026.

| Criterion | The official questions | Our answer | Our weak point, and what raises it |
|---|---|---|---|
| **Impact** | "How much impact (quality and quantity) can this project have? Does it solve a big problem or a little problem? Will it inspire or help many, or a few?" | Wildfire is a big problem, and every long fire record breaks when MODIS ends in 2027. Our audience is the challenge's own: early warning and emergency responders, scientists, land managers, firefighters. | The app covers one country, which can read as "a few". Show that the method is general: the open dataset (value-add A), a second country (value-add B), the open address, the rebuild steps. Name three concrete decisions the tool supports (section 12). |
| **Creativity** | "How creative/innovative is the approach? Is the project novel and something that hasn't been attempted before, or is it an incremental improvement on something that already exists?" | A hotspot-level harmonized record from 2000 that anyone can query for any area; every number traceable to the NASA detections behind it; the proof built into the product. | **Our weakest criterion.** The challenge prescribes the product and the method follows published practice. Raise it with the "show the arithmetic" tooltip, the raw-versus-harmonized switch, the finding, and a table of what exists against what we add. |
| **Validity** | "Is the solution scientifically valid? Will it do what it sets out to do? Can it work in the real world?" | Five proofs, a blind test, stated limits, and checks that stop the pipeline when a number looks wrong. | "Real world" means it is online and current when judges visit: the 2026 data, the Supabase pause risk (decision 1 in section 14), the daily update. |
| **Relevance** | "Is this project responsive to the challenge for which it was submitted? Is it a complete solution or does it have a long way to go? Is it technically feasible? How usable or user friendly is the solution?" | Every phrase of the challenge text is mapped to a must-have (challenge checklist, section 3). | "Usable" is only a claim until someone outside the team tries it. Do the five-minute test in section 9.7. |
| **Presentation** | "How well did the team communicate their project (on their project page, in particular)? Were they effective in telling the story of the project: the challenge, the solution, and why is it important?" | The project page follows exactly that order: the challenge, the solution, why it is important (section 12). | Depends on execution. Protect the five hours on Sunday and the proofread. |

- **Validity is our strongest card.** Few teams will prove their numbers are right. Never cut the proofs.
- **Relevance punishes missing pieces.** "Is it a complete solution or does it have a long way to go?" A half-working feature costs more than a missing extra, so must-haves come first.
- **Creativity needs the most help.** The cheapest gains are in how the result is shown, not in new science.

---

## 3. What we build

### Challenge checklist (Relevance: "responsive to the challenge", "a complete solution")

Read from the challenge page on 14 Nov 2026. Every phrase has a home.

| What the challenge text says | Where we answer it |
|---|---|
| "harmonizes these records", so that "the sensor of origin no longer matters" | Section 4; a weight on every hotspot |
| Hotspots "from the early 2000s to the present" | The record runs from November 2000 to this week (must-have 12) |
| A user can "select a region and a specific date range" | Must-haves 1 and 2 |
| "a map where users can draw the area of interest, or an option to enter latitude and longitude" | Must-have 1 offers both |
| "which periods of the year see more fires" (also "critical periods") | Must-have 3, the "normal year" row; must-have 5, the peak season |
| "which years had more burning activity" | Must-have 3, year totals; must-have 5, top years |
| "compare the burning activity of the current month against the historical median" | Must-haves 4 and 12 |
| "unusual conditions"; "anomalies against multi-year averages" | Must-have 3, the "difference from normal" view. The CSV carries the mean next to the median. |
| "patterns, trends, and anomalies" | The calendar and its two views; the trend sentence (should-have 2) |
| "accessible color ramps" | Must-have 3 |
| "download analytics and visualizations" | Must-have 6: the calendar as CSV and as an image |
| "A downloadable CSV File of hot spots detected during a search" | Must-have 6: the hotspots CSV |
| Audience: "early warning and emergency responders, scientists, land managers, and firefighters" | Named in these words on the project page |
| Burning activity includes "wildfires and agricultural burns" | Both are kept (`type = 0`). Fixed industrial heat sources are removed; the method page says why. |

### Must have (the project is not done without these)

Items 3, 5, 6 and 8 were widened and item 12 was added on 14 Nov at 10:45, after checking the challenge text against the Relevance criterion. Nothing was removed.

1. Choose an area: draw a shape on the map, or type latitude, longitude and radius.
2. Choose a date range.
3. Calendar heatmap: rows are years, columns are months, with a colour ramp that colour-blind people can read and the number shown on hover. It has a "normal year" row (the median of each calendar month) and a total for each year. A second view shows the difference from normal.
4. One plain sentence comparing a month with the historical median. Example of the form: "August 2021 was N times the normal August here, the highest in 26 years."
5. Rankings: top months, top years, and the peak season (the calendar months that normally burn most in this area).
6. Downloads: the calendar table as CSV, the calendar as an image, and the hotspots themselves as CSV with their harmonization weight.
7. A "Method and proof" page: how the harmonization works, the proof charts, the limits.
8. The page opens on a filled example (North Evia), never on an empty screen. It gives a clear message for "no hotspots found in this area" and for "this area is outside the covered region (Greece)".
9. **One finding nobody could make before.** Example question: "Was 2007 worse than 2021 or 2023?" MODIS and VIIRS counts could not be compared; our record can answer it. State it with its uncertainty range. (30 min, Saturday evening with the proofs. Serves Impact and Creativity.) What the quick check leads us to expect is in section 9.7.
10. **"Why now" paragraph on the project page.** S-NPP ended on 2 Nov 2026; Terra and Aqua are planned to stop in 2027. Only a harmonized record keeps the 26 years usable. (15 min. Serves Relevance.)
11. **"Use our data" note** in the README and on the method page: the web address of the `calendar` function, what to send (an area), what comes back (one row per year and month), the public key, and the limits. (15 min. Serves Creativity and Best Use of Data.)

12. **The current year.** 2026 data through this week, and a "this month so far against normal" card. The challenge names this comparison twice, so it cannot stay optional. (About 1.5 hours. Sunday 05:00 at the latest; Saturday night if ahead.) If the NASA API fails, the card shows the latest complete month and says so.

Cautions for item 11:

- **It shares the monthly data allowance.** The free Supabase plan sends 5 GB a month. The `calendar` answer is tiny, so advertise only that function. Do not advertise `hotspots_export` the same way.
- **The address changes if the database ever moves** to the VPS. Update the note if that happens.
- Test the example request on the real project before publishing the note.

Every choice and what it gains us is listed in `PROJECT-PAGE-CHOICES.md` in this folder. Use it as the checklist when writing the project page.

### Should have (in this order, only after all must-haves work)

1. **Raw-versus-harmonized switch** on the calendar: the same area as it looks when the sensors are simply merged, with the fake jump in 2012. The `calendar` function already returns the raw counts, so this is a 30-minute screen change. It is the strongest single picture for Creativity and Validity, and for the video.
2. **Trend:** a bar chart of the year totals and one cautious sentence. Say "no clear trend" unless a standard trend test says otherwise, and mention the range on the years before 2012. The challenge names "trends".
3. Click a month to see its hotspots on the map.
4. Seasonal chart: the normal year against a chosen year.
5. Share link (area and dates in the web address).
6. Phone layout.
7. Daily automatic update, with the latest months marked "provisional".
8. Outline of the covered area on the map.

### Value-adds (cheap, high score; do them in the slots named)

| # | Addition | Serves | Time | When |
|---|---|---|---|---|
| A | **Publish the harmonized dataset.** One downloadable file of all Greek hotspots with weights, the factor table, and a one-page description of every column, attached to a GitHub release. | Impact ("help many"), Best Use of Data | 30 min | **Person B**, Sunday 05:00 to 07:00. The pipeline already writes the file; B writes the description and makes the release. |
| B | **Show the method works elsewhere.** Run the pipeline on one more country (Portugal or Cyprus) and report its proof numbers. If its checks pass, load it into the app too. | Impact ("many, or a few"), Validity ("can it work in the real world") | 1 hour | Person A, only when every must-have works |

A needs none of Person A's time, so do it always. B is the best answer to "only Greece?", but it comes after every must-have.

### Skip

User accounts, chatbot, fire forecasting, grouping hotspots into fire events, fire power (FRP) harmonization, the whole world on day one, land-cover-specific factors, viewing-angle correction (it needs image products we cannot get from the CSV files; facts file, section 4.2).

**Also skipped, after the team checked ideas suggested by ChatGPT on 14 Nov:**

- A fire alert or warning system. The challenge does not ask for one.
- A day-by-day calendar. The challenge asks for months and years against the median.
- Matching detections one to one between the sensors, or a 1 km common grid. We tested the grid; it does not harmonize the record (section 4, "Why a common grid fails").
- Adding MODIS, VIIRS 750 m and VIIRS 375 m together. The two VIIRS products are the same fire, on the same satellite, at the same instant.
- **The VIIRS 750 m product as the main source.** NASA built it for continuity with MODIS, so a judge may ask about it. We do not use it because FIRMS distributes only MODIS 1 km and VIIRS 375 m, the challenge lists FIRMS as its one resource and asks for the "greater detail" of VIIRS, the 750 m product also starts in 2012 and would still need a factor, and its swath files do not fit in 30 hours. Name it on the project page as a next step. A side check through it (MODIS to 750 m to 375 m, North Evia only) was considered and dropped: it would give the same final factor, its two steps would add their errors if used inside the record, and the Aqua and S-NPP coincidences (proof 6) already split resolution from sensitivity.

---

## 4. The harmonization method

The unit of the final record is the **NOAA-20-equivalent hotspot**. Every older detection gets a `weight` that converts it to that unit. A month's value is the sum of the weights inside the area.

**The goal, in NASA's words:** by the end, "the sensor of origin no longer matters". The challenge names three differences between the sensors: spatial resolution, sensitivity, and observation schedule. Our factor covers all three on average. A common grid covers part of the first only. Use these three words to structure "the problem" on the project page.

### Step 1. Clean

- Keep only vegetation fires: `type = 0`. This removes volcanoes, factories and offshore flares.
- Drop low-confidence detections: VIIRS `l`, and MODIS below 30. The MODIS classes are now verified by the second team member (MODIS Collection 6 and 6.1 Active Fire Product User's Guide, section 8.4.3, table 11): low is 0 to under 30, nominal 30 to under 80, high 80 to 100. So "below 30" removes exactly the official low class, the same class we drop for VIIRS.
- **Why the `type` filter is not a detail** (counted on the Greece files, both machines): rows that are not vegetation fires are 1.6% of MODIS, 16.9% of S-NPP and 14.5% of NOAA-20. VIIRS sees about ten times more fixed heat sources than MODIS, so without the filter F1 would come out too large. Low-confidence rows are 4.4%, 5.6% and 4.9%.
- Download fresh files. VIIRS files made before May 2025 had wrong `type` labels (facts file, 2.3).
- The challenge counts agricultural burns as burning activity, and `type = 0` keeps them. It also mentions industrial activity. We remove fixed industrial heat sources, because a factory that is hot every day would hide the fire signal. Say this on the method page as our choice.

### Step 2. Never add satellites together

Three VIIRS satellites fly the same orbit about 25 minutes apart, so adding them counts one fire up to three times. The record uses one source at a time.

**The looks-per-day rule (why Terra and Aqua are added, but the VIIRS satellites are not).** What must stay constant across the record is the number of passes per day.

- Terra (about 10:30 and 22:30) and Aqua (about 13:30 and 01:30) carry the same instrument but pass at different times. Each pass is a new observation, so they are added: 4 looks per day, constant from July 2002.
- Before July 2002 only Terra flew: 2 looks per day. That is why this period needs its own factor.
- S-NPP, NOAA-20 and NOAA-21 pass within minutes of each other and see nearly the same thing. Using one at a time keeps VIIRS at 2 looks per day. Adding them would raise the looks from 2 to 4 in 2018 and to 6 later: more hotspots with no change on the ground.

### Step 3. Measure the MODIS-to-VIIRS factor (F1)

- F1 = S-NPP hotspots ÷ MODIS hotspots, over the same place and months.
- Fit period: **February 2012 to December 2019 only.** Terra's orbit started drifting after February 2020 and Aqua's after March 2021, so later MODIS data is not comparable.
- Separate factors for day and night.
- Two versions: "Terra + Aqua" (used from July 2002) and "Terra only" (used before that).
- Granularity: start with one factor per country. Then try two refinements, each only if time allows:
  - **1° squares**, falling back to the country factor where a square has too few MODIS detections (start with a minimum of 100).
  - **Season** (the fire season against the rest of the year). MODIS misses small agricultural burns more often than large forest fires, and the two happen at different times of year, so one factor for the whole year may be wrong for both.
- **Keep a refinement only if it wins the blind test (section 5).** Otherwise ship the single country factor and say so.
- **What the factor contains.** MODIS and VIIRS never shared an orbit. Aqua and VIIRS pass at about the same time of day; Terra is a morning satellite and VIIRS has no morning pass. So F1 holds the difference in overpass time and orbit as well as the difference in pixel size. It is a factor for the whole MODIS record against VIIRS, not a pure "resolution" correction.

**Why a common grid fails (tested on the Greece files, February 2012 to December 2019).** The obvious idea is to put both sensors on the same grid and count cells with fire instead of hotspots. The second team member tested it:

| What is counted | MODIS | S-NPP | Ratio |
|---|---|---|---|
| Hotspots, no grid | 10,978 | 37,448 | 3.41 |
| Cells with fire per day, cells of about 1 km | 10,326 | 27,086 | 2.62 |
| The same, cells of about 5.5 km | 7,066 | 20,142 | 2.85 |
| The same, cells of about 11 km | 6,256 | 17,949 | 2.87 |
| The same, cells of about 28 km | 5,265 | 14,655 | 2.78 |

A grid lowers the ratio from 3.4 to about 2.8 and no further, whatever the cell size. Only 9% to 20% of the VIIRS cell-days with fire also have a MODIS detection. So "different kilometres" is two problems. One fire lights more small pixels than large ones, and a grid reduces that: the small part. MODIS never sees the small fires at all, which is sensitivity, and only a factor measured on the shared years covers it: the large part. The grid rows were counted on the second machine only; the first row was reproduced on both.

### Step 4. Measure the S-NPP-to-NOAA-20 link (F2)

F2 = NOAA-20 ÷ S-NPP over the full shared years 2019 to 2025. S-NPP ended on 2 November 2026, so the record must finish on NOAA-20.

### Step 5. Splice

| Period | Source | Weight per hotspot |
|---|---|---|
| Nov 2000 to Jun 2002 | MODIS, Terra only | F1 (Terra only) × F2 |
| Jul 2002 to Jan 2012 | MODIS, Terra + Aqua | F1 × F2 |
| Feb 2012 to Dec 2018 | VIIRS S-NPP | F2 |
| Jan 2019 to today | VIIRS NOAA-20 | 1 |

Detections from a sensor outside its period stay in the database with weight 0. They are needed for the proof charts.

### Step 6. The current year (2026)

- Yearly country files stop at 2025. 2026 comes from the FIRMS API, NOAA-20 only, 5 days per request (about 64 requests so far this year).
- The API has standard data for the older months and near-real-time data for the latest ones. Near-real-time data has no `type` column.
- To remove factories from near-real-time data we build a mask from the archive, following the published GFED5NRT rule: any 0.01° cell with more than five non-vegetation detections is a permanent heat source.
- The API returns a rectangle that includes parts of neighbouring countries. Rows outside the Greece outline are dropped, so 2026 covers the same ground as earlier years.

### Step 7. Uncertainty

**The range comes from the blind test (proof 2).** We predict 2017 to 2019 from MODIS alone and compare with what VIIRS really counted. The size of that miss, as a percentage, is the range. Every MODIS-era value is shown as "estimate, ±X%" on hover.

- This is a measured error of a real prediction, so it is a stronger claim than a guess at the spread.
- Use the error for monthly values in the fire season, not the yearly one, because the calendar shows months and monthly errors are larger.
- After the test, refit the factor on the full window (February 2012 to December 2019) for the final record. The test only tells us how far to trust it.
- Fallback, only if the blind test is not finished: the lowest and highest yearly ratios from 2012 to 2019.

- **Where the estimate matters, and where it does not.** The MODIS counts are real measurements; only the conversion to VIIRS units is estimated. Comparisons inside the MODIS years (for example August 2007 against August 2005) barely depend on the factor, because both months are multiplied by nearly the same number and it cancels out. The uncertainty lives only in comparisons across the join, such as 2007 against 2021. Say this in one sentence on the method page: "measured by MODIS, converted to VIIRS units". It is exact with a single factor; with separate day and night factors, or the season and 1° refinements, it holds closely but not exactly.
- **Small areas vary more than the whole country.** The blind test also reports its error for single 1° squares. The app shows that wider range for a drawn area and the national range for "All Greece". If there is no time for this, state it as a limit.
- **Show the arithmetic.** On hover, an estimated month shows where its number came from, in the form "412 MODIS detections × 3.4 = 1,401 (range 1,250 to 1,640)". A measured month shows "measured by VIIRS NOAA-20". Every number on the screen can be traced back to NASA's detections. (The numbers here only show the form.)

### Limits we state openly

- Values before 2012 are estimates. Small or cool fires that MODIS never saw cannot be recovered; the factor corrects the average, not each fire.
- The factor is an average over fire types. MODIS misses small agricultural burns more often than forest fires, so an area dominated by one type is corrected less exactly.
- A small area has a wider uncertainty than the whole country.
- MODIS and VIIRS pass at different times of day.
- Clouds and thick smoke hide fires from both sensors.
- Short satellite outages are not corrected.
- The latest months are provisional until NASA releases the standard data (about 5 months later).
- Hotspots are not burned area. A fast fire can burn a lot between two satellite passes. NASA itself does not recommend hotspots for estimating burned area (FIRMS FAQ).
- A hotspot is the centre of a flagged pixel, not the position of the fire. We know only that at least one fire lies inside the pixel (FIRMS FAQ).
- The factor is not one number. In the quick check, night is about 5.5 and day about 3.0, and single years range from 3.07 to 3.72.

**What the harmonization can and cannot answer**

| A user asks | Answerable? |
|---|---|
| Was August 2007 worse than August 2021 in Greece? | Yes, with a range |
| Which months normally have the most activity in a region? | Yes |
| Where exactly did a small fire burn in 2005? | No. Fires MODIS missed are unknown and cannot be placed on the map. |
| How many hotspots did one village have in one month of 2003? | Unreliable. The factor is an average and does not hold for very small areas or counts. |

The method corrects totals, not single fires. The challenge asks for the first kind of question: a calendar by month and year, against the median.

---

## 5. Proof (this is where the Validity score comes from)

| # | Proof | What it shows |
|---|---|---|
| 1 | Before/after chart: yearly totals, naive merge against harmonized | The naive merge jumps in 2012. The harmonized line does not. |
| 2 | Blind test: fit F1 on 2012 to 2016, predict 2017 to 2019 from MODIS alone, compare with the real S-NPP counts | The method works on years it never saw. Report the error per year and for the fire-season months, at two scales: all of Greece, and single 1° squares. |
| 3 | Two real fires: daily hotspots against Copernicus burned-area maps. Evros has ten dated maps, including the jump from 8,529 ha to 72,344 ha between 21 and 23 August 2023. Evia grew from 7,313 ha to 50,909 ha between 5 and 11 August 2021. | The record follows real events day by day. |
| 4 | Yearly harmonized hotspots against EFFIS burned area for Greece, 2006 to 2025 | Tests the pre-2012 estimates against an independent record. 2007 (271,715 ha, the worst year) lies in the MODIS-only era. |
| 5 | NOAA-20 against S-NPP × F2, monthly, 2019 to 2025 | The last join is clean. |
| 6 (optional, Person B) | What the factor is made of. On days when Aqua and S-NPP pass the same place within 5 to 10 minutes, the fire is the same and only the sensor differs. Measure, on cells of about 0.1°, the share of VIIRS fire cells that Aqua also saw, and the pixel ratio in cells both saw. | Splits the gap into sensitivity and resolution. The quick check found that Aqua saw about 1 in 4 of the places where VIIRS saw fire, and that VIIRS gave about 2.4 to 2.8 pixels per MODIS pixel where both saw it. |
| 7 (optional, Person B) | The grid test of section 4, as a small chart | Shows that we tried the obvious alternative and measured why it fails. |

**Proofs 6 and 7 are Person B's.** She already ran both as quick checks on her machine. To count as proof, each must become a script in the repository that uses the pipeline's own cleaning step, so the filters cannot drift apart. They explain the factor; they do not replace it. Limits of proof 6 to state with it: Aqua only (Terra has no near-simultaneous passes), no large fires in the sample, a small sample (119 days in 8 years at the 5-minute limit), and a pass that detected nothing leaves no row, so the 1-in-4 figure is probably optimistic.

**Expected values for proof 6** (quick check, Greece, Feb 2012 to Dec 2019, second machine only; targets, not numbers for the page).

Matches per MODIS hotspot: an S-NPP hotspot on the same day within about 2 km.

| Time difference | Aqua hotspots with a match | Days | Terra hotspots with a match |
|---|---|---|---|
| up to 2 min | 166 (2.7%) | 37 | 0 |
| up to 5 min | 522 (8.4%) | 119 | 2 |
| up to 10 min | 1,014 (16.3%) | 228 | 19 |
| up to 30 min | 2,468 (39.7%) | 506 | 101 (2.1%) |
| up to 60 min | 3,728 (60.0%) | 742 | 368 (7.7%) |

Totals: 6,212 Aqua and 4,766 Terra hotspots. A match within 2 km is not proof of the same fire: a MODIS pixel reaches 9.6 km² at the swath edge.

The same pass, compared on cells of about 0.1°:

| Measured | Within 5 min | Within 10 min |
|---|---|---|
| Days with a coincident pass | 147 | 277 |
| S-NPP ÷ Aqua in the same pass, day | 3.96 | 3.79 |
| S-NPP ÷ Aqua in the same pass, night | 7.38 | 6.80 |
| Cells where S-NPP saw fire that Aqua also saw | 22% | 23% |
| Cells where Aqua saw fire that S-NPP also saw | 70% | 70% |
| S-NPP ÷ Aqua pixels in cells both saw | 2.83 | 2.41 |

The day counts differ (119 and 147) because the first table counts days with a matched hotspot and the second counts days with any coincident pass. Sample at 5 minutes: 597 Aqua hotspots by day, 85 by night. The script's last step compares the coincidence ratio with the monthly S-NPP ÷ Aqua ratio (section 9.7); agreement would be independent evidence that F1 measures the sensor.

All proof charts are saved as small data files inside the website, so the proof page works even if the database is down.

**Report the proofs as they come out.** If the blind-test error is large, publish it and widen the stated range. A judge trusts an honest error more than a perfect-looking chart.

**Optional check, 10 minutes:** recompute F1 without the MODIS confidence filter and report how much it changes. A small change shows that the unverified cut-off does not matter.

---

## 6. Data sources

**What the challenge page lists** (Resources tab, read 14 Nov 2026): one resource only, under "NASA Data & Resources":

- [FIRMS, Fire Information for Resource Management System](https://www.earthdata.nasa.gov/data/tools/firms): global near-real-time satellite imagery, active fire hotspots and related products.

Everything in the table below from NASA comes from FIRMS, so we use the listed resource. The page also says that for non-U.S. Government websites "participants must comply with any data use parameters of that specific website". That applies to Copernicus, EFFIS, Natural Earth and OpenStreetMap: follow their attribution rules and name them in `REFERENCES.md`.

| Data | Where | Used for |
|---|---|---|
| MODIS Collection 6.1 hotspots, 2000 to 2025 | `https://firms.modaps.eosdis.nasa.gov/data/country/modis/{year}/modis_{year}_Greece.csv` | The record before 2012, and the factor |
| VIIRS S-NPP 375 m hotspots, 2012 to 2025 | `.../data/country/viirs-snpp/{year}/viirs-snpp_{year}_Greece.csv` | The record 2012 to 2018, and both factors |
| VIIRS NOAA-20 375 m hotspots, 2018 to 2025 | `.../data/country/viirs-jpss1/{year}/viirs-jpss1_{year}_Greece.csv` | The record from 2019 |
| NOAA-20 for 2026 | FIRMS Area API: `/api/area/csv/[MAP_KEY]/[SOURCE]/[west,south,east,north]/[1-5 days]/[DATE]` | The current year and daily updates |
| Which dates each source has | FIRMS API: `/api/data_availability/csv/[MAP_KEY]/[SENSOR]` | Deciding standard or near-real-time per date |
| Burned-area maps of the two fires | Copernicus EMS activations EMSR527 and EMSR686 | Proof 3 (European partner data) |
| Yearly burned area, Greece | EFFIS Statistics Portal (table in facts file, 9.5) | Proof 4 (European partner data) |
| Outline of Greece | Natural Earth (public domain) | Clipping 2026 data, coverage outline |
| Map background | OpenStreetMap data through OpenFreeMap | The map |

**Already downloaded (14 Nov 2026, 07:30, under the email permission the team received):** all 48 Greece files are in `C:\Users\User\Desktop\nasa\data\raw`.

| Folder | Sensor | Years | Files | Rows | Size |
|---|---|---|---|---|---|
| `modis` | MODIS (Terra + Aqua) | 2000 to 2025 | 26 | 46,350 | 3.4 MB |
| `viirs-snpp` | VIIRS S-NPP | 2012 to 2025 | 14 | 90,442 | 6.8 MB |
| `viirs-jpss1` | VIIRS NOAA-20 | 2018 to 2025 | 8 | 49,563 | 3.8 MB |

- Every file has the expected header, including the `type` column. Rows are raw, before any cleaning.
- The pipeline's download step reads from this folder and skips files that are already there. Copy the folder into the new project as `pipeline/data/raw` and keep it out of the repository (`.gitignore`).
- About 186,000 rows in total, so Greece fits the free Supabase plan easily.
- Keep the permission email; these files carry a timestamp before 09:00.
- On the second team machine the same 48 files are in `C:\Users\diama\Desktop\NASA\greece-firms-data`. The row counts match.

Notes:

- The country files need no login and are small (Greece is under 1 MB per file). All three file patterns were checked.
- No NOAA-21 country files exist, and we do not need NOAA-21.
- The FIRMS "country" API page did not load when checked (it answered "Invalid API call"), so it is unconfirmed. We plan on the area API with a rectangle around Greece (about 19 to 30°E, 34 to 42°N).
- API limit: 5,000 transactions per 10 minutes.

---

## 7. Services and tools

### Services

| Service | Job | Cost | Notes |
|---|---|---|---|
| **GitHub** | Public code repository | Free | Apache-2.0 licence |
| **GitHub Pages** | Hosts the website (the frontend) | Free | Always on, HTTPS included, no domain needed |
| **GitHub Actions** | Builds and publishes the website on every push | Free for public repositories | |
| **Supabase** | The database (PostgreSQL + PostGIS) and the secure web address the website calls | Free, or Pro at $25/month | See the limits below. Pick an EU region. |
| **NASA FIRMS** | The hotspot data, plus a free MAP_KEY for the API | Free | The key is a secret. Never commit it. A key already exists: it is the `firms.api.key` line in AEGIS, in `BACKEND\src\main\resources\application.properties`. Copy it by hand into the new project's private `.env` file. A key is not code, so reusing it breaks no rule. |
| **Your VPS** | Runs the daily update script once a day | Already paid | Keep it paid until the end of January 2027 |
| **Uptime monitor** (UptimeRobot or similar) | Emails you if the site goes down | Free | Optional but cheap insurance |
| **YouTube** (or similar) | Hosts the 30-second video with a public link | Free | Must play without login |
| **Copernicus EMS and EFFIS** | Validation data | Free, no account | |

**Supabase limits (read on their site, 14 Nov 2026)**

- Free plan: 500 MB database, 5 GB of data sent per month, and **the project is paused after 1 week without activity**.
- Pro plan: $25/month, 8 GB, no pausing.
- Public queries stop after 3 seconds by default. This can be raised per function.
- PostGIS is enabled from the dashboard and must be installed in the `extensions` schema, not `public`.

**Not used:** FastAPI, Docker, Caddy, a domain name, Spring Boot, any AEGIS code. Supabase makes them unnecessary. Fallback if Supabase fails us: the same database on the VPS (section 13).

### Languages and libraries (every one goes in `REFERENCES.md`)

| Part | Choice |
|---|---|
| Frontend | TypeScript, React, Vite, Tailwind CSS |
| Map | MapLibre GL JS, with Terra Draw for drawing shapes |
| Charts | Observable Plot (calendar heatmap, seasonal chart, proof charts) |
| Database client | supabase-js |
| Pipeline | Python 3.13 (`py -3.13`), pandas, requests, psycopg |
| Database | PostgreSQL with PostGIS, SQL functions |
| Tests | pytest (pipeline), Vitest (frontend) |
| Versions on both machines | Node 26.13.1, npm 11.20.0, Python 3.13 (always start it with `py -3.13`; plain `python` is 3.10 on Person A's machine) |

### AI tools (disclosed)

Claude (planning, source checking, code help, quick counts), the Impeccable design skill used through Claude (look and feel, loading states), Gemini (literature search), and ChatGPT (a plain-language explanation of the topic in Greek; its suggestions were checked and not adopted).

---

## 8. Architecture

```
NASA FIRMS files (2000-2025)          NASA FIRMS API (2026, daily)
          |                                     |
          v                                     v
  Python pipeline on your laptop        Python update script on the VPS
  (clean, factors, weights, proof)      (once a day)
          |                                     |
          +----------------+--------------------+
                           v
              Supabase: PostgreSQL + PostGIS
              (hotspots with weights, factors, coverage, meta)
                           |
                 4 SQL functions over HTTPS
                           |
                           v
        React website on GitHub Pages  --->  the user's browser
        (map, calendar, cards, exports, method page)
        Built-in fallback: a saved North Evia example and the proof files
```

Why this shape:

- **The database does the map maths.** It tests each hotspot against the exact drawn shape.
- **The browser does the statistics.** One call returns the whole monthly history of the area; medians, anomalies and rankings are computed from it in the browser. This means one query per area and no server code.
- **The proof is static.** It is computed once by the pipeline and shipped with the website.

---

## 9. Code design

### 9.1 Repository layout

```
README.md            what it is, live link, how to run, AI note
LICENSE              Apache-2.0
REFERENCES.md        every dataset, paper, library and service
AI_USE.md            dated log of AI help
pipeline/            Python
  config             countries, years, thresholds, switch dates, file addresses
  download           fetch the yearly country files
  clean              read the files, unify columns, apply the filters
  factors            compute F1 and F2, with fallback and range
  harmonize          give every row its weight
  evidence/          typed evidence files (Person B, from verified-facts.md): Evros 2023 and
                     Evia 2021 Copernicus burned area, EFFIS yearly table (2006 to 2026,
                     2026 marked complete=false), greece.geojson (Natural Earth 1:10m,
                     public domain, 6,096 points, 19.63 to 28.24°E, 34.82 to
                     41.75°N, not widened at the coast). The proofs read these files.
                     The Evia bounding box inside is an ESTIMATE until read off the
                     EMSR527 map.
  validate           the five proofs, saved as small data files for the website
  load_db            load the rows into Supabase
  update_daily       pull new days from the API, clean, weight, insert
  tests/
db/
  schema.sql         tables, indexes, security, the 4 functions
web/                 the React website
  src/api            the 4 calls to Supabase
  src/lib/stats      medians, anomalies, rankings (pure functions)
  src/lib/geo        circle from point + radius, the two presets
  src/components     see 9.5
  src/data           saved North Evia example
  public/proof       proof data files from the pipeline
.github/workflows/   build and publish the website
```

Raw NASA files are downloaded by the pipeline and are **not** committed. Anyone can rebuild the database by running the pipeline; that is the backup.

### 9.2 Pipeline modules

| Module | Input | Output | Rules it owns |
|---|---|---|---|
| download | Country, years | Raw CSV files on disk | Always fresh files; skip years already present |
| clean | Raw files | One table with unified columns | `type = 0`; confidence filter; MODIS brightness columns and VIIRS ones mapped to shared names; satellite names unified (Terra, Aqua, S-NPP, NOAA-20) |
| factors | Clean table | Factor table (place, day/night, MODIS set, factor, counts) | Fit window Feb 2012 to Dec 2019; minimum detections; fallback to country. Takes the fit window as a setting, so `validate` can refit on 2012 to 2016 for the blind test. |
| harmonize | Clean table + factors | Same table with `weight` | The splice table of section 4, step 5 |
| validate | Weighted table | Proof data files + a printed report + the blind-test error, written to `meta` as the range the app shows | Stops with an error if a sanity check fails (9.7) |
| load_db | Weighted table | Rows in Supabase | Empties and reloads, so it can be re-run safely |
| update_daily | API | New rows in Supabase | Section 9.6 |

All settings (thresholds, dates, countries) live in `config`. Nothing is hard-coded inside the other modules.

### 9.3 Database tables

**`hotspots`**: one row per detection.

| Column | Meaning |
|---|---|
| id | Row number |
| acq_date, acq_time | Date and UTC time of the satellite pass |
| latitude, longitude, geom | Position; `geom` is the map point used for area queries |
| instrument | MODIS or VIIRS |
| satellite | Terra, Aqua, S-NPP or NOAA-20 |
| daynight | D or N |
| confidence | The original value |
| frp | Fire power, passed through unchanged |
| weight | NOAA-20-equivalent weight. 0 if the row is outside its sensor's period. |
| quality | SP (standard) or NRT (provisional) |
| country | Covered country |

Indexes: a spatial index on `geom` and an index on `acq_date`.

**`factors`**: the factor table from the pipeline, shown on the method page.

**`coverage`**: the outline of each covered country.

**`meta`**: data-through date, last update time, record start, switch dates, F2, uncertainty range, method version.

Size: Greece is about 186,000 raw rows (counted from the downloaded files), fewer after cleaning. My estimate is under 100 MB with indexes, which fits the free plan. Stay under about 1 million rows on the free plan. A monthly summary table is only needed if large countries are added later.

**Security**

- Row Level Security is switched on for every table, with no public rules. Visitors cannot read tables directly.
- Visitors can only call our four functions, and each function has a row cap and a time limit. This also protects the monthly data allowance.
- The website contains only the public ("anon" or "publishable") key. The database password and the secret key exist only in a private `.env` file on your laptop and on the VPS, never in the repository.

### 9.4 The four database functions (this is the whole API)

| Function | Input | Returns | Guards |
|---|---|---|---|
| `calendar` | Area (GeoJSON shape) | One row per year and month for the **whole record**: harmonized value, raw detection counts for each sensor (MODIS, S-NPP, NOAA-20), number that are provisional | Valid shape, at most about 500 corner points, 10-second limit |
| `month_points` | Area, year, month | The hotspots of that month for the map | At most 20,000 rows |
| `hotspots_export` | Area, date from, date to | Every hotspot row with all columns and its weight | Read in pages of 10,000; hard stop at 200,000 with a message to narrow the selection |
| `get_meta` | Nothing | Data-through date, coverage outline, factors, uncertainty range | |

`calendar` always returns the whole record because the historical median needs every year. The date range only decides what the screen shows.

The raw counts per sensor cost nothing extra in the query. They feed the "show the arithmetic" hover text and the raw-versus-harmonized switch, so build them in from the start.

A circle (point + radius) is turned into a shape in the browser, so the database only ever handles one kind of input.

### 9.5 Frontend

**Two views:** "Calendar" (main) and "Method and proof".

**Layout:** map on the left and results on the right; stacked on a phone.

| Component | What it does |
|---|---|
| AreaPicker | Map, draw polygon or rectangle, a form for latitude/longitude/radius, preset buttons (North Evia 2021, Evros 2023, All Greece) |
| DateRange | From and to; default is the whole record |
| HeadlineCard | The plain sentence for the selected month |
| ThisMonthCard | "This month so far against normal", from the 2026 data (must-have 12) |
| CalendarHeatmap | Years × months; a "normal year" row and a total for each year; switch between "hotspots" and "difference from normal"; marks estimated months (before 2012) and provisional months; number on hover and on keyboard focus, with the arithmetic behind it; "show as table" |
| Rankings | Top 5 months, top 5 years, and the peak season |
| Messages | "No hotspots found in this area in 26 years" and "This area is outside the covered region (Greece)". A simple check against the rectangle around Greece is enough. |
| SeasonChart (should) | Normal year against a chosen year |
| MonthMap (should) | Hotspots of the clicked month on the map |
| ExportBar | Calendar CSV, calendar image (PNG if it works cleanly, otherwise SVG), hotspots CSV; copy-link (should) |
| DataStamp | "Data through [date], updated daily" |
| MethodPage | The method in plain words, the five proofs, the limits, the references |

**Data flow:** the area changes → one `calendar` call → every card is computed in the browser by the functions in `stats`.

**Statistics rules (in `stats`, all tested)**

- Normal for a month = the median of that calendar month over all complete years (2001 to 2025). The screen says this in words.
- Difference from normal is shown as "N times normal" and as a rank among all finished months of that name ("3rd highest August of 26").
- If the normal is 0 (winter months), show the plain number and "normal: 0". Never divide by zero.
- **Small numbers:** if the normal is below 5, show the two plain numbers and no "N times". "8 against a normal of 2" is honest; "4 times normal" is noise.
- Peak season = the calendar months with the highest normal values that together hold most of a normal year's hotspots. Shown as a plain phrase, for example "July to September".
- The calendar CSV carries both the median and the mean for each calendar month, because the challenge mentions both.
- 2000 and 2026 are partial years. They are left out of yearly rankings.
- The current month is labelled "so far" and is never ranked against full months.

**Colour and accessibility**

- Hotspot counts: a colour-blind-safe sequential ramp (viridis or cividis) on a square-root scale, because a few months are 10 to 50 times the typical one.
- Difference from normal: a blue-to-orange diverging ramp centred on "normal".
- No data: light grey with a pattern.
- Colour is never the only signal: numbers on hover and focus, plus the table view.
- Every calendar cell can be reached with the keyboard. The latitude/longitude/radius form is the alternative to drawing with a mouse.

**Presets**

- Evros 2023: west 25.536, south 40.749, east 26.317, north 41.261 (the official Copernicus area).
- North Evia 2021: 23.0 to 23.5°E, 38.75 to 39.05°N. This is a rough box; adjust it against the Copernicus map.

**When things fail:** the page starts from the saved North Evia example and then refreshes from the database. If the database call fails, the example stays with a clear message. The page never shows an empty screen or a raw error.

### 9.6 Daily update (on the VPS)

One scheduled run per day:

1. Ask the FIRMS API for the last 5 days of NOAA-20 for the rectangle around Greece.
2. Drop low confidence, drop rows in masked cells, drop rows outside the Greece outline.
3. Delete the provisional rows for those 5 days and insert the new ones. Running it twice gives the same result.
4. Update the data-through date in `meta`.

It writes a log line each run. The daily run also counts as activity on the Supabase project (not confirmed to prevent pausing; see section 14).

### 9.7 Tests and checks

**Pipeline tests (pytest), on tiny made-up data with known answers**

- The cleaning filters remove exactly the right rows.
- A made-up dataset with a known ratio of 3 gives a factor of 3.
- A square with too few detections falls back to the country factor.
- A hotspot in each of the four periods gets the right weight; a hotspot outside its sensor's period gets 0.
- The factory mask flags a cell with six non-vegetation detections and not one with five.

**Sanity checks in `validate` (the run stops if one fails)**

- Every year from 2001 to 2025 has data.
- No step at the 2012 and 2019 joins larger than the stated uncertainty.
- August 2021 and August 2023 are the two highest Augusts for all of Greece.
- The Evia preset in the database returns the same August 2021 value as the pipeline.

**Expected values (quick check on the Greece files, 14 Nov, after the start; counted separately on both team machines with the same result).** Filters: `type = 0`, MODIS confidence 30 or more, VIIRS not `l`. If the pipeline gives something very different, look for a bug before believing it. These are targets, not results for the page.

| Quantity | Expected |
|---|---|
| F1 pooled, Feb 2012 to Dec 2019 (S-NPP ÷ MODIS) | 37,448 ÷ 10,978 = 3.41 |
| F1 by day; by night | 3.04; 5.54 |
| F1 per year, 2013 to 2019 | 3.07 to 3.72 |
| F1 per year, 2020 to 2025 (drift years, not used for the fit) | 3.03 to 3.99 |
| F1 Terra only (S-NPP ÷ Terra) | 37,448 ÷ 4,766 = 7.86 |
| F1 Aqua only (S-NPP ÷ Aqua), for reference | 37,448 ÷ 6,212 = 6.03 |
| F2 pooled, 2019 to 2025 (NOAA-20 ÷ S-NPP) | 37,673 ÷ 36,168 = 1.04 |
| F2 per year, 2019 to 2025 | 1.05, 1.06, 1.05, 1.08, 1.01, 1.12, 0.95 |
| F2 in 2018 (NOAA-20 starts 1 April) | 0.87 |
| August 2007, MODIS | 3,052 |
| August 2021: MODIS, S-NPP, NOAA-20 | 1,694; 6,703; 6,893 |
| August 2023: MODIS, S-NPP, NOAA-20 | 1,670; 5,420; 5,736 |
| First Aqua detection | 4 July 2002 |
| 2021: MODIS alone; all three sources added | 2,271; 20,869 (9 times) |
| Median yearly MODIS hotspots, 2003 to 2011 | 1,730 |
| Median yearly MODIS hotspots, 2012 to 2019 (activity did not rise) | 1,355 |
| Median yearly naive sum MODIS + S-NPP, 2012 to 2017 (proof 1; video, seconds 0 to 5) | 6,518 (almost 4 times) |

**Expected finding (must-have 9), to be confirmed by the pipeline with separate day and night factors:** 2007 has 5,970 MODIS hotspots, which is about 21,200 NOAA-20-equivalent (5,970 × 3.41 × 1.04; range about 19,100 to 23,100). 2021 has 9,545 real NOAA-20 hotspots and 2023 has 9,376. So 2007 had roughly twice the hotspot activity of either. EFFIS burned area agrees that 2007 is first (271,715 ha). **Careful with the order of the other two:** by hotspots 2021 and 2023 are nearly equal (2% apart), but by burned area 2023 is clearly larger (174,773 ha against 130,744 ha). Do not write that the order "matches EFFIS" for all three. Say that 2007 leads in both, and that Evros 2023 burned fast and left fewer hotspots per hectare.

**Frontend tests (Vitest):** the `stats` rules above, including normal = 0, a normal below 5, and the partial month; the CSV builder.

**Manual check before every submission:** private browser window, a phone, a different network, both presets, every link, the CSV opens in a spreadsheet.

**Five-minute test with outsiders (Relevance: "how usable or user friendly").** Person B asks two people from outside the team, at the venue, to open the live link with no explanation and answer one question: "Was August 2021 unusual in North Evia?" B watches silently and writes down where they hesitate. Fix the worst problem only. Once on Saturday evening and once on Sunday morning. This is a usability check, not a quote for the page. **Target: the outsider answers in under one minute**, because the user in section 18.1 works under time pressure.

### 9.8 Working rules

- Small commits straight to `main`; the site republishes on every push.
- Secrets only in `.env` files that are listed in `.gitignore` from the first commit.
- Each AI-assisted file gets a one-line header note, and each session gets a line in `AI_USE.md`.
- A library, dataset or service is added to `REFERENCES.md` in the same commit that first uses it.
- Before every push, run `git diff --cached` and check that no key or password appears. Added 14 Nov, 17:30: on the second machine `hotspot/.env.example` had been filled with the real keys by mistake. It was never committed or pushed, and it is restored to the empty template. Whether to change the Supabase secret key and database password is the team's call (the values were shown once inside a Claude Code session on that machine).
- `.gitignore` (Person A): add `/greece-firms-data/`. On the second machine the raw data folder sits inside the repository root. Until then it is excluded there in `.git/info/exclude`, together with `/CLAUDE.md` and `/CHATGPT-ENRICHED-EL.md`.

### 9.9 Building with Claude Code

The code is written with Claude Code, under the team's direction and review. That is allowed and must be disclosed.

**How to run it**

1. **A new folder outside AEGIS.** Create the project folder, open Claude Code in it, and keep AEGIS closed. The project must be clean and separate.
2. **Point it at the plan first.** Tell it to read `C:\Users\User\Desktop\nasa\MASTER-PLAN.md` and `verified-facts.md` before writing anything.
3. **One step at a time, in the plan's order:** setup, pipeline, database, skeleton, screen parts, proofs. Check each result before asking for the next.
4. **Commit after every working step**, so a bad change is easy to undo.
5. **Ask for the test with the code.** Each rule in section 9.7 gets its test in the same step.
6. **Look at the output yourself.** When the first calendar appears, check that August 2021 and August 2023 stand out. Claude can run checks; the team decides whether the result makes sense.

**Make it remember: a `CLAUDE.md` file in the new project folder.** Claude Code reads this file at the start of every session, so the rules below apply without being repeated. Create it as the very first file, with these lines:

```
Read C:\Users\User\Desktop\nasa\MASTER-PLAN.md before any work, and follow its order.
Facts come from C:\Users\User\Desktop\nasa\verified-facts.md.

Whenever a decision is made (a threshold, a date, a cut feature, a library,
a number from the pipeline, a surprise, a workaround), in the same step:
1. Add a row to the decision log in C:\Users\User\Desktop\nasa\JUDGE-QUESTIONS.md.
2. Update the answer and status of every question it touches.
3. Add any new question it raises, with its answer.
When a pipeline run produces a number that fills a blank there, fill it.

Add one line to AI_USE.md per session. Put a one-line AI note at the top of each file you write.
Add every new library, dataset or service to REFERENCES.md when it is first used.
Never write a key or password into any file except .env, and never commit .env.
```

**Done on Saturday afternoon:** the project folder is `C:\Users\User\Desktop\nasa\hotspot`, and its `CLAUDE.md` already exists with these rules and a few more. Open Claude Code in that folder. Only the `hotspot` folder becomes the public repository; the plans, the data and the zip stay outside it.

Without this file, a new session knows nothing of the plan or of `JUDGE-QUESTIONS.md`, and the answers go stale.

**What only the team can do**

- Create the GitHub repository and the Supabase project, and request the FIRMS key.
- Type every password and key. They go into a private `.env` file, never into the chat and never into the repository.
- Decide the method, and be able to explain every step to a judge. Code the team cannot explain is a liability under the AI rule (section 17).
- Write the project page, record the video, give the pitch.

**Disclosure, as the work happens**

- One line in `AI_USE.md` per session: date, tool, what it wrote.
- A one-line header note in each AI-written file.
- On the project page: "The code was written with Claude Code, under the team's direction and review."

**What it changes in the schedule:** writing code is two to three times faster. Account setup, checking results, debugging against real services, the page, the video and sleep are not. The revised clock in section 10 already assumes this.

---

## 10. Schedule (30 hours, Saturday 09:00 to Sunday 15:00)

### Revised clock (written Saturday 13:30, when no code existed yet)

Planning ran four and a half hours into the event. The Sunday blocks stay as they were; Saturday is compressed. Use this clock; the two tables below and in section 11 keep the same order of work.

| Work | Planned | Now |
|---|---|---|
| Setup: repository, Supabase, empty page live | Sat 09:00 to 10:00 | Sat 13:30 to 14:15 |
| Pipeline for Greece, tables, `calendar` function | Sat 10:00 to 15:00 | Sat 14:15 to 17:00 |
| App skeleton | Sat 15:00 to 17:00 | Sat 17:00 to 19:00. **19:00: first live calendar.** |
| Heatmap, statistics, downloads, simple screen parts | Sat 17:00 to 21:00 | Sat 19:00 to 22:30 |
| Proofs, finding, method page, first outsider test | Sat 21:00 to 24:00 | Sat 22:30 to Sun 01:00 |
| Sleep | Sun 00:00 to 05:00 | Sun 01:00 to 05:30 |
| 2026 data and the "this month" card | Sun 05:00 to 07:00 | Sun 05:30 to 07:30. **07:30: feature freeze.** |
| Project page, video, README | Sun 07:00 to 12:00 | Sun 07:30 to 12:00 |
| Submit, checks, pitch rehearsal | Sun 12:00 to 15:00 | Unchanged |

- The pipeline slot is shorter than planned. That is realistic only because the Greek files are already downloaded and Claude writes the code while Person A reviews it.
- Person B's paper wireframe is now due at 17:00, not 15:00.
- **Expect to ship the single country factor.** The season and 1° refinements, value-add B and most should-haves no longer fit. The must-haves, the proofs and the project page do.
- No more planning sessions. Any new idea goes on a list for after the feature freeze.

### Original table

This table matches the slot-by-slot split in section 11. It was last updated on Saturday at 10:45. The revised clock above replaces its Saturday times. Do not shorten the Sunday page-writing block.

| When | Hours | Work | Checkpoint |
|---|---|---|---|
| Sat 09:00 to 10:00 | 1 | New public repository, licence, `REFERENCES.md`, `AI_USE.md`, Supabase project with PostGIS, FIRMS key, an empty page live on GitHub Pages | A public link exists |
| Sat 10:00 to 15:00 | 5 | Pipeline for Greece with one country factor: clean, factor, weights, load. Tables, security, the `calendar` function. | **15:00: Greece is in the database with weights** |
| Sat 15:00 to 17:00 | 2 | App skeleton: map with drawing, presets, the `calendar` call, a plain heatmap | **17:00: the live link shows a real North Evia calendar** |
| Sat 17:00 to 21:00 | 4 | Heatmap finished, statistics, the three downloads, the simple screen parts | **21:00: area, calendar, sentence, rankings and downloads work** |
| Sat 21:00 to 24:00 | 3 | The proofs, the finding, the method page, the first five-minute test | **Midnight: must-haves 1 to 11 work** |
| Sun 00:00 to 05:00 | 5 | Sleep | |
| Sun 05:00 to 07:00 | 2 | 2026 data and the "this month" card (must-have 12), then should-haves in order | **07:00: feature freeze. No new features after this.** |
| Sun 07:00 to 12:00 | 5 | Project page text, 30-second video, README, references, AI log, final proof numbers | |
| Sun 12:00 to 13:00 | 1 | Submit the first complete version | **13:00: a valid submission exists** |
| Sun 13:00 to 15:00 | 2 | Manual checks, fixes, resubmit, pitch rehearsal | Hard stop at 15:00 |

If a checkpoint is missed, cut should-haves. Never cut the proofs, the project page or the sleep.

With only 2 hours on Sunday morning, expect to finish the 2026 data and perhaps the raw-versus-harmonized switch. The daily update on the VPS can be set up after the deadline only if the rules allow changes then; otherwise skip it and state the data-through date.

---

## 11. Who does what

The team has two people. **Person A = the experienced member** (builds the pipeline, the database and the core of the app). **Person B = the member who has never used React** (content, evidence, testing, and simple screen parts). Names: A = __________, B = __________.

Why this split: A is the only one who can build the hard parts, so A's hours are the limit of the whole project. B takes every task that does not need React at first, and joins the React work once A has built part of the app and shown him how it is laid out. **No must-have is moved or dropped.**

**What B owns (none of it needs React)**

- **Evidence files:** the Copernicus burned-area dates for Evros and Evia and the EFFIS yearly table, typed from `verified-facts.md` into small data files the proofs read. The Greece outline file.
- **Open checks:** the exact North Evia box from the Copernicus map, the MODIS confidence boundaries, the claim that other tools start in 2012, similar names on the Teams tab.
- **Paperwork from the first hour:** `REFERENCES.md`, `AI_USE.md`, README.
- **All words on the screen:** the method page text, button labels, the limits list, the "why now" paragraph.
- **Look and feel and loading states** (decisions 9 and 10), with Impeccable.
- **Testing:** the manual checklist at every checkpoint, on a phone and a second network. B reports bugs; A fixes them.
- **Presentation:** screenshots, the 30-second video, the pitch slides if allowed.
- **Analysis scripts (new, 14 Nov).** B has shown she can run counts on the data with Claude's help. She owns proofs 6 and 7 (section 5) as scripts in the repository, built on A's cleaning step. This is optional work that costs A nothing. It starts only after A's cleaning step exists, and it never delays her evidence files or the wireframe.
- **React work, after A has built the skeleton and one worked example (from about 17:00 Saturday):** first the simple parts (rankings list, headline sentence, export buttons, data stamp), each a small file that receives ready numbers and displays them. Then larger parts as he gets comfortable: the radius form, the date range, the method page.

**One master copy.** The plan, the facts file, the questions file and the choices file live on A's machine. B writes proposals in a separate note, as she did with `FOR-MASTER-PLAN.md`, and A merges them. After each merge A sends B the updated files, so the two machines never hold different plans.

**What only A does:** the pipeline, the factors, the calculations of proofs 1 to 5, the database and its four functions, the map, the calendar heatmap, the `stats` rules, anything that is broken.

**Rules for this split**

- **Stuck for 30 minutes means ask.** Not an hour.
- **B never waits for A.** If a task is blocked, B moves to the next item on the list above.
- **A gives B a 15-minute walkthrough of the app's files** once the skeleton exists (about 17:00 Saturday).

| When | Person A (experienced) | Person B (new to React) |
|---|---|---|
| Sat 09:00 to 10:00 | Repository, Supabase project with PostGIS, empty page live on GitHub Pages | Licence, `REFERENCES.md`, `AI_USE.md`, FIRMS key request, Teams tab name check |
| Sat 10:00 to 15:00 | Pipeline for Greece with **one country factor only**: download, clean, factor, weights, load. Tables, security, the `calendar` function. | Evidence files (Copernicus dates, EFFIS table, Greece outline). Exact Evia box. Open checks. Draft of the method page text. **Paper wireframe of the screen, ready for A at 15:00 (section 18.4).** The three questions to a mentor (section 18.1). |
| Sat 15:00 to 17:00 | App skeleton: map with drawing, presets, the `calendar` call, a plain heatmap. Then the 15-minute walkthrough for B. | Look and feel with Impeccable, as a written guide A can apply. Button labels and all screen text. |
| Sat 17:00 to 21:00 | Heatmap finished (colours, hover with the arithmetic, normal-year row, year totals, table view), `stats` rules with tests, the three downloads (calendar CSV, calendar image, hotspots CSV) | React parts from A's example: headline sentence, rankings with the peak season, export buttons, data stamp, the two messages ("no hotspots", "outside Greece"), then the radius form and date range. Method page text in place. |
| Sat 21:00 to 24:00 | The proofs and the finding (must-have 9). Proof 5, the 1° squares and the season refinement only if time remains. | Manual checklist on everything built so far; bug list for A. First five-minute test with two outsiders (section 9.7), and the mentor test if a mentor is free (section 18.5); fill the feedback log. Project page draft: the challenge, what it does, who it helps, "why now". |
| Sun 05:00 to 07:00 | 2026 data and the "this month" card (must-have 12); fix B's bug list; then the raw-versus-harmonized switch | Dataset release with its column description (value-add A); the rebuild check from the README (section 18.6); loading states; screenshots of everything that works; second five-minute test |
| Sun 07:00 to 12:00 | Project page: how it works, proofs with numbers, limits. Fills the blanks in `PROJECT-PAGE-CHOICES.md`. README "Use our data" note. | 30-second video, references and AI log final, the rest of the project page, pitch slides. **Fact check before submitting:** B reads the finished page against `verified-facts.md` and removes or fixes every fact that is not marked VERIFIED there. |
| Sun 12:00 to 13:00 | **Together:** read the page aloud once, tick every box in `PROJECT-PAGE-CHOICES.md`, submit | |
| Sun 13:00 to 15:00 | Fixes, resubmit; pitch: speaks | Final manual checks; pitch: drives the app |

The first real calendar is due at **Saturday 17:00**. Section 10 shows the same slots and checkpoints.

**What gets cut first if A runs late, in this order:** value-add B, the should-haves from the bottom up, the season and 1° refinements (ship the single country factor), the optional sensitivity check. No must-have is cut. If a must-have from 1 to 11 is still unfinished at midnight, it shares the Sunday 05:00 to 07:00 slot with must-have 12, and no should-have is started.

**The 14 Nov update added about 2.5 hours of work for A** (the 2026 card, the image download, the normal-year row, the messages, the small-number rule). Person A has no slack, so most of that time has to come from Claude writing the code while A reviews it, and from B taking the messages and the dataset release.

**Both must be able to explain the method.** B reads section 4 on Saturday morning and A explains it once in the evening. A judge can ask either of you.

---

## 12. Submission

### Project page (most of the score)

The Presentation criterion asks whether the team told "the story of the project: the challenge, the solution, and why is it important". The page follows those three acts, in that order, with those words as headings.

| Act | Section | Content | Criterion it serves |
|---|---|---|---|
| Opening | Summary | One sentence, one screenshot, the live link. A reader who stops here must already know what HOTSPOT is. | Presentation |
| **1. The challenge** | The problem | Fire managers have no consistent picture of when and where burning happened. The two sensors differ in the three ways NASA names: spatial resolution, sensitivity, observation schedule. Adding them fakes a jump in 2012 (image 1). Our goal in NASA's words: "the sensor of origin no longer matters". | Relevance |
| | The user and their needs | The team's two users (rescuers; research teams and environmental scientists), what matters to them, and the eight questions they ask (section 18.1 and 18.2). A few lines and one small table. | Impact, Relevance |
| | Why now | S-NPP ended on 2 Nov 2026; Terra and Aqua are planned to stop in 2027 (must-have 10). | Relevance, Impact |
| **2. The solution** | What it does | The three questions the challenge asks, each with its screenshot: which periods of the year see more fires, which years burned most, how this month compares with normal (images 2 and 3). | Relevance |
| | How it works | The method of section 4 in plain words, the splice table, one "show the arithmetic" example. | Validity, Creativity |
| | Options we weighed | Three or four rows of the options table and the brainstorm photo (section 18.3). | Creativity |
| | Proof | The five proofs with their numbers (image 4: before and after; image 5: the blind test). | Validity |
| | What we tested and changed | One honest line from the feedback log (section 18.5), and the wireframe photo beside the finished screen. | Relevance |
| | Limits | The list from section 4. | Validity |
| **3. Why it is important** | Who it helps | The challenge's own audience: early warning and emergency responders, scientists, land managers, firefighters. Then the three decisions below. | Impact |
| | What is new | The table "what exists, what we add" below, and the finding (must-have 9). | Creativity |
| | Use it and build on it | The open dataset, the open address, how to rebuild everything, and the three next steps (section 18.6). | Impact |
| Required | NASA data, partner data, references, AI use | FIRMS products; Copernicus EMS and EFFIS; `REFERENCES.md`; `AI_USE.md` | Required |

**Three decisions the tool supports (Impact: "quality and quantity")**

1. **Planning:** when does the dangerous season normally start and end here? Patrols and staffing follow the "normal year" row.
2. **Alert:** is this month unusual for this area? The "this month" card answers in one sentence.
3. **After a fire:** how does this event compare with the worst on record here? The rankings and the finding answer it, across the sensor change.

**What exists, what we add (Creativity).** Person B checks every "exists" cell on the real websites before it is published.

| What exists | What it lacks | What HOTSPOT adds |
|---|---|---|
| The NASA FIRMS fire map | Shows each sensor's hotspots separately; check whether it offers any harmonized history | One record across the sensors, from 2000 |
| Public fire dashboards (Global Forest Watch, Our World in Data) | Records that start in 2012 (re-check) | The twelve years before 2012, on the same scale |
| Scientific products such as GFED5NRT | Gridded emissions for specialists, not a tool for any drawn area | Hotspot-level weights and an app anyone can use |
| Any chart of hotspot counts | No way to see how a number was made | The arithmetic behind every estimate, and the proof on the same site |

**Rules for writing the page**

- At most five images, each with a one-line caption that states the point.
- No claim without a number or an image next to it.
- The first 100 words tell the whole story.
- Short paragraphs, plain English. The stronger English speaker proofreads the whole page once, aloud.
- Use the name HOTSPOT the same way everywhere.

### 30-second video

| Seconds | On screen |
|---|---|
| 0 to 5 | The naive merge chart with its fake jump in 2012 |
| 5 to 15 | Draw North Evia; the calendar fills; August 2021 stands out; the headline sentence |
| 15 to 22 | Evros 2023; the raw-versus-harmonized switch if it is built, otherwise the before/after chart; the blind-test number |
| 22 to 30 | CSV download; the live address; "26 years, one consistent record" |

English text on screen. No logos. Check the length is 30 seconds or less before uploading.

### Live pitch at the Local Event

Only local winners go to Global Judging, so the pitch matters as much as the page.

**Ask the Local Lead first:** which language (English or Greek), how many minutes, slides or live demo, and at what time.

**Write it in English first.** The project page needs the same story in English. Translate afterwards if the pitch is in Greek.

**Structure** (scale each part to the time allowed; numbers come from the pipeline run):

| Part | Share of time | What to say |
|---|---|---|
| The problem | 15% | Two NASA sensors see fires differently. Adding them fakes a jump in 2012. And the old satellites are ending: S-NPP stopped on 2 Nov 2026, Terra and Aqua are planned to stop in 2027. |
| What HOTSPOT does | 25% | Live: pick North Evia, the calendar fills, August 2021 stands out, read the headline sentence aloud. |
| Why you can trust it | 30% | The before/after chart and the blind-test number. One sentence on Evros 2023 against the Copernicus maps. |
| The finding | 15% | The one result nobody could get before (must-have 9). |
| Who it helps and what is next | 15% | Civil protection, forest services, journalists, citizens. Open data, open address, more countries. |

**Rules for the pitch**

- One person speaks, one person drives the app. Decide who on Sunday morning.
- Have screenshots ready in case the live app or the network fails.
- Be ready for questions. `JUDGE-QUESTIONS.md` in this folder lists about 40 likely ones with draft answers and a status for each. Keep it current while building, fill its blanks from the pipeline run, and answer every one aloud once before the pitch.
- Rehearse out loud twice with a timer, in the Sunday 13:00 to 15:00 slot.

### Final checklist

- [ ] Live link opens in a private window, on a phone, on another network
- [ ] Repository is public and has the licence
- [ ] Video is 30 seconds or less and plays without login
- [ ] Everything is in English
- [ ] `REFERENCES.md` and `AI_USE.md` are complete and copied into the page
- [ ] The NASA data source is named
- [ ] No pre-start numbers on the page; all numbers come from the pipeline run
- [ ] Unverified facts from the facts file are not on the page (Person B's fact check, section 11)

---

## 13. Risks and fallbacks

| Risk | Fallback |
|---|---|
| Supabase project is paused during judging | Pro plan from submission until the end of January; daily update keeps it active; uptime monitor emails you; the saved example still shows |
| Database or network is down when a judge visits | The page shows the saved North Evia example and the full proof page |
| Supabase setup fails on the day | Same database on the VPS (PostgreSQL + PostGIS + a small API). This costs about 3 hours and needs a domain name for HTTPS. |
| The 1° factors are noisy | Use the country factor. The blind test decides. |
| The FIRMS API is slow or fails | Ship with data through 2025 plus whatever 2026 loaded; state the data-through date |
| Map background tiles do not load (OpenFreeMap was not tested) | Switch to standard OpenStreetMap tiles |
| Greece outline differs slightly from NASA's country boundary | Widen the outline slightly at the coast; state it as a limit |
| Time runs out | Cut should-haves in reverse order. The must-haves and the proofs are the project. |
| The free plan's 500 MB fills up | Greece only on the free plan; more countries only on Pro or as monthly summaries |

---

## 14. Open decisions

1. **Supabase Free or Pro during judging.** Recommended: Pro from submission to the end of January (about $75). This now matters for the score: the Validity criterion asks "Can it work in the real world?", and a paused database when a judge visits answers no.
2. **Local deadline: Sunday 15:00** (settled). Still ask the Local Lead about the pitch format.
3. **Team name.** The project name is HOTSPOT (settled). Write the team name into section 1.
4. **MODIS confidence cut-off: closed on 14 Nov.** The second team member verified the classes in the MODIS user's guide (table 11): low is under 30. Our cut-off is the official low class.
5. **North Evia box.** Adjust against the Copernicus EMSR527 map.
6. **More countries.** Only after the feature freeze checklist is green, and only within the storage limit.
7. **Does the daily update stop Supabase from pausing a free project?** Not confirmed.
8. **The claim that other public tools start in 2012.** Re-check before publishing it.
9. **Look and feel of the website.** Fonts, the colours outside the heatmap, and spacing are not decided. The team decides when the frontend work starts (Saturday afternoon). The heatmap ramps in section 9.5 are fixed; everything around them must keep readable contrast. The Impeccable design skill (used through Claude) will help with this.
10. **Loading states.** Only the failure state is described. The team decides what the visitor sees while the calendar, the map points and a CSV export are loading. Impeccable will help with this too.

Impeccable is an AI tool, so each use gets a line in `AI_USE.md`, and the team makes the final design choices.

---

## 15. References to cite

Links and DOIs are in the facts file.

- NASA FIRMS: MODIS Collection 6.1 active fire product; VIIRS 375 m active fire products (S-NPP, NOAA-20); country yearly files; Area API
- Giglio, Schroeder, Justice 2016 (the MODIS algorithm)
- Schroeder, Oliva, Giglio, Csiszar 2014 (the VIIRS 375 m algorithm). Its abstract is still unread; cite it as the product reference only.
- Fu et al. 2020 (MODIS misses 65% to 83% of VIIRS fire pixels, Northeast Asia only)
- Chen et al. 2026, GFED5NRT (the closest published precedent: scaling factors from the overlap years, the factory mask rule)
- Sofiev and Kouznetsov 2026 (detection limits)
- Copernicus EMS activations EMSR527 (Evia) and EMSR686 (Evros)
- EFFIS Statistics Portal (yearly burned area, Greece)
- Natural Earth; OpenStreetMap; OpenFreeMap
- [FIRMS FAQ, NASA Earthdata](https://www.earthdata.nasa.gov/data/tools/firms/faq) (what a hotspot is, Aqua start, burned-area caution)
- [NASA VIIRS Land, Active Fire Product](https://viirsland.gsfc.nasa.gov/Products/NASA/FireESDR.html) (the 750 m and 375 m products)
- [MODIS Collection 6 and 6.1 Active Fire Product User's Guide, version 1.0](https://earthdata.nasa.gov/s3fs-public/2023-09/MODIS_C6_C6.1_Fire_User_Guide_1.0.pdf) (confidence classes, table 11)
- [The challenge page](https://www.spaceappschallenge.org/2026/challenges/modis-and-viirs-hot-spots/)
- Every library and service in section 7

---

## 16. AI-use log (copy into `AI_USE.md` at 09:00 and keep adding)

| Date | Tool | Used for |
|---|---|---|
| 13 Nov 2026 | Gemini | Literature search on the sensors and the two fires. Results were fact-checked; see `verified-facts.md`. |
| 13 Nov 2026 | Claude | Checking sources in a browser; compiling `verified-facts.md`. |
| 13 to 14 Nov 2026 | Claude | Discussion of the approach, a quick feasibility look at the public Greek FIRMS files, drafting this master plan. |
| 14 Nov 2026 | Claude | Checking the plan against the judging criteria and the organisers' design steps; drafting `PROJECT-PAGE-CHOICES.md` and `JUDGE-QUESTIONS.md`. |
| 14 Nov 2026 | ChatGPT | A plain-language explanation of the topic in Greek for the second team member. Its suggestions (VIIRS 750 m as the main source, a 1 km grid, an alert system) were checked and not adopted. |
| 14 Nov 2026 | Claude | Fact-check of the ChatGPT conversation against NASA pages; quick counts on the Greece files (ratios, grid test, near-simultaneous passes); the notes `CHATGPT-ENRICHED-EL.md` and `FOR-MASTER-PLAN.md`; re-running the counts on the first machine. |
| During the event | | One line for each piece of AI-assisted code or text. |

---

## 17. Rule compliance

Nobody but the organisers can certify compliance. This list covers every rule in `verified-facts.md` section 1. Read the [Terms](https://www.spaceappschallenge.org/legal/), the [Participant FAQs](https://www.spaceappschallenge.org/resources/participant-faqs/) and the [Project Submission Guide](https://www.spaceappschallenge.org/resources/project-submission-guide/) yourselves once; the team is responsible, not the AI.

### Two grey areas to raise with the Local Lead

| Grey area | The facts | What to do |
|---|---|---|
| **Work before the start** | Before 09:00 Saturday we did research, wrote this plan in detail, and ran one quick count on public Greek FIRMS files to see if the idea was feasible. No project code, repository or database existed. | Ask the Local Lead whether detailed planning before the start is acceptable. Use no pre-start numbers. Write every line of code after 09:00. Keep the pre-start entries in the AI-use log. |
| **AI and the idea** | Much of the method was shaped in discussion with Claude. The rule says AI should not come up with the idea. | The team decides the method itself at 09:00, changes what it disagrees with, can defend every step, and discloses the AI's role truthfully. Ask the Local Lead if unsure. |

### Checklist

| Rule | How we comply | Check at submission |
|---|---|---|
| No work before the start | New repository created after 09:00; first commit time proves it | [ ] |
| Submit before the local deadline (Sunday 15:00) | First submission by 13:00 | [ ] |
| Team of 1 to 6, all registered at the same Local Event | Two members | [ ] |
| At least one NASA data source | FIRMS, named on the page | [ ] |
| Demo: 30-second video or at most 7 slides | Video timed before upload | [ ] |
| Everything in English | Page, video, README, app text | [ ] |
| All links public, no login | Tested in a private window | [ ] |
| Every source, library, dataset and service cited | `REFERENCES.md` copied to the page | [ ] |
| Open source | Apache-2.0 licence file; repository public | [ ] |
| AI use disclosed in text | `AI_USE.md` copied to the page: Claude, Impeccable, Gemini, ChatGPT | [ ] |
| AI use disclosed in metadata | Header note in each AI-assisted file | [ ] |
| AI images watermarked | We plan no AI images. If one is used, watermark it. | [ ] |
| No NASA logos or branding | None in the app, video or page | [ ] |
| Nobody under 18 in the materials | Screen recording only | [ ] |
| Non-NASA data used within each site's terms | Attribution shown for Copernicus, EFFIS, Natural Earth, OpenStreetMap | [ ] |
| No secrets published | FIRMS key and database password only in private `.env` files | [ ] |

---

## 18. Design process (the six steps the organisers presented)

Slide shown by the Greek NewSpace Society at the Local Event on 14 Nov 2026: **Empathize, Define, Ideate, Prototype, Test, Implement.** These steps are not scored. The five criteria of section 2 are. But the organisers taught this process, so local judges may ask how we followed it, and each step feeds a scored criterion: Empathize feeds Impact, Define feeds Relevance, Ideate feeds Creativity, Prototype feeds Presentation, Test feeds Relevance ("how usable") and Validity, Implement feeds Validity ("can it work in the real world") and Presentation.

This section covers all six steps. Everything in it is a **proposal for the team to confirm or change**. The first three steps are exactly where the idea must be the team's own.

### 18.1 Empathize: "Who is my user? What matters to this person?"

**Where the plan stood:** it listed audience groups but no single person, and nobody on the team has spoken to a real user. This is the weakest of the three steps.

**The team's own answers (written by the team in Greek on Saturday 14 Nov; translated here). These lead this section. Everything after them supports them.**

| The organisers' question | The team's answer |
|---|---|
| Who are we addressing? | Rescuers, research teams, and environmental scientists |
| What matters to them? | Avoiding possible fires. Collecting and using data for related research and applications. |
| What are their needs? | Being able to compare with history, so they can prepare properly (for example, fire is more likely in August) |

**Two kinds of user follow from this**

| User | What matters to them (the team's words) | What they need from HOTSPOT |
|---|---|---|
| **Rescuers and emergency responders** | Avoiding possible fires | Historical comparison for their own area, so they can prepare for the dangerous months |
| **Research teams and environmental scientists** | Collecting and using data for research and applications | A consistent, documented record they can download and build on |

These are two of the audiences the challenge itself names ("early warning and emergency responders, scientists, land managers, and firefighters"), so the team's choice and the challenge agree.

**A concrete example of the first user:** the duty officer of a regional civil protection or forest fire service in Greece, responsible for one area such as Evia or Evros. Not a satellite specialist.

**Two wording cautions, because a judge will test them**

- **"Avoiding fires."** HOTSPOT does not predict or prevent a fire. It shows when and where burning normally peaks, including agricultural burns, so that patrols, bans and readiness can be timed. On the page, say "prepare for the dangerous period and reduce the risk", not "avoid" or "predict".
- **"More likely in August."** HOTSPOT shows how much and how often each month burned in the past 26 years. That is a historical frequency, not a forecast. Say "August normally has the most fire activity here", not "the probability of fire is higher".

**What we know about this person, and where it comes from**

| What we believe | Evidence |
|---|---|
| They lack "a consistent picture of when and where burning has occurred" | The challenge text, written by the agency that set the challenge |
| They decide under time pressure and need to "rapidly visualize" | The challenge text |
| They watch particular places: "monitor sensitive regions" | The challenge text |
| They must pass results on, so they need to "download analytics and visualizations" | The challenge text |
| They need it "accessible and intuitive", not a research tool | The challenge text |
| **What we do not know:** what they use today, and what would make them distrust a number | Nobody was asked. State this honestly if a judge asks. |

**What both users need from a tool (added during planning, to support the team's answers)**

1. **Speed.** An answer in under a minute, with no training.
2. **Trust.** Where the number comes from, and how sure it is.
3. **Their own area.** Not a national total.
4. **Something to hand on.** An image or a table for a report or a briefing.

**Other users:** land managers (they need the seasonal pattern), firefighters and the public.

**Optional, 10 minutes, Person B:** ask one mentor at the venue who knows fire, civil protection or satellites three questions. Who needs this most? What do they use today? What would make them distrust it? Write the answers here and adjust the table. This is input for the design, not a quote for the page.

### 18.2 Define: "What are their needs?"

**Where the plan stood:** the problem was stated, but the needs were written as features. A judge following this process looks for needs first and features second.

**The need, in the team's words:** being able to compare with history, so they can prepare properly.

**The problem in one sentence:** rescuers and researchers need to compare fire activity in their own area with its history, to prepare for the dangerous months and to study how burning changes, but today the record is split between sensors that cannot be compared, and the older ones are ending.

The team's need is the core, and it maps to the first three rows below. The other rows are what that need requires in practice.

**Needs, and how each is answered**

| The user's question | Today's problem | Our answer | How we check it |
|---|---|---|---|
| "Is this month unusual here?" | Counts from different sensors cannot be compared, and there is no baseline for a chosen area | The "this month" card and the "difference from normal" view | The five-minute test |
| "When is the dangerous season here?" | Raw files must be downloaded and processed first | The "normal year" row and the peak season | The five-minute test |
| "How does this fire compare with the worst on record?" | A MODIS-era year such as 2007 cannot be set against 2021 or 2023 | The harmonized record, the rankings, the finding | Proof 4 (EFFIS) |
| "Can I trust this number?" | Dashboards do not show how a number was made | The arithmetic on hover, the ranges, the proof page | Proof 2 (blind test) |
| "Will it still work next year?" | S-NPP has ended; Terra and Aqua are planned to stop in 2027 | The record ends on NOAA-20, which continues | Proof 5 |
| "Can I put it in my report?" | Screenshots only | Image and CSV downloads | Manual check |
| "My area, not the whole country" | Official statistics are national yearly totals | Draw any area, or type a point and radius | Manual check |
| "Can I use the data in my own research?" (the researcher) | Hotspot files exist per sensor, with no common scale and no documented correction | The hotspots CSV with weights, the dataset release with its column description, the open address, the open code | The rebuild check (section 18.6) |

Rows 1, 2, 3 and 7 are mostly the rescuer's questions; rows 4, 5 and 8 are mostly the researcher's.

Every must-have in section 3 answers one of these eight questions. A feature that answers none of them is a should-have at most.

### 18.3 Ideate: "Brainstorm solutions, highlight opportunities for innovation"

**Where the plan stood:** it recorded what we chose, but not what else was considered. And the rule in section 17 matters most here: AI should not come up with the idea.

**Part 1. A team brainstorm, 15 minutes, without AI.** Both members, on paper, before more code is written. Three prompts:

1. "It is 2 a.m. in August and a fire has started in your region. What do you want this screen to tell you in ten seconds?"
2. "What would make you distrust a number on this screen?"
3. "What would you want to send to your chief or to the press?"

Write down every idea. Pick at most one that costs under 30 minutes and put it in the should-haves. Record the result here, and keep a photo of the paper for the project page.

**The team's notes of 14 Nov cover Empathize and Define but not Ideate, so this brainstorm is still to do.**

**One candidate that comes straight from the team's own need** ("fire is more likely in August"): a "how often" line beside the normal year, in the form "Fire activity was detected here in August in N of the last 26 years". It turns the team's example into something the user can read off the screen. About 20 minutes, from data the calendar already has. Caution: before 2012 the older sensor misses small fires, so the count for those years can be too low; say so next to it. The team decides whether to keep it; write the decision in the table.

| Idea from the team's brainstorm | Kept or dropped | Why |
|---|---|---|
| ______ | ______ | ______ |
| ______ | ______ | ______ |
| ______ | ______ | ______ |

**Part 2. Options already weighed during planning.** This is a true record. The planning was done with AI help, which is disclosed in section 16. The team confirms each choice or changes it.

| Question | Options considered | Chosen | Why |
|---|---|---|---|
| How to make the sensors comparable | Add them together; coarsen to grid cells per day; a scaling factor from the shared years; harmonize fire power instead of counts; factors per land cover | Scaling factor from the shared years | Adding fakes a jump. Coarsening looked no better in a quick check. Fire power saturates on VIIRS. Land cover needs extra data. The factor follows published practice (GFED5NRT). |
| Which years to fit on | All shared years; 2012 to 2019 only | 2012 to 2019 | The MODIS orbits drift after 2020 |
| Unit of the record | MODIS-equivalent; NOAA-20-equivalent | NOAA-20-equivalent | It is the sensor that continues |
| Where the correction lives | A coarse grid of corrected totals; a weight on every hotspot | A weight on every hotspot | Any drawn shape is exact, and the download is itself a harmonized dataset |
| What "normal" means | The mean; the median | The median, with the mean in the CSV | One extreme year should not move "normal" |
| Coverage | The whole world; one country done fully | Greece | A complete small tool beats a half-working large one |
| Case studies | Mati 2018; Evia 2021 and Evros 2023 | Evia and Evros | Mati burned in hours and left few hotspots |
| Where it runs | Files only; our own server; a hosted database | A hosted database | Exact area queries with no server to maintain |
| Which VIIRS product | The 750 m product, built for MODIS continuity; the 375 m product | 375 m | FIRMS distributes only the 375 m product, the challenge asks for the "greater detail" of VIIRS, and 750 m would still need a factor |
| Common grid or factor | Put both sensors on one grid and count cells; a factor from the shared years | The factor | Tested: the grid lowers the ratio from 3.4 to about 2.8 and no further |
| Time step of the calendar | Days; months | Months | The challenge asks for months and years against the median |
| Alerts | A warning system; a calendar of history | The calendar | The challenge does not ask for alerts, and they need weather data we do not have |

The last four rows come from the second team member's review of ideas suggested by ChatGPT. She checked each against NASA's pages and the data before rejecting it.

**Opportunities for innovation (the part judges score under Creativity)**

1. A glass box: every estimate shows the detections and the factor behind it.
2. The proof inside the product, not in a separate paper.
3. The raw-versus-harmonized switch for the user's own area.
4. An open dataset and an open address others can build on.
5. One finding that could not be made before.

### 18.4 Prototype: "Tactile representation of your best ideas. How can I show my idea?"

**Where the plan stood:** strong. The prototype is a working app on a public link, with a saved example behind it. Two gaps: nobody has drawn the screen yet, and no single picture was named as "the idea".

- **Paper wireframe, 15 minutes, Person B, ready for A by 15:00.** One sheet for the desktop screen and one for the phone. Boxes only: where the map, the calendar, the sentence, the rankings and the buttons sit. A approves it in five minutes before building the skeleton. This settles the layout before any screen code is written, and the photo is evidence of this step.
- **The one picture that is the idea:** the same calendar twice, raw and harmonized, with the jump in 2012 in the first and gone in the second. If a judge sees only one image, it should be this one. It is image 1 on the project page, the opening of the video, and the raw-versus-harmonized switch in the app.
- **Three levels of prototype, so the idea can always be shown:**

| Level | What it is | When it is used |
|---|---|---|
| Paper | The wireframe | Before the skeleton; on the project page as a process photo |
| Saved | The North Evia example and the screenshots | When there is no network, and in the pitch as a backup |
| Live | The app on its public link | Judging |

### 18.5 Test: "Share your idea with your original user for feedback. What worked? What didn't?"

**Where the plan stood:** strong on technical tests, weak on what this slide means by a test, which is feedback from the user.

**The tests we run, from code to people**

| Kind of test | What it checks | Where in the plan |
|---|---|---|
| Code tests | Each rule gives the right answer on made-up data | Section 9.7 |
| Sanity checks | The real data looks right, or the pipeline stops | Section 9.7 |
| The five proofs | The science holds against years and sources it never saw | Section 5 |
| Manual checks | The live site works on a phone, another network, a private window | Section 9.7 |
| Five-minute outsider test | A stranger can use it in under a minute | Section 9.7 |
| **User test** | The person it is built for says what worked and what did not | Below |

**The user test, in three levels**

1. **Outsiders (already a must).** Two people from outside the team, the five-minute test.
2. **A stand-in for the user (recommended).** The mentor who answered the three questions in 18.1 tries the live app on Saturday evening or Sunday morning. Ask the slide's two questions: what worked, and what didn't?
3. **A real user (optional, the team's decision).** Someone from a fire service, forestry, civil protection or a newsroom gets the live link on Sunday morning and answers the same two questions in a message. The "real user's reaction" must-have was removed earlier; this slide asks for it in so many words, so it is listed here as optional and nothing depends on it.

**Feedback log** (roles only, no names without permission)

| Who (role) | Task given | Time to answer | What worked | What did not | What we changed |
|---|---|---|---|---|---|
| ______ | ______ | ______ | ______ | ______ | ______ |
| ______ | ______ | ______ | ______ | ______ | ______ |
| ______ | ______ | ______ | ______ | ______ | ______ |

**The rule that makes a test count:** something must change because of it. The project page gets one honest line in the form "We tested with N people. X did not work. We changed Y." If nothing failed, say that, and say who tested.

### 18.6 Implement: "Document the final solution and put the vision into effect"

**Where the plan stood:** the documents were listed but not outlined, and "the vision" after the weekend was a single phrase.

**Document the final solution**

| Document | Reader | Contains | Owner |
|---|---|---|---|
| Project page | Judges | Section 12 | Both |
| README | Anyone who opens the repository | What it is, one screenshot, the live link; how it works in five lines; the rebuild steps; "Use our data"; limits; licence; AI note | B drafts, A checks the steps |
| Method page in the app | Users | The method in plain words, the proofs, the limits, the references | B writes, A supplies the numbers |
| Dataset description | Scientists | Every column, its unit, what the weight means, known limits | B (value-add A) |
| `REFERENCES.md`, `AI_USE.md` | The rules | Section 15 and section 16, kept current | B |

**The rebuild check, 15 minutes, Sunday morning.** Person B follows the README on her own machine, from an empty folder, with no help from A: get the code, install, run the pipeline, start the site. Every place she gets stuck is a gap in the README; fix the README, not her machine. This is what "document the final solution" means in practice, and it proves the open-source claim.

**Put the vision into effect**

| What | State at submission |
|---|---|
| A live tool on a public link | Must be true |
| A record that runs to this week | Must-have 12 |
| An open dataset and an open address | Must-have 11 and value-add A |
| A record that survives the end of MODIS | True by design: it already ends on NOAA-20 |

**Keeping it in effect until the winners are announced (26 January 2027)**

- Decide the Supabase plan (decision 1 in section 14). A paused database is the vision switched off.
- Set up the free uptime monitor before submitting.
- One of you opens the live link every Monday until 26 January.
- Keep the VPS paid if the daily update runs there.
- No feature changes after the deadline unless the Local Lead confirms they are allowed. Keeping it online is not a change.

**The vision after the weekend (three steps for the page's "what is next"; the team confirms or replaces them)**

1. **More countries.** The pipeline takes a country as a setting, so the Mediterranean is a matter of running it and checking the proofs for each country.
2. **An alert.** Tell a fire officer when their area goes above its normal for the month.
3. **A citable dataset.** A versioned public release that scientists can reference.
4. **The 750 m bridge.** Use NASA's VIIRS 750 m continuity product to separate the resolution effect cleanly: MODIS against 750 m, then 750 m against 375 m on the same satellite at the same instant. The team picks three of these four for the page.

### 18.7 How this reaches the page

Six short blocks on the project page (section 12): the user and their needs, the options we weighed with the brainstorm photo, the wireframe photo next to the finished screen, what we tested and changed, how to rebuild it, and what is next. Keep each to a few lines; the proofs still carry the page.
