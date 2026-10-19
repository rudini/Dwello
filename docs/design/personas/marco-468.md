# Marco – #468: «Weiter» wartet, solange ein Schritt lädt

Persona: Marco, 38, Smartphone 390 × 844, Touch. App: Persona-Stack auf http://localhost:3300 mit Demodaten. Nichts gespeichert: «Entwürfe erstellen» nicht gedrückt, kein Mietvertrag gespeichert.
Langsame Verbindung nachgestellt: `/api/invoices?…`, `/api/statements/billed?…`, `/api/statements/agreements?…` und `/api/contracts?apartmentId=…` je 4 s verzögert (Playwright `page.route`). Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/e9211292-8906-5267-a76e-82d2c2cdf877/scratchpad/marco-468/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnungen erstellen, Schritt 3 «Heizprofil und Verwaltungspauschale» | Wird «Bitte warten …» wieder zu «Weiter», erscheint gleichzeitig der Hinweis «Ohne vereinbarte Verwaltungspauschale» darüber und schiebt den Knopf um 240 px nach unten. Wo eben noch der Knopf war, liegt jetzt der Link «Kevin Fischer, Wohnung OG1». Ich habe auf den gesperrten Knopf weiter getippt, und mein nächster Tipp hat mich aus dem Assistenten auf die Seite «Mietvertrag von Kevin Fischer» gebracht. |
| P-2 | Minor | Abrechnungen erstellen, Schritt 2 «Gebäude» | Gleiches Muster: Beim Entsperren erscheinen pro Gebäude die Rechnungszahl und der lange Hinweis «Alle Mietverträge … haben schon eine Abrechnung». «Weiter» springt dabei um rund 820 px nach unten und ist nicht mehr zu sehen. Ein Tipp auf die alte Stelle hat «Seepark Residenz» angewählt, ohne dass ich es gesehen habe. In diesen Demodaten entsteht dafür nichts, bei einem noch nicht abgerechneten Gebäude aber schon. |
| P-3 | Minor | Abrechnungen erstellen, Schritte 2 und 3 | «Bitte warten …» ist auf dem ersten Bildschirm nach «Weiter» nicht zu sehen: Der Knopf liegt bei y = 1113 (Schritt 2) bzw. y = 2328 (Schritt 3), der Bildschirm ist 844 hoch. In Schritt 2 steht auch sonst nirgends, dass etwas lädt. Ich merke das Warten erst, wenn ich nach unten wische. |
| P-4 | Nit | Abrechnungen erstellen, Schritte 2 und 3, normale Geschwindigkeit | Ohne Verzögerung blitzt «Bitte warten …» für etwa 50 ms auf (in der Aufzeichnung der Seite gemessen), in Schritt 3 springt der Knopf dabei zweimal (y 2478 → 2814 → 2718). Mit dem Auge kaum zu sehen, es flackert höchstens. |

## Beobachtungen

- «Neuer Mietvertrag», Schritt «Wohnung» mit Verzögerung: Das gefällt mir. Im Kasten steht «Es wird geprüft, welche Wohnungen frei sind …», und «Bitte warten …» ist ohne Wischen sichtbar (y = 571). Beim Entsperren springt «Weiter» zwar aus dem Bild (571 → 1139, mit dem Hinweis «Thomas Weber hat einen Mietvertrag ohne Vertragsende»). Unter dem Finger liegt dann aber nur Fliesstext, bei Marco Bernasconi auch. Durch Weitertippen ist nichts passiert.
- «Neuer Mietvertrag» bei normaler Geschwindigkeit: Die Verträge laden schon in Schritt 1, «Bitte warten …» kommt gar nicht vor. Mit 4 s Verzögerung sehe ich das Warten nur, wenn ich den Mieter in weniger als etwa 4 s wähle.
- Der gesperrte Knopf ist hellgrau-blau mit weisser Schrift und deutlich anders als das kräftige «Weiter». Ich verstehe, dass er gesperrt ist, und der Text sagt mir, dass ich warten soll.
- Tippen auf den gesperrten Knopf: Nichts Seltsames passiert, kein Schrittwechsel, keine Meldung, kein Doppelsprung. Neun Tipps in 4 s haben nichts ausgelöst.
- Nach dem Abstecher auf den Mietvertrag (P-1) bringt mich «Zurück» im Browser wieder in Schritt 3, und meine Angaben sind noch da. Der Hinweis «Noch nicht gespeichert: Dwello bewahrt Ihre Angaben nur in diesem Browser auf» stimmt also.
- Schritt 2: Ich habe nur Alpenblick gewählt, und «Alle Gebäude» war danach angehakt bei «1 von 3 gewählt». Das passt zum Hinweis, dass «Alle Gebäude» die zwei abgerechneten Gebäude auslässt, wirkt auf den ersten Blick aber widersprüchlich. Gehört nicht zu #468.
- Nach jedem Schrittwechsel steht die Seite leicht gescrollt (scrollY 110 bis 195), die Überschrift des Schritts ist oben. Das ist in Ordnung.
- Vorschau (Schritt 4) für Alpenblick 2025: 2 Abrechnungen, Kosten aller Abrechnungen CHF 4’946.67, Hinweis «Möglicherweise fehlen Rechnungen» (Kaminfeger, Kaltwasser 2. Halbjahr). Danach habe ich nicht weitergemacht.

