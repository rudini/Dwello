# Code-Review 713, Runde 5 (Abschlussrunde vor dem Push)

Bereich: `git diff 9ae17a8cc 1929160f2` (Worktree /tmp/claude/review-713-cr5, Commit 1929160f2)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-16 | Minor | .claude/hooks/main-push-guard.mjs:21, :28–32 | Seit dem C-13-Fix liest der Hook den Body eines ungequoteten Heredocs als Shell-Code. Ein einzelnes `'` oder `"` im Body (z. B. «it's») öffnet in Z. 28 ein Zitat ohne Ende (`close < 0`, `i = s.length`) und verschluckt den Rest der Zeile. Auf 9ae17a8cc wurde der Body entfernt, und ein Push danach hat nachgefragt. Im main-Checkout läuft `cat > n.md <<EOF⏎it's done⏎EOF⏎git push` jetzt ohne Rückfrage durch. Das ist eine Regression gegenüber der Basis, und kein Test deckt sie ab. Nebenbei fragt jetzt auch eine Body-Zeile, die einen Push nur erwähnt (`cat > n.md <<EOF⏎git push origin main⏎EOF`). Das ist die sichere Richtung, und `commit-gates/SKILL.md` Z. 8 rät ohnehin von solchen Heredocs ab. Möglicher Fix: ungequotete Bodies weiter entfernen und nur ihre `$(…)` wie in Z. 30 vor dem Befehl einsetzen. |

Geschlossen: C-12, C-13, C-14, C-15

Geprüft: C-12 (`splice(-1, 0, …)` setzt die Subshell vor den laufenden Befehl, `(`/`)` bleiben paarig, `git commit -m "$(cat <<'EOF' …)"` verhält sich unverändert), C-14 (`=`-Form und Leerzeichen-Form, `--git-dir=` mit leerem Wert), C-15 (`CONFIG\w*` deckt `GIT_CONFIG_COUNT/KEY_n/VALUE_n/PARAMETERS/GLOBAL` ab). Die vier neuen Fälle wären ohne den Fix rot: aus dem Code gegen 9ae17a8cc nachvollzogen.

## Nicht bestätigt

- `bunx vitest run tools/claude-hooks` (76 bestanden, 4 neue Fälle vorher rot), `bunx prettier --check` und eslint auf beiden Dateien: vom Aufrufer gemeldet, nicht selbst ausgeführt (der Worktree hat keine `node_modules`). `.prettierignore` schliesst ohnehin alles ausser `src/` aus, deshalb sagt der Prettier-Lauf über die Zeilenlänge von Z. 126 (148 Zeichen) nichts.
- Die Rot-Läufe der neuen Fälle und der Fall in C-16: nur durch Lesen von Z. 21–41, 69–78 und 114–128 beurteilt.
