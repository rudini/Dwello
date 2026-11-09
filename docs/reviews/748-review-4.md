# Code-Review 748, Runde 4 (CI-Fix PR #1381, Delta afa69436..09525887)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | keine Befunde |

Geschlossen: alle IDs aus 748-review-1.md bis -3.md (laut Aufrufer, im Delta nicht wieder geöffnet).

Geprüft: Das Delta verschiebt nur Code und ändert ihn nicht (Backend-Routen, `exportFile`/`sources`, `zipStreamDownload`, `bytesOf`, Zusammenbau des ZIP sind Zeile für Zeile gleich; die Fehlermeldung von `bytesOf` nennt jetzt die URL statt der Quelle, nur intern, kein Text für die Oberfläche). Die Pfade bleiben gleich: `tenantExportRoutes` hat kein eigenes Präfix und wird in `tenantRoutes` (Präfix `/api/v1/tenants`) eingebunden; `tenant-export.pg.test.ts` ruft die vollen Pfade `/api/v1/tenants/:id/export` und `.../export/files/:kind/:fileId` auf. Die Authentifizierung bleibt: `authMiddleware` hängt mit `derive({ as: 'scoped' })` an der eigenen Instanz und schützt damit deren Routen, die nach dem `.use` registriert werden; `auth.pg.test.ts` (S1, #936) prüft ausserdem jede Route aus `app.routes` auf 401. Die Validierung der Parameter (uuid, Union der Arten) hat sich nicht geändert. Die Header in `zip-stream.ts` (`zipDownload(fileName, {}).headers`) sind korrekt: Sie kommen aus derselben Quelle wie beim sofort erstellten ZIP, und `tenant-export.test.ts` deckt Content-Type und Content-Disposition des Streams ab. Ein leeres ZIP mit 22 Bytes nur für die Header kostet fast nichts und ist kein Fehler; ein gemeinsamer Helfer wäre nur eine andere Schreibweise (ponytail-review: kein Befund). `zip-download.ts` entspricht wieder `main`. Im Diff bleibt kein ungenutzter Code oder Import zurück (`and` in tenant-export.service.ts entfernt, `eq` wird weiter gebraucht). Das Delta enthält nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- bun run lint, bun run check, Fitness mit --structure (0 errors), cd backend && bun run type-check, bunx vitest run (4850), Backend-pg-Tests api-contracts + tenant-export + data-export (157 pass), E2E chromium+api tenants.feature (12 pass): vom Aufrufer gemeldet.
- `backend/src/__tests__/auth.pg.test.ts` (401 auf jeder registrierten Route, prüft auch die verschobenen Routen) wurde laut Meldung nicht ausgeführt. Beim Lesen sehe ich keinen Grund für ein Scheitern, weil `app.routes` die eingebundenen Routen mit dem vollen Pfad aufführt; bestätigt ist das nicht.
- Elysias Verhalten beim Präfix einer per `.use` eingebundenen Instanz habe ich nur aus dem bestandenen `tenant-export.pg.test.ts` abgeleitet (gemeldet) und nicht im Quellcode von Elysia nachgelesen (kein `node_modules`).
