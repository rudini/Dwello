# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: word-wise search (#160, #373)

- [x] Implementation issue for #160 created: #373
- [x] Scenarios `@wip` (apartments.feature, buildings.feature) seen red
- [x] Word-wise apartment search (number, building name, street, place; «Wohnung» ignored), pg test
- [x] Word-wise building search, pg test
- [x] Help text at the apartment search field, empty state names the term (de/fr/it/en)
- [ ] Slice review (code-reviewer), feature review (personas)
- [ ] Session archived, pull request merged (Fixes #160, Fixes #373)

Files: `backend/src/services/{word-search,apartment.service,building.service}.ts`, `backend/src/__tests__/{apartment,building}-search.pg.test.ts`, `src/routes/apartments/{+page,ApartmentFilters}.svelte`, `src/lib/ui/TextInput.svelte` (`helpTestid`), `src/__tests__/apartments-pages.dom.test.ts`, `messages/*.json`, `tests/e2e/features/{apartments,buildings}.feature`, steps, targets, questions, `tests/e2e/fixtures/{backend,screens}.ts` (`withNames`; a11y search term without German, since the empty state repeats it)
