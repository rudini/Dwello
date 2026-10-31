# Code-Review 534/968/965, Runde 1

Worktree `/tmp/claude/review-534-code` bei `b2c4759`, Bereich `317df92..b2c4759` ohne `docs/reviews` und `implementation_plan.md`.

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-1 | Major | `src/routes/statements/[id]/+page.svelte:320`, `ReminderModal.svelte:22` | Der Mahn-Dialog bestimmt die Mahnstufe aus allen Mahnungen der Abrechnung, auch denen von vor dem erneuten Zustellen. Er nennt «2. Mahnung senden», obwohl das Backend eine Zahlungserinnerung erstellt. Nach drei früheren Mahnungen sagt er «keine weitere Mahnung möglich», obwohl das Backend eine erlaubt |
| C-2 | Major | `backend/src/services/statement-send.service.ts:132-134` | `redeliverByLetter` setzt Abrechnungsdatum und Zahlungsfrist neu und verwirft das PDF, bevor `pdfOf` das PDF erstellt. Fehlt die IBAN oder scheitert das PDF, ist die Abrechnung trotzdem neu datiert, ohne Dokument per Brief. Frühere Mahnungen zählen dann weiter |
| C-3 | Major | `backend/src/services/document.service.ts:181`, `backend/src/services/statement.service.ts:67`, `backend/src/__tests__/statement-mail.pg.test.ts:335` | Den Kern von M-1 prüft kein Test: dass nach dem erneuten Zustellen eine versendete frühere Mahnung nicht mehr zählt (die nächste ist die Zahlungserinnerung, nach Zahlungsfrist + Mahnfrist). Nimmt man `sinceDelivery` aus `countReminders` und `nextReminderFrom` heraus, bleiben alle Tests grün. Der Testtitel «zählt eine frühere Mahnung nicht mehr» verspricht diese Prüfung |
| C-4 | Minor | `backend/src/services/statement.service.ts:70-74` | `reminderSentDate` zählt weiter Mahnungen von vor dem erneuten Zustellen; der Fix von M-1 im Fachreview nennt es ausdrücklich. Die Liste zeigt bei einer neu zugestellten und wieder überfälligen Abrechnung «Gemahnt am <altes Datum>» (`StatementRow.svelte:62`), das Zahlungspanel «Letzte Mahnung» ebenso |
| C-5 | Minor | `backend/src/routes/statements.ts:248`, `statement-send.service.ts:145` | Ändert man die Bemerkung einer bezahlten oder erledigten Abrechnung, liefert `pdfChangeOf` einen Wert, und `keepNewPdf` legt ein Dokument «Nebenkostenabrechnung, neues PDF» «Zu versenden» an. Es ist sofort «Nicht mehr versenden: bezahlt» und kann nie hinausgehen. Unter «Dokumente» (alle) und im Mieter-Export bleibt es trotzdem stehen |
| C-6 | Minor | `backend/src/routes/statements.ts:248-254` | Wirft `keepNewPdf` (z. B. eine abgewiesene IBAN beim PDF), antwortet PUT mit 400 «Failed to update statement», obwohl die Änderung schon gespeichert ist |
| C-7 | Minor | `src/routes/statements/[id]/MetadataCard.svelte:68-70`, `backend/src/services/reminder.service.ts:189` | Nach dem erneuten Zustellen und nach «Neues PDF als versendet markieren» ist das PDF kurz vor dem `sentAt` des Dokuments erstellt (`generateStatementPdf`), also kein «neues» PDF. Der Verlauf zeigt deshalb «PDF erstellt <heute>» vor «Versendet per E-Mail <vor 40 Tagen>». Die Reihenfolge stimmt nicht mehr |
| C-8 | Minor | `backend/src/services/delivery.ts:27`, `+page.server.ts:44-47` | Eine vor #449 per Brief versendete Abrechnung (ohne Dokument), die erneut zugestellt wird: Das Dokument des erneuten Zustellens gilt als erster Versand. Der Verlauf zeigt nur «Versendet per Brief <heute>» und nicht beide Wege, wie #534 entschieden hat |
| C-9 | Minor | `statement-send.service.ts:132,135`, `reminder.service.ts:186-190`, `src/lib/document-status.ts:13`, `statement-mail.pg.test.ts:320` | Für diese geänderten Zeilen fehlt ein Test: (a) eine spätere Zahlungsfrist bleibt beim erneuten Zustellen (V-2, vom Fachreview als Test verlangt); (b) das erneute Zustellen verwirft ein neues PDF «Zu versenden»; (c) `NEW_PDF_STATEMENT_REPLACED`, `NEW_PDF_NOT_MADE`; (d) die Beschriftung «Nicht mehr versenden: Abrechnung erneut per Brief zugestellt»; (e) «the PDF made anew, with the new date» prüft nur, dass sich die Inhalte unterscheiden, nicht das Datum |
| C-10 | Minor | `tests/e2e/features/statement-detail.feature:1261`, `tests/e2e/features/statement-redeliver.feature:51` | Zwei neue Negativ-Szenarien bestehen schon auf dem Basis-Commit. «Ein neues PDF einer inzwischen bezahlten Abrechnung …» prüft nicht vor der Zahlung, dass das neue PDF zu versenden war. Ohne `keepNewPdf` gibt es kein Dokument, und die Prüfung «nicht mehr zu versenden» ist leer erfüllt. «Eine bezahlte Abrechnung lässt sich nicht erneut zustellen» ist ohne die Funktion ebenfalls grün |
| C-11 | Minor | `tests/e2e/tasks/statement-detail.ts:107` | `markNewPdfSent` ist nur ein Klick auf einen asynchronen Formularschritt und wartet nicht auf den erreichten Zustand (Hinweis weg oder Verlaufszeile da) |
| C-12 | Minor | `docs/api-specification.md:39`, `:322`, `:326` | Die Fehlercodes `STATEMENT_NOT_REDELIVERABLE`, `REMINDER_STATEMENT_REDELIVERED`, `NEW_PDF_STATEMENT_PAID/_REPLACED`, `NEW_PDF_NOT_MADE` fehlen in der Codeliste. `GET /documents` nennt `notToSend` weiter als `paid\|replaced\|null`, nur für Mahnungen. `PUT /documents/:id/sent` beschreibt das neue PDF nicht |
| C-13 | Minor | `tests/e2e/features/statement-detail.feature:1233` | Der Kommentar «#524: eine neue Zahlungsfrist kennt der Mieter erst aus dem neuen PDF» steht jetzt über den #968-Szenarien und nicht mehr über «Nach einer neuen Zahlungsfrist rät Dwello …» (`:1273`) |
| C-14 | Minor | `tests/contracts/statement.json:59`, `src/__tests__/statement-pages.dom.test.ts:1868` | Der Vertrag hat `resent: []`, deshalb prüft `api-contracts.pg.test.ts` die Form der Einträge `{ id, newPdf, sentAt }` nicht. Der DOM-Test baut die Einträge von Hand, nicht aus dem Vertrag |

