# Helga – Rechnungen hochladen (Runde 245)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus. App: Persona-Stack auf http://localhost:3300 (Demodaten, KI-Stand-in). Gespeichert habe ich nur in «Musterhaus Zentrum». Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/helga-245/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Rechnungen hochladen, Zeile nach «… Rechnungen erstellen» | Ich habe ohne Kategorie auf «Erstellen» geklickt und danach eine Kategorie gewählt. Der Hinweis «Wählen Sie eine Kategorie.» bleibt trotzdem im gelben Kasten stehen und rutscht ans Ende. Unter dem Feld ist die Fehlermeldung weg. Ich dachte, meine Wahl sei nicht angekommen. |
| P-2 | Minor | Rechnung bearbeiten (abgerechnete Rechnung) | Unter dem Titel steht «Bestehende Abrechnungen ändern sich dadurch nicht.», gleich darunter warnt der Kasten «… stimmen diese Abrechnungen nicht mehr». Der erste Satz beruhigt mich, der zweite macht mir Angst. Erst beim zweiten Lesen habe ich verstanden, dass beide dasselbe meinen. |
| P-3 | Minor | Rechnung bearbeiten, Warnung «Rechnung schon abgerechnet» | Die Abrechnungen (NK-11111111-2025-0001 … 0004) sind als Text aufgeführt, nicht als Links. Die Warnung sagt, ich soll «auf ihrer Seite» «Neu berechnen» oder «Abrechnung berichtigen» wählen, aber ich komme von hier nicht dorthin. |
| P-4 | Minor | Rechnungen hochladen, nach dem Erstellen der Lift-Rechnung | Der grüne Kasten sagt nur «1 Rechnung erstellt». Er erinnert nicht daran, den nicht umlagefähigen Rest jetzt mit «Rechnung erfassen» zu erfassen und den Beleg anzuhängen. Diesen Hinweis gab es nur vorher in der Zeile, und die Zeile ist danach verschwunden. |
| P-5 | Nit | Rechnungen hochladen, Zeile «Elektro Blitz ohne KI.pdf» | Die Hinweise kommen in dieser Reihenfolge: zuerst «Wählen Sie eine Kategorie.», dann «Füllen Sie aus: Rechnungsdatum, Betrag, Rechnungssteller, Beschreibung.». Im Formular steht die Kategorie aber ganz unten. Ich habe oben angefangen und die Liste von hinten abgearbeitet. |

## Beobachtungen

- Der Knopf «0 Rechnungen erstellen (1 unvollständig)» ist anklickbar. «0 erstellen» klingt, als würde nichts passieren. Beim Klick wird das fehlende Feld rot markiert, es wird nichts gespeichert.
- Die Datei «Elektro Blitz.pdf» habe ich ein zweites Mal hochgeladen. Dwello hat gemeldet: «Diese Rechnung ist schon erfasst.», mit dem Link «Erfasste Rechnung ansehen», und das Häkchen weggenommen. Das fand ich sehr gut.
- Im Formular «Neue Rechnung» (Rechnung erfassen) heisst das Feld «Kategorie (optional)». Beim Hochladen und beim Bearbeiten ist die Kategorie Pflicht. Für mich ist das nicht einheitlich.
- In «Neue Rechnung» ist das heutige Datum schon eingetragen (Dienstag, 20. Oktober 2026), obwohl der Hilfetext sagt: «nicht das heutige». Das gehört nicht zu dieser Aufgabe.
- Der Hilfetext zum Leistungszeitraum ist sehr lang (drei Absätze, mit Boiler und VMWG) und steht in jeder Zeile. Bei 150 % Zoom muss ich lange scrollen, bis ich beim Betrag bin.
- Die Gutschrift über CHF 1’250.00 ist genau so hoch wie die von der KI gelesene Elektro-Blitz-Rechnung (CHF 1’250.00). Ich war versucht, die Gutschrift von Elektro Blitz abzuziehen. Zu welcher Rechnung sie gehört, sagt Dwello nicht. Das liegt an den festen Antworten des Stand-ins: alle Dateien bekommen R-1001, CHF 1’250.00 und «Allgemeinstrom Q1».
- Nach dem Erstellen aus einer einzelnen Datei schliesst sich das Fenster, und der grüne Kasten steht auf der Liste. Bei mehreren Dateien bleibt das Fenster offen. Beides ist klar.
- Zur Bedienung: Mit der Maus funktioniert der sichtbare Knopf «Dateien auswählen».
- Wähle ich die Kategorie «Reparaturen», nimmt Dwello das Häkchen bei «Umlagefähig» weg und sperrt das Kästchen grau. Darunter steht «Die Rechnung fliesst nicht in die Nebenkostenabrechnung ein.» und der Kasten «Nicht umlagefähige Kategorie – Kosten dieser Kategorie (z. B. Reparaturen, Gebäudeversicherung) können nicht auf Mieter umgelegt werden.». Das ist so beim Hochladen und beim Bearbeiten. Ich habe es verstanden.

