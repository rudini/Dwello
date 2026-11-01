# Helga – Runde 496b: Alle Daten exportieren (Nachprüfung P-1 bis P-5)

Desktop 1440 × 900, Zoom 150 %, Maus. Demo-Daten, nichts gespeichert, nur heruntergeladen. Skripte und Bildschirmfotos: `/tmp/claude/helga-496b/`, ZIP in `/tmp/claude/helga-496b-dl/`, entpackt in `/tmp/claude/helga-496b-unz/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | ZIP, `tabellen/protokoll.csv` | Die Spalte «Art» zeigt noch einen englischen Code: «data_exported», gleich neben dem deutschen «Eintrag» «Alle Daten exportiert». Daneben folgt «Angaben (JSON)» mit «{}». Damit kann ich nichts anfangen. Alle anderen Tabellen haben jetzt deutsche Wörter (Rest von P-4 aus Runde 496). |
| P-2 | Minor | ZIP, `README.txt` und `tabellen/abrechnungen.csv` | Die README sagt jetzt, welches Vorzeichen die drei Spalten «Bereits bezahlt», «Bezahlter Betrag» und «Offener Betrag» haben, und wie der «Offene Betrag» gerechnet wird. Was «Bereits bezahlt» bedeutet und worin es sich von «Bezahlter Betrag» unterscheidet, steht aber nirgends. In der Tabelle steht dort überall 0.00, auch bei den bezahlten Abrechnungen. Ebenfalls nicht erklärt ist, warum bei den 7 Entwürfen «Bezahlter Betrag» und «Offener Betrag» leer sind und bei der überfälligen Abrechnung «Bezahlter Betrag» leer ist statt 0.00 (Rest von P-5). |
| P-3 | Minor | ZIP, `README.txt`, `dokumente/`, `mietverträge.csv` | Die README verspricht unter `dokumente/` «die PDF der Mietverträge». Im Ordner liegt aber nur ein Übergabeprotokoll, und die Spalte «Mietvertrag im Export» ist bei allen Mietverträgen leer. Für die Belege steht jetzt ein Satz, was gilt, wenn es keine gibt. Für die Mietverträge fehlt ein solcher Satz, und ich weiss wieder nicht, ob etwas fehlt (Rest von P-3). |

## Beobachtungen

- **P-1 aus Runde 496 ist erledigt.** `wohnungen.csv` hat jetzt die Spalte «Mietstatus» mit deutschen Wörtern: 9 × «Vermietet», 4 × «Leer». Ich habe alle 13 Wohnungen mit der Wohnungsliste der App verglichen (Seite 1 und 2), und alle stimmen überein: Leer sind OG2 (Alpenblick), 2.02 und 3.02 (Musterhaus Zentrum) und B1 (Seepark Residenz). Die anderen sind vermietet, B2 auf Seite 2 auch.
- **P-2 aus Runde 496 ist erledigt.** Der Satz zur «Sicherung» ist weg. Die README endet mit «Dwello kann diese Datei nicht wieder einlesen.» Das ist klar. Auf der Einstellungen-Seite steht das Wort «Sicherung» auch nicht mehr.
- **P-3 aus Runde 496 ist zum grössten Teil erledigt.** Zu `belege/` steht jetzt: «Haben Sie keinen Beleg hochgeladen, fehlt der Ordner, und belege.csv hat nur die Kopfzeile.» Das trifft genau zu, und so bin ich beruhigt. Zu den versendeten PDFs steht: Sie liegen unter `dokumente/`, «sofern Dwello es beim Versand oder vor einer Änderung aufbewahrt hat; sonst ist es das aktuelle PDF». Den Satz musste ich zweimal lesen. Dann habe ich verstanden: Für meine 10 versendeten Abrechnungen ist das PDF unter `abrechnungen/` das, was der Mieter bekommen hat. Ob Dwello eines «aufbewahrt hat», sehe ich nur indirekt: In `dokumente.csv` ist die Spalte «Abrechnung» überall leer.
- **P-4 aus Runde 496 ist bis auf das Protokoll erledigt.** `einstellungen.csv` zeigt «Kalenderjahr (Januar – Dezember)» und «Sprache: Deutsch». In `mieter.csv` stehen «Italienisch», «Französisch», «Deutsch» und «Per E-Mail» bzw. «Per Brief», in `dokumente.csv` steht «Hochgeladen». In `kategorien.csv`, `verteilschlüssel.csv` und `heizprofile.csv` ist die erste Spalte «Name» jetzt deutsch («Heizung», «Pro Fläche (m²)», «Heizung + Warmwasser»). Ja/nein steht überall auf Deutsch.
- In `verteilschlüssel.csv` zeigt die Spalte «Formel» Platzhalter wie `{area}`, `{rooms}`, `{units}`. Daneben erklärt die Spalte «Beschreibung» jeden Verteilschlüssel auf Deutsch, deshalb hat es mich nicht gestört.
- In `wohnungen.csv` steht beim Stockwerk 0, 1, 2, 3, in der App «EG», «1. OG». Ich verstehe es, es ist aber anders als in der App.
- Die Zahlen passen zusammen: Bei den bezahlten Abrechnungen 2024 ist «Bezahlter Betrag» gleich dem Saldo, «Offener Betrag» ist 0.00, und in `zahlungen.csv` steht je eine Zahlung mit demselben Betrag. Bei Anna Schmidt sind es −171.70. Dank der README weiss ich jetzt, dass das die Rückerstattung ist, die ich überwiesen habe. Hans Müller, NK-11111111-2025-0001: Saldo 215.80, Offener Betrag 215.80, «Überfällig».
- `protokoll.csv` enthält diesmal einen Eintrag «Alle Daten exportiert» von 15:52. Mein Skript hat den Export aus Versehen zweimal geholt, deshalb stand der erste Export schon in der zweiten Datei.
- Die Telefonnummern haben weiterhin einen Apostroph davor («'+41 79 789 01 23»). Das war nicht Teil der Aufgabe.

## Aufgabe geschafft: ja

Die Kopie habe ich bekommen. Der Wohnungsstatus stimmt mit der App überein. Die README passt bei Sicherung und Belegen und, nach zweimaligem Lesen, auch bei den versendeten PDFs. Fast alle Codes sind jetzt Wörter. Die Zahlungsspalten verstehe ich bis auf «Bereits bezahlt» und die leeren Felder bei Entwürfen.

## Aufwand

Etwa 10 Minuten, rund 8 Schritte: Benutzermenü › Einstellungen › «Alle Daten exportieren» (3 Klicks), Herunterladen, Entpacken, README lesen, die Tabellen durchsehen und die Wohnungsliste in der App (2 Seiten) vergleichen.

## Ablauf

- `protokoll.csv`, Spalte «Art»: Erwartet hatte ich ein deutsches Wort wie in den anderen Tabellen. Gesehen: «data_exported».
- README zu «Bereits bezahlt»: Erwartet hatte ich eine Erklärung, was diese Spalte von «Bezahlter Betrag» unterscheidet. Gesehen: nur der Hinweis zum Vorzeichen, und in der Tabelle überall 0.00.
- `abrechnungen.csv`, Entwürfe: Erwartet hatte ich 0.00 oder einen Hinweis in der README. Gesehen: leere Felder ohne Erklärung.
- README «die PDF der Mietverträge» unter `dokumente/`: Erwartet hatte ich PDFs der Mietverträge oder einen Satz, dass es keine gibt. Gesehen: keine Datei, «Mietvertrag im Export» überall leer, kein Satz dazu.

## Vorschläge

- **P-1:** Einstellungen › «Alle Daten exportieren», ZIP entpacken, `tabellen/protokoll.csv` öffnen: In «Art» steht «data_exported». Hilfreich wäre ein deutsches Wort (oder die Spalte weglassen, «Eintrag» sagt es schon). Zu «Angaben (JSON)» wäre ein Satz in der README hilfreich, dass diese Spalte für andere Programme gedacht ist.
- **P-2:** ZIP entpacken, `tabellen/abrechnungen.csv` öffnen und «Bereits bezahlt», «Bezahlter Betrag» und «Offener Betrag» bei einer bezahlten Abrechnung, bei einem Entwurf und bei der überfälligen Abrechnung vergleichen. Hilfreich wäre je ein Satz in der README: was «Bereits bezahlt» ist (wann dort etwas anderes als 0.00 steht) und dass die Felder bei Entwürfen leer sind, weil diese noch nicht versendet sind. Ebenso, warum «Bezahlter Betrag» bei einer offenen Abrechnung leer ist und nicht 0.00.
- **P-3:** ZIP entpacken, README Abschnitt `dokumente/` lesen, dann `dokumente/` und die Spalte «Mietvertrag im Export» in `mietverträge.csv` ansehen. Hilfreich wäre ein Satz wie bei den Belegen: «Haben Sie zu einem Mietvertrag kein PDF gespeichert, ist die Spalte leer.»

## Nicht geprüft

- Öffnen in einem echten Excel: Hier gibt es kein Excel. Ich habe die Tabellen mit «;» als Trennzeichen und UTF-8 mit BOM eingelesen.
- Abrechnungen mit aufbewahrtem versendetem PDF, Belege mit Datei und Mietverträge mit PDF: Die Demo-Daten haben keine, und ich durfte nichts speichern. Ob sie dann unter `dokumente/` bzw. `belege/` liegen, konnte ich deshalb nicht sehen.
- `daten.json`: nicht angesehen, war nicht Teil der Aufgabe.
