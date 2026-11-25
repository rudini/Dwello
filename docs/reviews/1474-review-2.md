# Code-Review 1474, Runde 2 (Abschlussrunde CI-Fix, 67e360c..2492c8b)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: Regel gleichwertig. Vorher galt die Menge der `isFuel`-Kategorien, wenn das Gebäude `noTank = false` hat. Jetzt gilt pro Zeile `coalesce(categories.is_fuel and not buildings.no_tank, false)` (`invoice.service.ts:62`). Die Abfrage ist auf `invoices.building_id = buildingId` beschränkt, also ist es dasselbe Gebäude. Ohne Kategorie (Left Join, `null`) ergibt der Ausdruck `false`, wie vorher `has('')`. Die Bedingung `!!servicePeriodStart` bleibt, ebenso der Zweig mit `tank`. `fuel` erreicht keine Antwort: `listInvoices` (Z. 168-177), `getInvoice` (Z. 210-218) und `getInvoicesForStatement` (Z. 595-605) übernehmen nur `row.invoice` und benannte Felder, deshalb ist kein Vertrag in `tests/contracts` betroffen. `untrackedFuelCategories` ist ohne Rest entfernt; die Imports in `fuel-stock.service.ts` werden weiter gebraucht. Die zwei Guard-Tests decken `&& fuel` ab (gemeldetes Rot). Ponytail: das kürzeste Diff, keine Kopie, kein ungenutzter Code. Zeitüberschreitung in `statement-carry-over.pg.test.ts:491ff.`: Das Diff entfernt pro Periode ohne Tankbestand eine Abfrage und fügt nur einen Spaltenausdruck ohne Join hinzu. Es kann den Test nicht verlangsamen; die Zeitüberschreitung kommt von der Last des Gesamtlaufs.

## Nicht bestätigt

- P2-Benchmark `/api/v1/statements/outdated` 21 von 21: vom Aufrufer gemeldet.
- `fuel-stock.pg.test.ts` 56 pass, Rot der zwei Guard-Tests ohne `&& fuel`: vom Aufrufer gemeldet.
- Backend type-check, Root-Lint, Fitness 0 Fehler: vom Aufrufer gemeldet.
- Backend `bun run test` 2436 pass / 1 Zeitüberschreitung, einzeln und als Datei grün: vom Aufrufer gemeldet. Den Schluss «nicht vom Diff verursacht» stütze ich nur durch Lesen des Diffs.
