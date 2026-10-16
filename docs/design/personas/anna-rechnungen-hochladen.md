# Anna – Rechnungen hochladen

Persona: Anna, 29, Erstvermieterin, kommt nach Monaten zurück und weiss nicht mehr, wie Dwello funktioniert. Desktop 1440 × 900, Maus; ein Blick auf Mobile 390 × 844.
Aufgabe: Rechnungsdateien aus `/tmp/persona-files` (7 Dateien) für «Alpenblick» auf einmal hochladen, die Rechnungen erstellen, die Dwello zulässt, danach «Elektro Blitz AG.pdf» nochmals hochladen und abbrechen.
App: Persona-Stack http://localhost:3300 (Version 0.4.12+9-g3e3f99c), KI ist der Stand-in. Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/42225c72-2497-5110-b437-fe1c26488178/scratchpad/anna-rechnungen-hochladen/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Dialog «Rechnungen hochladen», Dateien | «Gartenbau Grün Foto.png» verschwindet ohne jede Meldung: Von 7 gewählten Dateien erscheinen 6 Zeilen. Dieselbe PNG als «Gartenbau Gruen Foto.png» funktioniert; der Umlaut im Dateinamen ist der Auslöser. |
| P-2 | Major | Dialog, Zeile «Lift Service und Reparatur.pdf» | Hinweis «Erfassen Sie diese [nicht umlagefähigen Kosten] als eigene Rechnung», aber der Dialog lässt mich die ganze Rechnung (CHF 1’250.00) als umlagefähig erstellen und sagt nicht, wie ich aufteile. Ergebnis: Reparaturkosten landen in der Nebenkostenabrechnung. |
| P-3 | Minor | Dialog nach «Rechnungen erstellen» | Die Bestätigung «3 Rechnungen erstellt» steht oben im Dialog, ausserhalb des Sichtbereichs. Sichtbar bleibt unten «Wählen Sie mindestens eine Rechnung zum Erstellen.» und «0 Rechnungen erstellen» (deaktiviert); das wirkt wie ein Fehler. |
| P-4 | Minor | Dialog, Zeile «Sammelscan Januar.pdf» | «Diese Datei enthält mehrere Rechnungen. Laden Sie jede einzeln hoch.» Ich habe aber nur diesen einen Scan; wie ich weiterkomme (z.B. über «Rechnung erfassen» von Hand), steht nirgends. «Angaben prüfen» zeigt trotzdem ausgefüllte Felder einer Rechnung, die ich nicht erstellen kann. |
| P-5 | Minor | Dialog, Zeile «Werke Schlussrechnung 2025.pdf» | «Erfassen Sie den Betrag so, dass jede Leistung nur einmal zählt.» verstehe ich nicht: Welchen Betrag soll ich eintragen, den vor oder nach dem Abzug der CHF 1’000.00? |
| P-6 | Minor | Dialog, Zeile «Elektro Blitz AG.pdf» | Das Etikett «Bitte prüfen» steht ohne Grund an der zugeklappten Zeile; den Grund («Die KI ist unsicher. Bitte prüfen Sie den Wert.» beim Rechnungsdatum) finde ich erst nach «Angaben prüfen». |
| P-7 | Minor | Übersicht, Hilfe | Weder die Übersicht («Häufige Arbeiten» hat nur «Rechnung erfassen») noch die Hilfe («Rechnungen erfassen») erwähnen das Hochladen. Ich finde «Rechnungen hochladen» nur, weil ich auf «Rechnungen» klicke. |
| P-8 | Minor | Rechnungsliste nach dem Erstellen | Die erstellten Rechnungen sehen aus wie alle anderen. Die Hinweise aus dem Dialog (Reparaturkosten drin, Akonto abgezogen) sind weg; nichts erinnert mich daran, sie später zu korrigieren. |
| P-9 | Nit | Dialog, Zeile «Hauswart Q1 ohne KI.pdf» | Nach dem Erstellen ohne Angaben steht «Bitte geben Sie ein Datum ein» zweimal unter dem Rechnungsdatum. |
| P-10 | Nit | Dialog, Zeile nach «Angaben prüfen» | Wenn ich gleich nach dem Auslesen «Angaben prüfen» öffne, hat «Kategorie» kurz nur «Kategorie auswählen» (beim Elektro-Blitz-Vorschlag ist dann nichts gewählt); nach etwa 1 bis 2 Sekunden sind alle Kategorien da. |
| P-11 | Nit | Dialog, Dateifeld | Im gestrichelten Bereich steht das Dateifeld des Browsers mit «Choose Files / No file chosen» (Englisch) unter der deutschen Überschrift «Dateien hierher ziehen oder auswählen». Möglicherweise kommt das von der Sprache des Test-Browsers. |

