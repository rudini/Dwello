# Helga – Runde 760: Dateizeile beim Hochladen ohne KI

Persona: Helga, 68, Desktop 1440 × 900, Zoom 150 %, Maus. Frische Installation auf http://localhost:3300, ohne Konto und ohne Demodaten, abgemeldet gestartet.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/helga-760/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Rechnungen hochladen, Dateizeile | Das Schildchen sagt «Bitte prüfen», der Knopf «Angaben eingeben». Zu prüfen gibt es nichts, ich muss alles selbst eintippen. Erst die Hinweise darunter sagen mir, was fehlt. |
| P-2 | Minor | Rechnungen hochladen, Zeile über der Datei | «Fertig: 1 von 1. Bitte prüfen: 1.» Beim Wort «Fertig» dachte ich, die Rechnung sei schon erledigt. Gemeint ist offenbar nur, dass das Hochladen fertig ist. |
| P-3 | Minor | Rechnungen hochladen, Felder | Die Hilfe beim Verteilschlüssel sagt: «Dwello schlägt den Verteilschlüssel vor … sonst den aus den Einstellungen.» Nach der Wahl von «Hauswart» blieb das Feld aber auf «Verteilschlüssel auswählen». Es wurde nichts vorgeschlagen. |
| P-4 | Nit | Rechnungen hochladen, Hinweise in der Dateizeile | Die Hinweise nennen zuerst die Kategorie und die Verteilung, dann Datum, Betrag usw. In den Feldern stehen Kategorie und Verteilschlüssel aber ganz unten, nach einem langen Hilfetext. Ich habe die Kategorie zuerst oben gesucht. |

## Beobachtungen

- Das Einrichten hat gut geklappt: Code, E-Mail, zweimal das Passwort, dann «Später entscheiden». Danach war ich angemeldet. Die Übersicht sagt deutlich «Es ist ‹Keine KI› gewählt. Sie erfassen Rechnungen von Hand.»
- Die Adresssuche für das Gebäude hat Lindenweg 7, 3604 Thun gefunden. Dabei wurde aus dem Register gleich eine Wohnung «EG» mit 4 Zimmern und 85 m² vorgeschlagen. Nach dem Treffer heisst der Knopf «Gebäude und Wohnungen erstellen» statt «Gebäude erfassen». Das passt, hat mich aber kurz überrascht.
- Im Fenster «Rechnungen hochladen» war mein einziges Gebäude schon ausgewählt. Der Einleitungstext sagt gleich, dass ich ohne KI alles selbst eingebe. Das hat mir geholfen.
- Bei 150 % Zoom sieht man nach dem Hochladen die Dateizeile zuerst nicht. Man muss im Fenster nach unten scrollen, unter dem Rand sieht man nur halb «Hauswartung.pdf» und «Bitte prüfen».
- Die Hinweise in der Dateizeile gehen weg, sobald ich ein Feld ausgefüllt habe. Am Schluss stand nur noch «Wählen Sie, wie die Kosten verteilt werden.» Das ist sehr hilfreich.
- Die Vorschau der Rechnung steht links oben. Wenn ich weiter unten den Betrag oder den Rechnungssteller eintippe, ist sie nicht mehr zu sehen, und ich muss zum Abschreiben wieder hinaufscrollen.
- Zwischen Rechnungsdatum und Betrag steht ein sehr langer Text zum Leistungszeitraum (Boiler entkalken, VMWG). Für meine Hauswart-Rechnung war das zu viel. Ich habe den Betrag dahinter fast nicht gefunden.
- Der Hauptknopf heisst «0 Rechnungen erstellen (1 unvollständig)» und sieht dunkelblau und klickbar aus. «0 Rechnungen» hat mich verunsichert. Ich habe ihn nicht gedrückt.
- Das Kategorie-Feld zeigt beim Öffnen alle 21 Kategorien. «Hauswart» war leicht zu finden.

