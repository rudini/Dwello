# Review #711, Runde 2 (Delta 0dd54537..2d14c25e)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Im Delta gibt es keine offenen und keine neuen Befunde |

Geschlossen: C-1

Geprüft: `endedSince` (`src/lib/contract-status.ts:94-96`) ist jetzt `formatDate(dayAfter(endDate))`. `followedOn` (`src/lib/apartment.ts:144-145`) vergleicht `dayAfter(currentContractEnd)` mit `nextContractStart.slice(0, 10)`. ContractForm.svelte:285 nimmt `endedSince(contract.endDate)`, und der Import von `formatDate` ist entfernt, weil er nicht mehr gebraucht wird. `dayAfter` im Link in Zeile 297 bleibt im Gebrauch. Das Verhalten ist für Datumswerte YYYY-MM-DD gleich geblieben (`tests/contracts/contract.json:7`, `apartments.json:12`). `endedSince` schneidet jetzt zusätzlich einen Zeitstempel ab, den es vorher nicht verarbeiten konnte. Kein Aufrufer übergibt einen solchen Zeitstempel. Abgedeckt ist das durch `contract-status.test.ts:58-61` (Schaltjahr, Jahreswechsel), `apartment.test.ts:224-236` (Nachmieter am Tag danach) und `contract-edit.dom.test.ts`. `grep` nach `getUTCDate() + 1`, `getDate() + 1`, `86_400_000`, `86400000` und `Date.UTC(… + 1)` in `src` findet ausserhalb der Tests nur `dayAfter` selbst und `CostTable.svelte:92`, das die Tage zwischen zwei Daten zählt. `backend/src/services/prorating.service.ts:269` geht in einer Schleife Tag für Tag im Backend weiter. Das Backend kann den Frontend-Helper nicht importieren, und Issue #711 nennt nur Stellen im Frontend. Die Stelle liegt also ausserhalb des Umfangs. Der Commit-Text von 2d14c25e stimmt mit dem Diff überein. ponytail-review: nichts.

## Nicht bestätigt

- `bunx vitest run --changed origin/main` (42 Dateien, 1216 Tests), `bun run lint`, `bun run check` und die Prettier-Zählung: vom Aufrufer gemeldet. Selbst erneut ausgeführt: `bunx vitest run src/__tests__/contract-status.test.ts src/__tests__/apartment.test.ts src/__tests__/contract-edit.dom.test.ts`, 121 Tests grün.
