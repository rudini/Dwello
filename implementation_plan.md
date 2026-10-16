# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session 2026-10-16 (16): #241 statement PDF: shorter note and labelled invoice lines

Request (chat): work through the open issues one by one; before each, check its related issues and do them too, one pull request each (CLAUDE.md, Workflow 8). Related to #241: #239 and #236 (the same invoice lines, next), #237 (waits for the product owner since 16.10.: the credit case cannot be entered in the app, comment there), #75 (glossary, product owner). Decision issues #240 and #227: their implementation issues to open.

Plan: the decided texts of #241 (P-1 note in short sentences, P-2 labelled lines, P-3 the step to «Ihr Anteil») in `backend/src/services/pdf.service.ts` (`sharesNote`, `partLines`), in de/fr/it/en.

- [x] Scenario «PDF nennt bei Rechnungen über verschiedene Leistungszeiträume die Tage jeder Rechnung» (`statement-detail.feature`) updated, `@wip`, red
  Scenario red: `steht im PDF "Leistungszeitraum 01.04.2025 – 30.06.2025: CHF 600.00, Ihre Mietstage 0 von 91 Tagen"` – Expected substring not in the PDF text
- [x] Decision issues: #227 → implementation issue #247, closed; #240 → #248 to #253, its detail-page point added to #104 and its recalculation point to #132, closed
- [ ] fach-reviewer on the scenario and the fr/it/en wording before implementing
- [ ] Render tests in four languages first (`statement-pdf-render.test.ts`), pg tests updated, then `pdf.service.ts`
- [ ] Checks: test:coverage, lint, check, backend test + type-check, deepcheck:audit, affected E2E
- [ ] code-reviewer round(s)
- [ ] Feature review: fach-reviewer, daten-pruefer (the PDF), persona Dr. Weber (the new texts)
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-241.md`
- [ ] Archive session, push, PR `Fixes #241`, CI, merge
