# Code-Review Runde 6: Merge 635b367 (Konfliktauflösung), PR #1322 / #1284

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor (Entscheid beim Aufrufer) | backend/src/services/held-invoices.ts:21-25 | Die Haltprüfung von #1221 rechnet den Verteilschlüssel über **alle** Wohnungen der Liegenschaft. Die Berechnung (`lineByParts` → `partShare`/`countingOn`) rechnet ihn dagegen nur über die Wohnungen, die in der Periode bzw. im Teil zählen. Das geht in zwei Richtungen auseinander: (a) **Zu streng:** Eine Wohnung, die vor Periodenbeginn aufgehoben wurde und für die die Formel scheitert (z. B. `{area}/{rooms}` bei `rooms = 0` → `FORMULA_NOT_A_NUMBER`), hält den Lauf, obwohl die Berechnung sie gar nicht verwendet. (b) **Zu locker:** Ist der Schlüssel über alle Wohnungen gültig, über die zählenden aber nicht (z. B. `FORMULA_ALL_ZERO`, wenn nur noch Wohnungen mit dem Wert 0 zählen), wird nicht gehalten, und `calculateApartmentShare` (calculation.service.ts:262) fällt still auf gleiche Teile zurück. Genau das wollte #1221 verhindern. Abhilfe wäre, pro Teil der Periode mit `countingOn` zu prüfen (gleiche Schnitte wie `partsOf`). Ob das zu diesem PR gehört oder ein eigenes Issue wird, entscheiden Sie. Beide Fälle sind Randfälle; keiner wird durch einen Test abgedeckt. |

Geprüft: Die Konfliktauflösung ist richtig. `apartmentsOf` liefert `{ id, number, area, rooms, discontinuedFrom }` mit derselben Zuordnung, die vorher `apartmentsOfParts` hatte (parseFloat auf area/rooms). `calculation.service` bezieht seine Wohnungen jetzt aus `apartmentsOf`. `apartmentsOfParts` und der Import von `listApartments` in `calculation.service` sind ohne Reste entfernt (sonst nutzt sie niemand mehr: grep über backend/src, src, tests). `held-invoices.ts` liest nur `id/area/rooms`, die zusätzlichen Felder ändern sein Verhalten nicht. Sonst enthält der Merge keine Änderungen, die nichts mit dem Konflikt zu tun haben.

## Nicht bestätigt

- Backend type-check, lint, `bun run check`, `bun run fitness`, backend `bun run test` (2158/0), `bunx vitest run` (221 Dateien, 4656): vom Aufrufer gemeldet, selbst nicht ausgeführt.
- C-1 nur durch Lesen des Codes festgestellt (held-invoices.ts, prorating.service.ts:314-400, distribution-key.service.ts:356-368, formula.service.ts:243-375). Kein Lauf zeigt es.
