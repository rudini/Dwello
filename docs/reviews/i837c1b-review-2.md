# Code-Review #837 Zyklus 1b, Runde 2 (Abschlussrunde vor dem Push)

Bereich: `git diff 881b3a5f 3c5da6e6` (ohne `docs/reviews`, `implementation_plan.md`, `docs/archive`), Worktree `review-i837c1b-close`. Vorheriger Bericht: `docs/reviews/i837c1b-review-1.md`.

## Status der offenen IDs

| ID | Schwere | Status |
|---|---|---|
| C-1 | Minor | Geschlossen: `DocumentFilters.status?: DocumentStatus` (`backend/src/services/document.service.ts:18`), Cast und falscher Kommentar entfernt (:76). |
| C-2 | Minor | Geschlossen: `docs/architecture/fitness-functions.md:13-14` nennen 50 Datei-Tabelle-Paare und 13 Listen, mit Vorwerten. |

## Neue Befunde

Keine.

Geprüft: Die Route `backend/src/routes/documents.ts:52-58` validiert `status` als `t.Union([t.Literal('sent'), t.Literal('to_send')])`, deckungsgleich mit `DocumentStatus = 'sent' | 'to_send'` (`backend/src/db/schema.ts:99`); `tenantId`/`statementId` als optionale Strings passen zu `DocumentFilters`, `listDocuments(query)` ist damit typ- und laufzeitsicher; die Route ist der einzige Aufrufer (keine direkten Aufrufe in `backend/src/__tests__`); ein unbekannter Status endet an der Validierung, nicht in der Abfrage. Die Delta enthält sonst nur Berichte, Plan und Archiv; nichts Fremdes.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht wiederholt: `cd backend && bun run type-check` (pass), `bun tools/fitness/fitness.ts` (4/13/36, Spiegel 50, Listen 13), `bun run lint` (pass). Die Typverträglichkeit von Elysias abgeleitetem `query`-Typ mit `DocumentFilters` habe ich nur gelesen, ohne Type-Check.
