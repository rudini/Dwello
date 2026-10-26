# Review i837c3-latest, Runde 1 (c24abe50..276ac7e8)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: alle 9 Dateien des Diffs gelesen. `src/lib/types.ts` importiert nur noch `backend/src/api/*` und `backend/src/services/tenant.service`, nichts aus dem Frontend (#857 erfüllt). `LatestKey` liegt in `backend/src/api/invoice.ts:20` ohne Import (ADR 0005). Der Cast `rows as LatestKey[]` (`backend/src/services/invoice.service.ts:254`) stimmt: `buildingId` ist im Schema `notNull` (`backend/src/db/schema.ts:303-304`), `categoryId` und `distributionKeyId` filtert das `where`. Keine Verwendung über `$lib/invoice` bleibt übrig (grep über src, backend/src, tests). Es entsteht kein Importzyklus: `src/lib/invoice.ts` → `./types`, umgekehrt nicht mehr. Die Antwort von `GET /invoices/latest-keys` bleibt gleich, also kein Vertrag und kein Szenario nötig (reine Typänderung). Ponytail: nichts zu streichen.

## Nicht bestätigt

- `bun run lint`, `bun run check`, die Typprüfung des Backends, `bunx vitest run` (45 Dateien), `api-contracts.pg.test.ts` und `fitness.ts`: vom Aufrufer gemeldet, nicht erneut ausgeführt (`node_modules` sind im Review-Worktree nicht lesbar; reine Typänderung, nur Typprüfungen können sie zeigen).
