# Helga – Rechnungen hochladen (Runde 233)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (Vorschau auch bei 200 %), Maus.
Gebäude zum Speichern: «Musterhaus Zentrum». Dateien aus `/tmp/persona-files`: «Elektro Blitz AG.pdf», «Gartenbau Gruen Foto.png», «Hauswart Q1 ohne KI.pdf».
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-dwello/42225c72-2497-5110-b437-fe1c26488178/scratchpad/helga-233/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Rechnungen hochladen, Datei «Hauswart Q1 ohne KI.pdf» | Die Hinweise nennen nur «Wählen Sie eine Kategorie.» und allgemein «Bitte füllen Sie die Felder aus.». Dass Rechnungsdatum, Betrag, Rechnungssteller und Beschreibung fehlen, steht nirgends. Nachdem ich die Kategorie gewählt habe, bleibt nur noch der allgemeine Satz stehen, und der Knopf heisst weiter «0 Rechnungen erstellen (1 unvollständig)». Welche Felder fehlen, sehe ich erst, wenn ich auf «erstellen» klicke. |
| P-2 | Minor | Rechnungen hochladen, Vorschau bei 200 % | Bei 200 % steht die Vorschau über den Feldern und ist so breit wie das ganze Fenster. Um die Datei mit dem Betrag oder dem Datum zu vergleichen, muss ich hin und her scrollen. «Datei gross anzeigen» öffnet einen neuen Tab, und dann muss ich zwischen den Tabs wechseln. Bei 150 % stehen Vorschau und Felder nebeneinander, das geht gut. |
| P-3 | Nit | Rechnungen hochladen, Hinweise «ohne KI» | «Die KI ist nicht verfügbar.» klingt, als ob die KI ganz kaputt wäre. Bei den anderen zwei Dateien hat sie aber gelesen. Der Satz bleibt auch stehen, wenn ich alle Felder ausgefüllt habe. |
| P-4 | Nit | Rechnungen hochladen, Feld «Fälligkeitsdatum (optional)» | Unter einem freiwilligen Feld steht fett und in Warnfarbe mit Warndreieck «Die KI hat diesen Wert nicht gefunden …». Das sieht aus wie ein Fehler, obwohl ich hier nichts tun muss. |
| P-5 | Nit | Rechnung bearbeiten | Beim Hochladen ist «Kategorie» Pflicht. Beim Bearbeiten heisst dasselbe Feld «Kategorie (optional)». Ich weiss nicht, was jetzt gilt. |
| P-6 | Nit | Neue Rechnung, Kategorie «Reparaturen» | Das Kästchen «Umlagefähig» ist leer und blass. Ich habe versucht, es anzuklicken. Der Satz darunter und der gelbe Kasten erklären es aber gut. Auch «Verteilschlüssel (optional)» wird weiter angeboten, obwohl die Kosten gar nicht verteilt werden. |

## Beobachtungen

- Mein allererster Klick auf «Rechnungen hochladen», direkt nachdem die Seite geladen war, hat nichts bewirkt. Erst ein späterer Klick hat das Fenster geöffnet. Vermutlich war die Seite noch nicht fertig geladen.
- Bei «Gartenbau Gruen Foto.png» hat die KI (hier ein Stellvertreter mit festen Antworten) keine Kategorie gewählt. Als Rechnungssteller trug sie «Gartenbau Gruen Foto» ein, als Beschreibung «Allgemeinstrom Q1», und dazu die gleiche Nummer R-1001 und den gleichen Betrag wie bei Elektro Blitz. Das betrifft die Antworten des Stellvertreters, nicht Dwello.
- Die Testdateien sind fast leer: Das PDF zeigt nur das Wort «Rechnung», das PNG ist ein weisses Bild. Einen echten Vergleich von Datei und Feldern konnte ich deshalb nicht machen.
- Auf der Rechnung steht «Konfidenz der KI 90 %» mit Balken. Das Wort «Konfidenz» kenne ich nicht. «Automatisch kategorisiert» verstehe ich.
- Das Dateifeld unter «Beleg» zeigt «Choose File / No file chosen» auf Englisch. Das kommt vom Testbrowser; ein deutscher Browser würde es vermutlich auf Deutsch zeigen.
- Bei der Suche nach «Elektro Blitz» kamen zwei Treffer. Den zweiten hat wohl jemand anders angelegt, ich habe ihn nicht angefasst.

## Aufgabe geschafft: ja

## Aufwand

