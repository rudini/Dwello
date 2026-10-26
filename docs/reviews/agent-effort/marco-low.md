# Marco: drei Rechnungen hochladen (Seepark Residenz), Mobile 390 × 844, Touch

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Dialog «Rechnungen hochladen», Zeile Gutschrift | Der Hinweis sagt, ich soll die zugehörige Rechnung «um die Gutschrift» verringern, nennt aber den Betrag der Gutschrift nicht. In der Zeile steht als Betrag CHF 1250.00, positiv und gleich wie die Schlussrechnung. Ich wusste nicht, was ich abziehen soll, und habe es deshalb gelassen. |
| P-2 | Minor | Dialog nach «2 Rechnungen erstellen» | Die Gutschrift-Zeile bleibt stehen, und zum Schliessen gibt es nur «Abbrechen». Danach fragt die App «Hochladen abbrechen?» mit dem roten Knopf «Abbrechen und verwerfen», obwohl ich gerade erfolgreich gespeichert habe. Der Satz «Erstellte Rechnungen bleiben gespeichert» beruhigt zwar, aber erst, wenn man ihn liest. |
| P-3 | Minor | Dialog, Zeile «Lift Service und Reparatur» | Die Zeile war nicht angehakt. Laut Hinweis soll ich nur den umlagefähigen Teil eintragen, aber die Zeile sagt nicht, welcher Teil das ist. Ich habe die vollen CHF 1250.00 als Lift übernommen. Wahrscheinlich ist das falsch. |

## Beobachtungen
- Der Kategorie-Auswahl war direkt nach dem Aufklappen leer (nur «Kategorie auswählen»). Eine Sekunde später waren alle Kategorien da.
- Die vorgeschlagenen Werte kommen vom KI-Platzhalter: Als Rechnungssteller steht der Dateiname, die Beschreibung ist «Allgemeinstrom Q1» und das Datum ist 31.03.2026 bei einer Datei «2025». Alle drei Zeilen haben dieselben Werte.
- Die Hinweise zu Akonto, Gutschrift und Reparatur sind klar. Den Hinweis zu Akonto zeigt die Rechnung unter «Beleg» nochmals, das ist gut.
- Der Link «Datei gross anzeigen» öffnet einen neuen Tab (blob). Meine PDFs waren leer, darum konnte ich nichts vergleichen.
- Hinter dem Dialog stand nach dem Speichern noch «83 Rechnungen». Nach dem Neuladen waren es 85.
- Unter «Beleg» stehen der Dateiname und «Beleg anzeigen». Der Link liefert das PDF inline (200, application/pdf).
- Wenn eine Datei gewählt ist, ist das Gebäude gesperrt und es gibt einen Hinweis dazu. Das ist gut.

## Aufgabe geschafft: ja
Ich habe zwei Rechnungen erstellt (Werke Schlussrechnung als Allgemeinstrom, Lift Service als Lift) und die Gutschrift nicht. Die Gutschrift habe ich mangels Betrag nicht verrechnet.

## Aufwand
Etwa 10 Minuten und etwa 15 Tipps: Gebäude, Dateien, 2× «Angaben prüfen», 2× Kategorie, Haken, Beschreibung, Erstellen, Abbrechen, Bestätigen, Rechnung öffnen, Beleg.

## Ablauf
1. Rechnungen → «Rechnungen hochladen». Erwartet: ein Dialog. Gesehen: ein Dialog mit Gebäude und Dateiauswahl. Die Auswahl ist gesperrt, bis ein Gebäude gewählt ist.
2. Seepark Residenz gewählt, drei Dateien gewählt. Erwartet: drei Zeilen mit Werten. Gesehen: «3 von 3 Dateien gelesen. Bitte prüfen: 3». Die Gutschrift und der Lift waren nicht angehakt, jede Zeile hatte passende Hinweise.
3. «Angaben prüfen» bei der Schlussrechnung. Erwartet: eine Vorschau und Felder. Gesehen: ein Bild, «Datei gross anzeigen», alle Felder und «Die KI ist unsicher» beim Datum. Ich habe die Kategorie Allgemeinstrom gewählt.
4. Gutschrift. Erwartet: den Gutschriftbetrag, um ihn abzuziehen. Gesehen: CHF 1250.00 ohne Minus (P-1). Ich habe sie nicht erstellt.
5. Lift: Haken gesetzt, Kategorie Lift, Beschreibung angepasst. Den Betrag konnte ich nicht aufteilen (P-3).
6. «2 Rechnungen erstellen». Gesehen: «2 Rechnungen erstellt» mit Links zu beiden Rechnungen. Die Gutschrift-Zeile blieb stehen.
7. Dialog schliessen. Erwartet: «Schliessen» oder «Fertig». Gesehen: nur «Abbrechen» und danach die Frage «Abbrechen und verwerfen» (P-2).
8. Die Rechnung geöffnet. Gesehen: alle Angaben, darunter «Beleg» mit dem Dateinamen, «Beleg anzeigen» und dem Akonto-Hinweis.

## Verwirrung
- «Abbrechen und verwerfen» nach dem Speichern: Ich hatte Angst, dass das Gespeicherte verloren geht.
- Bei der Gutschrift: Welcher Betrag ist die Gutschrift?
- «Umlagefähig» ist bei der Lift-Rechnung angehakt, obwohl der Hinweis sagt, dass ein Teil nicht umlagefähig ist.

## Fehlerrisiken
- Bei der Lift-Rechnung wird der volle Betrag inklusive Reparatur auf die Mieter verteilt (P-3).
- Die Gutschrift wird vergessen oder falsch abgezogen (P-1).
- Wer im Dialog schnell abbricht, könnte glauben, dass nichts gespeichert wurde, und die Rechnungen nochmals hochladen. Dann gibt es Doppelte (P-2).

## Vorschläge
- P-1: Hochladen → Datei «… Gutschrift …» wählen → «Angaben prüfen». Nennen Sie im Hinweis den Gutschriftbetrag («Gutschrift CHF X») und zeigen Sie ihn mit einem Minus an. Noch besser wäre ein Knopf «Von Rechnung … abziehen».
- P-2: Nach dem Erstellen, wenn nur nicht angehakte Zeilen übrig sind, sollte der Knopf «Schliessen» heissen und es sollte keine Verwerfen-Frage kommen. Oder die Frage sollte sagen: «Die übrige Datei wird nicht gespeichert.»
- P-3: Lift-Datei hochladen → Zeile aufklappen. Zeigen Sie ein Feld «davon nicht umlagefähig» oder bieten Sie an, den Rest direkt als zweite Rechnung (Reparaturen) zu erstellen.

## Nicht geprüft
- Ob die Angaben zur Datei passen: Meine PDFs waren leer, und der Blob-Tab zeigt im Headless-Browser nichts an.
- Den Tab «Beleg anzeigen» habe ich nicht als Bild angesehen, nur die Antwort geprüft (PDF inline).
- Die Lift-Rechnung im Detail. Die Werte im Dialog hatten das gleiche Muster wie bei der Schlussrechnung.
- Nebenbei: Das Kit erwartete chromium_headless_shell-1243. Ich habe /root/.cache/pw-shim/chromium_headless_shell-1243 als Symlink auf 1248 angelegt.
