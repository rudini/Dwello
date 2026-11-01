# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: stability and changes instead of the A/I graph (request in chat, follow-up to #1056)

- [x] Structure report: graph «Stability and changes» (I over the commits of a module's most-changed file in fallow's hotspot window) with the zone stable and changing often; light per module (I ≤ 0.3 and Ca ≥ 5: green up to 12 changes, yellow up to 25, else red); A, D, the A/I graph and the D history table removed (tests first)
- [x] Docs: report bullet and fitness row without A/D
- [ ] code-reviewer rounds
- [ ] Archive the session; PR after #1056 is merged
