# Persona-Lauf: Marco – Rechnungen hochladen (Gutschrift, Lift, Datei gross anzeigen, Beleg)

Marco, 38, auf dem Handy (390 × 844, Touch), wenig Zeit. Gebäude: «Seepark Residenz». Dateien aus `/tmp/persona-files`: «Werke Schlussrechnung 2025.pdf», «Lift Service und Reparatur.pdf», «Werke Gutschrift 2025.pdf». Die Dateien selbst enthalten nur das Wort «Rechnung»; die Werte in den Feldern kommen vom Stand-in der KI. Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/42225c72-2497-5110-b437-fe1c26488178/scratchpad/marco-233/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Hochladen, Zeile «Werke Gutschrift 2025.pdf» | Der Hinweis sagt «Erstellen Sie daraus keine Rechnung», darunter steht aber dieselbe Aufgabenliste wie bei einer Rechnung: «Wählen Sie eine Kategorie. Prüfen Sie: Rechnungsdatum. Ergänzen Sie … Fälligkeitsdatum.» Das widerspricht sich. |
| P-2 | Minor | Hochladen, Zeile Gutschrift | «hier in ihrer Zeile»: Es ist unklar, welche Zeile gemeint ist (die der Werke-Schlussrechnung?). Der Betrag der Gutschrift steht nicht im Hinweis. Ich muss erst «Angaben prüfen» öffnen und finde ihn dann im Feld «Betrag», wie bei einer Rechnung. Die Checkbox «Diese Rechnung erstellen» kann ich trotzdem anhaken. |
| P-3 | Minor | Hochladen, Zeilen Lift und Gutschrift | Beide Zeilen sind am Anfang nicht angehakt, die Werke-Zeile schon. Nirgends steht, warum. Bei der Lift-Rechnung blieb der Haken auch nach der Wahl der Kategorie weg. Ich musste selber merken, dass ich ihn setzen muss. Der Knopf zeigte die ganze Zeit «0 Rechnungen erstellen (1 unvollständig)». |
| P-4 | Minor | Hochladen, «Datei gross anzeigen» | Auf dem Handy liegen die Vorschau und der Link über allen Feldern. Zum Vergleichen muss ich zwischen dem neuen Tab und den Feldern weiter unten hin- und herwechseln. Die kleine Vorschau (310 × 384 px) ist zum Lesen von Beträgen zu klein. Neben dem Feld «Betrag» gibt es keinen Weg zurück zur Datei. |
| P-5 | Minor | Hochladen und Detail der Rechnung | Die gleiche Sache heisst zweimal anders: beim Hochladen «Akontozahlungen nicht zusätzlich als eigene Rechnungen erfassen», auf der Rechnung «die Akontorechnungen dürfen nicht zusätzlich erfasst sein». Sind das zwei verschiedene Dinge? |
| P-6 | Nit | Frage «Hochladen abbrechen?» nach dem Erstellen | Der rote Knopf «Abbrechen und verwerfen» klingt, als würde auch die gerade erstellte Rechnung verworfen. Der Text darüber sagt zwar «Erstellte Rechnungen bleiben gespeichert», ich habe aber trotzdem kurz gezögert. |
| P-7 | Nit | Hochladen («Datei gross anzeigen») und Detail («Beleg anzeigen») | Auf 390 px steht der Linktext in zwei Spalten nebeneinander: links «Datei gross anzeigen» bzw. «Beleg anzeigen», rechts «(öffnet in neuem Tab)», beide umgebrochen. Das wirkt wie zwei Knöpfe. |

## Beobachtungen

- Das native Dateifeld zeigt «Choose Files» und «No file chosen» auf Englisch, und zwar auch nachdem drei Dateien gewählt und gelesen sind (headless Chromium; auf einem echten Handy sieht das vermutlich anders aus).
- Zweiter Durchgang mit denselben Dateien: Die Werke-Zeile meldet «Diese Rechnung ist schon erfasst.» und ist nicht angehakt. Das ist gut, so gibt es kein Doppel. Darunter steht aber trotzdem wieder «Wählen Sie eine Kategorie.» Einen Link zur schon erfassten Rechnung gibt es nicht.
- Werte vom Stand-in: Rechnungsdatum 31.03.2026 und Leistungszeitraum Q1 2026 für eine Datei namens «… 2025». Der Rechnungssteller ist der Dateiname. Die Beschreibung lautet bei allen drei Dateien «Allgemeinstrom Q1». Die Gutschrift hat den gleichen positiven Betrag (CHF 1’250.00) wie die Rechnung. Beim Datum steht wenigstens «Die KI ist unsicher. Bitte prüfen Sie den Wert.»
- Der Hinweiskasten heisst «Hinweise zu <Dateiname>» und wiederholt den Dateinamen, der direkt darüber steht. Auf dem Handy kostet das zwei Zeilen.
- Mit dem Mausrad scrollt die Rechnungsliste hinter dem Dialog statt der Dialog selbst (mit echter Touch-Geste nicht prüfbar).
- In der Liste stehen Rechnungen anderer Personas (z. B. dreimal CHF 1’250.00 Allgemeinstrom). Die zähle ich nicht.

