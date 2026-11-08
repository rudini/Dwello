# Code-Review 1309-8: Merge von origin/main (ce2859dd)

Geprüfte Spanne: `ce2859dd` (Merge von `dcf3cc51` in `88cdb580`), `git show --remerge-diff ce2859dd`, `git diff 88cdb580 ce2859dd`, `git diff ce2859dd^2 ce2859dd -- backend/src/services/apartment.service.ts`.

| ID | Schwere | Datei:Zeile | Befund |
| --- | --- | --- | --- |
| – | – | – | keine Befunde |

Geprüft: Die Konfliktlösung in `backend/src/services/apartment.service.ts:377-392` übernimmt die Fassung des Branches (`keyValues`, `apartmentsByBuilding`) mit `limit: null` von main; gegenüber main ändert sie in `apartmentsOf` nur die Abbildung, die in `keyValues` gewandert ist (gleiche Felder, gleiche `parseFloat`-Umwandlung). Konfliktmarker gibt es keine mehr. In `backend/src/services` und `backend/src/routes` steht kein `limit: <Zahl>` mehr (auch keins, das der Branch neu eingeführt hat). `apartmentsByBuilding` liest ohne Limit, `perPeriod` (`statement-invoices.service.ts:60-71`) lädt es einmal pro Liste; die Aufrufer, die main auf `limit: null` umgestellt hat (`draftsToSend`, `outdatedStatements`, `invoiceStatements`), arbeiten mit der Prüfung nicht berechenbarer Schlüssel des Branches zusammen, ohne dass sie sich in die Quere kommen. Die neuen Fälle von main in `backend/src/__tests__/whole-lists.pg.test.ts` (213, 221, 271) decken genau die zusammengeführten Pfade ab: `apartmentsOf` mit über 1000 Wohnungen sowie `outdatedStatements`/`draftsToSend` mit über 1000 Abrechnungen. Was main sonst bringt (#1342 Menü/Kopfzeile, #1343 Listenfilter, #1344 Fitness-Gate, #1345, Dokumentation) berührt weder `held-invoices.ts` noch `perPeriod` noch die Verteilschlüssel.

## Nicht bestätigt

- vom Aufrufer gemeldet: lint, check, fitness, backend type-check, `bun tools/fitness/p2-benchmark.ts --queries` (outdated 21, dashboard 67), vitest vollständig (4740), backend `bun run test` (2238, mit Coverage, allein ausgeführt; bei einem Lauf parallel zu E2E gab es 11 Timeouts bei 5 s in statement-carry-over und im Dashboard-Contract, diese Datei allein: 60 pass), E2E chromium statement-detail.feature und statement-generate.feature (257 pass). Ich habe selbst keinen dieser Läufe ausgeführt. Dass die Timeouts nur von der Last kommen und nicht von der Merge-Änderung, habe ich nicht geprüft; die einzige Codeänderung des Merge in diesem Pfad ist das wegfallende Limit von main.