Etwa 25 Minuten. Rund 40 Schritte, mit fünf (genauer elf) Mal «Angaben prüfen» direkt nach dem Lesen. Gespeichert habe ich drei Rechnungen in «Musterhaus Zentrum»: «Elektro Blitz AG, 31.03.2026», «Gartenbau Grün, 31.03.2026» und «Hauswartung Meier GmbH, 31.03.2026». Bei Elektro Blitz habe ich danach die Rechnungsnummer von R-1001 auf EB-2026-0331 geändert.

## Ablauf

1. **Rechnungen → «Rechnungen hochladen».** Erwartet: ein Fenster zum Hochladen. Gesehen: das Fenster «Rechnungen hochladen» mit zwei kurzen Erklärungen, der Auswahl «Gebäude», dem Feld «Dateien hierher ziehen oder auswählen» (gesperrt mit «Wählen Sie zuerst das Gebäude.») und dem gesperrten Knopf «0 Rechnungen erstellen». Klar verständlich (Bild `02-upload-open.png`).
2. **Gebäude «Musterhaus Zentrum» gewählt, drei Dateien ausgewählt.** Erwartet: Dwello liest die Dateien. Gesehen: «1 von 3 Dateien gelesen», bei den anderen «Wird gelesen …», nach etwa einer Sekunde «3 von 3 Dateien gelesen. Bitte prüfen: 3.». Das Gebäude ist danach gesperrt, mit der Erklärung, dass man dafür die Dateien entfernen muss. Gut.
3. **Hinweise und Erstellen-Knopf gelesen (Aufgabe 1).** Bilder `04-row1.png` und `04-footer.png`.
   - Elektro Blitz: «Prüfen Sie: Rechnungsdatum.» und «Ergänzen Sie, wenn auf der Rechnung angegeben: Fälligkeitsdatum.» Das verstehe ich: das Datum anschauen, das Fälligkeitsdatum nur, wenn es draufsteht. Unter dem Feld steht «Die KI ist unsicher. Bitte prüfen Sie den Wert.» Klar.
   - Gartenbau: zusätzlich «Wählen Sie eine Kategorie.» Klar.
   - Hauswart ohne KI: «Die KI ist nicht verfügbar. Bitte füllen Sie die Felder aus.» und «Wählen Sie eine Kategorie.» Ich dachte zuerst, es fehle nur die Kategorie. In Wahrheit waren alle Felder leer. Welche davon Pflicht sind, steht hier nicht (P-1).
   - Knopf: «1 Rechnung erstellen (2 unvollständig)». Das verstehe ich so, dass eine Rechnung fertig ist und zwei nicht. Ob die zwei beim Klick verloren gehen, war mir nicht sicher; es stellte sich heraus, dass sie bleiben (Schritt 6).
   - Freiwillig ist klar markiert: «(optional)» bei Rechnungsnummer, Leistungszeitraum, Fälligkeitsdatum und Verteilschlüssel.
4. **«Angaben prüfen» direkt nach dem Lesen, mehrmals hintereinander (Aufgabe 2).** Erwartet: Die Liste «Kategorie» ist sofort voll, und die Wahl der KI ist sofort gesetzt. Gesehen, jedes Mal neu geladen und neu hochgeladen:
   - Fünf Durchgänge mit Elektro Blitz, sobald dort «Angaben prüfen» erschien (teils war erst «2 von 3» gelesen): jedes Mal sofort 21 Kategorien in zwei Gruppen («Umlagefähige Kosten», «Nicht umlagefähige Kosten»), und «Allgemeinstrom» war schon gewählt. Während 2 Sekunden habe ich alle 100 ms nachgeschaut: kein leerer Moment, kein Springen.
   - Fünf weitere Durchgänge, bei denen ich die erste fertige Zeile geöffnet habe: Die Liste war immer voll. Bei Gartenbau stand «Kategorie auswählen», weil die KI dort keine Wahl getroffen hat. Das passt zum Hinweis «Wählen Sie eine Kategorie.».
   - Ein Durchgang mit nur einer Datei, 11 Sekunden lang beobachtet: immer voll, immer «Allgemeinstrom».
   - Ergebnis: Die Liste war nie leer, und die Wahl der KI fehlte nie, auch nicht kurz (Bild `07-trial*.png`, `08-immediate-trial*.png`).
