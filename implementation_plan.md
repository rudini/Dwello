# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #869 flaky «Suche ohne Treffer» in Firefox

- [x] Cause from the trace of run 40400795129 (shard 3): the search was typed and «Suchen» clicked, but no request followed; the page had `data-hydrated`, which the root layout set in `onMount`, before SvelteKit's router listens for submits (probe: a click at the marker loads the document natively instead of through the router)
- [x] Layout sets `data-hydrated` one task after mounting, once the router listens (DOM test, red first; `src/routes/+layout.svelte`, `src/__tests__/layout-hydrated.dom.test.ts`)
- [x] Probe on the E2E stack: a click at the marker goes through the router (5 of 5; before: native document load)
- [ ] Affected E2E scenarios (buildings, chromium) green
- [x] Slice review round 1: `docs/reviews/i869-review-1.md`
- [ ] PR `Fixes #869`
