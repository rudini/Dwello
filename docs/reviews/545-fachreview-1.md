# Fachreview #545 (Schritt 1), Runde 1

Gegenstand: `git diff origin/main ad6d866 -- tests/e2e/features/statement-reminder.feature` im Worktree `/tmp/claude/main-review-545-fach` (ad6d866).

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Der vorgeschlagene Text im Panel «Zahlung» sagt «markieren …, sobald Sie sie abgeschickt haben». Das kehrt die Reihenfolge um, die Dwello überall sonst vorgibt (zuerst markieren, dann ausdrucken). |
| V-2 | Verwalter / Mietrecht | Major | `reminderToSend` bleibt nach der Zahlung oder Ersetzung wahr. Wenn der Hinweis «zum Versand bereit» an diesem Feld hängt, fordert er zum Versand eines Briefs auf, den Dwello mit «Nicht mehr versenden» führt und dessen Markieren es ablehnt. Szenario 3 prüft das nicht. |
| V-3 | Verwalter | Major | Bei bestehenden Abrechnungen steht in `reminder_sent_date` schon das Erstellungsdatum nie versendeter Briefe. Ohne Datenmigration zeigen bezahlte und wartende Abrechnungen weiter dieses Datum als «Letzte Mahnung» bzw. «Gemahnt am». |
| V-4 | Verwalter | Minor | Die neuen Szenarien 2 und 3 verwenden mit Brief den Schritt «hat … bereits eine Zahlungserinnerung erhalten», obwohl der Brief nie zur Post ging (Kommentar Z. 154 und «Dann nennt … keine letzte Mahnung»). Abhilfe: neuer Schritt «Und für die Abrechnung 2024 von "Anna Keller" liegt eine Zahlungserinnerung als Brief zum Versand bereit» mit demselben `seed.remind`; die bestehenden Szenarien bleiben unverändert. |
| V-5 | Verwalter | Minor | Wartet eine spätere Mahnstufe, entfällt in der Liste laut Plan auch «Gemahnt am …» einer früheren Mahnung, die versendet wurde. Die Detailseite zeigt diese Mahnung aber weiter als «Letzte Mahnung». Abhilfe: In der Zeile bleibt «Gemahnt am {Datum der letzten versendeten Mahnung}» stehen, nur «Nächste Mahnung möglich ab» wird durch «Mahnung noch zu versenden» ersetzt. Dazu ein `*.pg.test.ts`- oder DOM-Test: Stufe 1 versendet, Stufe 2 wartet → Datum der Stufe 1. |
| V-6 | Verwalter | Minor | Szenario 2 läuft schon auf dem Basis-Commit grün: `seed.remind` erstellt den Brief am selben Tag, an dem er markiert wird, also beweist «von heute» / «in 11 Tagen» nicht, dass das Markierdatum zählt. Abhilfe: In `reminders.pg.test.ts` den Brief rückdatieren (Dokument mit älterem Datum bzw. Zahlungsfrist), dann markieren und prüfen, dass `reminderSentDate` = heute und `nextReminderFrom` = heute + 11 ist. Das Szenario als Pin kennzeichnen (Commit-Text). |
| V-7 | Verwalter | Minor | Die Regel «nur bei zugestellter E-Mail» hat keinen Test für die gescheiterte E-Mail (#194). Abhilfe: `reminders.pg.test.ts` prüft, dass bei einer abgewiesenen E-Mail `reminderSentDate` leer bleibt und nach dem Markieren das Markierdatum gilt. |

## V-1 Reihenfolge Markieren / Ausdrucken

- Belege: `messages/de.json:87` (`help_payments_4`): «Markieren Sie einen Brief dort am Tag, an dem Sie ihn zur Post bringen, als versendet, und drucken Sie ihn danach aus: Erst dann trägt er das Datum dieses Tages und eine neue Zahlungsfrist.» Gleich lauten `documents_purpose` (Z. 1132), `statements_reminder_by_letter` (Z. 1322), `backend_mail_delivery_failed` (Z. 575) und `dashboard_task_letters_text_*` (Z. 272 f.). `markDocumentPosted` (`backend/src/services/reminder.service.ts:160–173`) erstellt das PDF beim Markieren neu, mit dem heutigen Datum und der Zahlungsfrist ab heute.
- Warum falsch: Wer zuerst abschickt und dann markiert, schickt dem Mieter das alte PDF mit dem Erstellungsdatum und der alten Frist. Dwello speichert danach einen anderen Brief und rechnet mit einer anderen Frist. Die Frist der nächsten Mahnstufe ist dann nicht die, die der Mieter liest.
- Lösung: der Text in der Tabelle «Wortlaut» unten (`statements_reminder_waits`).

## V-2 Hinweis bei bezahlter oder ersetzter Abrechnung

- Belege: `backend/src/services/statement.service.ts:67–70`: `reminderToSend` prüft nur `documents.status = 'to_send'` und nicht den Status der Abrechnung. Der Brief bleibt nach der Zahlung `to_send`. Erst `document.service.ts:23` (`notToSend`) macht daraus «Nicht mehr versenden: Abrechnung bezahlt/ersetzt». `markDocumentPosted` lehnt dann ab (`REMINDER_STATEMENT_PAID` / `_REPLACED`). Glossar «Ersetzt»: «wird nicht gemahnt».
- Warum falsch: Hängt der neue Hinweis bzw. die Listenzeile an `reminderToSend`, fordert das Panel einer bezahlten Abrechnung auf, den Brief als versendet zu markieren. Dwello verweigert genau das, und dem Mieter ginge eine Mahnung für eine bezahlte Forderung zu.
- Lösung: Hinweis und «Mahnung noch zu versenden» nur bei einer überfälligen Abrechnung zeigen (die Liste prüft heute schon `status === 'overdue'`, das Panel nicht). Bei bezahlt oder ersetzt nichts davon anzeigen. Szenario 3 bekommt dafür die Zeile «Und sagt die Abrechnung nicht, dass die Mahnung noch zu versenden ist».

## V-3 Bestehende Daten

- Belege: `reminder.service.ts:151` hat bisher bei jeder Mahnung `reminderSentDate: today` gesetzt, auch bei einem Brief `to_send`. `src/lib/server/statement.ts:119` zeigt `lastReminderDate: data.reminderSentDate` ungeprüft an. Die Spalte ist `backend/src/db/schema.ts:504`.
- Warum falsch: Das Ziel des Issues lautet: «nach Zahlung einer Abrechnung, deren Brief nie versendet wurde, nennt «Letzte Mahnung» kein Datum dieses Briefs». Für Abrechnungen, die vor dem Deployment so entstanden sind, gilt das nur mit einer Bereinigung. Sonst nennt Dwello dem Verwalter ein Mahndatum, an dem nichts beim Mieter ankam (vgl. Art. 102 OR unten).
- Lösung: Eine neue Migration setzt `reminder_sent_date` auf das Versanddatum der letzten Mahnung mit `status = 'sent'` (der Schweizer Tag von `documents.sent_at`) oder auf `null`, wenn keine Mahnung versendet ist. Der Tageswechsel ist dabei zu beachten (`sent_at` ist `timestamp`). Alternative: `lastReminderDate` aus den Dokumenten ableiten statt aus der Spalte. Ein `*.pg.test.ts` deckt die Migration mit drei Fällen ab: nur unversendeter Brief, Stufe 1 versendet und Stufe 2 wartend, alles versendet.

## Wortlaut

| key | de | fr | it | en |
|-----|----|----|----|----|
| statements_reminder_waits | Die Mahnung liegt unter «Dokumente» zum Versand bereit. Markieren Sie sie dort am Tag, an dem Sie sie zur Post bringen, als versendet, und drucken Sie sie danach aus. Erst dann trägt sie das Datum dieses Tages, und ihre Zahlungsfrist beginnt. | Le rappel est prêt à être envoyé sous « Documents ». Marquez-le comme envoyé le jour où vous le postez, puis imprimez-le. Ce n’est qu’alors qu’il porte la date du jour et que son délai de paiement commence. | Il sollecito è pronto per l’invio sotto «Documenti». Lì lo segni come inviato il giorno in cui lo porta alla posta, poi lo stampi. Solo allora riporta la data del giorno e il suo termine di pagamento inizia a decorrere. | The reminder is ready to send under «Documents». Mark it as sent there on the day you post it, then print it. Only then does it carry that day’s date and its payment deadline start. |
| statements_reminder_to_send | Mahnung noch zu versenden | Rappel encore à envoyer | Sollecito ancora da inviare | Reminder not sent yet |

## Nicht bestätigt

- Dass eine Mahnung erst mit dem Zugang beim Mieter wirkt, steht nicht im Gesetzestext (Lehre und Praxis): **unsicher**. Bestätigt ist nur Art. 102 Abs. 1 OR (Stand 1. Oktober 2026): «Ist eine Verbindlichkeit fällig, so wird der Schuldner durch Mahnung des Gläubigers in Verzug gesetzt.» Ein Brief, der nie abging, ist daher keine Mahnung des Gläubigers. Die Regel des Issues stimmt damit überein, und der Plan, die Stufe 1 als «Letzte Mahnung» stehen zu lassen, während Stufe 2 wartet, ist richtig.
- Ob `documents.sent_at` als UTC oder als Ortszeit gespeichert wird (für die Migration in V-3): nicht geprüft, nur `schema.ts:607` gelesen.

Geprüft: die Regel aus dem Entscheid gegen `reminder.service.ts` und `statement.service.ts`; die Formel in Szenario 2 (Markieren am Tag T → Zahlungsfrist T+10 → nächste Mahnung ab T+11, Glossar «Zahlungsfrist einer Mahnung»; Sonderfälle: bezahlt → `nextReminderFrom` null, weil der Status nicht `sent` ist, siehe V-2); den Wechsel des bestehenden Szenarios auf E-Mail (gleiche Aussage, der Brief-Fall steckt jetzt in Szenario 2; die Spec-Freigabe über #545 ist Sache des Aufrufers); dass die Mahnung keine Frist nach Art. 257d OR ist (`statements_reminder_257d`), was #545 nicht berührt; die Begriffe gegen `UBIQUITOUS_LANGUAGE.md` («Zu versenden», «Zahlungsfrist einer Mahnung»), es fehlt keiner.
