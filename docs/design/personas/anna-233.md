# Anna – Runde 233: mehrere Rechnungen auf einmal hochladen (Alpenblick)

Persona: Anna, 29, Erstvermieterin, nach Monaten wieder in Dwello. Desktop 1440 × 900, Maus; die erstellte Rechnung zusätzlich auf dem Handy (390 × 844) angesehen.
Gebäude: «Alpenblick». Dateien: «Sammelscan Januar.pdf», «Werke Schlussrechnung 2025.pdf», «Elektro Blitz AG.pdf».
Gespeichert habe ich zwei Rechnungen in Alpenblick: «Elektro Blitz AG, 31.03.2026» und «Werke Schlussrechnung 2025, 31.03.2026». Andere Datensätze habe ich nicht angefasst.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Rechnungen hochladen, Meldung nach «Rechnungen erstellen» | Im grünen Kasten steht nur «Noch offen: Werke Schlussrechnung 2025.pdf.», aber nicht, warum. Den Grund («Wählen Sie eine Kategorie.») finde ich erst, wenn ich weiter unten in der Zeile suche. |
| P-2 | Minor | Rechnungen hochladen, Meldung nach «Rechnungen erstellen» | Der Sammelscan ist auch noch nicht erledigt, wird bei «Noch offen» aber nicht genannt. Nach dem zweiten Erstellen ist «Noch offen» ganz weg, obwohl die Sammelscan-Zeile noch daliegt. Ich könnte meinen, die Datei sei erledigt. |
| P-3 | Nit | Rechnung (Detail), Kasten «Hinweise zum Beleg» | Beim Hochladen hiess es «Akontozahlungen», auf der Rechnungsseite heisst es «Akontorechnungen». Ich weiss nicht, ob das zwei verschiedene Dinge sind. |
| P-4 | Nit | Rechnungen hochladen, Hinweis zum Sammelscan | «Laden Sie jede Rechnung als eigene Datei hoch» geht davon aus, dass ich ein PDF aufteilen kann. Das kann ich nicht. Der zweite Weg («Rechnung erfassen» und dann «Beleg hinzufügen») funktioniert, wird aber erst an zweiter Stelle genannt. |

## Beobachtungen

- Wenn die erste Runde erstellt ist, sieht das Feld zum Hochladen anders aus. Am Anfang war es ein Knopf «Dateien hierher ziehen oder auswählen», danach sehe ich das rohe Browser-Feld «Choose Files / No file chosen» (Englisch, Screenshot 09). Auf der Rechnungsseite steht beim Beleg ebenfalls «Choose File / No file chosen».
- Die vorgelesenen Werte stammen von der Stand-in-KI: Rechnungsdatum 31.03.2026 und Leistungszeitraum 01.01.–31.03.2026 bei einer «Schlussrechnung 2025», Beschreibung «Allgemeinstrom Q1», Rechnungssteller «Werke Schlussrechnung 2025» (also der Dateiname). Elektro Blitz hat dieselben Werte (R-1001, CHF 1’250.00). Die Qualität dieser Werte bewerte ich nicht. Dazu passt aber: Die Übersicht sagt mir, für Alpenblick fehlen Rechnungen 2025, und meine beiden Rechnungen landen im Jahr 2026. Als Anna hätte ich das Datum nicht korrigiert, weil ich das Papier nicht neben mir habe.
- Auf der Rechnungsseite bricht der Knopf «Beleg anzeigen (öffnet in neuem Tab)» in zwei Spalten um und liest sich etwas holprig (Screenshot 12).
- Auf der Übersicht führt «Häufige Arbeiten» direkt zu «Rechnungen hochladen». Die Hilfe beschreibt den Weg in einem Satz unter «Rechnungen erfassen». Beides habe ich sofort gefunden.
- Auf dem Handy (390 px) zeigt die Rechnungsseite den Beleg-Kasten ohne seitliches Scrollen (scrollWidth 390).

## Aufgabe geschafft: ja

Ich habe die beiden lesbaren Rechnungen erstellt. Für den Sammelscan weiss ich, wie es weitergeht («Rechnung erfassen» und dann «Beleg hinzufügen»). Diesen Weg habe ich bis zum Knopf «Beleg hinzufügen» auf einer bestehenden Rechnung ohne Beleg nachgeprüft, aber nicht gespeichert.

## Aufwand

Etwa 20 Minuten, rund 12 Schritte: Übersicht, Hilfe, Hochladen, Gebäude wählen, Dateien wählen, drei Zeilen lesen, «Angaben prüfen», erstes Erstellen, Kategorie wählen, zweites Erstellen, Rechnung öffnen. Dazu kamen drei weitere Uploads für die Kategorie-Prüfung, aus denen ich nichts erstellt habe.

## Ablauf

