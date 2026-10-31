# Code-Review 534/968, Runde 2

Worktree `/tmp/claude/review-534-code2` bei `2b9d542`, Delta `b2c4759..2b9d542` ohne `docs/reviews` und `docs/design/personas`. Vorheriger Bericht: `docs/reviews/534-review-1.md`.

Geschlossen: C-1, C-2, C-4, C-5, C-6, C-7, C-13

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-3 | Major | `backend/src/services/document.service.ts:182`, `backend/src/services/reminder.service.ts:74`, `backend/src/__tests__/statement-mail.pg.test.ts:386` | Weiter offen, jetzt enger. Der neue Test prüft `remindersCounted` (die Zahl, die der Dialog zeigt) und `nextReminderFrom`. Ungeprüft bleibt `countReminders`, und daraus bestimmt `POST /reminders` die Mahnstufe, die es erstellt. Nimmt man `sinceDelivery` aus `countReminders` heraus, bleibt jeder Test grün |
| C-15 | Major | `src/routes/documents/MarkSentButton.svelte:19-28`, `src/routes/statements/[id]/NewPdfToSend.svelte:20-29` | Die beiden neuen Bestätigungen übergeben `ActionDialog` kein `error`. Weist Dwello das Markieren ab, bleibt der Dialog offen und nennt keinen Grund. Die Meldung steht nur hinter dem modalen Dialog, auf der inerten Seite |
| C-16 | Minor | `src/lib/server/statement.ts:124`, `tests/contracts/statement.json`, `docs/api-specification.md:278` | Das neue Antwortfeld `remindersCounted` fehlt im Vertrag (`statement.json`, `statement-updated.json`, `statements.json`) und in der API-Spezifikation. Kein Frontend-Test liest es aus einem Vertrag. Fehlt das Feld in der Antwort, macht `?? 0` daraus stillschweigend die Zahlungserinnerung |
| C-17 | Minor | `backend/src/services/statement-send.service.ts:136-139`, `:162`; `backend/src/services/statement.service.ts:74`; `backend/src/routes/statements.ts:249` | Für diese Fixes fehlt ein Test: (a) das Zurückschreiben bei einem Renderfehler. Der neue C-2-Test trifft nur die Vorprüfung in `:133`; ohne `.catch` in `:136` bleibt er grün, obwohl das Zurückschreiben `IBAN_INVALID`, `CREDITOR_ADDRESS_MISSING` und jeden Renderfehler abdeckt. (b) `reminderSentDate` seit dem letzten Versand (C-4). (c) Kein neues PDF für eine bezahlte oder ersetzte Abrechnung (C-5). (d) Ein Fehler von `keepNewPdf` wird nur protokolliert (C-6) |
| C-11 | Minor | `tests/e2e/tasks/statement-detail.ts:108-109`, `tests/e2e/tasks/documents.ts:12-13` | Noch offen, jetzt auch in `markLetterSent`. Beide Tasks klicken die Bestätigung, die das Formular abschickt, und warten danach nicht auf den erreichten Zustand |
| C-12 | Minor | `docs/api-specification.md:322` | Nur teilweise behoben. Die Zeile `GET /documents` nennt `notToSend` weiter als `paid\|replaced\|null`, nur für Mahnungen. Es fehlen `redelivered` und das neue PDF; die Zeile `PUT /documents/:id/sent` nennt sie inzwischen |
| C-8 | Minor | `backend/src/services/delivery.ts:27` | Unverändert, wie in Runde 1 |
| C-9 | Minor | `statement-send.service.ts:132,135`, `reminder.service.ts:186-190`, `src/lib/document-status.ts:13` | Die Punkte (a) bis (e) aus Runde 1 haben weiter keinen Test |
| C-10 | Minor | `statement-detail.feature:1261`, `statement-redeliver.feature:51` | Unverändert, wie in Runde 1 |
| C-14 | Minor | `tests/contracts/statement.json:59` | Unverändert, wie in Runde 1 |

## C-3 (Major): Die Mahnstufe, die das Backend erstellt, bleibt nach dem erneuten Zustellen ungeprüft

**Warum falsch.**
- Die Mahnstufe wird jetzt an zwei Stellen gezählt, mit derselben Bedingung:
  - `remindersCounted` (`statement.service.ts:77-80`, neu) liefert die Zahl für den Dialog.
  - `countReminders` (`document.service.ts:178-184`) liefert die Mahnstufe, die `nextLevel` tatsächlich erstellt (`reminder.service.ts:74`).
- Der neue pg-Test prüft nur die erste Stelle. Gehen die beiden auseinander, nennt der Dialog «Zahlungserinnerung senden», und Dwello erstellt eine «2. Mahnung». Das ist genau der Widerspruch aus C-1, und kein Test zeigt ihn.
- Das Kernstück des Entscheids in #534 («only reminders sent after it count for the next Mahnstufe») ist damit für das Backend weiter ungetestet.

**So zeigt es sich.** `sinceDelivery(statementId)` aus `document.service.ts:182` entfernen. `statement-mail.pg.test.ts` und `reminders.pg.test.ts` bleiben grün.