## Beobachtungen

- Die Antworten der KI sind die des Stand-ins: Alle PDFs bekommen die Beschreibung «Allgemeinstrom Q1», den Betrag CHF 1’250.00, die Rechnungsnummer R-1001 und den Dateinamen als Rechnungssteller. Darum zeigt die Liste jetzt «Werke Schlussrechnung 2025 / Allgemeinstrom Q1 / Kaltwasser». Das bewerte ich nicht.
- Die Rechnungsnummer (R-1001), die ich im Dialog gesehen habe, zeigt die Detailseite der erstellten Rechnung nicht an.
- Die Detailseite zeigt den hochgeladenen Beleg mit Dateinamen und «Beleg anzeigen» an, das ist gut. Unter «Beleg» stehen die Überschrift «Beleg» und darunter nochmals der Hinweiskasten «Beleg».
- Auf der Übersicht steht «Erfassen Sie zuerst alle Rechnungen dieser Periode», mit dem Link «Rechnungen 2025 ansehen»; dieser Weg führt immerhin zur Seite mit «Rechnungen hochladen».

## Aufgabe geschafft

Teilweise. Vier Rechnungen für «Alpenblick» sind erstellt (Elektro Blitz AG, Hauswartung Interlaken, Lift Service und Reparatur, Werke Schlussrechnung 2025). Den Sammelscan konnte ich nicht erstellen (so gewollt), Notizen.docx wurde abgelehnt (so gewollt). Die Gartenbau-Rechnung (PNG) ist ohne Meldung verschwunden; ich hätte das nicht bemerkt, hätte ich die Dateien nicht gezählt (P-1). Der Duplikat-Test und das Abbrechen haben geklappt.

## Aufwand

Etwa 8 Minuten Nutzerzeit, rund 25 Schritte: Navigation 2, Dialog öffnen und Gebäude wählen 2, Dateien wählen 1, Zeilen öffnen 3, Hauswart-Zeile ausfüllen 5, Kategorien wählen 2, erstellen 2 (erster Versuch mit leerer Hauswart-Zeile: nur 1 von 4 erstellt), nach oben scrollen und Bestätigung suchen 1, zweite Runde mit Elektro Blitz 3, abbrechen 2, Liste filtern 3. Das Auslesen dauerte unter 1 Sekunde pro Datei.

## Ablauf

