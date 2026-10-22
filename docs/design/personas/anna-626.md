# Anna – Erste Einrichtung ohne KI und «Rechnungen hochladen» (#626)

Persona: Anna, 29, vermietet zum ersten Mal. Desktop 1440 × 900, Upload-Dialog zusätzlich auf dem Handy 390 × 844. Frische Installation auf http://localhost:3300, nicht angemeldet gestartet.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/anna-626/`

| ID | Schwere | Bildschirm | Befund |
|----|---------|------------|--------|
| P-1 | Minor | Upload-Dialog, nach Dateiwahl | Bei «Keine KI» steht in einem gelben Warnkasten «Die KI hat diese Datei nicht gelesen. Füllen Sie die Felder aus.», dazu das Abzeichen «Bitte prüfen» und «Fertig: 1 von 1». Das klingt, als hätte eine KI es versucht und es sei etwas schiefgegangen. Ein direkter Widerspruch zum Text oben ist es nicht, aber ich habe mich kurz erschrocken. |
| P-2 | Minor | Upload-Dialog, nach Dateiwahl (Netzwerk) | Obwohl «Keine KI» gewählt ist, schickt der Browser die Seite der PDF als Bild (rund 27 KB JPEG) per `POST /api/invoices/extract` an den Server. Der Server antwortet `503 {"code":"EXTRACTION_UNAVAILABLE"}`. Keine KI hat die Datei gelesen, das stimmt also. Trotzdem geht mein Beleg zum Lesen an den Server, und der Dialog sagt dazu nichts. |
| P-3 | Minor | Upload-Dialog, Dateizeile | Die Felder öffne ich über «Angaben prüfen». Es gibt aber nichts zu prüfen, alle Felder sind leer und ich muss sie selbst ausfüllen. «Angaben eingeben» würde zu «Sie geben die Angaben selbst ein» passen. |
| P-4 | Nit | Upload-Dialog, Handy 390 px | «Dateien hierher ziehen oder auswählen» passt auf dem Handy nicht, dort kann man nichts ziehen. Ausserdem ist das Gebäude in der Auswahl abgeschnitten («Haus Lindenweg – Lindenweg 7, 3…»). |

## Beobachtungen

- Auf der Einrichtungsseite war klar, was «Später entscheiden» bedeutet: «Dwello speichert «Keine KI». Bis Sie unter «Einstellungen» › «KI» eine KI wählen, erfassen Sie Rechnungen von Hand.» Vorausgewählt war «Lokale KI auf diesem Server». Ich musste also aktiv umstellen.
- Auf der Übersicht steht nach der Einrichtung: «Es ist «Keine KI» gewählt. Sie erfassen Rechnungen von Hand.», dazu der Link zu «Einstellungen» › «KI». Der Dialog sagt dasselbe: «Es ist «Keine KI» gewählt: Sie geben die Angaben selbst ein, bevor Dwello die Rechnungen erstellt.» Das widerspricht sich nicht.
- Die Adresssuche hat geantwortet, aber für «Lindenweg 7 Bern» nur Lindenweg 70–77 in 3084 Wabern gefunden. Ich habe die Adresse dann von Hand eingegeben (Lindenweg 7, 3012 Bern, BE, Mehrfamilienhaus). Das Speichern hat geklappt: «Gebäude «Haus Lindenweg» gespeichert».
- Im Dialog war mein einziges Gebäude schon ausgewählt. Nach der Dateiwahl ist die Gebäudeauswahl gesperrt, und ein Hinweis erklärt den Grund. Das finde ich gut.
- Der Satz «Dateien, aus denen Sie keine Rechnung erstellen, speichert Dwello nicht.» hat mich beruhigt. Ob er stimmt, kann ich als Nutzerin nicht prüfen.
- In den Feldern ist «Umlagefähig» schon angehakt, obwohl ich noch keine Kategorie gewählt habe. Ohne KI muss ich selbst daran denken, das Häkchen zu prüfen.
- Unten im Dialog steht «0 Rechnungen erstellen (1 unvollständig)». Damit ist klar, dass noch etwas fehlt.
- Die Kategorie-Auswahl hatte direkt nach dem Aufklappen der Angaben im Accessibility-Tree nur «Kategorie auswählen». Ein paar Sekunden später waren alle 21 Kategorien da. Für mich war das kein Problem.

## Aufgabe geschafft: ja

Eingerichtet mit «Später entscheiden», erstes Gebäude erfasst, Upload-Dialog gelesen und eine PDF ausgewählt. Eine Rechnung habe ich nicht erstellt, das war nicht verlangt.

## Aufwand

Etwa 10 Minuten und 9 Schritte: Einrichtung, Übersicht, Gebäude erfassen mit erfolgloser Suche und Eingabe von Hand, Dialog aus der Übersicht öffnen, Datei wählen, «Angaben prüfen», Handy-Ansicht.

## Ablauf

