# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session 2026-10-17 W8c-2: remove the 3-month hint (#65, option A)

- [x] Decision recorded in #65 (option A, label `entscheiden` removed)
- [x] @wip scenario «Ohne Vorjahr weist die Vorschau nicht auf Monate ohne Rechnung hin» (statement-generate.feature), seen red at the hint
- [ ] fach-reviewer on the scenario before implementing
- [ ] Remove the hint: `partly`/`GAP_DAYS`/`partial` in `src/lib/statement-wizard.ts`, the alert and its marker in `PreviewChecks.svelte`, `statements_partial_*` in `messages/*.json`, its unit and DOM tests
- [ ] code-reviewer round, workflow-review, session archived, pull request (`Fixes #65`)
