# AI use

A dated log of AI help (plan, section 16). One line per piece of AI-assisted code or text.

| Date | Tool | Used for |
|---|---|---|
| 13 Nov 2026 | Gemini | Literature search on the sensors and the two fires. Results were fact-checked; see `verified-facts.md`. |
| 13 Nov 2026 | Claude | Checking sources in a browser; compiling `verified-facts.md`. |
| 13 to 14 Nov 2026 | Claude | Discussion of the approach, a quick feasibility look at the public Greek FIRMS files, drafting the master plan. |
| 14 Nov 2026 | Claude | Checking the plan against the judging criteria and the organisers' design steps; drafting `PROJECT-PAGE-CHOICES.md` and `JUDGE-QUESTIONS.md`. |
| 14 Nov 2026 | ChatGPT | A plain-language explanation of the topic in Greek for the second team member. Its suggestions (VIIRS 750 m as the main source, a 1 km grid, an alert system) were checked and not adopted. |
| 14 Nov 2026 | Claude | Fact-check of the ChatGPT conversation against NASA pages; quick counts on the Greece files (ratios, grid test, near-simultaneous passes); planning notes; re-running the counts on the first machine. |
| 14 Nov 2026 | Claude Code (Claude Sonnet 5.5) | `pipeline/config.py`, `pipeline/clean.py`, `pipeline/tests/test_clean.py` (from the AI notes in those files). |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5) | First run of the cleaning step; per-row confidence rule and unknown-satellite check in `clean.py`; `pipeline/factors.py`, `pipeline/harmonize.py`, `pipeline/tests/test_harmonize.py`; first factors and yearly totals. |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5) | `pipeline/validate.py` and `pipeline/tests/test_validate.py` (blind test, proofs 1, 2, 4 and 5 as files in `web/public/proof/`, sanity checks); a one-off check of a season split (not adopted); pipeline entries in `REFERENCES.md`. |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5) | Season split in `pipeline/factors.py`, `harmonize.py`, `validate.py` and their tests, after the team chose to adopt it; `season` column in the `factors` table of `db/schema.sql`. |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5) | Minimum-detections fallback in `pipeline/factors.py` and its tests, after a review finding; re-run of the proofs. |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5) | `db/schema.sql` (tables, security, the four database functions) and `db/apply_and_test.py` (applies it to Supabase and tests it with made-up rows). |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5) | `web/` set up with Vite, React, TypeScript and Vitest; `web/src/lib/stats/index.ts` (normal, comparison, headline, rankings, peak season, difference from normal, this month so far) and its tests `index.test.ts`. |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5) | `.github/workflows/pages.yml` (test, build, publish); `web/src/lib/geo` (circle from point + radius, presets, Greece check) and its tests; `web/src/components/AreaPicker.tsx` (Leaflet map with drawing, presets, point form); page skeleton in `App.tsx` and `index.css`. |
| 14 Nov 2026 | Claude Code (Claude Sonnet 5.5), Person B | `pipeline/evidence/`: the Evros 2023 and Evia 2021 Copernicus files and the EFFIS yearly table, typed from `verified-facts.md`; `greece.geojson`, cut from the Natural Earth 1:10m countries file; the repository-layout entry in the plan. |
| 14 Nov 2026 | Claude Code (Claude Sonnet 5.5), Person B | `WIREFRAME.md`: draft desktop and phone wireframes, component states, UI best-practice list from web research. |
| 14 Nov 2026 | Claude Code (Claude Sonnet 5.5), Person B | Design artifact "HOTSPOT Mockup": high-fidelity desktop, phone and Method and proof screens built from `WIREFRAME.md`. The numbers on it are invented layout data. Not committed to the repository. |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5) | `web/src/api/calendar.ts` (the `calendar` database call); `web/src/components/CalendarTable.tsx` (plain calendar with year totals and the normal year) and its test; loading, error, "no hotspots" and "outside Greece" messages in `App.tsx`. |
