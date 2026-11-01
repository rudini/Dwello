# Helga – Runde 496: Alle Daten exportieren

Desktop 1440 × 900, Zoom 150 %, Maus. Demo-Daten, nichts gespeichert, nur heruntergeladen. Skripte und Bildschirmfotos: `/tmp/claude/helga-496/`, ZIP in `/tmp/claude/helga-496-dl/`, entpackt in `/tmp/claude/helga-496-unz/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | ZIP, `tabellen/wohnungen.csv` | In der Spalte «Status» steht bei allen 13 Wohnungen «vacant». In Dwello sind 9 davon «Vermietet» (Übersicht und Wohnungsliste). Der Wert ist also falsch und dazu englisch. Meine Treuhänderin würde meinen, alle Wohnungen stünden leer. |
| P-2 | Minor | ZIP, `README.txt` | Die README schreibt: «Zum Wiederherstellen dient die Sicherung unter «Einstellungen» › «Sicherung»». Auf der Seite Einstellungen gibt es aber keinen Abschnitt «Sicherung», und auf der Hilfe-Seite steht nichts dazu. Ich weiss nicht, ob ich eine Sicherung habe. |
| P-3 | Minor | ZIP, `README.txt`, `belege/`, `dokumente/` | Die README nennt einen Ordner `belege/` mit meinen Belegen, aber in der ZIP-Datei gibt es keinen solchen Ordner, und `belege.csv` hat nur die Kopfzeile. Weiter steht, das PDF, das der Mieter erhalten hat, liege unter `dokumente/`. Dort ist aber nur ein Übergabeprotokoll, obwohl 10 Abrechnungen versendet wurden. Nirgends steht «keine Belege hochgeladen». Ich kann nicht erkennen, ob etwas fehlt oder ob es nie etwas gab. |
| P-4 | Minor | ZIP, mehrere Tabellen | In den Tabellen stehen Fachwerte auf Englisch oder als Kürzel: `einstellungen.csv` «Abrechnungsperiode: calendar», `mieter.csv` «Sprache: it», «Korrespondenzkanal: email», `dokumente.csv` «Art: upload». In `kategorien.csv`, `verteilschlüssel.csv` und `heizprofile.csv` steht in der ersten Spalte «Name» der englische Name («Heating»), daneben folgt «Name de». |
| P-5 | Minor | ZIP, `tabellen/abrechnungen.csv` | Es gibt drei ähnliche Spalten: «Bereits bezahlt» (überall 0.00), «Bezahlter Betrag» und «Offener Betrag». Die README erklärt nur «Offener Betrag». Bei einer Rückerstattung steht unter «Bezahlter Betrag» ein Minusbetrag (−171.70). Bei Entwürfen ist «Offener Betrag» leer, ohne Erklärung. Hier kann man sich leicht verlesen. |

## Beobachtungen

- Ich habe den Export schnell gefunden: Benutzermenü «Vera Verwalter» › «Einstellungen», dann ein eigener Kasten «Alle Daten exportieren» mit einem gut verständlichen Text. Der Text sagt, was drin ist (Belege, Dokumente, Abrechnungen, Protokoll), was fehlt (Gelöschtes) und wie ich die Datei aufbewahre: «sicher aufbewahren und löschen, wenn Sie sie nicht mehr brauchen». Das habe ich verstanden. *Wie* «sicher» geht (z. B. mit Passwort oder auf einem USB-Stick im Schrank), steht nirgends.
- Nach dem Klick bleibt die Seite gleich, der Knopf ist nur hell hinterlegt (Bild `06-after-click.png`). Die Datei «Dwello-Daten-2026-11-01.zip» (ca. 740 KB) kam nach 0,2 Sekunden. Im echten Browser zeigt vermutlich die Download-Leiste etwas an; die App selbst bestätigt nichts.
- Die README ist auf Deutsch, klar gegliedert und erklärt Strichpunkte, Beträge mit Punkt, Datum als Jahr-Monat-Tag und das Vorzeichen des Saldos. Der Satz «Dwello kann diese Datei nicht wieder einlesen» ist ehrlich und wichtig.
- Was ein Mieter noch schuldet, lässt sich nachvollziehen: Hans Müller, NK-11111111-2025-0001, Saldo 215.80, Offener Betrag 215.80, Status «Überfällig», Zahlungsfrist 2026-10-28. Das passt zu «Überfällige Beträge CHF 215.80» auf der Übersicht. Die bezahlten Abrechnungen 2024 haben Offener Betrag 0.00, und in `zahlungen.csv` steht je eine Zahlung vom 2025-05-05.
- Meine Abrechnungen finde ich wieder: alle 17 Abrechnungen als PDF unter `abrechnungen/`, mit der Abrechnungsnummer als Dateiname, und in der Tabelle die Spalte «PDF im Export». Das PDF von Hans Müller 2025 lässt sich lesen.
- In `abrechnungspositionen.csv` ist die «Beschreibung» englisch («Snow Removal», «TV/Cable»), die «Kategorie» deutsch. Vermutlich kommt das aus den Demo-Daten.
- Bei den Telefonnummern in `mieter.csv` steht ein Apostroph davor («'+41 79 789 01 23»). Vermutlich zeigt Excel diesen Apostroph beim Öffnen der CSV-Datei mit an.
- Die Spalten «Erfasst am» und «Geändert am» zeigen bei allen Daten 2026-11-01 15:24 (Demo-Daten frisch angelegt).
- Viele Spalten mit langen IDs (`a0000001-0001-…`) machen die Tabellen für mich unübersichtlich. Die README erklärt sie aber.
- `protokoll.csv` in der ZIP-Datei ist leer. Den eigenen Export enthält sie nicht, weil er erst danach festgehalten wird. Das ist logisch, man muss aber erst darauf kommen.
- Festgehalten: Unter Einstellungen › Protokoll steht «01.11.2026, 15:26 – Alle Daten exportiert», und der Einleitungstext sagt «Auch jeder Export aller Daten steht hier». Der Eintrag hat einen Knopf «Löschen», ich könnte den Nachweis also selbst entfernen. Ich habe ihn nicht gedrückt.
- Auf der Einstellungen-Seite bei 150 % ist die Kachel «Protokoll» sehr schmal, der Text bricht fast Wort für Wort um (`05-export-section.png`, oben).

## Aufgabe geschafft: teilweise

Gefunden, heruntergeladen und gelesen habe ich alles. Was ein Mieter schuldet, habe ich verstanden. Die Belege und die versendeten PDFs finde ich nicht wieder (P-3), die Sicherung, auf die die README verweist, finde ich nicht (P-2), und der Wohnungsstatus in der Tabelle ist falsch (P-1).

## Aufwand

Etwa 15 Minuten, rund 10 Schritte: Übersicht › Benutzermenü › Einstellungen › Export (3 Klicks), dann Herunterladen, Entpacken, README und 18 Tabellen durchsehen, danach Protokoll, Wohnungsliste, Abrechnung und Hilfe in der App gegengeprüft.

## Ablauf

- README und Ordner `belege/`: Erwartet hatte ich einen Ordner mit Belegen, wie die README ihn ankündigt. Gesehen: Es gibt keinen Ordner, und `belege.csv` ist leer.
- README und Ordner `dokumente/`: Erwartet hatte ich die versendeten PDFs der Abrechnungen. Gesehen: nur «2023-06-30 Übergabeprotokoll Wohnung B2.pdf».
- `wohnungen.csv`: Erwartet hatte ich «Vermietet» bzw. «Leer» wie in der App. Gesehen: 13 Mal «vacant».
- README «Einstellungen › Sicherung»: Erwartet hatte ich einen Abschnitt «Sicherung» auf der Einstellungen-Seite. Gesehen: Er fehlt, und die Seite enthält das Wort «Sicherung» nicht.
- `abrechnungen.csv`, «Bereits bezahlt»: Erwartet hatte ich bei bezahlten Abrechnungen den bezahlten Betrag. Gesehen: 0.00, der Betrag steht in «Bezahlter Betrag».

## Vorschläge

- **P-1:** Einstellungen › Alle Daten exportieren, ZIP entpacken, `tabellen/wohnungen.csv` öffnen: Die Spalte «Status» zeigt überall «vacant», die Wohnungsliste aber 9 × «Vermietet». Hilfreich wäre, wenn der Status derselbe ist wie in der App und mit demselben deutschen Wort steht («Vermietet», «Leer», «Vermietet ab …», «Gesperrt»).
- **P-2:** ZIP entpacken, `README.txt` letzter Absatz, dann in Dwello Einstellungen öffnen: Es gibt keinen Abschnitt «Sicherung». Hilfreich wäre, auf einen Ort zu verweisen, den es gibt. Wenn es keine Sicherung gibt, sollte der Satz klar sagen, wie ich meine Daten wiederherstellen kann (oder dass das nicht geht).
- **P-3:** ZIP entpacken: Den Ordner `belege/` gibt es nicht, `belege.csv` ist leer, und unter `dokumente/` fehlen die versendeten PDFs. Hilfreich wäre ein Satz in der README, wenn es keine gibt («Sie haben keine Belege hochgeladen» / «Zu diesen Abrechnungen ist kein versendetes PDF gespeichert»), oder ein leerer Ordner mit einem kurzen Hinweis.
- **P-4:** `einstellungen.csv`, `mieter.csv`, `dokumente.csv`, `kategorien.csv` öffnen: Hilfreich wären deutsche Wörter wie in der App («Kalenderjahr», «Italienisch», «E-Mail», «Hochgeladen») und als erste Namensspalte die Sprache der Benutzerin, ohne den englischen Namen vorne.
- **P-5:** `abrechnungen.csv` öffnen und die Spalten «Bereits bezahlt», «Bezahlter Betrag» und «Offener Betrag» vergleichen: Hilfreich wäre ein Satz in der README zu jeder dieser Spalten, auch dazu, warum «Offener Betrag» bei Entwürfen leer ist und was ein Minusbetrag unter «Bezahlter Betrag» bedeutet (die Rückerstattung, die ich überwiesen habe).

## Nicht geprüft

- Das Öffnen in einem echten Excel: Hier gibt es kein Excel. Ich habe die Tabellen mit «;» als Trennzeichen und UTF-8 mit BOM eingelesen, so wie Excel sie liest. Ob Excel den Apostroph vor den Telefonnummern anzeigt, konnte ich nicht sehen.
- Die Anzeige des Downloads im Browser: Im Browser ohne Fenster gibt es keine Download-Leiste.
- `daten.json`: Nur die obersten Schlüssel angeschaut, ob sie für ein anderes Programm taugt, kann ich nicht beurteilen.
- Belege mit hochgeladener Datei: Die Demo-Daten haben offenbar keine. Ich habe nichts hochgeladen, weil ich nichts speichern durfte.
- Den Protokolleintrag löschen: Ich habe ihn bewusst nicht gelöscht, um keine gemeinsamen Daten zu verändern.
