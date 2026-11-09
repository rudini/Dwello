# Code-Review #1377, Runde 4 (Abschlussrunde, 27814474..041da259)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde im Delta. |

Geschlossen: C-1

Geprüft: `backend/src/routes/mcp.ts:42` (`String(args.id)` deckt Zahl-IDs ab; die übrigen Stellen mit `args.id` – `pageOf` über `encodeURIComponent`, `query` über `URLSearchParams` – wandeln selbst in Text um, kein weiterer Absturzpfad), der neue pg-Test `access-key.pg.test.ts:311-315` (auf der Basis wirft `args.id.replace` bei `id: 5` einen TypeError, der Test schlägt also ohne den Fix fehl), `src/__tests__/statement-endpoints.test.ts:291` (erwartet jetzt den Header, den `src/lib/server/api-proxy.ts:221` setzt; das entspricht #1377, «escapes the filename as backend/src/routes/file-response.ts does»; kein gelockertes Szenario, nur ein Unit-Test).

## Nicht bestätigt

- vom Aufrufer gemeldet: `cd backend && bun test src/__tests__/access-key.pg.test.ts` (25 pass), `bun run type-check`; `bunx vitest run` von statement-endpoints, statement-list-load, data-export, tenant-export, tests/unit/api-proxy (103 pass); fallow-Wartbarkeit von mcp.ts 84.9 (Basis 84.6).
- Dass die API für `/api/v1/tenants/no-record` den Code `NOT_FOUND` liefert (der neue Test setzt ihn fest, statt ihn wie der Nachbartest von der API zu holen): nur über `backend/src/app.ts:76-78` nachgelesen, nicht ausgeführt.
- Den Rotlauf des pg-Tests habe ich nur durch Lesen beurteilt.
