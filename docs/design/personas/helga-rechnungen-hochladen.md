# Helga – Rechnungen hochladen

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (einzelne Schritte bei 200 %), Maus.
Aufgabe: Drei Rechnungen («Elektro Blitz AG.pdf», «Gartenbau Grün Foto.png», «Hauswart Q1 ohne KI.pdf») für «Musterhaus Zentrum» hochladen, Vorschläge prüfen, Fehlendes ergänzen, erstellen; danach bei einer neuen Rechnung den Beleg ansehen.
Bewertet wird nur der Dialog «Rechnungen hochladen» und der Abschnitt «Beleg» auf der Rechnungsseite. Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-dwello/42225c72-2497-5110-b437-fe1c26488178/scratchpad/helga-rechnungen-hochladen/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Dialog «Rechnungen hochladen», Knopf unten | Der Knopf heisst «3 Rechnungen erstellen», obwohl bei der dritten Zeile alle Pflichtfelder leer sind. Nach dem Klick erstellt Dwello nur 2; die dritte bleibt mit Fehlern stehen. Der Knopf verspricht mehr, als passiert. |
| P-2 | Minor | Dialog, Zeilen | Jede Zeile trägt dasselbe Schild «Bitte prüfen». Ohne die Angaben aufzuklappen, sehe ich nicht, was ich prüfen soll. Der Grund («Die KI ist unsicher. Bitte prüfen Sie den Wert.») steht erst aufgeklappt, mit Abstand unter dem Rechnungsdatum, und nennt das Feld nicht. |
| P-3 | Minor | Dialog, Zeilen | Zeilen mit «Bitte prüfen» lassen sich erstellen, ohne dass ich die Angaben je geöffnet habe. So landen unsichere Werte der KI ungeprüft in der Rechnung, zum Beispiel ein Datum, das die Abrechnungsperiode bestimmt. |
| P-4 | Minor | Dialog → Rechnungsseite / Bearbeiten | Der Dialog fragt nach der «Rechnungsnummer». Nach dem Erstellen steht sie aber weder auf der Rechnungsseite noch auf «Rechnung bearbeiten». Ich kann sie nicht mehr sehen und nicht korrigieren (die Suche findet sie trotzdem). |
| P-5 | Minor | Rechnungsseite, «Beleg anzeigen» | «Beleg anzeigen» zeigt nichts an, es lädt die Datei herunter. Ich hätte erwartet, dass sich die Rechnung öffnet. Wo der Download landet, weiss ich nicht. |
| P-6 | Minor | Rechnungsseite, «Beleg anzeigen» (PNG mit Umlaut) | Bei «Gartenbau Grün Foto.png» kam die Datei im Testbrowser als «download» an, ohne Namen und ohne Endung. Die PDF «Elektro Blitz AG.pdf» kam mit richtigem Namen an. (Im Testbrowser gesehen; in einem normalen Chrome nicht bestätigt.) |
| P-7 | Minor | Dialog bei 200 % Zoom | Bei 200 % steht die Vorschau (etwa 640 × 960 Punkte) in voller Breite über den Feldern. Pro Rechnung muss ich eine ganze Bildschirmhöhe an der Vorschau vorbeiscrollen, und dann sehe ich die Vorschau nicht mehr, während ich die Felder vergleiche. |
| P-8 | Nit | Dialog, Zeile ohne KI | «Bitte prüfen» steht in dieser Zeile zweimal (Schild rechts und Titel des gelben Kastens). |
| P-9 | Nit | Dialog, Feld «Gebäude» | Nach dem Hochladen ist «Gebäude» grau und nicht mehr wählbar, ohne Erklärung. Hätte ich das falsche Gebäude gewählt, wüsste ich nicht, was ich tun soll. |
| P-10 | Nit | Rechnungsseite, Abschnitt «Beleg» | Überschrift «Beleg», darunter nochmals ein Kasten mit dem Titel «Beleg». Danach folgen «Datei des Belegs» mit Dateiauswahl und ein eigener Knopf «Beleg ersetzen»: Mir ist nicht klar, ob schon das Auswählen den Beleg ersetzt. |

## Beobachtungen

