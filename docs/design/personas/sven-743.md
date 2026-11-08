# Sven – Slice 743: Rechnungen hochladen, Neue Rechnung, Rechnung bearbeiten

Desktop 1440 × 900, nur Tastatur, beurteilt am Accessibility-Baum (Fokus, Name, Beschreibung über `aria-describedby`, Live-Regionen). Gespeichert habe ich nur im Gebäude «Alpenblick»: eine Rechnung «Sven Testfirma AG, 15.03.2025» über den Upload angelegt. Die Bearbeitung mit 51 Zeichen hat Dwello abgelehnt, es wurde dort nichts gespeichert.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Rechnungen hochladen, Angaben einer Datei | Ich tippe ein Rechnungsdatum ein und lösche es wieder. Danach macht «0 Rechnungen erstellen (1 unvollständig)» nichts mehr: Der Fokus bleibt auf dem Knopf, es gibt keine Ansage und keine Fehlermeldung am Feld. Ich höre also nicht, dass das Datum fehlt. Ohne vorheriges Tippen springt der Fokus korrekt ins Datum und ich höre «Bitte geben Sie ein Datum ein.». |
| P-2 | Major | Rechnungen hochladen, Angaben einer Datei, Leistungszeitraum | Die Aufklappung «Mehr dazu: Zeiträume, Kosten über mehrere Jahre, Entkalken» erreiche ich im Upload-Dialog mit Tab und Shift+Tab nicht. Der Fokus springt von «Kalender für Rechnungsdatum öffnen» direkt zu «Beginn (optional)». Unter «Neue Rechnung» erreiche ich sie mit Tab. |
| P-3 | Minor | Rechnungen hochladen, Hinweisbox | Nach dem Leeren des Datumsfelds steht im Hinweis weiter «Füllen Sie die Felder mit einer Fehlermeldung aus.», obwohl kein Feld mehr eine Fehlermeldung hat. Der Satz passt nicht mehr zum Feld. Er setzt ausserdem voraus, dass man sieht, welche Felder markiert sind. Ohne Bildschirm muss ich alle Felder abhören. Die Zeile davor («Füllen Sie aus: Rechnungsdatum.») ist klar. |
| P-4 | Minor | Rechnungen hochladen, Angaben einer Datei | Bei einer zu langen Rechnungsnummer (54 Zeichen) und sonst vollständigen Angaben steht die Datei auf «Bitte ausfüllen» und der Knopf auf «(1 unvollständig)». Die Hinweisbox nennt aber keinen Grund. Ich erfahre erst nach dem Klick auf «Erstellen», dass die Rechnungsnummer schuld ist. |
| P-5 | Minor | Rechnungen hochladen, Status einer Datei | Ich kürze die Rechnungsnummer. Dann meldet die Live-Region «Bitte ausfüllen: 1. Bereit zum Erstellen: 1.», bei nur einer Datei. Die Datei selbst behält in ihrer Beschreibung («rechnung-test.pdf \| Bitte ausfüllen») und als Text den Status «Bitte ausfüllen», auch noch 3 Sekunden später und nach dem Erstellen-Klick. Ich weiss nicht, ob sie bereit ist. |
| P-6 | Minor | Rechnungen hochladen und Neue Rechnung, Rechnungsdatum | Die Fehlermeldung «Dieses Datum gibt es nicht. …» steht im Baum zweimal hintereinander, einmal als Absatz und einmal als Text. Im Lesemodus höre ich sie doppelt. Beim Verlassen des Felds wird sie einmal angesagt, das ist richtig. |

## Beobachtungen