## C-1 (Major): Mahnstufe im Dialog zählt Mahnungen von vor dem erneuten Zustellen

**Warum falsch.**
- `+page.svelte:320` übergibt `sentReminders={data.reminders.length}`. Darin sind alle Dokumente `type = 'reminder'` der Abrechnung (`+page.server.ts:42`).
- `ReminderModal.svelte:22` nimmt `TITLES[sentReminders]` als nächste Mahnstufe und zeigt bei `undefined` den Dialog «keine weitere Mahnung».
- Das Backend zählt seit diesem Diff nur Mahnungen seit dem letzten Abrechnungs-Dokument (`countReminders` mit `sinceDelivery`).
- Genau im Fall von M-1 (eine Zahlungserinnerung ging hinaus, danach wird erneut zugestellt) bestätigt der Liegenschaftsverwalter deshalb «2. Mahnung senden». Dwello erstellt aber eine Zahlungserinnerung.
- Nach drei früheren Mahnungen verweigert der Dialog die Mahnung, obwohl Dwello sie anbietet (`reminderDue`). Die Bestätigung nennt also nicht die echte Folge.

**So zeigt es sich.**
- Szenario, wie es das Fachreview zu M-1 vorschlug («Nach dem erneuten Zustellen beginnt das Mahnen wieder mit der Zahlungserinnerung»): Brief-Mieter, Zahlungserinnerung senden und als versendet markieren, erneut zustellen, Zahlungsfrist + Mahnfrist in die Vergangenheit legen. «Mahnung senden» zeigt dann «2. Mahnung senden».
- Eine Ebene tiefer: ein DOM-Test mit zwei Mahnungen in `reminders` und einer Mahnstufe vom Backend.
- Fix: Die Mahnstufe kommt vom Backend (z. B. der `countReminders`-Wert in `getStatement`), statt sie im Frontend zu zählen.

## C-2 (Major): Halbes erneutes Zustellen bei einem PDF-Fehler

