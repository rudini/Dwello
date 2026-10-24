# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #788 part 2, documents of a former tenant (the backend decides)

Product owner, 24.10.2026: a separate endpoint `GET /tenants/:id/former-documents`; the dashboard keeps its own derivation until part 4. Behaviour unchanged (`No scenario: behaviour unchanged, the scenarios of «Dokumente eines ehemaligen Mieters» pin it`). Refs #788.

- [x] Backend `formerTenantDocuments` + `GET /tenants/:id/former-documents` → `{ formerDocuments }` (`tenant-former-documents.pg.test.ts`, 9 tests, each seen red; the end-day, Swiss-day and last-contract tests by taking the code out). An unknown tenant answers `null` (no 404: YAGNI, the page loads the tenant first)
- [x] API contract `tests/contracts/tenant-former-documents.json`, checked in `api-contracts.pg.test.ts`; `docs/api-specification.md`
- [x] Tenant detail load uses the endpoint (`tenant-detail.test.ts`, red first); no apartment contracts fetched any more; the BFF tests of the A-6 rule moved to the backend; a failing request still loads the page without the notice
- [x] Fitness `--update` (bffDates 8 → 7, BFF decisions 16 → 15), `fitness-functions.md`
- [x] E2E `tenant-detail`, `tenant-documents`, `tenants` (Chromium and API, 28) green. No scenario shows the notice: the E2E stack cannot backdate an upload
- [ ] Slice review, closing round, PR
