# Review i709, Runde 2 (Abschluss, Delta `git diff 246a5162 67d895be`)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|

Keine offenen und keine neuen Befunde.

Geschlossen: C-1, C-2

## Nicht bestätigt

- `bun run lint` und `bunx eslint tests/e2e`: vom Aufrufer gemeldet, nicht neu ausgeführt. Der Rotlauf des neuen Destrukturierungsfalls vor der Selektoränderung ist ebenfalls vom Aufrufer gemeldet. Beim Lesen bestätigt: Mit dem alten Selektor `Property > Identifier.key` war der Schlüssel `fetch` ausgenommen und der Wert hiess `get`, die Regel schlug also nicht an.
- Bewusst nicht abgedeckt ist der Alias `const g = globalThis; g.fetch(…)`, wie in der Übergabe genannt. Selektoren können keinen Datenfluss verfolgen, und die übrigen Schichtregeln erkennen Aliase auch nicht. Deshalb ist das kein Befund.

Geprüft: `bunx vitest run src/__tests__/e2e-screenplay-lint.test.ts` neu ausgeführt (61 bestanden). Den neuen Selektor habe ich per `ESLint.lintText` im Worktree auf `tests/e2e/tasks/` geprüft. Abgelehnt werden `{ fetch: get } = globalThis`, `{ fetch } = globalThis`, das Kurzform-Objekt `{ fetch }` (der Wert ist `fetch`) und ein destrukturierter Parameter `{ fetch: g }`. Das Objekt-Literal `{ fetch: 1 }` bleibt erlaubt. Die Zeile zu `screenplay/` in tests/e2e/CLAUDE.md:37 nennt jetzt `fetch` (nur dort erlaubt) und `MailsTo`, passend zur Lint-Meldung in eslint.config.js:40. Im Delta gibt es keine Änderung ohne Bezug zur Anforderung.
