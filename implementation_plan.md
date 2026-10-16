# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16: Akonto hint and glossary translations (#222)

Branch `feat/glossary-texts-222`. Issue #222 "Decided (product owner)" (the glossary entries are in `UBIQUITOUS_LANGUAGE.md` since #244) plus `CLAUDE.md`, "Workflow".

- [ ] `@wip` scenario «Schlussrechnung mit abgezogenen Akontorechnungen» with the decided text, red; `fach-reviewer` on it (domain term)
  Scenario red (chromium): received the old hint «… Vorgeschlagen ist das Total der Leistungen vor dem Abzug. Erfassen Sie die Akontozahlungen nicht zusätzlich …»
  fach-reviewer round 1 (docs/reviews/222-fachreview-1.md): V-1, V-2 (Major) and V-3 answered by the product owner: the hint names one way only («… Haben Sie die Akontorechnungen schon erfasst, löschen Sie sie, sonst zählen sie doppelt.», recorded in #222), so glossary and hint agree, no amount below 0, the costs fall into the periods of the Schlussrechnung; V-5: the help text stays (product owner); V-4: rows «Auslesen» and «Mahnung eines Rechnungsstellers» planned for `i18n-begriffe.md` with the words the UI uses; V-6, V-7 (Nits) left as they are: the prompt changes only with `llm:eval`
  fach-reviewer round 2 (docs/reviews/222-fachreview-2.md): V-1 (Major, evidence checked: sent statements are not recomputed, `invoices_delete_billed_text` says to delete only wrongly entered invoices) waits for the product owner (variant A or B); V-2, V-3 (Minor) change decided texts, asked with V-1; V-4 fixed (this plan); V-5 taken for the rows; V-6 (Nit, before) open
  Product owner 2026-10-16 (recorded in #222): V-1 variant A (an advance invoice already in a statement stays, its amount is deducted from the total; the glossary sentence on «Akontorechnung» is the product owner's edit), V-2 and V-3 accepted; both scenarios changed
  Scenario red (chromium, round 2 texts): upload hint received «… Erfassen Sie die Akontozahlungen nicht zusätzlich …» (stale build of the old text, the message is not changed yet); invoice page received «… Ist der Betrag das Total vor dem Abzug, dürfen …»
  Test red: invoice-upload.test.ts (2) and invoice-pages.dom.test.ts «zeigt, was die KI beim Hochladen auf dem Beleg gesehen hat» – expected the decided texts, received the old ones
- [ ] `invoices_upload_deducted` in de/fr/it/en as decided (one way, «Akontorechnung»)
- [ ] `invoices_beleg_deducted` in de/fr/it/en as decided (V-3)
- [ ] `docs/design/i18n-begriffe.md`: «Akontorechnung (eines Rechnungsstellers)» facture d’acompte / fattura d’acconto / advance invoice
- [ ] Reviews (`code-reviewer`; feature review: personas and `fach-reviewer` where they apply)
- [ ] Before marking complete: all checks in `CLAUDE.md`
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-222.md`
