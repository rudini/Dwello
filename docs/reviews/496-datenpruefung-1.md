# Datenprüfung #496 «Alle Daten exportieren», Runde 1

Gegenstand: Worktree `/tmp/scratchpad/review-496b-daten-pruefer` @ 2300f51 (das laufende Backend und Frontend laufen aus `/home/user/Dwello` @ 2300f51, ohne Unterschied zu 2300f51 in `data-export.service.ts` und `config/export/+server.ts`). Datenbank `dwello_persona`, Stichtag 2026-11-01.

Vorgehen:
- Die ZIPs habe ich mit demselben Formular-POST wie der Knopf geholt (`curl -X POST http://localhost:3300/config/export`, Cookie `dwello_session` mit dem Persona-Schlüssel, Cookie `PARAGLIDE_LOCALE` für fr/it/en). Playwright steht im Worktree nicht zur Verfügung; der Klick auf den Knopf selbst ist nicht geprüft.
- Eigene Nachrechnung: `/tmp/scratchpad/dp496/scripts/recompute.py`. Sie liest Rechnungen, Verteilschlüssel, Heizprofile, Tankbestände, Mietverträge, Akonto und Wohnungen aus der Datenbank und rechnet jede Abrechnung neu (Mietstage, Zeitanteil, Heizprofil je Rechnung, Tankbestand, Verwaltungspauschale, Akonto, Saldo auf 5 Rappen). Aus der Abrechnung selbst habe ich nur das gewählte Heizprofil und die Zahlungsfrist übernommen; Satz der Verwaltungspauschale und vereinbarte Kategorien stimmen mit den Mietverträgen und den Einstellungen überein.
- Weitere Skripte im selben Ordner: `compare_stm.py`, `compare_tables.py`, `compare_json.py`, `compare_langs.py`, `files.py`, `qr.py`, `qrcheck.py`, `pdfcheck.py`.
- Ich habe nichts in der App geändert. Meine Aufrufe haben fünf Protokolleinträge «Alle Daten exportiert» geschrieben (je ein Export in de, fr, it, en und der Test mit fremdem Origin, siehe «Nicht bestätigt»).

## Befunde

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| D-1 | Minor | `tabellen/abrechnungen.csv`, Spalte «QR-Referenz» (alle 17 Abrechnungen; fr/it/en gleich) | Die 27-stellige QR-Referenz bleibt nach dem Öffnen in einem Tabellenprogramm lesbar, z. B. `008866337289808172952258962`. Die README empfiehlt Excel. | Die Spalte ist unquotierter Ziffertext. Ein Tabellenprogramm macht daraus eine Zahl: führende Nullen und Ziffern gehen verloren (`8.86633728980817E+024`). Wer speichert, hat die Referenz zerstört. Die Referenz braucht, wer Zahlungseingänge zuordnet. |
| D-2 | Minor | `tabellen/mieter.csv`, Spalte «Telefon» (alle 10 Mieter; fr/it/en gleich) | `+41 79 123 45 67`, wie in der Datenbank und in `daten.json` | `'+41 79 123 45 67`: Vor jeder Schweizer Nummer steht ein `'`. Die Regel gegen Formeln (Fachreview 496-1 V-2) gilt für Texte Dritter; die Telefonnummer gibt der Vermieter selbst ein. Die README sagt nichts über das `'`. Wer die Nummer kopiert, nimmt es mit. |

### D-1: Beleg und Reproduktion

```
$ python3 -I -c "..."   # liest zip-de/tabellen/abrechnungen.csv
['008866337289808172952258962', '010298056799684593545097572']   # 27 Ziffern, wie in utility_statements.qr_bill_reference

$ soffice --headless --infilter='Text - txt - csv (StarCalc):59,34,76,1' \
    --convert-to 'csv:Text - txt - csv (StarCalc):59,34,76,1' --outdir lo-out lo-in/abrechnungen.csv
QR-Referenz nach dem Öffnen und Speichern:
['8.86633728980817E+024', '1.02980567996846E+025', '1.80190306930954E+024']
```

