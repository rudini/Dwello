# Code-Review 713, Runde 6 (Abschlussrunde vor dem Push)

Bereich: `git diff 1929160f2 e2f26b6f8` (Worktree /tmp/claude/review-713-cr6, Commit e2f26b6f8)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-17 | Minor | tools/claude-hooks/main-push-guard.test.ts:84–88 | Der Fix ändert auch das Verhalten für eine Body-Zeile eines ungequoteten Heredocs, die einen Push nur erwähnt: `cat > d.md <<EOF⏎git push origin main⏎EOF` hat auf 1929160f2 nachgefragt und läuft jetzt durch (Body wird in Z. 25–27 verworfen). Das entspricht der Anforderung («text that only mentions a push»), aber kein Fall pinnt es. Die Pass-Fälle in Z. 85 und 87 nutzen nur `<<'EOF'`. |
| C-18 | Minor | .claude/hooks/main-push-guard.mjs:25–26 | Die `$(…)` aus einem ungequoteten Body werden hinter `rest` gehängt, also hinter den Rest der Kopfzeile. Bash expandiert den Body aber, bevor der Befehl mit dem Heredoc läuft, also auch vor einem `cd` in `rest`. Im Feature-Checkout fragt `cat <<EOF && cd %MAIN%⏎$(git push)⏎EOF` deshalb nicht nach: die Subshell wird nach `cd %MAIN%` aufgelöst, der echte Push läuft aber im Feature-Checkout. Umgekehrt kann ein Push in main mit `cd %FEATURE%` in `rest` ohne Rückfrage durchgehen. Das ist die unsichere Richtung, kommt aber nur in konstruierten Zeilen vor. Der Kommentar in Z. 18 («after it») beschreibt die Reihenfolge, nicht den Grund dafür. |

Geschlossen: C-16

Geprüft: C-16-Fix (Body mit `'` wird verworfen, `git push` danach fragt nach; der neue Fall Z. 75 ist auf 1929160f2 rot, weil das offene `'` in Z. 33–38 den Rest der Zeile verschluckt hat). `substitutions()` im Doppelquote-Pfad verhält sich gleich wie die alte Schleife. Gequotete Heredocs sind unverändert (`quote` gesetzt, keine Substitutionen). Leerer Body: die äussere Gruppe greift immer, `''`. Das Muster `git commit -m "$(cat <<EOF … EOF⏎)"` mit `"` oder `'` im Body wird jetzt sauber geparst. Ein `$(git push)` im Body innerhalb von `"$(cat <<EOF …)"` wird weiterhin gesehen. Der Umbruch der `assignments`-Zeile (Z. 132–134) ist reine Formatierung einer Zeile aus diesem PR.

## Nicht bestätigt

- `bunx vitest run tools/claude-hooks` (77 bestanden, der neue C-16-Fall vorher rot), der Prettier-Diff auf dem Hook und eslint auf beiden Dateien: vom Aufrufer gemeldet, nicht selbst ausgeführt (der Worktree hat keine `node_modules`).
- Rot/Grün des neuen Falls sowie C-17 und C-18: nur durch Lesen von Z. 16–48 gegen den Diff von 1929160f2 beurteilt.
- Nicht im Delta, unverändert seit der Basis: `<<\EOF` und teilweise gequotete Begrenzer (`<<E"OF"`) trifft der Regex in Z. 25 nicht. Ihr Body wird weiter als Shell-Code gelesen, auch mit dem Apostroph-Effekt aus C-16. Das widerspricht der Commit-Aussage «quoted or not» im Wortlaut, ist aber keine Regression.
