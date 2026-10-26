# Code-Review #852, Runde 3 (Schlussrunde, 425dc8a7, Delta zu 615bdc0b)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | keine neuen Befunde |

Geschlossen: C-5

Geprüft: `api-contracts.pg.test.ts:1076` prüft für `PUT /documents/:id/sent` Status 404 und die Felder von `document-not-found.json`. Die Route liefert dafür `notFound()`. `documents.test.ts:82` führt `markSent` mit diesem Vertrag aus und erwartet den Satz aus `backend_DOCUMENT_NOT_FOUND`. Die BFF-Aktion bildet jeden Code allgemein über `backendMessage` ab, deshalb kann dieser Test ohne BFF-Änderung nicht rot werden. Die Commit-Nachricht sagt, dass er bestehendes Verhalten festhält. Das sichtbare neue Verhalten zeigt der Vertragstest, und der war rot. Die Commit-Nachricht nennt jetzt auch die Änderung an `PUT /sent`.

## Nicht bestätigt

- `bun test src/__tests__/api-contracts.pg.test.ts -t "Ablehnungen mit Code"` (8) und dass der neue PUT-/sent-Vertragstest mit zurückgesetzter Route rot war: vom Aufrufer gemeldet. Selbst nicht wiederholt, weil dafür PostgreSQL nötig ist und Datenbanken geschrieben werden.
- `bun run check` und `bun run lint` auf 425dc8a7: vom Aufrufer gemeldet.
- Selbst wiederholt: `bunx vitest run src/__tests__/documents.test.ts`, 8 bestanden.
- Den Merge von origin/main (56d96f76) und Helgas Bericht aus Runde 2 (03521318) habe ich wie vorgegeben nicht geprüft.