- Die Dateiauswahl zeigt «Choose Files / No file chosen» auf Englisch. Das ist vermutlich der Testbrowser, nicht Dwello.
- Im Bildschirmleser-Baum steht «Bitte geben Sie ein Datum ein» zweimal; sichtbar ist es nur einmal (für Sven).
- Was die KI vorschlägt, kommt hier vom Stand-in: Die Gartenbau-Rechnung bekam dieselben Werte wie Elektro Blitz (R-1001, CHF 1250.00, «Allgemeinstrom Q1»), als Rechnungssteller «Gartenbau Grün Foto» (aus dem Dateinamen) und die Kategorie Gartenpflege. Ich habe sie so erstellt, ohne zu korrigieren; sie steht so in «Musterhaus Zentrum».
- Das Testbild «Gartenbau Grün Foto.png» ist ganz weiss, darum war die Vorschau leer. Das ist kein Fehler von Dwello.
- Rechnungsseite: Begriffe wie «Konfidenz der KI 90 %», «Neu kategorisieren», «Verteilschlüssel» und «Automatisch kategorisiert» kenne ich nicht. Die Hilfe zum Leistungszeitraum ist sehr lang.
- Die Suche nach «HW-2026» zeigte zusätzlich zu meiner noch eine Hauswart-Rechnung über CHF 900.00. Die habe ich nicht erstellt (vermutlich eine andere Person im selben Bestand), also habe ich sie nicht angerührt.
- Beim ersten Öffnen einer Zeile war die Auswahl «Kategorie» noch leer und füllte sich erst nach etwa 2 bis 3 Sekunden. Wer schnell ist, sieht kurz eine leere Auswahl.
- Werkzeug, nicht Dwello: Wählt das Testwerkzeug eine Datei mit «ü» im Pfad, kommt sie im Browser gar nicht an (kein Ereignis, keine Zeile). Mit dem richtigen Dateinamen als Inhalt übergeben, funktionierte «Gartenbau Grün Foto.png» einwandfrei.

## Aufgabe geschafft: ja

Alle drei Rechnungen sind in «Musterhaus Zentrum» erstellt, und bei jeder liegt die Originaldatei unter «Beleg». Die Hauswart-Rechnung brauchte einen zweiten Anlauf.

## Aufwand

Etwa 25 Minuten, rund 30 Schritte: Dialog öffnen, Gebäude, Dateien, 3× «Angaben prüfen», erstellen (2 von 3), Hauswart-Datei nochmals hochladen, 8 Felder ausfüllen, erstellen, 3 Rechnungsseiten, 2× «Beleg anzeigen».

## Ablauf

