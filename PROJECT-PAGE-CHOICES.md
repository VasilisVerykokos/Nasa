# What we chose to do, and what each choice gains

Use this as the checklist when writing the Space Apps project page. Every row must appear on the page itself, as text or an image. A judge may never open the app.

- Written 14 Nov 2026, before the start. Updated 14 Nov at 10:45 against the official judging criteria and the full challenge text. Drafted with AI help (Claude); list it in the AI-use disclosure.
- Details of each choice are in `MASTER-PLAN.md`. Sources are in `verified-facts.md`.
- **Fill every blank with numbers from the pipeline run.** Do not use numbers from before 09:00 Saturday.
- Tick the box only when the item is on the page.

**The five criteria (official wording, short form)**

- **I = Impact:** big problem or little? Will it help many, or a few?
- **C = Creativity:** novel, or an incremental improvement on something that exists?
- **V = Validity:** scientifically valid? Will it do what it sets out to do? Can it work in the real world?
- **R = Relevance:** responsive to the challenge? Complete? Feasible? Usable?
- **P = Presentation:** the story of the project: the challenge, the solution, why it is important.

---

## A. Choices that answer the challenge (Relevance)

Each row quotes the part of the challenge text it answers.

| # | What we chose to do | What it gains | Where on the page | On page |
|---|---|---|---|---|
| 1 | Let the user pick any area by drawing it, or by typing latitude, longitude and radius | R: "a map where users can draw the area of interest, or an option to enter latitude and longitude". We offer both. | What it does + screenshot | [ ] |
| 2 | Let the user pick a date range | R: "select a region and a specific date range" | What it does | [ ] |
| 3 | Show a calendar of years × months, from November 2000 to this week | R: hotspots "from the early 2000s to the present" | What it does + main screenshot | [ ] |
| 4 | A "normal year" row and a peak-season phrase | R: "which periods of the year see more fires" | What it does | [ ] |
| 5 | A total for each year, and the top years | R: "which years had more burning activity" | What it does | [ ] |
| 6 | Compare any month with the historical median, in one plain sentence | R + I: anyone can understand it | What it does | [ ] |
| 7 | A "this month so far against normal" card, fed by 2026 data | R: "compare the burning activity of the current month against the historical median" | What it does + screenshot | [ ] |
| 8 | A "difference from normal" view of the calendar | R: "unusual conditions"; "anomalies against multi-year averages" | What it does | [ ] |
| 9 | Colour ramps that colour-blind people can read, numbers on hover, a table view | R: "accessible color ramps" | What it does | [ ] |
| 10 | Download the calendar as CSV and as an image | R: "download analytics and visualizations" | What it does | [ ] |
| 11 | Download the hotspots of the search as CSV, with their weights | R: "A downloadable CSV File of hot spots detected during a search" | What it does | [ ] |
| 12 | Name the audience in the challenge's own words: early warning and emergency responders, scientists, land managers, firefighters | R + I: the judge sees their own audience | Who it helps | [ ] |

## B. Choices that make the science right (Validity)

| # | What we chose to do | What it gains | Where on the page | On page |
|---|---|---|---|---|
| 13 | Keep vegetation fires, including agricultural burns; remove fixed industrial heat sources and low-confidence detections | V: a factory that is hot every day would hide the fire signal. State it as our choice. | How it works | [ ] |
| 14 | Never add satellites together | V: three VIIRS satellites share one orbit, so adding them counts one fire up to three times | How it works | [ ] |
| 15 | Measure the MODIS-to-VIIRS factor ourselves, on 2012 to 2019 only | V: after 2020 the MODIS orbits drift, so later years would spoil the factor | How it works | [ ] |
| 16 | A separate factor for the Terra-only period (before July 2002) | V: most teams will miss that MODIS was one satellite at first | How it works | [ ] |
| 17 | End the record on NOAA-20, linked to S-NPP by a measured factor | V + R: S-NPP ended on 2 Nov 2026, so the record must continue on NOAA-20 | How it works + splice table | [ ] |
| 18 | Give every hotspot a weight, so the download is a harmonized hotspot dataset | V + C: the result is reusable data, not only a picture | How it works | [ ] |
| 19 | Show a range on every value before 2012, label it "estimate", and use a wider range for small areas | V: honest about what is measured and what is estimated | Limits | [ ] |
| 20 | No "N times normal" when the normal is tiny; show the two plain numbers | V: avoids dramatic ratios made of noise | How it works | [ ] |
| 21 | State the limits openly | V: judges trust a project that knows its limits | Limits | [ ] |