1. **Übersicht.** Erwartet: ein Hinweis, wo ich Rechnungen hochlade. Gesehen: «Rechnung erfassen» unter «Häufige Arbeiten» (öffnet das Formular für eine einzelne Rechnung, ohne Hinweis aufs Hochladen) und «Rechnungen 2025 ansehen». Ich gehe über die Navigation auf «Rechnungen».
2. **Rechnungsliste.** Erwartet: ein Knopf zum Hochladen. Gesehen: oben rechts den dunklen Hauptknopf «Rechnungen hochladen» und daneben «Rechnung erfassen» (Screenshot `02b-invoices-top.png`). Gut zu finden, sobald ich auf der Seite bin.
3. **Dialog öffnen.** Erwartet: Dateien auswählen. Gesehen: Erklärung «Die KI liest die Angaben aus; Sie prüfen sie, bevor Dwello die Rechnungen erstellt», den Hinweiskasten «Beleg», das Feld «Gebäude» und einen deaktivierten Dateibereich mit «Wählen Sie zuerst das Gebäude.» Verständlich (`03-dialog.png`).
4. **«Alpenblick» wählen.** Der Dateibereich wird aktiv, mit «PDF, JPG oder PNG, je höchstens 10 MB, bis zu 20 Dateien auf einmal. Ausgewählte Dateien liest die KI sofort aus.»
5. **Alle 7 Dateien wählen.** Erwartet: 7 Zeilen. Gesehen: 6 Zeilen; «Gartenbau Grün Foto.png» fehlt ohne Meldung (P-1). Das Gebäude ist danach gesperrt. Der Knopf heisst jetzt «4 Rechnungen erstellen». Die Zeilen:
   - Elektro Blitz AG.pdf: «Bitte prüfen», angehakt, ohne sichtbaren Grund (P-6).
   - Hauswart Q1 ohne KI.pdf: «Die KI ist nicht verfügbar. Bitte füllen Sie die Felder aus.», angehakt.
   - Lift Service und Reparatur.pdf: Hinweis auf nicht umlagefähige Kosten, angehakt.
   - Notizen.docx: rot «Nicht möglich. Dwello nimmt nur PDF-, JPG- und PNG-Dateien an. Speichern Sie die Datei als PDF und wählen Sie sie erneut.» Klar und hilfreich.
   - Sammelscan Januar.pdf: «Diese Datei enthält mehrere Rechnungen. Laden Sie jede einzeln hoch.», Haken deaktiviert (P-4).
   - Werke Schlussrechnung 2025.pdf: Hinweis zum Abzug von CHF 1’000.00, angehakt (P-5).
6. **«Angaben prüfen».** Zeigt links eine Vorschau der Datei und rechts das Formular wie bei «Rechnung erfassen», mit denselben Hilfetexten. Bei Elektro Blitz steht «Allgemeinstrom» als Kategorie (nach kurzer Ladezeit, P-10). Bei Lift und Werke ist keine Kategorie gewählt.
7. **Erster Versuch: gleich «4 Rechnungen erstellen».** Erwartet: entweder alle vier oder eine Meldung, was fehlt. Gesehen: Elektro Blitz wurde erstellt («1 Rechnung erstellt» mit Link, oben im Dialog). Die anderen drei Zeilen bleiben offen und zeigen ihre Fehler: «Wählen Sie eine Kategorie.» und bei Hauswart «Füllen Sie die markierten Felder aus.» mit Feldfehlern (Datum-Fehler doppelt, P-9). Das teilweise Erstellen finde ich gut, nur sah ich die Bestätigung erst nach dem Hochscrollen.
8. **Dialog neu öffnen, wieder alle Dateien** (mein erster Dialog war zu). Erwartet: Elektro Blitz wird als bereits erfasst erkannt. Gesehen: «Diese Rechnung ist schon erfasst.» mit dem Link «Erfasste Rechnung ansehen», Haken nicht gesetzt. Sehr gut.
9. **Ausfüllen.** Hauswart: 31.03.2026, 900.00, «Hauswartung Interlaken», «Hauswartung Q1 2026», Kategorie Hauswart. Lift: Kategorie Lift (Betrag gelassen, ich wüsste nicht, wie aufteilen, P-2). Werke: Kategorie Kaltwasser, Betrag gelassen (P-5). Knopf: «3 Rechnungen erstellen».
10. **Erstellen.** Erwartet: eine klare Erfolgsmeldung. Gesehen (`13-after-create.png`): Der sichtbare Teil zeigt nur noch Elektro Blitz (Duplikat), Notizen.docx und den Sammelscan, darunter «Wählen Sie mindestens eine Rechnung zum Erstellen.» und den deaktivierten Knopf «0 Rechnungen erstellen». Erst oben steht «3 Rechnungen erstellt» mit drei Links (P-3).
11. **Elektro Blitz nochmals hochladen** (neuer Dialog, Alpenblick). Gesehen (`14-elektro-again.png`): «Diese Rechnung ist schon erfasst.», Link zur erfassten Rechnung, Haken leer, Knopf «0 Rechnungen erstellen» deaktiviert. Klar.
12. **«Abbrechen».** Erwartet: eine Rückfrage, weil Dateien drin sind. Gesehen (`15-after-cancel.png`): «Hochladen abbrechen? Hochgeladene Dateien und Ihre Eingaben gehen verloren.» mit «Weiter prüfen» und dem roten «Abbrechen und verwerfen». Nach dem Verwerfen ist der Dialog zu, und der Fokus steht wieder auf «Rechnungen hochladen». Gut.
13. **Rechnungsliste, Filter Alpenblick und 2026** (`16-list-alpenblick-2026.png`). Vier neue Rechnungen: Werke Schlussrechnung 2025 (Kaltwasser, CHF 1’250.00, Manuell), Lift Service und Reparatur (Lift, CHF 1’250.00, Manuell), Hauswartung Interlaken (Hauswart, CHF 900.00, Manuell), Elektro Blitz AG (Allgemeinstrom, CHF 1’250.00, Automatisch). Alle umlagefähig, jede mit Beleg auf der Detailseite. Kein Hinweis auf die offenen Punkte (P-8).
14. **Mobile (nur angesehen, nichts gespeichert).** Der Dialog passt auf 390 px, ohne seitliches Scrollen. Zeilen, Hinweise und Knöpfe liegen untereinander (`19-mobile-dialog.png`).

