# Persona-Review: Anna, Slice 448

Persona: Anna, 29, vermietet zum ersten Mal und kommt nach Monaten zurück, ohne sich an etwas zu erinnern. Desktop 1440 × 900, Schritt 4 auf Mobile 390 × 844. App: http://localhost:3300 (Persona-Stack, Demo-Daten, Version 0.65.3+22-gb6e07917). Gespeichert habe ich nur im Gebäude «Musterhaus Zentrum» (Abrechnung NK-11111111-2025-0001 von Hans Müller). Bei Thomas Weber 2024 (Seepark Residenz) habe ich nur geschaut.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/anna-448/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Dialog «Abrechnung als bezahlt markieren», Warnung zum Zahlungsdatum | Die Warnung «Das Zahlungsdatum liegt vor dem Abrechnungsdatum vom 28.09.2026. Trotzdem speichern?» sagt nicht, warum das ein Problem ist und was ich sonst tun soll. Es fehlt der Hinweis auf eine Teilzahlung: Hans hat nur einen Teil bezahlt, ich habe trotzdem gespeichert. Jetzt gilt die ganze Nachzahlung als bezahlt, und im PDF steht «Bezahlt am 15.01.2026. Vielen Dank.» |
| P-2 | Minor | Dialog «Abrechnung berichtigen», Feld «Bereits bezahlt» | Die Hilfe «Was der Mieter auf diese Abrechnung schon überwiesen hat, auch ein Teilbetrag» ist klar. Unklar bleibt, ob eine Zahlung zählt, die vor der Abrechnung kam (Januar), und was mit dem Betrag geschieht: Wird er in der berichtigten Abrechnung abgezogen? |
| P-3 | Minor | «Abrechnung bearbeiten», Feld «Bemerkungen» | Die Hilfe sagt «Die Bemerkung steht im PDF», aber nicht ausdrücklich, dass der Mieter sie liest. Nach dem Speichern erstellt Dwello ohne Hinweis ein neues PDF: Meine Notiz steht dort unter «Hinweise» für Hans. |
| P-4 | Minor | Liste (Filter «Erledigt») und Detail Thomas Weber 2024, mobil | Der Text zur Zahlung ist verständlich. Das Abzeichen «Erledigt» sieht aber gleich aus wie «Bezahlt» (grün, gleiches Häkchen), und nirgends steht, worin sich die beiden unterscheiden. Im Verlauf fehlt ein Eintrag, wann und warum die Abrechnung erledigt wurde. |
| P-5 | Nit | Detail Hans Müller, Karte «Zahlung», Status «Bezahlt» | Unter «Bezahlt am 15.01.2026» steht weiter «Der Mieter bezahlt die Nachzahlung von CHF 215.80.» Das klingt, als wäre die Zahlung noch offen. |

## Beobachtungen

- Der Verlauf ist für mich nicht zeitlich geordnet. Dort steht «Erstellt 20.10.2026, 10:17», «PDF erstellt 20.10.2026», «Versendet 28.09.2026», «Bezahlt 15.01.2026». Die Abrechnung wurde also erst nach dem Versand erstellt, und bezahlt war sie vor beidem. Das liegt teils an den Demo-Daten, verwirrt aber.
- Nach dem Speichern der Bemerkung war «PDF herunterladen» weg. Stattdessen standen da «PDF erstellen» und «PDF auf Deutsch», und im Verlauf fehlte «PDF erstellt». Ich habe danach das PDF geholt (Adresse des Downloads, wie ein Klick auf «PDF erstellen»): Jetzt steht im Verlauf «PDF erstellt 20.10.2026, 10:23». Das PDF, das Hans im September bekommen hat, sehe ich nicht mehr. Ich weiss nicht, ob ich das neue PDF nochmals senden muss.
- Auf der Bearbeitungsseite einer bezahlten Abrechnung spricht die Hilfe zur Kostenaufstellung von «Neu berechnen auf der Seite des Entwurfs» und «löschen Sie den Entwurf». Das passt nicht zu einer bezahlten Abrechnung.
- Auf der Bearbeitungsseite (Desktop) ist die Tabelle «Abrechnungspositionen» rechts abgeschnitten (Spalte «Zeitanteil» halb sichtbar, Screenshot `09-bearbeiten.png`).
- Auch eine bezahlte Abrechnung zeigt noch die Zahlungsfrist mit der Hilfe «Bis zu diesem Datum bezahlt der Mieter die Nachzahlung» und lässt sie bearbeiten.
- Unter «Status:» ist auf der Detailseite eine grosse leere Fläche (Desktop und mobil), bevor die Kostenaufstellung beginnt.
- Nach «Als bezahlt markieren» kam die Meldung «Abrechnung als bezahlt markiert». Nach «Änderungen speichern» habe ich zwei Sekunden später keine Meldung mehr gesehen.
- Gut: Die Übersicht führte mich über «Fristen · Zahlungsfrist · Hans Müller» direkt zur richtigen Abrechnung. Nach dem Bezahlen war die Frist dort weg, und «Bezahlt» zählte 9 statt 8.
- Gut: Der Datumsfeld zeigt unter der Eingabe den Wochentag in Worten («Donnerstag, 15. Januar 2026»). So sehe ich, dass ich das richtige Datum habe.
- Mobil (390 px) scrollt weder die Liste noch die Detailseite seitlich.

