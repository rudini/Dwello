# Marco, bench233-sonnet: Rechnungen hochladen (Seepark Residenz), Mobile 390 x 844, Touch

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Hochladen, Zeile Schlussrechnung | Der Hinweis zu den abgezogenen Akontozahlungen sagt «Vorgeschlagen ist das Total vor dem Abzug». In der Datei steht aber nur das Wort «Rechnung», also nichts zum Vergleichen. Ich kann nicht prüfen, ob CHF 1'250.00 stimmt. Der Hinweis nennt weder den vorgeschlagenen Betrag noch die 1'000.00 im Zusammenhang («1'250 vorgeschlagen, davon 1'000 bezahlt»). Ich muss rechnen und raten. |
| P-2 | Minor | Hochladen, Zeile Lift | Der Hinweis «Tragen Sie nur den umlagefähigen Betrag ein» nennt nicht, wie viel das ist. Die Zeile zeigt dazu CHF 1'250.00 wie bei den anderen Dateien. Ein Laie weiss nicht, was er eintragen soll. Er braucht Hilfe, wo er den Anteil auf der Rechnung findet. |
| P-3 | Nit | Rechnung, Beleg | Der Knopf «Beleg anzeigen (öffnet in neuem Tab)» bricht auf dem Handy in zwei Spalten mit grosser Lücke um («Beleg anzeigen» links, «(öffnet in neuem Tab)» rechts). Es sieht kaputt aus. |
| P-4 | Nit | Hochladen, Zeile Gutschrift | Der Hinweis sagt «Erstellen Sie daraus keine Rechnung», trotzdem ist das Kästchen «Diese Rechnung erstellen» wählbar. Es ist aber nicht angehakt, das ist gut. Der Hinweis nennt nicht, zu welcher Rechnung die Gutschrift gehört. Auch nach dem Erstellen der Schlussrechnung bietet die Zeile keinen Weg dorthin. |

Was gut war (keine Befunde): die Hinweise sind verständlich. Das Abbrechen warnt ehrlich. Der Beleg ist vorhanden und das Hochladen nach dem Abbrechen bleibt erhalten.

## Beobachtungen
- Die Datei-Auswahl zeigt das Browser-Feld «Choose Files / No file chosen» auf Englisch, sowohl im Dialog als auch beim «Datei des Belegs». Im Headless-Browser sichtbar; im echten Handy-Browser sieht es anders aus. Nicht bewertet.
- Alle drei Dateien liefern vom Stand-in denselben Rechnungsnummer-, Betrags- und Beschreibungswert (R-1001, 1250.00, «Allgemeinstrom Q1»). Der Rechnungssteller ist der Dateiname. Das ist das Stand-in, kein Befund.
- Ich habe «Lift Service und Reparatur» zusätzlich erstellt (Kategorie Lift), um das Abbrechen nach dem Erstellen nochmals zu prüfen. Es liegt in Seepark Residenz.
- Beim Erneut-Hochladen derselben Schlussrechnung erscheint «Diese Rechnung ist schon erfasst.» mit Link «Erfasste Rechnung ansehen» und das Kästchen ist abgehakt. Das verhindert Doppelte.
- Das Rechnungsdatum der Schlussrechnung steht auf 31.03.2026 und «Prüfen Sie: Rechnungsdatum» bleibt auch nach Kontrolle bestehen. Ich konnte nicht bestätigen, dass der Hinweis verschwindet.

## Aufgabe geschafft
Teilweise. Schritte 1, 3 und 4 geschafft. Schritt 2 (Angaben mit der Datei vergleichen) war nicht sinnvoll möglich: Die Vorschau zeigt nur das Wort «Rechnung» (Screenshot 06-preview.png), keine Beträge. Der Link «Datei gross anzeigen» öffnete einen neuen Tab (blob-URL); dessen Inhalt konnte ich im Headless-Browser nicht fotografieren (Screenshot-Zeitüberschreitung des PDF-Viewers).

## Aufwand
Rund 20 Skriptläufe. Gebraucht habe ich fast 10 Schritte, bis der Dialog sass: Erst Gebäude wählen, dann Dateien. Der Aufwand lag am Test, nicht an der App.

## Ablauf (erwartet / gesehen)
1. Rechnungen > «Rechnungen hochladen». Erwartet: Dateiwahl. Gesehen: Dialog mit Erklärung «Dwello speichert die Datei jeder erstellten Rechnung als Beleg... Bewahren Sie die Originalrechnung auf; Mieter dürfen sie einsehen.» Gebäude ist zuerst Pflicht; die Dateiwahl ist bis dahin gesperrt, mit Hinweis «Wählen Sie zuerst das Gebäude». Gut.
2. Gebäude Seepark Residenz, drei Dateien. Gelesen: «3 von 3 Dateien gelesen. Bitte prüfen: 3.» Alle drei mit «Bitte prüfen» und einem Hinweiskasten.
   - Schlussrechnung: abgezogene CHF 1'000.00, «Erfassen Sie die Akontozahlungen nicht zusätzlich». Klar. Kästchen angehakt.
   - Lift: «nicht umlagefähig (z.B. Reparaturen)... erfassen Sie den Rest danach mit «Rechnung erfassen» in der Kategorie Reparaturen». Klar, weiss aber nicht, wie viel (P-2).
   - Gutschrift: «Erstellen Sie daraus keine Rechnung. Verringern Sie den Betrag der Rechnung... mit «Rechnung bearbeiten»». Klar; nicht angehakt.
   Weiss ich bei jeder Datei, was zu tun ist? Ja, bei Schlussrechnung und Gutschrift; bei Lift nur halb (P-2).
