# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #1047 no deleted statement in the history

- [x] @wip scenario «Nach dem Löschen eines Entwurfs führt Zurück im Browser nicht auf den Entwurf», seen red (address of the deleted statement after back)
- [x] Delete redirect replaces the history entry in `dialogSubmit` (all its redirects are deletes: statement, tenant, contract), DOM test red first
- [x] Scenario green without @wip; statements, statement-detail, tenants, contract-detail, contracts: 227 passed (after C-2)
- [ ] Code review: `docs/reviews/1047-review-1.md` (C-1 replace only for deletes, C-2 @wip left: fixed), round 2 on the fixes
- [x] Persona: `docs/design/personas/sven-1047.md` (no 404 any more; P-1 Minor: back shows the same list silently, stays in its report)
- [ ] Checks: lint, check, type-check, tests --changed, Prettier
- [ ] Archive, PR
