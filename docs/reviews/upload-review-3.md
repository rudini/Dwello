# Code-Review Runde 3: Merge von origin/main (#182) in #174 (Commit 461bd8b)

Geprüft im Worktree `review-merge-code` (461bd8b, detached): `git diff 461bd8b^1 461bd8b` (was main bringt), `git show 461bd8b --cc` (Auflösung), dazu `git diff 461bd8b^2 461bd8b` (was der Zweig gegenüber main hat) und die Merge-Basis 74491f8.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-15 | Minor | docs/archive/implementation-plan-verlauf.md (Session 37, Punkt «Before marking complete») | Der Merge von #182 und diese Review-Runde stehen nirgends im Plan. Die archivierte Session 37 nennt als letzten Merge noch #181 und «backend test (569 …)». Auf 461bd8b laufen laut Aufrufer 578 Tests. Nach der Triage einen Planeintrag ergänzen: Merge #182, Konfliktauflösung, Checks, Zeile «code-reviewer round 3». |

Keine Blocker und keine Major.

## Geprüft und bestätigt

- **Konflikt 1, `backend/src/services/tenant.service.ts` `deleteTenant`:** Die Auflösung behält die Entfernung der Prüfung auf laufende Verträge. Damit fällt mains `swissToday()` an dieser Stelle weg. Das Verhalten bleibt gleich: Die folgende Prüfung lehnt jeden Mieter mit irgendeinem Vertrag ab (gleicher Status 400 in `backend/src/routes/tenants.ts:111-115`, die Route unterscheidet nur «Tenant not found»). Der Datumsvergleich war deshalb nie entscheidend. Mains übrige Änderungen in dieser Datei sind alle übernommen: `isActive` mit `sqlToday`, `listTenants`, `getTenant` und `getTenantWithHistory` mit `swissToday()`. Ebenso die Änderungen des Zweigs: Import `documents` und die Transaktion, die hochgeladene Dokumente mitlöscht. `sql`, `and` und `swissToday` werden weiter verwendet, Lint und check sind vom Aufrufer als grün gemeldet.
- **Konflikt 2, `implementation-plan-verlauf.md`:** Beide Sessions stehen vollständig darin (mains #123 vor Session 37), es fehlt keine Zeile (`git diff` gegen beide Eltern: 0 entfernte Zeilen).
- **Automatisch zusammengeführte Dateien, die beide Seiten geändert haben** (bestimmt über die Merge-Basis 74491f8): `reminder.service.ts`, `tenant.service.ts`, `implementation-plan-verlauf.md`, `offene-punkte.md`, `tests/e2e/fixtures/backend.ts`. In jeder fehlt keine Zeile einer Seite:
  - `reminder.service.ts`: mains `swissToday`/`daysAfter`/`formatSwissDate` und das `content:` des Zweigs (statt `pdf:`) stehen beide darin.
  - `offene-punkte.md`: mains O-13-Ergänzung und die neuen Zeilen U-29 und O-19 des Zweigs stehen beide darin.
  - `fixtures/backend.ts`: mains `inDays(0)` in `supplierInvoice` und `upload()` des Zweigs stehen beide darin.
- **Passt der Code des Zweigs zum Swiss-«heute» von main?**
  - Der Upload-Code schreibt kein Kalenderdatum. `created_at` ist ein Zeitpunkt, `formatDate` zeigt ihn in Europe/Zurich (`src/lib/utils/format.ts:43-51`).
  - Die E2E-Schritte «heute hochgeladen» vergleichen mit `inDays(0)`, also dem Schweizer Tag (`tests/e2e/fixtures/dates.ts:2`, `tenant-documents.steps.ts:85,134`). Das stimmt überein.
  - Das Demo-Dokument hat einen festen Zeitstempel (`backend/demo/demo-data.sql:220-222`).
  - `tenant-documents.pg.test.ts` hängt von keinem Datum ab.
  - In den Änderungen des Zweigs an `src`, `tests` und `backend` kommt kein neues `toISOString()` des aktuellen Zeitpunkts, kein `getFullYear()` und kein `current_date` vor. Die Treffer im Backend (`calculation.service.ts`, `prorating.service.ts`, `invoice-completeness.service.ts`, `fuel-stock.service.ts`, `db/demo-data.ts`) stammen von main und betreffen feste Perioden, nicht «heute».
- **Mains `swiss-today.pg.test.ts`** löscht im `afterAll` Dokumente nach `tenantId`. Das funktioniert auch mit dem geänderten Schema des Zweigs (`content`, nullable `channel`/`status`), und Mahnungen entstehen über `createDocument` mit `content`.

## Nicht bestätigt

- lint, check, backend test (578 pass) und type-check sowie test:coverage (2372) auf 461bd8b: vom Aufrufer gemeldet, nicht selbst wiederholt.
- E2E: auf Anweisung nicht ausgeführt. Ob die Szenarien zu Mietern, Dokumenten und Dashboard auf dem Merge grün laufen, ist nicht bestätigt. Gelesen habe ich nur die Schritte (`tenant-documents.steps.ts`, `dashboard.steps.ts`, `statements.steps.ts`, `statement-generate.steps.ts`).
- deepcheck:audit und fallow auf dem Merge-Commit: vom Aufrufer nicht gemeldet, nicht ausgeführt.
- Ob ein Test zeigt, dass ein Mieter mit *laufendem* Vertrag abgelehnt wird: Im Backend habe ich keinen gefunden (gesucht in `backend/src/__tests__` nach `deleteTenant` und «contract history»). Die Ablehnung deckt die Prüfung auf irgendeinen Vertrag ab, das wurde schon in Runde 1 entschieden. Kein neuer Befund aus dem Merge.