3. «Angaben prüfen» auf der Schlussrechnung: Vorschau, «Datei gross anzeigen (öffnet in neuem Tab)», dann alle Felder mit Hilfetexten. Betrag 1250.00, Datum 31.03.2026, Kategorie leer («Wählen Sie eine Kategorie»). Vergleich mit Datei siehe P-1.
4. Kategorie Allgemeinstrom gewählt, «1 Rechnung erstellen». Gesehen: grüner Kasten «1 Rechnung erstellt: Werke Schlussrechnung 2025, 31.03.2026» mit Link; die zwei übrigen Dateien bleiben stehen, Knopf «0 Rechnungen erstellen» gesperrt mit «Wählen Sie mindestens eine Rechnung zum Erstellen.».
5. «Abbrechen». Erwartet: Dialog schliesst, vielleicht Rückfrage. Gesehen: Rückfrage «Hochladen abbrechen? Erstellte Rechnungen bleiben gespeichert. Die übrigen Dateien und Ihre Eingaben gehen verloren.» mit «Abbrechen und verwerfen» und «Weiter prüfen». Ohne erstellte Rechnung lautet der Text «Hochgeladene Dateien und Ihre Eingaben gehen verloren.» Sehr klar. Nach «Weiter prüfen» bleibt alles; nach «Abbrechen und verwerfen» schliesst der Dialog. Die Rechnung ist in der Liste vorhanden (Suche «Werke»).
6. Rechnung öffnen: Bereich «Beleg» mit Dateiname, «Beleg anzeigen (öffnet in neuem Tab)», eigener Hinweis «Auf dem Beleg sind bereits bezahlte Beträge abgezogen (CHF 1'000.00). Prüfen Sie, dass sie nur einmal zählen...». Ferner «Bewahren Sie die Originalrechnung auf; Mieter dürfen sie einsehen» und «Beleg ersetzen». Der Beleg-Link liefert ein PDF (200, application/pdf, 583 Byte).

## Verwirrung
- «Beleg» und «Datei» und «Rechnung» werden gemischt: Im Dialog «Datei gross anzeigen», in der Rechnung «Beleg anzeigen». Gemeint ist dasselbe Papier.
- «Akontozahlungen» und «Akontorechnungen» (zwei Schreibweisen für dasselbe) für einen Laien nicht erklärt.
- «Total der Leistungen vor dem Abzug» ist Fachsprache.
- Dialog: Der Hinweis bleibt auch nach dem Erstellen unter «Hinweise zu...» stehen, obwohl ich bereits gehandelt habe. Bei der erstellten Rechnung erscheint er aber zu Recht nochmals.

## Fehlerrisiken
- Die Lift-Rechnung lässt sich mit dem vollen Betrag erstellen; die nicht umlagefähigen Kosten landen dann bei den Mietern (P-2).
- Die Gutschrift kann man per Haken doch als Rechnung erstellen; nur der Text hält davon ab.
- Das Abbrechen nach dem Erstellen wirkt riskant, ist aber durch den Text gut abgesichert.

## Vorschläge
- P-1: Im Hinweis den Betrag nennen («Vorgeschlagen: CHF 1'250.00, das ist das Total vor Abzug von CHF 1'000.00»). Repro: Hochladen der Werke-Schlussrechnung.
- P-2: Hinweis mit Beispiel ergänzen («Wo steht der Anteil? Meist als eigene Zeile auf der Rechnung»), dazu den Betrag nicht vorbelegen oder als unsicher markieren. Repro: Lift-Datei hochladen, «Angaben prüfen».
- P-3: Beim Knopf den Zusatz «(öffnet in neuem Tab)» ohne Spreizung umbrechen lassen (linksbündig). Repro: Rechnung auf 390 px öffnen, Bereich Beleg.
- P-4: Bei Gutschriften das Kästchen «Diese Rechnung erstellen» sperren oder eine Bestätigung verlangen.

## Nicht geprüft
- Inhalt des Tabs bei «Datei gross anzeigen» und «Beleg anzeigen» (Headless-Chromium rendert keinen PDF-Viewer); ich habe nur den Link und die Auslieferung des PDF geprüft.
- Die Gutschrift habe ich nicht mit der Rechnung verrechnet; die Beträge der Dateien waren nicht lesbar.
- Echtes Touch-Gerät, Dunkelmodus, andere Sprachen.
- Skripte und Bildschirmfotos: /tmp/claude-0/-home-user-Dwello/8622ed40-8061-58f8-a107-a3f2cfa9096d/scratchpad/marco-bench233-sonnet/
