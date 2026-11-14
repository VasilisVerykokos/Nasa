# HOTSPOT: instructions for Claude Code (second team machine, Person B)

NASA Space Apps Challenge 2026, "Harmonization of MODIS and VIIRS Hot Spots". Deadline: Sunday 15 Nov 2026, 15:00 local time.

Put this file in the root of the cloned `hotspot` project folder, named `CLAUDE.md`. It is local to this machine: list `CLAUDE.md` in `.gitignore` and never commit it.

If any path below is wrong on this machine, correct it here first.

## Read first

- The planning files are copies. They live in `C:\Users\diama\Desktop\NASA\`: `MASTER-PLAN.md`, `verified-facts.md`, `PROJECT-PAGE-CHOICES.md`, `JUDGE-QUESTIONS.md`.
- Read `MASTER-PLAN.md` before any work. This machine's user is **Person B**: sections 11 and 5 (proofs 6 and 7) say what she owns.
- Facts come from `verified-facts.md`. Its section 10 overrides the earlier sections. Use only facts marked VERIFIED on anything a judge will read.

## The master copies are on the other machine

- **Do not edit the four planning files here.** They are replaced whenever Person A sends a new zip.
- Write every proposal, new fact, decision and new judge question into one note: `C:\Users\diama\Desktop\NASA\FOR-MASTER-PLAN.md`. For each item say where it belongs and why, as in the first version of that note. Person A merges it.
- Whenever a decision is made here (a threshold, a number from a script, a surprise, a workaround, a question someone asked), add it to that note in the same step, without being asked. That is how `JUDGE-QUESTIONS.md` stays current.

## Where the data is

- The Greece data is already on this machine: `C:\Users\diama\Desktop\NASA\greece-firms-data` (folders `modis`, `viirs-snpp`, `viirs-jpss1`, 48 files). Do not download it again.
- Copy it to `pipeline/data/raw` in the project and keep that folder out of Git.
- Row counts to expect: 46,350 (MODIS), 90,442 (S-NPP), 49,563 (NOAA-20).
- 2026 is not included. Person A pulls it from the NASA API.

## What Person B works on

In this order. Nothing later may delay anything earlier.

1. Evidence files: the Copernicus burned-area dates for Evros and Evia and the EFFIS yearly table, typed from `verified-facts.md` into small data files. The Greece outline file.
2. The paper wireframe of the screen, due Saturday 17:00.
3. `REFERENCES.md`, `AI_USE.md` and the README, kept current.
4. All words on the screen: method page text, button labels, the limits list, the "why now" paragraph.
5. Look and feel and loading states, with Impeccable.
6. Testing: the manual checklist, the five-minute test with outsiders, the feedback log.
7. React parts, only after Person A has built the skeleton and shown one worked example: headline sentence, rankings, export buttons, data stamp, messages, then the radius form and date range.
8. Proofs 6 and 7 (optional), only after Person A's cleaning step exists in the repository.
9. Sunday: the dataset release with its column description, the rebuild check from the README, screenshots, the 30-second video, the fact check of the project page.

## Rules for proofs 6 and 7

- They must import the project's own cleaning step. Never copy the filters into a second place.
- Each is one script in `pipeline/` that writes one small data file into `web/public/proof/`.
- State the limits of proof 6 next to its result (plan, section 5).
- A number goes on the project page only if a script in the repository produced it.

## Git on a shared repository

- Run `git pull` before starting and before every push.
- Install with `npm ci`, never `npm install`. Only Person A adds or updates libraries.
- Do not edit a file Person A is working on. Ask first.
- Small commits with clear messages.

## Competition rules that bind every change

- This is a new project. Copy no code from any earlier work.
- Add one line to `AI_USE.md` per session: date, tool, what it wrote.
- Put a one-line AI note at the top of each file you write.
- Add every new library, dataset or service to `REFERENCES.md` in the same step that first uses it.
- Everything a judge can read is in English.
- Never write a key or password into any file except `.env`, and never commit `.env`. The team types secrets themselves.
- Licence: Apache-2.0.

## How to work

- Smallest complete solution. Must-haves before should-haves.
- One step at a time, each with its check.
- Python is started with `py -3.13`. Node 26.13.1, npm 11.20.0.
- Explain what you built in plain words when you finish a step. Person B must be able to explain it to a judge.