## Aufgabe geschafft: ja

Vorschau für Alpenblick 2025 erreicht, mit und ohne Verzögerung. «Neuer Mietvertrag» bis zum Schritt «Wohnung» geöffnet, mit und ohne Verzögerung.

## Aufwand

Etwa 30 Minuten, davon pro Durchgang durch den Abrechnungsassistenten rund 10 s Bedienung und 3 × 4 s Warten. Schritte: Abrechnung 3 × «Weiter» plus 1 Häkchen. Mietvertrag: 1 Auswahl, 1 × «Weiter».

## Ablauf

1. **Abrechnungen erstellen, Schritt 1:** erwartet war 2025 vorgeschlagen. Gesehen: 01.01.2025 bis 31.12.2025 ist vorbelegt. «Weiter» liegt unter dem Bildrand (y = 1142), ich muss wischen.
2. **Schritt 2 «Gebäude», langsam:** erwartet war, dass ich sehe, dass noch geladen wird. Gesehen: Die drei Gebäude erscheinen sofort, nur mit Adresse und Wohnungszahl. Auf dem ersten Bildschirm deutet nichts auf Warten hin (Screenshot `slow-s2-gebaeude-1-first-view.png`/`slow-20-gebaeude-early.png`: Titel, Schrittanzeige, Alpenblick, Seepark). Nach dem Wischen steht unten der graue Knopf «Bitte warten …» (`slow-s2-gebaeude-2-scrolled-locked.png`). Mein Tipp darauf bewirkt nichts. Nach rund 3 s kommen die Rechnungszahlen und die Hinweise «schon abgerechnet», und der Knopf verschwindet nach unten aus dem Bild. Unter meinem Daumen liegt jetzt die Karte «Seepark Residenz» (`slow-s2-gebaeude-4-unlocked-view.png`). Beim Weitertippen wird Seepark angehakt (`hammer-gen2.png`: Seepark-Karte blau hinterlegt, Häkchen gesetzt).
3. **Alpenblick anhaken, «Weiter»:** wie erwartet.
4. **Schritt 3 «Heizprofil und Verwaltungspauschale», langsam:** erwartet war ein Hinweis, worauf ich warte. Gesehen: Der erste Bildschirm zeigt nur Überschrift und den langen Heizprofil-Text (`slow-s3-heizprofil-1-first-view.png`). Ganz unten, nach langem Wischen: «Dwello prüft, ob die Mietverträge die Nebenkosten dieser Periode vereinbaren …» und darunter «Bitte warten …» (`slow-s3-heizprofil-2-scrolled-locked.png`). Das verstehe ich. Nach dem Laden erscheint der Kasten «Ohne vereinbarte Verwaltungspauschale» mit dem Link «Kevin Fischer, Wohnung OG1» genau dort, wo der Knopf war, und «Weiter» rutscht an den unteren Rand (`slow-s3-heizprofil-4-unlocked-view.png`). Beim Weitertippen lande ich auf «Mietvertrag von Kevin Fischer» (`hammer-gen3-contract-page.png`).
5. **Schritt 4 «Vorschau»:** wie erwartet, mit Zusammenfassung und Abrechnungen pro Mietvertrag (`slow-s4-vorschau-5-full.png`).
6. **Neuer Mietvertrag, langsam:** Mieter «Thomas Weber» gewählt und sofort «Weiter». Erwartet war ein Hinweis auf das Warten. Gesehen: «Es wird geprüft, welche Wohnungen frei sind …» und «Bitte warten …», beides ohne Wischen sichtbar (`slow-c2-1-first-view.png`). Nach rund 3 s erscheinen der Hinweis zum bestehenden Mietvertrag und das Feld «Wohnung» (`slow-c2-3-loaded-view.png`).
7. **Normale Geschwindigkeit:** Abrechnung und Mietvertrag gehen flüssig durch. «Bitte warten …» ist im Abrechnungsassistenten nur als kurzes Flackern messbar, im Mietvertrag gar nicht (`fast-s2-view.png`, `fast-s3-view.png`, `fast-s4-full.png`, `fast-c2-view.png`).

