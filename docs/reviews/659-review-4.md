# Code-Review #659, Runde 4 (Abschlussrunde), Delta f32e390..e5236c4

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: Der Marker `TODO(fachlich prüfen, #1130)` in `src/routes/statements/generate/SettingsStep.svelte:81` steht vollständig auf einer Zeile und passt auf das `git grep`-Muster und den Regex `TODO\(fachlich prüfen((?:, #\d+)+)\)` in `tools/open-work/check-issues.mjs:17,27`; `src` und `.svelte` liegen im Suchbereich von `src/__tests__/open-work.test.ts:48-64`, und die Zeile enthält `TODO(fachlich prüfen, #`. #1130 ist offen (Labels `domain`, `needs-decision`) und kein Pull Request; der Text von PR #1133 schliesst nur `Fixes #659`, damit greift die Prüfung «PR schliesst kein Issue, das ein Marker nennt» nicht. Die drei Begriffe im Kommentar (Zähler, Zählerstand, Heizkostenverteiler) entsprechen dem Titel von #1130 und den Texten `statements_heating_meters(_title)` in `messages/de.json:1525-1526`. Der Kommentar ändert kein Verhalten; das Delta enthält nichts Fremdes.

## Nicht bestätigt

- open-work.test.ts (4 bestanden) und lint (sauber): vom Aufrufer gemeldet, nicht selbst ausgeführt.
- `check-issues.mjs` in CI nicht ausgeführt; das Ergebnis habe ich durch Lesen des Skripts und über die GitHub-REST-API (Issue #1130, Text von PR #1133) hergeleitet.
