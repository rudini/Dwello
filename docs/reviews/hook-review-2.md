# Code-Review Runde 2: commit-msg-gate, Heredoc nur des Commit-Aufrufs (9b119f51..7fcc3a98)

Geschlossen: C-1, C-2, C-3

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-4 | Minor | .claude/hooks/commit-msg-gate.mjs:64 | `rest.split(/[\n;&|]/)[0]` schneidet die Zeile auch am `&` einer Umleitung ab. Steht `2>&1` (oder `>&2`, `&>log`) vor dem `<<`, findet der Hook keinen Marker und lässt den Commit ungeprüft durch. Auf der Basis wurde er geprüft. Nachgestellt mit `git commit -F - 2>&1 <<'EOF' && git push\n<Betreff mit 63 Zeichen>\nEOF`: Der Basis-Hook endet mit Exit 2, der neue mit Exit 0. Der Push im selben Befehl sieht nur HEAD, also geht der Commit mit dem falschen Betreff hinaus, und erst CI «Commit subjects» fängt ihn ab. Die Form ist selten; `<<'EOF' 2>&1` (Umleitung nach dem Marker) wird weiterhin geprüft. Abhilfe: nur an `\n`, `;`, `|` und `&&` trennen, nicht an jedem `&`, und einen Blockier-Fall mit `2>&1` vor dem Heredoc ins Testset aufnehmen. |

Keine Blocker oder Major.

Geprüft: Delta vollständig gelesen (Hook, Test, Commit-Message). Der neue Durchlass-Fall für C-1 ist auf der Basis rot (dort wird der spätere Heredoc als Betreff gelesen, Nachstellung in Runde 1). Von Hand gegen den Hook der Revision: `<<'EOF'`, `<<'EOF' && git push`, `<<-EOF` mit Tabs und `<<EOF | tee x` blockieren einen zu langen Betreff. Ein gültiger Betreff mit Body passiert. `printf x | git commit -F - ; cat <<EOF …` passiert, wie es sein soll. Kommentar und Commit-Message stimmen jetzt.

## Nicht bestätigt

- `bun run lint` und Prettier ohne Diff auf beiden Dateien: vom Aufrufer gemeldet, nicht neu ausgeführt.
- Dass der C-1-Testfall vor dem Fix rot war: vom Aufrufer gemeldet; durch Lesen und die Nachstellung aus Runde 1 bestätigt.
- `bunx vitest run tools/claude-hooks/commit-msg-gate.test.ts`: von mir neu ausgeführt, 29 Tests bestanden.
