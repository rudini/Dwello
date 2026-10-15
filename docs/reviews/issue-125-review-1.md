# Code-Review issue-125, Runde 1

Geprüft: `origin/main..939f7a8` (ein Commit) im Worktree `review-125-code`. Alle 32 geänderten Dateien gelesen, dazu `src/lib/backend-error.ts`, `src/lib/server/statement-generation.ts`, `src/lib/server/api-proxy.ts`, `src/routes/statements/[id]/+page.svelte`, `src/routes/api/statements/[id]/generate-pdf/+server.ts`, `backend/src/services/calculation.service.ts` (Würfe), `tests/e2e/CLAUDE.md`.

## Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-1 | Major | src/__tests__/statement-generation.test.ts:146-156 | «Der Assistent zeigt die Meldung von CALCULATION_FAILED» ist durch keinen Test belegt; der bestehende Test hält weiter den uncodierten englischen Text `Calculation failed` fest, den das Backend nicht mehr sendet |
| C-2 | Minor | src/routes/statements/[id]/+page.svelte:78-82 | PDF_FAILED beim «PDF erstellen» ergibt den Toast «PDF konnte nicht erstellt werden: Das PDF konnte nicht erstellt werden. Versuchen Sie es später erneut.» (doppelt) |
| C-3 | Minor | src/__tests__/statement-endpoints.test.ts:127 | Antwort des Backends (IBAN_MISSING) inline statt aus `tests/contracts/` (Gotcha «API contracts»); ebenso das veraltete `{ error: 'PDF not generated yet' }` in statement-list-load.test.ts:97, das das Backend nicht mehr sendet |
| C-4 | Minor | src/routes/statements/[id]/pdf/+server.ts:10-19 | `pdfToView` erzeugt bei 404 nach; das Backend erzeugt in `getStatementPdf` selbst und antwortet 404 jetzt nur noch mit STATEMENT_NOT_FOUND: der Zweig macht nur zwei zwecklose Backend-Aufrufe (war schon vorher wirkungslos; die Änderung macht es eindeutig). Der Test «erstellt es, wenn es noch fehlt» (statement-endpoints.test.ts:132) prüft ein Verhalten, das das Backend nicht mehr hat |
| C-5 | Minor | src/routes/api/statements/[id]/pdf/+server.ts:22-24 | Der catch antwortet immer 500; `handleProxyError` gab vorher 503/504 (Backend nicht erreichbar, Zeitüberschreitung) bzw. 401 weiter. Der Test «nicht erreichbar» prüft den Status nicht |
| C-6 | Nit | backend/src/routes/statements.ts:22-23 | Der Kommentar «Calculation parameters shared by preview and generate …» steht jetzt über `pdfFailure` statt über `calculationBody` |
| C-7 | Nit | backend/src/services/statement-pdf.service.ts:296-300, backend/src/routes/statements.ts:280-287 | Die Ablehnungen STATEMENT_NOT_FOUND und IBAN_MISSING (samt Text) stehen jetzt doppelt: in `getStatementPdf` und in der Route generate-pdf |
| C-8 | Nit | backend/src/services/statement-pdf.service.ts:299-301 | Gibt `generateStatementPdf` (gleichzeitig gelöscht) `'not-found'` zurück, scheitert `(await storedPdf(id))!` an `undefined` und antwortet 500 PDF_FAILED statt 404; bestand schon vorher |

## C-1 (Major): Meldung von CALCULATION_FAILED im Assistenten nicht belegt

