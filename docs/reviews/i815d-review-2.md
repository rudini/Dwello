# Code-Review #815 Teil D, Abschlussrunde (a5aa423a..a09f54e3)

## Status der Befunde aus i815d-review-1.md

| ID | Status | Beleg |
|---|---|---|
| C-1 | behoben | src/__tests__/dashboard.test.ts: Import `config`, die Antworten auf `/config` und `/contracts?status=active&limit=100` und beide #87-Kommentare sind entfernt; `grep` findet in der Datei weder `config` noch `Zahlungsfrist` noch `contracts?status`, und der Loader liest keine dieser URLs. |
| C-2 | behoben | backend/src/__tests__/dashboard-tasks.pg.test.ts:191-196: Der Folgevertrag wird im `finally` gelöscht, so wie in Z. 73-75. Danach kann `rental.remove()` in `afterAll` (Z. 52) die Wohnung und den Mieter wieder löschen. `db`, `rentalContracts` und `eq` sind schon importiert (Z. 7-9). |
| C-3 | behoben | src/__tests__/tenant-detail.test.ts:151-156: `loadTenant` gibt `anonymisable: true` als Backend-Antwort mit. Ohne die Mapper-Zeile src/lib/server/tenant.ts:32 fehlt das Feld, und `toMatchObject` schlägt fehl. Das passt zum Rot-Lauf, den der Aufrufer meldet. |
| C-4 | offen (Minor, wie vereinbart) | unverändert |

## Neue Befunde

Keine.

Geprüft: Das Delta ändert nur die drei genannten Testdateien. Es enthält nichts, was nicht zu C-1 bis C-3 gehört, und kein Verhalten der App ändert sich.

## Nicht bestätigt

- `bunx vitest run` (3651), `bun run lint`, `bun run check`, dashboard-tasks.pg.test.ts (10 pass) und der Rot-Lauf des neuen tenant-detail-Tests: vom Aufrufer gemeldet, nicht wiederholt.
- Ob `afterAll` jetzt wirklich alle Daten in `dwello_test` wegräumt: Das habe ich nur aus dem Code geschlossen (helpers/rental.ts:33), nicht in der Datenbank nachgesehen.
