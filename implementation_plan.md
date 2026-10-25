# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #808 import cycle pdf.service ↔ reminder-letter

No scenario: type-only import change, no behaviour change. Rides PR #810 (it refs #808). Finishes ADR 0003 step 1 (`Language` moved to `schema.ts`).

- [x] Ratchet: drop `be:services/pdf be:services/reminder-letter` from `exceptions.moduleCycles`; fitness red (module-cycle)
- [x] `reminder-letter.ts` takes `Language` from `../db/schema`; fitness green
- [x] madge `--circular` (type imports included) reports no cycle over `src/` and `backend/src`
- [ ] Checks, closing review, PR #810 `Fixes #808`
