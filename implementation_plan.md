# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #788 part 1, deleting a contract (the backend decides «started»)

No scenario: the dialog's own check (unchanged, `contract-detail.feature`) is the path E2E reaches; a form sent past it (no JavaScript, stale page) now shows the backend's existing `backend_contract_started` text (product owner, 24.10.2026), covered by the BFF unit test. Refs #788.

- [x] API contract `tests/contracts/contract-delete-started.json`, checked in `api-contracts.pg.test.ts` (pins kept backend behaviour)
- [x] BFF test: a started contract refused by the backend shows its refusal text (red first)
- [x] Text: `backend_contract_started` already exists (since b466c699); no new message (planned duplicate dropped)
- [x] The delete action deletes directly and shows the backend's refusal; no date compare in the BFF
- [x] Fitness `--update` (bffDates 9 → 8), `fitness-functions.md`
- [ ] Review, PR