## Aufgabe geschafft: ja

Eingerichtet, Gebäude erfasst, Datei hochgeladen, Felder geöffnet und bis auf den Verteilschlüssel ausgefüllt. Die Rechnung habe ich wie erlaubt nicht erstellt.

## Aufwand

Etwa 15 Minuten, rund 25 Schritte: Einrichten 6, Gebäude 5, Hochladen 4, Felder ansehen und ausfüllen etwa 10.

## Ablauf

1. **http://localhost:3300 öffnen.** Erwartet: eine Anmeldung. Gesehen: «Dwello einrichten» mit Einrichtungscode, E-Mail, Passwort, Passwort wiederholen und der Frage «Welche KI soll Rechnungen lesen?». «Lokale KI auf diesem Server» war vorgewählt.
2. **Ausfüllen, «Später entscheiden» wählen, «Dwello einrichten».** Erwartet: dass ich angemeldet bin. Gesehen: die Übersicht mit dem Hinweis «Keine KI» und dem nächsten Schritt «Erstes Gebäude erfassen».
3. **«Gebäude erfassen».** Erwartet: ein Formular. Gesehen: Gebäudename, eine Adresssuche und darunter die Adressfelder zum Ausfüllen von Hand.
4. **Name «Haus Lindenweg» eingeben und «Lindenweg 7 Thun» suchen.** Gesehen: drei Treffer. Ich habe «Lindenweg 7 3604 Thun (BE)» gewählt. Strasse, PLZ, Ort und Kanton (Bern) wurden ausgefüllt, der Gebäudetyp «Einfamilienhaus» und eine Wohnung «EG» vorgeschlagen.
5. **«Gebäude und Wohnungen erstellen».** Gesehen: die Seite «Haus Lindenweg» mit 1 Wohnung, leer. Gespeichert.
6. **Zur Übersicht und «Rechnungen hochladen».** Erwartet: eine Seite zum Hochladen. Gesehen: das Fenster «Rechnungen hochladen». Das Gebäude war schon gewählt, der Knopf hiess «0 Rechnungen erstellen» und war ausgegraut.
7. **«Dateien auswählen», Hauswartung.pdf.** Erwartet: dass die Datei erscheint. Gesehen: das Gebäude wird gesperrt («Das Gebäude gilt für alle Dateien …»), dann «Fertig: 1 von 1. Bitte prüfen: 1.» Die Dateizeile lag unter dem sichtbaren Rand.
8. **Hinunterscrollen zur Dateizeile.** Gesehen: «Hauswartung.pdf», rechts das gelbe Schildchen «Bitte prüfen». Darunter der Kasten «Hinweise zu Hauswartung.pdf» mit «Wählen Sie eine Kategorie.», «Wählen Sie, wie die Kosten verteilt werden.» und «Füllen Sie aus: Rechnungsdatum, Betrag, Rechnungssteller, Beschreibung.» Darunter das Häkchen «Diese Rechnung erstellen», der Stift «Angaben eingeben» und der rote Knopf «Datei entfernen».
   Verstanden habe ich: Ich muss etwas eintippen, und zwar über «Angaben eingeben». Das Schildchen «Bitte prüfen» passt nicht dazu (P-1).
