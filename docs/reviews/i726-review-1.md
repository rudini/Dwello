# Review #726, Runde 1 (ef2df615)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde. |

Geprüft: alle vier geänderten Dateien gelesen. `statement-counts.json` enthält genau die fünf Felder, die `src/routes/statements/+page.server.ts:95-99` liest, `total` (nicht gelesen) fehlt gemäss `tests/contracts/README.md`. `getStatementCountsByStatus` (`backend/src/services/statement.service.ts:988`) wandelt alle Zähler mit `Number()`, also stimmt der JSON-Typ number. Der neue Vertragstest nutzt `drift`/`sample` wie die übrigen Verträge. Mit dem alten Fake `{ draft: 2, overdue: 1 }` scheitert die neue Erwartung `{ draft: 2, sent: 3, paid: 4, settled: 5, overdue: 1 }`, sie ist also rot ohne die Änderung; die unterschiedlichen Werte zeigen ein falsch zugeordnetes Feld. README-Zeile stimmt. Der Commit sagt «No scenario: a test-only change», was hier zutrifft (kein geändertes Verhalten, keine UI-Texte, keine neuen Bildschirme). Nichts im Diff gehört nicht zur Anforderung. Ponytail-Review: Lean already. Ship.

## Nicht bestätigt

- `cd backend && bun test src/__tests__/api-contracts.pg.test.ts` (93 pass) und dessen roter Lauf mit `"draft": "2"`: vom Aufrufer gemeldet, nicht neu ausgeführt (braucht PostgreSQL). Durch Lesen bestätigt: `drift` meldet bei `"2"` gegen eine Zahl `.draft: string erwartet, number geliefert`.
- `src/__tests__/open-work.test.ts`, `bun run lint`, `bun run check`, `cd backend && bun run type-check`, Prettier: vom Aufrufer gemeldet.
- `bunx vitest run src/__tests__/statement-list-load.test.ts`: in der Worktree neu ausgeführt, 12 bestanden.
