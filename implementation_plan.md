# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: Phase 2b refactoring cycle 2 (tenant of the contract page)

No scenario: refactoring, no behaviour change (product owner, 24.10.2026; the fallback for a missing tenant record is unreachable and may go). ADR 0002.

- [x] Step 0: measure before (fitness, 02-imports/05-knowledge, unit tests 3638, E2E contract-detail/contract-edit 96)
- [x] Step 0b: six stubs in `contract-actions.test.ts` answered a contract without tenant; first try of step 1 red and reverted, the stubs now take the tenant from `tests/contracts/contract.json` (PO, 24.10.2026)
- [x] Step 1: `toContract` takes the tenant from `toTenant`
- [x] Step 2: measure after, ratchet `--update`, ADR 0002, `fitness-functions.md`
- [ ] Review, PR
