# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16 W5d: «Abgerechnet bis» on the Mietvertrag (#133)

- [x] Read #133 and its comments (Option 3; a period past «Abgerechnet bis» bills Mietstage and Akonto from the day after); #281 and #130 do not change its outcome; no implementation issue exists, the decision is the requirement
- [x] @wip scenarios (run skips, Mietstage from the day after, contract page, edit form and help), seen red at the missing behaviour
- [ ] fach-reviewer before implementing
- [ ] Backend: column `billed_until`, contract API, statement calculation (Mietstage, Akonto, heating share) from the day after
- [ ] BFF: one helper for the first day Dwello bills, used by the run and `missingStatements` (#211 reuses it)
- [ ] UI: field and help in the edit form, shown on the contract page, hint in the missing-statements warning; texts in four languages
- [ ] Slice review, feature review (personas, fach-reviewer, daten-pruefer)
- [ ] Checks before push; workflow notes; archive the session
- [ ] Push, pull request, CI and merge (CLAUDE.md, Workflow 9)
