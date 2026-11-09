# Code-Review 1395-7 (Re-Review Runde 2, P2-Refactor, Delta 43e815c8..465aaa13)

| ID | Schwere | Datei:Zeile | Befund |
| --- | --- | --- | --- |
| – | – | – | Keine offenen und keine neuen Befunde. |

Geschlossen: C-1

Geprüft: `keyFor` (fuel-stock.service.ts:82-84) liest jetzt auch `updatedAt` des Schlüssels. `perPeriod().valuesChangedAt` (statement-invoices.service.ts:103-110) baut die Map aus den Rechnungen der Periode und aus `await change(s)`. Beide Ladevorgänge sind über `once` je Gebäude und Periode gespeichert, es kommt also keine neue Abfrage dazu. Der Kommentar nennt keine Ausnahme mehr und beschreibt den Code richtig. Der neue pg-Test folgt der Reproduktion aus 1395-6: Die einzige Lieferung stammt aus dem Jahr 2024 und hat den Schlüssel K, die Rechnungen der Periode 2025 enthalten K nicht. Vor dem Fix fehlte K deshalb in der Map, `lastValueChange` gab 0 zurück, und der Entwurf fehlte in `/statements/outdated`. `found` war dann `undefined`, und `toMatchObject` schlägt bei `undefined` fehl. Der Test war damit ohne den Fix rot. Die Assertion `invoices: 0, fuelStock: false` prüft zusätzlich, dass nur die Werte als geändert gelten.

Vertrag: Das zusätzliche `updatedAt` im `distributionKey` der Veränderung Tankbestand erreicht keine API-Antwort, die ein Vertrag in `tests/contracts/` festhält. `fuelStockChange` wird nur in Services aufgerufen: calculation, cost-reconciliation, invoice-completeness, agreed-category, held-invoices, statement-generation und statement-invoices. Diese Services geben nach aussen nur `distributionKeyId`, `distributionKeyName`, `stock` oder Summen weiter. Die Route `GET …/invoices/for-statement` (routes/invoices.ts:205) gibt nur `getInvoicesForStatement` zurück, und dort ist `updatedAt` schon im vorherigen Slice dazugekommen. Ein Vertrag muss nicht angepasst werden.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: backend type-check, svelte-check, lint, `bun run fitness -- --base origin/main --structure` (0 Fehler), p2-Benchmark `/api/v1/statements/outdated` 21 (Ratchet 21), pg-Tests statement-outdated-values (20), api-contracts, statement-invoices, statement-key-failure, fuel-stock*, heating-distribution, cost-reconciliation, invoice-retention (290 grün), `vitest --changed origin/main` (1529 grün), Prettier auf den geänderten Zeilen.
- Der rote Lauf des neuen Tests vor dem Fix ist nur durch Lesen beurteilt (siehe oben), nicht ausgeführt.
- Der neue Test nimmt den ersten Heizprofil-Datensatz aus der Datenbank (`heatingProfiles.limit(1)`). Dass die Testdatenbank einen enthält, habe ich nicht geprüft. statement-run.pg.test.ts:298 setzt das genauso voraus.
