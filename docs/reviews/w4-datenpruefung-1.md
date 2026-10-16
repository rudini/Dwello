# Datenprüfung W4 (#232, #247): Heizprofil-Anteil, Seepark Residenz

Geprüfter Commit: 5e61fe4 (Worktree `review-w4-daten`). Laufende Persona-Daten: `dwello_persona`, Build ae75ecc.
Ergebnis: **keine Befunde (0 Blocker, 0 Major, 0 Minor, 0 Nit)**. Alle betroffenen Datensätze stimmen auf den Rappen.

## Befunde

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|----|---------|-----------|----------|-------------|
| – | – | – | – | keine Abweichung gefunden |

## Methode

- Eigenes Skript: `/tmp/claude-0/-home-user-Dwello/3a249483-dd2a-5ba2-b226-2da9cde281a8/scratchpad/w4check.py` (Python, `Decimal`, liest nur aus `dwello_persona`; kein Dwello-Code). Aufruf: `python3 -I w4check.py`, Ausgabe «ALL OK».
- Eingaben aus der Datenbank: Rechnungen (mit Leistungszeitraum-Verteilung), Verteilschlüssel (Fläche 82/320 m², Einheit 1/4), Mietverträge, Akonto, Heizprofil «Heizung + Warmwasser» (Jan 13.6, Feb 12.1, Mär 11.5, Apr 9.3, Mai 5.6, Jun 3.7, Jul 3.7, Aug 3.6, Sep 3.7, Okt 9.5, Nov 10.7, Dez 13.0).
- Regeln: Monatsanteile kaufmännisch auf 2 Stellen, Prozent = Summe Mieter / Summe Periode kaufmännisch auf 2 Stellen, Heizposition = Wohnungsanteil x Prozent, übrige Positionen = Wohnungsanteil x Mietstage/Periodentage, Verwaltungspauschale 3 % der Zwischensumme, Saldo kaufmännisch auf 5 Rappen.
- Web-Seiten: GET `http://localhost:3300/statements/<id>` mit selbst ausgestelltem Sitzungs-JWT (Persona-Secret aus `persona-stack.sh`); nur lesend. Der Persona-Stack und seine Daten blieben unverändert.
- PDF (Persona-Stack): `utility_statements.pdf_blob` dekodiert, `pdftotext -layout`.
- PDF in vier Sprachen: Der Persona-Stack läuft mit ae75ecc, ein erneutes `generate-pdf` hätte seine Daten verändert. Darum: eigene Datenbank `dwello_w4copy` (pg_dump von `dwello_persona`), Backend aus dem Worktree (5e61fe4) auf Port 3391 mit eigenem Secret, dort `generate-pdf` für de/fr/it/en je Abrechnung. Danach Backend gestoppt und Kopie-Datenbank gelöscht. Die deutschen Texte der Kopie sind (ausser Abrechnungsdatum) identisch mit den Blobs im Persona-Stack (`diff` leer, für 0001/0003/0004 (it)/0005). Die Kopie hat die Abrechnungen nicht neu berechnet (gespeicherte Werte aus ae75ecc), sie zeigt also Druck nach 5e61fe4 auf gespeicherten Daten. Die Berechnung nach 5e61fe4 ist durch mein Skript belegt (siehe Halbwerte).

## Geprüfte und bestandene Datensätze

### NK-22222222-2025-0005, Sarah Meier (A2), Periode 01.01.–30.09.2025, Auszug 30.06.2025

