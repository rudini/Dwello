# Marco – Schlussrechnung der Werke hochladen (Runde 455)

Persona: Marco, 38, Smartphone 390 × 844, Touch. Gebäude zum Speichern: «Alpenblick».
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/marco-455/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Rechnungen hochladen, Hinweis zu «Werke Schlussrechnung.pdf» | Der zweite Absatz des Hinweises ist auf dem Handy ein Block von rund 17 Zeilen mit fünf Wenn-dann-Fällen (schon erfasst, Dateien hier ausgewählt, schon abgerechnet, ergibt 0, ergibt weniger als 0). Was ich gerade tun muss («Akontorechnung nicht erstellen»), muss ich mir aus dem Text heraussuchen. |
| P-2 | Minor | Rechnung bearbeiten | Der Hinweis beim Betrag sagt «weniger die Akontorechnungen, die schon abgerechnet sind». Auf der Bearbeiten-Seite sehe ich aber nirgends, ob eine Akontorechnung abgerechnet ist. Auch die Zeile «In Abrechnungen enthalten» fehlt dort, es gibt sie nur auf der Seite der Rechnung. |
| P-3 | Minor | Seite der Rechnung | «In Abrechnungen enthalten: Keine» steht direkt unter dem Hinweis über die abgerechneten Akontorechnungen. Ich habe es zuerst als «keine Akontorechnung ist abgerechnet» gelesen. Gemeint ist aber diese Schlussrechnung selbst. |
| P-4 | Minor | Rechnungen hochladen, «Angaben prüfen» | Als Verteilschlüssel ist «Pro Fläche (m²)» vorgeschlagen, wie bei den vier anderen «Allgemeinstrom»-Rechnungen von Alpenblick. Ein Grund steht nicht dabei. Ich kann nicht erkennen, ob Dwello den Schlüssel von diesen Rechnungen übernommen hat oder ob er immer so vorgeschlagen wird. |
| P-5 | Nit | Hochladen, Seite der Rechnung, Bearbeiten | Der gleiche Sachverhalt steht dreimal leicht verschieden da: «Als Betrag ist das Total vor dem Abzug vorgeschlagen» (Hochladen), «Der Betrag ist das Total vor dem Abzug, weniger die Akontorechnungen, die schon abgerechnet sind» (Seite der Rechnung und Bearbeiten). Auf der Seite der Rechnung heisst es «löschen Sie diese Rechnung mit «Rechnung löschen»», beim Bearbeiten «… auf der Seite der Rechnung mit «Rechnung löschen»». |

## Beobachtungen

- Die Akontorechnung ist von selbst *nicht* angehakt («Diese Rechnung erstellen» leer), die Schlussrechnung schon. Das finde ich gut: Ich hätte sonst beide erstellt.
- Der Hinweis zur Akontorechnung ist kurz und verständlich («ein Vorschuss … Erfassen Sie in der Regel nur die Schlussrechnung»).
- Der Satz mit dem Geld ist fett gesetzt und gut lesbar: «Akontorechnungen von CHF 1’000.00 abgezogen … vorgeschlagen: CHF 1’250.00».
- Ich habe den Upload versehentlich ein zweites Mal gestartet. Dwello schrieb «Diese Rechnung ist schon erfasst.», bot «Erfasste Rechnung ansehen» an und hakte nichts an. Der Knopf hiess dann «0 Rechnungen erstellen» und war gesperrt, mit dem Satz «Wählen Sie mindestens eine Rechnung zum Erstellen.». Es wurde also nichts doppelt gespeichert. Sehr gut.
- Im ersten Zustand stand auf dem Hauptknopf «0 Rechnungen erstellen (1 unvollständig)». Er sah aktiv aus und war es auch (nicht `disabled`). Was ein Tippen darauf tut, habe ich nicht ausprobiert.
- Direkt nach «Angaben prüfen» hatte die Liste «Kategorie» kurz nur «Kategorie auswählen». Die Kategorien kamen erst nach weniger als einer Sekunde dazu. Wer schnell tippt, sieht eine leere Liste.
- Der Knopf zum Auswählen der Dateien hat im Accessibility-Baum den doppelten Namen «Dateien hierher ziehen oder auswählen Dateien auswählen». Ein sichtbarer Knopf «Dateien auswählen» darunter ist als Text ausgezeichnet, nicht als Knopf. Beim Tippen hat er trotzdem funktioniert.
- Der Dialog ist schon vor «Angaben prüfen» etwa vier Bildschirme lang (3210 px bei 812 px Höhe). Danach kommen noch der lange Hilfetext zum Leistungszeitraum (Boiler-Beispiel, VMWG) und alle Felder dazu. Bis zu «Kategorie» scrolle ich lange.
- Rechnungssteller «Werke Schlussrechnung», Rechnungsdatum 31.03.2026 und Beschreibung «Allgemeinstrom Q1» kommen vom KI-Platzhalter, nicht von einem echten Modell.
- Alle Tippflächen («Diese Rechnung erstellen», «Angaben prüfen», «Datei entfernen», «Rechnung bearbeiten») sind 48 px hoch. Kein seitliches Scrollen (scrollWidth 390).
- In der Liste steht zusätzlich eine «Werke Schlussrechnung» bei «Musterhaus Zentrum». Sie ist nicht von mir (Dr. Weber), ich zähle sie nicht als Befund.

