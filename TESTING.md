<!-- AI note: drafted with Claude Code (Claude Opus 5.5) for Person B on 14 Nov 2026, from MASTER-PLAN.md sections 9.7, 12, 17 and 18.5 and web/content/ui-text.md. Person B runs the tests; Person A fixes the bugs. -->

# HOTSPOT: testing checklist and feedback log

**Live site:** https://hotspots.gr/
**When:** Saturday 21:00 (first round), Sunday morning (second round), Sunday 12:00 to 13:00 (final check before submitting).
**Who:** Person B tests and writes everything down. Person A fixes. Stuck for 30 minutes means ask.

Mark each check ✓ (works), ✗ (broken: add a line to the bug list in section 5) or – (not built yet).

---

## 1. Before each round (2 minutes)

- [ ] Write down the time and the version under test (the last commit on GitHub).
- [ ] Open the live site once. If it says **"The database has no hotspots yet."**, the data is not loaded: do sections 2A, 2B (messages only), 2G and 2H, and tell Person A.

---

## 2. Manual checks

Do every check in a **private browser window** on a laptop. Then repeat the ones marked 📱 on a **phone using mobile data** (that is the "different network" check).

### 2A. Opening

| # | Check | Expected | Result |
|---|---|---|---|
| 1 📱 | Open the live link in a private window | The page loads with no login. "HOTSPOT" at the top, the data stamp next to it ("Data through …" or "Data date unavailable") | |
| 2 📱 | Look at the first screen | It opens on North Evia, never on an empty screen | |
| 3 | Look at every word on the screen | All in English, including dates and month names | |

### 2B. Choosing an area (must-have 1)

| # | Check | Expected | Result |
|---|---|---|---|
| 4 📱 | Press the **North Evia 2021** preset | The calendar fills; the headline names **August 2021** | |
| 5 | Press **Evros 2023** | The headline names a 2023 month | |
| 6 | Press **All Greece** | The calendar fills; August 2021 and August 2023 are the two highest Augusts (plan 9.7) | |
| 7 | Draw a polygon on the map | The calendar updates for the new shape | |
| 8 | Draw a rectangle | Drawing again replaces the old shape; the calendar updates | |
| 9 | Point form: 38.9, 23.25, radius 20, then **Use this point** | A circle appears; the calendar updates | |
| 10 | Point form: latitude **100** | "Latitude must be a number from -90 to 90, for example 38.9." | |
| 11 | Point form: **45**, **10**, radius **10** (Italy) | "This area is outside the covered region. HOTSPOT covers Greece only. Pick a preset or draw inside Greece." | |
| 12 | Point form: **35.9**, **24.5**, radius **2** (sea north of Crete) | "No hotspots were found in this area from November 2000 to today. Try a larger area." | |

### 2C. Calendar (must-have 3)

| # | Check | Expected | Result |
|---|---|---|---|
| 13 | Read the calendar for North Evia | Years down, months across, a total for each year, a "Normal" row; partial years marked | |
| 14 | Colours (when the heatmap is built) | Readable for colour-blind people; a legend explains them | |
| 15 | Hover or tab onto a cell (when the heatmap is built) | The number and where it came from ("show the arithmetic") | |
| 16 | "Difference from normal" view (when built) | Months above normal and below normal look different, and a legend says which is which | |

### 2D. Headline and rankings (must-haves 4 and 5)

| # | Check | Expected | Result |
|---|---|---|---|
| 17 📱 | Read the headline card for North Evia | One plain sentence, for example "August 2021 was … times the normal August here, the highest in 26 years.", with the two numbers under it | |
| 18 | Read the rankings | Top 5 months, top 5 years, a peak season in words; a note that partial years are left out of the top years | |
| 19 | Check one number by hand | The top month in the rankings has the same value as that month in the calendar | |

### 2E. Downloads (must-have 6)

