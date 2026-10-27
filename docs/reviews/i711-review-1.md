# Review #711, Runde 1 (0dd54537)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | src/lib/contract-status.ts:93-97, src/lib/apartment.ts:143-145, src/lib/swiss-date.ts:27 | Nach dem Diff gibt es weiterhin mehrere eigene Rechnungen für den Tag danach, darunter mit `endedSince` einen zweiten exportierten Helper; «ein exportierter Helper» (#711) gilt damit nicht |

## C-1 (Major): der Tag danach wird weiterhin an mehreren Stellen berechnet

Der Aufrufer stützt sich auf ein repo-weites grep nach `86_400_000`. Dieses findet die Form `setUTCDate(getUTCDate() + 1)` nicht. Auf 0dd54537 rechnen zwei weitere Stellen im Frontend selbst den Tag nach einem Datum aus:

- `src/lib/contract-status.ts:93-97`: `export function endedSince(endDate)` setzt `day.setUTCDate(day.getUTCDate() + 1)` und gibt `formatDate(...)` zurück. Das ist genau der formatierte Tag danach, den ContractForm vorher lokal als `dayAfter` hatte. Der Helper ist schon exportiert, wird in `apartment.ts:160`, `PastEndConfirm.svelte:60` und `BuildingFigures.svelte:56` benutzt und ist in `contract-status.test.ts:58-61` getestet (Schaltjahr, Jahreswechsel). ContractForm importiert bereits aus `$lib/contract-status`.
- `src/lib/apartment.ts:143-145` (`followedOn`): `next.setUTCDate(next.getUTCDate() + 1)` auf `currentContractEnd.slice(0, 10)`. Das ist dieselbe Rechnung wie `dayAfter`, auch das Abschneiden eines Zeitstempels ist gleich.

Warum das falsch ist: Das Issue will die Rechnung für den Tag danach an einer Stelle haben («Extract one exported helper for the day after a date»). Der Diff fügt mit `dayAfter` einen neuen exportierten Helper neben dem bestehenden exportierten `endedSince` hinzu, das dasselbe berechnet. Danach gibt es zwei exportierte Helper und eine weitere Kopie inline. In ContractForm.svelte:285 bedeutet `formatDate(dayAfter(contract.endDate))` dasselbe wie `endedSince(contract.endDate)`, denn `endDate` ist laut `tests/contracts/contract.json:7` ein Datum im Format YYYY-MM-DD.

So lässt es sich zeigen: `grep -rn "getUTCDate() + 1" src/lib` auf 0dd54537 findet `contract-status.ts:95` und `apartment.ts:145`.

Behebung, ohne dass sich das Verhalten ändert:
- `endedSince = (endDate: string) => formatDate(dayAfter(endDate))`
- in `followedOn`: `dayAfter(currentContractEnd) === nextContractStart.slice(0, 10)`

Beide sind schon getestet (`contract-status.test.ts:58-61`, `apartment.test.ts:218`). Der Commit-Text, «The day after a date was computed inline in ContractForm.svelte and in calendarName», ist dann ebenfalls richtig zu stellen.

ponytail-review: `ContractForm.svelte:285: reuse: formatDate(dayAfter(…)) ist endedSince aus src/lib/contract-status.ts. Dieses nehmen oder auf dayAfter umstellen.` Das ist Teil von C-1 und kein eigener Befund. net: -4 lines possible (endedSince und followedOn je zwei Zeilen).

Geprüft: `dayAfter` liefert in UTC das richtige Ergebnis (Date-only-Parse ist UTC, Sommerzeit spielt keine Rolle, ein Zeitstempel wird abgeschnitten). Ungültige Eingaben werfen wie zuvor in ContractForm. `calendarName` bekommt nur Teilzeiträume vom Backend. Beide Aufrufe in ContractForm (Hilfetext formatiert, Link mit ISO-Datum) sind gleich geblieben und durch `contract-edit.dom.test.ts:395-450` abgedeckt. `calendarName` ist durch `statement-wizard.dom.test.ts` (Halbjahr) abgedeckt. Der neue Test «Tag danach» schlägt ohne den Export fehl. Die dritte Stelle aus dem Issue (`addDays` in `contract-availability.ts`) gibt es auf origin/main tatsächlich nicht mehr. Keine UI-Texte, keine E2E-Dateien, keine API-Verträge berührt. «No scenario» ist für eine reine Umstrukturierung begründet.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run --changed origin/main` (19 Dateien) und der Prettier-Vergleich je Datei: vom Aufrufer gemeldet. Selbst erneut ausgeführt: `bunx vitest run src/__tests__/swiss-date.test.ts src/__tests__/contract-edit.dom.test.ts src/__tests__/statement-wizard.dom.test.ts`, 181 Tests grün.
- Dass die neuen Tests «Tag danach» rot waren: vom Aufrufer gemeldet. Beim Lesen bestätigt, dass sie ohne den Export an `dayAfter is not a function` scheitern.
- Den Text von Issue #711 habe ich über die REST-API gelesen (`gh api repos/rudini/Dwello/issues/711`). Den Kommentarverlauf des Issues habe ich nicht gelesen.
