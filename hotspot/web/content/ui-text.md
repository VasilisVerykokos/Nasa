<!-- AI note: drafted with Claude Code (Claude Opus 5.5) on 14 Nov 2026 from "HOTSPOT Mockup.pdf", WIREFRAME.md and MASTER-PLAN.md section 9.5, checked against verified-facts.md and the current web/src code. Person B owns the words. -->

# HOTSPOT: every word on the Calendar screen

For Person A. Copy each string as written. Text in `{braces}` is filled by the code; the numbers shown in braces are examples only, not results. Items marked **CODE** are places where the current code says something different; the reason is given.

Rules for all text: plain English, short sentences, no jargon. "Hotspot" is explained once, next to the headline. Every button names its result.

## Header and footer

| Where | Text |
|---|---|
| Name | HOTSPOT |
| Tagline under the name (optional) | 26 years of fire activity in Greece, on one consistent scale |
| Tabs | Calendar · Method and proof |
| Data stamp | Data through {12 Nov 2026}, updated daily. ", updated daily" appears only if the last update is at most 2 days old. |
| Data stamp, date unknown | Data date unavailable |
| Footer | Data: NASA FIRMS, Copernicus EMS, EFFIS, Natural Earth, OpenStreetMap contributors. Open source under Apache-2.0. Not endorsed by NASA. |

## Area (left column)

| Where | Text |
|---|---|
| Section heading | Area |
| Preset buttons | North Evia 2021 · Evros 2023 · All Greece |
| Drawing tools | Polygon · Rectangle |
| Hint under the map | Draw one shape. Drawing again replaces the old one. |
| Map label for screen readers | Map. Draw a polygon or rectangle with the tools at the top left, or type a point below. |
| Form heading | Or type a point |
| Fields | Latitude · Longitude · Radius (km). No placeholders: a grey example looks like a real value. |
| Hint under the fields | For example latitude 38.9, longitude 23.25, radius 20 km. Draws a circle on the map. |
| Area name after typing | The numbers as typed, for example "38.0, 23.25, radius 10 km". |
| Preset button | Also clears the typed point. |
| After "Use this point" | Focus moves to the result heading, so the result or the "outside" message is seen. |
| Button | Use this point |
| Error, latitude | Latitude must be a number from -90 to 90, for example 38.9. |
| Error, longitude | Longitude must be a number from -180 to 180, for example 23.25. |
| Error, radius | Radius must be more than 0 and at most 300 km. |

## Date range

| Where | Text |
|---|---|
| Section heading | Date range |
| Fields | From · To |
| Hint | These dates change which years you see. "Normal" is always worked out from the whole record. |
| Button | Whole record |
| Error, From after To | The start date must be before the end date. |
| Error, outside the record | Choose dates from 1 Nov 2000 to {12 Nov 2026}, the whole record. |

**Built as day fields** (native date inputs, English labels), so the error says "date", not "month". The note below is from the mockup:

**CODE:** in the mockup the month fields show "Νοέμβριος 2000" because the browser uses the computer's Greek setting. Set `<html lang="en">` and format months in English (for example "Nov 2000"), or use two drop-downs (month, year), so judges see English everywhere.

## Status line (announced to screen readers, `aria-live="polite"`)

| When | Text |
|---|---|
| Loading | Loading the calendar… |
| Refreshing, old content still shown | Updating… |
| Done | Calendar updated for {North Evia 2021}. |

## Headline card (must-have 4)

| Where | Text |
|---|---|
| Small label above | None. The area name is already the heading above the card. |
| Sentence | Made by `headline()` in `web/src/lib/stats`. Its three forms are below. |
| Line under the sentence | {3,252} hotspots against a normal of {208}. Shown only after the "N times" form: the other two forms already give both numbers. |
| Which month | Until a month can be clicked on the calendar, the card shows the area's highest month among the years in the date range (the whole record if no range is set). "Normal" and the rank still use the whole record. |
| Help line | A hotspot is a spot a satellite saw as hot, usually a fire. Normal is the middle value (median) for that calendar month, 2001 to 2025. |

The three forms the code makes, all correct as written:

- "{August 2021} was {15.6} times the normal {August} here, the highest in {26} years."
- Normal below 5: "{March 2005} had {8} hotspots here, against a normal of {2}." (never "4 times")
- Normal 0: "{January 2010} had {3} hotspots here, where a normal {January} has none; the highest in {26} years."

## This month so far (must-have 12)

| Where | Text |
|---|---|
| Badge | So far |
| Sentence | Made by `thisMonthSoFar()`, for example "November 2026 so far has 2 hotspots here, against a normal of 1." (Normal 0: "... has 2 hotspots here, where a normal November has none.") |
| Help line | Normal here is the median of the same first {12} days of the month, 2001 to 2025. The month is not finished, so its count can still rise, and it is not ranked. (The second sentence is left out when the "API failed" line shows.) |
| API failed | The newest days could not be loaded. Showing {October 2026}, the latest complete month. |

