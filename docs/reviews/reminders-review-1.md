# Code-Review Runde 1: Mahnfristen und Postversand (#107, #193, #194)

Worktree `review-reminders-code`, Bereich `87dda97..5fd7b55` (3 Commits, 40 Dateien, alle gelesen).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | `src/routes/statements/[id]/PaymentPanel.svelte:13,47-54`; `backend/src/services/statement.service.ts:45-49` | «Nächste Mahnung möglich ab» erscheint auch bei einer **bezahlten** Abrechnung, solange die Zahlungsfrist der letzten Mahnung läuft. |
| C-2 | Major | `backend/src/__tests__/reminders.pg.test.ts:236-251` | Kein Test zeigt, dass `nextReminderFrom` nach der 3. Mahnung `null` ist (Fachreview: Hinweis nach der 3. Mahnung ausblenden). `count(*) < 3` lässt sich entfernen, ohne dass ein Test rot wird. |
| C-3 | Minor | `docs/api-specification.md:34,230,235` | Nicht nachgeführt: `REMINDER_TOO_EARLY` fehlt in der Liste der Codes (auf die `coded-error.ts:3` verweist). POST `/reminders` nennt die neue 400 nicht. PUT `/documents/:id/sent` beschreibt weder das Neuerstellen des Briefs (#193) noch den Kanal `letter` (#194). Auch `nextReminderFrom` und `paymentDeadline` sind nicht beschrieben. |
| C-4 | Minor | `backend/src/__tests__/reminders.pg.test.ts:368-372` | «ändert einen bereits versendeten Brief nicht mehr» kann nicht rot werden: Ein zweites Neuerstellen am selben Tag ergibt wieder heute + 10. Entweder die Uhr vor dem zweiten PUT verstellen oder den Test streichen. |
| C-5 | Minor | `backend/migrations/0007_reminder_payment_deadline.sql:8-10` | Das Nachtragen der Fristen ist ungetestet. Ausserdem gilt `created_at AT TIME ZONE 'UTC'` nur, wenn die PostgreSQL-Session in UTC lief, als `now()` in die Spalte `timestamp` (ohne Zeitzone) schrieb. Mit einer Server-Zeitzone Europe/Zurich verschiebt sich der Tag bei Mahnungen, die kurz vor Mitternacht entstanden sind. |
| C-6 | Minor | `src/lib/overview.ts:111-113` | Der Abzug zählt `dueStatements` aus beiden Listen, «overdue» **und** «sent», zieht ihn aber nur von `statementCounts.overdue` ab. Hätte eine Abrechnung mit Status «sent» je ein `nextReminderFrom` in der Zukunft, würde die Zahl falsch. Kürzer und sicher: nur die überfälligen Abrechnungen filtern. |
| C-7 | Nit | `backend/src/services/statement.service.ts:46` | ponytail `reuse:` Das Literal `3` dupliziert `MAX_REMINDER_LEVEL` (`reminder.service.ts:27`). Besser die Konstante exportieren und im SQL interpolieren. |
| C-8 | Nit | `tests/e2e/steps/documents.steps.ts:11` | ponytail `reuse:` `swissDate` gibt es schon in `tenant-documents.steps.ts:29`. Besser nach `tests/e2e/fixtures/dates.ts` verschieben. Ebenso `reminders.pg.test.ts:73`: dort `formatSwissDate` aus `services/pdf-format.ts` verwenden. |
| C-9 | Nit | `tests/contracts/statement.json:20` | `nextReminderFrom: "2026-10-27"` bei `reminderSentDate: null` ist ein in sich widersprüchliches Beispiel. Zudem liegt das Datum nur bis zum 27.10.2026 in der Zukunft: Ein künftiger DOM-Test, der sich auf den Hinweis stützt, würde dann kippen. |
| C-10 | Nit | `backend/src/services/reminder.service.ts:145-153` | Wird eine ältere, liegengebliebene Stufe (z. B. eine Zahlungserinnerung, die nach der 2. Mahnung noch «Zu versenden» ist) als versendet markiert, setzt das `reminderSentDate` und eine neue Frist dieser älteren Stufe. Das ist ein Randfall und bleibt hier unbehandelt. |

ponytail-review: Ausser C-7 und C-8 bleibt nichts zu kürzen. `markDocumentPosted` mit `reminderOn` ersetzt den kopierten Briefaufbau statt ihn zu verdoppeln. net: -6 lines possible.

## C-1 (Major): Hinweis auf die nächste Mahnung bei bezahlter Abrechnung

**Warum falsch:** `nextReminderFrom` berechnet das Backend unabhängig vom Status (Unterabfrage auf `documents`, `statement.service.ts:45-49`). `nextReminderLater` (`src/lib/statement.ts:49-52`) prüft nur das Datum. `PaymentPanel` zeigt den Eintrag ohne Statusprüfung. Anders `StatementRow.svelte:61`, das richtig auf `status === 'overdue'` prüft. Wer innerhalb der 10 Tage nach einer Mahnung «Als bezahlt markieren» wählt, sieht im Panel «Zahlung» neben «Bezahlt am …» auch «Nächste Mahnung möglich ab …». Für die Zielgruppe (wenig Erfahrung) ist das eine falsche Handlungsaufforderung. Auch die Anforderung von #107 («schlägt vor diesem Datum keine Mahnung vor») und die Logik «keine Mahnung möglich» werden so widersprüchlich.

**So zeigt man es:** Abrechnung überfällig, Mahnung senden (Frist heute + 10), dann als bezahlt markieren und die Detailseite öffnen: `data-testid="statement-next-reminder"` ist sichtbar. Als DOM-Test: `PaymentPanel` mit `status: 'paid'`, `paidDate` und `nextReminderFrom` in der Zukunft rendern; der Eintrag erscheint.

**Behebung:** Im Backend `nextReminderFrom` nur bei Status sent/overdue liefern, oder im Frontend `nextReminderLater` an `status === 'overdue'` binden. Beides mit Test.

## C-2 (Major): Ausblenden nach der 3. Mahnung ohne Test

**Warum falsch:** Die erste Runde des Fachreviews hat verlangt, dass «Nächste Mahnung möglich ab» nach der 3. Mahnung verschwindet. Umgesetzt ist das nur im SQL-`case when count(*) < 3`. Kein pg-, Unit- oder E2E-Test prüft `nextReminderFrom === null` nach der 3. Stufe. Die TDD-Regel von CLAUDE.md (jedes Verhalten mit einem Test, der rot war) ist hier verletzt. Der Hinweis würde sonst einen Mahnweg nahelegen, den `REMINDER_LIMIT` danach verweigert.

**So zeigt man es:** In `statement.service.ts:46` `case when count(*) < 3 then` durch `case when true then` ersetzen; `bun test src/__tests__/reminders.pg.test.ts` bleibt grün.

**Behebung:** Im Block «Mahnung per Brief» nach der 3. Mahnung `GET /statements/:id` abfragen und `nextReminderFrom` auf `null` prüfen.

## Nicht bestätigt

- Alle vom Aufrufer gemeldeten Prüfungen, **vom Aufrufer gemeldet**, nicht wiederholt: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (2621), `cd backend && bun run test` (691, Abdeckung 94.0 %), E2E chromium (statement-reminder.feature, documents.feature, «Überfällige» der Übersicht, axe- und Sprachzeilen der genannten Bildschirme). Mein Versuch, `bunx vitest run` für `overview.test.ts` und `backend-error.test.ts` erneut laufen zu lassen, scheiterte: `node_modules` des Worktrees verweist auf `/home/user/Dwello/node_modules`, und der Zugriff darauf ist gesperrt.
- Rot-Nachweise nur durch Lesen beurteilt: Rot ohne die Änderung wären die pg-Tests «speichert die Zahlungsfrist», «nennt … nächste Mahnung», «lehnt … ab», «erhält beim Versand das heutige Datum», «gilt als heute gemahnt», «hält den Brief als Versandweg fest», der Unit-Test in `overview.test.ts`, der neue Fall in `backend-error.test.ts` und beide E2E-Szenarien. «erlaubt die nächste Mahnstufe» ist ohne die Änderung grün; das ist als Gegenprobe zulässig. Zu C-4 siehe oben.
- `setSystemTime` im pg-Test (#193) wirkt nur, wenn `callApi` die App im selben Prozess aufruft. Das habe ich angenommen (`helpers/auth`) und nicht geprüft.
- Ob die Formulierung «per Brief.*Versendet» im Szenario #194 genau so in `documents_created_to` steht, habe ich nicht nachgelesen. Das E2E lief laut Aufrufer grün.
- Die Wortwahl von fr/it/en für die neuen Texte habe ich nur auf Vollständigkeit geprüft (alle vier Dateien haben jeden neuen und geänderten Schlüssel), nicht gegen `docs/design/i18n-begriffe.md`.
- «No scenario» für #193 und für die erlaubte 2. Mahnung: Die Begründung (Backend-Uhr und Alter eines Datensatzes im E2E-Stack nicht steuerbar) ist plausibel. Ob `tests/e2e` doch einen Weg dafür hat, habe ich nicht im Detail geprüft (nur `fixtures/backend.ts` gelesen).
