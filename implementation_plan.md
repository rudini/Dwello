# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session

#296: the contract wizard never suggests a Vertragsbeginn its own date check refuses.

- [x] Unit test: `suggestedStartDate` suggests nothing when the day the apartment becomes free lies in a year `impossible` refuses (red first)
- [x] Fix: `impossible` moves to `contract-form.ts`, `suggestedStartDate` uses it (no import cycle); `statement-wizard.ts` imports it from there
- [x] Test data that meant "free in the future" with a contract ending 2099-12-31 now ends 2098-12-31 (free from 2099): `contract-wizard.dom.test.ts`, `tests/e2e/fixtures/screens.ts`, axe state `overlap-warning` in `tests/e2e/tasks/accessibility.ts`
- [ ] Slice review (`code-reviewer`)
- [ ] Checks: lint, check, type-check, affected tests

No scenario: the E2E data would need a contract that ends in 2099 (issue #296).