## Aufgabe geschafft: ja

Erstellt habe ich in «Musterhaus Zentrum»:
- «Elektro Blitz, 31.03.2026», CHF 1’250.00, Allgemeinstrom (KI-Vorschlag);
- «Lift Service und Reparatur – Lift Wartung Q1», CHF 900.00, Lift;
- «Lift Service und Reparatur – Lift Reparatur Q1 (nicht umlagefähiger Teil)», CHF 350.00, Reparaturen, mit «Rechnung erfassen» und Beleg;
- «Elektro Blitz – Lampe Treppenhaus ersetzt», 15.04.2026, CHF 480.00, Reparaturen, aus der Datei ohne KI.

Gutschrift und Sammelscan habe ich nicht als Rechnung erstellt. Die Demo-Rechnung «Wasserversorgung Zürich» habe ich nicht gespeichert.

## Aufwand

Etwa 30 Minuten, rund 25 Schritte. Davon gingen etwa 5 Minuten für einen zweiten Durchgang drauf, weil «Elektro Blitz.pdf» schon erfasst war.

## Ablauf

1. **Übersicht → «Rechnungen hochladen».** Erwartet: ein Formular zum Hochladen. Gesehen: ein Fenster mit zwei Erklärsätzen (die KI liest aus, ich prüfe; nur die Dateien erstellter Rechnungen werden gespeichert). Der Knopf «Dateien auswählen» ist gesperrt, darunter steht «Wählen Sie zuerst das Gebäude.». Klar.
2. **Gebäude «Musterhaus Zentrum» wählen, vier Dateien auswählen.** Erwartet: eine Liste der Dateien. Gesehen: «Fertig: 4 von 4. Bitte prüfen: 4.», jede Zeile mit einem gelben Kasten «Hinweise zu …». Das Gebäude ist danach gesperrt, mit dem Satz «Das Gebäude gilt für alle Dateien. Entfernen Sie die Dateien, um ein anderes zu wählen.». Klar.
3. **Zeile «Elektro Blitz.pdf».** Häkchen gesetzt. Hinweise: «Prüfen Sie: Rechnungsdatum.» und «Ergänzen Sie, wenn auf der Rechnung angegeben: Fälligkeitsdatum.». Unter «Angaben prüfen» steht links die Vorschau der Datei, rechts die Felder. Die Kategorie «Allgemeinstrom» ist schon gewählt.
   - Ein Wert, bei dem die KI unsicher ist, ist gelb mit Warnzeichen markiert: «Die KI ist unsicher. Bitte prüfen Sie den Wert.».
   - Ein Wert, den die KI nicht gefunden hat, hat einen grauen Satz unter dem leeren Feld: «Die KI hat diesen Wert nicht gefunden. Füllen Sie ihn aus, wenn er auf der Rechnung steht.».
   - Den Unterschied habe ich verstanden.
