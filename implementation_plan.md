# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-14 (2): bug #123, the backend's today is the Swiss day

Task: open `bug` issues one by one (#122 merged in rudini/Dwello#181); now #123. Skipped while labelled `entscheiden`: #93, #124, #130, #131, #136, #138, #141.

- [x] No scenario: the backend's clock cannot be set in E2E; `swiss-today.pg.test.ts` sets it (the E2E steps and seed below now count from the Swiss day)
- [x] Test red: `swiss-today.pg.test.ts` at 23:30 UTC (00:30/01:30 Swiss): overdue – received "sent"; ended contracts – [0, 1]; tenant – isActive true; apartment – received "occupied"; new statement – received the UTC day; reminder – letter dated and deadline counted from the UTC day
- [x] `backend/src/services/today.ts` (`swissToday`, `daysAfter`, `sqlToday`); used in statement, contract, tenant, apartment, reminder services and the contracts and dashboard routes; SQL `current_date` replaced by `sqlToday` (tenant active, apartment status, next contract start, current contract end)
- [x] E2E: `statements.steps.ts`, `dashboard.steps.ts`, `supplierInvoice` (`fixtures/backend.ts`) count from `inDays(0)`
- [x] `backend/CLAUDE.md` says the backend's today is the Swiss day
- [x] Skills: tdd, ponytail, ponytail-review
- [x] Checks: test:coverage, lint, check, backend test + type-check, deepcheck:audit, E2E dashboard, statements, statement-reminder, contracts, contract-detail, tenants, apartments (chromium + api, 88 passed)
- [ ] code-reviewer
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-123.md`
- [ ] PR, CI, merge

Files: `backend/src/services/today.ts`, `statement.service.ts`, `contract.service.ts`, `tenant.service.ts`, `apartment.service.ts`, `reminder.service.ts`, `backend/src/routes/contracts.ts`, `dashboard.ts`, `backend/src/__tests__/swiss-today.pg.test.ts`, `backend/CLAUDE.md`, `tests/e2e/steps/statements.steps.ts`, `dashboard.steps.ts`, `tests/e2e/fixtures/backend.ts`