Laut Anforderung zeigt der Assistent die Meldung, wenn Vorschau oder Erstellen ohne eigenen Code scheitern. Im Code läuft das über `call()` in `src/lib/server/statement-generation.ts:36-40` → `backendMessage(data, …)`. Das stimmt, aber kein Test zeigt es. Das ist eine Änderung, die die Benutzerin oder der Benutzer sieht: bisher stand dort der Text des Backends (z.B. der Datenbankfehler), jetzt «Die Abrechnung konnte nicht berechnet werden. …». Weil das Scheitern zwischen Server-Teilen liegt (Form-Action → Backend), gibt es kein Szenario. Darum muss der Test auf einer tieferen Schicht liegen, und dort fehlt er. Der einzige passende Test, `statement-generation.test.ts:146` «meldet einen Fehler, wenn das Backend die Berechnung ablehnt», füttert `{ error: 'Calculation failed' }` ohne Code und erwartet `rejects.toThrow('Calculation failed')`. Er hält also genau den uncodierten englischen Text fest, den Issue #125 abschafft.

So zeigt sich die Lücke: Man ändert `messages/de.json` `backend_calculation_failed` oder lässt in `call()` den Code weg (`backendMessage({ error: data.error }, …)`). `bunx vitest run src/__tests__/statement-generation.test.ts` bleibt grün.

Behebung: Den Test auf den Vertragskörper `{ error: 'Calculation failed', code: 'CALCULATION_FAILED', params: {} }` umstellen (besser als Vertrag in `tests/contracts/`, vgl. C-3). Er soll den deutschen Satz erwarten. Im Plan eine `Test red`-Zeile dazu.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst wiederholt: `bun run test:coverage` (2349), `bun run lint`, `bun run check`, Backend `bun run test` (gesamt) und `bun run type-check`, `bun run deepcheck:audit`, `bunx fallow audit`, E2E chromium (beide neuen Szenarien rot vorher und grün, sowie «PDF einer Abrechnung herunterladen», «PDF erstellen und herunterladen», «Vor dem Versand Empfänger und PDF prüfen»).
- Selbst wiederholt, grün: `bunx vitest run src/__tests__/statement-endpoints.test.ts src/__tests__/statement-list-load.test.ts src/__tests__/statement-generation.test.ts` (32 bestanden); `bun test src/__tests__/error-codes.pg.test.ts src/__tests__/statement.routes.pg.test.ts` in `backend/` (27 bestanden).
- Ob Chromium die `text/plain`-Antwort so in `body` zeigt, dass `Text.of(pageBody)` genau «Abrechnung nicht gefunden.» liefert, und ob der Link der Detailseite (`PdfAction.svelte:15`, ohne `reload`) im Tab navigiert: Beides habe ich nur über das gemeldete grüne E2E bestätigt (E2E nicht gestartet, wie vorgegeben).
- `/pdf/base64` mit IBAN_INVALID: von keinem Test abgedeckt (error-codes.pg.test.ts prüft generate-pdf und pdf). Laut Code (`routes/statements.ts`, derselbe `pdfFailure`) verhält es sich gleich; kein eigener Befund.
- IBAN_INVALID für das Herunterladen in der Oberfläche: nur über den allgemeinen Weg `pdfRefusal` → `backendMessage` belegt (Unit-Test mit IBAN_MISSING). Einen eigenen Test mit IBAN_INVALID gibt es nicht.

Bestätigt durch Code und Test: STATEMENT_NOT_FOUND (404) für `/pdf` und `/pdf/base64` (statement.routes.pg.test.ts, Ausnahme entfernt; Vertrag `statement-pdf-refused.json` in api-contracts.pg.test.ts). IBAN_MISSING (400) statt «PDF not generated yet». PDF_FAILED im 500-Zweig aller drei PDF-Routen ohne `error.message`. IBAN_INVALID mit Hinweis auf die Einstellungen (de/fr/it/en). CALCULATION_FAILED für Vorschau und Erstellen, Original geloggt (`codedBody`). Beide BFF-Routen antworten mit dem Satz statt JSON, je ein Unit-Test. Die drei neuen Codes stehen in `docs/api-specification.md` und in allen vier `messages/*.json`. Szenarien ohne `@wip`, Plan mit `Scenario red`, `Test red`, `Skills`. Die E2E-Schichten werden eingehalten (Steps rufen nur Tasks/Questions/Seed auf; `pageText` liefert den Text; `locator('body')` folgt dem Vorbild `locator('html')` in targets/language.ts).