**Warum falsch.**
- `redeliverByLetter` schreibt `statementDate`, `paymentDeadline`, `pdfBlob: null` (Zeile 132-133) und ruft erst danach `pdfOf(id)` (Zeile 134).
- `pdfOf` wirft `IBAN_MISSING`, wenn `qrBillConfig()` leer ist. Dasselbe gilt für eine abgewiesene IBAN und jeden Render-Fehler aus `generateStatementPDFBase64`. Für eine versendete Abrechnung macht `discard` nichts rückgängig (`statement-pdf.service.ts:318-321`).
- Danach meldet die UI einen Fehler. Die Abrechnung trägt aber schon das neue Abrechnungsdatum und die neue Zahlungsfrist, ohne Dokument per Brief. Ohne ein neues Abrechnungs-Dokument zählen die früheren Mahnungen weiter (`sinceDelivery`), und der Verlauf nennt kein erneutes Zustellen.
- Der Mieter hat keinen Brief, und die Zahlungsfrist ist trotzdem verschoben.
- `sendByLetter` macht es in der richtigen Reihenfolge: erst das PDF, dann den Status.

**So zeigt es sich.**
- `*.pg.test.ts`: Abrechnung per Brief versenden und auf ein altes Datum setzen, dann die IBAN-Konfiguration entfernen und `POST /statements/:id/redeliver` aufrufen.
- Die Antwort ist 400 `IBAN_MISSING`, aber `GET /statements/:id` liefert `statementDate = heute` und die neue `paymentDeadline`.
- Fix: die Schritte in eine Transaktion legen, oder die IBAN vor dem Schreiben prüfen und bei einem Fehler die alten Daten zurückschreiben.

## C-3 (Major): Mahnstufen nach dem erneuten Zustellen ungetestet

**Warum falsch.**
- Entschieden in #534: «only reminders sent after it count for the next Mahnstufe».
- Die pg-Tests prüfen nur die Mahnung «Zu versenden»: die Abweisung `REMINDER_STATEMENT_REDELIVERED`, `reminderToSend = false` und dass sie in `status=to_send` fehlt.
- Ungetestet sind `countReminders` (Mahnstufe 1 nach dem erneuten Zustellen) und `nextReminderFrom`. Daran hängen die schädlichen Fälle von M-1: die sofort fällige «2. Mahnung» ohne Mahnfrist, und dass nach drei Mahnungen keine mehr möglich ist.
- Das E2E-Szenario von M-1 prüft ebenfalls nur die Mahnung «Zu versenden».
- Ohne Test bliebe auch C-1 unentdeckt.

**So zeigt es sich.** Den Filter `sinceDelivery(statementId)` in `countReminders` (Zeile 181) und in `nextReminderFrom` (Zeile 67) entfernen: Kein Test wird rot.

**Fix.** Ein pg-Test:
1. Mahnung versenden (Mieter mit E-Mail, oder per Brief und als versendet markiert).
2. Erneut zustellen.
3. Prüfen, dass `nextReminderFrom` `null` ist.
4. Zahlungsfrist + Mahnfrist zurücksetzen, dann `POST /reminders` aufrufen und `reminderLevel = 1` erwarten.

Dazu das Szenario aus dem Fachreview.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - `bun run lint`, `bun run check`, Backend `bun run type-check`, `bun run fitness`
  - `bunx vitest run --changed origin/main` (3845)
  - Backend `bun test` `statement-mail.pg.test.ts`, `reminders.pg.test.ts`, `api-contracts.pg.test.ts`
  - E2E chromium der Features statement-redeliver, statement-detail, statement-reminder, documents, statement-send, statement-edit, dashboard (201 bzw. 4 bestanden)
  - axe-/Sprach-Zeilen statement-sent-detail, documents, statement-reminded-detail (26 bestanden)
  - dass jeder neue Test rot gesehen wurde
- Ob `statement-sent-detail default` und `documents default` mit dem neuen PDF «Zu versenden» noch eine Zeile für die Variante ohne Hinweis brauchen: Laut den Seeds in `tests/e2e/fixtures/screens.ts:115-150` zeigen sowohl Bruno 2025 als auch Bruno 2024 nun den Hinweis. Eine versendete Detailseite ohne ihn habe ich in `screens.json` nicht gesucht.
- Ob `formatDate(delivery.sentAt)` für das erste Brief-Dokument mit dem früheren Wert (`statementDate`) bei allen Daten von vor #534 übereinstimmt: Beide werden am selben Tag gesetzt (`sendByLetter`). Bestehende Daten in Produktion habe ich nicht geprüft.

Geprüft: SQL von `sinceDelivery`, bezogen auf die äussere Tabelle in `notToSend`, `nextReminderFrom` und `reminderToSend`; `datedToday` (V-2) und die Reihenfolge der `notToSend`-Gründe; dass alle neuen Schlüssel und alle neuen `backend_<code>`-Texte in allen vier `messages/*.json` stehen; die Glossarzeilen gegen die Entscheide in #534 und #965; die geänderten #524-Zeilen gegen V-4 in #968; Tokens und `src/lib/ui` in `NewPdfToSend.svelte` und `MoreActions.svelte`; die Screenplay-Schichten der neuen Schritte; `e2e-sent-days-ago` nur auf der E2E-Datenbank.
