# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session W11: PDF invoice line names the invoice (#236)

Branch `claude/w11-pdf-rechnung-236`. The issue's first point (whole Leistungszeitraum and amount) is done in #241; left: V-8 of #226.

- [ ] Scenario in `statement-detail.feature` (`@wip`): two invoices without Leistungszeitraum over the same amount under one position over different days name their invoice, the other line does not
- [ ] fach-reviewer on the `@wip` scenario and the proposed wording before implementing
- [ ] Lower-layer test in `statement-pdf.pg.test.ts` (red first); description stored per invoice part, line named where its text equals another's; texts in four languages
- [ ] slice review (code-reviewer)
- [ ] feature review: daten-pruefer (PDF), persona Dr. Weber
- [ ] closing review, workflow-review, archive the session
- [ ] PR `Fixes #236`, CI, merge
