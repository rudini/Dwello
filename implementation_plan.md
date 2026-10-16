# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W2d: Saldo rounded in the tenant's favour (#79)

- [x] `statement-rounding.feature`: Nachzahlung rounded down, Rückerstattung up (`@wip`, seen red)
- [x] fach-reviewer on the scenario and on stored statements (old rounding kept)
- [x] `roundTo5Rappen` rounds in the tenant's favour (unit test red first)
- [x] Help text «Saldo» in all four languages, `docs/nebenkostenabrechnung-anforderungen.md` (lines 94, 148)
- [x] Fachreview round 1 (`docs/reviews/w2d-fachreview-1.md`): scenario «unter 5 Rappen», float-safe rounding, drafts re-rounded by migration `0013`, PDF/DOM cases, docs
- [ ] Slice review (code-reviewer), feature review (fach-reviewer, daten-pruefer, persona Dr. Weber)
- [ ] Lint, check, type-check, affected tests and E2E
- [ ] Session archived, pull request merged (`Fixes #79`)

Files: `backend/src/services/pdf-format.ts`, `backend/migrations/0013_statement_balance_tenant_favour.sql`, `messages/*.json`, `tests/e2e/features/statement-rounding.feature`, tests (`statement-pdf-data`, `statement-pdf-render`, `statement-generation.pg`, `migrations.pg`, `help-page.dom`, `statement-pages.dom`), docs (`PRD-Dwello.md`, `data-model.md`, `design-decisions.md`, `nebenkostenabrechnung-anforderungen.md`)
