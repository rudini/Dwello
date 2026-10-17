# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session 2026-10-17 W8c-2: remove the 3-month hint (#65, option A)

- [x] Decision recorded in #65 (option A, label `entscheiden` removed)
- [x] @wip scenario «Ohne Vorjahr weist die Vorschau nicht auf Monate ohne Rechnung hin» (statement-generate.feature), seen red at the hint
- [x] fach-reviewer round 1: `docs/reviews/w8c2-fachreview-1.md` (V-2 fixed: Kaminfeger as the yearly invoice; V-1 Minor left in the report)
- [x] Remove the hint: `partly`/`GAP_DAYS`/`partial` and the unused `period` parameter of `invoiceRows` in `src/lib/statement-wizard.ts` (callers `PreviewStep.svelte`, `StatementStep.svelte`), the alert and its marker in `PreviewChecks.svelte`, `statements_partial_*` in `messages/*.json`; unit and DOM tests turned red first
- Files: those above, `src/__tests__/statement-wizard{,.dom}.test.ts`, `tests/e2e/{features/statement-generate.feature,steps/statement-generate.steps.ts,questions/statement-generate.ts,targets/statement-generate.ts}`
- [ ] code-reviewer round, workflow-review, session archived, pull request (`Fixes #65`)
