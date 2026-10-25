# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #815 part D, the rest: overview deadlines, anonymisation, the contract toast; exceptions empty

Measured before (25.10.2026, main 5580d2a): frontend decision exceptions 4 (overview `daysFrom` and its two uses, TenantAnonymiseCard).

- [x] D1 overview deadlines from the backend (`deadlines` on `GET /dashboard`, `backend/src/services/overview-deadlines.ts`); backend unit test, pg test (incl. K-6 and #605 moved from the loader tests) and API contract first; the loader no longer reads contracts and settings for it; exceptions 4 → 1
- [x] D2 anonymisation allowed from the backend (`anonymisable` on `GET /tenants/:id`); pg test, API contract and DOM test first; exceptions 1 → 0
- [x] D3 the check also catches `===`/`!==` against today (tool test first); its one new hit, the contract page toast «endet heute», comes from the backend (`endsToday` on `GET /contracts/:id`), pg and DOM test first; no new BFF hit; exceptions 0
- [ ] Review D1–D3
- [ ] Checks: lint, check, vitest, backend tests, E2E dashboard, tenant and contract features, fitness (exceptions 0)
- [ ] Closing round, workflow notes, archive
- [ ] PR: «No scenario: behaviour unchanged», Fixes #815
