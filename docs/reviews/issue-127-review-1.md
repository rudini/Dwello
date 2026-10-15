# Code-Review issue-127, Runde 1

Geprüft: `origin/main..0644c7d` (ein Commit, `fix(invoices): code schema refusals, hide raw text`) im Worktree `review-127-code`. Alle 7 geänderten Dateien gelesen, dazu `backend/src/services/coded-error.ts`, `src/lib/backend-error.ts`, `src/lib/api.ts` (`failure()`), `src/lib/server/api-proxy.ts`, `backend/src/routes/invoices.ts`, `CategorizationPanel.svelte`, `tests/contracts/README.md`, `backend/src/__tests__/api-contracts.pg.test.ts`.

## Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-1 | Major | `backend/src/app.ts:57-61`, `src/__tests__/invoice-pages.dom.test.ts:755`, `tests/contracts/` | Die 422-Antwort des Backends ändert sich, aber es gibt keinen Vertrag dafür. Der neue DOM-Test baut den Body inline nach, statt ihn aus `tests/contracts/*.json` zu nehmen. |
| C-2 | Minor | `src/__tests__/invoice-pages.dom.test.ts:742` | Der Test für die Ablehnung ohne Code sendet `{ error: { code: 'ERR', message } }`, also die Form des BFF-Proxys. Die Form, die der Bug wirklich hat (`{ error: '<Text>' }` ohne Code, aus `errorBody` in `backend/src/routes/invoices.ts:233`, in `api.ts:156` zu `HTTP_400`), prüft das Bearbeiten-Formular nicht. Das Verhalten ist dasselbe, weil beide Codes unbekannt sind. Der Testname «nicht den Text des Servers» verspricht aber genau diesen Fall. |
| C-3 | Nit | `backend/src/__tests__/error-codes.pg.test.ts:169-174` | Der pg-Test prüft nur einen ungültigen Body. `docs/api-specification.md` nennt aber auch Query- und Pfad-Parameter (in Elysia derselbe Code `VALIDATION`). Ein Fall mit Pfad-Parameter (z.B. `DELETE …/fuel-stocks/not-a-uuid`, siehe `fuel-stock.pg.test.ts:141`) würde die Doku-Zeile belegen. |

## C-1 (Major): Kein API-Vertrag für die geänderte 422-Antwort

Warum das falsch ist: `CLAUDE.md`, Abschnitt «Gotchas», «API contracts», verlangt: «Changing an API response means updating its contract». Ausserdem nimmt ein Frontend-Test, der eine Backend-Antwort liest, diese aus `tests/contracts/*.json` («add a contract when there is none»).

- Dieser Commit ändert die Antwort jeder Schema-Ablehnung: Statt des eigenen Bodys von Elysia kommt jetzt `{ error, code, params }`.
- Der neue DOM-Test «nennt beim Speichern den Grund, den das Backend mit Code angibt» (`invoice-pages.dom.test.ts:755`) schreibt diesen Body von Hand.
- Für andere Ablehnungen hat das Repo Verträge, die `api-contracts.pg.test.ts` gegen die echte API prüft: `document-refused.json`, `contract-end-refused.json`, `statement-calculation-refused.json`.

So zeigt man, dass es fehlschlägt: Ändert das Backend den Body, zum Beispiel ohne `params` oder mit `error` als Objekt, bleibt der DOM-Test grün. Er liest nur die eigene Kopie. Kein Vertragstest hält die Abweichung auf. Der pg-Test prüft `code` und `params`, aber nicht den Typ von `error`, und er ist nicht mit der Attrappe im Frontend verbunden.

Behebung:
- `tests/contracts/validation-refused.json` anlegen (`{ "error": "Invalid request", "code": "VALIDATION_ERROR", "params": {} }`).
- Im DOM-Test importieren.
- Eine `drift`-Prüfung in `api-contracts.pg.test.ts` ergänzen.
- Eine Zeile in `tests/contracts/README.md` ergänzen.

## Bestätigt

