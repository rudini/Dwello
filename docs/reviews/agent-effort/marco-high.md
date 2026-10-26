# Marco – Rechnungen hochladen (Seepark Residenz), Handy 390 × 844, Touch

Aufgabe: Drei Rechnungen auf einmal hochladen («Werke Schlussrechnung 2025.pdf», «Werke Gutschrift 2025.pdf», «Lift Service und Reparatur.pdf»), Hinweise jeder Zeile lesen, mit der Datei vergleichen, erstellen, was richtig ist, Dialog schliessen, Beleg auf der Rechnung ansehen.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/b7d908b2-73e1-5f84-b9be-1b074eb385f7/scratchpad/marco-bench-high/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Dialog «Rechnungen hochladen», Zeile «Werke Gutschrift 2025.pdf» | Der Hinweis sagt «Verringern Sie den Betrag der Rechnung, zu der sie gehört, um die Gutschrift», nennt aber weder den Betrag der Gutschrift noch die Rechnung, zu der sie gehört (beim Akonto-Hinweis steht der Betrag, CHF 1'000.00). Den Betrag finde ich erst unter «Angaben prüfen», dort steht er ohne Minus wie bei einer normalen Rechnung (CHF 1250.00, gleich viel wie die Schlussrechnung). Ziehe ich ihn ab, steht bei der Schlussrechnung 0.00, und Dwello sagt nur «Bitte geben Sie einen gültigen Betrag ein», aber nicht, was ich jetzt tun soll. Ich habe die Gutschrift am Ende nicht verrechnet: Das Risiko ist, dass die Mieter zu viel bezahlen. |
| P-2 | Minor | Dialog, Zeile «Lift Service und Reparatur.pdf» | Die Zeile ist von Anfang an nicht angehakt («Diese Rechnung erstellen» leer), und nirgends steht, warum. Der Hinweis sagt «Tragen Sie hier nur den umlagefähigen Betrag ein», aber nicht «Haken setzen». Der Knopf zählt die Zeile nicht mit («0 Rechnungen erstellen (1 unvollständig)», die 1 ist die Werke-Zeile). Wer schnell ist, erstellt nur die Werke-Rechnung, und die Lift-Rechnung samt Datei ist weg. |
| P-3 | Minor | Dialog nach dem Erstellen | Nach «2 Rechnungen erstellt» bleibt die Gutschrift-Zeile stehen. Der einzige Weg hinaus ist «Abbrechen», dann kommt ein rotes «Abbrechen und verwerfen». Der Text beruhigt («Erstellte Rechnungen bleiben gespeichert …»), aber ich habe gezögert: «Abbrechen und verwerfen», obwohl ich gerade gespeichert habe? Ein «Schliessen» oder «Fertig» hätte ich erwartet. |
| P-4 | Minor | Dialog, Zeile «Werke Schlussrechnung 2025.pdf» | Ich habe den Leistungszeitraum auf 2025 gesetzt (die Datei heisst «Schlussrechnung 2025»). Für 2025 gibt es bei Seepark schon Abrechnungen. Das erfahre ich erst nach dem Speichern auf der Rechnung («Nicht in den Abrechnungen … gibt es schon Abrechnungen ohne diese Rechnung»), in der Zeile im Dialog steht nichts davon. Gut erklärt, aber zu spät: Ich hätte es vor dem Erstellen wissen wollen. |

## Beobachtungen

- Nach dem Hochladen steht im gestrichelten Feld weiterhin der Knopf des Browsers «Choose Files / No file chosen» (Englisch, und «keine Datei gewählt», obwohl drei gelesen sind); gleich im Abschnitt «Beleg» der Rechnung. Das kann am Testbrowser liegen, auf meinem Handy sähe es anders aus.
- In den zugeklappten Zeilen sehe ich weder Rechnungssteller noch Betrag oder Datum, nur Dateiname und Hinweise. Für jede Zeile muss ich «Angaben prüfen» antippen und dann weit nach unten scrollen (eine offene Zeile ist auf dem Handy über 3'400 px hoch).
- Die KI-Werte (Stand-in, nicht ein echtes Modell): alle drei Zeilen haben die gleiche Rechnungsnummer R-1001, das gleiche Datum 31.03.2026, Zeitraum Q1 2026, Betrag 1250.00, Beschreibung «Allgemeinstrom Q1», und als Rechnungssteller den Dateinamen («Werke Schlussrechnung 2025»). Die Datei heisst aber «2025». Das liegt am Stand-in.
- Gut: «Die KI ist unsicher. Bitte prüfen Sie den Wert.» beim Rechnungsdatum und «Die KI hat diesen Wert nicht gefunden …» beim Fälligkeitsdatum, direkt am Feld.
- Gut: Tippe ich «Rechnungen erstellen», solange etwas fehlt, springt der Fokus auf die Kategorie der Werke-Zeile mit rotem «Wählen Sie eine Kategorie.» Das hat sofort geholfen.
- Die Kategorie-Liste war direkt nach dem Aufklappen kurz leer (nur «Kategorie auswählen»), nach etwa einer Sekunde war sie voll.
- Der Link «Datei gross anzeigen (öffnet in neuem Tab)» bricht auf dem Handy in zwei Spalten um («Datei gross / anzeigen» links, «(öffnet in / neuem Tab)» rechts); gleich bei «Beleg anzeigen (öffnet in neuem Tab)». Sieht unruhig aus, stört aber nicht.
- Die Vorschau im Dialog zeigte eine leere weisse Seite. Das stimmt, meine Test-PDFs sind leer.
- Gut: Die Erfolgsmeldung «2 Rechnungen erstellt» mit Links «Werke, 31.03.2026» und «Lift Service, 31.03.2026».
- Gut: Auf der Rechnung steht im Abschnitt «Beleg» der Dateiname, «Beleg anzeigen» und die passenden Hinweise noch einmal (Akonto bei Werke, nicht umlagefähige Kosten bei Lift). Der Beleg kommt als PDF mit dem richtigen Dateinamen («Lift Service und Reparatur.pdf», inline).
- «Beleg ersetzen» lässt sich ohne Datei antippen, dann kommt «Wählen Sie eine Datei.» Okay.
- «Rechnung erfassen» (für den Reparatur-Rest) hat kein Feld für einen Beleg. Der Rest hängt also ohne Datei da; die Datei liegt nur bei der Lift-Rechnung. Gut: Mit der Kategorie «Reparaturen» wird «Umlagefähig» automatisch ausgeschaltet und erklärt.
- In «Rechnung erfassen» stehen die Gebäude ohne PLZ und Ort («Seepark Residenz – Seeweg 15»), im Upload-Dialog mit («… 6003 Luzern»).
- Kein seitliches Scrollen bei 390 px; Knöpfe 48 px hoch, das Kästchen selbst 24 × 24, aber die Beschriftung daneben ist 48 px hoch antippbar.

## Aufgabe geschafft: ja

Drei Dateien hochgeladen, zwei Rechnungen erstellt (Werke CHF 1'250.00 Allgemeinstrom, Leistungszeitraum 2025; Lift Service CHF 450.00 Lift), Gutschrift nicht erstellt, Dialog geschlossen, Belege auf beiden Rechnungen gesehen. Danach den Reparatur-Rest (CHF 800.00, Reparaturen, nicht umlagefähig) mit «Rechnung erfassen» nacherfasst, wie der Hinweis sagt. Die Gutschrift habe ich nicht verrechnet (P-1). Die Aufteilung 450 / 800 bei der Lift-Rechnung habe ich angenommen, weil die Test-Dateien keinen Inhalt haben.

## Aufwand

Etwa 12 Minuten (geschätzt für einen Menschen auf dem Handy), rund 32 Schritte: Upload bis Erstellen etwa 20 Taps und Eingaben (davon 3× «Angaben prüfen», 10 Feldänderungen, 1 Fehlversuch mit 0.00), Schliessen 2, Rechnung und Beleg ansehen 3, Reparatur-Rest erfassen etwa 7.

## Ablauf

1. Nach dem Hochladen. Erwartet: alle drei Zeilen angehakt, oder ein Satz, warum nicht. Gesehen: nur die Werke-Zeile angehakt, Gutschrift (mit Begründung) und Lift (ohne Begründung) leer (P-2).
2. Zeilen lesen. Erwartet: Betrag und Rechnungssteller in der Zeile. Gesehen: nur Dateiname und Hinweise; Angaben erst nach «Angaben prüfen».
3. Gutschrift verrechnen. Erwartet: im Hinweis der Betrag der Gutschrift und zu welcher Rechnung sie gehört. Gesehen: kein Betrag; unter «Angaben prüfen» CHF 1250.00 ohne Minus. Werke-Betrag 1250 − 1250 = 0.00 eingegeben, «Rechnungen erstellen» angetippt: Fokus auf Betrag, «Bitte geben Sie einen gültigen Betrag ein», kein Rat, was ich tun soll. Betrag wieder auf 1250.00 (P-1).
4. Mit der Datei vergleichen («Datei gross anzeigen»). Erwartet: das PDF gross. Gesehen: Es öffnet sich ein neuer Tab mit leerer Adresse, im Testbrowser wird kein PDF gezeigt (siehe «Nicht geprüft»). Die Vorschau im Dialog zeigte eine leere Seite (Test-PDF leer).
5. Erstellen. Erwartet: «2 Rechnungen erstellen». Gesehen: genau das, danach grüne Meldung mit zwei Links. Die Gutschrift-Zeile blieb stehen.
6. Dialog schliessen. Erwartet: «Schliessen». Gesehen: nur «Abbrechen», dann Rückfrage «Hochladen abbrechen?» mit rotem «Abbrechen und verwerfen» (P-3).
7. Werke-Rechnung ansehen. Erwartet: Rechnung mit Beleg. Gesehen: zusätzlich oben der Kasten «Nicht in den Abrechnungen» für 2025 (P-4).

## Vorschläge

- **P-1:** Reproduktion: Seepark Residenz, «Werke Schlussrechnung 2025.pdf» und «Werke Gutschrift 2025.pdf» hochladen; Hinweis der Gutschrift lesen, «Angaben prüfen» öffnen, Betrag der Schlussrechnung um den Gutschriftbetrag verringern → 0.00 → «Rechnungen erstellen». Hilfe: Im Gutschrift-Hinweis den Betrag nennen («Gutschrift über CHF …») und, wenn im gleichen Upload eine passende Rechnung desselben Rechnungsstellers liegt, deren Zeile nennen. Bei 0.00 oder weniger sagen, was zu tun ist (z. B. «Die Gutschrift ist so gross wie die Rechnung. Erstellen Sie dann keine Rechnung und bewahren Sie beide Belege auf.»).
- **P-2:** Reproduktion: «Lift Service und Reparatur.pdf» hochladen, Zeile ansehen: Kästchen leer, kein Grund. Hilfe: im Hinweis einen Satz wie «Diese Zeile ist noch nicht ausgewählt. Tragen Sie den umlagefähigen Betrag ein und setzen Sie dann den Haken.», oder die Zeile angehakt lassen und als unvollständig zählen, bis der Betrag bestätigt ist.
- **P-3:** Reproduktion: zwei Rechnungen erstellen, Gutschrift-Zeile bleibt, «Abbrechen» antippen. Hilfe: nach dem Erstellen einen Knopf «Schliessen» oder «Fertig», oder die Rückfrage mit «Dialog schliessen» statt «Abbrechen und verwerfen» beschriften, wenn schon etwas erstellt ist.
- **P-4:** Reproduktion: «Werke Schlussrechnung 2025.pdf» für Seepark hochladen, Leistungszeitraum 01.01.2025–31.12.2025 eintragen, erstellen, Rechnung öffnen. Hilfe: denselben Hinweis («Für 2025 gibt es schon Abrechnungen …») schon in der Zeile zeigen, sobald Datum oder Leistungszeitraum in eine schon abgerechnete Periode fällt.

## Nicht geprüft

- Grossansicht der Datei («Datei gross anzeigen») und «Beleg anzeigen» im neuen Tab: Der Testbrowser (headless Chromium) zeigt keine PDFs an. Der neue Tab blieb ohne Adresse, ein Screenshot lief in die Zeitbegrenzung. Geprüft habe ich: Der Link öffnet einen neuen Tab (target _blank, blob-Adresse), die Vorschau im Dialog ist ein Bild der ersten Seite, und der Beleg kommt vom Server als `application/pdf`, inline, mit dem Original-Dateinamen.
- Vergleich der Werte mit dem Inhalt der Datei: Die Test-PDFs sind leer (der Inhalt ist laut Aufgabe egal), also gab es nichts zu vergleichen; ich habe mich an die Dateinamen gehalten.
- Ziehen und Ablegen von Dateien: auf dem Handy nicht möglich, nur «auswählen» probiert.
- Die echte Dateiauswahl eines Handys (Fotos, Dateien-App): Im Test werden die Dateien direkt in die Auswahl gelegt.