**Fix, der zugleich die Kopie entfernt.**
- `nextLevel` liest `statement.remindersCounted`; das `statement` kommt schon aus `getStatement` (`reminder.service.ts:134`).
- `countReminders` fällt weg. Der bestehende Test deckt dann beide Stellen ab.
- Alternativ den Test erweitern: nach dem erneuten Zustellen `paymentDeadline` vor die Mahnfrist legen, `POST /statements/:id/reminders` aufrufen und `reminderLevel = 1` erwarten.

## C-15 (Major): Abweisung beim Markieren als versendet verdeckt

**Warum falsch.**
- `ActionDialog` schliesst nur bei Erfolg (`src/lib/ui/ActionDialog.svelte:66-67`).
- Bei einer Abweisung zeigt er den Grund nur über die Prop `error` (`:87-89`) und legt den Fokus darauf (`showRefusal`). `MarkSentButton` und `NewPdfToSend` übergeben kein `error`.
- Die Meldung der Action (`form.actionError`) erscheint deshalb nur auf der Seite:
  - Dokumente: `src/routes/documents/+page.svelte:70-73`
  - Abrechnungsdetail: `src/routes/statements/[id]/+page.svelte:221-225`
- Beide Meldungen stehen hinter dem offenen modalen Dialog. `Dialog.svelte:53-62` setzt die Seite dabei auf `inert`.
- Der Liegenschaftsverwalter sieht also einen Dialog, der nach dem Klick offen bleibt und nichts sagt. Der Screenreader hört nichts, und der Fokus bleibt auf dem Knopf.
- Vor dem Diff schickte der Knopf das Formular direkt ab, und die Meldung war die sichtbare Antwort.
- Die Abweisungen sind reale Fälle:
  - `REMINDER_STATEMENT_PAID`, `REMINDER_STATEMENT_REPLACED`, `REMINDER_STATEMENT_REDELIVERED`, `NEW_PDF_STATEMENT_PAID`/`_REPLACED`, wenn die Liste in einem älteren Tab offen war
  - `CREDITOR_ADDRESS_MISSING` beim Neuerstellen der Mahnung
  - `NEW_PDF_NOT_MADE`
- Das verstösst gegen «errors say what happened and what to do».
- Die Szenarien `statement-reminder.feature:116` und `:125` bleiben grün. `errorMessageShown` findet die Meldung hinter der Überlagerung, weil Playwright Verdecken nicht als unsichtbar zählt. Die Szenarien zeigen den Fehler deshalb nicht.

**So zeigt es sich.**
- E2E: Im Szenario `:116` nach der Abweisung prüfen, dass der Dialog geschlossen ist oder dass die Meldung im Dialog steht (`document-mark-sent-confirm` ist weiter sichtbar, im Dialog fehlt `form-error`).
- Eine Ebene tiefer: ein DOM-Test, der den Dialog öffnet, eine `failure`-Antwort von `enhance` liefert und im Dialog `form-error` erwartet.

**Fix.**
- Unter «Dokumente» `form?.actionError` als `error` an `MarkSentButton` und `ActionDialog` weitergeben.
- Auf der Detailseite `NewPdfToSend` auf `FormDialog` umstellen (schliesst nach jeder Antwort, wie «Erneut per Brief zustellen» in `MoreActions.svelte:64`), oder ebenfalls `error` übergeben.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - lint, check, Backend type-check, fitness
  - `bunx vitest run --changed origin/main` (3848)
  - Backend `statement-mail.pg.test.ts` und `reminders.pg.test.ts` (67)
  - E2E chromium statement-redeliver, statement-detail, statement-reminder, documents, statement-send, dashboard (197)
  - axe-/Sprach-Zeilen von statement-sent-detail und documents (26)
  - dass die neuen Tests zu C-2, C-3/C-1, P-1, P-3, P-7 und P-2 vor ihrem Fix rot waren
- Nicht als gelaufen gemeldet: `api-contracts.pg.test.ts`. Er ändert sich durch das neue Feld nicht, weil `drift` zusätzliche Felder zulässt (`backend/src/__tests__/api-contracts.pg.test.ts:40-54`).
- Ob die Seeds für `documents mark-sent-dialog` (`.first()` in `tests/e2e/targets/accessibility.ts:45`) immer einen Brief «Zu versenden» haben: Ich habe nur gelesen, dass der Zustand über `openDialog` geöffnet wird. Die Seeds in `tests/e2e/fixtures/screens.ts` habe ich nicht erneut durchgesehen.

Geprüft:
- `qrBillConfig` als Vorprüfung entspricht `generateStatementPdf`, das ohne IBAN für jeden Status `no-iban` liefert.
- `redeliverable` beruht auf dem gespeicherten Status `sent`, schliesst also überfällige Abrechnungen ein.
- `sinceDelivery` in `reminderSentDate` und `remindersCounted`.
- `paymentDeadline` nur für Mahnungen; `DocumentItem.svelte:47` ist der einzige Leser im Frontend.
- Die Verlaufszeile in `MetadataCard.svelte:69`.
- Die neuen Texte in allen vier `messages/*.json`.
- Die Zeilen in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`.
- Die Screenplay-Schichten der neuen Targets und Tasks.
- `statement-redeliver.feature` ist neu in diesem Pull Request und darf sich ändern.