5. **Bei 200 % «Datei gross anzeigen» (Aufgabe 3).** Erwartet: die Datei gross neben den Feldern. Gesehen: Die Vorschau steht über den Feldern und füllt die ganze Breite (Bild `09-z200-row0-preview.png`; darin steht nur «Rechnung»). Die Felder kommen erst darunter. «Datei gross anzeigen (öffnet in neuem Tab)» öffnet die Datei in einem neuen Tab; beim PNG war das ein weisses Bild auf schwarzem Grund (Bild `10-z200-row1-gross.png`). Um zu vergleichen, muss ich zwischen den Tabs wechseln (P-2). Der Hinweis «öffnet in neuem Tab» ist gut, so erschrecke ich nicht.
6. **«1 Rechnung erstellen (2 unvollständig)» geklickt (Aufgabe 4).** Erwartet: Elektro Blitz wird gespeichert, der Rest bleibt. Gesehen: ein grüner Kasten «1 Rechnung erstellt» mit dem Link «Elektro Blitz AG, 31.03.2026» und «Noch offen: Gartenbau Gruen Foto.png, Hauswart Q1 ohne KI.pdf.» (Bild `12-after-create1.png`). Die zwei offenen Dateien waren jetzt aufgeklappt, und die fehlenden Felder rot markiert: «Bitte geben Sie ein Datum ein», «Bitte geben Sie einen gültigen Betrag ein», «Bitte geben Sie einen Rechnungssteller ein», «Bitte geben Sie eine Beschreibung ein», «Wählen Sie eine Kategorie.» Dazu oben «Füllen Sie die markierten Felder aus.» Erst jetzt wusste ich, was fehlt.
7. **Die zwei offenen Dateien ergänzt und erstellt.** Gartenbau: Rechnungssteller «Gartenbau Grün», Beschreibung, Betrag 480.00, Kategorie «Gartenpflege». Hauswart: Datum 31.03.2026, Betrag 920.00, «Hauswartung Meier GmbH», «Hauswartung Q1 2026», Kategorie «Hauswart». Der Knopf hiess dann «2 Rechnungen erstellen» (Bild `13-before-create2.png`). Nach dem Klick schloss sich das Fenster, und auf der Seite «Rechnungen» stand grün «2 Rechnungen erstellt» mit beiden Links (Bild `14-after-create2.png`). Jetzt ist nichts mehr offen. Sehr klar.
8. **Erstellte Rechnung «Elektro Blitz AG» geöffnet, Abschnitt «Beleg» (Aufgabe 5).** Gesehen: «Beleg», Dateiname «Elektro Blitz AG.pdf», «Beleg anzeigen (öffnet in neuem Tab)» (öffnet das PDF), «Bewahren Sie die Originalrechnung auf; Mieter dürfen sie einsehen.» und darunter «Datei des Belegs» mit «Wählen Sie die neue Datei und dann «Beleg ersetzen».» (Bild `16-beleg.png`). Ein Klick auf «Beleg ersetzen» ohne Datei ergab «Wählen Sie eine Datei.»; nichts wurde ersetzt. Gut.
9. **«Rechnung bearbeiten», Rechnungsnummer korrigiert.** Erwartet: Feld ändern, speichern. Gesehen: oben «Korrigieren Sie die Rechnung von Elektro Blitz AG. Bestehende Abrechnungen ändern sich dadurch nicht.» Das beruhigt mich. «Änderungen speichern» ist gesperrt, bis ich etwas ändere. R-1001 → EB-2026-0331, gespeichert. Zurück auf der Rechnung stand «Rechnung von Elektro Blitz AG gespeichert», bei der Rechnungsnummer «EB-2026-0331» und bei «Zuletzt geändert» die neue Zeit. Die Kategorie heisst hier «Kategorie (optional)» (P-5).
10. **«Rechnung erfassen» → «Neue Rechnung», Kategorie «Reparaturen» (Aufgabe 6, nicht gespeichert).** In der Liste stehen die Kategorien in zwei Gruppen; «Reparaturen» unter «Nicht umlagefähige Kosten». Nach der Wahl: Das Kästchen «Umlagefähig» ist leer und gesperrt, darunter «Die Rechnung fliesst nicht in die Nebenkostenabrechnung ein.» und ein gelber Kasten «Nicht umlagefähige Kategorie – Kosten dieser Kategorie (z. B. Reparaturen, Gebäudeversicherung) können nicht auf Mieter umgelegt werden.» (Bild `21-neu-reparaturen.png`). Das verstehe ich. Zum Vergleich mit «Hauswart»: angekreuzt, «Die Rechnung fliesst in die Nebenkostenabrechnung ein.» Danach habe ich die Seite verlassen, ohne zu speichern.
11. **Zusatz: «Abbrechen» im Hochladen-Fenster.** Es kommt eine Rückfrage «Hochladen abbrechen? Hochgeladene Dateien und Ihre Eingaben gehen verloren.» mit «Weiter prüfen» und «Abbrechen und verwerfen». Sehr gut, so verliere ich nichts aus Versehen.