**CODE:** done (`ThisMonthCard.tsx`, Sat 20:45). `calendar` returns `so_far`, so the card compares with the median of the same first days, as the mockup said. "API failed" shows when the newest data is not from the current month.

## View switch and calendar (must-have 3)

| Where | Text |
|---|---|
| Switch label | Show |
| Options | Hotspots · Difference from normal |
| Raw switch (should-have 1) | Raw counts, sensors simply added |
| Raw view subtitle in the picture | Detections per month, sensors simply added. Data through {14 Nov 2026}. (Shortened so it fits the picture.) |
| Raw switch hint | No scaling. Watch the jump in 2012, when VIIRS starts: the fires did not change, the instrument did. |
| Calendar heading | Calendar, {2001} to {2026} |
| Table button | Show as table / Show as calendar |
| Column headings | Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec · Year total |
| Normal row | Normal |
| Partial year mark | {2026}* |
| Note under the calendar | * {2026} is a partial year, left out of yearly rankings. Normal = the median of each calendar month, 2001 to 2025. |
| Phone hint | Slide the box sideways for all months. (The year column does not stay in place: the calendar is one picture, so it can be saved as an image. Pinning it would need a second picture.) |
| Legend, counts | Hotspots per month (square-root scale) |
| Legend, difference | Below normal · Normal · Above normal |
| Legend, patterns | Estimated before 2012 · No data · Provisional · This month so far |

### Cell hover, focus and tap ("show the arithmetic")

| Month type | Text |
|---|---|
| NOAA-20 month (2019 on) | {August 2021}: {3,252} hotspots. Counted by VIIRS NOAA-20, no scaling. |
| S-NPP month (Feb 2012 to 2018) | {August 2014}: {1,040} hotspots. Counted by VIIRS S-NPP, × {1.04} to NOAA-20 units. |
| MODIS month (before Feb 2012) | {August 2007}: about {13,138} hotspots, an estimate (range {9,722} to {16,554}). Measured by MODIS: {3,052} detections, converted to VIIRS units. |
| Provisional month | Add: Provisional: near-real-time data until NASA releases the final data. |
| Difference view | {August 2021}: {+3,044} against the normal {August} of {208}. |
| Where it shows | A small box at the hovered, focused (arrow keys) or tapped cell, inside the calendar and the screen. Screen readers get the same text from a hidden line, plus "Press another cell to compare." |
| Hint under the calendar | Point at a month, tap it, or press Tab and use the arrow keys, to see how its number was made. |

The range is the blind-test error, now ±26% (decision log, Sat 17:52). Read it from `meta`; do not write it into the code.

Accessible name of each cell, so a screen reader needs no tooltip: "{August 2021}, {3,252} hotspots, measured" or "{August 2007}, about {13,138} hotspots, estimated".

## Rankings (must-have 5)

| Where | Text |
|---|---|
| Section heading | Rankings |
| Column headings | Top 5 months · Top 5 years · Peak season |
| Row form | 1. Aug 2021 · 3,252 |
| Peak season | {July to September} |
| Peak season line | holds {74}% of a normal year's hotspots. **Not shown yet:** `peakSeason()` returns only the months. Person A can make it return the share too. |
| Note | {2000} and {2026} are partial years and are left out of the top years. (Not "not ranked": their finished months still appear in the top 5 months.) |

## Downloads (must-have 6)

| Where | Text |
|---|---|
| Section heading | Download |
| Buttons | Download calendar (CSV) · Download calendar (image) · Download hotspots (CSV) · Copy link |
| While working | Preparing… (button disabled) |
| Link copied | Link copied |
| Too many rows | This selection has more than 200,000 hotspots. Make the area smaller or the dates shorter, then try again. |
| Nothing to download | No hotspots to download for this area and these dates. |

**CODE:** above 200,000 rows the database stops first, with its own words: "This selection has {N} hotspots; the export limit is 200,000. Choose a smaller area or a shorter date range." The page shows that text as it is. It is clear, so it can stay; to use the "Too many rows" text above instead, Person A changes the message in `db/schema.sql`.
| Not shown yet | "Copy link" waits for the share link (should-have 5). |
| Hint | Files are named with the area and the dates, for example hotspot-calendar_north-evia-2021_2000-11_2026-11.csv |

## Messages (must-have 8)

| When | Text |
|---|---|
| Outside Greece | This area is outside the covered region. HOTSPOT covers Greece only. Pick a preset or draw inside Greece. |
| No hotspots | No hotspots were found in this area from November 2000 to today. Try a larger area. |
| Database unreachable | We could not reach the database, so you are looking at the saved North Evia example. Try again in a minute. **Until the saved example exists, the page says only:** We could not reach the database. Try again in a minute. |
| Button with it | Try again |
| Shape too complex | Comes from the database and is already written for people ("The area has 812 corner points; the limit is 500..."). Show it as it is. |

**CODE:** `App.tsx` shows "Could not load the calendar: {error}". The plan (section 9.5) says never a raw error: use the "Database unreachable" message for network failures and keep the database's own message only for the shape limits.
