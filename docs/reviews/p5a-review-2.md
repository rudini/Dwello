# Code-Review #788 Punkt 5a, Runde 2 (Delta 2a7240d0..e28a5438)

## Status der offenen IDs aus Runde 1

| ID | Schwere | Status | Beleg |
|----|---------|--------|-------|
| C-1 | Minor | behoben | `backend/src/services/contract.service.ts:302-305`: der JSDoc «Get all contracts for an apartment within a period …» steht wieder direkt über `getContractsByPeriod`; `nextSteps`/`fixedTermCheck` stehen davor. |
| C-2 | Minor | behoben | `backend/src/services/later-contract.ts` enthält die Abfrage einmal; `contract.service.ts:23` und `document.service.ts:10` importieren sie, die Kopie in `document.service.ts` ist entfernt. |

## Neue Befunde im Delta

Keine.

Geprüft: kein Zyklus (`later-contract.ts` importiert nur `drizzle-orm`, `../db/connection`, `../db/schema`; kein Service importiert es ausser den beiden); keine Verhaltensänderung (gleiche Abfrage, gleiches `gt(startDate, day)`; in `formerTenantDocuments` läuft sie jetzt nur noch, wenn weder `terminated` noch `movedOut` gilt, das Ergebnis der Bedingung ist dasselbe); keine toten Importe (`gt` wird in beiden Services nicht mehr verwendet und ist aus beiden Importen entfernt; `and`, `eq`, `rentalContracts` usw. in `document.service.ts` weiterhin verwendet); kein neuer Test nötig (reine Verschiebung, abgedeckt durch die bestehenden Tests `contract-next-steps` und `tenant-former-documents`); nichts ausserhalb der Anforderung.

## Nicht bestätigt

- Backend type-check, `contract-next-steps` und `tenant-former-documents` (17), `bun run fitness` (Zyklen 2, BFF-Entscheidungen 13), `bun run deepcheck:audit`, Commit-Hooks: vom Aufrufer gemeldet, nicht erneut ausgeführt (Backend-Tests brauchen PostgreSQL; die Abwesenheit von Zyklen und toten Importen habe ich per Lesen der Importe in `backend/src/services` bestätigt).
