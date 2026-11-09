# Marco, Slice 1403: Mahnung an Hans Müller, deren Abrechnung zu berichtigen ist (Handy)

Mobile 390 × 844, Touch. App http://localhost:3300 (Persona-Stack, Demodaten). Ich habe nur geschaut und nichts gespeichert: Alle Anfragen ausser GET waren beim Ausprobieren des Berichtigen-Dialogs blockiert, und ich habe keinen Dialog bestätigt.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Dialog «Mahnung senden» | Im gelben Hinweis steht «Diese Abrechnung ist zu berichtigen … bevor Sie mahnen», und gleich darunter «Hans Müller schuldet noch CHF 215.80». Der Hauptknopf «Zahlungserinnerung senden» bleibt aktiv. Ob ich trotzdem mahnen darf und welchen Betrag die Mahnung dann verlangt (215.80 oder 310.55), muss ich selbst zusammenreimen. Zwischen zwei Terminen könnte ich so eine Mahnung über den alten Betrag verschicken, ohne das bewusst zu wollen. |
| P-2 | Minor | Dialog «Mahnung senden» | Der Hinweis sagt «Berichtigen Sie die Abrechnung mit «Abrechnung berichtigen»», im Dialog gibt es diesen Knopf aber nicht. Ich muss «Abbrechen» tippen und dann auf der Seite herunterscrollen, bis zum gelben Kasten mit «Abrechnung berichtigen». Nach dem Abbrechen steht die Seite wieder ganz oben, und der Knopf liegt etwa eine Bildschirmhöhe tiefer. |

## Beobachtungen

- Der Dialog passt auf dem Handy ganz auf den Bildschirm (Screenshot 04: Titel, gelber Hinweis, Erklärtext, graue Box «Hans Müller schuldet noch CHF 215.80», dann untereinander «Zahlungserinnerung senden» und «Abbrechen»). Ich muss nicht scrollen, nichts läuft seitlich über, die Schrift ist 16 px gross und die Knöpfe sind 48 px hoch. Gut lesbar.
- Nach dem Öffnen liegt der Fokus auf «Abbrechen». So schicke ich nicht aus Versehen etwas ab. Ein Tipp neben den Dialog schliesst ihn nicht, das ist mir aber nicht in die Quere gekommen.
- Die Begriffe wechseln: Der Knopf auf der Seite und der Dialogtitel heissen «Mahnung senden», der Bestätigungsknopf «Zahlungserinnerung senden». Ich gehe davon aus, dass beides dasselbe ist.
- «Zahlungserinnerung senden» verschickt gar nichts. Laut Text erstellt Dwello ein PDF unter «Dokumente», und ich schicke den Brief selbst per Post. Die Reihenfolge im Text hat mich kurz verwirrt: «Markieren Sie den Brief dort … als versendet. Drucken Sie ihn danach aus und schicken Sie ihn per Post.» Ich hätte erwartet: zuerst drucken und zur Post bringen, dann als versendet markieren.
- Im Dialog heisst es «offener Betrag von CHF 310.55», im gelben Kasten auf der Seite «Nachzahlung von CHF 310.55». Hier kommt es auf dasselbe heraus, die Begriffe sind aber verschieden.
- Weder der Hinweis im Dialog noch der auf der Seite sagt, welche Rechnung nachträglich erfasst wurde. Da steht nur «1 Rechnung der Abrechnungsperiode». Dass es die Hauswartung ist, weiss ich nur aus der Aufgabe.
- Der Berichtigen-Dialog, den ich nur geöffnet und nicht bestätigt habe, erklärt deutlich: «Die bisherige … wird nicht mehr gemahnt». Damit weiss ich, dass eine Mahnung auf die alte Abrechnung nach der Berichtigung hinfällig wäre. Das steht im Mahnungs-Dialog aber nicht.
- Weg zur Abrechnung: Auf der Übersicht unter «Fristen» tippe ich auf «28.10.2026 Zahlungsfrist · Hans Müller, seit 12 Tagen abgelaufen» und komme direkt auf die Abrechnung, mit «Mahnung senden» gleich oben (Screenshot 02). Sehr schnell.

## Aufgabe geschafft: ja

Ich habe die Abrechnung gefunden und den Mahnungs-Dialog geöffnet. Er ist auf dem Handy lesbar. Ich weiss, dass ich zuerst berichtigen soll, und ich könnte trotzdem senden, weil der Knopf aktiv ist. Unklar bleibt nur, mit welchem Betrag (P-1).

## Aufwand

Etwa 1 Minute und 2 Tipps bis zum Dialog (Frist auf der Übersicht, dann «Mahnung senden»). Für Lesen und Verstehen des Dialogs etwa 1 Minute.

## Ablauf

- Dialog «Mahnung senden» geöffnet. Erwartet: Wenn ein Hinweis kommt, dass ich zuerst berichtigen soll, gibt es daneben einen Knopf dafür, oder es steht, was passiert, wenn ich trotzdem sende. Gesehen: Ich soll berichtigen, aber im Dialog gibt es keinen Knopf dazu. Senden bleibt möglich, ohne dass gesagt wird, welcher Betrag gemahnt wird (P-1, P-2).
- «Abbrechen» getippt. Erwartet: Ich lande beim Knopf «Abrechnung berichtigen». Gesehen: Die Seite steht ganz oben, und ich muss zum gelben Kasten scrollen (P-2).

## Vorschläge

- **P-1:** Übersicht → Frist «Hans Müller» → «Mahnung senden». Helfen würde ein Satz, der sagt, was beim Senden passiert, zum Beispiel: «Wenn Sie jetzt mahnen, verlangt die Zahlungserinnerung CHF 215.80.» Dazu ein Wort, dass die Mahnung mit dem Berichtigen hinfällig wird.
- **P-2:** Gleicher Weg. Im Dialog einen zweiten Knopf «Abrechnung berichtigen» anbieten, der direkt den Berichtigen-Dialog öffnet. Oder nach dem Abbrechen zum gelben Kasten mit dem Knopf springen.

## Nicht geprüft

- Das Senden der Zahlungserinnerung und das Berichtigen selbst habe ich nicht ausgeführt, weil die Aufgabe nur das Anschauen erlaubt. Deshalb weiss ich nicht, welchen Betrag das erstellte PDF tatsächlich nennt. Gesehen habe ich nur, dass «Zahlungserinnerung senden» aktiv ist.
- Andere Sprachen und den Dark Mode habe ich nicht angeschaut.

Screenshots und Skripte: /tmp/claude-0/-home-user-Dwello/7c0f8a1f-bdcc-5a7c-9aa7-059ba61bf2c7/scratchpad/marco-1403/