## C. The five proofs (Validity)

| # | What we chose to do | What it gains | Result to fill in | On page |
|---|---|---|---|---|
| 22 | Before/after chart: naive merge against harmonized | Shows the fake jump in 2012 and that we remove it | Jump in the naive merge: ____ times | [ ] |
| 23 | Blind test: fit on 2012 to 2016, predict 2017 to 2019 | Shows the method works on years it never saw | Error, all Greece: ____ % ; 1° squares: ____ % | [ ] |
| 24 | Evia 2021 and Evros 2023, day by day, against Copernicus burned-area maps | Shows the record follows real fires | Evia August 2021: ____ ; Evros: ____ | [ ] |
| 25 | Yearly record against official EFFIS burned area, 2006 to 2025 | Tests the pre-2012 estimates against an independent source | Agreement: ____ | [ ] |
| 26 | NOAA-20 against S-NPP on their shared years | Shows the last join is clean | Link factor: ____ | [ ] |

Publish the results as they come out. If an error is large, say so and widen the range.

## D. Choices that raise Impact and Creativity

| # | What we chose to do | What it gains | Result to fill in | On page |
|---|---|---|---|---|
| 27 | A record that starts in 2000 | C: the other public tools we looked at start in 2012. Re-check this before writing it. | Checked: ____ | [ ] |
| 28 | One finding nobody could make before (for example: was 2007 worse than 2021 or 2023?) | I + C: turns the tool into a discovery | Finding: ____ | [ ] |
| 29 | "Why now": S-NPP has ended, and Terra and Aqua are planned to stop in 2027 | R + I: the problem is urgent this year, for every long fire record | The challenge section | [ ] |
| 30 | "Use our data": the open address of the calendar function | C + I: others can build on it | Address: ____ | [ ] |
| 31 | New measured ratios for the Mediterranean, which we found published nowhere | C + Best Use of Science | Ratio: ____ (range ____ to ____) | [ ] |
| 32 | Start with Greece and two fires everyone here remembers | I + Local Impact: a real place and real events, not a demo | Case studies | [ ] |
| 33 | "Show the arithmetic": every estimate shows the NASA detections and the factor behind it | C + V: a glass box, not a black box | How it works + screenshot of a hover | [ ] |
| 34 | Three decisions the tool supports: planning the season, raising an alert, comparing a fire with the record | I: shows the quality of the impact, not only who might use it | Who it helps | [ ] |
| 35 | A table of what exists against what we add | C: answers "novel or incremental?" directly. Check every "exists" cell first. | What is new | [ ] |

## E. Optional, only if built

| # | What we chose to do | What it gains | Result to fill in | On page |
|---|---|---|---|---|
| 36 | Raw-versus-harmonized switch on the calendar | C + V: the user sees the fake jump vanish for their own area | Screenshot pair | [ ] |
| 37 | A bar chart of year totals with one cautious trend sentence | R: the challenge names "trends" | Trend: ____ | [ ] |
| 38 | Publish the full harmonized dataset as a download with a description of every column | I + Best Use of Data | Link: ____ | [ ] |
| 39 | Run the method on a second country | I + V: shows it is not a Greece-only trick | Country: ____ ; ratio: ____ | [ ] |
| 40 | Daily automatic update | V: "can it work in the real world" | Data through: ____ | [ ] |

If an optional item is not built, leave it off the page. Never describe something that does not work.

## F. Required by the rules

