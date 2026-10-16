# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16: Akonto hint and glossary translations (#222)

Branch `feat/glossary-texts-222`. Issue #222 "Decided (product owner)" (the glossary entries are in `UBIQUITOUS_LANGUAGE.md` since #244) plus `CLAUDE.md`, "Workflow".

- [ ] `@wip` scenario «Schlussrechnung mit abgezogenen Akontorechnungen» with the decided text, red; `fach-reviewer` on it (domain term)
  Scenario red (chromium): received the old hint «… Vorgeschlagen ist das Total der Leistungen vor dem Abzug. Erfassen Sie die Akontozahlungen nicht zusätzlich …»
  fach-reviewer round 1 (docs/reviews/222-fachreview-1.md): V-1, V-2 (Major) and V-3 answered by the product owner: the hint names one way only («… Haben Sie die Akontorechnungen schon erfasst, löschen Sie sie, sonst zählen sie doppelt.», recorded in #222), so glossary and hint agree, no amount below 0, the costs fall into the periods of the Schlussrechnung; V-5: the help text stays (product owner); V-4: rows «Auslesen» and «Mahnung eines Rechnungsstellers» added to `i18n-begriffe.md` with the words the UI uses; V-6, V-7 (Nits) left as they are: the prompt changes only with `llm:eval`
- [ ] `invoices_upload_deducted` in de/fr/it/en as decided (both ways, «Akontorechnung»)
- [ ] `docs/design/i18n-begriffe.md`: «Akontorechnung (eines Rechnungsstellers)» facture d’acompte / fattura d’acconto / advance invoice
- [ ] Reviews (`code-reviewer`; feature review: personas and `fach-reviewer` where they apply)
- [ ] Before marking complete: all checks in `CLAUDE.md`
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-222.md`
