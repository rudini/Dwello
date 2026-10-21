# Review #583, Runde 2 (02283af..7c2ee61)

## Status der offenen IDs aus Runde 1

| ID | Schwere | Status |
|----|---------|--------|
| C-1 | Minor | Behoben: `tests/contracts/categories.json` hält die Listenantwort von `GET /categories` (`{ categories: [...], total }`), `api-contracts.pg.test.ts:261-264` prüft sie mit `drift` gegen `GET /api/v1/categories?limit=1000` (gleiche Abfrage wie `invoiceChoices`, `src/lib/server/invoice.ts:45`), und `src/__tests__/invoices.test.ts:248` baut die 150 Kategorien aus `categoryList.categories[0]`. |

## Neue Befunde im Delta

Keine.

Geprüft: `drift` prüft nur die Felder des Contracts auf Vorhandensein und JSON-Typ (Z. 30-44), das Element von `categories.json` ist eine Teilmenge der Spalten von `listCategories` (`category.service.ts:48-64`) und deckt die Felder, die `localCategory` liest; die Testdatenbank enthält Kategorien (Seed `Heating`), das Array ist also nicht leer; der Commit ändert nur Testdateien, kein Diff ausserhalb der Anforderung.

## Nicht bestätigt

- `bunx vitest run src/__tests__/invoices.test.ts` (30 passed), `cd backend && bun test src/__tests__/api-contracts.pg.test.ts` (57 passed), `bun run lint`, `bun run check`, Backend-Type-Check: vom Aufrufer gemeldet, nicht erneut ausgeführt.