1. **Rechnungsliste.** Erwartet: einen Weg, Rechnungen hochzuladen. Gesehen: oben den dunklen Knopf «Rechnungen hochladen» neben «Rechnung erfassen». Gut zu finden.
2. **Dialog öffnen.** Erwartet: eine Anleitung. Gesehen: «Wählen Sie das Gebäude und die Dateien Ihrer Rechnungen. Die KI liest die Angaben aus; Sie prüfen sie, bevor Dwello die Rechnungen erstellt.», dazu einen blauen Kasten «Beleg – Bewahren Sie die Originalrechnung auf; Mieter dürfen sie einsehen.». Die Dateiauswahl ist grau mit «Wählen Sie zuerst das Gebäude.», der Knopf heisst «0 Rechnungen erstellen» und ist gesperrt. Verständlich; «0 Rechnungen» wirkt etwas seltsam.
3. **Gebäude wählen.** Erwartet: eine Liste meiner Häuser. Gesehen: «Musterhaus Zentrum – Bahnhofstrasse 42, 8001 Zürich», mit Adresse. Sehr gut. Danach wird die Dateiauswahl aktiv, mit dem Hinweis «PDF, JPG oder PNG, je höchstens 10 MB, bis zu 20 Dateien auf einmal. Ausgewählte Dateien liest die KI sofort aus.»
4. **Drei Dateien wählen.** Erwartet: drei Zeilen. Gesehen: nach weniger als einer Sekunde drei Zeilen mit Dateiname, Schild «Bitte prüfen», Häkchen «Diese Rechnung erstellen», «Angaben prüfen» und «Datei entfernen». Bei «Hauswart Q1 ohne KI.pdf» steht ein gelber Kasten «Bitte prüfen – Die KI ist nicht verfügbar. Bitte füllen Sie die Felder aus.». Der Knopf heisst jetzt «3 Rechnungen erstellen». Das Gebäude ist grau (P-9).
5. **«Angaben prüfen» bei Elektro Blitz.** Erwartet: was die KI gelesen hat. Gesehen: links die Vorschau der PDF, rechts die Felder Rechnungsnummer R-1001, Rechnungsdatum 31.03.2026 mit «Dienstag, 31. März 2026» darunter (sehr hilfreich), «Die KI ist unsicher. Bitte prüfen Sie den Wert.», Leistungszeitraum 01.01.2026 bis 31.03.2026, Betrag CHF 1250.00, Rechnungssteller Elektro Blitz AG, Beschreibung «Allgemeinstrom Q1», Kategorie Allgemeinstrom, Verteilschlüssel leer, Umlagefähig angehakt. Welcher Wert unsicher ist, musste ich erraten (P-2).
6. **«Angaben prüfen» bei Gartenbau.** Gesehen: dieselben Werte wie bei Elektro, Rechnungssteller «Gartenbau Grün Foto», Kategorie Gartenpflege, die Vorschau weiss (das Bild selbst ist weiss).
7. **«Angaben prüfen» bei Hauswart.** Erwartet: leere Felder. Gesehen: alle Felder leer, die Vorschau zeigt «Rechnung».
8. **Auf «3 Rechnungen erstellen» geklickt**, bevor ich die Hauswart-Zeile ausgefüllt hatte (ich dachte, Dwello sagt mir schon, was fehlt). Erwartet: entweder alle drei oder ein Hinweis vorher. Gesehen: oben im Dialog «2 Rechnungen erstellt» mit Links «Elektro Blitz AG» und «Gartenbau Grün Foto». Die Hauswart-Zeile bleibt stehen: im gelben Kasten «Wählen Sie eine Kategorie.» und «Füllen Sie die markierten Felder aus.», die Felder rot umrandet mit eigenen Meldungen («Bitte geben Sie ein Datum ein», «Bitte geben Sie einen gültigen Betrag ein» usw.). Der Knopf heisst jetzt «1 Rechnung erstellen». Gut gelöst, aber erschreckt hat es mich trotzdem (P-1).
9. **Hauswart nachholen.** Weil mein Skript neu startete, habe ich die Datei nochmals hochgeladen und ausgefüllt: HW-2026-01, 31.03.2026, 01.01.2026 bis 31.03.2026, 920.00, Hauswartung Meier GmbH, «Hauswartung Q1 2026», Kategorie Hauswart. Dann «1 Rechnung erstellen». Gesehen: Der Dialog schliesst; auf der Liste steht grün «1 Rechnung erstellt – Hauswartung Meier GmbH» als Link. Sehr klar.
10. **Rechnungsseite Elektro Blitz.** Erwartet: alle Angaben und die Datei. Gesehen: die Angaben (ohne Rechnungsnummer, P-4) und unten den Abschnitt «Beleg» mit dem Dateinamen «Elektro Blitz AG.pdf» und «Beleg anzeigen». Darunter nochmals «Beleg – Bewahren Sie …», «Datei des Belegs» und «Beleg ersetzen» (P-10).
11. **«Beleg anzeigen».** Erwartet: die Rechnung öffnet sich. Gesehen: Die Seite bleibt gleich, die Datei wird heruntergeladen (P-5). Bei der PNG kam sie als «download» ohne Endung an (P-6).
12. **Rechnungsseite Hauswart.** Gesehen: «Manuell kategorisiert», Beleg «Hauswart Q1 ohne KI.pdf». Die Datei liegt also auch dort, wo die KI nichts gelesen hatte.
13. **Abbrechen (eigener Versuch, nichts gespeichert).** Gesehen: Rückfrage «Hochladen abbrechen? – Hochgeladene Dateien und Ihre Eingaben gehen verloren.» mit «Weiter prüfen» und «Abbrechen und verwerfen». Das gibt Sicherheit. Esc schliesst nur die Rückfrage.
14. **200 % Zoom.** Kein seitliches Scrollen. Aber die Vorschau steht riesig über den Feldern (P-7).

## Verwirrung

- «Beleg»: Ist das die Rechnung selbst oder eine Quittung? Erst auf der Rechnungsseite habe ich verstanden, dass damit meine hochgeladene Datei gemeint ist.
- «Mieter dürfen sie einsehen»: Muss ich die Rechnung den Mietern schicken? Oder nur zeigen, wenn sie fragen? Der Satz erschreckt mehr, als er hilft.
- «Die KI ist unsicher»: unsicher bei was? Beim Datum, oder bei allem?
- «Diese Rechnung erstellen» als Häkchen in jeder Zeile: Warum sollte ich eine hochgeladene Rechnung nicht erstellen wollen? Erst später verstanden: zum Auslassen.
- «Verteilschlüssel (optional)», «Umlagefähig», «Leistungszeitraum»: Die Hilfetexte helfen; der zum Leistungszeitraum ist aber so lang, dass ich ihn nicht zu Ende gelesen habe.
- «Angaben prüfen» und «Angaben ausblenden» sind gut verständlich.

