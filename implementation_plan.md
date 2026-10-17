# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session W11: PDF invoice line names the invoice (#236)

Branch `claude/w11-pdf-rechnung-236`. The issue's first point (whole Leistungszeitraum and amount) is done in #241; left: V-8 of #226.

- [x] Scenario «PDF nennt die Rechnung, wenn Daten und Betrag sie nicht unterscheiden» in `statement-detail.feature`, seen red at the missing name
- [x] fach-reviewer on the `@wip` scenario before implementing: `docs/reviews/w11-fachreview-1.md` (V-1 taken: a line without Leistungszeitraum always names its invoice; V-2 description vs Rechnungsdatum: the issue decided «description or Rechnungssteller», proposal added to #256; V-3 name as a suffix, no capital after a dash; V-4 scenario covers both cases)
- [x] Tests red first: `statement-pdf.pg.test.ts` (de, real statement), `statement-pdf-render.test.ts` (four languages); the PDF takes each part's description from the statement's stored `invoices` (same order, no migration), `partNamed` in four languages
- [ ] slice review (code-reviewer)
- [ ] feature review: daten-pruefer (PDF), persona Dr. Weber
- [ ] closing review, workflow-review, archive the session
- [ ] PR `Fixes #236`, CI, merge
