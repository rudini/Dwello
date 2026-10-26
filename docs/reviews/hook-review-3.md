# Code-Review Runde 3 (Abschluss): commit-msg-gate, Umleitung vor dem Heredoc (7fcc3a98..38ac4a87)

Geschlossen: C-4

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

Keine Blocker oder Major.

Geprüft: Delta vollständig gelesen (Hook Z. 64, Testfall, Commit-Message). Die Trennung an `\n`, `;`, `&&` und `|` findet den Marker jetzt auch bei `2>&1 <<'EOF'` und `&>log <<EOF`. `|| true; cat <<EOF` liefert weiterhin keinen Marker. Nachgestellt mit node und beiden Regexen. Der neue Blockier-Fall ist ohne den Fix rot: Der alte Split liefert keinen Marker, also bleibt die Nachricht `undefined`. Die Push-Prüfung im Worktree sieht nur gültige Betreffe (42, 44 und 47 Zeichen), also endet der Hook mit Exit 0 statt 2. Kommentar und Commit-Message stimmen.

## Nicht bestätigt

- `bun run lint` und Prettier ohne Diff auf beiden Dateien: vom Aufrufer gemeldet, nicht neu ausgeführt.
- Dass der `2>&1`-Fall vor dem Fix rot war: vom Aufrufer gemeldet; durch Lesen und die Nachstellung des Regex bestätigt, nicht durch einen Testlauf gegen den alten Hook.
- `bunx vitest run tools/claude-hooks/commit-msg-gate.test.ts`: von mir neu ausgeführt, 30 Tests bestanden.
