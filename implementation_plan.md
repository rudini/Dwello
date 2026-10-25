# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #788 part 4a, the overview's contract tasks (the backend decides)

Product owner, 25.10.2026: part 4 in three pull requests; 4a moves the three date derivations of the overview to `GET /api/v1/dashboard` (`tasks.noticedContracts`, `tasks.expiredContracts`, `tasks.formerTenants`), reusing the backend rules of parts 2 and 5a. 4b `oldAddresses` and `missingStatements`, 4c reminders and the five-year hint follow. Behaviour unchanged (`No scenario: behaviour unchanged; dashboard.feature pins the tasks`). Refs #788.

- [x] Backend `contractTasks.noticedContracts` (`dashboard-tasks.pg.test.ts`, red first; the successor case by taking the check out). The field is `contractTasks`: the page already returns its own `tasks`
- [x] Backend `contractTasks.expiredContracts` by `fixedTermCheck` (red first)
- [x] Backend `contractTasks.formerTenants` by `formerTenantDocuments`, only unchecked (red first)
- [x] API contract `dashboard.json` (checked with one record of each); BFF reads the three lists (`dashboard.test.ts`, 2 tests red first); the documents list is no longer loaded; `src/lib/former-tenant-documents.ts` and its test go (the backend tests cover each case). One test changes on purpose: when the other lists fail, the contract tasks now stay (they come with the figures)
- [x] Fitness `--update` (bffDates 3 → 0, BFF decisions 11 → 8), `fitness-functions.md`, `docs/api-specification.md`; coverage floors hold
- [x] E2E `dashboard`, `tenant-detail` (Chromium and API, 62) green
- [x] Slice review round 1 (`docs/reviews/p4a-review-1.md`: C-1 Major, two cases of «notice without a next tenant» no layer tested after the move: a notice after its end, a later contract in another apartment; a pg test added, it pins kept behaviour and fails with each of the two mutations the review named)
- [ ] Closing round, PR
