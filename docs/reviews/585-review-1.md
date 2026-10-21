# Review #585, Runde 1 (ce9035d..264fb37)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/__tests__/category-lists.test.ts:20, :31-36 | Der Test der Gebäudeseite prüft nur die Auswahl (`heatingCategories`), nicht das Symptom, das #585 für die Gebäudeseite nennt: ein Tankbestand mit einer Kategorie nach der 100. hat keinen Namen. Der Fake antwortet auf `/fuel-stocks` mit `[]`, darum bleibt der Pfad `categoryName` (Zeile 57-63 in `+page.server.ts`) ungezeigt. Dieselbe geänderte Zeile deckt beides ab, also kein Fehler im Code; Vorschlag: `tests/contracts/fuel-stocks.json` mit `categoryId: 'c149'` zurückgeben und `fuelStocks[0].categoryName` auf `'Kategorie 149'` prüfen. |

Keine Blocker, keine Major.

## Hinweis ausserhalb des Diffs (kein Befund dieser Änderung)

Weitere Listen mit `limit=100`, die #585 nicht nennt und die daher hier nicht zu ändern sind: `distribution-keys?limit=100` in `src/lib/server/distribution-key.ts:29` (Seite «Verteilschlüssel»), `src/lib/server/invoice.ts:46` (Rechnungsformular) und `src/routes/config/+page.server.ts:14`; `heating-profiles?limit=100` in `src/routes/config/heating-profiles/+page.server.ts:7`, `src/routes/config/+page.server.ts:13`, `src/lib/server/statement-generation.ts:380`, `src/routes/statements/generate/+page.server.ts:64`. Das Backend zählt bei Verteilschlüsseln ebenfalls jeden Datensatz (`distribution-key.service.ts:36`, Default 100). Mit mehr als 100 Verteilschlüsseln fehlen dort Einträge. Nach «Open work» als eigenes Issue erfassen (vorher `search_issues`), nicht in diesem Slice. Auch die E2E-Fixtures in `tests/e2e/fixtures/backend.ts` (46, 424, 444, 569) fragen mit `limit=100`; für die gemeinsame E2E-Datenbank mit wenigen Kategorien unschädlich.

## Nicht bestätigt

- Rote Läufe der drei neuen Tests auf ce9035d, `bunx vitest run --changed origin/main` (278 bestanden), `bun run lint`, `bun run check`: vom Aufrufer gemeldet, nicht wiederholt. Durch Lesen bestätigt: Der Fake liefert `slice(0, limit)`, auf der Basis kommen also 100 von 150, und die drei Asserts (Länge 150, `c149`) schlagen dort fehl.
- `namesById(fetch, 'distribution-keys')` mit mehr als 100 Verteilschlüsseln hat keinen eigenen Test. Es ist dieselbe Zeile wie für `categories` (Parameter `list`); das Backend nimmt `limit=1000` für Verteilschlüssel an (`backend/src/routes/distribution-keys.ts:28`, `t.Optional(t.String())` plus `parseInt`, keine Obergrenze im Service). Daher nur durch Code bestätigt.

Geprüft: Diff aller fünf Dateien; Backend-Kategorien und -Verteilschlüssel akzeptieren `limit=1000` ohne Obergrenze (`categories.ts:25/56`, `category.service.ts:33/69`, `distribution-keys.ts:28`, `distribution-key.service.ts:36/70`); `api-contracts.pg.test.ts:262` prüft `categories?limit=1000` schon; die Fake-Antworten im Gebäudetest entsprechen den Verträgen (`building.json`, `categories.json`, Array wie `fuel-stocks.json`, `{ apartments: [] }` wie `apartments.json`); kein Aufrufer von `namesById` (`statement.ts:168-169`, `statement-generation.ts:190, 432`) hängt an 100; keine Unit-Test-Fakes mehr auf `categories?limit=100`; «No scenario»-Begründung im Commit; keine UI-Texte, keine Fremdänderungen.
