# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #782 upgrade check (U1), part 1

- [x] Ä1 cycles end after #912 (P90 6 ≤ 8); the contract dates are props and parameters, not copied shapes (named in the pull request)
- [x] A failing migration leaves its data unchanged, is not recorded and names file and cause (`migrations.pg.test.ts`, pins kept behaviour)
- [x] The upgrade check compares the amount sums of the statement tables before and after (red shown with a probe migration on `balance`)
- [x] What the container does on a failed migration, recorded in #782 and `fitness-functions.md` §4: exit 1, cause in the first log line, restart loop, not «unhealthy» (decision of the product owner)
- [ ] Slice review
- [ ] PR (`Refs #782`: the empty demo tables stay open)