- Schritt 1 funktioniert gut. Mit einer Datei ist «Gebäude» deaktiviert und beschrieben mit «Das Gebäude gilt für alle Dateien. Entfernen Sie die Dateien, um ein anderes zu wählen.». Nach «Datei entfernen» kommt die Ansage «rechnung-test.pdf entfernt. Sie können das Gebäude wieder wählen.». Der Fokus steht dann auf dem Dateifeld, und mit Shift+Tab erreiche ich das Gebäude wieder. Das war für mich eindeutig. Weil das Gebäude-Feld deaktiviert ist, liegt es nicht mehr in der Tab-Reihenfolge. Die Erklärung dazu höre ich deshalb nur im Lesemodus.
- Nach dem Leeren des Datums und dem Verlassen des Felds kommt keine Meldung «Bitte geben Sie ein Datum ein.». Das Feld ist leer und nicht als ungültig markiert. Insofern passen Feld und Ansage zusammen. Nur die Hinweisbox passt nicht (P-3).
- Im Upload heisst der Datei-Knopf im Baum «Dateien hierher ziehen oder auswählen Dateien auswählen» (doppelter Text). Mit dem Fokus darauf höre ich «Dateien hierher ziehen oder auswählen».
- Meine Test-PDF hat Dwello nicht gelesen («Dwello kann diese Datei nicht öffnen. Bitte füllen Sie die Felder aus.»). Das liegt an meiner Datei und am KI-Ersatz.
- Am Anfang (mit leerem Datum) höre ich den Datumsfehler im Upload genau einmal: Der Fokus springt ins Feld, die Beschreibung lautet «Bitte geben Sie ein Datum ein. \| Übernehmen Sie das Datum …». Es gibt keine zusätzliche Live-Ansage.
- Der Knopf «0 Rechnungen erstellen (1 unvollständig)» ist bedienbar und dient zum Prüfen. Dass er «0» sagt und trotzdem etwas tut, hat mich kurz irritiert.
- Rechnungsnummer im Upload und beim Bearbeiten: Nach dem Klick springt der Fokus ins Feld, ich höre «Höchstens 50 Zeichen. Kürzen Sie den Text.», und mein Text bleibt stehen. Das ist klar. Vorher nennt das Feld keine Höchstlänge.
- «Neue Rechnung» hat kein Feld «Rechnungsnummer», der Upload und «Rechnung bearbeiten» haben eines.
- In «Neue Rechnung» ist das Rechnungsdatum mit dem heutigen Datum (07.11.2026) vorausgefüllt. Die Hilfe sagt gleich daneben «nicht das heutige».
- Aufklappung in «Neue Rechnung»: Mit Tab erreichbar als «DisclosureTriangle» mit dem Namen «Mehr dazu: Zeiträume, Kosten über mehrere Jahre, Entkalken» und dem Zustand «zugeklappt». Der Name sagt mir, was drinsteht. Enter klappt auf (Zustand «aufgeklappt», danach zwei Absätze zu Zeiträumen über mehrere Jahre und zum Entkalken), Leertaste klappt wieder zu.
- Enter im leeren Rechnungsdatum von «Neue Rechnung» (Gebäude «Alpenblick», Betrag, Rechnungssteller und Beschreibung ausgefüllt): Ich höre «Bitte geben Sie ein Datum ein.» einmal assertiv, der Fokus bleibt im Feld. Ein zweites Enter sagt es wieder einmal an. Der Verteilschlüssel ist zusätzlich ungültig («Wählen Sie, wie die Kosten verteilt werden.»), weil nach der Wahl des Gebäudes keiner vorgeschlagen wurde. Das höre ich erst, wenn ich dort ankomme.
- Nach dem Erstellen im Upload steht der Fokus auf «Rechnungen hochladen». «1 Rechnung erstellt» ist ein einfacher Absatz und wird nicht angesagt. Angesagt wird nur der Seitentitel.
- Im Upload zeigt der Baum die Kategorie-Auswahl nur mit «Kategorie auswählen». Mit der Pfeiltaste liess sich trotzdem eine Kategorie wählen (danach änderte sich der Hilfetext zum Leistungszeitraum auf Heizöl).

## Aufgabe geschafft: teilweise

Alle fünf Schritte habe ich durchgeführt. In Schritt 2 hätte ich als Sven aber nicht erfahren, warum das Erstellen nach dem Leeren des Datums nichts tut (P-1).

## Aufwand

Etwa 40 Minuten, rund 20 Skriptläufe. Upload bis Erstellen: etwa 45 Tastendrücke.

## Ablauf

