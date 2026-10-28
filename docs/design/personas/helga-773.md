# Helga – Slice 773: Rechnungen hochladen, wenn die KI nicht verfügbar ist

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (zusätzlich 200 %), Maus.
Zustand: Jede Anfrage an `/api/invoices/extract` antwortet im Browser mit 503 `{"error":"KI nicht verfügbar","code":"EXTRACTION_UNAVAILABLE","params":{}}`. Alle anderen schreibenden Anfragen waren im Browser gesperrt; gespeichert wurde nichts (es ging auch keine schreibende Anfrage ab).
Datei: selbst erstellte einseitige `Hauswartung.pdf` («Hauswartung Meier – Rechnung Nr. 2026-14, Seepark Residenz, Hauswartung September 2026, Betrag CHF 480.00, zahlbar bis 30.11.2026»).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Dialog «Rechnungen hochladen», Statuszeile | Die Statuszeile sagt «Gelesen: 1 von 1. Bitte ausfüllen: 1.», direkt darunter steht «Die KI hat diese Datei nicht gelesen. Füllen Sie die Felder aus.» Das widerspricht sich. Bei 150 % sehe ich nach der Dateiwahl ohne Scrollen nur die Statuszeile, und «Gelesen: 1 von 1» klingt so, als sei das Lesen gelungen und erledigt. |
| P-2 | Minor | Dialog, Hinweise zur Datei | «Die KI hat diese Datei nicht gelesen» sagt nicht, warum. Ich weiss nicht, ob meine Datei kaputt ist (falsch eingescannt?), ob ich es später noch einmal versuchen soll oder ob das so gehört. Dass die KI im Moment nicht verfügbar ist, steht nirgends. Oben im Feld steht weiterhin «Ausgewählte Dateien liest die KI sofort aus.» |
| P-3 | Minor | Dialog, Schaltfläche unten | «0 Rechnungen erstellen (1 unvollständig)»: Die «0» hat mich verwirrt. Ich habe doch eine Rechnung. Die Schaltfläche sieht aus wie eine Hauptschaltfläche, die man drücken kann. Beim Klick passiert nichts Sichtbares ausser dass das Fenster zum Feld «Kategorie» springt und dieses rot markiert (das hilft dann aber). |
| P-4 | Minor | Dialog, Dateizeile | Das Häkchen «Diese Rechnung erstellen» ist schon gesetzt. Zusammen mit «Gelesen: 1 von 1» dachte ich zuerst, die Rechnung sei schon so gut wie erledigt. Erst das gelbe Schild «Bitte ausfüllen» hat mir gezeigt, dass noch etwas fehlt. |

## Beobachtungen

- Die beiden Einleitungstexte oben im Dialog sind gut verständlich, besonders «Dateien, aus denen Sie keine Rechnung erstellen, speichert Dwello nicht». Dadurch wusste ich: Hochgeladen heisst noch nicht gespeichert.
- Das gelbe Feld «Hinweise zu Hauswartung.pdf» zählt sauber auf, was fehlt (Kategorie, Verteilung, Rechnungsdatum, Betrag, Rechnungssteller, Beschreibung). Je mehr ich ausfülle, desto kürzer wird die Liste; am Schluss stand nur noch «Wählen Sie eine Kategorie.» Das ist hilfreich. Dabei verschwindet aber auch der Satz, dass die KI die Datei nicht gelesen hat.
- Die Statuszeile «Gelesen: 1 von 1. Bitte ausfüllen: 1.» bleibt auch nach dem Ausfüllen gleich, obwohl dann nur noch die Kategorie fehlte.
- Nach dem Auswählen der Datei ist das Feld «Gebäude» gesperrt, mit dem Hinweis «Das Gebäude gilt für alle Dateien. Entfernen Sie die Dateien, um ein anderes zu wählen.» Das ist klar.
- Die Vorschau der PDF neben den Feldern ist sehr praktisch: Ich konnte Betrag und Datum direkt abschreiben. Bei 150 % ist der Text der Vorschau aber sehr klein; «Datei gross anzeigen (öffnet in neuem Tab)» gibt es.
- Die Hilfe beim «Leistungszeitraum» ist sehr lang (Boiler, 5 Jahre, VMWG). Für eine Hauswart-Rechnung hat mich das eher erschlagen.
- Direkt nach dem Klick auf «Angaben eingeben» enthielt die Auswahl «Kategorie» im Bedienungsbaum nur «Kategorie auswählen»; kurz danach waren alle 21 Kategorien da (auch «Hauswart»). Für mich mit der Maus fiel das nicht auf.
- Bei 200 % rutscht «Datei entfernen» in eine eigene Zeile; alles bleibt bedienbar, nichts muss seitwärts gescrollt werden.
- Auf der Übersicht ist das Menü bei 150 % hinter «Menü öffnen» versteckt; «Rechnungen hochladen» gibt es aber auch direkt unter «Häufige Arbeiten».

