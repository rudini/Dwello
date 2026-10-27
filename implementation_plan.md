# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: #655 name conflicts at the Name field

- [x] `@wip` scenarios «Name ist schon vergeben» in `heating-profiles.feature` and `distribution-keys.feature`, seen red (message not at the Name field)
- [x] Heating profile: a 409 refusal shows at the Name field (`src/__tests__/heating-profiles.test.ts`)
- [x] Distribution key: a 409 refusal shows at the Name field (`src/__tests__/distribution-keys.test.ts`, contract `distribution-key-name-taken.json`)
- [x] Scenarios green without `@wip`
- [ ] Slice review, closing round
- [ ] PR