## Fehlerrisiken

- Unsichere Werte der KI (z. B. das Rechnungsdatum) werden ungeprüft gespeichert, weil man nichts aufklappen muss (P-3). Ein falsches Datum schiebt die Rechnung in die falsche Abrechnungsperiode.
- Wer schnell auf «3 Rechnungen erstellen» klickt und den Dialog dann schliesst, verliert die dritte Rechnung, wenn er die Meldung «2 Rechnungen erstellt» übersieht (P-1).
- Eine falsch gelesene Rechnungsnummer lässt sich später nicht korrigieren (P-4).
- Wer den Beleg herunterlädt, findet die Datei vielleicht nicht oder kann «download» ohne Endung nicht öffnen (P-5, P-6).

## Vorschläge

- **P-1:** Schritte: Gebäude wählen, die drei Dateien wählen, die Hauswart-Zeile leer lassen, «3 Rechnungen erstellen». Hilfreich: Den Knopf nur Zeilen zählen lassen, die vollständig sind, oder vor dem Erstellen sagen: «1 Rechnung ist noch unvollständig. 2 Rechnungen jetzt erstellen?»
- **P-2:** Schritte: die Elektro-Datei hochladen und die Zeile ansehen. Hilfreich: Im Schild oder in der Zeile das Feld nennen («Rechnungsdatum bitte prüfen»), und den Hinweis direkt beim Feld mit dem Feldnamen («Rechnungsdatum: Die KI ist unsicher»).
- **P-3:** Schritte: Elektro-Datei hochladen, nichts aufklappen, erstellen. Hilfreich: Zeilen mit unsicheren Werten erst nach dem Aufklappen erstellen lassen oder die Werte im Schild direkt zeigen.
- **P-4:** Schritte: im Dialog eine Rechnungsnummer eingeben, erstellen, die Rechnung öffnen, dann «Rechnung bearbeiten». Hilfreich: die Rechnungsnummer auf der Rechnungsseite zeigen und im Bearbeiten-Formular änderbar machen.
- **P-5:** Schritte: eine neue Rechnung öffnen, «Beleg anzeigen». Hilfreich: die Datei im Browser öffnen (in einem neuen Tab), oder den Knopf «Beleg herunterladen» nennen.
- **P-6:** Schritte: die Gartenbau-Rechnung öffnen, «Beleg anzeigen»; der Testbrowser speicherte «download». Hilfreich: Mit einem echten Chrome und Dateinamen mit Umlaut prüfen; den Ersatznamen im Download-Kopf so wählen, dass Endung und Name erhalten bleiben.
- **P-7:** Schritte: Zoom 200 %, hochladen, «Angaben prüfen». Hilfreich: die Vorschau kleiner oder aufklappbar («Vorschau zeigen»), oder neben die Felder statt darüber.
- **P-8:** Hilfreich: Im gelben Kasten den Titel weglassen oder «KI nicht verfügbar» schreiben.
- **P-9:** Hilfreich: ein Satz unter dem Feld: «Für ein anderes Gebäude brechen Sie ab und beginnen neu.»
- **P-10:** Hilfreich: den Hinweiskasten nicht nochmals «Beleg» nennen; Dateiauswahl und «Beleg ersetzen» als einen Schritt erklären («Neue Datei wählen, dann Beleg ersetzen»).

## Nicht geprüft

- Hineinziehen der Dateien in das Feld: Mit der Maus ist im Testwerkzeug kein echtes Ziehen aus dem Dateisystem möglich.
- «Beleg ersetzen» und «Datei entfernen»: Ich wollte meine Belege nicht verändern. Das Häkchen «Diese Rechnung erstellen» habe ich nicht abgewählt.
- Die anderen Dateien im Ordner (Sammelscan, Werke Schlussrechnung, Lift Reparatur, Notizen.docx) gehörten nicht zur Aufgabe.
- Ob «Choose Files» und der Download-Name «download» in einem normalen deutschsprachigen Chrome anders aussehen: Ich hatte nur den Testbrowser.
- Ob die Werte der KI in Wirklichkeit stimmen: Antwortet nur der Stand-in.
