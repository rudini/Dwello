# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-15: Create Rechnungen from uploaded invoice files (#217)

Branch `feat/invoice-upload-217`. Issue #217 "Done means" plus `CLAUDE.md`, "Workflow".

- [x] Glossary term «Beleg» added on the product owner's request in this session (`UBIQUITOUS_LANGUAGE.md`, commit 6adf5a6)
- [x] `@wip` scenarios in `tests/e2e/features/invoices.feature` (8) and `invoice-detail.feature` (4), steps in `tests/e2e/steps/invoice-upload.steps.ts`
  Scenario red: all 12 at the missing behavior: `getByTestId('invoice-upload-button')` not found (list), `PUT /invoices/:id/beleg` answers 404 (seed), `getByTestId('invoice-beleg-file-input')` not found (detail)
- [ ] `fach-reviewer` on the scenarios (new KI prompt, privacy statement, domain term «Beleg»)
- [ ] Backend: migration `0003_invoice_documents.sql` (table `invoice_documents`, drop `invoices.invoice_pdf`), schema, `docs/data-model.md`
- [ ] Backend: Beleg with a new invoice (`POST /invoices` with `beleg`), download, replace; deleted with the invoice; file checks shared with tenant documents
- [ ] Backend: `POST /invoices/extract` (KI reads the file: fields with confidence, several invoices, category through the existing categorization), possible duplicate in the Gebäude
- [ ] Backend: default model `qwen2.5vl:7b`; README, docker-compose, docs; `llm:eval` before/after (default model)
- [ ] KI stand-in answers the extraction prompt (by file name)
- [ ] Frontend: dialog «Rechnungen hochladen» on `/invoices` (Hochladen, Prüfen, Erstellen; at most 20 files; PDF pages rendered in the browser for the KI)
- [ ] Frontend: «Beleg anzeigen», «Beleg ersetzen» on the invoice; delete confirmation names the Beleg
- [ ] Privacy statement: invoice files to the KI (local and external text)
- [ ] UI texts in de/fr/it/en; `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`
- [ ] API contracts, `docs/api-specification.md`
- [ ] Slice reviews (`code-reviewer`), feature review (personas, `fach-reviewer`)
- [ ] Before marking complete: all checks in `CLAUDE.md`
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-217.md`
