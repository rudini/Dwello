# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.



## Session: #813 layers.json: +server.ts and demo-data.ts in the right module

No scenario: measurement tooling only, no app change.

- [x] Test `classify` (`tools/arch-baseline/lib.test.ts`): `+server.ts` under `src/routes` → `bff:endpoint/<area>`, `backend/src/db/demo-data.ts` → tooling (red first)
- [x] `layers.json`: module rule for `+server.ts`, layer and module rule for `demo-data.ts`
- [x] Fitness green; changed values written down (`--update` where better, row in `fitness-functions.md` §6); `deps:graph` shows no `fe → bff` from `+server.ts` and no `db → be`
- [ ] Checks, review, PR `Fixes #813`
