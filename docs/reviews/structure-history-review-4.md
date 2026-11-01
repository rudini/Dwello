# Code-Review: Struktur-Bericht mit Verlauf (PR #1042), Abschlussrunde 2

Delta: `65c8851bd..020a5bf48` (ohne `docs/reviews`, `implementation_plan.md`, `docs/archive`), Worktree `/tmp/w1-s101/review-structure-history-cr4`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: Der Merge `65c8851bd` bringt gegenüber dem ersten Elternteil nur `.github/workflows/fallback-review.yml` und `docs/archive/implementation-plan-verlauf.md` (keine Konfliktauflösung in App-Code). `moved()` (`tools/arch-baseline/structure.ts:234-245`) nimmt «D now» jetzt aus den analysierten Modulen. Module ohne Snapshot fallen über `from = to` weg (kein `!` mehr auf `find`). Snapshot-D und Analyse-D sind beide mit `round` (Z. 60, 91, 188) gerundet, ein `!==` ergibt also keine Scheinzeilen. Fixture: `be:services/a` hat in der Analyse d = 0.25 (`structure.test.ts:76`), `be:routes/a` hat d = 0 und ist unverändert, fällt also weg. Das erwartete `['be:services/a', '0.8', '0.25']` ist damit richtig. Der neue Test (`structure.test.ts:259-266`) wäre mit dem alten Code rot gewesen: Er hätte «D now» = 0.6 aus dem neuesten Snapshot genommen. Die beiden geänderten Tests prüfen weiterhin die Reihenfolge nach Zeit (der erste Stand = 0.8). Der JSDoc-Kommentar (Z. 233) stimmt mit dem Verhalten überein. Kein Code bleibt ungenutzt.

## Nicht bestätigt

- `bunx vitest run tools/arch-baseline` (33 bestanden, neuer Test zuerst rot), eslint, prettier, testcheck-/deepcheck-Audits: vom Aufrufer gemeldet.
