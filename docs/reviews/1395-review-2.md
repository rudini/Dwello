# Code-Review 1395, Runde 2 (Schlussrunde vor dem Push)

Bereich: `git diff 809f7a90 19903a9d` (ohne Berichte, Plan, Archiv, Personas) und Merge `de9695b0`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | keine Befunde |

Geschlossen: C-1, C-2, C-3

Geprüft: Der neue DOM-Test (`statement-pages.dom.test.ts:1114`) prüft den Zweig `statements_later_sent_declined` mit dem Wortlaut der versendeten Abrechnung. Mit `changed` statt `changedSent` in `LaterChanges.svelte:102` stünde dort «dass «Neu berechnen» …», der Test wäre also rot. Der neue Szenariotitel (`statement-detail.feature:1314`) sagt, was die Schritte prüfen (Hinweis auf den Unterschied, dann die Frage vor «Nicht berichtigen»), und das Szenario steht nicht auf `main` (kein Treffer in `5247683f`). Der Kommentar in `src/lib/server/statement.ts:215` stimmt jetzt auch für versendete Abrechnungen. Die Commit-Nachricht von `19903a9d` nennt bei C-2 das Festhalten von bestehendem Verhalten. `git show --remerge-diff de9695b0` ist leer.

## Nicht bestätigt

- statement-pages.dom.test.ts (281 passed), statement-outdated-values.pg.test.ts (17 pass) und E2E chromium des umbenannten Szenarios auf 19903a9d: vom Aufrufer gemeldet.
- Auf dem Merge lint, check, fitness (+ --structure), type-check und die betroffenen Tests: laut Aufrufer erst vor dem Push geplant, hier nicht gelaufen.
- Rotlauf des DOM-Tests (C-1) und der pg-Tests ohne `&& !!check?.changes` (C-2): nur durch Lesen beurteilt, nicht ausgeführt.