- Ich habe LibreOffice Calc statt Excel verwendet (Excel steht nicht zur Verfügung). Excel macht aus einer langen Ziffernfolge in einer CSV dasselbe.
- Alle anderen Spalten verlieren beim selben Durchlauf höchstens Nachkommanullen (`2880.00` wird `2880`), keinen Wert. Ich habe alle 18 Tabellen so durchgespielt (`/tmp/scratchpad/dp496/lo-out`, Vergleich `/tmp/scratchpad/dp496/lo-in`).
- `daten.json` und die Datenbank halten die Referenz richtig.
- Lösung zur Wahl des Entwicklers: die Referenz wie die Telefonnummer als Text kennzeichnen, oder einen Satz in der README.

### D-2: Beleg und Reproduktion

```
$ psql postgresql://dwello:dwello@localhost:5432/dwello_persona -Atc "select phone from tenants limit 3"
+41 79 123 45 67 ...
$ # zip-de/tabellen/mieter.csv, Spalte Telefon:
["'+41 79 789 01 23", "'+41 79 012 34 56", ... alle 10 mit '+41 ...]
```

- Ursache: `field()` in `src/routes/config/export/+server.ts` stellt jedem Text, der mit `=`, `+`, `-`, `@` oder einem Steuerzeichen beginnt und keine Zahl ist, ein `'` voran. `+41 …` passt dazu.

## Was übereinstimmt

Alles unten habe ich Zelle für Zelle gegen die Datenbank oder meine Nachrechnung verglichen (Skripte siehe oben).

Abrechnungen (alle 17):
- Nachgerechnet aus den Rechnungen: Kostenanteil, Verwaltungspauschale, Akontobeiträge, Saldo auf 5 Rappen zugunsten des Mieters und sämtliche 109 Abrechnungspositionen (Kosten des Gebäudes, Wohnungsanteil, Zeitanteil, Mieteranteil) stimmen auf den Rappen mit dem gespeicherten Wert überein. Der Mieteranteil ist rund(Wohnungsanteil, auf Rappen gerundet, mal Zeitanteil), also das, was das PDF zeigt (`NK-22222222-2025-0003`, Hauswart: 784.13 × 184/365).
- `abrechnungen.csv`: Kostenanteil, Übertrag (überall leer, keine Abrechnung hat einen Übertrag), Akontobeiträge, Bereits bezahlt, Saldo, Bezahlter Betrag, Offener Betrag, Status, Mietstage, Verwaltungspauschale, Zahlungsfrist, Bezahlt am und alle übrigen Spalten.
- Überfällig: nur `NK-11111111-2025-0001` (versendet, Frist 2026-10-28 vor dem Stichtag), in allen vier Sprachen und in `daten.json`; die Weboberfläche und `GET /api/v1/statements` sagen dasselbe.
- Offener Betrag: Entwurf leer, Bezahlt 0.00, versendet/überfällig Saldo minus Teilzahlungen.
- `abrechnungspositionen.csv`: Summe der Mieteranteile je Abrechnung plus Verwaltungspauschale ergibt den Kostenanteil (in der CSV aller vier Sprachen und in `daten.json`).
- Saldo = abgerundete 0.05-Stufe von (Kostenanteil + Übertrag − Akonto − Bereits bezahlt), nachgerechnet aus den CSV-Zellen aller vier Sprachen.
- `zahlungen.csv`: 9 Zeilen, je eine pro Teilzahlung in `utility_statements.payments`; Rückerstattungen negativ; die versendete Abrechnung hat keine Zeile.

Weitere Tabellen:
- `rechnungen.csv` (83), `mietverträge.csv` (11), `akonto.csv` (11), `vereinbarte-nebenkosten.csv` (132), `wohnungen.csv` (13), `mieter.csv` (10), `gebäude.csv` (3), `tankbestände.csv` (6), `kategorien.csv` (21), `verteilschlüssel.csv` (4), `heizprofile.csv` (4), `dokumente.csv` (1): Zeilenmenge gleich der Datenbank, jede Zelle gleich (Zeiten in Schweizer Zeit; die Datenbank-Sitzung läuft in UTC).
- `wohnungen.csv` Mietstatus am 2026-11-01 gegen die Mietverträge: 9 «Vermietet», 4 «Leer» (2.02, 3.02, B1, OG2); gespeichert steht überall `vacant`. Die Weboberfläche (`GET /api/v1/apartments`) zeigt dasselbe.
- fr/it/en: Zahlenspalten sind gleich wie in de; nur Wörter, Namen und Spaltenköpfe wechseln. Kategorie-, Schlüssel- und Heizprofilnamen entsprechen `name_fr/it/en`. Statuswörter und Mietstatus stimmen mit `messages/*.json` überein.

