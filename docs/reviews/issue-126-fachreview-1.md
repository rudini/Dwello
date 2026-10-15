# Fachreview #126, Runde 1: Meldung `backend_mail_delivery_failed`

Gegenstand: Commit 9698846 (Worktree `fach-126`, nur gelesen), Texte `messages/{de,fr,it,en}.json:444` und die Stellen, an denen sie erscheinen: `ReminderFeedback.svelte` (Abrechnung, zusammengesetzt mit `statements_reminder_undelivered`), `DocumentItem.svelte:53` (Dokumente), `TenantDocumentRow.svelte:35` (Mieter-Detail).

Geprüfter Text (de): «Die E-Mail wurde nicht zugestellt. Drucken Sie die Mahnung aus, schicken Sie sie per Post und markieren Sie sie danach als versendet. Prüfen Sie für die nächste Mahnung die E-Mail-Adresse des Mieters.»

Ergebnis: Kein Blocker, kein Major. Die Kernfrage ist gelöst: Wer die Mahnung ausdruckt und als versendet markiert, behält die richtige Mahnstufe. Offen sind drei Minor-Punkte zur Platzierung und Reihenfolge des Texts.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Minor | In der Meldung auf der Abrechnung bezieht sich der angehängte Satz «Sie liegt in den Dokumenten zum Versand bereit.» jetzt auf «die E-Mail-Adresse» (fr: «Il est prêt …» auf «le prochain rappel»). Ausserdem steht der Ort erst nach der Anweisung zum Drucken. |
| V-2 | Verwalter | Minor | Im Mieter-Detail erscheint «markieren Sie sie danach als versendet», dort gibt es aber keinen Knopf «Als versendet markieren». Der Text nennt den Ort nicht. |
| V-3 | Verwalter | Minor | Briefdatum und neue Zahlungsfrist (heute + 10 Tage) stehen ab der Erstellung fest im PDF. Der Text sagt nicht, dass der Brief umgehend auf die Post muss. Das Problem bestand schon vor der Änderung (Kanal Brief), der neue Text schickt aber jetzt ausdrücklich auf den Postweg. |

## V-1 (Minor): Bezug und Reihenfolge in der zusammengesetzten Meldung

**Beleg:** `messages/de.json:913` `"statements_reminder_undelivered": "{title}: {reason} Sie liegt in den Dokumenten zum Versand bereit."`, eingesetzt in `src/routes/statements/[id]/ReminderFeedback.svelte:15-16`. Auf der Abrechnung (Stufe 1) erscheint damit:

> Zahlungserinnerung: Die E-Mail wurde nicht zugestellt. Drucken Sie die Mahnung aus, schicken Sie sie per Post und markieren Sie sie danach als versendet. Prüfen Sie für die nächste Mahnung die E-Mail-Adresse des Mieters. Sie liegt in den Dokumenten zum Versand bereit.

- de: Das letzte feminine Nomen vor «Sie liegt» ist «die E-Mail-Adresse».
- fr (`fr.json:913`): «… pour le prochain rappel. Il est prêt à l’envoi sous « Documents ».» liest sich so, als sei der *nächste* Rappel schon bereit. Das ist sachlich falsch.
- en: «… before the next reminder. It is ready to send …» ist ebenso mehrdeutig.
- it: «Il documento è pronto …» ist eindeutig.

Ausserdem erfährt die Nutzerin erst nach der Anweisung «Drucken Sie die Mahnung aus», wo die Mahnung liegt.

**Warum falsch:** Die Zielgruppe sind unerfahrene Vermieter. Die Meldung soll sagen, was zu tun ist und wo. Der Satz zum Ablageort kam vor der Änderung direkt nach einem Satz über die Mahnung. Erst die Änderung hat den Bezug verschoben.

**Lösung:** Den Ort vor den Grund stellen, in allen vier Sprachen, z.B.
- de: `"{title} liegt in den Dokumenten zum Versand bereit. {reason}"`
- fr: `"{title} est prêt à l’envoi sous « Documents ». {reason}"`
- it: `"{title}: il documento è pronto per l’invio tra i documenti. {reason}"`
- en: `"{title} is ready to send under «Documents». {reason}"`

Der Titel des Hinweises («E-Mail nicht zugestellt», `de.json:916`) trägt die Ursache bereits.

## V-2 (Minor): «als versendet markieren» ohne Ort im Mieter-Detail

