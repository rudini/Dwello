# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W9d: statement PDF language and «Gebäude» (#351, #249)

- [x] #351: main already makes a draft's PDF afresh on every request and the PDF as sent when sending (PR #361); scenario «PDF eines Entwurfs folgt der geänderten Sprache des Mieters» and two tests in `statement-pdf.pg.test.ts` (draft, sent): green on main, the draft cases red with the old `getStatementPdf` (stored PDF reused on the same day)
- [x] #249: scenario «Das PDF erklärt die Verteilung und den Heizölverbrauch» reads «Kosten des Gebäudes» and no «Liegenschaft», `@wip`
- [x] fach-reviewer on the `@wip` scenarios before implementing: `docs/reviews/w9d-fachreview-1.md`
- [x] #249: German PDF texts say «Gebäude» / «Kosten des Gebäudes», the Wohnungsanteil note «der Anteil Ihrer Wohnung an den Kosten des Gebäudes» (fr/it/en already say the app's words, pinned by render tests, seen red by changing those words for a moment); render tests; `docs/nebenkostenabrechnung-anforderungen.md`, `docs/design/i18n-begriffe.md`
- [x] slice review (code-reviewer): `docs/reviews/w9d-review-1.md`
- [ ] feature review: fach-reviewer, daten-pruefer (PDF), persona
- [x] Blocked on me: `UBIQUITOUS_LANGUAGE.md` lists «Liegenschaft» as a synonym of Gebäude and lacks «Kosten des Gebäudes» (product owner's edit): #374

Files changed: `tests/e2e/features/statement-detail.feature`, `backend/src/__tests__/statement-pdf.pg.test.ts`, `backend/src/__tests__/statement-pdf-render.test.ts`, `backend/src/services/pdf.service.ts`, `docs/nebenkostenabrechnung-anforderungen.md`, `docs/design/i18n-begriffe.md`, `docs/reviews/w9d-fachreview-1.md`