4. **Zeile «Lift Service und Reparatur.pdf».** Kein Häkchen. Unter dem Kästchen steht der Grund: «Das Häkchen bei «Diese Rechnung erstellen» fehlt, weil Sie zuerst den Betrag aufteilen müssen. Setzen Sie es danach.». Im Kasten steht die Reihenfolge: hier nur den umlagefähigen Betrag eintragen, den Rest danach mit «Rechnung erfassen» in der Kategorie Reparaturen erfassen und die Datei mit «Beleg hinzufügen» anhängen. Dazu «Wählen Sie eine Kategorie.». Die Reihenfolge war mir klar. Welcher Teil umlagefähig ist, konnte ich der Vorschau nicht entnehmen, das liegt an meiner selbst gemachten Datei. Ich habe CHF 900.00 als Lift-Wartung und CHF 350.00 als Rest angenommen.
5. **Zeile «Werke Gutschrift.pdf».** Kein Häkchen, mit Grund: «… weil aus einer Gutschrift keine Rechnung entsteht. Ist die Datei doch eine Rechnung, setzen Sie es.». Der Kasten sagt, ich soll den Betrag der zugehörigen Rechnung verringern, «in der Zeile dieser Rechnung, wenn ihre Datei hier ausgewählt ist, sonst auf ihrer Seite mit «Rechnung bearbeiten»». Ich wusste nicht, welche Rechnung das ist (siehe Beobachtungen). Deshalb habe ich die Gutschrift liegen lassen.
6. **Zeile «Sammelscan.pdf».** Das Häkchen ist gesperrt. «Diese Datei enthält mehrere Rechnungen. Erfassen Sie jede mit «Rechnung erfassen» …». Klar. Ich habe die Datei mit «Datei entfernen» aus der Liste genommen.
7. **Lift-Zeile: Betrag 900.00, Beschreibung «Lift Wartung Q1», Häkchen gesetzt, keine Kategorie.** Erwartet: Dwello hält mich auf. Gesehen: Der Knopf heisst jetzt «1 Rechnung erstellen (1 unvollständig)». Nach dem Klick wurde nur Elektro Blitz erstellt. Darüber steht «Noch offen – Lift Service und Reparatur.pdf: Wählen Sie eine Kategorie.», und das Feld Kategorie ist rot mit «Wählen Sie eine Kategorie.». Gut verständlich.
8. **Kategorie «Lift» gewählt.** Die rote Meldung unter dem Feld ist weg, der Knopf heisst «1 Rechnung erstellen». Im gelben Kasten steht aber immer noch «Wählen Sie eine Kategorie.» (P-1, Bild `15-hint-stale.png`). Ich habe trotzdem geklickt: «1 Rechnung erstellt – Lift Service und Reparatur, 31.03.2026». Eine Erinnerung an den Rest fehlt (P-4).
9. **Rest erfassen.** Über «Rechnung erfassen» habe ich CHF 350.00, Kategorie Reparaturen, im Musterhaus Zentrum gespeichert. Danach lande ich auf der Liste, nicht auf der Rechnung. Ich musste die Rechnung suchen, um «Beleg hinzufügen» zu finden. Auf der Rechnung: «Datei auswählen», dann «Beleg hinzufügen». Danach war «Lift Service und Reparatur.pdf» als Beleg angezeigt. Die Begründung bei «Nicht umlagefähig» (Art. 256 OR) fand ich hilfreich.
10. **«Elektro Blitz ohne KI.pdf» allein.** Hinweise:
    - «Die KI hat diese Datei nicht gelesen. Füllen Sie die Felder aus.»
    - «Wählen Sie eine Kategorie.»
    - «Füllen Sie aus: Rechnungsdatum, Betrag, Rechnungssteller, Beschreibung.»

    Die Felder sind leer, ohne einzelne KI-Markierung. Das ist logisch, weil die KI gar nichts gelesen hat. Das Häkchen ist gesetzt, der Knopf heisst «0 Rechnungen erstellen (1 unvollständig)». Ich habe alles ausgefüllt und die Kategorie «Reparaturen» gewählt. «Umlagefähig» wurde gesperrt und leer, mit Erklärung (Bild `18-ohne-ki-reparaturen.png`). Danach «1 Rechnung erstellt – Elektro Blitz, 15.04.2026».
11. **Rechnung bearbeiten einer abgerechneten Rechnung.** Rechnung «Wasserversorgung Zürich, Wasser und Abwasser Q3 2025» (Musterhaus Zentrum). Erwartet: eine Warnung. Gesehen: der gelbe Kasten «Rechnung schon abgerechnet». Er nennt die Periode 01.01.2025 – 31.12.2025 und vier Abrechnungen (drei Entwürfe, eine versendet) und sagt, was danach zu tun ist: «Neu berechnen» bei Entwürfen, «Abrechnung berichtigen» bei versendeten. Verständlich, aber mit P-2 und P-3.
12. **Kategorie auf «Kategorie auswählen» zurückgestellt, «Änderungen speichern».** Erwartet: Dwello speichert nicht. Gesehen: Es wurde nichts gesendet, die Seite blieb. Das Feld Kategorie ist rot, darunter «Wählen Sie eine Kategorie.», und der Fokus springt ins Feld (Bild `25-save-without-kategorie.png`). Gut.
13. **Kategorie «Reparaturen» gewählt.** «Umlagefähig» wird leer und grau, dazu «Die Rechnung fliesst nicht in die Nebenkostenabrechnung ein.» und der Kasten «Nicht umlagefähige Kategorie». Danach «Abbrechen», ohne zu speichern, weil Wasser keine Reparatur ist.

