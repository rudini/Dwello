# Re-Review Runde 3 (letzte): Merge-Slice W9c, Fix von C-3 (4db2930)

Geprüft: `git diff 9dc4299 4db2930` (6 Dateien, alle gelesen), dazu `later()`/`expired()` in `src/routes/dashboard/+page.server.ts:91-123`, `successorAfter`/`fixedTermCheckDue` in `src/routes/contracts/[id]/+page.server.ts:61-85`, Query-Parameter `apartmentId`/`limit` in `backend/src/routes/contracts.ts:25-93` und `backend/src/services/contract*.ts:95` (Standard 50, keine Obergrenze), `tests/contracts/contracts.json` (enthält `apartmentId`).

**C-3 ist behoben.** `formerTenantDocuments` hält den Hinweis jetzt genau dann zurück, wenn A-6 offen ist: nicht gekündigt, kein «Mieter ist ausgezogen» und kein späterer Mietvertrag für die Wohnung des letzten Mietvertrags (`former-tenant-documents.ts:35-38`). Die Bedingung `c.apartmentId === last.apartmentId && c.startDate > last.endDate` entspricht `later()` im Dashboard. Damit widersprechen sich die Übersicht («Befristeten Mietvertrag prüfen») und der Hinweis «Dokumente von … prüfen» nicht mehr, und der häufigste Fall aus #178 (befristeter Vertrag, dann Nachmieter) zeigt den Hinweis. Das Dashboard übergibt alle Verträge. Die Mieterseite lädt `contracts?apartmentId=<letzte Wohnung>&limit=100`, und der Test prüft genau diese URL. Bei weniger als 50 Wohnungen reicht `limit=100` pro Wohnung.

Rote Tests (beim Lesen geprüft): Der Unit-Fall (Nachmieter an `a1` → Objekt) war vor dem Fix `null`, weil die Funktion den vierten Parameter nicht kannte und `terminated: false` galt. Der Gegenfall `a2` → `null` sichert die Bindung an die Wohnung. Im Tenant-Detail-Test ist der Vertrag ohne `terminated`, er war vor dem Fix also `null`. Im Dashboard-Test war `former-documents-t9` mit `terminated: false` vor dem Fix nicht vorhanden. Die Prüfung, dass `fixed-term-k9` fehlt, zeigt dazu, dass `expired()` den Nachmieter berücksichtigt.

**C-4 ist behoben.** Der Cast lautet jetzt `Parameters<typeof formerTenantDocuments>[0]` und folgt damit dem Parametertyp, der `terminated`, `movedOut` und `apartmentId` nennt.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | – | src/lib/former-tenant-documents.ts | Behoben (Runde 2). |
| C-2 | Nit | src/lib/overview.ts:228 | Bleibt wie gemeldet. |
| C-3 | – | src/lib/former-tenant-documents.ts:35-38 | Behoben (siehe oben). |
| C-4 | – | src/routes/dashboard/+page.server.ts:126 | Behoben. |
| C-5 | Nit | src/lib/former-tenant-documents.ts, Test | Bleibt wie gemeldet. |
| C-6 | Nit | src/routes/tenants/[id]/+page.server.ts:45-47 | Die Seite wiederholt die `reduce`-Auswahl des letzten Vertrags aus `formerTenantDocuments`. Hat der Mieter einen laufenden Vertrag (`endDate: null`) und davor einen beendeten, hängt das Ergebnis des Vergleichs `> null` von der Reihenfolge ab. Dann kommt eine unnötige Abfrage hinzu, und das gilt auch für einen gekündigten letzten Vertrag. Das Ergebnis bleibt richtig, weil die Funktion in beiden Fällen selbst `null` liefert oder ohne die Wohnungsverträge auskommt. |
| C-7 | Minor | src/routes/tenants/[id]/+page.server.ts:49-51 | Die zusätzliche Abfrage hat keine Fehlerbehandlung. Eine Antwort, die kein JSON ist, oder ein Netzwerkfehler bricht die ganze Mieterseite ab, obwohl die Daten nur für einen Hinweis gebraucht werden (`successorAfter` fängt den Fall mit `.catch(() => null)` ab). Eine Fehlerantwort mit JSON-Body ist harmlos: `contracts` ist dann `undefined`, es greift der Standard `[]`, und der Hinweis bleibt aus. Dasselbe Muster gilt schon für die bestehende Abfrage `contracts?tenantId=`. |

Kein Blocker und kein Major offen.

## Nicht bestätigt

- `bunx vitest run` für former-tenant-documents, tenant-detail, dashboard und overview auf 4db2930: selbst wiederholt, 4 Dateien und 55 Tests grün.
- `bun run lint` und `bun run check` auf 4db2930: vom Aufrufer gemeldet, nicht wiederholt.
- E2E: #178 hat weiterhin «No scenario» (`implementation_plan.md`). Der Fix fügt kein Szenario hinzu, und ich habe kein E2E ausgeführt.
- Dass das Backend `GET /contracts?apartmentId=` mit `limit=100` Verträge aller Mieter der Wohnung liefert: aus Route und Service gelesen (`apartmentId` filtert, `limit` hat keine Obergrenze). Den pg-Contract-Test habe ich nicht ausgeführt.
