# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: Phase 2b refactoring cycle 3 (pilot B: Tenant type derived from the backend)

No scenario: type-only refactoring, no behaviour change (product owner, 24.10.2026: pilot B approved, then #788 for Ä4). ADR 0003.

- [x] Step 0: measure before (fitness, 02-imports/05-knowledge, 3638 unit tests, backend type-check, 51 tenant backend tests; E2E before: green CI on main)
- [x] Step 1: `Language` and `CorrespondenceChannel` move to `schema.ts`; the tenant columns carry them (`.$type`)
- [x] Step 2: the backend names the answer of `GET /tenants/:id` (`TenantResponse`), the route checks it with `satisfies`
- [x] Step 3: `Tenant` in `src/lib/types.ts` is derived from `TenantResponse`
- [x] Step 4: measure after, ratchet `--update`, ADR 0003, `fitness-functions.md`
- [x] Review round 1 (`docs/reviews/c3-review-1.md`, C-1 Minor: getTenant cast claimed isActive; fixed by deriving TenantResponse from the query)
- [x] Closing review (`docs/reviews/c3-review-2.md`, C-2 Minor: stale isActive in the Omit list; fixed)
- [ ] PR
- [ ] Next: #788 for Ä4 (asked by the product owner)
