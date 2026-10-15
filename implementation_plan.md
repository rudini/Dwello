# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-15: bug #125, coded refusals for statement PDF, IBAN and calculation

Task: open `bug` issues one by one (#122 in rudini/Dwello#181, #123 in rudini/Dwello#182 merged); now #125. Skipped while labelled `entscheiden`: #93, #124, #130, #131, #136, #138, #141.

- [x] Scenarios (`@wip`): `statement-detail.feature` «PDF einer inzwischen gelöschten Abrechnung anfordern», `statements.feature` «… aus der Liste anfordern». Scenario red: detail – received `{"error":"Statement not found"}`; list – the page stays on the list (SvelteKit's client router takes the `/api/…/pdf` link: «Not found»)
- [x] Backend: PDF downloads answer `STATEMENT_NOT_FOUND` (404) and `IBAN_MISSING` instead of «PDF not generated yet»; their 500 branch `PDF_FAILED`; generate-pdf's 500 branch too; invalid IBAN `IBAN_INVALID`; preview and generate `CALCULATION_FAILED`, original logged; exception in `statement.routes.pg.test.ts` removed; `error-codes.pg.test.ts` per code. Test red: «meldet eine IBAN mit falscher Prüfziffer …» – received 200 (the PDF service swallowed the QR-bill's error and made the PDF without payment part; now a coded error passes); «… unerwarteten Grund … PDF» and «… Berechnung …» – received the database's text; `statement.routes.pg.test.ts` unknown statement and missing PDF – no code
- [x] BFF: both PDF routes answer a refusal with a sentence in the UI language; list PDF link loads the page in full (`reload`). Test red: `statement-endpoints.test.ts` 4 cases (JSON, «PDF» with status 200 holding the JSON); `statement-list-load.test.ts` pinned the JSON and now expects the sentence
- [x] Messages `backend_iban_invalid`, `backend_pdf_failed`, `backend_calculation_failed` in de/fr/it/en; `docs/api-specification.md`; API contract `statement-pdf-refused.json`
- [x] Skills: tdd, ponytail, ponytail-review
- [x] Checks: test:coverage (2349), lint, check, backend test + type-check, deepcheck:audit, fallow audit, E2E chromium: both new scenarios, «PDF einer Abrechnung herunterladen», «PDF erstellen und herunterladen», «Vor dem Versand …»
- [ ] code-reviewer
- [ ] Personas (screen: statement detail and list, error text)
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-125.md`
- [ ] PR, CI, merge

Files: `backend/src/services/coded-error.ts`, `qr-bill.service.ts`, `pdf.service.ts`, `statement-pdf.service.ts`, `backend/src/routes/statements.ts`, `backend/src/__tests__/error-codes.pg.test.ts`, `statement.routes.pg.test.ts`, `api-contracts.pg.test.ts`, `src/lib/server/statement.ts`, `src/routes/statements/[id]/pdf/+server.ts`, `src/routes/api/statements/[id]/pdf/+server.ts`, `src/routes/statements/StatementRow.svelte`, `src/__tests__/statement-endpoints.test.ts`, `statement-list-load.test.ts`, `messages/*.json`, `docs/api-specification.md`, `tests/contracts/statement-pdf-refused.json`, `README.md` there, E2E features, steps, tasks, targets, questions, `fixtures/backend.ts`
