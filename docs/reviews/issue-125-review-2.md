# Code-Review issue-125, Runde 2 (Delta)

Geprüft: `git show bebfb87` im Worktree `review-125-code-2`, abgelöst auf bebfb87. Gelesen habe ich alle 23 geänderten Dateien und dazu den Umfeld-Code:
- `backend/src/services/statement-pdf.service.ts` (`getStatementPdf`)
- `backend/src/routes/statements.ts` (preview/generate)
- `backend/src/services/coded-error.ts`, `calculation.service.ts`, `contract.service.ts` und `db/schema.ts` (uuid-Spalte von `rental_contracts`)
- `src/routes/api/statements/[id]/generate-pdf/+server.ts`, `src/lib/server/error-handler.ts` (`AppError`)
- `src/routes/+layout.svelte` (`data-hydrated`), `tests/e2e/screenplay/interactions.ts`
- `src/__tests__/design-guard.test.ts`, `tests/contracts/README.md`
- die Szenarien `statements.feature:58` und `statement-detail.feature:150-158`

## Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-9 | Minor | src/__tests__/statement-endpoints.test.ts:93-100, 117 | C-3 nur teilweise behoben. Die Antwort `{ error: 'PDF not generated yet' }` (404, ohne Code), die das Backend nicht mehr sendet, steht weiter inline in Z. 117 und im Helfer `backend()`. Seit C-4 ist der Zweig `generated = false` samt POST-Zweig in `backend()` toter Testcode (nur noch `backend(true)` wird aufgerufen). |
| C-10 | Minor | src/__tests__/statement-endpoints.test.ts:130-133 | Der Test «nennt beim Ansehen den Grund, den das Backend mit Code angibt» prüfte IBAN_MISSING. Jetzt prüft er STATEMENT_NOT_FOUND wie der Test darüber (Z. 124-128). Für die BFF-Routen zeigt damit kein Test mehr den Satz zu IBAN_MISSING oder IBAN_INVALID. Behebung: einen Vertrag für die IBAN-Ablehnung anlegen statt den Fall zu streichen. |
| C-11 | Minor | tests/e2e/steps/app-frame.steps.ts:146 | `toBe` wurde zu `toContain` auf dem ganzen Seitentext. Das lockert beide Szenarien (`statement-detail.feature:154`, `statements.feature:58`): Die Seite darf jetzt beliebigen weiteren Text tragen. Eine Question auf den Satz (`<p>` in `main`) würde den Wert genau prüfen, wie vorher. |
| C-12 | Minor | implementation_plan.md:74, 78 | Zur Szenario-Erweiterung («von dort zu den Nebenkostenabrechnungen zurückkehrt») fehlt eine Zeile `Scenario red:`. Zu C-5 («test expects 503») fehlt eine Zeile `Test red:`. |
| C-13 | Minor | src/lib/server/statement.ts:109-112 | Die Seite trägt eigenes CSS ausserhalb der Tokens und ohne `src/lib/ui`: rem-Werte und die Systemfarbe `CanvasText` in einem `<style>`-Element, das der Design-Guard nur deshalb nicht erfasst, weil er nur `style`-Attribute prüft. Die Entscheidung des Product Owners für eine kleine Seite ausserhalb des Designsystems fehlt in `docs/design/design-decisions.md`. |
| C-14 | Nit | src/__tests__/statement-pages.dom.test.ts:688 | Die Backend-Antwort PDF_FAILED (vom BFF unverändert durchgereicht) steht inline statt in `tests/contracts/` (gleiche Art wie C-3). |
| C-15 | Minor | docs/design/offene-punkte.md:86 | O-20 enthält funktionale Punkte, die laut «Open work» in ein GitHub-Issue gehören: Die Liste verliert nach dem Löschen den Filter «Entwurf», und die Zurück-Geste zeigt den gelöschten Entwurf wieder (beides `bug`). `offene-punkte.md` ist nur für nicht-funktionale Punkte da. |

Blocker oder Major gibt es in diesem Delta keine.

## Stand der Befunde aus Runde 1

- **C-1 (Major): behoben.** `statement-generation.test.ts:147-156` erwartet den deutschen Satz zum Vertrag `statement-calculation-refused.json`. `api-contracts.pg.test.ts:197-205` prüft diesen Vertrag gegen die echte API. Die Probe `contractId: 'keine-id'` trifft die uuid-Spalte (`schema.ts:112`). Daraus entsteht ein uncodierter Postgres-Fehler, also tatsächlich CALCULATION_FAILED über `codedBody`, nicht CONTRACT_NOT_FOUND. Ein Hinweis dazu: `drift` prüft nur Felder und Typen, nicht den Wert von `code`.
- **C-2: behoben.** `+page.svelte:78-85` und der DOM-Test «nennt den Grund ohne Wiederholung …».
- **C-3: teilweise behoben**, siehe C-9 und C-14. `statement-list-load.test.ts` nutzt jetzt `statement-pdf-refused.json`.
- **C-4: behoben.** `getStatementPdf` erzeugt ein fehlendes PDF selbst (`statement-pdf.service.ts:296-303`). Der Test erwartet jetzt nur noch einen Aufruf.
- **C-5: behoben.** `AppError.statusCode` wird weitergegeben, der Test erwartet 503.
- **C-6: behoben.**
- **C-7 und C-8: Ablehnung nachvollziehbar.** Bei C-8 tritt der Fall schon auf dem Basis-Commit auf.

Neue Seite `pdfRefusal`:
- Bestätigt sind `lang` über `getLocale()`, Viewport, Titel, Satz, Link (48 px über 1.5 × 16 px Zeilenhöhe plus 2 × 12 px Padding) und Escaping des Texts.
- Die Meldungen `nav_statements` und `documents_to_statements` stehen in allen vier `messages/*.json`.
- Der Bildschirm steht in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`.
- Die E2E-Schichten werden eingehalten: Der Step ruft nur den Task `leavePdfRefusal` auf, der Target heisst `pdf-refusal-back`.

## Nicht bestätigt

- **Selbst wiederholt, grün:** `bunx vitest run` mit `statement-endpoints.test.ts`, `statement-list-load.test.ts`, `statement-generation.test.ts`, `statement-pages.dom.test.ts` und `design-guard.test.ts` (471 bestanden).
- **Vom Aufrufer gemeldet, nicht wiederholt:**
  - `bun run test:coverage` (2378)
  - `bun run lint`, `bun run check`
  - Backend `bun run test` und `bun run type-check`, darunter der neue Vertragstest in `api-contracts.pg.test.ts`
  - `deepcheck:audit`
  - E2E chromium: beide Szenarien sowie die axe- und Sprachzeilen von `statement-pdf-refused`
- **Nur über das gemeldete grüne E2E bestätigt, kein eigener Lauf:**
  - ob axe die Seite in allen Viewports und hell/dunkel ohne Verstoss sieht, etwa die Regel `page-has-heading-one`, denn die Seite hat kein `h1`
  - ob die Sprachprüfung in fr/it/en auf dieser Seite ausserhalb der App greift

  E2E habe ich nicht gestartet, wie vorgegeben.
- **Fehlende Sitzung:** Die Listen-Route antwortet bei 401 aus `forwardRequest` jetzt mit 401 und dem Satz «Das PDF konnte nicht erstellt werden. Versuchen Sie es später erneut.». Nur im Code gelesen, kein Test. Das ist kein eigener Befund, denn der Link zurück führt zur Anmeldung.