| Grösse | Eigene Rechnung | Gespeichert / gedruckt |
|---|---|---|
| Monate Mieterin | Jan 13.60, Feb 12.10, Mär 11.50, Apr 9.30, Mai 5.60, Jun 3.70, Summe 55.80 | `heating_share.months` gleich; PDF «Jan 13.60 %, … Jun 3.70 %; zusammen 55.80 %» |
| Monate Periode | obige + Jul 3.70, Aug 3.60, Sep 3.70, Summe 66.80 | `periodMonths`, `periodPercent` 66.8; PDF gleich |
| Prozent | 55.80 / 66.80 = 83.5329… -> 83.53 | `percent` 83.53, `period_share` 0.8353, PDF «55.80 % / 66.80 % = 83.53 %» (de, fr, it, en) |
| Heizkosten Periode | 1520 + 790 + 395 = 2'705.00 (Q4-2024-Rechnung mit Leistungszeitraum 2024 und Q4-2025 mit Leistungszeitraum ab 01.10. fallen ausserhalb) | 2'705.00 |
| Wohnungsanteil | 2705 x 82/320 = 693.15625 -> 693.16 | 693.16 |
| Ihr Anteil Heizung | 693.16 x 83.53 % = 579.00 | 579.00 |
| Übrige Positionen | TV 151.16, Kaltwasser 264.19, Hauswart 389.91, Allgemeinstrom 40.25 (je x 181/273) | gleich |
| Zwischensumme / Pauschale / Total | 1'424.51 / 42.74 / 1'467.25 | gleich (DB, Web, PDF) |
| Akonto | 6 Monate x 220 = 1'320.00 | gleich |
| Saldo | 147.25, keine Rundung nötig | 147.25 Nachzahlung (DB, Web, PDF, QR) |
| `byDays` | false | false, keine `reason` |

### Nina Brunner NK-22222222-2025-0003 (A2, ab 01.07.2025, Jahr 2025)

- Monate Jul 3.70, Aug 3.60, Sep 3.70, Okt 9.50, Nov 10.70, Dez 13.00, Summe 44.20; Periode 100.00 -> keine Perioden-Monate, kein `periodMonths` (erwartet und gespeichert: fehlt). Prozent 44.20 % (`period_share` 0.4420).
- Wohnungsanteil 4115 x 82/320 = 1'054.47 (1054.46875), Heizung 1'054.47 x 44.20 % = 466.08 (466.0757). Übrige: 114.94, 395.29, 266.11, 64.50 (x 184/365). Zwischensumme 1'306.92, Pauschale 39.21, Total 1'346.13, Akonto 6 x 240 = 1'440.00.
- Saldo vor Rundung -93.87, Rundung +0.02 -> -93.85 Rückerstattung. DB, Web, PDF (de, fr, it, en) gleich. Das PDF druckt «44.20 %» und die Monate ohne Summen und ohne Division, wie vorgesehen (Periode trägt 100 %). Keine QR-Rechnung (Rückerstattung), im PDF entsprechend keine.

### Thomas Weber NK-22222222-2025-0001 (A1, ganze Periode)

- `heating_share` = `{byDays: true, reason: "wholePeriod", names: {…}}`, wie erwartet. Heizung nach Tagen: 4'115.00 x 68/320 = 874.44 x 365/365 = 874.44.
- Übrige: 228.00, 650.25, 437.75, 106.10; Zwischensumme 2'296.54, Pauschale 68.90, Total 2'365.44, Akonto 2'400.00, vor Rundung -34.56, Rundung +0.01, Saldo -34.55.
- Web (de, fr, it, en): «Heizung + Warmwasser (nicht angewendet: Mietvertrag über die ganze Periode)» bzw. fr «non appliqué : contrat de bail sur toute la période», it «non applicato: contratto di locazione per tutto il periodo», en «not applied: rental contract over the whole period». PDF nennt kein Heizprofil und keine Monate (Zeitanteil 365/365 Tage), in allen vier Sprachen.

### Marco Bernasconi NK-22222222-2025-0004 (B2, ganze Periode)

- `heating_share` byDays/wholePeriod. Heizung 4'115.00 x 95/320 = 1'221.64. Übrige 228.00, 908.44, 611.56, 148.23; Zwischensumme 3'117.87, Pauschale 93.54, Total 3'211.41, Akonto 3'120.00, vor Rundung 91.41, Rundung -0.01, Saldo 91.40. DB, Web, PDF gleich. Mieter spricht Italienisch, das gespeicherte PDF ist italienisch; PDF in de/fr/en der Kopie ebenfalls ohne Heizprofil-Hinweis, Web wie bei Weber.

