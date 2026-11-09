# Review #1377, Runde 2 (Abschlussrunde)

Bereich: `git diff 5e374e7a f7465789` (Commit f7465789 `fix(api): reuse refusal() for MCP non-UUID id`), ohne `docs/reviews`, `implementation_plan.md`, `docs/archive`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|

Keine neuen Befunde, keine Blocker oder Majors.

Geschlossen: C-1

Geprüft: `backend/src/routes/mcp.ts:126` ruft jetzt `refusal('NOT_FOUND', 'Not found')` auf (`backend/src/services/coded-error.ts:14`, in mcp.ts:11 schon importiert). Der Rumpf ist derselbe wie vorher (`{ error, code, params: {} }`), das Verhalten ändert sich also nicht und es braucht keinen neuen Test. Der Parameter `refusal` von `refusedWith` (Z. 121) verdeckt den Import nur innerhalb dieser Arrow-Funktion, `callTool` verwendet den Import.

## Nicht bestätigt

- `cd backend && bun test src/__tests__/access-key.pg.test.ts` (24 pass): vom Aufrufer gemeldet
- `cd backend && bun run type-check`: vom Aufrufer gemeldet