- Schritt 2, Datum geleert, dann «Erstellen». Erwartet: Fokus ins Datum und die Ansage «Bitte geben Sie ein Datum ein.». Gesehen: Fokus bleibt auf dem Knopf, keine Ansage, keine Meldung am Feld (P-1).
- Schritt 2, Hinweisbox nach dem Leeren. Erwartet: ein Satz, der zum Feld passt. Gesehen: «Füllen Sie die Felder mit einer Fehlermeldung aus.», obwohl kein Feld eine Fehlermeldung hat (P-3).
- Schritt 2, Leistungszeitraum im Upload. Erwartet: «Mehr dazu …» mit Tab erreichbar wie in «Neue Rechnung». Gesehen: wird übersprungen (P-2).
- Schritt 3, vor dem Klick. Erwartet: Die Hinweisbox nennt die zu lange Rechnungsnummer. Gesehen: «unvollständig» ohne Grund (P-4).
- Schritt 3, nach dem Kürzen. Erwartet: Die Datei steht auf «bereit». Gesehen: «Bitte ausfüllen: 1. Bereit zum Erstellen: 1.», und die Datei sagt weiter «Bitte ausfüllen» (P-5).
- Schritt 2 und 4, falsches Datum im Lesemodus. Erwartet: die Meldung einmal. Gesehen: zweimal hintereinander (P-6).

## Vorschläge

- **P-1:** «Rechnungen» → «Rechnungen hochladen» → Gebäude «Alpenblick» → eine PDF wählen → «Angaben eingeben» → Betrag, Rechnungssteller, Beschreibung, Kategorie und Verteilschlüssel ausfüllen, das Datum leer lassen → «0 Rechnungen erstellen (1 unvollständig)» (Fokus und Meldung kommen) → im Datum «30.02.2025» tippen, Tab, Shift+Tab, Ctrl+A, Rücktaste, Tab → mit Tab zu «0 Rechnungen erstellen (1 unvollständig)», Enter. Es passiert nichts. Auch ohne Verlassen des Felds (tippen, gleich löschen) gleich. Hilfreich: Ein leeres Pflichtdatum gilt beim Erstellen immer als Fehler, egal ob vorher getippt wurde. Fokus ins Feld und die Meldung wie beim ersten Mal.
- **P-2:** Upload wie bei P-1 bis «Angaben eingeben» → Tab ab «Kalender für Rechnungsdatum öffnen». «Mehr dazu …» wird übersprungen, auch mit Shift+Tab von «Beginn (optional)». Hilfreich: Die Fokusfalle des Dialogs nimmt auch `summary` in die Tab-Reihenfolge auf.
- **P-3:** Wie P-1 bis zum geleerten Datum, dann die Hinweisbox im Lesemodus lesen. Hilfreich: Den Satz entfernen, sobald kein Feld eine Fehlermeldung hat. Besser noch die Felder nennen, zum Beispiel «Korrigieren Sie: Rechnungsdatum.».
- **P-4:** Upload, alle Pflichtfelder ausgefüllt, Rechnungsnummer mit 54 Zeichen, Hinweisbox lesen. Hilfreich: In der Hinweisbox eine Zeile wie «Rechnungsnummer: höchstens 50 Zeichen.», oder die Fehlermeldung schon beim Verlassen des Felds zeigen.
- **P-5:** Wie P-4, «Erstellen» drücken, die Rechnungsnummer um 10 Zeichen kürzen, Tab. Die Live-Ansage und die Beschreibung der Datei-Knöpfe hören. Hilfreich: Der Status der Datei wechselt auf «Bereit zum Erstellen», und die Zusammenfassung zählt jede Datei nur einmal.
- **P-6:** «Neue Rechnung» oder Upload: im Rechnungsdatum «30.02.2025», Tab, dann den Bereich im Lesemodus lesen. Hilfreich: Die Meldung nur einmal im Baum, also Live-Region und sichtbarer Text im selben Element, oder die Live-Region nur für Screenreader ohne doppelten sichtbaren Text.

## Nicht geprüft

- Einen echten Screenreader (NVDA, VoiceOver) habe ich nicht benutzt. Ich habe den Accessibility-Baum, den Fokus, `aria-describedby` und Live-Regionen über einen MutationObserver ausgewertet. Ob eine Ansage bei `aria-invalid` zusätzlich doppelt kommt, hängt vom Screenreader ab.
- Den Kalender-Knopf habe ich nicht bedient. Er war nicht Teil der Aufgabe.
- Den Upload mit mehreren Dateien habe ich nicht geprüft.
