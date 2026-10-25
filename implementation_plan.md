# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #788 part 4b, old addresses and missing statements in the backend

- [x] Backend: `contractTasks.oldAddresses` (drafts to a moved-out tenant's old address, once per tenant) and `contractTasks.missingStatements` (per building and period, grouped as the overview showed them), tests first
- [x] API contract `tests/contracts/dashboard.json` and `api-contracts.pg.test.ts`
- [x] BFF: dashboard load reads both, no longer loads drafts or the per-contract missing statements; `src/__tests__/dashboard.test.ts`
- [x] Docs: `docs/api-specification.md` §14; fitness ratchet unchanged (BFF decisions stay 8)
- [x] Checks: lint, check, type-check, vitest, backend tests, E2E `dashboard`
- [ ] Slice review (`code-reviewer`) and closing round
- [ ] PR: «No scenario: behaviour unchanged, `dashboard.feature` pins it»
