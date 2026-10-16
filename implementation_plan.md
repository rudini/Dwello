# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: statement list tenancy dates and missing PDF (#248, #253)

- [x] #248 scenario `@wip` in `statements.feature`: list shows the tenancy dates within the period
- [x] #248 lower-layer test of the list mapping; backend list carries the contract dates
- [x] #253 scenario `@wip` in `statements.feature`: a draft without PDF says «PDF noch nicht erstellt» and leads to its detail page
- [x] #253 DOM test of the row; texts in de/fr/it/en
- [x] #253 new state in `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`
- Files: `backend/src/services/statement.service.ts` (list joins the contract dates), `src/lib/server/statement.ts` (`rentalStart`/`rentalEnd`), `src/routes/statements/+page.server.ts` (reuses `toStatement`), `StatementRow.svelte`, `src/lib/types.ts`, `messages/*.json`, `tests/contracts/statements.json`, tests
- [x] Slice review round 1: `docs/reviews/list-review-1.md`
- [x] Feature review: `docs/design/personas/dr-weber-list.md`, `marco-list.md`, `dr-weber-list-2.md` (draft without PDF prepared by SQL in `dwello_persona`)
- [x] Fixes: the list maps the stored `rentalStart`/`rentalEnd` (no contract join); row locator by statement number; row and detail name the dates with the Mietstage (part of #104's decision)
- [ ] Slice review round 2, persona re-run on the labelled dates
- [ ] Before marking complete: lint, check, type-check, affected tests and E2E
