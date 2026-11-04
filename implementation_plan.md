# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-11-04: #1094 keep the list filter from the statement detail

- [x] Decision recorded in #1094 (product owner: «nach deiner Empfehlung»): breadcrumb and the PDF refusal page of the detail page keep the list's filter; the refusal page does not name the statement
- [x] Scenarios in `statements.feature`, seen red at the missing filter; `openStatement` waits for the detail page (a deletion meanwhile overtook it)
- [x] `pdfRefusal` takes the filtered list from `?list=` of the PDF link for a gone record; breadcrumb uses the list (as `$derived`, fallow template complexity); D7c
- [ ] Code review
- [ ] Persona
- [ ] PR
