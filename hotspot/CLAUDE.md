# HOTSPOT: instructions for Claude Code

NASA Space Apps Challenge 2026, "Harmonization of MODIS and VIIRS Hot Spots". Deadline: Sunday 15 Nov 2026, 15:00 local time.

## Read first

- Read `C:\Users\User\Desktop\nasa\MASTER-PLAN.md` before any work, and follow its order (revised clock in section 10, code design in section 9).
- Facts come from `C:\Users\User\Desktop\nasa\verified-facts.md`. Use only facts marked VERIFIED on anything a judge will read.

## Where the data is

The Greece data is already downloaded. Do not download it again.

- Location: `C:\Users\User\Desktop\nasa\data\raw`
- Copy it to `pipeline/data/raw` in this project and keep that folder out of Git (`.gitignore`).

| Folder | Sensor | Years | Files | Rows | File name pattern |
|---|---|---|---|---|---|
| `modis` | MODIS (Terra + Aqua) | 2000 to 2025 | 26 | 46,350 | `modis_{year}_Greece.csv` |
| `viirs-snpp` | VIIRS S-NPP | 2012 to 2025 | 14 | 90,442 | `viirs-snpp_{year}_Greece.csv` |
| `viirs-jpss1` | VIIRS NOAA-20 | 2018 to 2025 | 8 | 49,563 | `viirs-jpss1_{year}_Greece.csv` |

- Greece only, raw rows before any cleaning. Every file has a `type` column.
- A zipped copy for the teammate: `C:\Users\User\Desktop\nasa\greece-firms-data.zip`.
- 2026 is not included. It comes from the FIRMS Area API with the MAP_KEY in `.env` (plan, section 4, step 6).
- Any other country must be downloaded the same way first (address patterns in the plan, section 6).

## Keep the judge answers current

Whenever a decision is made (a threshold, a date, a cut feature, a library, a number from the pipeline, a surprise, a workaround), in the same step:

1. Add a row to the decision log in `C:\Users\User\Desktop\nasa\JUDGE-QUESTIONS.md`.
2. Update the answer and status of every question it touches.
3. Add any new question it raises, with its answer.

When a pipeline run produces a number that fills a blank there or in `C:\Users\User\Desktop\nasa\PROJECT-PAGE-CHOICES.md`, fill it.

## Competition rules that bind every change

- This is a new project. Copy no code from AEGIS or any earlier work.
- Add one line to `AI_USE.md` per session: date, tool, what it wrote.
- Put a one-line AI note at the top of each file you write.
- Add every new library, dataset or service to `REFERENCES.md` in the same step that first uses it.
- Everything a judge can read is in English.
- Never write a key or password into any file except `.env`, and never commit `.env`. The team types secrets themselves.
- Licence: Apache-2.0.

## How to work

- Smallest complete solution. Must-haves before should-haves; never start a should-have while a must-have is unfinished.
- One step at a time. Each rule in section 9.7 of the plan gets its test in the same step.
- Python is started with `py -3.13` (plain `python` is 3.10 on this machine). Node 26.13.1, npm 11.20.0.
- The team decides the method and must be able to explain every step. Explain what you built in plain words when you finish a step.