## Aufgabe geschafft: ja

## Aufwand

Etwa 6 bis 8 Minuten reine Bedienung, rund 12 Taps und Auswahlen: Rechnungen hochladen, Gebäude, Dateien auswählen, Hinweise lesen, Angaben prüfen, Kategorie, Rechnung erstellen, Link zur Rechnung, Rechnung bearbeiten. Dazu kamen etwa 2 Minuten, um vorher die anderen Allgemeinstrom-Rechnungen von Alpenblick nachzuschauen: Liste filtern und drei Rechnungen öffnen.

## Ablauf

1. **Übersicht, «Rechnungen hochladen».** Erwartet: ein Upload-Fenster. Gesehen: Der Dialog «Rechnungen hochladen» geht auf, zuerst das Gebäude wählen. Klar.
2. **Vorher nachschauen.** Ich wollte wissen, welchen Verteilschlüssel die alten Allgemeinstrom-Rechnungen haben. Liste gefiltert nach Alpenblick und Allgemeinstrom: 4 Rechnungen von BKW Energie AG. Drei geöffnet, alle mit «Pro Fläche (m²)».
3. **Gebäude «Alpenblick» und beide PDFs gewählt.** Erwartet: Dwello liest die Dateien. Gesehen: nach wenigen Sekunden «2 von 2 Dateien gelesen. Bitte prüfen: 2.». Danach bleibt das Gebäude gesperrt («Das Gebäude gilt für alle Dateien …»).
4. **Hinweise zur Schlussrechnung gelesen.** Erwartet: was mit dem Akonto passiert. Gesehen: «Wählen Sie eine Kategorie.», «Prüfen Sie: Rechnungsdatum.», «Ergänzen Sie …: Fälligkeitsdatum.» Dann fett: Akonto CHF 1’000.00 abgezogen, vorgeschlagen CHF 1’250.00. Danach der lange Absatz (P-1). Daraus habe ich mitgenommen: die Akontorechnung nicht erstellen.
5. **Hinweis zur Akontorechnung.** Erwartet: «nicht erfassen». Gesehen: genau das. Das Häkchen ist schon leer. Gut.
6. **«Angaben prüfen» bei der Schlussrechnung.** Gesehen: Vorschau des PDF, Rechnungsnummer R-1001, Datum 31.03.2026 («Die KI ist unsicher»), Leistungszeitraum 01.01. bis 31.03.2026, Betrag 1250.00, Kategorie leer.
7. **Kategorie «Allgemeinstrom» gewählt.** Erwartet: Verteilschlüssel wie bei den anderen, also Pro Fläche. Gesehen: «Pro Fläche (m²)» ist gewählt. Passt, nur ohne Begründung (P-4). Der Knopf heisst jetzt «1 Rechnung erstellen».
8. **«1 Rechnung erstellen».** Erwartet: Bestätigung. Gesehen: grüne Meldung «1 Rechnung erstellt» mit dem Link «Werke Schlussrechnung, 31.03.2026». Der Dialog bleibt offen.
9. **Seite der Rechnung.** Gesehen: Betrag CHF 1’250.00, darunter ein gelber Kasten (Akonto abgezogen, «Prüfen Sie, dass sie nur einmal zählen …»). Dann «In Abrechnungen enthalten: Keine» (P-3). Kategorisierung Allgemeinstrom, Pro Fläche (m²). Beleg «Werke Schlussrechnung.pdf» ist gespeichert.
10. **«Rechnung bearbeiten».** Erwartet: dieselben Angaben, editierbar. Gesehen: Alles ist richtig vorbelegt (Allgemeinstrom, Pro Fläche, 1250.00, R-1001). Unter dem Betrag derselbe gelbe Kasten wie auf der Seite der Rechnung. «In Abrechnungen enthalten» gibt es hier nicht (P-2). Nicht gespeichert, ich habe nichts geändert.

