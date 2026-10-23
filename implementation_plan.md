# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: spec scenarios need approval (#643)

- [x] Rule text: `CLAUDE.md` (Workflow 1, "When to ask"), `tests/e2e/CLAUDE.md` ("Rules")
- [x] `code-reviewer` checks step definitions for weakened assertions
- [x] CI check (`tools/open-work/check-issues.mjs`): a changed or removed line of a scenario that is non-`@wip` on the base branch fails without `Spec change approved: #n`
- [x] Additions (new scenario, new Examples row) and `@wip` scenarios pass
- [x] Adding `@wip` to a protected scenario fails
- [x] `Spec change approved: #n` passes only for a decided issue (exists, no pull request, not `entscheiden`, not closed as not planned)
- [ ] Slice review round 1: `docs/reviews/spec643-review-1.md`
- [ ] Closing round, archive, PR