| # | Item | On page |
|---|---|---|
| 41 | NASA data named: FIRMS MODIS Collection 6.1 and VIIRS 375 m active fire products | [ ] |
| 42 | Partner data named: Copernicus EMS (EMSR527, EMSR686) and EFFIS | [ ] |
| 43 | References: every dataset, paper, library and service, copied from `REFERENCES.md` | [ ] |
| 44 | AI use: copied from `AI_USE.md` | [ ] |
| 45 | Demo link: the video is 30 seconds or less and plays without login | [ ] |
| 46 | Project link: the live app and the public repository | [ ] |
| 47 | Everything in English; no NASA logos; nobody under 18 | [ ] |

## G. The story order (Presentation)

The page has three acts, in the criterion's own words. Check the order before submitting.

| Act | Rows that belong in it | In order |
|---|---|---|
| 1. The challenge | 29, and the problem statement | [ ] |
| 2. The solution | 1 to 11, 13 to 26, 33 | [ ] |
| 3. Why it is important | 12, 27, 28, 30 to 32, 34, 35 | [ ] |

## H. The six design steps the organisers presented

Not scored by themselves, but local judges may look for them. Details are in section 18 of `MASTER-PLAN.md`.

| # | What we chose to do | What it gains | Where on the page | On page |
|---|---|---|---|---|
| 48 | Name the team's two users: rescuers and emergency responders, and research teams and environmental scientists. Say what matters to each: preparing for the dangerous months, and reliable data for research | Empathize → I: shows who is helped and why, in the team's own words | The challenge: the user and their needs | [ ] |
| 49 | State the need (historical comparison for preparation) and the problem in one sentence, and list the eight questions the users ask, each with our answer | Define → R: needs first, features second | The challenge: the user and their needs | [ ] |
| 50 | Show the options we weighed and why we chose each, plus the team's own brainstorm | Ideate → C: shows the choice was reasoned, and that the idea is the team's | The solution: options we weighed | [ ] |

| 51 | Show the idea at three levels: a paper wireframe, a saved example, the live app. Lead with one picture: the calendar raw and harmonized | Prototype → P: the idea is clear from a single image | Opening image; wireframe photo beside the finished screen | [ ] |
| 52 | Test with people, not only with code: outsiders, a mentor standing in for the user, and a real user if one is reached. State what did not work and what we changed | Test → R: "how usable or user friendly" is shown, not claimed | The solution: what we tested and changed | [ ] |
| 53 | Document it so a stranger can rebuild it, keep it online through judging, and give three next steps | Implement → V: "can it work in the real world" | Why it is important: use it and build on it | [ ] |

Fill rows 50 and 52 only with what really happened. If the brainstorm or a test was not done, leave it out.

## I. Added from the second team member's analysis (14 Nov)

| # | What we chose to do | What it gains | Result to fill in | On page |
|---|---|---|---|---|
| 54 | Frame the problem with NASA's own three differences: spatial resolution, sensitivity, observation schedule. State the goal in NASA's words: "the sensor of origin no longer matters" | R + P: the judge reads the challenge's own language | The challenge: the problem | [ ] |
| 55 | The looks-per-day rule: add Terra and Aqua (different times), never add the VIIRS satellites (same orbit) | V: answers a question an expert will ask | How it works | [ ] |
| 56 | Show why the type filter matters: non-vegetation rows are about 2% of MODIS and about 15% of VIIRS | V: the cleaning step is justified with numbers | MODIS ____ %, S-NPP ____ %, NOAA-20 ____ % | [ ] |
| 57 | Test the obvious alternative, a common grid, and show it fails (optional proof 7) | C + V: we did not assume, we measured | Ratio with no grid ____ ; with a grid ____ | [ ] |
| 58 | Split the factor into sensitivity and resolution, using passes minutes apart (optional proof 6) | C + V: explains where the factor comes from | Aqua saw ____ % of VIIRS fire cells; ____ pixels per MODIS pixel | [ ] |
| 59 | Say what the record can and cannot answer, with the four-row table | V: honest scope | Limits | [ ] |
| 60 | Name the VIIRS 750 m product as a next step, and say why it is not the main source | V + C: shows we know NASA's continuity product | Use it and build on it | [ ] |

Rows 57 and 58 go on the page only if the proof exists as a script in the repository.
