# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #834 E2E on main in more shards (T1)

- [x] Issue #834 opened from the measured main run (shards 12–26 min, run 27 min)
- [x] `ci.yml`: the job Changes builds the shard matrix, 5 E2E shards on pull requests and 12 elsewhere, axe in 3; «E2E tests» and «Accessibility (axe)» count the shards from its output
- [x] Docs: `test-pyramid.md`, T1 measurement in `utility-tree.md`, RI-T1-3 and RI-T1-5 in `risks-and-tradeoffs.md`
- [ ] Slice review (`code-reviewer`)
- [ ] PR; No scenario: CI configuration only. After the merge: «CI duration» of the push run on main ≤ 15 min