## Verwirrung

- «Bitte prüfen»: Was soll ich prüfen? Bei Elektro Blitz steht es ohne Grund an der Zeile.
- «Laden Sie jede einzeln hoch»: Ich habe nur eine Datei mit beiden Rechnungen. Soll ich sie selbst zerschneiden?
- «Erfassen Sie diese als eigene Rechnung»: Muss ich dafür den Betrag hier kürzen und dann über «Rechnung erfassen» eine zweite Rechnung anlegen? Mit welcher Datei?
- «Erfassen Sie den Betrag so, dass jede Leistung nur einmal zählt»: Den Begriff Akonto kenne ich nicht; ich weiss nicht, welcher Betrag gemeint ist.
- «Umlagefähig» ist an jeder Zeile angehakt. Was das genau bedeutet, verstehe ich erst durch «Die Rechnung fliesst in die Nebenkostenabrechnung ein.»
- «Manuell» und «Automatisch» in der Liste: Ich habe alle Rechnungen hochgeladen, trotzdem steht bei dreien «Manuell».

## Fehlerrisiken

- Eine Rechnung mit Umlaut im Dateinamen («Grün», «Zürich», «Gebühr») fehlt ohne Meldung. Ich glaube, alles sei erfasst, und die Kosten fehlen in der Nebenkostenabrechnung (P-1).
- Reparaturkosten werden als umlagefähig erstellt und den Mietern verrechnet (P-2).
- Bei der Schlussrechnung trage ich den falschen Betrag ein, und Kosten zählen doppelt oder fehlen (P-5).
- Nach dem Erstellen halte ich den Hinweis unten für einen Fehler und lade die Dateien nochmals hoch. Die Duplikat-Erkennung fängt das ab (P-3).
- Wer «Angaben prüfen» nicht öffnet, übernimmt den unsicheren Wert der KI ungeprüft (P-6).

## Vorschläge

