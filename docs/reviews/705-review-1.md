# Review Slice 705, Runde 1 (c35d25c, `git diff 75b78a9 c35d25c`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/services/statement-run.service.ts:120 | Der neue Kommentar sagt «every contract and statement, none dropped by a limit», doch auf dem Weg der Übersicht (`contract-tasks.service.ts:62`, `missingByContract(contracts)`) kommen die Mietverträge weiter aus einer Liste mit `limit: 1000`; dort fällt ein Mietvertrag über der Grenze weiterhin weg. Der Kommentar sollte den übergebenen Fall ausnehmen oder auf das angekündigte Folge-Issue verweisen. |

Keine Blocker oder Major.

Ponytail-review: Lean already. Ship. (`limit == null` deckt in `listContracts` den bisherigen `undefined`-Fall mit ab; in `listStatements` greift bei `undefined` weiter der Default 20; `$dynamic()` ist dasselbe Muster wie in `listContracts`.)

Geprüft: alle vier geänderten Dateien; der neue pg-Test schlägt ohne die Änderung fehl (Kopien mit Vertragsbeginn 2001 schieben den Mietvertrag von 2000 hinter Platz 1000 der nach `startDate desc` sortierten Liste; die kopierten Abrechnungen haben dasselbe `statementDate` und ein neueres `createdAt`, also fällt die alte Abrechnung hinter Platz 1000), räumt seine Zeilen in `finally` auf und der Rest über `afterAll`; die HTTP-Routen können kein `null` übergeben (`parseInt` oder `undefined`), das Verhalten der Listen-Endpunkte bleibt also gleich; die Antwort von `/contracts/missing-statements` ändert ihre Form nicht, kein Vertrag in `tests/contracts` nötig; keine UI-Texte, keine E2E-Dateien im Diff; Bugfix mit reproduzierendem Test auf der tiefsten Schicht (pg).

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun test .pg.test` im Backend (1464 pass, 0 fail), `bun run type-check`, `bun run lint`, `bun run check`, `bun run fitness`, testcheck audit, der neue Test zweimal rot (erst fehlender Mietvertrag, dann fehlende Abrechnung), die Timeouts ohne `ANALYZE`.
- `No scenario: <reason>` im Pull-Request-Text: noch kein Pull Request; im Commit nicht vermerkt (CLAUDE.md, «Done means», verlangt es für eine Änderung ohne Szenario).
- Das Folge-Issue für die übrigen `limit: 1000`-Aufrufe (`statement-run.service.ts:76, 77, 90, 110`, `contract-tasks.service.ts`, `move-out.ts:71, 81`, `cost-reconciliation.service.ts:106`) gibt es noch nicht; nicht in GitHub gesucht.