## Aufgabe geschafft: ja

Die Werke-Schlussrechnung ist in «Seepark Residenz» erstellt (Kategorie Allgemeinstrom, CHF 1’250.00, mit Beleg). Für den Abbrechen-Test nach dem Erstellen habe ich zusätzlich die Lift-Rechnung erstellt (Kategorie Lift, Betrag wie vorgeschlagen, weil die Datei keine Aufteilung zeigt).

## Aufwand

Etwa 25 Minuten, 11 Skriptläufe. Für Marco selbst: etwa 15 Tipps für die erste Rechnung (Menü, Rechnungen, Hochladen, Gebäude, Dateien, Angaben prüfen, Kategorie, Erstellen) und viel Scrollen im Dialog, weil jede aufgeklappte Zeile etwa 4 Bildschirmhöhen lang ist.

## Ablauf

1. **Menü → Rechnungen → «Rechnungen hochladen».** Erwartet: ein Dialog. Gesehen: Dialog mit Erklärung, dass nur die Dateien erstellter Rechnungen als Beleg gespeichert werden. Das Dateifeld bleibt gesperrt, bis ich ein Gebäude wähle; der Hinweis dazu ist klar.
2. **Seepark Residenz wählen, drei Dateien wählen.** Erwartet: Die KI liest sie. Gesehen: «3 von 3 Dateien gelesen. Bitte prüfen: 3.» Danach ist das Gebäude gesperrt, und es steht dabei, warum.
3. **Hinweise lesen (Aufgabe 1).**
   - Werke: Bereits bezahlte CHF 1’000.00 sind abgezogen; vorgeschlagen ist das Total vor dem Abzug; die Akontozahlungen soll ich nicht zusätzlich erfassen. Verstanden.
   - Lift: Die Rechnung enthält nicht umlagefähige Kosten. Ich soll hier nur den umlagefähigen Betrag eintragen und den Rest danach mit «Rechnung erfassen» unter Reparaturen. Verstanden und konkret. Welcher Teil umlagefähig ist, muss ich aber selber aus dem Papier herausfinden (die Testdatei zeigt nichts).
   - Gutschrift: Ich soll daraus keine Rechnung erstellen, sondern den Betrag der zugehörigen Rechnung verringern. Im Prinzip verstanden, aber «hier in ihrer Zeile» musste ich zweimal lesen (P-2), und darunter steht trotzdem «Wählen Sie eine Kategorie» (P-1).
   - Antwort: Ja, ich weiss bei beiden, was zu tun ist. Bei der Gutschrift aber mit Stirnrunzeln.
4. **«Angaben prüfen» bei Werke, «Datei gross anzeigen» (Aufgabe 2).** Erwartet: Datei gross daneben oder in neuem Tab. Gesehen: kleine Vorschau, darunter der Link «Datei gross anzeigen (öffnet in neuem Tab)». Der Tipp öffnet einen neuen Tab (Blob-Adresse); headless zeigt ihn leer, das PDF selbst konnte ich dort nicht sehen. Vergleichen auf dem Handy heisst Tab wechseln, zurück, hinunterscrollen zu «Betrag» (P-4). Der Inhalt der Testdateien («Rechnung») gibt nichts zum Vergleichen her.
5. **Kategorie wählen und erstellen (Aufgabe 3).** Kategorie «Allgemeinstrom». Der Hinweis «Wählen Sie eine Kategorie» verschwindet, der Knopf heisst jetzt «1 Rechnung erstellen». Nach dem Tipp erscheint oben im Dialog ein grüner Kasten «1 Rechnung erstellt», darin der Link «Werke Schlussrechnung 2025, 31.03.2026». Die Werke-Zeile ist weg, die zwei anderen bleiben. Klar und gut.
6. **«Abbrechen» (Aufgabe 3).** Vor dem Erstellen (Probedurchgang): «Hochladen abbrechen? Hochgeladene Dateien und Ihre Eingaben gehen verloren.» mit «Weiter prüfen» und «Abbrechen und verwerfen». Nach dem Erstellen der Lift-Rechnung: «Erstellte Rechnungen bleiben gespeichert. Die übrigen Dateien und Ihre Eingaben gehen verloren.» Der Text ist richtig, der rote Knopf macht kurz Angst (P-6). Ich habe bestätigt: Der Dialog schliesst sich, und auf der Seite «Rechnungen» bleibt der grüne Kasten «1 Rechnung erstellt» mit Link. Sehr gut.
7. **Werke-Rechnung öffnen (Aufgabe 4).** Ich habe sie über Suche und Gebäudefilter gefunden. Der Abschnitt «Beleg» zeigt den Dateinamen und den Knopf «Beleg anzeigen (öffnet in neuem Tab)». Dass ein neuer Tab aufgeht, steht sichtbar da und ist auch im Namen des Links. Darunter steht ein Hinweis zu den abgezogenen CHF 1’000.00, ausserdem «Bewahren Sie die Originalrechnung auf; Mieter dürfen sie einsehen.» und die Möglichkeit, den Beleg zu ersetzen. Der Tipp öffnet einen neuen Tab, der Server liefert das PDF zum Anzeigen (inline) mit dem richtigen Dateinamen.