## Aufgabe geschafft: teilweise

Alle vier Schritte habe ich durchgeführt. Als Laie habe ich aber eine Teilzahlung als ganze Zahlung erfasst (P-1). Dwello hat mich nicht davor bewahrt, und das PDF für Hans sagt jetzt «Vielen Dank» für den ganzen Betrag.

## Aufwand

Etwa 15 Minuten, 11 Skriptläufe. Schritt 1: 3 Klicks. Schritt 2: 4 Klicks und 1 Eingabe. Schritt 3: 2 Klicks und 1 Eingabe. Schritt 4: 3 Taps.

## Ablauf

1. **Abrechnung finden.** Erwartet: unter «Nebenkostenabrechnungen» suchen. Gesehen: Schon die Übersicht zeigt unter «Fristen» «28.10.2026 Zahlungsfrist · Hans Müller». In der Liste steht Hans Müller, NK-11111111-2025-0001, «Versendet», Nachzahlung CHF 215.80. Leicht gefunden.
2. **«Abrechnung berichtigen» öffnen.** Erwartet: ein Formular zum Korrigieren. Gesehen: ein Dialog. Die bisherige Abrechnung wird ersetzt, bleibt erhalten, wird nicht mehr gemahnt und kann nicht mehr als bezahlt markiert werden. Dazu das Feld «Bereits bezahlt» (CHF, vorausgefüllt 0.00) mit der Hilfe «… auch ein Teilbetrag», der Satz «Das lässt sich nicht rückgängig machen» und ein Hinweis auf die Verjährung (Art. 128 OR). Ich verstehe: Hier trage ich Hans' Teilzahlung ein. Unsicher bin ich, ob die Zahlung im Januar «auf diese Abrechnung» zählt (P-2). «Abbrechen» schliesst den Dialog, der Status bleibt «Versendet».
3. **Als bezahlt markieren.** Erwartet: Datum eintragen, fertig. Gesehen: Der Dialog sagt «Danach können Sie keine Mahnung mehr senden». Das Feld «Bezahlt am» ist mit heute vorausgefüllt. Ich trage 15.01.2026 ein und sehe «Donnerstag, 15. Januar 2026». Beim Bestätigen erscheint die Warnung «Das Zahlungsdatum liegt vor dem Abrechnungsdatum vom 28.09.2026. Trotzdem speichern?», und der Knopf heisst jetzt «Trotzdem speichern». Als Laie denke ich: Stimmt, Hans hat ja schon im Januar bezahlt, also trotzdem speichern. Dass es nur ein Teil war, fragt Dwello nicht (P-1).
4. **Status und Verlauf prüfen.** Gesehen: Meldung «Abrechnung als bezahlt markiert», Status «Bezahlt», in der Karte «Zahlung» «Bezahlt am 15.01.2026», im Verlauf «Bezahlt 15.01.2026». Der Hauptknopf heisst jetzt «Zahlung zurücksetzen». Der Satz «Der Mieter bezahlt die Nachzahlung …» blieb stehen (P-5).
5. **Bearbeiten, Bemerkung.** Über «Frist und Bemerkungen bearbeiten» komme ich auf die Seite «Abrechnung bearbeiten». Hilfe beim Feld: «Zum Beispiel eine Absprache mit dem Mieter. Die Bemerkung steht im PDF.» Ich schreibe «Teilzahlung von Hans Müller im Januar 2026 erhalten.» und speichere. Erwartet: eine Notiz für mich. Gesehen: Die Bemerkung steht auf der Detailseite unter «Bemerkungen», das PDF musste neu erstellt werden, und im neuen PDF steht meine Notiz unter «Hinweise» für den Mieter (P-3). Wer die Bemerkung liest, wurde mir erst im PDF klar.
6. **Mobil, «Erledigt».** Liste auf 390 px. Ich tippe die Kachel «1 Erledigt» und sehe Thomas Weber, NK-22222222-2024-0001, Rückerstattung CHF 3.00, «Erledigt». Auf der Detailseite steht in der Karte «Zahlung»: «Der Betrag ist kleiner als CHF 5.00. Er wird mit der nächsten Abrechnung verrechnet.» Das verstehe ich. Was «Erledigt» gegenüber «Bezahlt» heisst, erklärt niemand, und beide Abzeichen sehen gleich aus (P-4).

