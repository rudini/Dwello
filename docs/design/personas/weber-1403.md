# Dr. Weber, Slice 1403: Mahnung trotz nachträglich erfasster Rechnung

Desktop 1440 × 900, Maus. Nur angesehen, nichts gespeichert: keine Mahnung erstellt, nicht berichtigt, nicht «Nicht berichtigen» gewählt. Während des ganzen Laufs schickte die Seite keine Anfrage ausser GET (Netzwerk geprüft).

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Dialog «Mahnung senden» | «Diese Abrechnung ist zu berichtigen … Berichtigen Sie die Abrechnung …, bevor Sie mahnen.» klingt wie eine Pflicht. Die Abrechnungsseite bietet aber ausdrücklich «Nicht berichtigen» an, und der Hinweis dort zur Verjährung (Art. 128 Ziff. 1 OR) fehlt im Dialog. Was rechtlich gilt (Mahnen über den zugestellten Betrag ist zulässig, Berichtigen ist eine Wahl), sagen mir Dialog und Seite also unterschiedlich. |
| P-2 | Minor | Dialog «Mahnung senden» vs. Abrechnungsseite | Für dieselben Zahlen steht auf der Seite «Nachzahlung von CHF 310.55 statt CHF 215.80», im Dialog «offener Betrag von CHF 310.55 statt CHF 215.80». Fachlich ist der Dialog genauer (er vergleicht mit «schuldet noch CHF 215.80»), aber zwei Begriffe für dieselbe Zahl lassen mich fragen, ob es zwei verschiedene Beträge sind. |
| P-3 | Minor | Dialog «Mahnung senden» | Der Dialog sagt nicht, was nach dem Berichtigen mit der Mahnung geschieht: Bekommt die berichtigte Abrechnung eine neue Zahlungsfrist, sodass ich erst nach deren Ablauf mahnen kann? Wenn ich jetzt mahne: Nennt die Mahnung CHF 215.80, und was geschieht mit der Mahnung, wenn ich danach berichtige? Ausserdem hat der Dialog keinen Weg zum Berichtigen, ich muss «Abbrechen» und den Knopf auf der Seite suchen. |

## Beobachtungen

- Die Summe stimmt. Nachgerechnet: Die nachträgliche Rechnung «Hauswartung Nachtrag 2025» über CHF 600.00 ergibt mit dem Hauswart-Anteil von 15.33 % (564.14 / 3’680.00) CHF 91.98. Damit Zwischensumme 3’097.63, mit 3 % Verwaltungspauschale 92.93 Nebenkosten von 3’190.56, abzüglich Akonto 2’880.00 bleiben 310.56, auf 5 Rappen gerundet **CHF 310.55**. Für den Vergleich ist das der richtige Betrag: Herr Müller hat nichts bezahlt, deshalb sind offener Betrag und Nachzahlung hier gleich.
- Weder die Abrechnungsseite noch der Dialog nennen, *welche* Rechnung hinzukam. Es heisst nur «1 Rechnung … erfasst, geändert oder gelöscht». Die Hauswartung musste ich selbst in der Rechnungsliste suchen. Einer vorsichtigen Vermieterin würde ein Link zu dieser Rechnung helfen.
- Auf der Abrechnungsseite selbst steht «Versendete Abrechnungen berichtigen Sie mit «Abrechnung berichtigen» auf der Abrechnung», aber ich bin ja schon auf der Abrechnung. Das ist doppelt gemoppelt.
- Für dieselbe Sache gibt es drei Bezeichnungen: Seiten-Knopf und Dialogtitel heissen «Mahnung senden», der Bestätigungsknopf und der Text «Zahlungserinnerung». Ausserdem «senden», obwohl Dwello nur ein PDF erstellt und ich den Brief selbst zur Post bringe. Der Text im Dialog erklärt das aber klar.
- Die Verjährungsangabe auf der Seite («in der Regel nach fünf Jahren … ab wann die Frist läuft, ist nicht einheitlich geklärt. Lassen Sie sich im Zweifel beraten.») ist vorsichtig und korrekt formuliert.
- Die Übersicht zeigt «Abrechnung berichtigen» als nächsten Schritt und die abgelaufene Zahlungsfrist (28.10.2026, seit 12 Tagen) und führt zur richtigen Abrechnung. Der erste Klick auf «Abrechnung öffnen» blieb ohne Wirkung, weil ich wohl vor dem vollständigen Laden geklickt hatte. Der zweite Versuch klappte.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, 6 Schritte: Übersicht, «Abrechnung öffnen», Abrechnung lesen, «Mahnung senden», Dialog lesen und Knopf prüfen, «Abbrechen». Danach zum Nachrechnen die Rechnungsliste von Musterhaus Zentrum 2025.

## Ablauf

- Dialog geöffnet. Erwartet: ein Hinweis, dass ich auch ohne Berichtigung mahnen darf, oder die Wahl zwischen Berichtigen und Nicht berichtigen wie auf der Seite. Gesehen: der gelbe Kasten «Diese Abrechnung ist zu berichtigen … bevor Sie mahnen.» Die Option «Nicht berichtigen» und der Verjährungshinweis fehlen (Screenshot 04-reminder.png: gelber Kasten oben im Dialog, darunter der Ablauf des Briefs, ein grauer Kasten «Hans Müller schuldet noch CHF 215.80», die Knöpfe «Abbrechen» und «Zahlungserinnerung senden»).
- Erwartet: Im Dialog derselbe Begriff wie auf der Seite («Nachzahlung»). Gesehen: «offener Betrag».
- Erwartet: Nach dem Hinweis vielleicht ein gesperrter Knopf. Gesehen: «Zahlungserinnerung senden» ist bedienbar (nicht deaktiviert). Ich könnte also mahnen, wenn ich mich dafür entscheide, so wie gewünscht. «Abbrechen» schliesst den Dialog, ohne etwas zu speichern.

## Vorschläge

- **P-1:** Übersicht → «Abrechnung öffnen» (Hans Müller, NK-11111111-2025-0001) → «Mahnung senden». Hilfreich wäre eine Formulierung wie «Seit dem Erstellen kam eine Rechnung dazu: Neu berechnet … CHF 310.55 statt CHF 215.80. Sie können die Abrechnung zuerst berichtigen oder über den zugestellten Betrag mahnen.» Dazu derselbe kurze Verjährungshinweis wie auf der Seite.
- **P-2:** Gleicher Weg. Seite und Dialog sollten denselben Begriff nutzen, zum Beispiel überall «offener Betrag», wenn mit dem Geschuldeten verglichen wird. Oder auf der Seite in einem Satz erklären, dass bei einer Teilzahlung beides auseinanderfällt.
- **P-3:** Gleicher Weg. Ein Satz zur Folge wäre hilfreich: «Die Mahnung nennt CHF 215.80. Berichtigen Sie danach, gilt für die Differenz eine neue Zahlungsfrist.» (oder was Dwello tatsächlich tut). Dazu ein Link oder Knopf «Abrechnung berichtigen» direkt im Dialog.

## Nicht geprüft

- Das Mahnungs-PDF selbst, also welchen Betrag und welche Frist es nennt: Dafür hätte ich «Zahlungserinnerung senden» bestätigen müssen, und das war mir untersagt (gemeinsame Daten).
- Was nach dem Berichtigen mit Zahlungsfrist und Mahnung geschieht: nicht ausgelöst, aus demselben Grund.
- Der Fall einer Teilzahlung, bei dem «offener Betrag» und «Nachzahlung» auseinanderfallen: In den Demodaten hat Herr Müller nichts bezahlt, und ich durfte keine Zahlung erfassen.
