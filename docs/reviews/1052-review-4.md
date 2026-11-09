# Code-Review #1052 Teil 3 (statement.service.ts), Runde 1

Bereich: `git diff 4d9850f9 199bb81e` (fcfdbfa4, 199bb81e), Worktree `review-1052d-cr`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | backend/src/services/move-out.ts:53 | Der Kommentar «not listStatements: … a new user of statement.service would put it against the stability …» nennt `statement.service` als Modul von `listStatements`. Seit fcfdbfa4 liegt `listStatements` in `statement-query.service.ts`, also stimmt der Kommentar nicht mehr. Die Zeile steht nicht im Diff, falsch wird sie erst durch ihn. |

Keine Blocker, keine Major.

Geprüft: Der verschobene Code ist unverändert. Ein Skript hat jeden Top-Level-Block von `git show 4d9850f9:backend/src/services/statement.service.ts` gesucht, ohne Imports, `export` und Whitespace. Alle 116 Blöcke stehen in den vier Dateien, und dort gibt es nichts Neues ausser den drei Kopfkommentaren. Neu exportiert sind nur `refuseOpenAgreements` und `refuseUncategorized`, beide werden in `statement-generation.service.ts` gebraucht. Die Imports bilden keinen Zyklus (query ← generation ← lifecycle, refusals ← beide). `statement-query.service.ts` hat 399 nicht-leere Zeilen und bleibt damit unter der Grenze 400. `heatingProfileExists` ist unverändert in `config.service.ts` verschoben und hat ausser dem Validator keinen weiteren Aufrufer. `categoriesOf` in `statement-run.service.ts` ist nur strukturell typisiert. In Tests und `demo-data` ändern sich nur Imports, und es gibt kein `mock.module` oder `spyOn` auf Statement-Module. Die dynamischen Importe (`p2-benchmark.ts`, `tests/ui-screenshots`) zeigen auf die richtigen Dateien. In `ratchet.json` fallen die Einträge `statement.service.ts` und `be:services/statement` weg, und `routes/statements.ts` geht von 504 auf 500 (die zusammengefassten Imports). Ein Szenario, `messages/*.json`, Verträge und a11y-Einträge braucht es nicht, weil das Verhalten gleich bleibt.

## Nicht bestätigt

- Vom Aufrufer gemeldet, von mir nicht ausgeführt: Backend-Type-Check, die ganze Backend-Suite (2263 grün, 146 Dateien, Coverage 97.4 % Zeilen), `bun run lint`, `bun run check`, fitness mit 0 Fehlern, Commit-Hooks (fallow, deepcheck, fitness). Lokal nicht gelaufen ist `p2-benchmark`, das übernimmt CI.
- Das Done-Kriterium «XS on main ≤ 10 %» braucht die Messung auf `main` nach dem Merge. Der Diff zeigt sie nicht, und im Worktree gibt es keine Messung.
- Die Gate-Freigabe: `tools/fitness/p2-benchmark.ts` und `tools/fitness/ratchet.json` sind Gate-Dateien (`tools/`). Das `--update` von `ratchet.json` schreibt #1052 vor. Für die Importzeile in `p2-benchmark.ts` steht die Freigabe nach Angabe des Aufrufers noch aus. Ohne `Gate change approved: #<n>` im Text des Pull Requests wird CI rot.
