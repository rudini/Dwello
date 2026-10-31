# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 31.10.2026: #528 Kategorie mit zwei Verteilschlüsseln

- [x] @wip scenarios in `statement-detail.feature` (draft hint, link, «Neu berechnen» question, PDF), seen red at the missing behaviour
- [ ] fach-reviewer step 1 (`docs/reviews/528-fachreview-1.md`)
- [ ] Backend: each line of a Kategorie with several lines but its largest is marked `otherKey`; the lines of one Kategorie stay together (`statement.service.ts`, pg test)
- [ ] PDF: the marked line names its invoices after the Kategorie (`statement-pdf.service.ts`, unit test)
- [ ] Draft and «Neu berechnen» question: hint with a link to each invoice (DOM test, texts in four languages)
- [ ] Screen states for the hint (`screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`)
- [ ] code-reviewer per slice
- [ ] Persona Dr. Weber, daten-pruefer
- [ ] Closing review, archive, PR
