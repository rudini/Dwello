# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end. A session that appears on `main` after this one started makes this one parallel from then on: at the merge before the push take `main`'s plan and move this checklist into the pull request.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #664 usability pass (contract «Beenden», move-out hint, wizard announcement, refusal naming)

- [ ] Start: issue read, «Decided (product owner)» items 1–4 are the requirement; persona reports `helga-664.md`, `sven-664.md` committed
- [ ] Step 1: `@wip` scenarios (contract-detail, apartments, statement-generate), steps red at the missing behaviour
- [ ] Step 1: `fach-reviewer` of the `@wip` scenarios and proposed texts before implementing (items 1, 2, 4)
- [ ] Slice 1: «Beenden» becomes «Enddatum erfassen» (`contracts_end_action`), texts quoting it follow
- [ ] Slice 2: move-out hint in the apartment lists and on the ended contract (backend `moveOut`, timing as the missing-statement rule)
- [ ] Slice 3: wizard result in the live region, focus on a heading that names the result
- [ ] Slice 4: refused draft named by tenant and period (`RefusedStatements`)
- [ ] Code review per slice (`code-reviewer`)
- [ ] Feature review: personas Helga and Sven (`persona-stack.sh`)
- [ ] Checks: lint, check, backend type-check, full vitest, backend tests, affected E2E, fallow audit, Prettier on added files
- [ ] Archive the session; PR (`Fixes #664`, `Spec change approved: #664`) by the parent session
