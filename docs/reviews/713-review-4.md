# Code-Review 713, Runde 4 (Abschlussrunde vor dem Push)

Bereich: `git diff 589939fd2 9ae17a8cc` (Worktree /tmp/claude/review-713-cr4, Commit 9ae17a8cc)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-12 | Minor | .claude/hooks/main-push-guard.mjs:31, :42 | `$(…)` in doppelten Anführungszeichen wird erst **nach allen** äusseren Befehlen ausgewertet, nicht an seiner Stelle. Darum gilt das Verzeichnis eines späteren `cd` oder das nach einer schon geschlossenen Subshell. Beispiel aus dem Feature-Checkout: `(cd "<main-Checkout>" && echo "$(git push)")`. Die Befehle laufen als `(`, `cd main`, `echo …`, `)` (das `dir` springt zurück auf den Feature-Checkout) und erst dann `(git push)`: keine Rückfrage, obwohl der Push im main-Checkout läuft. Genauso fragt `out="$(git push)"; cd <Feature-Checkout>` aus dem main-Checkout nicht. Fall 1 der Anforderung gilt also nur ohne `cd` danach oder darum herum, und kein Test hält das fest. |
| C-13 | Minor | .claude/hooks/main-push-guard.mjs:21 | Die Heredoc-Regex entfernt auch Bodies mit **ungequotetem** Begrenzer (`(['"]?)` ist optional). In einem solchen Body führt die Shell `$(…)` aus. `cat <<EOF⏎$(git push)⏎EOF` im main-Checkout hat auf 589939fd2 nachgefragt (der Body wurde als Befehle gelesen, `(` trennt). Jetzt läuft er ohne Rückfrage durch. Das ist eine Regression, die weder der Kopfkommentar (Z. 2–8) noch `commit-gates/SKILL.md` nennt. Fix: nur Bodies mit gequotetem Begrenzer entfernen, oder aus ungequoteten Bodies die `$(…)` wie in Z. 31 herausziehen. |
| C-14 | Minor | .claude/hooks/main-push-guard.mjs:70 | Fall 4 erkennt nur die Schreibweise mit Leerzeichen. `git --git-dir="$REPO" push` fällt durch Z. 74 und geht als Option an `spawnSync`. Dort scheitert git am wörtlichen `$REPO`, `current` und `@{push}` sind leer: keine Rückfrage. Dazu fehlt für `--git-dir "$VAR"` ein Test. Strich man `--git-dir` aus der Regex in Z. 70, bliebe jeder Test grün (geprüft ist nur `-C "$CHECKOUT"`, Test Z. 67). |
| C-15 | Minor | .claude/hooks/main-push-guard.mjs:78, :126 | Jede `GIT_*`-Variable mit `$` oder `~` macht einen Push zur Rückfrage, auch eine, die das Repository nicht bestimmt. Beispiel: `GIT_SSH_COMMAND="ssh -i ~/.ssh/id" git push origin feature` auf dem Session-Branch ging auf 589939fd2 durch und fragt jetzt «runs in a repository the hook cannot resolve». Z. 78 hat keinen Test, der ohne sie rot wird. |

Geprüft: dass die sieben neuen Fälle ohne den Fix rot wären (jeder Fall aus dem Code nachvollzogen). Dazu die Fälle, die weiter durchgehen sollen: Session-Branch-Push mit `2>&1 | tail`, `echo "git push origin main"`, Heredoc mit gequotetem Begrenzer, `git commit -m "$(cat <<'EOF' … EOF\n)"`. Weiter die Klammer-Marker bei `$(…)` ohne Anführungszeichen, bei `case … )` (kein `pop` ohne offenes `(`) und bei Prozess-Substitution. Ausserdem die Aufteilung `split(/=(.*)/s, 2)`, `remote.<r>.push` vor `@{push}` und die Begrenzerzeile (`\s*\2(?=\n|$)`, nur am Zeilenanfang).

## Nicht bestätigt

- `bunx vitest run tools/claude-hooks` (72 bestanden, 7 neue Fälle vorher rot), `bunx prettier --check` und eslint auf beiden Dateien: vom Aufrufer gemeldet, nicht selbst ausgeführt (der Worktree hat keine `node_modules`).
- Die Rot-Läufe der neuen Fälle: nur durch Lesen von Z. 21, 31, 37, 70, 78–80, 96 und 115–127 gegen den Basis-Commit beurteilt.
