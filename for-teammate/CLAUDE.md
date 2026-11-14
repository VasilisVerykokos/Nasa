# HOTSPOT: instructions for Claude Code (second team machine, Person B)

NASA Space Apps Challenge 2026, "Harmonization of MODIS and VIIRS Hot Spots". Deadline: Sunday 15 Nov 2026, 15:00 local time.

This file lives in the repository root on this machine: `C:\Users\diama\Desktop\NASA\CLAUDE.md`. It is local: Git ignores it through `.git/info/exclude`, and it is never committed. A shared copy is kept in `for-teammate/CLAUDE.md`; when this file changes, copy it there so Person A sees the change.

If any path below is wrong on this machine, correct it here first.

## Read first

- The four planning files are in the repository root and shared through Git: `MASTER-PLAN.md`, `verified-facts.md`, `PROJECT-PAGE-CHOICES.md`, `JUDGE-QUESTIONS.md`. Run `git pull` before reading them.
- Read `MASTER-PLAN.md` before any work. This machine's user is **Person B**: sections 11 and 5 (proofs 6 and 7) say what she owns.
- Facts come from `verified-facts.md`. Its section 10 overrides the earlier sections. Use only facts marked VERIFIED on anything a judge will read.

## Planning files: edited directly, shared through Git

- Since Saturday 14 Nov, 17:40, decisions go straight into the planning files. `FOR-MASTER-PLAN.md` is retired: its content was merged into the plan. Do not recreate it.
- Whenever a decision is made here (a threshold, a number from a script, a surprise, a workaround, a question someone asked), in the same step and without being asked:
  1. Write it into `MASTER-PLAN.md`, in the section it belongs to.
  2. Add a row to the decision log in `JUDGE-QUESTIONS.md`, update the answer and status of every question it touches, and add any new question it raises, with its answer.
  3. Put a new fact into `verified-facts.md`, with its status (VERIFIED, second-hand, unverified).
- Run `git pull` before editing a planning file. Keep edits small and in place: no reformatting, no reordering, no rewording of text you are not changing. Person A edits the same files, and small edits merge cleanly.
- Commit and push planning edits soon after making them, and tell Person A what changed.

## Where the data is

- The Greece data is already on this machine: `C:\Users\diama\Desktop\NASA\greece-firms-data` (folders `modis`, `viirs-snpp`, `viirs-jpss1`, 48 files). Do not download it again.
- Copy it to `hotspot/pipeline/data/raw` when the pipeline needs it. That folder is in `.gitignore`.
- `greece-firms-data/`, `CLAUDE.md` and `CHATGPT-ENRICHED-EL.md` are excluded on this machine only, in `.git/info/exclude`. Never commit them.
- Row counts to expect: 46,350 (MODIS), 90,442 (S-NPP), 49,563 (NOAA-20).
- 2026 is not included. Person A pulls it from the NASA API.

## What Person B works on

In this order. Nothing later may delay anything earlier.

1. Evidence files: the Copernicus burned-area dates for Evros and Evia and the EFFIS yearly table, typed from `verified-facts.md` into small data files. The Greece outline file. (Done 14 Nov, in `hotspot/pipeline/evidence/`. The Evia box is still an estimate until read off the EMSR527 map.)
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
- Each is one script in `hotspot/pipeline/` that writes one small data file into the website's `public/proof/` folder.
- State the limits of proof 6 next to its result (plan, section 5). The expected values are in the plan, section 5.
- A number goes on the project page only if a script in the repository produced it.

## Git on a shared repository

- Run `git pull` before starting and before every push.
- Before every push, run `git diff --cached` and check that no key or password appears.
- Install with `npm ci`, never `npm install`. Only Person A adds or updates libraries.
- Do not edit a file Person A is working on. Ask first.
- Small commits with clear messages.

## Competition rules that bind every change

- This is a new project. Copy no code from any earlier work.
- Add one line to `AI_USE.md` per session: date, tool, what it wrote.
- Put a one-line AI note at the top of each file you write.
- Add every new library, dataset or service to `REFERENCES.md` in the same step that first uses it.
- Everything a judge can read is in English.
- Never write a key or password into any file except `.env`, and never commit `.env`. `.env.example` keeps the key names with empty values. The team types secrets themselves.
- Licence: Apache-2.0.

## How to work

- Smallest complete solution. Must-haves before should-haves.
- One step at a time, each with its check.
- Python is started with `py -3.13`. Node 26.13.1, npm 11.20.0.
- Explain what you built in plain words when you finish a step. Person B must be able to explain it to a judge.
