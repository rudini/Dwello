# Code-Review #852, Runde 2 (615bdc0b, Delta zu cdd47d7d)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-5 | Minor | backend/src/routes/documents.ts:87, src/routes/documents/+page.server.ts:20-22 | `PUT /documents/:id/sent` antwortet jetzt ebenfalls mit `DOCUMENT_NOT_FOUND`. Unter «Dokumente» zeigt «Als versendet markieren» für ein Dokument, das es nicht mehr gibt, deshalb neu «Das Dokument gibt es nicht mehr. Laden Sie die Seite neu.» statt «Dokument konnte nicht aktualisiert werden.». Die Änderung ist richtig, aber kein Test deckt sie ab. `src/__tests__/documents.test.ts` prüft `markSent` nur mit 400-Verträgen. `tenant-documents.pg.test.ts:121` prüft nur den Status 404, `api-contracts.pg.test.ts` nur `DELETE`. Die Commit-Nachricht erwähnt die Änderung nicht. |

Geschlossen: C-1, C-2, C-3, C-4 (und damit Helga P-1)

Geprüft: Bei C-1 bekommen `DELETE` und `GET .../pdf` den Code über `refusal()`. Die Meldung steht in allen vier `messages/*.json` und hält Copy-Regel und Begriffe ein. Vertrag und Vertragstest passen zur Antwort (`refusal` liefert `{ error, code, params }`), `backend-codes.test.ts` findet den Code. Die Szenariozeile darf sich ändern, weil das Szenario nicht auf `origin/main` liegt. Bei C-2 laufen `errors` und `errorCodes` in `formula.service.ts` parallel, ein fehlender Code fällt auf den Satz der Seite zurück. Der neue Test ist mit dem alten Code rot, weil er dort `'Neue Prüfung'` zeigt. Bei C-3 kann der französische Erwartungswert nur aus den Codes stammen; das NBSP stimmt mit `fr.json` überein, und die Locale wird zurückgesetzt. Bei C-4 stimmt der Kommentar jetzt.

## Nicht bestätigt

- `bunx vitest run` (3702), `bun run lint`, `cd backend && bun run type-check`, `bun test src/__tests__/api-contracts.pg.test.ts -t "Ablehnungen mit Code"` (7, der neue Test vor der Routenänderung rot), `error-codes.pg.test.ts`, E2E `tenant-documents.feature` Chromium (9, die geänderte Zeile vorher rot) und der rote Lauf des neuen Formeltests: alles vom Aufrufer gemeldet, nichts davon selbst wiederholt. Den roten Lauf des Formeltests und des französischen Tests habe ich durch Lesen des alten Codes bestätigt.
- `bun run check` meldet der Aufrufer für 615bdc0b nicht. Die neuen Imports (`onTestFinished`, `overwriteGetLocale`, `baseLocale`) habe ich nur gelesen und nicht typgeprüft.
- `GET /documents/:id/pdf`: `proxyFile` (`src/lib/server/file-proxy.ts`) reicht den JSON-Körper der 404-Antwort roh an den Browser weiter, jetzt mit `code`. Das war schon auf der Basis so (vorher `{ error }`), und diese Änderung macht es nicht sichtbarer. Für Abrechnungen gibt es auf `main` dafür einen Satz statt technischer Daten (`statement-detail.feature:403`), für Dokumente nicht. Ich habe es nicht als Befund gezählt.
