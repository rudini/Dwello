# Code-Review Runde 4: #1311/#1312 (PR #1341), CI-Fix

Bereich: `git diff 5afcf97 d94d895` (Worktree `review-1311-code4`, Commit d94d895).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: Die Änderung ist genau ein `export` vor `countingOn` (`backend/src/services/prorating.service.ts:315`). Einziger externer Import ist `backend/src/services/cost-reconciliation.service.ts:15` (Verwendung `:119`). Die Funktion ist auf origin/main (072d003, dort ebenfalls nicht exportiert, d. h. main selbst bricht beim Build, wie PR #1339 bestätigt) und auf dem Branch inhaltsgleich; der Merge 5afcf97 ändert also die Semantik für cost-reconciliation nicht. Die Commit-Nachricht hält die Conventional-Commits-Form ein (`fix(services): export countingOn again`, 37 Zeichen). Neues Verhalten gibt es nicht, ein Test oder Szenario ist daher nicht nötig.

## Nicht bestätigt

- Vom Aufrufer gemeldet: Backend-Build auf d94d895 grün (ohne den Export rot), Backend-Type-Check, pg-Tests cost-reconciliation, apartment-status, apartment-discontinued und statement-pdf-render (231 bestanden), lint, check, fitness, voller vitest-Lauf (4693 bestanden). Ich habe keinen davon selbst ausgeführt (kein `node_modules`).
- Den Merge 5afcf97 selbst habe ich über `countingOn` hinaus nicht geprüft; laut Aufrufer war er konfliktfrei, und er gehört nicht zum Bereich.
- Wenn #1339 zuerst auf main gemergt wird, ist dieselbe Zeile auf beiden Seiten identisch geändert und sollte keinen Konflikt geben. Ich habe das nicht ausprobiert.