9. **«Angaben eingeben».** Erwartet: Felder für das, was in den Hinweisen steht. Gesehen: der Knopf heisst jetzt «Angaben ausblenden». Links eine Vorschau der Rechnung mit «Datei gross anzeigen (öffnet in neuem Tab)», rechts die Felder Rechnungsnummer (optional), Rechnungsdatum, Leistungszeitraum (optional, mit langem Text), Betrag, Rechnungssteller, Beschreibung, Fälligkeitsdatum (optional), Kategorie, Verteilschlüssel und das Häkchen Umlagefähig. Die Beschriftung «Angaben eingeben» passt zu dem, was ich gefunden habe: Alle Felder aus den Hinweisen sind da.
10. **Datum 30.09.2026, Betrag 450.00, Rechnungssteller und Beschreibung eintippen.** Gesehen: Unter dem Datum steht «Mittwoch, 30. September 2026», sehr schön. Oben in der Zeile blieb nur noch «Wählen Sie eine Kategorie.» übrig.
11. **Kategorie «Hauswart» wählen.** Erwartet: dass der Verteilschlüssel vorgeschlagen wird, wie die Hilfe sagt. Gesehen: Er blieb leer (P-3). Der Hinweis lautete nur noch «Wählen Sie, wie die Kosten verteilt werden.»
12. **«Angaben ausblenden».** Gesehen: Die Zeile ist wieder kurz, mit «Bitte prüfen» und dem einen offenen Hinweis. Der Hauptknopf zeigt «0 Rechnungen erstellen (1 unvollständig)». Hier habe ich aufgehört.

## Verwirrung

- «Bitte prüfen»: Was soll ich prüfen? Es ist ja nichts ausgefüllt (P-1).
- «Fertig: 1 von 1»: Fertig womit? (P-2)
- «Verteilschlüssel»: Das Wort kannte ich nicht. Die Hilfe «Wie die Kosten auf die Wohnungen des Gebäudes verteilt werden» hat es erklärt. Welchen ich bei nur einer Wohnung nehmen soll, weiss ich trotzdem nicht. Bei einer Wohnung ist es vermutlich egal, das steht aber nirgends.
- «Leistungszeitraum»: Mit dem langen Text habe ich es verstanden. Für eine normale Quartalsrechnung ist es aber zu viel zum Lesen.
- «Umlagefähig» war schon angehakt. Die Hilfe sagt, was das heisst. Ob Hauswartung wirklich umlagefähig ist, sagt sie nicht.

## Fehlerrisiken

- Wegen «Fertig» glaubt man vielleicht, die Rechnung sei schon erstellt, und schliesst das Fenster. Dann ist die Datei weg, denn Dwello speichert sie nicht, das steht oben im Text.
- Man tippt den Betrag ab, ohne die Vorschau zu sehen, denn sie ist weggescrollt. Dabei verschreibt man sich leicht.
- Der Knopf «0 Rechnungen erstellen (1 unvollständig)» sieht klickbar aus. Was er bei 0 tut, habe ich nicht ausprobiert.

## Vorschläge

- **P-1:** Datei hochladen, ohne KI, bis zur Dateizeile scrollen. Das Schildchen sagt «Bitte prüfen». Besser wäre ein Wort, das zum Knopf passt, zum Beispiel «Angaben fehlen» oder «Bitte ergänzen».
- **P-2:** Gleiche Schritte, die Zeile über der Datei lesen. Besser wäre etwa «Hochgeladen: 1 von 1. Angaben fehlen: 1.»
- **P-3:** Frische Installation, Datei hochladen, «Angaben eingeben», Kategorie «Hauswart» wählen: Der Verteilschlüssel bleibt leer. Entweder einen Vorschlag zeigen, oder die Hilfe sagen lassen, dass beim ersten Mal nichts vorgeschlagen wird, und erklären, welchen man bei nur einer Wohnung nimmt.
- **P-4:** Gleiche Schritte, die Hinweise mit der Reihenfolge der Felder vergleichen. Die Hinweise in der Reihenfolge der Felder nennen (Datum, Betrag, Rechnungssteller, Beschreibung, Kategorie, Verteilschlüssel).

## Nicht geprüft

- Das Erstellen der Rechnung: Die Aufgabe verlangte es nicht.
- Was «0 Rechnungen erstellen (1 unvollständig)» beim Klicken tut: Ich habe nicht gedrückt.
- Zoom 200 %, Hochladen per Ziehen statt mit «Dateien auswählen», mehrere Dateien auf einmal.
- «Datei gross anzeigen (öffnet in neuem Tab)»: nicht geöffnet.
