# Review 8 (Abschlussrunde CI-Fix) – PR #530 (#451), af45a067..e0f513b5

Worktree: `review-451-code3` auf e0f513b5 (detached, nur gelesen).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde (ab C-21 nichts vergeben). |

## Geprüft

- Delta: eine Zeile, `backend/src/__tests__/heating-profile.service.test.ts:138`. Die Erwartung `{ month: 2, percentage: 0.58, full: 2.3, days: 7, total: 28 }` ist genau das, was `calculateHeatingShare` in `backend/src/services/heating-profile.service.ts:372` für einen angebrochenen Monat liefert (`daysInPeriod < daysInMonth`: `full: monthPct`, `days: daysInPeriod`, `total: daysInMonth`). 22.–28.02.2025 ergibt 7 von 28 Tagen. Das passt zum Typ `MonthShare` (`backend/src/db/schema.ts:377`) und zum PDF-Text «Feb 0.58 % (2.30 % × 7/28 Tage)».
- Rundung (#232) bleibt gleich: Die Zeilen 367–369 (`roundToRappen` für den Monatsanteil und die Summe) sind gegenüber dem Merge-Base mit `origin/main` unverändert. Der Diff am Service betrifft nur den `push` in Zeile 372. `percentage: 0.58` (2.3 × 7/28 = 0.575, kaufmännisch aufgerundet) wird weiter geprüft.
- Rot: `toEqual` lässt zusätzliche definierte Felder nicht zu. Darum schlug die alte Erwartung `{ month: 2, percentage: 0.58 }` auf dem Code von #451 fehl (das war der CI-Fehler). Die neue Erwartung schlägt ohne #451 fehl, weil dann `full`/`days`/`total` fehlen.
- Nichts Fremdes im Delta.

## Nicht bestätigt

- `bun run lint`: vom Aufrufer gemeldet.
- `cd backend && bun run test` (1107 pass, 0 fail): vom Aufrufer gemeldet. Die betroffene Datei habe ich selbst neu laufen lassen: `bun test src/__tests__/heating-profile.service.test.ts` mit 40 pass, 0 fail.
