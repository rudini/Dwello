# Marco – Mehrere Rechnungen hochladen (Seepark Residenz), Mobile 390 × 844, Touch

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/b7d908b2-73e1-5f84-b9be-1b074eb385f7/scratchpad/marco-bench-medium/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Rechnungen hochladen, Zeile «Werke Gutschrift 2025.pdf» | Der Hinweis «Verringern Sie den Betrag der Rechnung … hier in ihrer Zeile» ist doppeldeutig: Ich habe «ihrer Zeile» zuerst als die Zeile der Gutschrift gelesen. Die Zeile sagt auch nicht, zu welcher Rechnung die Gutschrift gehört, und den Betrag der Gutschrift sehe ich erst nach «Angaben prüfen» (dort steht CHF 1250.00 als positiver Betrag, kein Hinweis «Gutschrift»). |
| P-2 | Minor | Rechnungen hochladen, Zeile «Lift Service und Reparatur.pdf» | Die Zeile ist ohne Haken bei «Diese Rechnung erstellen», die Schlussrechnung dagegen mit Haken. Nirgends steht, warum. Unter Zeitdruck hätte ich fast nur eine Rechnung erstellt und die Lift-Rechnung vergessen. |
| P-3 | Minor | Rechnungen hochladen, Schaltfläche unten | Die Schaltfläche heisst «0 Rechnungen erstellen (1 unvollständig)», sagt aber nicht welche Zeile und welches Feld. Bei Betrag 0.00 nennt der Hinweiskasten der Zeile das Problem nicht. Erst nach Tippen auf die Schaltfläche erscheint «Füllen Sie die markierten Felder aus» und beim Betrag «Bitte geben Sie einen gültigen Betrag ein». Dass eine Rechnung, die nach Abzug der Gutschrift 0 wäre, so nicht geht und was ich dann tun soll, sagt die Meldung nicht. |

## Beobachtungen

- Die zwei Erklärungen oben im Dialog (KI liest aus, nur erstellte Rechnungen werden als Beleg gespeichert) sind klar. Das Gebäude wird nach der Dateiauswahl gesperrt, mit Erklärung. Gut.
- Das Lesen der drei Dateien ging schnell. Die Statuszeile «3 von 3 Dateien gelesen. Bitte prüfen: 3.» ist verständlich.
- Hinweise je Zeile: Schlussrechnung (Akonto CHF 1’000.00 abgezogen, Total vor Abzug vorgeschlagen, Akonto nicht doppelt erfassen), Gutschrift (keine Rechnung daraus erstellen) und Reparatur (nur den umlagefähigen Teil eintragen, den Rest mit «Rechnung erfassen» in Reparaturen) sind gut verständlich und passen zum Dateinamen.
- Die KI-Angaben sind in allen drei Zeilen gleich: R-1001, 31.03.2026, Leistungszeitraum 01.01.–31.03.2026, CHF 1250.00, Beschreibung «Allgemeinstrom Q1». Der Rechnungssteller ist jeweils der Dateiname (z.B. «Werke Schlussrechnung 2025»). Die Gutschrift hat damit denselben Betrag wie die Rechnung. Das kommt von der Ersatz-KI und ist kein Befund. Ich habe die Werte deshalb gelassen, weil die Datei selbst keine Angaben zeigt.
- Die Vorschau in der Zeile zeigt die PDF-Seite (Screenshot 07-row1-preview: Seite mit «Werke Schluss»). Der Link «Datei gross anzeigen (öffnet in neuem Tab)» wird auf 390 px in zwei Spalten umbrochen («Datei gross / anzeigen» links, «(öffnet in / neuem Tab)» rechts). Dasselbe gilt für «Beleg anzeigen (öffnet in neuem Tab)» auf der Rechnungsseite. Das sieht etwas zerrissen aus.
- Unter der Dateiauswahl zeigt das native Feld «Choose Files / No file chosen» auf Englisch, auch nachdem drei Dateien gelesen waren (Screenshot 04-rows-viewport).
- Nach «2 Rechnungen erstellen» bleibt der Dialog offen. Der grüne Kasten «2 Rechnungen erstellt» enthält Links auf beide Rechnungen, die Gutschrift-Zeile bleibt stehen. Zum Schliessen gibt es nur «Abbrechen». Die Rückfrage «Hochladen abbrechen?» sagt aber klar «Erstellte Rechnungen bleiben gespeichert. Die übrigen Dateien und Ihre Eingaben gehen verloren.» Das hat mich beruhigt. Vor dem Speichern sagt sie «Hochgeladene Dateien und Ihre Eingaben gehen verloren.»
- In der Liste und auf der Rechnungsseite tragen die hochgeladenen Rechnungen den Hinweis «Manuell» bzw. «Manuell kategorisiert», weil ich die Kategorie selbst gewählt habe (die KI schlug keine vor).
- Rechnungsseite: Im Abschnitt «Beleg» stehen der Dateiname, «Beleg anzeigen» und die Hinweise aus dem Upload in angepasster Form («Auf dem Beleg sind bereits bezahlte Beträge abgezogen (CHF 1’000.00) …», bei der Lift-Rechnung der Hinweis auf nicht umlagefähige Kosten). So sehe ich später noch, worauf ich achten muss. Gut.
- Die Gutschrift wird nirgends gespeichert. Das sagt der Dialog auch («Dateien, aus denen Sie keine Rechnung erstellen, speichert Dwello nicht»), aber auf der Schlussrechnung erinnert nichts an die Gutschrift.
- Beim Löschen meiner Testrechnung stand in der Rückfrage «Der Beleg wird ebenfalls gelöscht.» Gut.

