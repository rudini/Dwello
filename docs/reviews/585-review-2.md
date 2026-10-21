# Review #585, Runde 2 (264fb37..9ee3fed)

## Status der offenen IDs aus Runde 1

| ID | Schwere | Status |
|----|---------|--------|
| C-1 | Minor | Behoben. `src/__tests__/category-lists.test.ts:21-22` antwortet auf `/fuel-stocks` mit dem Vertrag `tests/contracts/fuel-stocks.json` und `categoryId: 'c149'`; Zeile 38 prüft `fuelStocks[0].categoryName` auf `'Kategorie 149'`. Durch Lesen rot auf `limit=100`: der Fake liefert dann nur `c0`..`c99`, `find` in `fuelStockData` (`src/routes/buildings/[id]/+page.server.ts:57`) findet nichts, `categoryName` wird `''`. |

## Neue Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|

Keine. Keine Blocker, keine Major.

## Nicht bestätigt

- `bunx vitest run src/__tests__/category-lists.test.ts` (3 bestanden), der rote Lauf der Namensprüfung mit `limit=100` und `bun run lint`: vom Aufrufer gemeldet, nicht wiederholt. Der rote Lauf ist durch Lesen des Fakes und der Load-Funktion plausibel (siehe C-1).

Geprüft: Delta besteht nur aus `src/__tests__/category-lists.test.ts`; Fake-Antwort folgt dem Vertrag `fuel-stocks.json`; keine Produktionsänderung, keine UI-Texte, nichts Fremdes.
