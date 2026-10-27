# Review #684, Runde 1 (fb62c5fc..d364792f)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `helpers/rental.ts:33-43` wirft bei `success: false` mit Ausnahme von «not found» (alle vier Services liefern «… not found», `contract.service.ts:571`, `tenant.service.ts:319`, `apartment.service.ts:302`, `building.service.ts:213`); die Ausnahme wird gebraucht (`api-contracts.pg.test.ts:791` löscht `rental.contract` selbst vor `remove()`); `rental-helper.pg.test.ts` wäre vor der Änderung rot (`remove()` löste ohne Fehler auf, `rejects.toThrow` scheitert) und räumt Wohnung und Liegenschaft danach selbst ab; die drei Aufräum-Änderungen löschen versendete/bezahlte Abrechnungen direkt wie `deleteStatement` (Positionen per `onDelete: 'cascade'`, `schema.ts:545`), `invoice-completeness` `.catch` lief tatsächlich nie (`deleteStatement` gibt die Ablehnung zurück, `statement.service.ts:933`); `audit-log.pg.test.ts:36` lässt den Fehler aus `remove()` durch (kein `catch`/`allSettled` in den Dateien mit `createRental`); keine ungenutzten Imports (`deleteStatement` entfernt, `inArray` neu genutzt); keine fremden Änderungen; kein UI, keine Texte, kein Vertrag betroffen; `No scenario` passt (nur Testhelfer und Aufräumen).

## Nicht bestätigt

- `cd backend && bun run type-check`: vom Aufrufer gemeldet.
- `bun test` der 52 pg-Dateien mit `createRental` (718 pass, 0 fail, kein «createRental:»-Fehler): vom Aufrufer gemeldet; nicht wiederholt, da jeder Lauf `dwello_test` neu anlegt. Damit auch nicht selbst gesehen: der rote Lauf von `rental-helper.pg.test.ts` vor der Änderung (nur durch Lesen beurteilt, s. oben) und dass Bun einen Fehler in `afterAll` als Fehlschlag mit Exit-Code ≠ 0 zählt.
- Ob ausser den drei korrigierten Dateien weitere Tests Datensätze hinterlassen, die nicht über `createRental().remove()` laufen: ausserhalb dessen, was `remove()` erkennen kann; nur über den gemeldeten Lauf abgedeckt.
- Prettier auf der neuen Datei und den geänderten Zeilen: vom Aufrufer gemeldet.
