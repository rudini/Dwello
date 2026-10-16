# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16 W8b: Tankbestand checks in the statement wizard (#136, #72, #73, #61)

- [x] @wip scenarios (statement-generate.feature, building-edit.feature), fach-reviewer before implementing (`docs/reviews/w8b-fachreview-1.md`; V-1, V-2, V-3, V-4, V-5, V-7, V-10, M-1 fixed; V-6, V-8, V-9 recorded)
- [x] #136: a missing reading whose Stichtag lies after today (Swiss day) is no finding
- [x] #72: building property «Kein Tank oder Tank stillgelegt» (migration, edit form, building page); with it the tank question stops; earlier readings without it give the missing-reading finding
- [x] #73: plausibility hint on the readings, never blocking: closing above opening + purchases, consumption ±25 % and CHF 100 against the year before
- [x] #61: valuation marker removed from `FuelStocks.svelte` (No scenario: a code comment only)
- Files: `backend/migrations/0011_building_no_tank.sql`, `backend/src/db/schema.ts`, `backend/src/routes/buildings.ts`, `backend/src/services/{fuel-stock,invoice-completeness}.service.ts`, `src/lib/{statement-wizard,types}.ts`, `src/lib/server/{building,building-form}.ts` (one mapper for the building of detail and edit), `src/routes/buildings/` (BuildingForm, BuildingFacts, FuelStocks, loads), `src/routes/statements/generate/{TankQuestion,CategoryCheck,CategoryFindingItem,PreviewChecks}.svelte`, `messages/*.json`, `docs/{data-model,api-specification}.md`, `tests/contracts/building.json`, tests and scenarios
- [x] code-reviewer round 1: `docs/reviews/w8b-review-1.md` (C-1, C-3, C-4, C-5, C-7 fixed; C-2, C-6 left)
- [x] fach-reviewer round 2: `docs/reviews/w8b-fachreview-2.md` (V-11 Major fixed with pg test and scenario, both seen red; V-12, V-14, V-15 fixed; V-13 with Anna P-1)
- [x] personas round 1: `docs/design/personas/helga-w8b.md` (P-1 fixed: help names where and in which order; tank question not reached: demo drafts), `docs/design/personas/anna-w8b.md` (P-1 framing fixed with a DOM test; that a negative consumption does not block is #73's decision)
- No daten-pruefer: no billed amount, statement, PDF or QR-bill changes; the checks only hint
- [ ] Helga round 2 (tank question with the Seepark drafts removed), fach-reviewer round 3 on V-11, closing code-reviewer round
- [ ] workflow-review, session archived, pull request
