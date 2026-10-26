# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: testcheck, a static check of unit tests (request without issue)

Tooling only, no app change: `No scenario: tooling, nothing a user of the app sees`.

- [x] `tools/testcheck`: finds tests that cannot fail (false positives) and test names their body does not back (`tools/testcheck/src`, tests in `tools/testcheck/test`)
- [x] Measure precision (labelled findings) and recall (seeded defects) on Dwello and external TypeScript/Vitest repos; targets and results in `tools/testcheck/testcheck-validation.md` (`tools/testcheck/eval`)
- [x] Found: Dwello hint `statement-pages.dom.test.ts` loops over `querySelectorAll('dl')` without asserting one exists: #854
- [x] Gate on changed test files with a baseline, like deepcheck: `bun run testcheck:*`, hook `.claude/hooks/testcheck-gate.sh`, CI job, CLAUDE.md, skill `commit-gates`
- [x] Slice review round 1 (`code-reviewer`): `docs/reviews/testcheck-review-1.md`
- [x] Re-review of the C-1 fix and closing round (round 2): `docs/reviews/testcheck-review-2.md`
- [x] Re-review of the C-1 fix of round 2 (round 3): `docs/reviews/testcheck-review-3.md`
- [ ] Closing round on the fix of C-11 and C-12 (a slice of its own, Workflow 7)
- [ ] PR
