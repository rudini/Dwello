# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.



## Session: #788 part 5a, the frontend no longer names `replaced` (Ä2)

- [x] Backend: `superseded` in what a statement allows (`GET /statements/:id`), test first
- [x] BFF mapper and type; `Correction.svelte` shows the hint by `superseded`; DOM and mapping tests first
- [x] `DeleteContract.svelte`, `document-status.ts`: status labels by a mapping; `StatusFilter.svelte` without the type exclusion (kept behaviour, pinned by `contract-detail-page.dom`, `documents.dom`)
- [x] API contract `tests/contracts/statement.json`; `docs/api-specification.md`; `docs/architecture/fitness-functions.md` (`replaced` 13 → 9 files, 2 layers)
- [x] Checks: lint, check, type-check, vitest (3636), backend capabilities and api-contracts (84), E2E statement-detail, contract-detail, documents, statement-reminder (188), fitness
- [ ] Slice review (`code-reviewer`) and closing round
- [ ] PR: «No scenario: behaviour unchanged», Refs #788
