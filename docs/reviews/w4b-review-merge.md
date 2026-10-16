# Review Merge-Commit 6faece6 (W4b #138/#93/#92 mit main W6 #193/#194/#107)

Worktree: `/tmp/claude-0/-home-user-Dwello/3a249483-dd2a-5ba2-b226-2da9cde281a8/scratchpad/review-w4b-merge` (detached, 6faece6). Gelesen: `git show 6faece6` (kombinierter Diff), `git diff 6faece6^1 6faece6` und `git diff 6faece6^2 6faece6` für die konfliktbehafteten und alle Dateien, in denen sich die beiden Features berühren.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | tests/e2e/features/statement-detail.feature:134, tests/e2e/steps/statement-detail.steps.ts:255-257 | Die gemeldete Änderung «Szenario nutzt den bestehenden Schritt ‹sieht der Liegenschaftsverwalter die Fehlermeldung {string}›, eigener Schritt entfernt» (C-17 aus w4b-review-3) ist in 6faece6 **nicht** enthalten: Zeile 134 lautet weiterhin `Dann meldet die Detailseite der Abrechnung "…"`, der doppelte Schritt steht noch in `statement-detail.steps.ts:255`. `git diff 6faece6^1 6faece6 -- tests/e2e/features/statement-detail.feature` ist leer. Vermutlich uncommittet im Arbeitsbaum des Aufrufers. C-17 bleibt offen. |
| C-2 | Minor | backend/src/services/statement.service.ts:47-51, :510-526 | Das Zusammenspiel der beiden Features ist ungetestet: `nextReminderFrom` gilt nur bei `status = 'sent'`, `resetPayment` setzt den Status von `paid` auf `sent` zurück. Bei einer gemahnten und dann bezahlten Abrechnung erscheinen nach dem Zurücksetzen Zahlungsfrist der Mahnung, «Nächste Mahnung möglich ab» und das Sperren der Mahnung (`waiting`) wieder. Der Code verhält sich dabei richtig (die Mahnungen bleiben, die laufende Frist sperrt die nächste Mahnstufe weiterhin), aber kein `*.pg.test.ts` setzt die Zahlung einer gemahnten Abrechnung zurück und prüft `nextReminderFrom` bzw. `REMINDER_TOO_EARLY`. |
| C-3 | Nit | backend/migrations/0008_statement_payment_resets.sql | Umbenennung 0007 -> 0008 ist richtig (sortiert nach `0007_reminder_payment_deadline.sql`, `migrate.ts:19`). Eine lokale Datenbank, die die alte `0007_statement_payment_resets.sql` schon angewandt hat, bricht mit «Migrationen, die es nicht mehr gibt» ab (`migrate.ts:30-35`) und braucht `db:reset`. Betrifft nur Entwicklungs-DBs dieses Branchs (nicht auf main), Test-DBs werden neu erstellt. |
| C-4 | Nit | docs/reviews/w4b-fachreview-2.md:70 | Nennt noch `0007_statement_payment_resets.sql`. Historischer Review-Bericht, kann so bleiben. |

Keine Blocker, keine Major.

## Geprüft und bestätigt (Konfliktauflösung)

- `src/lib/backend-error.ts`: main-Fassung (jeder YYYY-MM-DD-Wert wird formatiert) deckt den `date`-Param von `PAID_DATE_BEFORE_STATEMENT` (`backend_paid_date_before_statement` nutzt `{date}`); `PAID_DATE_INVALID`/`PAID_DATE_IN_FUTURE` senden `date`, die Meldungen verwenden ihn nicht, also unschädlich. Gegenüber Branch-Fassung keine Verhaltensänderung für `date`.
- `src/lib/statement.ts`: `paidDateError(paidDate, statementDate)` (Branch) und `nextReminderLater` (main) beide vorhanden; Aufrufer in `+page.svelte:66` und `:134`, `PaymentPanel.svelte` passen zur Signatur.
- `src/lib/types.ts`: `paymentResets` und `nextReminderFrom` beide im `Statement`; `src/lib/server/statement.ts` mappt beide.
- `StatusActions.svelte`: `waiting` (main) und `onresetpayment` (Branch) beide als Props, `+page.svelte` übergibt beide; im Zweig `paid` wird nie gemahnt, im Zweig `sent/overdue` nie zurückgesetzt, also keine Überschneidung.
- `ResetPaymentDialog.svelte`: vorhergesagter Status nach dem Zurücksetzen (überfällig/versendet nach `paymentDeadline`) stimmt mit der Backend-Berechnung (`statement.service.ts:186-191, 276-282`) überein; die Mahnfrist beeinflusst den Status nicht, nur die Mahnbarkeit.
- `resetPayment` verwirft nur das Abrechnungs-PDF nach Zahlungserfassung; Mahnungs-PDFs (`documents`) bleiben. `markDocumentPosted` (main) liest den Status nicht. Keine Wechselwirkung.
- Migrationen: 0007 (main) ändert `documents`, 0008 (Branch) `utility_statements`; disjunkt, Reihenfolge per Sortierung korrekt, `migrations.pg.test.ts` liest das Verzeichnis dynamisch.
- Verträge: `tests/contracts/statement.json` enthält `nextReminderFrom` und `paymentResets`; `statement-payment-reset.json` wird von der BFF nicht gelesen (`statement-actions.ts:43-45`), das Fehlen von `nextReminderFrom` dort ist daher unkritisch.
- a11y: `screens.json` (beide Bildschirme, `stateMeanings` für `reset-payment-dialog` und `marked-sent`), `accessibility.feature`, `sprachen-bildschirme.feature`, `tests/e2e/fixtures/screens.ts` (`paidStatement`, `remindedStatement`, `remindedLetter`), `tasks/accessibility.ts` (beide Zustände) vollständig zusammengeführt. Seed: Anna 2024 versendet+bezahlt, Bruno 2024 versendet+gemahnt, unterschiedliche Abrechnungen, keine gegenseitige Störung.
- `implementation_plan.md`: nur Branch-Session; die main-Session ist in `docs/archive/implementation-plan-verlauf.md` (aus main).
- Nichts Fremdes in der Konfliktauflösung (kombinierter Diff enthält nur die Konfliktstellen und die Umbenennung).

## Nicht bestätigt

- lint, check, backend type-check, backend `bun run test` (713, Coverage 94.1 %), `bunx vitest run` (2667), E2E statement-detail/documents/statement-reminder (50), axe+Sprachen der drei Statement-Bildschirme (14): vom Aufrufer gemeldet. Ein eigener `bunx vitest run` war nicht möglich (Zugriff auf `node_modules` durch Berechtigungsregel gesperrt).
- Der gemeinsame Seed (`fixtures/screens.ts`) ändert jetzt zwei Abrechnungen 2024 (bezahlt, gemahnt) plus die Heizrechnung 2024 aus main. Andere Bildschirme, die diese Daten zeigen (Abrechnungsliste, Dashboard, Mieterdetail Anna/Bruno, Dokumente), wurden nach dem Merge laut Meldung nicht mit axe/Sprachen geprüft; ich habe nur gelesen, dass ihre Pfade keine dieser IDs als Parameter brauchen.
- Kein E2E-Szenario prüft «Zahlung einer gemahnten Abrechnung zurücksetzen»; ob die Detailseite danach Mahnfrist und gesperrte Mahnung zeigt, nur durch Lesen bestätigt (siehe C-2).