### QR-Rechnungen (`pdftoppm -png -r 300`, Seite 2; Decoder zxing-cpp im venv `/tmp/claude-0/-home-user-Dwello/3a249483-dd2a-5ba2-b226-2da9cde281a8/scratchpad/v4`, Skript `w4qr.py`)

Gespeicherte Blobs und die vier Sprachfassungen (Kopie), je dekodiert:

| Abrechnung | IBAN | Betrag | Referenz | Prüfziffer | Mitteilung | Zahlbar durch |
|---|---|---|---|---|---|---|
| 0005 Meier | CH4431999123000889012 (Prüfsumme gültig, QR-IID 31999) | CHF 147.25 = Saldo | QRR 004181387159206232399348708 | stimmt (Mod 10 rekursiv); gleich der aus der Abrechnungs-ID abgeleiteten Referenz (erste 20 Hexstellen, 26 Stellen + Prüfziffer) | «Nebenkostenabrechnung NK-22222222-2025-0005» (de), fr «Décompte des charges …», it «Conteggio spese accessorie …», en «Utility Cost Statement …» | Sarah Meier, Hirschmattstrasse 21, 6003 Luzern |
| 0004 Bernasconi | gleich | CHF 91.40 = Saldo | QRR 001269305363903078933880295 | stimmt, abgeleitet gleich | Mitteilung in Sprache des PDF (stored: it) | Marco Bernasconi, Seeweg 15, 6003 Luzern |

Gläubiger in beiden: Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, CH. 0001 und 0003 sind Rückerstattungen: keine QR-Rechnung, keine geprüft.

## Exakte Hälften

Kein Datensatz trifft eine exakte Hälfte. Alle Mieterzeiten sind ganze Monate, jeder Monatsanteil ist also der Profilwert (Zehntelprozent, ohne Rundung). Die Divisionen ergeben 83.5329… und 44.200 (rohes Skript: `raw division`), beide weit von xx.xx5 entfernt. Der Unterschied ae75ecc (Math.round) zu 5e61fe4 (kaufmännisch) wirkt auf diesen Daten nicht; die Persona-Daten gelten damit auch für 5e61fe4. Die Fraktions-Fälle (z. B. 2.3 x 7/28 = 0.575) deckt der neue Test `heating-profile.service.test.ts` ab, ich habe sie nicht an Datensätzen geprüft.

## Nicht bestätigt

- **Neuberechnung nach 5e61fe4 an der Datenbank:** Der Persona-Stack lief mit ae75ecc und ich durfte nichts neu erstellen. Die Rechnung nach der Regel von 5e61fe4 stammt aus meinem Skript; die PDF-Fassungen aus 5e61fe4 beruhen auf den von ae75ecc gespeicherten `heating_share`-Werten (gleich, siehe Hälften).
- **Web-Seite im Build 5e61fe4:** Der Persona-Build ist ae75ecc. Er enthält bereits den Hinweis «(nicht angewendet: …)» in vier Sprachen. Die Web-Seite zeigt weder Monate noch Division (nur Profilname, Anteil-Spalte «21.4 %» bzw. «11.33 %»); das ist keine Abweichung von der Aufgabenbeschreibung (die nennt Monate und Division nur für das PDF).
- **Ausdruck/Scan der QR-Rechnung, Banktest:** nur Decodierung der gerenderten Seite, kein Zahlungsvorgang.
- **Romanisch:** nicht geprüft (nicht verlangt).
- **Abrechnungen anderer Gebäude und 2024:** nicht geprüft (nicht betroffen). Die 2024-Abrechnungen der Seepark Residenz zeigen `heating_share` byDays/wholePeriod, nicht weiter nachgerechnet.

## Aufräumen

Die Kopie-Datenbank `dwello_w4copy` und mein Backend auf Port 3391 sind entfernt. Im Repository wurde nichts geändert (`git status` im Worktree leer).
