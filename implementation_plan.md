# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 31.10.2026: #534 Erneut per Brief zustellen, #968 neues PDF als versendet

- [x] @wip scenarios `statement-redeliver.feature` (#534) and two in `statement-detail.feature` (#968), seen red at the missing behaviour
- [ ] fach-reviewer step 1 (`docs/reviews/534-fachreview-1.md`)
- [ ] Backend #534: `redeliverByLetter` dates the statement today, Zahlungsfrist from today, PDF anew as a Dokument by letter; refused unless sent or overdue (pg test)
- [ ] Backend #968: a change that makes a new PDF of a sent statement stores it as a Dokument to send; marking it sent records it without redating (pg test)
- [ ] UI: action and confirmation, hint and button for the new PDF, Verlauf of every sending (DOM tests, texts in four languages)
- [ ] Screen states for the new dialog and hint
- [ ] code-reviewer per slice, persona, daten-pruefer, closing review, archive, PR