`daten.json`:
- Gleiche Beträge und Beziehungen wie die CSV: 3 Gebäude, 13 Wohnungen, 11 Mietverträge, 83 Rechnungen, 6 Tankbestände, 17 Abrechnungen mit 109 Positionen, 9 Zahlungen, 10 Mieter, 1 Dokument. Jede Fremd-ID (Mieter, Wohnung, Mietvertrag, Kategorie, Schlüssel) zeigt auf einen Datensatz in der Datei; Abrechnung, Mietvertrag, Mieter und Wohnung gehören zusammen.
- Keine Geheimnisse (kein Schlüssel, Token, Passwort); keine PDF-Inhalte in der JSON.
- `rentalStatus` neben dem gespeicherten `status` der Wohnung.

Gelöschte Datensätze: Die Datenbank hat keine Soft-Löschung; jede Tabelle des Exports hat genau die Zeilen der Datenbank, nichts darüber hinaus (siehe auch «Nicht bestätigt»).

Dateien im ZIP:
- 17 Abrechnungs-PDFs: Byte für Byte gleich `pdf_blob` (MD5 und Länge); in fr, it und en unverändert gleich wie in de.
- 1 Dokument (Übergabeprotokoll Marco Bernasconi): gleich `documents.content`, im Ordner `Bernasconi Marco/`, Dateiname mit Datum in Schweizer Zeit.
- Kein `belege/` (Tabelle `invoice_documents` leer); `belege.csv` hat nur die Kopfzeile, wie die README sagt.
- Alle Namen mit Umlaut oder Akzent tragen das UTF-8-Flag; `testzip` ohne Fehler; keine doppelten Namen.
- Jede CSV: BOM, `;`, CRLF, jede Zeile hat gleich viele Spalten wie die Kopfzeile; keine Zelle beginnt mit `=`, `+`, `-`, `@`, die keine Zahl ist, ohne `'`.

README (de, fr, it, en): Alle genannten Dateien und Ordner gibt es im ZIP (ausser `belege/` ohne Belege, wie sie selbst sagt); Trennzeichen, Beträge mit Punkt, Datum als Jahr-Monat-Tag, Erstellungszeit (15:52 = 14:52 UTC), Vorzeichen der Beträge bei Rückerstattung und die Aussage zum Offenen Betrag stimmen für die vorhandenen Daten.

Weboberfläche: Für alle 17 Abrechnungen enthält die Detailseite `/statements/<id>` Kostenanteil, Akonto, Verwaltungspauschale, Zwischensumme, Saldo, die Beträge jeder Position und den Status wie die Nachrechnung.

PDF und QR-Rechnung (Seiten mit `pdftoppm -r 300 -png`, Decoder `zxing-cpp` im venv `/tmp/scratchpad/dp496/venv`): Auf 9 Seiten steht ein QR-Code, genau bei den 9 Abrechnungen mit Nachzahlung (Rückerstattungen haben keinen). Alle 9 decodiert; für jede stimmt:
- Kopf `SPC/0200/1`, IBAN `CH44 3199 9123 0008 8901 2` (Prüfsumme gültig, QR-IBAN), Währung CHF, Betrag = Saldo der Abrechnung, Referenztyp QRR, Referenz = `qr_bill_reference` mit gültiger Prüfziffer (modulo 10 rekursiv), Gläubiger = Einstellungen (Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich), Zahlungspflichtiger = Mieter mit Korrespondenzadresse, Mitteilung «Nebenkostenabrechnung/Décompte des charges/Conteggio spese accessorie NK-…» in der Sprache des Mieters, Trailer `EPD`.
- Seiten und Abrechnungen: 11-2024-0001, 11-2024-0004, 11-2025-0001, 11-2025-0003, 11-2025-0004, 22-2024-0002, 22-2024-0003, 22-2025-0002, 22-2025-0004.
- Beträge der PDF-Texte (de, fr, it): Kostenanteil, Akonto, Verwaltungspauschale, Zwischensumme, Saldo, «Nachzahlung vor Rundung» und alle Positionsbeträge aller 17 PDFs stehen im Text (`pdfcheck.py`).