## Aufgabe geschafft: ja

Ich habe den Dialog geöffnet, Gebäude und Datei gewählt, die Meldungen gelesen, die Angaben geöffnet und die Felder angeschaut (und probeweise ausgefüllt). Erstellt habe ich die Rechnung nicht, wie verlangt.

## Aufwand

Etwa 15 Minuten, 12 Schritte (Rechnungen öffnen, Hochladen öffnen, Gebäude wählen, Datei wählen, zur Datei scrollen, Hinweise lesen, Angaben öffnen, Felder durchsehen, vier Felder und Verteilschlüssel ausfüllen, Erstellen-Schaltfläche probieren).

## Ablauf

1. Datei gewählt. Erwartet: eine Meldung, dass die KI nicht lesen konnte und ich selbst ausfüllen muss. Gesehen (ohne Scrollen bei 150 %): nur «Gelesen: 1 von 1. Bitte ausfüllen: 1.» Ich dachte: Gelesen ist erledigt, nur noch etwas ergänzen.
2. Nach unten gescrollt. Erwartet: die gelesenen Angaben. Gesehen: «Die KI hat diese Datei nicht gelesen. Füllen Sie die Felder aus.» Widerspruch zur Zeile darüber; ich war unsicher, was nun stimmt und ob meine Datei in Ordnung ist.
3. Schaltfläche unten. Erwartet: «1 Rechnung erstellen» oder eine gesperrte Schaltfläche. Gesehen: «0 Rechnungen erstellen (1 unvollständig)», anklickbar.
4. Nach dem Ausfüllen auf die Schaltfläche geklickt (Schreibanfragen gesperrt). Erwartet: eine Meldung oben. Gesehen: Der Dialog sprang zum Feld «Kategorie», rote Meldung «Wählen Sie eine Kategorie.» Es ging keine Anfrage ab.

## Vorschläge

- **P-1:** Rechnungen > Rechnungen hochladen > Seepark Residenz > Hauswartung.pdf, mit `/api/invoices/extract` = 503. Die Statuszeile zeigt «Gelesen: 1 von 1». Hilfreich wäre eine Statuszeile, die zum Ergebnis passt, z. B. «Bearbeitet: 1 von 1. Nicht gelesen, bitte selbst ausfüllen: 1.», oder «Gelesen» nur für Dateien zählen, die die KI wirklich gelesen hat.
- **P-2:** Gleiche Schritte. Im Hinweis sagen, warum: «Die KI ist im Moment nicht erreichbar. Füllen Sie die Felder selbst aus, oder entfernen Sie die Datei und versuchen Sie es später noch einmal.» So weiss ich, dass meine Datei nicht schuld ist.
- **P-3:** Gleiche Schritte, nach unten scrollen. Die Schaltfläche könnte sagen, was zu tun ist, z. B. «1 Rechnung erstellen» mit dem Hinweis darüber «Bei 1 Rechnung fehlen noch Angaben», statt mit «0» zu beginnen.
- **P-4:** Gleiche Schritte. Solange Angaben fehlen, die Dateizeile deutlicher als «noch nicht bereit» zeigen (z. B. Text neben dem Häkchen «wird erstellt, sobald alles ausgefüllt ist»), damit das gesetzte Häkchen nicht wie «erledigt» wirkt.

## Nicht geprüft

- Das tatsächliche Erstellen der Rechnung: laut Auftrag nicht gewollt; alle Schreibanfragen ausser dem Auslesen waren gesperrt, und auch ohne Sperre hätte die fehlende Kategorie das Erstellen verhindert.
- Mehrere Dateien gleichzeitig und Ziehen-und-Ablegen: nicht Teil des Auftrags.
- Der Fall, dass die KI wieder verfügbar ist (erneutes Auslesen): Ich habe keinen Knopf «erneut versuchen» gefunden; ob das Entfernen und erneute Wählen der Datei hilft, habe ich nicht ausprobiert.
- Mobile Ansicht und Dunkelmodus: nicht Helgas Gerät.
