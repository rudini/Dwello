# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session W5c: #74 (F-14c) Tankbestand with an allocable invoice in a non-allocable category

- [x] Read #74, #257, #130: neither `entscheiden` issue changes #74's outcome (#257 is how consumption is spread over days, #130 the invoice check)
- [x] Found: since #190 (merged 2026-10-15, after #74 was written) the backend keeps no invoice of a non-allocable category allocable (`applyCategory`, `recategorize`, `updateCategory`), so the state Option A answers can no longer arise; Option A would be a dead branch in `fuelStockChange`. Followed the code (CLAUDE.md, "Coding guidelines"), said so in the pull request
- [x] Regression test of #74's case, red with the guard in `applyCategory` taken out (purchase CHF 2000 billed): `backend/src/__tests__/fuel-stock.pg.test.ts`
- [x] No scenario: the state cannot be reached through the UI or the API since #190; the pg test pins it
- [ ] Slice review (`code-reviewer`)
- [ ] Before marking complete: lint, check, type-check, fuel-stock tests
- [ ] Pull request with `Fixes #74`, merged on green CI