## Verwirrung

- «Umlagefähig»: Bei «Reparaturen» kann ich das Kästchen nicht mehr anklicken. Das ist richtig so, die Erklärung steht daneben. Mit dem Wort allein hätte ich es nicht verstanden.
- «Gutschrift»: Zu welcher Rechnung sie gehört, habe ich nicht herausgefunden.
- «Neu berechnen» und «Abrechnung berichtigen» werden in der Warnung genannt, aber ich finde den Weg zu diesen Knöpfen nicht (P-3).
- «Verteilschlüssel (optional)»: Bei der Datei ohne KI ist nichts gewählt. Bei Elektro Blitz war «Pro Fläche (m²)» vorgewählt. Ich wusste nicht, ob ich ihn ändern muss.
- Der Satz unter dem Titel «Bestehende Abrechnungen ändern sich dadurch nicht.» (P-2).

## Fehlerrisiken

- Bei der Datei mit Reparaturkosten muss ich den Rest später von Hand erfassen. Ohne Erinnerung nach dem Erstellen (P-4) vergesse ich das leicht, und die Reparatur fehlt dann in meinen Unterlagen.
- Die Gutschrift könnte ich von der falschen Rechnung abziehen, wenn die Beträge zufällig gleich sind.
- Wer die stehengebliebene Meldung «Wählen Sie eine Kategorie.» (P-1) ernst nimmt, wählt die Kategorie mehrmals oder bricht ab.
- Nach einer Änderung an einer abgerechneten Rechnung finde ich die Abrechnungen nicht direkt (P-3). Das Risiko ist, dass ich die Entwürfe nicht neu berechne.

## Vorschläge

- **P-1:**
  - Reproduktion: Rechnungen hochladen → Musterhaus Zentrum → eine Datei mit «… Reparatur» im Namen → «Angaben prüfen» → Häkchen setzen → «0 Rechnungen erstellen (1 unvollständig)» klicken → Kategorie «Lift» wählen.
  - Was helfen würde: Der Hinweis im gelben Kasten verschwindet, sobald eine Kategorie gewählt ist, so wie die rote Meldung unter dem Feld.
- **P-2:**
  - Reproduktion: Rechnung «Wasserversorgung Zürich, Wasser und Abwasser Q3 2025» → «Rechnung bearbeiten».
  - Was helfen würde: Bei einer abgerechneten Rechnung den beruhigenden Satz unter dem Titel weglassen, oder ihn so formulieren, dass er zur Warnung passt, zum Beispiel «Bestehende Abrechnungen rechnet Dwello nicht von selbst neu.».
- **P-3:**
  - Reproduktion: wie P-2. In der Warnung sind die NK-Nummern nicht anklickbar.
  - Was helfen würde: Jede Abrechnung als Link auf ihre Seite, die mit «Neu berechnen» oder «Abrechnung berichtigen».
- **P-4:**
  - Reproduktion: Lift-Datei mit «… Reparatur» hochladen, Betrag verringern, Kategorie wählen, erstellen.
  - Was helfen würde: Im grünen Kasten oder unter «Noch offen» einen Satz wie «Erfassen Sie jetzt den nicht umlagefähigen Rest von Lift Service und Reparatur.pdf mit «Rechnung erfassen».», am besten mit Link.
- **P-5:**
  - Reproduktion: «Elektro Blitz ohne KI.pdf» hochladen.
  - Was helfen würde: Die Hinweise in der Reihenfolge der Felder, also «Füllen Sie aus: …» zuerst und «Wählen Sie eine Kategorie.» zuletzt, oder in einem Satz.

## Nicht geprüft

- 200 % Zoom: aus Zeitgründen nur 150 % geprüft.
- Den Abzug der Gutschrift an einer bestehenden Rechnung habe ich nicht gespeichert, weil ich nicht wusste, zu welcher Rechnung sie gehört.
- Die Seiten der Abrechnungen («Neu berechnen», «Abrechnung berichtigen») habe ich nicht geöffnet, weil sie nicht Teil der Aufgabe sind.
- Das Ziehen von Dateien ins Feld (Drag and drop) habe ich nicht geprüft, nur «Dateien auswählen».
- Ob der Inhalt der Datei zur KI-Antwort passt, habe ich nicht beurteilt: Die Antworten kommen vom Stand-in.