## Verwirrung

- «Bezahlt» kennt keinen Teilbetrag. Den Teilbetrag gibt es nur unter «Abrechnung berichtigen», und das klingt nach einem Fehler in der Abrechnung, nicht nach einer Zahlung.
- «Abrechnungsdatum» (28.09.2026) gegenüber «Versendet» (28.09.2026) und «Erstellt» (20.10.2026): Welches Datum zählt?
- «Erledigt» gegenüber «Bezahlt».
- «Hinweise» im PDF: So heisst dort der Abschnitt, in dem meine «Bemerkungen» stehen. Es sind also zwei Wörter für dasselbe.
- «verrechnet» mit der nächsten Abrechnung: Auf welcher sehe ich die CHF 3.00 wieder?

## Fehlerrisiken

- Eine Teilzahlung wird als ganze Zahlung erfasst. Danach kann ich nicht mehr mahnen, und das PDF dankt für den ganzen Betrag (P-1).
- Eine interne Notiz landet beim Mieter im PDF (P-3).
- Ein Speichern ersetzt das schon versendete PDF ohne Hinweis. Später weiss ich nicht mehr, was der Mieter tatsächlich bekommen hat.

## Vorschläge

- **P-1:** Reproduktion: Detail NK-11111111-2025-0001 (Status «Versendet») → «Als bezahlt markieren» → «Bezahlt am» 15.01.2026 → «Als bezahlt markieren» → Warnung → «Trotzdem speichern». Hilfreich wäre: Die Warnung sagt, warum das Datum auffällt (zum Beispiel «Meist ist das ein Tippfehler im Jahr»). Ausserdem fragt der Dialog oder die Warnung, ob der ganze Betrag eingegangen ist, und schickt bei einer Teilzahlung zu «Abrechnung berichtigen» und «Bereits bezahlt».
- **P-2:** Reproduktion: Detail NK-11111111-2025-0001 → «Abrechnung berichtigen». Hilfreich wäre ein Satz bei «Bereits bezahlt», zum Beispiel «Auch Zahlungen vor dem Erhalt der Abrechnung. Der Betrag wird in der berichtigten Abrechnung abgezogen.» (falls das so ist).
- **P-3:** Reproduktion: Detail → «Frist und Bemerkungen bearbeiten» → «Bemerkungen» ausfüllen → «Änderungen speichern» → PDF holen: Text unter «Hinweise». Hilfreich wäre eine Hilfe wie «Der Mieter liest die Bemerkung im PDF.». Dazu nach dem Speichern ein Hinweis, dass ein neues PDF entsteht und ob ich es nochmals senden muss.
- **P-4:** Reproduktion: Mobil `/statements` → Kachel «Erledigt» → Thomas Weber 2024. Hilfreich wäre ein kurzer Satz beim Status, zum Beispiel «Erledigt: Es ist nichts mehr zu bezahlen.». Dazu ein anderes Symbol als bei «Bezahlt» und ein Verlaufseintrag «Erledigt».
- **P-5:** Reproduktion: Detail einer bezahlten Abrechnung, Karte «Zahlung». Hilfreich wäre die Vergangenheit, zum Beispiel «Der Mieter hat die Nachzahlung von CHF 215.80 bezahlt.».

## Nicht geprüft

- «Abrechnung berichtigen» habe ich nicht bestätigt (Aufgabe: abbrechen). Ob «Bereits bezahlt» in der berichtigten Abrechnung abgezogen wird, weiss ich darum nicht.
- «Zahlung zurücksetzen» habe ich nicht ausprobiert, um die Teilzahlung zu korrigieren: Das war nicht Teil der Aufgabe, und die Abrechnung bleibt so für die Prüfung erhalten.
- Ob Dwello das neue PDF an Hans senden würde: Ich habe keinen Knopf «Senden» gesehen und nichts gesendet.
- Die Detailseite von Hans auf Mobile und andere Sprachen als Deutsch (laut Auftrag Deutsch).
- Das versendete Original-PDF vom September: Nach dem Speichern der Bemerkung war es nicht mehr abrufbar.
