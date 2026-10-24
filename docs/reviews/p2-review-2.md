# Code-Review #788 Teil 2, Runde 2 (Delta bd6678ad..462d7a96)

## Status der offenen IDs aus Runde 1

| ID | Schwere | Status |
|---|---|---|
| C-1 | Minor | Behoben. `formerTenantDocuments` sortiert nach `startDate desc, id desc` (backend/src/services/document.service.ts:90-94), wie die Vertragsliste (`contract.service.ts:159`). Das Dashboard füttert `src/lib/former-tenant-documents.ts` mit `contracts?limit=1000` aus derselben Liste und filtert pro Mieter mit `filter` (Reihenfolge bleibt, `dashboard/+page.server.ts:137-140`); beide `reduce` wählen bei Gleichstand das spätere Element, also den früher begonnenen Vertrag. Test «nimmt bei gleichem Vertragsende den früher begonnenen Mietvertrag» erwartet genau diesen; ohne `orderBy` liefert die Einfügereihenfolge den später begonnenen (`later`) und der Test schlägt fehl. |
| C-2 | Minor | Behoben. `formerDocuments` ist `null`, wenn kein gelistetes Dokument zu den `documentIds` passt (`src/routes/tenants/[id]/+page.server.ts:46-55`); Test «zeigt keinen Hinweis, wenn die Dokumente des Mieters nicht laden» war mit dem alten `former && {…}` rot (Objekt mit `documents: []`). Kein anderer Fall verliert einen zuvor sinnvoll gezeigten Hinweis: `/documents` hat kein Limit (`loadDocuments` ohne `limit`), leer ist die Schnittmenge also nur bei Fehler oder bei einem zwischen den Aufrufen gelöschten Dokument, wo der alte Hinweis eine leere Aufzählung zeigte. Teilweise Treffer zeigen wie bisher die passenden Dokumente. |

## Neue Befunde im Delta

Keine.

Geprüft: Isolation und Aufräumen des neuen pg-Tests (eigener Mieter über `tenantWith`, Zweitvertrag und Wohnung `P1` im `finally` gelöscht, vor `rental.remove()` mit Gebäude; Dokument über `afterAll`); `desc` importiert; ponytail-review ohne Befund; keine UI-Texte, keine Szenario- oder Vertragsänderung, nichts Fremdes im Delta.

## Nicht bestätigt

- Alle vom Aufrufer gemeldeten Checks (vom Aufrufer gemeldet, nicht erneut ausgeführt): `bunx vitest run` (3645), `bun run lint`, `bun run check`, Backend-Type-Check, `tenant-former-documents.pg.test.ts` (10), `bun run fitness`, Commit-Hooks.
- Der rote Lauf des C-1-Tests ohne `orderBy`: nur durch Lesen beurteilt; ohne `ORDER BY` ist die Reihenfolge von PostgreSQL nicht garantiert, in einer frischen Tabelle aber die Einfügereihenfolge.
