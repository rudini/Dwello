# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16: Akonto hint and glossary translations (#222)

Branch `feat/glossary-texts-222`. Issue #222 "Decided (product owner)" (the glossary entries are in `UBIQUITOUS_LANGUAGE.md` since #244) plus `CLAUDE.md`, "Workflow".

- [ ] `@wip` scenario «Schlussrechnung mit abgezogenen Akontorechnungen» with the decided text, red; `fach-reviewer` on it (domain term)
  Scenario red (chromium): received the old hint «… Vorgeschlagen ist das Total der Leistungen vor dem Abzug. Erfassen Sie die Akontozahlungen nicht zusätzlich …»
- [ ] `invoices_upload_deducted` in de/fr/it/en as decided (both ways, «Akontorechnung»)
- [ ] `docs/design/i18n-begriffe.md`: «Akontorechnung (eines Rechnungsstellers)» facture d’acompte / fattura d’acconto / advance invoice
- [ ] Reviews (`code-reviewer`; feature review: personas and `fach-reviewer` where they apply)
- [ ] Before marking complete: all checks in `CLAUDE.md`
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-222.md`