**Beleg:**
- `src/routes/tenants/[id]/TenantDocumentRow.svelte:34-36` zeigt `deliveryErrorText(document)`.
- Die Zeile hat nur die Knöpfe Herunterladen und Löschen (nur bei Uploads).
- `MarkSentButton` wird einzig in `src/routes/documents/+page.svelte:73` verwendet.

**Warum falsch:** Im Mieter-Detail fordert der Text zu einer Handlung auf, für die es dort keinen Knopf gibt. Ein Gelegenheitsnutzer sucht ihn vergeblich.

**Lösung:** Entweder den Ort im Text nennen, z.B.
- de: «… und markieren Sie sie danach unter «Dokumente» als versendet.»
- fr: «… puis marquez-le comme envoyé sous « Documents ».»
- it: «… e poi lo segni come inviato tra i documenti.»
- en: «… and then mark it as sent under «Documents».»

Oder im Mieter-Detail den Knopf «Als versendet markieren» anbieten (grösserer Umfang).

## V-3 (Minor): Zahlungsfrist läuft ab Erstellung, nicht ab Postaufgabe

**Beleg:**
- `backend/src/services/reminder.service.ts:84` `const today = swissToday();`
- `:92` `deadline: daysAfter(today, PAYMENT_DAYS)` mit `:21` `PAYMENT_DAYS = 10`
- `:98` Briefdatum `formatSwissDate(today)`
- `:111` `reminderSentDate: today`

`markDocumentSent` (`document.service.ts:134-141`) ändert nur `status`/`sentAt` des Dokuments, nicht das PDF.

**Nachgerechnet:**
- Erstellt am 15.10.2026, Zahlungsfrist 25.10.2026. Bei Postaufgabe am selben Tag (A-Post, Zustellung 16.10.) bleiben dem Mieter 9 Tage.
- Gleicher Fall, Postaufgabe aber erst am 22.10. (Zustellung 23.10.): Es bleiben 2 Tage. Das Briefdatum 15.10. liegt dann eine Woche vor dem Poststempel.
- Grenzfall: Postaufgabe nach dem 25.10. Die Frist ist schon abgelaufen, wenn der Brief ankommt.

**Rechtslage:** Für eine Zahlungserinnerung bzw. Mahnung nach Art. 102 OR schreibt das Gesetz weder Form noch Mindestfrist vor. Art. 102 Abs. 1 OR (Fedlex, SR 220, Fassung 1.10.2026): «Ist eine Verbindlichkeit fällig, so wird der Schuldner durch Mahnung des Gläubigers in Verzug gesetzt.» Eine zu kurze Frist ist darum kein Rechtsfehler, sondern ein Praxisfehler. Ein Verwalter würde eine Frist, die beim Empfang praktisch abgelaufen ist, nicht verschicken.

Die Mindestfrist von 30 Tagen nach Art. 257d Abs. 1 OR gilt nur bei Kündigungsandrohung: «… so kann ihm der Vermieter schriftlich eine Zahlungsfrist setzen und ihm androhen, dass bei unbenütztem Ablauf der Frist das Mietverhältnis gekündigt werde. Diese Frist beträgt mindestens zehn Tage, bei Wohn- und Geschäftsräumen mindestens 30 Tage.» Die 3. Mahnung droht nur «weitere Schritte» an (`reminder-letter.ts:34`), keine Kündigung. Art. 257d ist darum nicht berührt.

**Lösung:** Im Text auf den sofortigen Versand hinweisen, z.B.
- de: «Drucken Sie die Mahnung aus und schicken Sie sie noch heute per Post: Die Zahlungsfrist darin läuft ab heute. Markieren Sie sie danach als versendet.»
- fr/it/en entsprechend.

Die Ursache selbst (die Frist steht schon bei der Erstellung im PDF, auch beim Kanal Brief) besteht schon auf dem Basis-Commit. Sie gehört als offener Punkt (Issue `fachlich`) zur Frage, ob die Frist erst beim Markieren als versendet gesetzt oder das PDF dann neu erzeugt werden soll.

## Bestätigt (mit Quelle)