- Backend: Ein globales `onError` (`app.ts:57-61`) ist vor allen Routen registriert und antwortet nur bei `code === 'VALIDATION'`. Es setzt 422 und gibt `refusal('VALIDATION_ERROR', 'Invalid request')` zurück. Alle anderen Fehler gehen an Elysias Standard weiter (`return` ohne Wert). Es gibt keine `response:`-Schemas in `backend/src/routes`, also kann ein Antwort-Validierungsfehler nicht fälschlich als «Anfrage ungültig» erscheinen. Ein anderes `onError` im Backend gibt es nicht.
- `backend_validation_error` steht in allen vier `messages/*.json` (Zeile 1030). `invoices_save_failed`, `invoices_save_error` und `backend_unknown_error` gibt es schon in allen vier Dateien. Der Commit bringt keinen neuen Text.
- Bearbeiten (`edit/+page.svelte:84-86`):
  - Ein unbekannter Code ergibt `invoices_save_failed` allein.
  - Ein bekannter Code ergibt `invoices_save_error({ error: <backend_code> })`.
  - Der Text des Backends kommt nicht mehr durch, weil `backendMessage` nur `{ code, params }` erhält, ohne `error` und ohne `message`.
- Detailseite (`[id]/+page.svelte:62-67`): Der Text kommt im Alert mit dem Titel `invoices_categorisation_failed` (`CategorizationPanel.svelte:89`). Ein unbekannter Code ergibt `backend_unknown_error` als Inhalt. Damit erfüllt die Seite die Anforderung («or the existing recategorisation error»).
- `backendMessage` selbst ist unverändert. Der allgemeine Rückfall auf den Text des Backends bleibt für andere Aufrufer erhalten.
- Tests:
  - pg-Test für den Code (`error-codes.pg.test.ts:168-174`).
  - DOM-Tests für eine Ablehnung ohne Code beim Bearbeiten (`:741-752`) und beim Neu-Kategorisieren (`:279-291`).
  - Der KI-Test sendet jetzt `KI_UNAVAILABLE`, wie `invoices.ts:195` es tut.
  - Ich habe `bunx vitest run src/__tests__/invoice-pages.dom.test.ts` erneut laufen lassen: 48 bestanden.
- Doku: Der Abschnitt «Schema validation» in `docs/api-specification.md` beschreibt Status, Body und Handler korrekt.
- Plan: Eine Session, die Zeile `Skills: tdd, ponytail, ponytail-review`, `Test red`-Zeilen für die drei Tests mit neuem Verhalten und die Begründung für `No scenario` sind vorhanden. Der Test «nennt beim Speichern den Grund …» sichert unverändertes Verhalten (auf der Basis ebenfalls grün) und braucht darum keine Red-Zeile.
- Keine fachfremden Änderungen, keine Formatierung von unberührten Zeilen.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst wiederholt:
  - `bun run test:coverage` (2418)
  - `bun run lint`
  - `bun run check`
  - `cd backend && bun run test && bun run type-check`, also auch der rote und dann grüne pg-Test
  - `deepcheck:audit`
  - E2E chromium und api: invoice-edit, invoice-detail, invoice-new (18 bestanden)
  - Rot-vor-Grün der zwei DOM-Tests (nur die Notiz im Plan gelesen)
- Den Text von Issue #127 habe ich nicht auf GitHub gelesen. Geprüft habe ich gegen die Anforderung, wie sie mir übergeben wurde.
- «No scenario: server-side failure»: Ich halte die Begründung für tragfähig. `FailRequests` darf keinen Body erfinden, und eine Schema-Ablehnung kann die UI im Normalfall nicht auslösen. Nicht ausgeschlossen habe ich, dass ein echter Ablauf über den Browser eine Ablehnung ohne Code erreicht, etwa eine Kategorie, die gelöscht wird, während das Formular offen ist. Dann käme ein Datenbankfehler als Text aus `errorBody`. Ob `applyCategory` (`invoice.service.ts:266`) das schon mit Code abfängt, habe ich nicht geprüft.