## Verwirrung

- «hier in ihrer Zeile» (Gutschrift): Welche Zeile?
- «Akontozahlungen» und «Akontorechnungen»: Ist das dasselbe?
- «Diese Rechnung erstellen» bei einer Gutschrift: Ich soll keine Rechnung erstellen, also bleibt der Haken weg. Dass das Feld trotzdem eine Kategorie verlangt, verwirrt.
- Warum sind Lift und Gutschrift von Anfang an nicht angehakt?
- «Abbrechen und verwerfen»: Was wird verworfen, wenn schon etwas gespeichert ist?

## Fehlerrisiken

- Gutschrift: Ich kann den Haken setzen, eine Kategorie wählen und sie als normale Rechnung mit positivem Betrag erstellen. Dann zählt sie als Kosten statt als Abzug. Ich habe das nicht ausprobiert, um keine falschen Daten zu erzeugen.
- Lift: Wer den vorgeschlagenen Betrag übernimmt (wie ich, weil die Datei nichts zeigt), verrechnet Reparaturkosten als umlagefähig. Der Hinweis ist da, aber das Feld «Betrag» selbst warnt nicht.
- Auf dem Handy wechsle ich zum Vergleichen den Tab und komme zurück. Ob der Dialog mit den Eingaben dann noch da ist, habe ich headless nicht prüfen können.

## Vorschläge

- **P-1:** Hochladen → Seepark Residenz → «Werke Gutschrift 2025.pdf» → Hinweiskasten lesen. Bei einer Gutschrift nur den Gutschrift-Hinweis zeigen, ohne «Wählen Sie eine Kategorie / Prüfen Sie / Ergänzen Sie».
- **P-2:** Gleiche Schritte. Im Hinweis den Betrag der Gutschrift nennen und sagen, welche Zeile gemeint ist, z. B. «Ziehen Sie CHF … vom Betrag der zugehörigen Rechnung ab (in deren Zeile oben oder, wenn schon erfasst, mit «Rechnung bearbeiten»).» Den Haken bei einer Gutschrift sperren oder vor dem Erstellen nachfragen.
- **P-3:** Hochladen mit den drei Dateien → Lift- und Gutschrift-Zeile sind nicht angehakt. Unter der Checkbox kurz sagen, warum, z. B. «Nicht angehakt: Prüfen Sie zuerst den Betrag.» Oder nach dem Prüfen anbieten, den Haken zu setzen.
- **P-4:** Hochladen → «Angaben prüfen» → «Datei gross anzeigen» auf 390 px. Den Link auch direkt beim Feld «Betrag» wiederholen, oder die Vorschau beim Scrollen mitführen bzw. antippbar vergrössern.
- **P-5:** Upload-Hinweis der Werke-Zeile mit dem Hinweis im Abschnitt «Beleg» der erstellten Rechnung vergleichen. Ein Wort wählen und es an beiden Orten gleich verwenden.
- **P-6:** Werke erstellen → «Abbrechen». Den Knopf nach dem Erstellen z. B. «Übrige Dateien verwerfen» nennen.
- **P-7:** «Datei gross anzeigen» bzw. «Beleg anzeigen» auf 390 px ansehen. Den Zusatz «(öffnet in neuem Tab)» unter den Linktext setzen statt daneben, oder als eine Zeile umbrechen lassen.

## Nicht geprüft

- Den Inhalt des neuen Tabs (PDF): headless Chromium zeigt keine PDFs an, der Tab blieb leer. Geprüft habe ich nur, dass ein neuer Tab aufgeht und der Server ein PDF zum Anzeigen liefert.
- Den Vergleich «Datei gegen Feld»: Die Testdateien enthalten nur «Rechnung», die Werte stammen vom Stand-in.
- Echte Wischgesten: Gescrollt habe ich mit `scrollIntoView`. Ob der Hintergrund bei Touch mitscrollt, ist offen.
- Das Erstellen der Gutschrift als Rechnung (Fehlerrisiko oben): bewusst nicht gemacht.
- Ob der Dialog nach einem Tab-Wechsel auf einem echten Handy erhalten bleibt.
