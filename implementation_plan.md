# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-15: Create Rechnungen from uploaded invoice files (#217)

Branch `feat/invoice-upload-217`. Issue #217 "Done means" plus `CLAUDE.md`, "Workflow".

- [x] Glossary term «Beleg» added on the product owner's request in this session (`UBIQUITOUS_LANGUAGE.md`, commit 6adf5a6)
- [x] `@wip` scenarios in `tests/e2e/features/invoices.feature` (8) and `invoice-detail.feature` (4), steps in `tests/e2e/steps/invoice-upload.steps.ts`
  Scenario red: all 12 at the missing behavior: `getByTestId('invoice-upload-button')` not found (list), `PUT /invoices/:id/beleg` answers 404 (seed), `getByTestId('invoice-beleg-file-input')` not found (detail)
- [x] `fach-reviewer` on the scenarios (new KI prompt, privacy statement, domain term «Beleg»); product owner decided V-1, V-2, M-1, M-2, M-3 (recorded in #217); scenarios revised (Datei for unsaved files, Kategorie required, new hints)
  fach-reviewer round 1 (docs/reviews/upload-fachreview-1.md): open –; fixed in scenarios/plan V-1, V-2, V-4, V-5, V-7, M-1, M-2, M-3, M-4, R-1, R-3, R-5 (code follows), confirmed V-8; rejected V-3a: the product owner decided unsure fields are marked, not blocking; V-3b: an invoice without Leistungszeitraum is the subject of #131 and #134; V-6: duplicate rule decided by the product owner; R-2: the local text's condition is #216's, unchanged here; R-4: the file name often names supplier and period and helps the model, the privacy text names it, and the E2E stand-in reads it; missing terms (Konfidenz, Auslesen, Rechnung vs. Beleg) go into one issue
- [x] Backend: migration `0003_invoice_documents.sql` (table `invoice_documents`, drop `invoices.invoice_pdf`), schema, `docs/data-model.md`
  Test red: `invoice-beleg.pg.test.ts` «wird mit der neuen Rechnung gespeichert …» – expected beleg {fileName, mimeType}, received undefined
- [x] Backend: Beleg with a new invoice (`POST /invoices` with `beleg`), download, replace; deleted with the invoice; file checks shared with tenant documents (`checkedFile`), download headers shared (`routes/file-response.ts`)
  Test red: «wird zu einer Rechnung ohne Beleg hinzugefügt …» – 404 for PUT; «lehnt eine Datei ab …» and «wird mit der Rechnung gelöscht» written after the code, red shown by taking out the check and the cascade
- [x] Backend: `POST /invoices/extract` (KI reads the file: fields with confidence, several invoices, category through the existing categorization), possible duplicate in the Gebäude; prompt after the domain review (total before deductions, document type, items not allocable, no due date from «innert 30 Tagen»)
  Test red: `llm-extraction.test.ts` – import missing; `invoice-extraction.pg.test.ts` «schickt die Seiten …» – 404; KI down and duplicate written after the code, red shown by taking the code out
- [x] Backend: default model `qwen2.5vl:7b`; README (with OpenRouter), docker-compose, docs
- [ ] `llm:eval` before/after with the default model: the session cannot pull Ollama models → Blocked on me, PR says `Refs #217`
- [x] KI stand-in answers the extraction prompt (by file name) and categorizes only the upload scenarios' suppliers
- [ ] Frontend: dialog «Rechnungen hochladen» on `/invoices` (Hochladen, Prüfen, Erstellen; at most 20 files; PDF pages rendered in the browser for the KI)
- [ ] Frontend: «Beleg anzeigen», «Beleg ersetzen» on the invoice; delete confirmation names the Beleg
- [ ] Privacy statement: invoice files to the KI (local and external text)
- [ ] UI texts in de/fr/it/en; `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`
- [x] API contracts (`invoice.json` beleg, new `invoice-extraction.json`), `docs/api-specification.md`
- [ ] Slice reviews (`code-reviewer`), feature review (personas, `fach-reviewer`)
  Slice 1 (backend, 90631a2..f63afb6) Skills: tdd, ponytail, ponytail-review (reuse: one mapping of the KI suggestion)
  code-reviewer round 1 (docs/reviews/upload-backend-review-1.md): fixed C-1 (Major; test «lässt ein Datum mit unmöglichem Monat leer …» red, `isRealDate` no longer throws), C-2, C-3 (tests), C-4 (code EXTRACTION_UNAVAILABLE), C-5 (code BELEG_NOT_FOUND, invoice checked before the file), C-6 (transaction; no test: a failing insert after the file check cannot be produced), C-7, C-8, C-9, C-10, C-11
  code-reviewer round 2 (docs/reviews/upload-backend-review-2.md): C-1..C-11 confirmed fixed; fixed C-13 (test), C-14 (`isRealDate` moved to `services/real-date.ts`), C-15 (test red: `-2`, `1.5`, `true` counted); C-12: the texts of the dialog and the privacy statement stay in this branch, their tests come with slice 2 (frontend)
- [ ] Before marking complete: all checks in `CLAUDE.md`
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-217.md`
- Found: `swiss-today.pg.test.ts` fails in its cleanup on `origin/main` too (utility_statements still reference the apartment) → row O-29 in `docs/design/offene-punkte.md`