## Verwirrung

- **«abgerechnet»** im Hinweis meint die Akontorechnungen. Die Zeile «In Abrechnungen enthalten» darunter meint aber diese Rechnung (P-3).
- **«weniger die Akontorechnungen, die schon abgerechnet sind»**: Woher soll ich das wissen? Dafür müsste ich jede Akontorechnung einzeln öffnen (P-2).
- **«lassen Sie den Leistungszeitraum erst nach der Abrechnungsperiode beginnen, in der sie abgerechnet ist»**: Das musste ich zweimal lesen. Welche Abrechnungsperiode genau?
- **«berichtigen Sie die Abrechnungen mit ihnen»**: Ich weiss nicht, wie man eine Abrechnung berichtigt. Es gibt dazu keinen Link.
- **«Verteilschlüssel (optional)»** mit dem Satz «Ohne Verteilschlüssel … gleichmässig pro Wohnung» ist verständlich.

## Fehlerrisiken

- Wer die Akontorechnungen schon vorher einzeln erfasst hat, liest den langen Absatz auf dem Handy vielleicht nicht zu Ende. Dann zählen sie doppelt.
- Wer «In Abrechnungen enthalten: Keine» auf die Akontorechnungen bezieht, zieht nichts ab, obwohl eine schon abgerechnet ist (P-3).
- Auf der Bearbeiten-Seite fehlt jeder Hinweis, ob die Rechnung schon abgerechnet ist (P-2). Der Satz oben «Bestehende Abrechnungen ändern sich dadurch nicht» hilft da nur halb.

## Vorschläge

- **P-1:** Hochladen, Alpenblick, «Werke Schlussrechnung.pdf» und «Werke Akontorechnung.pdf» wählen, bis zum Hinweis scrollen. Hilfreich: zuerst ein kurzer Satz, was jetzt zu tun ist («Erstellen Sie nur diese Schlussrechnung. Erfasste Akontorechnungen löschen Sie.»). Die Sonderfälle (schon abgerechnet, 0, weniger als 0) zum Aufklappen oder als Link auf eine Hilfe.
- **P-2:** Erstellte Schlussrechnung öffnen, «Rechnung bearbeiten», zum Betrag scrollen. Hilfreich: «In Abrechnungen enthalten» auch hier zeigen. Ideal wäre zusätzlich, welche Akontorechnungen desselben Rechnungsstellers im Gebäude schon abgerechnet sind, mit Link.
- **P-3:** Seite der Rechnung öffnen, Hinweis unter dem Betrag lesen, dann die Zeile «In Abrechnungen enthalten». Hilfreich: «Diese Rechnung ist in keiner Abrechnung enthalten.» als ganzer Satz, oder die Zeile vom Akonto-Kasten weiter weg setzen.
- **P-4:** Hochladen, «Angaben prüfen», Kategorie «Allgemeinstrom». Hilfreich: ein Satz am Feld, z. B. «Wie bei den anderen Rechnungen dieser Kategorie in Alpenblick.»
- **P-5:** Die drei Stellen vergleichen. Hilfreich: ein Wortlaut, nur der Ort für «Rechnung löschen» darf je nach Seite abweichen.

## Nicht geprüft

- Was der Knopf «0 Rechnungen erstellen (1 unvollständig)» beim Tippen tut. Ich wollte nichts Unfertiges speichern.
- Was nach «1 Rechnung erstellt» im Dialog übrig bleibt (die Akontorechnung) und ob «Abbrechen» danach etwas verwirft. Dafür habe ich nur den oberen Teil des Dialogs gesehen.
- Der Fall «Akontorechnung schon abgerechnet»: In Alpenblick gibt es keine erfasste Akontorechnung der Werke, und ich wollte keine Abrechnung erstellen.
- Speichern beim Bearbeiten: nicht geändert, also nicht gespeichert.
- Dunkler Modus und andere Sprachen.
