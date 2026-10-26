# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #754, «Suche ohne Treffer» lost in Firefox (T1)

No scenario: the failing scenario `buildings.feature` «Suche ohne Treffer» covers it unchanged.

- [x] Read the trace of the failure on main (run 40239565626, artifact e2e-reports-2): the click on «Suchen» came 125 ms after `data-hydrated`, and no request to `/buildings?search=…` followed: the submit handler's `goto` did not navigate
- [x] The building search is a plain GET form (as the tenant and contract lists): before the router is ready the browser sends it, after it the router; DOM test first (red), the old goto test checks the sent fields
- [x] Checks: unit tests of the lists, lint, check, `buildings.feature` in Chromium (also 5× the search scenarios); Firefox only on CI
- [ ] Review
- [ ] PR: Fixes #754