## Aufgabe geschafft: ja

Erstellt: «Werke Schlussrechnung 2025» (Allgemeinstrom, CHF 1’250.00) und «Lift Service und Reparatur» (Lift, CHF 1’250.00), beide mit Beleg, in der Seepark Residenz. Die Gutschrift habe ich nicht erstellt, wie es der Hinweis verlangt.

## Aufwand

Etwa 25 Minuten, 12 Skriptläufe. Für den eigentlichen Ablauf brauchte ich etwa 20 Taps: Dialog öffnen, Gebäude wählen, Dateien wählen, 2 × «Angaben prüfen», 2 × Kategorie, 1 Haken, erstellen, schliessen, Rechnung öffnen, Beleg anzeigen.

## Ablauf

- Zeile Lift: Ich erwartete, dass alle drei Zeilen ausser der Gutschrift angehakt sind. Die Lift-Zeile war ohne Haken, ohne Begründung (P-2).
- Gutschrift abziehen: Ich erwartete, dass ich den Betrag der Schlussrechnung um die Gutschrift verringern kann (1250 − 1250 = 0.00). Die Schaltfläche blieb bei «(1 unvollständig)». Der Grund («Bitte geben Sie einen gültigen Betrag ein») kam erst nach dem Tippen auf die Schaltfläche (P-3). Danach habe ich den vorgeschlagenen Betrag gelassen.
- «Datei gross anzeigen»: Ich erwartete die PDF gross in einem neuen Tab. Es öffnete sich ein neuer Tab (blob-Adresse), der im Testbrowser leer blieb (siehe «Nicht geprüft»).
- Schliessen nach dem Speichern: Ich erwartete eine Schaltfläche «Schliessen». Es gab nur «Abbrechen» mit einer Rückfrage. Diese sagte aber klar, dass die erstellten Rechnungen bleiben.

## Vorschläge

- **P-1:** Rechnungen hochladen → Seepark Residenz → die drei Dateien wählen → Zeile «Werke Gutschrift 2025.pdf» lesen. Hilfreich wäre ein eindeutiger Text, z.B. «… in der Zeile der Rechnung, zu der sie gehört (z.B. Werke Schlussrechnung 2025.pdf)». Den Betrag der Gutschrift direkt im Hinweis nennen («Gutschrift über CHF …»).
- **P-2:** Gleicher Ablauf, Zeile «Lift Service und Reparatur.pdf» ansehen: Sie ist ohne Haken. Entweder anhaken oder im Hinweis sagen: «Prüfen Sie den Betrag und haken Sie dann ‹Diese Rechnung erstellen› an.»
- **P-3:** Gleicher Ablauf, in der Zeile der Schlussrechnung den Betrag auf 0.00 setzen: Die Schaltfläche zeigt «(1 unvollständig)», ohne dass die Zeile es sagt. Hilfreich: Den fehlenden oder ungültigen Wert sofort im Hinweiskasten der Zeile nennen («Prüfen Sie: Betrag»). Wenn eine Gutschrift die ganze Rechnung aufhebt, sagen, was zu tun ist (z.B. keine der beiden erstellen).

## Nicht geprüft

- Der grosse Dateiview in einem neuen Tab: Der Link öffnet einen Tab mit einer blob-Adresse. Headless Chromium hat keinen PDF-Betrachter, der Tab blieb leer, das Bildschirmfoto lief in einen Timeout. Ebenso der Tab von «Beleg anzeigen». Dafür habe ich die Beleg-Adresse direkt abgerufen: Sie liefert `application/pdf` mit 391 Bytes, beginnend mit `%PDF-1.4`, also genau meine hochgeladene Datei. Die Vorschau im Dialog zeigte den Inhalt.
- Echte Inhalte der Rechnungen vergleichen: Die PDFs enthalten nur ein Wort, die Ersatz-KI liefert feste Werte. Ob die Angaben zur Datei passen, liess sich deshalb nicht beurteilen.
- Das Schliessen nach dem Speichern habe ich mit einer zweiten, eigenen Testrechnung geprüft (Lift-Datei, Beschreibung «TESTZEILE Marco – wird gelöscht», Kategorie Reparaturen). Ich habe den Dialog mit «Abbrechen und verwerfen» geschlossen, geprüft, dass die Rechnung bestehen bleibt, und sie danach wieder gelöscht. Im ersten Durchgang hatte mein Skript den Dialog nach dem Speichern nicht geschlossen.
- Den nicht umlagefähigen Rest der Lift-Rechnung als eigene Rechnung «Reparaturen» habe ich nicht erfasst, weil die Datei keine Aufteilung zeigt.
