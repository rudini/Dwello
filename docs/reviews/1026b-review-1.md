# Review 1026b-1: CI-Fix Fitness Ä1 (4efcb27)

Bereich: `git diff 4efcb27^ 4efcb27` (4 Dateien).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `HeatingSum`, `sumCosts`, `sumResult`, `sumAdvice` und `heatingSumText` sind Zeichen für Zeichen gleich übernommen, nur von Prettier umbrochen (für eine neue Datei verlangt CI das); das Verhalten bleibt gleich. `statement-wizard.ts` braucht `francs` nicht mehr, der Import ist entfernt; `m` wird dort weiter genutzt. Es sind keine Importe ungenutzt, und kein Aufrufer importiert noch aus dem alten Ort (`grep` über `src` und `tests`). Es entsteht kein Importzyklus, weil `src/lib/statement.ts` weder `heating-sum` noch `statement-wizard` importiert. Das neue Modul hat ein eigenes Anliegen und eine schmale Schnittstelle (ein Typ, eine Funktion), sein Test `statement-heating-sum.test.ts` zeigt auf den neuen Ort. Nach `ponytail-review` ist der Diff nur eine Verschiebung, ohne Kopie und ohne Rest. Ein Szenario braucht es nicht, weil sich das Verhalten nicht ändert. Der Merge von `main` davor lief sauber durch.

## Nicht bestätigt

- `bun run fitness` mit Exit 0, `bun run lint` sauber, `bun run check` mit 0 Fehlern, `bunx vitest run --changed origin/main` mit 843 grünen Tests und die drei betroffenen Testdateien mit 75 grünen Tests: vom Aufrufer gemeldet. `wc -l` zählt 415 Zeilen in `src/lib/statement-wizard.ts`. Die Zählweise von Ä1 in `tools/fitness/fitness.ts` habe ich nicht nachgerechnet und verlasse mich dafür auf den gemeldeten Exit 0.
- Den Deepcheck-Hook über den geänderten Bereich habe ich nicht laufen lassen, denn der Worktree hat keine `node_modules`. Gelesen habe ich nur die Modulgrenze (siehe oben).
