# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session W16: categories marked «Brennstoff» hold a Tankbestand (#100)

Branch `claude/w16-brennstoff-100`. #100's "Decided" section (option 2) is the requirement; implemented directly, no separate implementation issue. The glossary already has «Brennstoff (Kategorie)» (an attribute of an allocable heating cost category), so no marker.

- [ ] `@wip` scenarios (building-detail.feature: own heating category and the chimney sweep are not offered; categories.feature: an own category marked Brennstoff is offered), committed and reviewed by `fach-reviewer` before implementing
- [ ] migration `0024_category_fuel.sql`: `categories.is_fuel`, set for the predefined «Heating»; schema, data-model.md, contract
- [ ] backend: `isHeatingCategory` reads the flag (no name check); create/update take `isFuel`; `*.pg.test.ts` for the predefined chimney sweep and an own heating category
- [ ] frontend: building page filters by the flag; category form checkbox «Brennstoff» with help (only with «Heizkosten nach dem Heizprofil verteilen»); texts in four languages
- [ ] a11y state `category-new` `fuel` (screens.json, accessibility.feature, sprachen-bildschirme.feature)
- [ ] code-reviewer per slice; personas; fach-reviewer feature review
- [ ] workflow notes; archive the session; pull request (Fixes #100)
