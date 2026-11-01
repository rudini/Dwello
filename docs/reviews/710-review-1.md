# Review #710, Runde 1 (c9906f00a gegen origin/main 7f1330106)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | `.claude/hooks/git-calls.mjs:231-238` | Shell-Schlüsselwörter und Wrapper vor `git` (`if`, `then`, `do`, `else`, `!`, `{`, `xargs`, `nice`) beenden die Suche: `if git commit -m "bad"; then …`, `{ git commit -m bad; }` und `! git push` werden von allen drei Gates nicht mehr erkannt. Auf der Basis wurden sie erkannt. Das ist eine Regression, und kein Test deckt sie ab. |
| C-2 | Minor | `.claude/hooks/fallow-gate.sh:30`, `deepcheck-gate.sh:28`, `testcheck-gate.sh:27` | `node … git-calls.mjs 2>/dev/null \|\| true`: Wirft der Matcher einen Fehler, oder fehlt im Fallow-Gate `node`, lassen die Gates den Befehl stumm durch. Das widerspricht den Kopfkommentaren («fail open with a single stderr notice», `deepcheck-gate.sh:6-7`, `testcheck-gate.sh:6`, `fallow-gate.sh:8`). Das Fallow-Gate prüft `node` nicht wie die beiden anderen Gates. |
| C-3 | Minor | `.claude/hooks/deepcheck-gate.sh:33`, `testcheck-gate.sh:32`, `fallow-gate.sh` (Audit im cwd); `tools/deepcheck/README.md:71` | Die Shell-Gates erkennen jetzt `git -C <dir> commit`, beurteilen aber weiter `$CLAUDE_PROJECT_DIR` bzw. das cwd, nicht `<dir>`. Ein Commit per `-C` in einem Scratch-Repository lief auf der Basis durch. Jetzt blockieren ihn Befunde im Projektbaum, während `commit-msg-gate.mjs` denselben Commit ausdrücklich durchlässt. Ein `-C <worktree>`-Commit wird am falschen Baum gemessen. README und SKILL sagen das nicht. |
| C-4 | Minor | `.claude/hooks/commit-msg-gate.mjs:7-9`, `.claude/skills/commit-gates/SKILL.md:30` | Neues Verhalten: Ein `cd <Scratch-Repository> && git commit …` geht jetzt durch (auf der Basis wurde ein `cd` nicht verfolgt und der Commit geprüft). Dazu fehlt ein Test. `tools/claude-hooks/commit-msg-gate.test.ts:68-72` deckt nur cwd und `git -C` ab. |

## C-1 (Major): Schlüsselwörter vor `git` verstecken den Aufruf

`callOf` läuft von links bis zum Wort `git`. Jedes Wort, das weder in `prefix` (`env|command|exec|nohup|time|sudo`) steht noch eine Zuweisung oder Option ist, lässt die Funktion mit `return` abbrechen (Zeile 237). `if`, `then`, `do`, `else`, `elif`, `while`, `until`, `!` und `{` sind aber Teil derselben Shell-Zeile und führen `git` aus. Auf der Basis matchten alle drei Gates per Text (`(^|[[:space:];|&()])git[[:space:]]+(commit|push)` bzw. die gleichwertige Regex in `commit-msg-gate.mjs`), also auch diese Formen. Gegenprobe mit dem Modul aus dem Worktree (`gitCalls(cmd, '/tmp')`):

- `if git commit -m "bad"; then echo ok; fi` ergibt `[]`
- `{ git commit -m bad; }` ergibt `[]`
- `! git push` ergibt `[]`
- `xargs git commit -m x` und `nice git push` ergeben `[]`

Folgen: `commit-msg-gate.mjs` blockiert `if git commit -m "bad"; then …` nicht mehr (auf der Basis tat es das). Fallow, deepcheck und testcheck laufen bei diesen Formen nicht. CI fängt das zwar später auf, doch der Zweck der lokalen Gates (Workflow, Gotchas «Commit gates») geht verloren. Gerade diese Änderung soll den Abgleich vollständiger machen. Der Kopf von `git-calls.mjs` (Zeilen 157-161) nennt die Lücke nicht unter «Not followed». Im `main-push-guard.mjs` bestand die Lücke schon vorher (`withoutPrefixes`). Neu ist sie für die drei Gates aus #710.

Beheben: die reservierten Wörter (mindestens `if|then|elif|else|do|while|until|!|{`) als Präfix überspringen, und dazu ein Testfall pro Gate, z. B. `['if git commit -m "fix: guard retries"; then :; fi', 'type(scope)']` in `commit-msg-gate.test.ts`. Auf c9906f00a ist er rot.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bunx vitest run tools/claude-hooks tools/deepcheck/test/hook.test.ts tools/deepcheck/test/readme.test.ts tools/testcheck/test` (148 grün; 10 neue Fälle zuvor rot), `bun run lint`, Prettier, Commit durch die neuen Gates.
- Rot ohne die Änderung habe ich durch Lesen beurteilt: Die neuen Fälle mit `-c`, `-C/x` und `-C "…"` sowie die Heredoc-Fälle in allen vier Testdateien scheitern an den Basis-Regexen. Das ist plausibel, aber nicht ausgeführt.
- Ob die gemeldeten 44 Fälle von `main-push-guard.test.ts` unverändert grün sind, habe ich nicht ausgeführt. Durch Lesen gleichwertig: `timeout`-Überspringen, GIT_-Variablen, `(`/`)`, `cd`/`pushd` und `-C`/`--git-dir`.

Geprüft: Nachrichtenextraktion in `commit-msg-gate.mjs` per Modulprobe: `-m "$(cat <<'EOF' …)"` mit `"` im Body, `-F -` mit Heredoc, `2>&1` vor dem Heredoc, mehrere `-m`, unquotierter Heredoc. Weiter: Platzhalter `\0n\0`, Tokenizer-Regel `>&`/`&>`, `case`-Vorfilter und `grep -qxE` unter `set -euo pipefail`, Doku in `commit-gates/SKILL.md` und `tools/deepcheck/README.md` (bis auf C-3), keine ungenutzten Reste (`resolve`-Importe entfernt, `options`/`env`/`stdin` haben Aufrufer).
