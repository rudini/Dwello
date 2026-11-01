# Review #710, Runde 2 (Delta c9906f00a..c48f3c08a, Abschlussrunde vor dem Push)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-5 | Minor | `.claude/hooks/fallow-gate.sh:30-33`, `.claude/hooks/testcheck-gate.sh:27-30` | Die neue Meldung bei einem Fehler von `git-calls.mjs` hat nur im Deepcheck-Gate einen Test (`tools/deepcheck/test/hook.test.ts:51-57`). In `tools/claude-hooks/fallow-gate.test.ts` und `tools/testcheck/test/hook.test.ts` fehlt der Fall mit einem defekten Matcher bzw. ohne `node` (Fallow-Gate). Bei diesen beiden Gates stehen die geänderten Zeilen also ohne eigenen Test. |

Geschlossen: C-1, C-2, C-3, C-4

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bunx vitest run tools/claude-hooks tools/deepcheck/test/hook.test.ts tools/deepcheck/test/readme.test.ts tools/testcheck/test` (153 grün, neue Fälle zuvor rot), `bun run lint`, Prettier.
- Ob die Tests ohne die Änderung rot sind, habe ich durch Lesen beurteilt, nicht ausgeführt:
  - Die drei Fälle mit Schlüsselwörtern in `commit-msg-gate.test.ts:58-61` und `if git push` in `main-push-guard.test.ts:78-79` sind auf c9906f00a rot: Dort bricht `callOf` beim ersten Wort ab, das kein Präfix ist.
  - Der Crash-Test in `hook.test.ts:51-57` scheitert auf der Basis: `|| true` liefert stderr `''`.
  - Der `cd`-Fall in `commit-msg-gate.test.ts:77` ist mit dem Basis-Hook rot, weil die Nachricht `a` geprüft wird.

Geprüft: Präfix-Regex in `git-calls.mjs:66`. Sie bringt keine Fehltreffer (`if [`, `while read`, `then echo git commit` brechen weiter ab), und der Tokenizer liefert `!` und `{` als eigene Wörter. Weiter geprüft: `if ! VAR="$(…)"` unter `set -euo pipefail` in allen drei Gates (fehlendes `node` im Fallow-Gate führt jetzt zur Meldung) sowie die Texte zu C-3 in `tools/deepcheck/README.md:71` und `commit-gates/SKILL.md:8`.