1. **http://localhost:3300 öffnen.** Erwartet: eine Anmelde- oder Einrichtungsseite. Gesehen: Weiterleitung auf `/setup`, «Dwello einrichten» mit Einrichtungscode (mit Hinweis, wo er steht), E-Mail, Passwort zweimal und der Frage «Welche KI soll Rechnungen lesen?».
2. **Ausfüllen, «Später entscheiden» wählen, «Dwello einrichten».** Erwartet: Ich bin angemeldet. Gesehen: Übersicht mit dem Hinweis «Es ist «Keine KI» gewählt. Sie erfassen Rechnungen von Hand.» Als nächster Schritt steht «Erstes Gebäude erfassen» da.
3. **«Gebäude erfassen», Adresse suchen.** Erwartet: Treffer für Lindenweg 7, Bern. Gesehen: nur Lindenweg 70–77 in Wabern. Ich habe Strasse, PLZ, Ort und Kanton von Hand eingegeben und gespeichert. Danach landete ich auf der Seite des Gebäudes mit der Meldung «gespeichert».
4. **Übersicht › «Rechnungen hochladen».** Erwartet: ein Dialog zum Hochladen. Gesehen: Die Rechnungsseite öffnet sich, und darüber der Dialog «Rechnungen hochladen». Oben die beiden Texte zu «Keine KI» und zum Speichern der Belege, das Gebäude ist schon gewählt, «0 Rechnungen erstellen» ist ausgegraut.
5. **«Dateien auswählen», eine kleine PDF.** Erwartet: Die Datei erscheint, und ich soll die Angaben eingeben. Gesehen: «Fertig: 1 von 1. Bitte prüfen: 1.», dann die Datei mit dem gelben Abzeichen «Bitte prüfen» und einem gelben Kasten: «Die KI hat diese Datei nicht gelesen. Füllen Sie die Felder aus. Wählen Sie eine Kategorie. Wählen Sie, wie die Kosten verteilt werden. Füllen Sie aus: Rechnungsdatum, Betrag, Rechnungssteller, Beschreibung.» Der Knopf heisst «0 Rechnungen erstellen (1 unvollständig)». Im Netzwerk: `POST /api/invoices/extract` → 503 (P-1, P-2).
6. **«Angaben prüfen».** Erwartet: ein Formular. Gesehen: Vorschau der PDF, der Link «Datei gross anzeigen», dann leere Felder mit Hilfetexten (Rechnungsdatum, Leistungszeitraum, Betrag, Rechnungssteller, Beschreibung, Kategorie, Verteilschlüssel, «Umlagefähig» angehakt). Was als Nächstes zu tun ist, war klar (P-3).
7. **Handy 390 × 844.** Erwartet: Alles passt ohne seitliches Scrollen. Gesehen: Die Seite ist 390 px breit, die Texte sind gleich, «Rechnungen erstellen» liegt über «Abbrechen» und ist 68 px hoch. Das Gebäude in der Auswahl ist abgeschnitten (P-4).

## Verwirrung

- «Die KI hat diese Datei nicht gelesen»: Welche KI? Ich habe doch keine gewählt (P-1).
- «Fertig» und «Bitte prüfen»: Was ist fertig, was soll ich prüfen? Ich habe noch nichts eingegeben (P-1, P-3).
- «Verteilschlüssel» und «Umlagefähig» kenne ich als Anfängerin kaum. Die Hilfetexte unter den Feldern helfen aber.

## Fehlerrisiken

- «Umlagefähig» ist vorausgewählt. Ohne KI übernehme ich das vielleicht ungeprüft, auch für Kosten, die nicht umlagefähig sind.
- Der gelbe Warnkasten könnte mich glauben lassen, der Upload sei kaputt, und ich breche ab, obwohl alles richtig läuft.

## Vorschläge

- **P-1:** Reproduktion: frisch einrichten mit «Später entscheiden», Gebäude erfassen, «Rechnungen hochladen», eine PDF wählen. Hilfreich wäre bei «Keine KI» ein neutraler Hinweis statt einer Warnung, etwa «Geben Sie die Angaben dieser Rechnung ein.», ohne die KI zu erwähnen, mit neutralem Abzeichen (zum Beispiel «Angaben fehlen») und ohne «Fertig: 1 von 1».
- **P-2:** Reproduktion wie bei P-1, dabei im Netzwerk `POST /api/invoices/extract` beobachten (Body enthält `pages: ["data:image/jpeg;base64,…"]`, Antwort 503 `EXTRACTION_UNAVAILABLE`). Hilfreich wäre, bei «Keine KI» nichts zum Lesen zu schicken. Sonst sollte der Dialog sagen, dass die Datei zum Server geht. Dr. Weber sollte das mit der Datenschutzerklärung abgleichen.
- **P-3:** Reproduktion wie bei P-1, dann den Knopf in der Dateizeile ansehen. Hilfreich wäre bei «Keine KI» die Beschriftung «Angaben eingeben», und die Felder gleich offen zeigen, wenn nur eine Datei gewählt ist.
- **P-4:** Reproduktion: Dialog auf 390 × 844 öffnen. Hilfreich wäre auf Touch-Geräten nur «Dateien auswählen» als Titel. Für das Gebäude reicht der Name, oder die Adresse kommt in eine zweite Zeile.

## Nicht geprüft

- Eine Rechnung erstellen: Das war nicht verlangt. Ob Dwello die Datei wirklich nur bei einer erstellten Rechnung speichert, kann ich als Nutzerin nicht sehen.
- JPG oder PNG, mehrere Dateien, zu grosse Dateien: nur eine PDF ausprobiert.
- Den Weg über die Rechnungsseite habe ich nur im Skript beim Prüfen der Kategorien benutzt. Bewertet habe ich den Weg aus der Übersicht.
- Dunkelmodus und Tastaturbedienung: nicht Annas Aufgabe.
