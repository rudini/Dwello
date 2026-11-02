# Code-Review Runde 2: change-graph (Delta 3ee5b9088..2c206f233)

Geschlossen: C-1, C-2

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde im Delta. |

Geprüft: `--band` ist in hell und dunkel entfernt und nirgends mehr verwendet (`grep band` in `structure.ts` leer); der Absatz «Stability and changes» (`structure.ts:396`) und `fitness-functions.md:46` beschreiben die Zone so, wie `change-zone` (`structure.ts:216`, I ≤ `LIMITS.stable.i`, über `LIMITS.changes[0]`) sie zeichnet, und die Ampel so, wie `structure.ts:156` sie rechnet (zusätzlich Ca ≥ `LIMITS.stable.users`); der Tooltip nennt Ca, die geänderte Erwartung in `structure.test.ts:124` schlägt ohne die Änderung fehl (der alte Titel enthielt kein «Ca 1»); Plan-Zeile und kopierter Bericht passen zum Stand.

## Nicht bestätigt

- `bunx vitest run tools/arch-baseline` (42 bestanden), `bun run lint`, Prettier-Diff auf `structure.ts`, Commit-Hooks: vom Aufrufer gemeldet, hier nicht ausgeführt.
