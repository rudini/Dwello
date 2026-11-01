# Review #728, Runde 1 (Abschlussrunde), 683661b80..c702a4835

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: Footer.svelte liest die Version nur noch über `src/lib/app-version.ts` (einzige Stelle mit `__APP_VERSION__` im App-Code, sonst nur app.d.ts, eslint, vite/vitest-Config); hoisted Getter-Mock in shell.dom.test.ts:16-22 ersetzt das Modul, Test «zeigt die Version der App» deckt weiterhin 1.4.0; neues `it.each` (shell.dom.test.ts:140-158) deckt null in de/fr/it/en, die Erwartungstexte stimmen mit `footer_version_unknown` in allen vier `messages/*.json` überein; Locale und Version werden im `finally` zurückgesetzt. Rot ohne Änderung: ohne das Modul importiert Footer den Mock nicht und zeigt 'Version 1.4.0', das `it.each` schlägt also fehl. Keine neuen UI-Texte, kein neuer Bildschirmzustand für E2E erreichbar (E2E-Build hat eine Version), «No scenario» damit begründet. ponytail-review: Lean already. Ship. (Modul mit einem Aufrufer ist von der Anforderung verlangt.) Nichts Fremdes im Diff.

## Nicht bestätigt

- shell.dom.test.ts: 4 rot vor dem Modul, danach 16 grün (vom Aufrufer gemeldet).
- `bun run lint`, `bun run check` (vom Aufrufer gemeldet).
- Prettier auf neuen und geänderten Zeilen (vom Aufrufer gemeldet).
- Commit-Gates (fallow, deepcheck, testcheck) auf c702a4835: nicht ausgeführt, nur gelesen.
