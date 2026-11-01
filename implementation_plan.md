# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: XS ratchet in the fitness checks (request in chat, follow-up to #1045)

- [x] Issues (`nfr:maintainability`): #1052 fat files and modules, #1053 hidden coupling pairs
- [x] Check `fat` in `tools/fitness/fitness.ts`: no new file over 400 lines, no new code module over 30 files or 15 module dependencies, listed ones may not grow; composition roots listed with a reason (tests first)
- [x] `ratchet.json`: today's fat files, modules and roots; `docs/architecture/fitness-functions.md` row
- [ ] code-reviewer rounds
- [ ] Archive the session; PR
