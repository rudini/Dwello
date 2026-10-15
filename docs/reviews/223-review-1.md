# Code-Review Slice #223, Runde 1

Commit-Bereich: `beb291b..a7f0dca` (ein Commit, `fix(tests): clean up statements at any hour`), Worktree `review-223-code`.
Gelesene Dateien: `backend/src/__tests__/swiss-today.pg.test.ts` (ganz), `docs/archive/implementation-plan-verlauf.md` (Session 11), dazu `backend/src/db/schema.ts` (Fremdschlüssel von `utility_statements`, `documents`), `backend/src/__tests__/helpers/rental.ts`, `statement.service.ts` (`deleteStatement`), `contract.service.ts` (`deleteContract`).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| N-1 | Minor | docs/archive/implementation-plan-verlauf.md:6283 | Der Planeintrag zu #223 nennt keine `Skills: tdd, ponytail, ponytail-review`, anders als die übrigen Code-Slices derselben Session (z. B. Zeilen 6275–6278). |
| N-2 | Nit | backend/src/__tests__/helpers/rental.ts:24-29 | `remove()` prüft die `{ success }`-Ergebnisse von `deleteContract`/`deleteApartment`/`deleteTenant` nicht; genau deshalb blieben Daten ausserhalb der Stunde 22–24 UTC still liegen. Vorbestehend und nicht Teil der Anforderung; nur als Hinweis (allenfalls offene Arbeit). |

Keine Blocker/Major.

## Bestätigt

- Ursache: `deleteStatement` lehnt Nicht-Entwürfe mit `STATEMENT_NOT_DRAFT` ab (`statement.service.ts:489-492`); `deleteContract` verweigert bei vorhandenen Abrechnungen (`contract.service.ts:384-396`); `utility_statements.apartment_id` ist `restrict` (`schema.ts:328`). Die Darstellung im Auftrag stimmt mit dem Code überein.
- Fix (`swiss-today.pg.test.ts:70-71`): löscht alle Abrechnungen des Mieters direkt. Reihenfolge stimmt: Dokumente (inkl. Mahnungen mit `statement_id`, `restrict`, `schema.ts:442`) werden vorher über `tenantId` gelöscht (Zeile 69; Mahnungsdokumente tragen die `tenantId`, `reminder.service.ts:101`); Positionen kaskadieren (`schema.ts:397`). Danach greifen `deleteContract`, `deleteTenant`, `deleteApartment` ohne Restbestand.
- Die Importe `deleteStatement` und `listStatements` bleiben genutzt (Zeilen 81, 83), nichts Unbenutztes zurückgelassen.
- Diff minimal, keine fremden Änderungen, kein Verhalten der App geändert; `No scenario: a test-only defect` ist begründet (Planzeile 6283).
- Planeintrag mit `Test red` (afterAll um 22:56 UTC, `utility_statements_apartment_id_fkey`) vorhanden.

## Nicht bestätigt

- Rot um 22:56 UTC und grün um 22:57 UTC, Backend `bun run test` 619 pass 0 fail mit Coverage-Floor, type-check, lint: vom Aufrufer gemeldet, nicht wiederholt (Backend-Tests brauchen PostgreSQL und schreiben in `dwello_test`; der Rotlauf ist nur zwischen 22 und 24 UTC reproduzierbar).
