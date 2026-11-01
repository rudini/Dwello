# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #679 list filter and stale pages after deleting a draft

- [x] Scenarios `@wip` in `statements.feature`, both seen red at the missing behaviour (filter gone after delete; back shows the deleted draft from the browser cache)
- [x] Delete returns to the list with the filter it was opened from (`list` field, only `/statements?…`; unit tests seen red, the guard ones by taking the check out)
- [x] Every page answers `Cache-Control: no-store` (`src/hooks.server.ts`, unit test seen red)
- [ ] Full chromium/api E2E run (the header touches every page)
- [ ] Slice review (`code-reviewer`)
- [ ] Persona review: none, the screens show nothing new (same list, same error page); only where the delete leads changed. Sven checks the return with a screen reader
- [ ] Archive, PR