- **P-1:** Rechnungen › «Rechnungen hochladen» › Gebäude «Alpenblick» › alle 7 Dateien aus `/tmp/persona-files` wählen: 6 Zeilen, «Gartenbau Grün Foto.png» fehlt, und es wird keine Anfrage zum Auslesen gesendet. Dieselbe Datei kopiert als «Gartenbau Gruen Foto.png»: Die Zeile erscheint. Dateinamen mit Umlauten annehmen; jede gewählte Datei, die Dwello nicht annimmt, als Zeile «Nicht möglich» mit Grund zeigen, nie stillschweigend weglassen.
- **P-2:** «Lift Service und Reparatur.pdf» hochladen, Kategorie «Lift», erstellen: Die Rechnung wird mit CHF 1’250.00 umlagefähig erstellt. Im Hinweis sagen, wie ich vorgehe (zum Beispiel: «Tragen Sie hier nur den umlagefähigen Betrag ein und erfassen Sie den Rest über ‹Rechnung erfassen› als nicht umlagefähig»). Oder nach dem Erstellen nachfragen bzw. die Rechnung in der Liste markieren.
- **P-3:** Zeilen ausfüllen, «3 Rechnungen erstellen» klicken: Die Bestätigung steht oben ausserhalb der Sicht. Nach dem Erstellen zur Bestätigung scrollen oder sie neben den Knöpfen zeigen. «Wählen Sie mindestens eine Rechnung zum Erstellen.» nach einem Erfolg nicht als einzige sichtbare Zeile stehen lassen.
- **P-4:** «Sammelscan Januar.pdf» hochladen: Der Hinweis sagt, ich soll jede Rechnung einzeln hochladen. Einen gangbaren Weg nennen (Scan auftrennen oder jede Rechnung über «Rechnung erfassen» anlegen und die Datei als Beleg anhängen). «Angaben prüfen» bei einer Zeile, die sich nicht erstellen lässt, weglassen oder erklären.
- **P-5:** «Werke Schlussrechnung 2025.pdf» hochladen: Den Hinweis konkret machen, z.B. «Tragen Sie den Betrag vor Abzug der Akontozahlungen ein (Gesamtkosten), wenn die Akontorechnungen nicht erfasst sind» oder umgekehrt. Am besten den betroffenen Betrag nennen.
- **P-6:** Elektro Blitz hochladen: An der zugeklappten Zeile kurz sagen, was zu prüfen ist (z.B. «Rechnungsdatum unsicher»).
- **P-7:** Auf der Übersicht unter «Häufige Arbeiten» und in der Hilfe unter «Rechnungen erfassen» das Hochladen nennen («Mehrere Rechnungen auf einmal: Rechnungen › Rechnungen hochladen»).
- **P-8:** Nach dem Erstellen in der Rechnungsliste die Rechnungen mit offenem Hinweis kennzeichnen, oder den Hinweis auf der Detailseite der Rechnung weiter zeigen.
- **P-9:** Hauswart-Zeile leer lassen und erstellen: «Bitte geben Sie ein Datum ein» erscheint zweimal; nur einmal zeigen.
- **P-10:** Dateien wählen und sofort «Angaben prüfen» öffnen: Die Kategorie-Auswahl ist kurz leer. Kategorien vor dem Öffnen laden oder einen Ladehinweis zeigen.
- **P-11:** Dialog öffnen: Das Dateifeld des Browsers zeigt englischen Text. Einen eigenen deutschen Knopf («Dateien auswählen») über das versteckte Dateifeld legen.

## Nicht geprüft

- Echtes Ziehen und Ablegen mit der Maus (Drag and Drop): Das Werkzeug setzt die Dateien direkt in das Dateifeld bzw. über den Dateiauswahl-Dialog des Knopfs; beide Wege habe ich benutzt.
- Ob die Gartenbau-Rechnung (mit «Grün» im Namen) nach dem Umbenennen die richtige Kategorie bekommt: Ich habe die umbenannte Datei nur angesehen und nicht für Alpenblick erstellt.
- Mehr als 20 Dateien und Dateien über 10 MB: keine solchen Dateien im Ordner.
- Das Erstellen eines Duplikats trotz Hinweis (Haken selbst setzen): Die Aufgabe sagte abbrechen.
- Die Abrechnung 2026 mit den neuen Rechnungen: nicht Teil der Aufgabe.