- **Mahnstufe bleibt richtig:** `nextLevel` zählt alle Mahnungs-Dokumente der Abrechnung (`reminder.service.ts:52`, `countReminders` in `document.service.ts:125-131`).
  - Ausdrucken, Postversand und Markieren als versendet (`markDocumentSent`) erzeugen kein neues Dokument. Die Zahlungserinnerung bleibt Stufe 1, und die nächste Mahnung ist korrekt die «2. Mahnung» mit dem Text «Trotz unserer Zahlungserinnerung …» (`reminder-letter.ts:33`). Der Mieter hat die Zahlungserinnerung dann tatsächlich per Post erhalten.
  - Der frühere Text («senden Sie die Mahnung erneut») hätte dagegen eine 2. Mahnung ohne zugestellte erste erzeugt. Der Befund des Code-Reviews trifft zu, und die neue Formulierung behebt ihn.
- **Fehlerhinweis verschwindet nach dem Markieren:** `markDocumentSent` setzt `deliveryError: null` (`document.service.ts:137`). Es bleibt kein veralteter Hinweis stehen.
- **«Mahnung» für eine Zahlungserinnerung (Stufe 1)** ist mit dem Glossar vereinbar:
  - «Mahnung: Vom Liegenschaftsverwalter ausgelöste Zahlungsaufforderung zu einer versendeten Abrechnung …» ist der Oberbegriff.
  - «Mahnstufe: Zahlungserinnerung (1. Stufe), 2. Mahnung, 3. Mahnung.» (`UBIQUITOUS_LANGUAGE.md:156-157`)
  - Der Text spricht von der Mahnung als Dokument, nicht von einer Stufe. Das passt.
  - fr «rappel», it «sollecito», en «reminder» entsprechen dem Oberbegriff in `docs/design/i18n-begriffe.md:63`.
- **«als versendet markieren»** entspricht dem Knopf «Als versendet markieren» und dem Versandstatus «Versendet» (`UBIQUITOUS_LANGUAGE.md:161`). Die Übersetzungen stimmen mit `i18n-begriffe.md:93` überein: fr «marquez-le comme envoyé» (Marquer comme envoyé), it «lo segni come inviato» (Segnare come inviato), en «mark it as sent».
- **Weitere Begriffe:** «Mieter» = locataire / inquilino / tenant (`i18n-begriffe.md:20`). «E-Mail» = e-mail / e-mail / email (`:22`). «per Post» ist gleich formuliert wie `statements_reminder_by_letter` (`de/fr/it/en.json:908`). Anrede Sie/vous/Lei ist durchgehend eingehalten, «ss» kommt nicht vor.
- **Keine Mail-Einstellungen in der App:** Der Text verlangt keine Prüfung von Mail-Einstellungen mehr. Das ist korrekt.

## Nicht bestätigt

- **Ob eine Zahlungserinnerung (ohne das Wort «Mahnung») rechtlich als Mahnung nach Art. 102 Abs. 1 OR gilt** und ob die Mahnung erst mit dem Empfang wirkt: Das Gesetz sagt dazu nichts ausdrücklich, belegen liesse es sich nur mit Lehre und Rechtsprechung (z.B. BGE 103 II 102, nur über die Suche gefunden, nicht auf Fedlex). Diese Aussage ist **unsicher**. Für den geprüften Text spielt sie keine Rolle.
- **Ob eine einseitig gesetzte Zahlungsfrist der Abrechnung ein «Verfalltag» nach Art. 102 Abs. 2 OR ist** (dann wäre der Verzug schon ohne Mahnung eingetreten): **unsicher**, nicht geprüft. Für den Text spielt das keine Rolle.
- **Erscheinungsbild auf dem Bildschirm:** nur aus dem Code gelesen, die App nicht gestartet. Ein E2E-Szenario für den Zustellfehler gibt es nicht. Durchsucht habe ich `tests/e2e/features/statement-reminder.feature` und `documents.feature`; der Fehler entsteht nur auf der Serverseite.
- **`docs/nebenkostenabrechnung-anforderungen.md` und `docs/anforderungen-vertragsende.md`** enthalten nichts zu Mahnungen (Suche nach «mahn»: kein Treffer). Daran konnte ich nichts prüfen.

## Beobachtung ausserhalb des Gegenstands (ohne Schwere)

- Zwischen zwei Mahnstufen prüft `nextLevel` keine Mindestfrist (`reminder.service.ts:46-54`). Eine 2. Mahnung ist also sofort nach der Zahlungserinnerung möglich, auch bevor deren Zahlungsfrist (10 Tage) abgelaufen ist. Das bestand schon auf dem Basis-Commit und hat mit #126 nichts zu tun. Vorschlag: als offenen Punkt (`fachlich`) prüfen.