1. **Übersicht.** *Erwartet:* einen Hinweis, wo ich Rechnungen erfasse. *Gesehen:* «Als Nächstes zu tun: Nebenkostenabrechnungen erstellen … Noch nicht abgerechnet: Alpenblick. Erfassen Sie zuerst alle Rechnungen …». Unter «Häufige Arbeiten» steht der Link «Rechnungen hochladen». Das passt genau.
2. **Hilfe.** *Erwartet:* eine Erklärung für mehrere Rechnungen. *Gesehen:* unter «Rechnungen erfassen» den Satz «Mehrere Rechnungen auf einmal: Wählen Sie unter «Rechnungen» «Rechnungen hochladen». Die KI liest die Dateien aus, und Sie prüfen die Angaben …». Kurz und klar.
3. **Dialog «Rechnungen hochladen».** *Erwartet:* Dateien wählen. *Gesehen:* Zuerst muss ich das Gebäude wählen; der Knopf zum Wählen der Dateien ist gesperrt, und darunter steht «Wählen Sie zuerst das Gebäude.». Das ist verständlich. Der Hinweis, dass nur die Dateien erstellter Rechnungen gespeichert werden, beruhigt mich.
4. **Drei Dateien gewählt.** *Erwartet:* eine Fortschrittsanzeige. *Gesehen:* «0 von 3 Dateien gelesen», bei jeder Zeile «Wird gelesen …», nach etwa 1,5 s dann «3 von 3 Dateien gelesen. Bitte prüfen: 3.».
   - Sammelscan: «Diese Datei enthält mehrere Rechnungen. Laden Sie jede Rechnung als eigene Datei hoch, oder erfassen Sie jede mit «Rechnung erfassen» und fügen Sie diese Datei danach auf ihrer Seite mit «Beleg hinzufügen» an.» Das Häkchen «Diese Rechnung erstellen» ist gesperrt. Ich weiss, wie es weitergeht, und nehme den zweiten Weg (siehe P-4).
   - Werke: Der Hinweis zu den abgezogenen Beträgen (CHF 1’000.00) erklärt, dass das Total vor dem Abzug vorgeschlagen ist und ich die Akontozahlungen nicht doppelt erfassen soll. Dazu kommen «Wählen Sie eine Kategorie.», «Prüfen Sie: Rechnungsdatum.» und «Ergänzen Sie …: Fälligkeitsdatum.».
   - Elektro Blitz: nur «Prüfen Sie: Rechnungsdatum.» und der Hinweis zum Fälligkeitsdatum.
   - Der Knopf heisst «1 Rechnung erstellen (1 unvollständig)». So sehe ich schon vor dem Klick, dass eine Rechnung fehlt.
5. **«Angaben prüfen» gleich nach dem Lesen, Kategorie-Liste (drei Versuche).** *Erwartet:* Die Liste ist sofort voll. *Gesehen:* Ich habe drei Mal neu hochgeladen, «Angaben prüfen» der Werke-Zeile geöffnet, sobald «3 von 3» dastand, und die Liste 2 s lang alle 50 ms angeschaut. Jedes Mal standen 22 Einträge drin («Kategorie auswählen», darunter gruppiert «Umlagefähige Kosten» mit Heizung, Warmwasser …), auch schon nach 11 bis 17 ms. Zwei weitere Versuche habe ich gemacht, bei denen ich «Angaben prüfen» schon beim ersten Erscheinen des Knopfs geklickt habe, und einen bei der Elektro-Zeile. Auch dort war die Liste nie leer. Bei Elektro Blitz war «Allgemeinstrom» schon gewählt.
6. **Erstellen ohne Kategorie für Werke.** *Erwartet:* Dwello erstellt die vollständige Rechnung und sagt mir, was noch fehlt. *Gesehen:* Ein grüner Kasten «1 Rechnung erstellt» mit dem Link «Elektro Blitz AG, 31.03.2026», darunter «Noch offen: Werke Schlussrechnung 2025.pdf.». Die Elektro-Zeile verschwindet. Die Werke-Zeile bleibt offen, ihr Kategorie-Feld ist rot markiert, und darunter steht «Wählen Sie eine Kategorie.». Der Knopf heisst jetzt «0 Rechnungen erstellen (1 unvollständig)». Gut ist, dass nichts verloren ging. Den Grund für «Noch offen» musste ich aber unten suchen (P-1), und der Sammelscan fehlt in «Noch offen» (P-2).
7. **Kategorie «Allgemeinstrom» gewählt und erstellt.** *Erwartet:* Werke wird erstellt. *Gesehen:* Der Knopf wird zu «1 Rechnung erstellen». Danach steht «2 Rechnungen erstellt» mit beiden Links da. Übrig bleibt nur der Sammelscan, mit «Wählen Sie mindestens eine Rechnung zum Erstellen.» und dem gesperrten Knopf «0 Rechnungen erstellen».
8. **Werke-Rechnung geöffnet, Beleg.** *Erwartet:* Ich sehe, dass die Datei gespeichert ist, und der Akonto-Hinweis steht noch da. *Gesehen:* Im Kasten «Beleg» stehen der Dateiname «Werke Schlussrechnung 2025.pdf» und der Link «Beleg anzeigen (öffnet in neuem Tab)». Darunter folgt der gelbe Kasten «Hinweise zum Beleg»: «Auf dem Beleg sind bereits bezahlte Beträge abgezogen (CHF 1’000.00). Prüfen Sie, dass sie nur einmal zählen: Ist der Betrag das Total vor dem Abzug, dürfen die Akontorechnungen nicht zusätzlich erfasst sein.» Dann «Bewahren Sie die Originalrechnung auf; Mieter dürfen sie einsehen.» und «Beleg ersetzen». Den Hinweis verstehe ich, er hat mich aber wegen des anderen Worts kurz stocken lassen (P-3). Oben steht «Manuell kategorisiert», was stimmt, denn ich habe die Kategorie gewählt.
9. **Sammelscan-Weg nachgeprüft (nur angesehen).** Eine bestehende Alpenblick-Rechnung ohne Beleg zeigt «Zu dieser Rechnung ist kein Beleg gespeichert.» und den Knopf «Beleg hinzufügen». Der Weg aus dem Hinweis existiert also.