## Verwirrung

- «Bitte warten …» sagt nicht, worauf ich warte. In Schritt 3 und beim Mietvertrag steht es im Text darüber, in Schritt 2 nirgends.
- Dass Gebäude ohne Rechnungszahl erscheinen und Sekunden später mit Zahl und langem Hinweis, wirkt wie zwei verschiedene Bildschirme.

## Fehlerrisiken

- Wer ungeduldig auf den gesperrten Knopf tippt (am Handy typisch: «geht das?»), trifft im Moment des Entsperrens etwas anderes. Das ist in Schritt 3 ein Link, der den Assistenten verlässt (P-1), und in Schritt 2 ein Gebäude-Häkchen (P-2). Das Häkchen verändert die Auswahl unbemerkt, weil der Bildausschnitt danach anders aussieht.
- Die Sperre verhindert nur, dass «Weiter» zu früh gedrückt wird. Den Sprung, der laut #468 das eigentliche Problem war, gibt es weiterhin, jetzt beim Entsperren.

## Vorschläge

- **P-1:** Abrechnungen erstellen, 2025, Weiter, nur Alpenblick, Weiter. Mit verzögertem `/api/statements/agreements?…` ans Seitenende wischen und während «Bitte warten …» mehrmals auf den Knopf tippen. Nach dem Entsperren landet der Tipp auf «Kevin Fischer, Wohnung OG1», und es öffnet sich der Mietvertrag. Hilfreich wäre, den Platz für den Hinweis beim Laden schon freizuhalten oder den Hinweis unterhalb des Knopfs einzufügen. Oder der Knopf bleibt nach dem Entsperren noch kurz gesperrt (z. B. 300 ms), damit ein Tipp aus dem Warten nicht auf neuen Inhalt fällt.
- **P-2:** Abrechnungen erstellen, 2025, Weiter. Mit verzögertem `/api/invoices?…` und `/api/statements/billed?…` ans Seitenende wischen und auf «Bitte warten …» tippen, bis es entsperrt. «Seepark Residenz» ist dann angehakt. Hilfreich wäre, Platzhalter für Rechnungszahl und Hinweis zu zeigen, solange geladen wird. Oder die Gebäude erst zu zeigen, wenn alles da ist, wie beim Mietvertrag («Es wird geprüft …»).
- **P-3:** wie P-2, nur den ersten Bildschirm nach «Weiter» anschauen. Ein kurzer Satz oben im Schritt («Dwello zählt die Rechnungen pro Gebäude …») würde reichen, wie in Schritt 3 und beim Mietvertrag, dort aber weiter oben.
- **P-4:** ohne Verzögerung durch Schritt 2 und 3. Den Wartetext erst nach einer kleinen Verzögerung (z. B. 300 ms) zeigen, dann flackert nichts.

## Nicht geprüft

- Ein echtes langsames Mobilnetz und ein echtes Gerät mit Daumen: Ich habe nur die 4 s Verzögerung im Browser nachgestellt und mit Playwright-Touch getippt. Wie schnell ein Mensch nach dem Entsperren tippt, ist geschätzt.
- Fehlschlag statt Verzögerung (z. B. 500 bei `/api/statements/agreements`): nicht Teil der Aufgabe.
- Dunkelmodus, Querformat, andere Sprachen.
- Speichern («Entwürfe erstellen», Mietvertrag speichern): ausdrücklich nicht erlaubt.
