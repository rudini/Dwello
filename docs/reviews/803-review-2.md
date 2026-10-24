# Code-Review 803, Runde 2 (Schlussrunde, Delta 20a7b16..0ef4022)

## Status der offenen IDs aus 803-review-1.md

| ID | Status | Beleg |
|----|--------|-------|
| C-1 | behoben | `tools/deepcheck/src/render.ts:26`: `s.split('|').join('\\|')` ersetzt jedes `|` durch `\|` und lässt alles andere unverändert, genau wie die Basis vor #803 (`5e99928`: `s.replace(/\|/g, '\\|')`). Die Ausgabe ist damit für jede Zeichenkette gleich; Backslashes bleiben im Code-Span wie in der Basis unverändert. |
| C-2 | behoben | `.github/workflows/security-alerts.yml:49`: Unter "Done means" steht jetzt die Ausnahme für Fehlalarme, die sich im Code nicht vermeiden lassen. Die Zeile ist mit 10 Leerzeichen eingerückt wie die übrigen Heredoc-Zeilen, bleibt also im Block-Scalar und vor dem Terminator `BODY`. `yaml.safe_load` liest die Datei ohne Fehler. |

## Neue Befunde im Delta

Keine.

Geprüft: Beide Dateien des Deltas sind gelesen. Gegenüber der Basis ändert sich in `render.ts` nur der Kommentar, der Ausdruck verhält sich gleich. Deshalb braucht es keinen neuen Test.

## Nicht bestätigt

- `bunx vitest run tools/deepcheck` (183 bestanden): vom Aufrufer gemeldet, nicht erneut ausgeführt.
- `prettier --check` auf dem Workflow: vom Aufrufer gemeldet.
- Lokaler CodeQL-Lauf (2.27.3, javascript-code-scanning, keine Befunde): vom Aufrufer gemeldet. Ob `js/incomplete-sanitization` die `split/join`-Form auch auf GitHub nicht meldet, zeigt erst der Lauf nach dem Push.
- Wie das Issue nach dem Heredoc tatsächlich aussieht, ist nicht geprüft; dafür müsste der Workflow laufen. Geprüft ist nur, dass das YAML gültig ist und die Zeile richtig eingerückt ist.