| # | Check | Expected | Result |
|---|---|---|---|
| 20 | **Download calendar (CSV)** for North Evia | A file named like `hotspot-calendar_north-evia-2021_2000-11_2026-11.csv` | |
| 21 | Open that file in a spreadsheet (Excel, LibreOffice or Google Sheets) | One line per month; columns from `year` to `difference_from_normal`; numbers in their own columns | |
| 22 | **Download hotspots (CSV)** for North Evia | The button says "Preparing…" while it works, then a file arrives with one line per hotspot and a `weight` column | |
| 23 | Same for **All Greece**, and time it | A complete file, or the database's message about the 200,000 limit. Note the time it took | |
| 24 | Download calendar (image), Copy link | Not built yet (–) | |

### 2F. Other screens

| # | Check | Expected | Result |
|---|---|---|---|
| 25 | "Method and proof" page (when built) | The method in plain words, the proof charts, the limits | |
| 26 | "This month so far" card (when built) | A sentence about the current month, marked "so far" | |

### 2G. When things go wrong

| # | Check | Expected | Result |
|---|---|---|---|
| 27 | Turn off the Wi-Fi, then press a preset | "We could not reach the database. Try again in a minute." and a **Try again** button | |
| 28 | Turn the Wi-Fi back on, press **Try again** | The calendar loads | |
| 29 | Anywhere | No raw error text, no empty white screen | |

### 2H. Phone, keyboard, zoom

| # | Check | Expected | Result |
|---|---|---|---|
| 30 📱 | Use the whole page on the phone | Everything readable; the page never needs sideways scrolling (only the calendar box may slide) | |
| 31 | Laptop, keyboard only (Tab, Enter, Space) | You can reach and use every preset, field and button, and you can always see where you are | |
| 32 | Zoom the browser to 200% | Nothing overlaps or disappears | |
| 33 | Every link on the page and in the README, in a private window | Each one opens without a login | |

---

## 3. Five-minute test with outsiders (twice: Saturday evening, Sunday morning)

Two people **from outside the team**, at the venue. The goal: an outsider answers in **under one minute**.

1. Open the live site on a laptop or phone. Hand it over.
2. Say only: **"This is a website about fires in Greece. Was August 2021 unusual in North Evia?"**
3. Start a timer. **Do not help, point or explain.** If they ask you something, say "What would you try?"
4. Watch quietly. Write down every place they hesitate: where they look, what they press by mistake, what they say.
5. Stop when they answer, or after 5 minutes.
6. Then ask two questions: **"What worked?"** and **"What didn't?"**
7. Fill in one line of the feedback log (section 4).

Afterwards, pick the **single worst problem** and give it to Person A as a bug. Fix only that one before the next round.

**Mentor test (if a mentor is free):** the same task and the same two questions. Write the answers in the log with the role "mentor".

---

## 4. Feedback log

Roles only, no names without permission. For the project page: "We tested with N people. X did not work. We changed Y." If nothing failed, say that, and say who tested.

| When | Who (role) | Task | Time to answer | Where they hesitated | What worked | What did not | What we changed |
|---|---|---|---|---|---|---|---|
| | | Was August 2021 unusual in North Evia? | | | | | |
| | | Was August 2021 unusual in North Evia? | | | | | |
| | | Was August 2021 unusual in North Evia? | | | | | |
| | | Was August 2021 unusual in North Evia? | | | | | |

---

## 5. Bug list for Person A

One line per bug, with the steps to repeat it. Person A changes the status.

| # | When | Check # or screen | What happened | What should happen | Device and browser | Status |
|---|---|---|---|---|---|---|
| 1 | | | | | | open |
| 2 | | | | | | open |
| 3 | | | | | | open |

---

## 6. Final check before submitting (Sunday 12:00 to 13:00)

All of section 2 once more, then:

- [ ] The live link works in a private window, on a phone and on another network
- [ ] The repository is public and has the Apache-2.0 licence
- [ ] The video is 30 seconds or less and plays without a login
- [ ] Everything a judge reads is in English
- [ ] `REFERENCES.md` and `AI_USE.md` are complete and copied into the project page
- [ ] NASA FIRMS is named as the data source
- [ ] Every number on the project page comes from a script in the repository; none come from the quick checks before the pipeline
- [ ] Every fact on the project page is marked VERIFIED in `verified-facts.md` (Person B's fact check)
- [ ] No NASA logos anywhere; nobody under 18 in the materials
- [ ] No key or password in the repository: `git diff --cached` checked before every push
