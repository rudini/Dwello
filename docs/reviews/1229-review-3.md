# Review 1229, Runde 3: Konfliktauflösung des Merge-Commits 3b3c6a7

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `git show --remerge-diff 3b3c6a7`. In `apartmentsOf` (apartment.service.ts:377–380) steht der Körper von main (#1301, `earlierSizes`) mit `limit: null` statt `limit: 1000`. `keyValuesOf` (statement.service.ts:718–721) ist die Fassung von main über `apartmentsOf` + `countingWith`. Sie lädt damit jede Wohnung. Ungenutzte Importe (`listApartments`, `countingOn`) bleiben nicht zurück. `git diff 3b3c6a7^2 3b3c6a7 -- backend/src` enthält dieselben 15 Dateien wie der Branch vor dem Merge (Merge-Basis..a6bb252). Einzige Abweichung: statement.service.ts schrumpft von 6 auf 4 geänderte Zeilen, weil der Branch-Teil von `keyValuesOf` nun von main kommt. Kein `limit: <Zahl>` mit drei oder mehr Stellen steht in backend/src/services oder routes. Main bringt in backend/src keine neuen Aufrufe von `list*`/`limit`. Der Test whole-lists.pg.test.ts:271–284 deckt die gemischte Fassung weiter ab, sowohl `apartmentsOf` als auch `keyValuesOf` (`units` = `[1, OLD_LIMIT + 3]`).

## Nicht bestätigt

- Backend type-check und pg-Tests auf 3b3c6a7: vom Aufrufer gemeldet als rot. Grund ist allein der Import von `countingOn` in cost-reconciliation.service.ts aus main 072d003 (#1334/#1335, behoben durch PR #1339). Von mir nicht ausgeführt, laut Auftrag keine Tests. Ob whole-lists.pg.test.ts nach dem Merge von #1339 grün ist, bleibt offen.