## Verwirrung

- «unvollständig» auf dem Knopf: Ich wusste nicht, ob unvollständige Dateien verloren gehen oder bleiben. Sie bleiben, und das sieht man nach dem Klick an «Noch offen: …».
- «Bitte füllen Sie die Felder aus.»: welche? Alle, auch die freiwilligen? (P-1)
- «Die KI ist nicht verfügbar.»: Ist jetzt alles kaputt? (P-3)
- «Konfidenz der KI»: unbekanntes Wort.
- «Kategorie» ist beim Hochladen Pflicht, beim Bearbeiten «(optional)» (P-5).
- «Verteilschlüssel» bei einer nicht umlagefähigen Rechnung: Wozu, wenn sie nicht verteilt wird? (P-6)

## Fehlerrisiken

- Wer nur die Kategorie wählt, weil der Hinweis nur sie nennt, wundert sich, warum die Datei weiter «unvollständig» bleibt (P-1).
- Bei 200 % vergleicht man Betrag und Datum mit der Datei weniger sorgfältig, weil man dafür scrollen oder den Tab wechseln muss (P-2).
- Die KI setzt teils fremde Werte ein (bei Gartenbau «Allgemeinstrom Q1» als Beschreibung und R-1001 als Nummer). Wer nur das Rechnungsdatum prüft, wie der Hinweis sagt, übernimmt die falsche Beschreibung und Nummer. Das geht auf den Stellvertreter der KI zurück, zeigt aber: Der Hinweis «Prüfen Sie: Rechnungsdatum.» lässt die anderen Felder sicherer wirken, als sie sind.

## Vorschläge

- **P-1:** Rechnungen → «Rechnungen hochladen» → «Musterhaus Zentrum» → «Hauswart Q1 ohne KI.pdf» auswählen → Hinweise lesen → «Angaben prüfen» → nur «Kategorie» wählen. Der Hinweis zeigt nur noch «Die KI ist nicht verfügbar. Bitte füllen Sie die Felder aus.», der Knopf «0 Rechnungen erstellen (1 unvollständig)». Hilfreich: im Hinweis die fehlenden Pflichtfelder nennen, wie bei den anderen Dateien («Ergänzen Sie: Rechnungsdatum, Betrag, Rechnungssteller, Beschreibung.»), und die Liste kürzer werden lassen, während man ausfüllt.
- **P-2:** Zoom 200 %, Hochladen wie oben, «Angaben prüfen» → Vorschau steht über den Feldern, volle Breite. Hilfreich: Vorschau kleiner und neben den Feldern lassen oder beim Scrollen mitlaufen lassen, oder «Datei gross anzeigen» im selben Fenster als Überlagerung öffnen, die man neben die Felder legen kann.
- **P-3:** wie P-1. Hilfreich: «Diese Datei konnte die KI nicht lesen. Bitte füllen Sie die Felder selbst aus.» und den Satz entfernen, wenn alle Pflichtfelder ausgefüllt sind.
- **P-4:** Hochladen von «Elektro Blitz AG.pdf» → «Angaben prüfen» → Feld «Fälligkeitsdatum (optional)». Hilfreich: bei freiwilligen Feldern ein ruhiger, grauer Hinweis statt Warnfarbe.
- **P-5:** Rechnung «Elektro Blitz AG» → «Rechnung bearbeiten» → Abschnitt «Kategorie und Verteilung». Hilfreich: Kategorie gleich behandeln wie beim Hochladen, oder erklären, was ohne Kategorie passiert.
- **P-6:** «Rechnung erfassen» → Kategorie «Reparaturen». Hilfreich: das gesperrte Kästchen sichtbar als gesperrt zeichnen (oder durch einen Text «Nicht umlagefähig» ersetzen) und «Verteilschlüssel» ausblenden oder erklären.

## Nicht geprüft

- Den echten Vergleich von Datei und Feldern: Die Testdateien enthalten keine Angaben.
- Das PDF im neuen Tab bei «Datei gross anzeigen» konnte der Testbrowser nicht abbilden (der eingebaute PDF-Betrachter liess kein Bildschirmfoto zu). Das PNG wurde angezeigt.
- Ziehen und Ablegen von Dateien (ich habe nur «auswählen» benutzt).
- «Beleg ersetzen» mit einer echten neuen Datei: Ich wollte den Beleg nicht austauschen.
- Die Erstellung bei 200 % (erstellt habe ich bei 150 %).
