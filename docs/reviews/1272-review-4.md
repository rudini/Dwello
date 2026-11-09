# Re-Review #1272, Abschlussslice Runde 2 (935d0223)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | keine offenen oder neuen Befunde |

Geschlossen: C-4

C-4: `base` ist `const` (fitness.ts:558). Mit `base && baseRatchet ? … : []` (fitness.ts:569) wird `base` im wahren Zweig auf `string` eingeengt, und TypeScript behält diese Einengung für eine `const` auch in der Pfeilfunktion bei. Das Array an `git(string[])` ist damit typkorrekt. Das Verhalten bleibt gleich: `baseRatchet` wird nur in `if (base)` gesetzt (Zeile 562–564), die zusätzliche Bedingung schliesst also keinen Fall aus, der vorher lief.

Geprüft: Delta a905e227..935d0223 (eine Zeile, tools/fitness/fitness.ts:569), Commit-Betreff im Format von Conventional Commits.

## Nicht bestätigt

- `bun run check` (0 Fehler), `eslint tools/fitness`, `bunx vitest run tools/fitness` (54 bestanden), `bun run fitness -- --base origin/main` (0 Fehler): vom Aufrufer gemeldet.
