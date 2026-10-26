# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: #842 T1 measured from the first job (and decisions of 26.10.)

- [x] Decisions recorded: #837 «Decided (product owner)» (response types in their own backend module), #842 (T1 from the run's start), Ä1 measurement to be refined (next issue)
- [x] `ci.yml` «CI duration»: from the earliest job `started_at`, the wait before it apart; checked against run 40303722784 (17 min wait)
- [x] Docs: T1 in `utility-tree.md`, `ci-duration` in `fitness-functions.md`
- [ ] Slice review (`code-reviewer`)
- [ ] PR; No scenario: CI report only
