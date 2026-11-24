# Code-Review 1470, Runde 4 (Abschlussrunde CI-Fix, 52021b5..2b7c227)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| –  | –       | –           | Keine Befunde |

Geprüft: `periodReadings` (backend/src/services/fuel-stock.service.ts:51-67) liefert dieselben Ablesungen wie `listFuelStocks` (gleicher Filter, gleiche Sortierung `asc(readingDate)`); der Inner Join verliert keine Zeile, da `fuel_stocks.building_id` per Fremdschlüssel auf `buildings` zeigt; `rows[0]` wird erst nach dem Leer-Check gelesen (ohne Ablesungen weiterhin `null`); `noTank && !covered` unverändert; `listFuelStocks` bleibt in Gebrauch (Zeile 153, routes/buildings.ts), keine ungenutzten Importe. Verhaltensneutral, daher kein neuer Test nötig; die noTank-Pfade decken bestehende pg-Tests ab (invoice-completeness, Zeilen 177-225).

## Nicht bestätigt

- Backend type-check grün auf 2b7c227 – vom Aufrufer gemeldet.
- pg-Tests fuel-stock, invoice-completeness, heating-distribution (98 pass) – vom Aufrufer gemeldet.
- `bun run fitness:p2` Exit 0 (Query-Zahl von `/api/v1/statements/outdated` wieder unter Ratchet 21) – vom Aufrufer gemeldet; die tatsächliche Query-Zahl habe ich nicht gemessen.
