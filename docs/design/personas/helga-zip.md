# Helga – Alle Abrechnungen als ZIP herunterladen (Runde «zip»)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus. Persona-App auf http://localhost:3300 mit den Demodaten.
Aufgabe: «Sie haben die Nebenkostenabrechnungen für ein Jahr erstellt und möchten alle auf einmal ausdrucken.» Gespeichert habe ich nur im Gebäude Alpenblick, Abrechnungsperiode 01.01.2025 – 31.12.2025 (das einzige Gebäude ohne Abrechnungen in dieser Periode). Skripte und Bildschirmfotos liegen in `<scratchpad>/helga-zip/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnungen erstellen, Schritt 5 (Ergebnis) | «Alle als ZIP herunterladen»: Das Wort «ZIP» wird nirgends erklärt. Ich weiss nicht, dass ich eine einzige Datei bekomme, in der alle PDFs stecken, und dass ich sie erst öffnen (entpacken) muss, bevor ich drucken kann. Kein Hilfetext beim Knopf. |
| P-2 | Minor | Heruntergeladene ZIP-Datei | Die PDFs in der ZIP-Datei heissen nur `NK-33333333-2025-0001.pdf` und `NK-33333333-2025-0002.pdf`. Am Namen sehe ich nicht, welche Abrechnung zu welchem Mieter oder welcher Wohnung gehört; ich muss jede Datei öffnen. Bei zwei geht das, bei zehn nicht mehr. |
| P-3 | Nit | Heruntergeladene ZIP-Datei | Die ZIP-Datei heisst `NK-2025-01-01-2025-12-31.zip`. Im Download-Ordner erkenne ich nicht, dass es um Alpenblick geht und dass es Nebenkostenabrechnungen sind («NK» kenne ich nur aus Dwello). Ein zweiter Download für ein anderes Gebäude in derselben Periode bekäme den gleichen Namen. |

## Beobachtungen

- Den Knopf «Alle als ZIP herunterladen» gibt es nur auf dem Ergebnis-Bildschirm des Assistenten. In der Liste «Nebenkostenabrechnungen» (auch gefiltert auf meine zwei Entwürfe) gibt es ihn nicht, dort hat jede Zeile nur ihr eigenes «PDF». Wer den Ergebnis-Bildschirm verlässt, bevor er heruntergeladen hat, kommt nicht mehr an «alle auf einmal».
- Die PDFs in der ZIP-Datei sind Entwürfe, sind auf dem Papier aber nicht als Entwurf gekennzeichnet. Der Ergebnis-Bildschirm sagt «Prüfen Sie die Entwürfe und versenden Sie sie dann», der ZIP-Knopf steht aber gleich daneben. Ich könnte die Entwürfe ausdrucken und verschicken, ohne sie geprüft zu haben, und sie stünden in Dwello weiter auf «Entwurf».
- Im Inneren sind die PDFs gut zu unterscheiden: Oben rechts stehen Name und Adresse des Mieters (Laura Keller bzw. Kevin Fischer), links «Liegenschaft Alpenblick, Wohnung EG» bzw. «Wohnung OG1», dazu die Abrechnungsnummer in der Kopfzeile. Die Abrechnungsnummer im Dateinamen ist dieselbe wie in der Liste und im PDF, ich kann also über die Liste nachschauen.
- Beim Einzel-PDF in der Liste heisst die Datei gleich wie in der ZIP-Datei (`NK-33333333-2025-0001.pdf`): das ist wenigstens einheitlich.
- Der Assistent merkt sich, wo ich war («Entwurf gespeichert, 01:15»): Beim zweiten Öffnen über die Übersicht stand er zuerst wieder auf Schritt 1, ein Klick auf «Weiter» brachte mich zu Schritt 2, das Gebäude war aber nicht mehr gewählt.
- Im ganzseitigen Bildschirmfoto des Ergebnis-Bildschirms liegt die Kopfleiste (Dwello, Deutsch, Vera Verwalter) mitten im Bild über der Fortschrittsanzeige. Das ist vermutlich nur ein Effekt der Aufnahme mit fester Kopfleiste, nicht was man beim Scrollen sieht.
- Die Übersicht hat mir gut geholfen: «Noch nicht abgerechnet: Alpenblick» sagte mir, welches Gebäude dran ist.

## Aufgabe geschafft: ja

Die Abrechnungen sind erstellt, die ZIP-Datei ist heruntergeladen und geöffnet. Einschränkung: Den Knopf habe ich nicht im selben Fenster angeklickt, sondern seine Adresse geöffnet (siehe «Nicht geprüft»).

## Aufwand

Etwa 15 Minuten, rund 12 Schritte: Übersicht → «Abrechnungen erstellen» → Periode (übernommen) → Gebäude Alpenblick wählen → Heizprofil und Verwaltungspauschale (übernommen) → Vorschau, Hinweis auf fehlende Rechnungen bestätigen → «Entwürfe erstellen» → «Alle als ZIP herunterladen» → ZIP öffnen → beide PDFs ansehen.

## Ablauf

1. **Übersicht.** Erwartet: ein Hinweis, was zu tun ist. Gesehen: «Nebenkostenabrechnungen erstellen … Noch nicht abgerechnet: Alpenblick» mit dem Knopf «Abrechnungen erstellen». Gut.
2. **Schritt 1, Abrechnungsperiode.** Erwartet: das letzte Jahr vorgeschlagen. Gesehen: 01.01.2025 bis 31.12.2025, ausgeschrieben als «Mittwoch, 1. Januar 2025». Gut lesbar.
3. **Schritt 2, Gebäude.** Erwartet: eine Liste zum Ankreuzen. Gesehen: Alpenblick (6 Rechnungen, 3 Wohnungen); bei Seepark Residenz und Musterhaus Zentrum der Satz, dass alle Mietverträge schon eine Abrechnung haben und ich sie nicht wählen muss. Ich habe Alpenblick gewählt.
4. **Schritt 3, Heizprofil und Verwaltungspauschale.** Erwartet: etwas, das ich übernehmen kann. Gesehen: ein sehr langer Hilfetext zum Heizprofil (Zählerstände, Heizkostenverteiler), vier Profile, Verwaltungspauschale 3 %, Hinweis «Kevin Fischer, Wohnung OG1» ohne Pauschale. Ich habe alles übernommen; den langen Text habe ich nicht ganz verstanden, er gehört aber nicht zu dieser Runde.
5. **Schritt 4, Vorschau.** Gesehen: 2 Abrechnungen, Kosten CHF 4’946.67, Laura Keller Rückerstattung CHF 149.15, Kevin Fischer Rückerstattung CHF 184.15; Warnung «Möglicherweise fehlen Rechnungen» (Kaminfeger, Kaltwasser 2. Halbjahr). Ich habe «Die Abrechnungen trotzdem erstellen» angekreuzt.
6. **Schritt 5, Erstellen.** Gesehen: «Es werden 2 Nebenkostenabrechnungen als Entwurf erstellt. Es wird nichts verschickt.» Knopf «Entwürfe erstellen». Geklickt.
7. **Ergebnis.** Erwartet: eine Bestätigung und ein Weg zum Ausdrucken. Gesehen (Bild `08-ergebnis.png`): Symbol mit Häkchen, «2 Nebenkostenabrechnungen sind als Entwurf erstellt. Prüfen Sie die Entwürfe und versenden Sie sie dann.» Darunter drei Knöpfe: «Entwürfe ansehen» (dunkel, Hauptknopf), «Alle als ZIP herunterladen» (umrandet, mit Datei-Symbol) und «Weitere Abrechnungen erstellen». Ich hätte «Alle ausdrucken» oder «Alle PDFs herunterladen» gesucht; «Alle als ZIP herunterladen» habe ich nur gefunden, weil es der einzige Knopf mit «Alle» ist. Was ZIP ist, steht nirgends.
8. **Herunterladen.** Erwartet: eine Datei zum Drucken. Gesehen: Die Datei `NK-2025-01-01-2025-12-31.zip` (knapp 10 KB) kam sofort, ohne Fehlermeldung. Die Seite blieb, wie sie war; eine Bestätigung «heruntergeladen» gibt es nicht (das macht der Browser).
9. **ZIP öffnen.** Gesehen: zwei Dateien, `NK-33333333-2025-0001.pdf` und `NK-33333333-2025-0002.pdf`, je zwei Seiten. Welche wem gehört, sehe ich erst nach dem Öffnen.
10. **PDFs ansehen.** 0001 ist Laura Keller, Wohnung EG, Rückerstattung CHF 149.15; 0002 ist Kevin Fischer, Wohnung OG1, Rückerstattung CHF 184.15. Die Beträge stimmen mit der Vorschau überein. Mieter, Wohnung und Liegenschaft stehen gross oben, das Papier ist klar.

## Verwirrung

- **«ZIP»**: Fachwort aus der Computerwelt. Ich weiss nicht, ob mein Computer das öffnen kann und dass ich die Datei zuerst entpacken muss. Ich hatte erwartet, dass ich «alle PDFs» bekomme, nicht eine Datei in einem anderen Format.
- **Dateinamen «NK-33333333-2025-0001»**: Die lange Zahl 33333333 sagt mir nichts; ich hätte den Namen des Mieters oder die Wohnung erwartet.
- **Entwurf und Drucken**: Der Bildschirm sagt «prüfen und versenden», bietet mir aber gleichzeitig an, alle herunterzuladen. Ich war unsicher, ob ich die Entwürfe schon drucken darf.

## Fehlerrisiken

- Entwürfe werden ausgedruckt und verschickt, ohne dass sie geprüft oder in Dwello als versendet markiert sind; auf dem Papier steht nicht «Entwurf».
- Beim Zuordnen der ausgedruckten Blätter in Kuverts: Wer nach Dateinamen druckt, weiss nicht, welches Blatt zu wem gehört, bis er es liest.
- Wer den Ergebnis-Bildschirm schliesst, findet den Knopf nicht mehr und lädt jedes PDF einzeln herunter.
- Zwei Downloads verschiedener Gebäude in derselben Periode bekommen denselben ZIP-Namen und können sich im Download-Ordner verwechseln oder überschreiben (Browser hängt dann «(1)» an).

## Vorschläge

- **P-1** – Reproduktion: Übersicht → «Abrechnungen erstellen» → Periode 2025, Gebäude Alpenblick → Vorschau bestätigen → «Entwürfe erstellen» → Ergebnis-Bildschirm. Hilfe: Einen kurzen sichtbaren Text unter dem Knopf, z. B. «Sie erhalten eine Datei mit allen PDFs dieser Abrechnungen. Öffnen Sie sie mit Doppelklick, dann sehen Sie die einzelnen PDFs.» Oder den Knopf «Alle PDFs herunterladen (ZIP-Datei)» nennen.
- **P-2** – Reproduktion: wie P-1, dann «Alle als ZIP herunterladen» und die Datei öffnen. Hilfe: Mieter und Wohnung in den Dateinamen der PDFs aufnehmen, z. B. `Alpenblick EG Laura Keller NK-…-0001.pdf`, damit die Reihenfolge und Zuordnung ohne Öffnen klar ist.
- **P-3** – Reproduktion: wie P-2, Name der ZIP-Datei im Download-Ordner ansehen. Hilfe: Gebäude und Jahr im Namen, z. B. `Nebenkostenabrechnungen Alpenblick 2025.zip`.

## Nicht geprüft

- **Klick auf den echten Knopf im selben Fenster:** Nach dem Erstellen habe ich das Browserfenster geschlossen, bevor ich den Download auslöste. Der Ergebnis-Bildschirm lässt sich danach nicht mehr erreichen (Alpenblick 2025 hat jetzt Abrechnungen, und ich habe meine Entwürfe nicht gelöscht). Ich habe daher die Adresse des Knopfes (`/statements/zip?ids=…&periodStart=2025-01-01&periodEnd=2025-12-31`, abgelesen vom Ergebnis-Bildschirm) direkt geöffnet; das löste den Download sofort aus. Ob der Klick auf den Knopf im laufenden Fenster ebenso einen Download auslöst (und nicht etwa eine leere Seite zeigt), ist nicht bestätigt.
- **200 % Zoom und Bildschirmleser** auf dem Ergebnis-Bildschirm: aus demselben Grund nicht mehr erreichbar.
- **Ausdrucken selbst**: In der Testumgebung gibt es keinen Drucker; ich habe die PDFs nur angesehen.
- **Fehlerfall** (Download schlägt fehl): nicht verlangt, nicht geprüft.
- **Andere Sprachen**: nicht geprüft.
