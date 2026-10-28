# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #910 Ä1 field spread in frontend and BFF only

- [x] Product owner decision recorded in #910 (count frontend and BFF only; targets unchanged)
- [x] `field-spread` and `new-field` count frontend and BFF files (`tools/fitness/fitness.test.ts`)
- [x] Ratchet and docs (utility-tree Ä1, fitness-functions, baseline) with the new values: 4 / 12 / 36 → 1 / 6 / 18
- [x] Slice review round 1: `docs/reviews/i910-review-1.md`; C-1 (Major: `src/lib/types.ts`, layer Shared/Contracts, was not counted) fixed, ratchet P90 6; C-2 (test) and C-3 (utility-tree «Fitness Function») fixed
- [ ] Review round 2 (C-1 fix, closing)
- [ ] PR
- [ ] Follow-up: refactoring cycle on period and contract-date fields (own pull request)
