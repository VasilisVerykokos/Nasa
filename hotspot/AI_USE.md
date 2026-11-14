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
| 14 Nov 2026 | Claude Code (Claude Opus 5.5) | `db/schema.sql` (tables, security, the four database functions) and `db/apply_and_test.py` (applies it to Supabase and tests it with made-up rows). |
| 14 Nov 2026 | Claude Code (Claude Opus 5.5) | `web/` set up with Vite, React, TypeScript and Vitest; `web/src/lib/stats/index.ts` (normal, comparison, headline, rankings, peak season, difference from normal, this month so far) and its tests `index.test.ts`. |
