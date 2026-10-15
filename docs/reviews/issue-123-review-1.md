# Code-Review issue-123, Runde 1

Geprüft: `origin/main..3081abe` (ein Commit, `fix(services): count today from the Swiss day`) im Worktree `review-123-code`. Alle 14 geänderten Dateien gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | implementation_plan.md:8 | Ein Fehler, den der Benutzer sieht (überfällig, Vertrags-, Mieter- und Wohnungsstatus), ist ohne Szenario in `tests/e2e/features` behoben; `No scenario: the backend's clock cannot be set in E2E` ist keine der Ausnahmen aus `CLAUDE.md` (Workflow 1 kennt nur `No scenario: server-side failure`). |
| C-2 | Minor | backend/src/routes/dashboard.ts:114 | Die neue Monatsgrenze für «diesen Monat bezahlt» ist durch keinen Test belegt (der Aufrufer nennt das selbst; `paidThisMonth` ist wegen #93 immer 0). |
| C-3 | Minor | backend/src/routes/contracts.ts:103, backend/src/services/tenant.service.ts:214/278, backend/src/services/apartment.service.ts:274 | Das Standarddatum von `GET /contracts/apartment/:id/active`, die Vertragsgeschichte des Mieters und die Prüfung vor dem Löschen von Mieter und Wohnung zählen jetzt ab dem Schweizer Tag, aber `swiss-today.pg.test.ts` deckt sie nicht ab. Die Done-Kriterien der Issue verlangen sie nicht; ein Fall pro Ort würde die Umstellung festhalten. |
| C-4 | Nit | tests/e2e/steps/statement-generate.steps.ts:266 | `lastYear = new Date().getFullYear() - 1` zählt immer noch ab der lokalen Zeit des Testprozesses. In `dashboard.steps.ts:29` wurde dasselbe Muster auf `inDays(0)` umgestellt. Die Issue nennt diese Datei nicht; nur in der Neujahrsnacht relevant. |

## C-1 (Major): Verhaltensänderung ohne Szenario

**Warum falsch:** Laut `CLAUDE.md` (Workflow 1 und 7) beginnt jede Verhaltensänderung, auch ein Fehler, den der Benutzer sieht, mit einem Szenario in `tests/e2e/features`, das rot notiert wird (`Scenario red: …`). Ohne Szenario geht es nur bei einem Fehler zwischen Serverteilen (`No scenario: server-side failure`). Dieser Fehler zeigt sich in der Oberfläche: Bei einer Abrechnung erscheint der Status «Versendet» statt «Überfällig», ein beendeter Mietvertrag gilt als aktiv, die Wohnung als «vermietet». Die Begründung im Plan (`implementation_plan.md:8`) ist sachlich nachvollziehbar: Die E2E-Server laufen auf der echten Uhr, und ein Szenario wäre nur zwischen 00:00 und 01:00/02:00 Schweizer Zeit rot. Sie gehört aber zu keiner Ausnahme, die die Regeln kennen.

**Nachweis:** `git show 3081abe --stat` ändert keine Datei unter `tests/e2e/features`. Der Plan enthält keine Zeile `Scenario red:`.

**Lösung:** Entweder ein Szenario, dessen Backend-Uhr sich in E2E stellen lässt (zum Beispiel TZ oder Faketime für den Backend-Webserver; das wäre neue Testinfrastruktur), oder die Ausnahme dem Benutzer unter «Blocked on me» vorlegen. In diesem Fall sollte der PR-Text `No scenario: <Grund>` enthalten, wie `tools/open-work/check-issues.mjs` es verlangt. Der Befund passt auch in den Workflow-Review (fehlende Regel für Fehler, die nur zu einer bestimmten Uhrzeit auftreten).

## Bestätigt (Code und Test)

- Ein Helper `backend/src/services/today.ts` (`swissToday`, `daysAfter`, `sqlToday`). Alle Orte aus der Issue verwenden ihn:
  - `statement.service.ts`: `statusCondition`, `listStatements`, `getStatement`, `generateStatement` (Datum und Zahlungsfrist) und `datedToday`
  - `contract.service.ts:89`
  - `routes/contracts.ts:103`
  - `tenant.service.ts`: `isActive`-SQL sowie Zeilen 112, 171, 214 und 278
  - `apartment.service.ts`: `nextContractStart`, `currentContractEnd`, `apartmentStatus` (SQL) sowie Zeilen 172 und 274
  - `routes/dashboard.ts:114`
  - `reminder.service.ts` (Briefdatum, Frist, `reminderSentDate`; `isoDate` entfernt)
- `grep -rn "new Date().toISOString().split('T')\[0\]" backend/src --exclude-dir=__tests__` findet nichts. In den Services gibt es kein `current_date` mehr. Unverändert bleiben, wie verlangt, `fuel-stock.service.ts:28` und `invoice-completeness.service.ts:50`; ebenso `calculation.service.ts:120`, `prorating.service.ts:152` und `demo-data.ts:36`, die mit gegebenen Daten rechnen und nicht mit heute.
- Designwahl `sqlToday`: Ich habe selbst geprüft, dass Drizzle den Wert jedes Mal neu liest, wenn eine Abfrage gebaut wird. Dafür habe ich `PgDialect.sqlToQuery` mit einem Fragment auf Modulebene bei zwei Systemzeiten aufgerufen (Prüfskript nur im Scratchpad). Ergebnis: `x > ($1::date)` mit `["2026-03-29"]` und danach `["2027-01-01"]`. Im Code gibt es kein `.prepare(`, das den Wert einfrieren könnte.
- `swiss-today.pg.test.ts` deckt alle Fälle der Done-Kriterien ab, dazu die Mahnung. Mein eigener Lauf: 6 pass, 0 fail. Die Uhr steht auf 23:30 UTC, also 00:30 oder 01:30 in der Schweiz (in Winter- und Sommerzeit der nächste Tag). Die Fragmente auf Modulebene werden zuvor mit der echten Uhr importiert. Ein Wert, der beim Import eingefroren wäre, liesse den Test deshalb scheitern (ausser bei einem Lauf zwischen 22:00/23:00 und 24:00 UTC).
- `reminder.service.ts`: `formatSwissDate(today)` erzeugt dasselbe Format `TT.MM.JJJJ` wie vorher `toLocaleDateString('de-CH')`.
- E2E: `statements.steps.ts:37`, `dashboard.steps.ts:29` und `fixtures/backend.ts:266` zählen ab `inDays(0)` (Schweizer Tag, `tests/e2e/fixtures/dates.ts`). Die Steps rufen weiterhin nur Seed, Tasks und Questions auf.
- Doku: `backend/CLAUDE.md:38`.
- Plan: enthält `Skills: tdd, ponytail, ponytail-review` und eine `Test red`-Zeile mit der Meldung jedes Falls.
- Keine Texte und keine UI geändert. `messages/*.json`, a11y und Verträge sind nicht betroffen, weil sich keine API-Antwort in ihrer Form ändert. Kein Diff ausserhalb der Anforderung (`datedToday` nutzt jetzt den gemeinsamen Helper und verhält sich gleich wie vorher).

## Nicht bestätigt

- `bun run test:coverage`, `bun run lint`, `bun run check`, Backend `bun run test` (560 pass) und `bun run type-check`, `bun run deepcheck:audit`, E2E chromium+api für dashboard, statements, statement-reminder, contracts, contract-detail, tenants und apartments (88 passed): vom Aufrufer gemeldet, nicht erneut ausgeführt. Erneut ausgeführt habe ich nur `bun test src/__tests__/swiss-today.pg.test.ts` (grün).
- Dass der pg-Test vor der Änderung in allen 6 Fällen rot war: vom Aufrufer gemeldet. Ich habe den Code nicht zurückgesetzt, weil der Worktree nur gelesen wird. Plausibel ist es durch den Mechanismus (`current_date` der Session in UTC, `toISOString` des UTC-Tags).
- Dashboard-Monatsgrenze (C-2): nur durch Lesen des Codes geprüft (`dashboard.ts:114`, `:131`).
