# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session 2026-10-26: shorter and surer agent reviews

Request: analyse the agent reviews and apply what the product owner chose (1 Fedlex access, 2 shorter domain reviews, 3 no persona Nits, 5 re-review format; 4 as an issue). No scenario: changes only agent instructions, no app behaviour.

- [x] `fach-reviewer`: fetch the law in force through the Fedlex SPARQL endpoint; wording as a `key | de | fr | it | en` table; plan points in «Geprüft»
- [x] `persona`: no Nits in the table, they go under «Beobachtungen»
- [x] `code-reviewer`, `fach-reviewer`: a re-review lists fixed IDs in one line «Geschlossen: …»
- [x] Issue #852 for the mechanical Majors (point 4)
- [x] code-reviewer round 1 (`docs/reviews/agents-review-1.md`): no Blocker/Major; C-1 (Minor, FMG and UWG ids) fixed
- [ ] PR
