# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #922 P2 fitness function, queries per route

- [x] Product owner decision recorded in #922 (changes #781: a CI gate on query counts, timing stays manual)
- [x] `queryFindings`, `tightenQueries` and the `routeQueries` rule of `loosened` in `tools/fitness/fitness.ts` (`fitness.test.ts`)
- [x] `p2-benchmark.ts --queries [--update]`: small fixed dataset, counts every SQL query of one call per route after a warm-up
- [x] CI step «Queries per route» next to the upgrade check; red run with the N+1 of #919 put back («needs 256 queries (ratchet 28)»); counts stable over runs, `outdated` grows only per building and period
- [x] Docs (`fitness-functions.md`, `utility-tree.md` P2)
- [ ] Slice review
- [ ] PR
