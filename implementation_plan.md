# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session 2026-10-16 W8b: Tankbestand checks in the statement wizard (#136, #72, #73, #61)

- [ ] @wip scenarios (statement-generate.feature, building-edit.feature), fach-reviewer before implementing
- [ ] #136: a missing reading whose Stichtag lies after today (Swiss day) is no finding
- [ ] #72: building property «Kein Tank oder Tank stillgelegt» (migration, edit form, building page); with it the tank question stops; earlier readings without it give the missing-reading finding
- [ ] #73: plausibility hint on the readings, never blocking: closing above opening + purchases, consumption ±25 % and CHF 100 against the year before
- [ ] #61: valuation marker removed from `FuelStocks.svelte` (No scenario: a code comment only)
- [ ] slice reviews, feature review (personas, fach-reviewer, daten-pruefer)
- [ ] workflow-review, session archived, pull request
