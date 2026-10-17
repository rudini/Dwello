# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session W16: categories marked «Brennstoff» hold a Tankbestand (#100)

Branch `claude/w16-brennstoff-100`. #100's "Decided" section (option 2) is the requirement; implemented directly, no separate implementation issue. The glossary already has «Brennstoff (Kategorie)» (an attribute of an allocable heating cost category), so no marker.

- [x] `@wip` scenarios (building-detail.feature: own heating category and the chimney sweep are not offered; categories.feature: an own category marked Brennstoff is offered), committed and reviewed by `fach-reviewer` before implementing
- [x] fach-reviewer round 1 (`docs/reviews/w16-fachreview-1.md`)
- [x] migration `0024_category_fuel.sql`: `categories.is_fuel`, set for the predefined «Heating» and every category that already has a Tankbestand; schema, data-model.md, PRD, contracts
- [x] backend: `isFuelCategory` reads the flag (no name check); create/update take `isFuel`, stored only with `isHeatingCost`; a category with a Tankbestand stays Brennstoff (`CATEGORY_FUEL_HAS_STOCK`); `*.pg.test.ts` for the predefined chimney sweep and an own heating category
- [x] frontend: building page filters by the flag; category form checkbox «Brennstoff» with help (only with «Heizkosten nach dem Heizprofil verteilen»); texts in four languages
- [x] a11y state `category-new` `fuel` (screens.json, accessibility.feature, sprachen-bildschirme.feature)
- [x] code-reviewer round 1 (`docs/reviews/w16-review-1.md`)
- [x] personas (`docs/design/personas/helga-w16.md`, `docs/design/personas/marco-w16.md`); fach-reviewer round 2 (`docs/reviews/w16-fachreview-2.md`)
- [x] fixes of the review findings: refusal scenario and a11y screen `category-edit-fuel`, texts naming both checkboxes, migration only for heating costs, api-specification, translation terms
- [ ] Workflow note: auto mode refuses running a test with the code taken out to show its red (the E2E scenario of the refusal was written after the backend rule; its pg test was seen red)
- [ ] closing code-reviewer round
- [ ] workflow notes; archive the session; pull request (Fixes #100)

Files: `backend/migrations/0024_category_fuel.sql`, `backend/src/db/schema.ts`, `backend/src/services/{category,fuel-stock}.service.ts`, `backend/src/routes/{categories,buildings}.ts`, `src/lib/{types.ts,server/category.ts}`, `src/routes/buildings/[id]/+page.server.ts`, `src/routes/config/categories/{CategoryForm,HeatingChoice}.svelte`, `messages/*.json`, `tests/contracts/category{,-fuel-refused}.json`, `docs/{data-model,PRD-Dwello,api-specification}.md`, tests and features.
