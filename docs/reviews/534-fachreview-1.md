# Fachreview 534/968, Runde 1 (Schritt 1, vor der Umsetzung)

Gegenstand: `tests/e2e/features/statement-redeliver.feature` (neu, @wip) und die zwei #968-Szenarien in `tests/e2e/features/statement-detail.feature:1234-1260`, Worktree `/tmp/claude/review-534-fach` bei `d199a75`, und der geplante Umsetzungsweg des Auftrags.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-1 | Mietrecht / Verwalter | Major | Mahnungen von vor dem erneuten Zustellen laufen weiter: eine Mahnung «Zu versenden» geht mit heutigem Datum hinaus, und nach der neuen Zahlungsfrist ist die nächste Mahnstufe sofort fällig, ohne Mahnfrist |
| V-1 | Verwalter | Major | Szenario «Eine per E-Mail versendete Abrechnung erneut per Brief zustellen» legt das neue Abrechnungsdatum nicht fest: E-Mail und Brief fallen beide auf heute |
| V-2 | Verwalter / Mietrecht | Major | «Zahlungsfrist ab heute» würde eine spätere Zahlungsfrist, die der Mieter kennt, verkürzen; die Regel muss die von `datedToday` sein (volle Frist, eine spätere bleibt) |
| V-3 | Verwalter | Major | Ein neues PDF «Zu versenden» bleibt nach dem Ersetzen oder dem Bezahlen der Abrechnung versendbar; der Mieter bekäme eine überholte Abrechnung mit Zahlteil |
| V-4 | Verwalter | Minor | Die Hinweise von #524 (`messages/de.json:1312-1314`, festgehalten in `statement-detail.feature:1270`) sagen «erstellen Sie das neue PDF»; nach #968 erstellt Dwello es selbst. Fix: «senden Sie ihm das neue PDF» (Wording unten); Szenarioänderung braucht `Spec change approved` |
| V-5 | Verwalter | Minor | Das Dokument des erneuten Zustellens und das als versendet markierte neue PDF brauchen `documents.paymentDeadline` (#966), sonst misst die Untergrenze von #966 an der Zahlungsfrist der ersten E-Mail. Fix: Zahlungsfrist auf beiden Dokumenten speichern, #966 nimmt die des letzten versendeten |
| V-6 | Verwalter | Minor | Bei einer Rückerstattung ist die Zahlungsfrist «Rückerstattung bis» (`UBIQUITOUS_LANGUAGE.md:214`); die Bestätigung spricht nur von der Zahlungsfrist. Fix: eigene Variante wie `pdfChangeOf` mit `refund_by` (Wording unten) |

## M-1 (Major): Mahnungen vor dem erneuten Zustellen

**Beleg.**
- Die Mahnstufe ist «Anzahl versendeter Mahnungen + 1» (`backend/src/services/reminder.service.ts:71`).
- Die nächste ist möglich ab dem Tag nach der Zahlungsfrist der letzten Mahnung. Sie hat dann Vorrang vor der Mahnfrist (`backend/src/services/statement.service.ts:62-66` `nextReminderFrom`, `:88-94` `reminderWaits`).
- Eine Mahnung «Zu versenden» wird beim Markieren mit heutigem Datum und neuer Zahlungsfrist neu erstellt. Abgewiesen wird sie dabei nur für «Ersetzt» und «Bezahlt» (`reminder.service.ts:159-172`, `document.service.ts:21-24` `notToSend`).

Folge im typischen Fall:
- Eine Zahlungserinnerung per E-Mail kommt als unzustellbar zurück, und erst so merkt der Liegenschaftsverwalter, dass auch die Abrechnung nicht ankam.
- Er stellt die Abrechnung erneut zu.
- Ab dem Tag nach der neuen Zahlungsfrist bietet Dwello sofort die «2. Mahnung» an, ohne Mahnfrist, und nach zwei solchen Mahnungen keine mehr.
- Eine Mahnung, die noch «Zu versenden» liegt, kann er nach dem erneuten Zustellen noch versenden. Sie fordert die Zahlung, obwohl die neue Zahlungsfrist erst in 30 Tagen abläuft.

Der Plan («A Mahnung then counts from the new Zahlungsfrist (existing logic)») stimmt also nur ohne frühere Mahnung.

**Warum falsch.**
- Dwello sagt selbst: «Mahnen Sie dann erst, wenn der Mieter die Abrechnung per Brief erhalten hat und die Zahlungsfrist danach abgelaufen ist.» (`messages/de.json:1989`)
- Art. 102 Abs. 1 OR (Stand 1. Oktober 2026): «Ist eine Verbindlichkeit fällig, so wird der Schuldner durch Mahnung des Gläubigers in Verzug gesetzt.»
- Eine Mahnung zu einer Abrechnung, die der Mieter nicht hatte, kann ihn kaum in Verzug gesetzt haben (Fälligkeit erst mit Zugang der Abrechnung: **unsicher**, siehe «Nicht bestätigt»).
- Eine «2. Mahnung» ohne wirksame erste stellt die Lage falsch dar.

**Fix.**
- Das erneute Zustellen beendet die früheren Mahnungen.
- `countReminders`, `nextReminderFrom` und `reminderSentDate` zählen nur Mahnungen, die nach dem letzten Abrechnungs-Dokument versendet wurden. Die nächste Mahnung ist wieder die Zahlungserinnerung, nach Zahlungsfrist + Mahnfrist.
- Eine Mahnung «Zu versenden» fällt aus «Zu versenden» heraus, wie bei «Ersetzt»/«Bezahlt» (`notToSend` um den Fall erweitern), und `markDocumentPosted` weist sie ab (eigener Code und Text).
- Tests: ein `*.pg.test.ts` und ein Szenario «Nach dem erneuten Zustellen beginnt das Mahnen wieder mit der Zahlungserinnerung».
- Wenn der Aufrufer das als über #534 hinausgehend wertet: Issue `needs-decision`. Ein Weiterlaufen der Mahnstufen widerspricht aber dem Text von #449.

## V-1 (Major): Szenario legt das neue Abrechnungsdatum nicht fest

**Beleg.**
- In der Grundlage geht die E-Mail heute hinaus (`statement-redeliver.feature:20`).
- «ist die Zahlungsfrist 30 Tage nach dem Tag des Versands» prüft `swissDate(inDays(30))` (`tests/e2e/steps/statement-send.steps.ts:50-52`).
- «nennt der Verlauf den Versand per E-Mail … am Tag des Versands» prüft `inDays(0)` (`statement-send.steps.ts:68-73`).
- Kein Schritt prüft das Abrechnungsdatum.

**Warum falsch.**
- Die Entscheidung von #534 lautet «dates the statement anew». Eine Umsetzung, die nur die Zahlungsfrist neu setzt und das Abrechnungsdatum der E-Mail behält, besteht das Szenario.
- «der Verlauf nennt beide Wege mit ihren Daten» wird nicht unterschieden.
- «Tag des Versands» ist nach zwei Sendungen mehrdeutig.

**Fix.**
- Die E-Mail in einem Given vor einigen Tagen datieren (Seed: `statementDate`, `sentAt` des E-Mail-Dokuments und Zahlungsfrist in der Vergangenheit), z. B. «Angenommen die Abrechnung 2024 von "Nora Beispiel" ging vor 40 Tagen per E-Mail hinaus».
- Then-Schritte:
  - «ist das Abrechnungsdatum heute»
  - «ist die Zahlungsfrist 30 Tage nach heute»
  - «nennt der Verlauf den Versand per E-Mail an "Nora Beispiel" vor 40 Tagen»
  - «nennt der Verlauf "Erneut zugestellt per Brief" am heutigen Tag»
- Dass das PDF des neuen Dokuments auf heute datiert ist, eine Ebene tiefer prüfen.

## V-2 (Major): Zahlungsfrist nie kürzer als die bisherige

**Beleg.** Der Plan fragt «also when the old one was later? (proposal: from today …)». Der Code des ersten Versands hat die Regel schon: «A statement goes out dated on the day it is sent (Swiss time), with the full payment deadline, never a shorter one» (`backend/src/services/statement.service.ts:713-718`, `datedToday`). Der Versand-Text sagt dasselbe: «eine spätere Zahlungsfrist, die Sie bei der Abrechnung eingetragen haben, bleibt» (`messages/de.json`, `statements_send_email_text`). #966 hat entschieden, dass eine Zahlungsfrist vor der beim Versand abgewiesen wird.

**Nachrechnung** (heute 31.10.2026, `payment_deadline_days` 30):
- Bisherige Frist 29.10.2026 (abgelaufen): die neue ist 30.11.2026, mit beiden Regeln gleich.
- Bisherige Frist 31.12.2026, verlängert und mit dem neuen PDF (#968) mitgeteilt: «ab heute» ergibt 30.11.2026, also einen Monat kürzer als die Frist, die der Mieter kennt. Mit `datedToday` bleibt der 31.12.2026.
- Grenzfall: bisherige Frist genau 30.11.2026. Beide Regeln ergeben 30.11.2026.

**Warum falsch.** Das erneute Zustellen verkürzt sonst eine Frist, die der Mieter erhalten hat. Genau das hat #966 ausgeschlossen. In der Praxis setzt ein Gläubiger eine mitgeteilte Frist nicht einseitig herab.

**Fix.**
- `datedToday(existing.paymentDeadline)` wiederverwenden.
- Ein Test, in dem eine spätere Zahlungsfrist bestehen bleibt.
- Der Bestätigungstext nennt die Regel wie beim ersten Versand (Wording unten). Der vorgeschlagene Text «rechnet die Zahlungsfrist ab heute» ist sonst im zweiten Fall falsch.

## V-3 (Major): Neues PDF «Zu versenden» einer ersetzten oder bezahlten Abrechnung

**Beleg.** Der Plan legt das neue PDF als Dokument «Zu versenden» ab und hebt es nur durch eine weitere Änderung oder durch das erneute Zustellen auf. Für eine Mahnung «Zu versenden» gilt schon: «A reminder still to send whose statement is replaced or paid since: it no longer goes out» (`backend/src/services/document.service.ts:21-24`). Dazu kommen die Abweisungen in `reminder.service.ts:164-167`. `notToSend` greift nur bei `type = 'reminder'`.

**Warum falsch.** Wird die Abrechnung danach berichtigt («Ersetzt») oder bezahlt, bleibt das neue PDF unter «Dokumente → Zu versenden» und lässt sich als versendet markieren. Der Mieter bekäme eine überholte Abrechnung mit QR-Zahlteil, nach einer berichtigten Abrechnung also zwei Forderungen. Das kann zu einer Doppelzahlung führen.

**Fix.**
- `notToSend` auch für `type = 'statement'` mit Status `to_send` anwenden.
- «Neues PDF als versendet markieren» und «Als versendet markieren» weisen bei «Ersetzt»/«Bezahlt» ab, mit den Codes analog `REMINDER_STATEMENT_REPLACED`/`_PAID`.
- Die Seite nennt das neue PDF dann nicht mehr als zu versenden.
- Tests eine Ebene tiefer (`*.pg.test.ts`).

## Wording

| key | de | fr | it | en |
|---|---|---|---|---|
| statements_redeliver | Erneut per Brief zustellen | Remettre à nouveau par lettre | Recapitare di nuovo per lettera | Deliver again by letter |
| statements_redeliver_text | Dwello datiert die Abrechnung auf heute. Die Zahlungsfrist ist so viele Tage danach, wie in den Einstellungen festgelegt; eine spätere Zahlungsfrist bleibt. Mahnen können Sie erst nach der neuen Zahlungsfrist. Drucken Sie danach das PDF aus und schicken Sie es dem Mieter heute per Post. | Dwello date le décompte d’aujourd’hui. Le délai de paiement correspond au nombre de jours fixé dans les paramètres, à compter de cette date ; un délai de paiement plus tardif est conservé. Vous ne pourrez envoyer un rappel qu’après le nouveau délai de paiement. Imprimez ensuite le PDF et envoyez-le au locataire aujourd’hui par la poste. | Dwello data il conteggio a oggi. Il termine di pagamento cade tanti giorni dopo quanti stabiliti nelle impostazioni; un termine di pagamento successivo resta valido. Potrà inviare un sollecito solo dopo il nuovo termine di pagamento. Stampi poi il PDF e lo invii oggi per posta all’inquilino. | Dwello dates the statement today. The payment deadline is as many days later as set in the settings; a later payment deadline stays. You can only send a reminder after the new payment deadline. Then print the PDF and post it to the tenant today. |
| statements_redeliver_text_refund | Dwello datiert die Abrechnung auf heute. Das Datum der Rückerstattung ist so viele Tage danach, wie in den Einstellungen festgelegt; ein späteres bleibt. Drucken Sie danach das PDF aus und schicken Sie es dem Mieter heute per Post. | Dwello date le décompte d’aujourd’hui. La date du remboursement correspond au nombre de jours fixé dans les paramètres, à compter de cette date ; une date plus tardive est conservée. Imprimez ensuite le PDF et envoyez-le au locataire aujourd’hui par la poste. | Dwello data il conteggio a oggi. La data del rimborso cade tanti giorni dopo quanti stabiliti nelle impostazioni; una data successiva resta valida. Stampi poi il PDF e lo invii oggi per posta all’inquilino. | Dwello dates the statement today. The refund date is as many days later as set in the settings; a later one stays. Then print the PDF and post it to the tenant today. |
| statements_history_redelivered_letter | Erneut zugestellt per Brief | Remis à nouveau par lettre | Recapitato di nuovo per lettera | Delivered again by letter |
| statements_new_pdf_to_send | Das neue PDF ist noch nicht versendet. Es liegt unter «Dokumente» zum Versand bereit. Markieren Sie es am Tag, an dem Sie es zur Post bringen, als versendet. | Le nouveau PDF n’est pas encore envoyé. Il est prêt à l’envoi sous « Documents ». Marquez-le comme envoyé le jour où vous le postez. | Il nuovo PDF non è ancora stato inviato. È pronto per l’invio in «Documenti». Lo segni come inviato il giorno in cui lo porta alla posta. | The new PDF has not been sent yet. It is ready to send under «Documents». Mark it as sent on the day you post it. |
| statements_new_pdf_mark_sent | Neues PDF als versendet markieren | Marquer le nouveau PDF comme envoyé | Segnare il nuovo PDF come inviato | Mark new PDF as sent |
| statements_history_new_pdf_sent_letter | Neues PDF versendet per Brief | Nouveau PDF envoyé par lettre | Nuovo PDF inviato per lettera | New PDF sent by letter |
| Titel des Dokuments (`reminder-letter.ts` WORDING) | Nebenkostenabrechnung, neues PDF | Décompte des charges, nouveau PDF | Conteggio spese accessorie, nuovo PDF | Utility cost statement, new PDF |
| statements_sent_pdf_changed_notes (V-4) | Die neue Bemerkung steht nur im neuen PDF. Soll der Mieter sie lesen, senden Sie ihm das neue PDF. | La nouvelle remarque ne figure que dans le nouveau PDF. Si le locataire doit la lire, envoyez-lui le nouveau PDF. | La nuova osservazione figura solo nel nuovo PDF. Se l’inquilino deve leggerla, gli invii il nuovo PDF. | The new remark is only in the new PDF. If the tenant should read it, send them the new PDF. |
| statements_sent_pdf_changed_deadline (V-4) | Im versendeten PDF steht die bisherige Zahlungsfrist. Damit der Mieter die neue kennt, senden Sie ihm das neue PDF. | Le PDF envoyé indique l’ancien délai de paiement. Pour que le locataire connaisse le nouveau, envoyez-lui le nouveau PDF. | Nel PDF inviato figura il termine di pagamento precedente. Affinché l’inquilino conosca quello nuovo, gli invii il nuovo PDF. | The PDF sent shows the previous payment deadline. So that the tenant knows the new one, send them the new PDF. |
| statements_sent_pdf_changed_refund_by (V-4) | Im versendeten PDF steht das bisherige Datum der Rückerstattung. Damit der Mieter das neue kennt, senden Sie ihm das neue PDF. | Le PDF envoyé indique l’ancienne date du remboursement. Pour que le locataire connaisse la nouvelle, envoyez-lui le nouveau PDF. | Nel PDF inviato figura la data di rimborso precedente. Affinché l’inquilino conosca quella nuova, gli invii il nuovo PDF. | The PDF sent shows the previous refund date. So that the tenant knows the new one, send them the new PDF. |

Prüfen Sie in fr/it/en die Wörter «Remboursement», «rimborso» und «refund» gegen die bestehenden Schlüssel `refund_by`, bevor Sie sie übernehmen.

## Fehlende Begriffe (Issue mit `domain`, `needs-decision`)

- **Erneut per Brief zustellen** (neue Zeile): «Aktion auf einer versendeten oder überfälligen Abrechnung, die den Mieter nicht erreicht hat, etwa nach einer unzustellbaren E-Mail. Dwello datiert sie auf den Tag des erneuten Zustellens, rechnet die Zahlungsfrist ab dann (eine spätere bleibt), legt das PDF als Dokument per Brief ab, und der Verlauf nennt beide Wege. Frühere Mahnungen zählen danach nicht mehr (#534).» fr «Remettre à nouveau par lettre», it «Recapitare di nuovo per lettera», en «Deliver again by letter».
- **Abrechnungsdatum** (`UBIQUITOUS_LANGUAGE.md:168`): Der Satz «Dwello setzt es auf den Tag, an dem die Abrechnung als versendet markiert wird» bekommt den Zusatz «… oder erneut per Brief zugestellt wird (#534)».
- **Versendetes PDF / neues PDF** (#965, Zeile noch nicht im Glossar): Die entschiedene Zeile spricht von «dem» PDF «beim Versand». Nach dem erneuten Zustellen oder nach einem als versendet markierten neuen PDF gibt es mehrere. Vorschlag für einen Zusatz: «Nach einem erneuten Zustellen oder einem als versendet markierten neuen PDF gilt das zuletzt versendete; der Verlauf nennt jedes.» Der Hinweis «Das versendete PDF finden Sie im Verlauf.» (`messages/de.json:1315`) meint dann das zuletzt versendete.

## Nicht bestätigt

- **Fälligkeit der Nachzahlung erst mit Zugang der Abrechnung:** Das ist herrschende Praxis, steht aber nicht im Gesetz. Art. 4 Abs. 1 VMWG (Stand 1. Oktober 2025) verlangt nur, die Abrechnung «dem Mieter vorlegen» zu müssen. Art. 75 OR (Stand 1. Oktober 2026) regelt nur die sofortige Fälligkeit ohne bestimmte Zeit. Deshalb ist die Aussage in M-1, eine Mahnung vor dem Zugang wirke nicht, **unsicher**. Gesucht in Fedlex (VMWG Art. 4, OR Art. 75, 102), nicht in der Rechtsprechung.
- **Zahlungsfrist der Abrechnung als «verabredeter Verfalltag»** (Art. 102 Abs. 2 OR: «Wurde für die Erfüllung ein bestimmter Verfalltag verabredet …»): Ob eine einseitig in der Abrechnung gesetzte Frist das ist, ist **unsicher**. Für den Plan ändert es nichts, weil Dwello ohnehin mahnt.
- **Empfangsbedürftigkeit der Mahnung:** Lehre, nicht im Wortlaut von Art. 102 OR; **unsicher**.
- **Vertragliche Zustellfrist der Abrechnung** (`docs/nebenkostenabrechnung-anforderungen.md:45`, `:159`, keine gesetzliche Frist): Ob ein neues Abrechnungsdatum nach Ablauf einer vertraglichen Frist dem Vermieter schadet, ist offen. Der Verlauf und das versendete PDF der E-Mail belegen den ersten Versand.

Geprüft: Art. 4 Abs. 1 VMWG «vorlegen» trägt das erneute Zustellen; der Weg über `sendByLetter` (Dokument per Brief, am selben Tag versendet), Status «Versendet» danach und kein Angebot bei «Bezahlt»; dass ein neues PDF «Zu versenden» durch das erneute Zustellen und durch eine weitere Änderung ersetzt wird; dass das als versendet markierte neue PDF Abrechnungsdatum und Zahlungsfrist nicht ändert (#968, #966); dass der Brief als Kanal von #968 mit dem Hinweis «zur Post bringen» genügt, um die Entscheidung «(channel, date)» zu erfüllen; die Begriffe gegen `UBIQUITOUS_LANGUAGE.md` und `docs/design/i18n-begriffe.md` (Zahlungsfrist, Dokument, Zu versenden, Als versendet markieren, Brief).