## Verwirrung

- «Akontozahlungen» (beim Hochladen) und «Akontorechnungen» (auf der Rechnung): Ist das dasselbe? Die Hilfe kennt nur «Akonto».
- «Noch offen» ohne Grund: Ich habe kurz gedacht, die Datei sei hängen geblieben.
- «Beleg» ist für mich ein neues Wort. Auf der Rechnungsseite ist aber klar, dass damit meine hochgeladene Datei gemeint ist.

## Fehlerrisiken

- Der Sammelscan bleibt nach dem zweiten Erstellen ohne «Noch offen» liegen. Wer jetzt «Abbrechen» drückt, verliert ihn aus dem Blick, und die beiden Januar-Rechnungen fehlen später in der Abrechnung.
- Rechnungsdatum und Leistungszeitraum übernehme ich als Anfängerin eher ungeprüft. Ein Jahr daneben (hier 2026 statt 2025) fällt erst bei der Abrechnung auf. Das betrifft die Stand-in-Werte und steht deshalb unter «Beobachtungen».

## Vorschläge

- **P-1:** Mit «Rechnungen hochladen» im Gebäude Alpenblick die Datei «Werke Schlussrechnung 2025.pdf» zusammen mit einer vollständigen Datei hochladen, keine Kategorie wählen und auf «… erstellen» klicken. Dann steht «Noch offen: Werke Schlussrechnung 2025.pdf.» ohne Grund da. Besser wäre der Grund gleich dabei, etwa «Noch offen: Werke Schlussrechnung 2025.pdf – Kategorie fehlt.», oder ein Link, der zur Zeile springt.
- **P-2:** Dieselben Schritte mit «Sammelscan Januar.pdf» dazu. Der Sammelscan erscheint nie unter «Noch offen», auch nach dem zweiten Erstellen nicht. Besser: Ihn bei «Noch offen» nennen, zum Beispiel «Noch offen: Sammelscan Januar.pdf (mehrere Rechnungen, einzeln erfassen)».
- **P-3:** Die Werke-Datei hochladen, mit Kategorie erstellen und die Rechnung öffnen. Im Kasten «Hinweise zum Beleg» steht «Akontorechnungen», beim Hochladen stand «Akontozahlungen». Besser ist an beiden Stellen dasselbe Wort.
- **P-4:** «Sammelscan Januar.pdf» hochladen und den Hinweis lesen. Besser wäre, zuerst den Weg zu nennen, den jede kann («Erfassen Sie jede Rechnung mit «Rechnung erfassen» …»), und das Aufteilen des PDFs erst danach.

## Nicht geprüft

- Den Sammelscan-Weg bis zum Ende («Rechnung erfassen», speichern, dann «Beleg hinzufügen»): Den Weg habe ich nur angesehen, die zwei Januar-Rechnungen nicht erfasst. Ihre Werte stehen nicht im Scan-Text, den ich lesen könnte, und die Aufgabe verlangte nur, ob ich weiss, wie es weitergeht.
- Ein echtes Aufklappen der Kategorie-Liste: Headless Chromium zeichnet die native Auswahlliste nicht. Ich habe stattdessen die Einträge im Feld gezählt (alle 50 ms, 2 s lang, insgesamt 6 Versuche). Im Barrierefreiheitsbaum von Playwright erscheint die Liste nur mit «Kategorie auswählen», weil die Einträge in Gruppen liegen. Im Feld selbst waren immer 22 Einträge vorhanden.
- Den Dialog auf dem Handy: Dort habe ich nur die erstellte Rechnung angesehen.
- Langsame KI und langsames Netz: Die Stand-in antwortet in etwa 1,5 s.

Screenshots und Skripte: `/tmp/claude-0/-home-user-dwello/42225c72-2497-5110-b437-fe1c26488178/scratchpad/anna-233/` (01-uebersicht, 02-hilfe, 03-upload, 04-lesen, 05-gelesen, 06-angaben-run*-sofort, 07-angaben, 08-kategorie-feld, 09-nach-erstem-erstellen, 10-kategorie-gewaehlt, 11-nach-zweitem-erstellen, 12-werke-rechnung, 13-werke-rechnung-mobil, 14-rechnung-ohne-beleg).