Geprüft: Abrechnungen NK-11111111-2024-0001 bis -0004, NK-22222222-2024-0001 bis -0003, NK-33333333-2024-0001 und -0002, NK-11111111-2025-0001 bis -0004, NK-22222222-2025-0001 bis -0004 (je Kostenanteil, Akonto, Saldo, Offener Betrag, Status, Positionen, PDF, Web, Zahlungen); QR-Rechnungen der 9 Nachzahlungs-PDFs; Tabellen gebäude, wohnungen, mieter, mietverträge, akonto, vereinbarte-nebenkosten, rechnungen, belege, tankbestände, abrechnungen, abrechnungspositionen, zahlungen, dokumente, kategorien, verteilschlüssel, heizprofile, protokoll, einstellungen in de/fr/it/en; daten.json in de und en; Dokument-PDF und Ordner; ZIP-Aufbau; README in vier Sprachen.

## Nicht bestätigt

- **Fälle, die die Demodaten nicht enthalten** (Daten ändere ich nicht): Übertrag und «Übertrag aus Abrechnung», Von Hand ausgeglichen, Ersetzt/Erledigt, Teilzahlung mit Rest, offene Rückerstattung, «Vermietet ab {Datum}», «Gesperrt», Mietvertrags-PDFs, Belege, Dokumente zu Mahnungen/versendeten PDFs, ein englischer Mieter (also kein englisches Abrechnungs-PDF), gelöschte Datensätze. Ich habe nicht geprüft, dass ein gelöschter Datensatz fehlt, sondern nur, dass jede Tabelle genau die Zeilen der Datenbank hat. Gesucht in `dwello_persona` (alle Tabellen, `psql`), in den PDFs und im ZIP. Diese Fälle deckt nur `backend/src/__tests__/data-export.pg.test.ts` ab; ich habe sie nicht unabhängig nachgerechnet.
- **Offener Betrag bei Erledigt und Ersetzt**: `data-export.service.ts:385-386` schreibt `0.00` für alles ausser Entwurf (leer) und Versendet/Überfällig. Die README (alle Sprachen) sagt «Offener Betrag: Saldo minus die Teilzahlungen»; bei einer Erledigten Abrechnung mit übertragenem Saldo (z. B. 3.00 ohne Zahlung) ergäbe das 3.00, die Zelle zeigt 0.00. In den Daten gibt es keine solche Abrechnung, deshalb kein Befund; der Wortlaut ist von Fachreview 496-2 geprüft, ob er für Erledigt und Ersetzt so gemeint ist, habe ich nicht entschieden.
- **Excel**: nicht installiert. D-1 habe ich mit LibreOffice Calc belegt; Verhalten in Excel (Ziffernfolgen ab 16 Stellen) ist bekannt, hier nicht gesehen. Ebenso nicht geprüft: Excel mit fr-CH/en (Dezimalpunkt, Strichpunkt) und der Windows-Explorer mit Umlauten im ZIP (UTF-8-Flag ist gesetzt).
- **Knopf und Download im Browser**: nicht geklickt, sondern der Formular-POST mit curl (Gründe oben). Zusatzbeobachtung zum Schutz gegen fremde Seiten (C-2): Ein POST mit fremdem `Origin` und `Content-Type: application/x-www-form-urlencoded` oder ohne `Origin` wird mit 403 abgewiesen, ein POST mit fremdem `Origin` und ganz ohne `Content-Type` liefert 200 und schreibt einen Protokolleintrag (SvelteKit prüft den Origin nur bei Formular-Inhaltstypen). Das Cookie `dwello_session` ist standardmässig `SameSite=lax` und würde dann nicht mitgesendet; bei `COOKIE_SAME_SITE=none` wäre es anders. Nicht weiter geprüft, nicht Teil der Datenprüfung.
- **Zeitzone**: Die Sitzung der Datenbank läuft hier in `Etc/UTC` (`current_setting('TimeZone')`), `created_at` = UTC; die Schweizer Zeit im Export stimmt damit. Läuft die Sitzung einer anderen Installation in Europe/Zurich, wären «Erfasst am» und die Protokollzeit um 1–2 Stunden verschoben; das habe ich nicht gesehen.
- **`referenceIndex`** (Mietvertrag): in `daten.json`, nicht in `mietverträge.csv`; in der Oberfläche gibt es das Feld nicht (nur über die API) und es ist in allen Verträgen leer. Kein Befund.
