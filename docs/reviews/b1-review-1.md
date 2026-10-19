# Slice-Review B1, Runde 1: ungültige Kennung gibt 404, Lücke über der Kostenaufstellung

Bereich: `git diff c09ec4fd 5d964822` (206c6877, b20dc52f, 5d964822), Worktree `review-b1-code`, alle 23 geänderten Dateien gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | `tests/e2e/steps/statement-detail.steps.ts:505` | `toBeLessThanOrEqual(32)` legt den «üblichen Abstand» nicht fest: ein Abstand von 0 oder ein negativer (die Kostenaufstellung überlappt den Status) besteht auch. Wenn `empty:-mt-8` zu viel wegnimmt (z. B. wenn die Spalte einmal `gap-6` hat), bleibt das Szenario grün. Besser `toBe(32)`. |
| C-2 | Minor | `backend/src/__tests__/error-codes.pg.test.ts:147-158` | Der Test «meldet ein PDF, das aus einem unerwarteten Grund nicht entsteht, mit Code» prüfte vorher drei Endpunkte (`POST /:id/generate-pdf`, `GET /:id/pdf`, `GET /:id/pdf/base64`), jetzt nur noch `generate-pdf`. Dass die beiden GET-Endpunkte bei einem unerwarteten Fehler `PDF_FAILED` melden (`backend/src/routes/statements.ts:418` und `:444`), ist damit durch keinen Test mehr abgedeckt. Der Diff lässt diese Abdeckung ersatzlos fallen. |

Keine Blocker, keine Majors.

## Geprüft und bestätigt

- **Anforderung 1 (404 statt 500):**
  - `onTransform` (`backend/src/app.ts:69-72`) läuft vor der Schema-Validierung und vor dem Handler.
  - Erfasst werden alle Pfadparameter auf `…id`: `:id`, `:stockId`, `:apartmentId`, `:buildingId`, gefunden in allen Routen von `backend/src/routes`.
  - `:key` (Config) passt nicht auf `/id$/i` und bleibt unberührt.
  - Alle 14 Tabellen haben `uuid('id')` als Schlüssel (`backend/src/db/schema.ts`). Es gibt also keine Route, deren Kennung zu Recht keine UUID ist: Abrechnungsnummer, Slug oder Schlüssel stehen nie in einem `…id`-Parameter.
  - Statische Routen wie `POST /invoices/upload` und `GET /invoices/llm-recipient` haben im Router Vorrang vor `/:id`.
  - Das BFF macht aus einer 404 die Seite 404: `src/lib/server/save-form.ts:57`, `statement.ts:148`, `tenant.ts:13`, `apartment.ts:11`.
- **Tests zu Anforderung 1:**
  - `error-codes.pg.test.ts` deckt 11 Pfade ab und ist ohne die Änderung rot (500 aus PostgreSQL bzw. 422 aus dem Schema).
  - Der Szenariogrundriss in `navigation.feature` deckt 17 Seiten ab, ohne `@wip`, und ist ohne die Änderung rot (Seite 500).
  - Die Seite 404 gibt es schon in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature` (`error-404`). Es ist also kein neuer Bildschirm dazugekommen.
- **Code und Meldung:** `NOT_FOUND` hat eine Meldung `backend_not_found` in allen vier `messages/*.json`. `src/__tests__/backend-codes.test.ts` verlangt sie (nachgeprüft, grün).
- **Verträge und Doku:**
  - Kein Vertrag in `tests/contracts` beschreibt eine 404-Antwort einer unbekannten Route oder Kennung, darum war keiner nachzuführen.
  - `statement-pdf-failed.json` wird jetzt über `language: 'xx'` ausgelöst und hält weiterhin.
  - `docs/api-specification.md` ist ergänzt.
- **Anforderung 2 (Lücke über der Kostenaufstellung):**
  - Ursache sind drei leere Elemente in der `flex-col gap-8`-Spalte (`+page.svelte:126`): das Formular des `FormDialog` in `Correction` (`Correction.svelte:97`) und die beiden Live-Regionen. 32 + 3 × 32 = 128 px.
  - `hidden` auf dem `<form>` lässt den Dialog unberührt. `<Dialog>` steht neben dem Formular, nicht darin, und `requestSubmit()` funktioniert auch bei einem verborgenen Formular.
  - Die Live-Regionen (`role="status"`) bleiben im Accessibility-Baum. Ein leeres `:empty` gilt trotz der Kommentar-Anker von Svelte, und mit Inhalt fällt der negative Rand weg.
- **Design:**
  - `-mt-8` liegt im 8-px-Raster, und es gibt keinen beliebigen Wert.
  - `design-guard.test.ts` und `tokens.test.ts` sind grün (nachgeprüft).
  - Ein `empty:`-Variant ist im Code schon üblich (`DateInput.svelte:178`, `InvoiceUploadDialog.svelte:252`).
- **Screenplay:**
  - Die Steps rufen nur Tasks (`openPage`) und Questions (`pageTitleText`, `gapAboveCostBreakdown`).
  - `Gap.between` liefert einen Wert (Pixel), und `data-testid="statement-cost-breakdown"` ist nach der Regel benannt.
  - Die Features beschreiben keine Bedienelemente.
- **Ponytail:** nichts zu kürzen. Es gab vorher keinen UUID-Helfer im Backend, den der Diff kopiert.
- **Plan und Archiv:** Session C1 ist ins Archiv verschoben, weil `open-work.test.ts` nur eine Session erlaubt. Das gehört zum Workflow und ist nicht fremd.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst wiederholt:
  - `bun run lint`, `bun run check`, Backend `bun run type-check`
  - Backend `bun run test` (1002 Tests, Coverage-Floor)
  - Frontend `test:coverage` (3143 Tests)
  - E2E Chromium von `navigation`, `statement-detail`, `statement-send`, `statement-reminder` (119)
  - axe- und Sprachzeilen der Abrechnungsdetail-Bildschirme (44)
- Selbst wiederholt: `bunx vitest run src/__tests__/design-guard.test.ts src/__tests__/tokens.test.ts src/__tests__/backend-codes.test.ts` (468 Tests, grün).
- Die Reihenfolge im Lebenszyklus von Elysia habe ich nicht im Quelltext nachgesehen (`node_modules/elysia` wird durch eine Deny-Regel gesperrt). Gemeint ist: ein globales `onTransform` läuft vor der Validierung und vor dem `derive` von `authMiddleware` (`backend/src/middleware/auth.ts:54`). Ich schliesse sie aus den gemeldet grünen Tests. Folge: eine nicht angemeldete Anfrage mit fehlerhafter Kennung erhält vermutlich 404 statt 401. Das gibt keine Daten preis, ich habe es aber nicht nachgeprüft.
- Dass die Ansage der Live-Regionen in einem Screenreader tatsächlich erfolgt, habe ich nur am Markup beurteilt, nicht mit einem Screenreader.
