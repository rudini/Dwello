# Review #710, Runde 3 (Delta 5d15f9ce2..ffa19b2f3, Abschlussrunde vor dem Push auf #1017)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-5 | Minor | `.claude/hooks/fallow-gate.sh:30-33`, `.claude/hooks/testcheck-gate.sh:27-30` | Noch offen aus Runde 2, das Delta berührt die Stelle nicht: Die Meldung bei einem Fehler des Matchers hat nur im Deepcheck-Gate einen Test. |
| C-6 | Minor | `.claude/hooks/git-calls.mjs:54-59`, `:131` | Regression: Bei `&>` gilt das `&` als Operator, weil die Prüfung nur auf `<`/`>` **vor** dem `&` schaut. So bekommt `cd /x &>/dev/null && git …` und `pushd /x &> /dev/null; git …` den Wert `next = '&'` und gilt als `cd` im Hintergrund. Die Änderung wird ignoriert, der Aufruf läuft mit `dir` = cwd (nachgeprüft mit `gitCalls(…, '/proj')`: `dir` ist `/proj`). Auf der Basis hat der `cd` gewirkt. Ist die cwd ausserhalb des Projekts, lässt `commit-msg-gate` einen Commit nach `cd <Dwello> &>/dev/null &&` ungeprüft durch, und `main-push-guard` fragt im falschen Verzeichnis nach dem Push-Ziel. Abhilfe: `&` gefolgt von `>` wie `>&` als Teil des Worts behandeln. Ein Testfall dafür fehlt. |
| C-7 | Minor | `.claude/hooks/git-calls.mjs:59-60` | `after` wird von jedem weiteren Trenner vor dem nächsten Wort überschrieben. Bei `false \|\|⏎cd /x⏎git …` steht das `\|\|` nicht mehr da, sondern der Zeilenumbruch. Der `cd` gilt dann als sicher ausgeführt (nachgeprüft: `dir` ist `/x`), entgegen der Regel «nach `\|\|` unbekannt». Bei `echo a \|& cd /x; git …` wird aus dem `\|` ein `&`, und der `cd` in der Pipe verschiebt das Verzeichnis (nachgeprüft: `dir` ist `/x`). Abhilfe: Das `after` eines leeren Befehls nur setzen, solange es noch fehlt, oder das stärkere Zeichen behalten. |
| C-8 | Minor | `.claude/hooks/git-calls.mjs:131`, `tools/claude-hooks/commit-msg-gate.test.ts:84-87` | Die Zeile behandelt auch den `cd` im Hintergrund (`command.next !== '&'`, so auch im Kopfkommentar `:5`). Getestet sind aber nur die Pipe und `\|\|`. Für `cd <scratch> & git commit -m a` gibt es keinen Testfall. Die geänderte Bedingung steht also ohne Test (deshalb fällt auch C-6 nicht auf). |

Geschlossen: keine (C-5 ist der einzige offene Befund aus Runde 2).

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bunx vitest run tools/claude-hooks tools/deepcheck/test/hook.test.ts tools/deepcheck/test/readme.test.ts tools/testcheck/test` (157 grün, neue Fälle zuvor rot), `bun run lint`, Prettier.
- Ob die neuen Tests ohne die Änderung rot sind, habe ich durch Lesen beurteilt, nicht ausgeführt. Auf 5d15f9ce2 sind alle rot:
  - `END-NOTES`: `\w+` passt nur auf `END`, also wird der Body als Befehl gelesen.
  - `<<A <<B`: Ein einziger Durchlauf durchsucht die Ersetzung nicht noch einmal.
  - `nice -n 10`: Der Abbruch kommt bei `10`.
  - `timeout -k 5s 60s`: Der Abbruch kommt bei `5s`.
  - `GIT_DIR=<ROOT>/.git` aus scratch: `repositoryOf(dir)` ohne Env liefert das scratch-Repo, der Aufruf wird ausgefiltert.
  - `cd … | cat` und `true || cd …`: Der `cd` verschiebt das Verzeichnis, der Aufruf wird ausgefiltert.
- Meine Belege zu C-6 und C-7 stammen aus einem Aufruf von `gitCalls` mit `node -e` im Worktree, der nichts schreibt. Tests habe ich keine gestartet.

Geprüft:
- `&&`/`||` werden genau einmal erfasst (`i++` bei `op.length === 2`, `:57-58`).
- `2>&1` und `>&2` bleiben Wörter.
- Die Heredoc-Schleife endet: Jede Ersetzung entfernt mindestens ein `<<`, und ein Platzhalter enthält kein `<<`, kann also nicht erneut passen.
- Gemischt gequotete und ungequotete Heredocs auf einer Zeile liefern die richtigen Bodies (`$(…)` nur aus dem ungequoteten).
- `<<\EOF` und `<<<` passen weiterhin nicht.
- Der Wrapper-Sprung bringt Fehltreffer nur auf der sicheren Seite (`xargs echo git status` wird ein Aufruf, er gated mehr und lässt nichts durch).
- `gitAs` (`commit-msg-gate.mjs:21-23`): Ein relatives `--git-dir` bzw. `GIT_DIR` löst Git wie beim Aufruf erst nach `-C dir` auf.
- Kopfkommentar und `commit-gates/SKILL.md:34` stimmen mit dem Code überein.
