# Datenprüfung #71 (Heizkosten, Option B), Runde 1

Stand: Commit f8ef41c (Worktree `.../scratchpad/review-71-daten`), Datenbank `dwello_persona`, 17.10.2026.
Es wurden keine Daten verändert. Die PDFs stammen aus `utility_statements.pdf_blob` (von der App erzeugt, nur gelesen).

## Ergebnis

Keine Abweichung gefunden. Alle neu gerechneten Beträge stimmen auf den Rappen mit gespeicherten Werten und PDF überein.

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|----|---------|-----------|----------|-------------|
| (keine Befunde) | | | | |

Offene Punkte stehen unter «Nicht bestätigt» (Webseite und die Sprachen fr/it/en der A2-PDFs).

## Methode

- Skript `/tmp/claude-0/-home-user-Dwello/80f6c78d-4176-5c5e-b0cf-a0f1691f2996/scratchpad/recompute/recompute.py` (Python, liest nur per psql: Rechnungen, Verteilschlüssel, Mietverträge, Heizprofil, Tankbestände). Kein Dwello-Code importiert. Regeln aus `docs/nebenkostenabrechnung-anforderungen.md` (Regeln 1, 3, 5, 8, 9, 10) und der Aufgabenstellung (Option B, #232, #257).
- Lauf: `python3 -I .../recompute/recompute.py` → 262 Prüfungen «OK», 0 Abweichungen, "ALL OK" (Ausgabe in `.../recompute/out.txt`). Zusätzlich `recompute2024.py` für die Perioden 2024 aller Gebäude: 288 OK, 0 Abweichungen.
- Geprüft je Abrechnungsposition: Gesamtkosten, Wohnungsanteil (Rundung 2 Stellen), Zeitanteil (Mietstage oder gewichteter Heizprofil-Anteil), Ihr Anteil; je Abrechnung: Zwischensumme, Verwaltungspauschale, Nebenkosten, Akonto, Saldo roh, Saldo auf 5 Rappen.

## Neu gerechnet: Seepark A2 (Heizung 4'115.00; Wohnungsanteil 4'115 × 82/320 = 1'054.46875 → 1'054.47)

Heizungsrechnungen 2025 (Verteilung Pro Fläche): 1'520.00 + 790.00 + 395.00 (ohne Leistungszeitraum, Rechnungsdatum in der Periode) + 1'410.00 (Leistungszeitraum 01.10.–31.12.2025, Rechnungsdatum 20.01.2026). Die Rechnung Q4 2024 (Datum 20.01.2025, Leistungszeitraum 2024) gehört nicht in 2025 und ist nicht enthalten.
Monatsanteile Heizprofil «Heizung + Warmwasser»: Jan 13.6, Feb 12.1, Mär 11.5, Apr 9.3, Mai 5.6, Jun 3.7, Jul 3.7, Aug 3.6, Sep 3.7, Okt 9.5, Nov 10.7, Dez 13.0 (Summe 100.0).

| Rechnung | Meier (Jan–Jun: 55.8) | Brunner (Jul–Dez: 44.2) |
|---|---|---|
| 1'520 / 790 / 395 ohne Leistungszeitraum | 55.8 / 100.0 = 55.80 % | 44.2 / 100.0 = 44.20 % |
| 1'410 (Okt–Dez, Summe 33.2) | 0 / 33.2 = 0.00 % | 33.2 / 33.2 = 100.00 % |
| gewichtet über 4'115 | (2'705 × 0.558) / 4'115 = 0.366798 → 36.68 % | (2'705 × 0.442 + 1'410) / 4'115 = 0.633202 → 63.32 % |
| Ihr Anteil | 1'054.47 × 0.366798 = 386.7816 → **386.78** | 1'054.47 × 0.633202 = 667.6884 → **667.69** |

Gespeichert und im PDF gleich: 386.78 / 667.69, `period_share` 0.3668 / 0.6332, Zeitanteil 36.68 % / 63.32 %.
Summe Meier + Brunner = 386.78 + 667.69 = **1'054.47** = Wohnungsanteil (ungerundet 386.7816 + 667.6884 = 1'054.4700); Leerstand: keiner (Verträge lückenlos 30.06./01.07.). Gewichtete Anteile 0.558 × 2'705 + 0.442 × 2'705 = 2'705, die Rechnung 1'410 wird 0 + 1'410.

Übrige Positionen (nach Tagen, 181 + 184 = 365): TV 113.06 + 114.94 = 228.00; Hauswart 388.84 + 395.29 = 784.13; Kaltwasser 261.77 + 266.11 = 527.88; Allgemeinstrom 63.45 + 64.50 = 127.95. Alle Summen gleich dem Wohnungsanteil.

Totale:

| | Meier NK-22222222-2025-0002 | Brunner NK-22222222-2025-0003 |
|---|---|---|
| Zwischensumme | 113.06 + 388.84 + 386.78 + 261.77 + 63.45 = 1'213.90 | 114.94 + 395.29 + 667.69 + 266.11 + 64.50 = 1'508.53 |
| Verwaltungspauschale 3 % | 36.417 → 36.42 | 45.2559 → 45.26 |
| Ihre Nebenkosten | 1'250.32 | 1'553.79 |
| Akonto | 6 × 220 = 1'320.00 | 6 × 240 = 1'440.00 |
| Saldo vor Rundung | −69.68 | +113.79 |
| Rundung 5 Rappen | +0.02 → −69.70 (Rückerstattung 69.70) | +0.01 → 113.80 (Nachzahlung 113.80) |

Gespeichert: `total_costs` 1250.32 / 1553.79, `management_fee` 36.42 / 45.26, `balance` −69.70 / 113.80. PDF druckt dieselben Zeilen inkl. Rundungszeichen (+ 0.02 / + 0.01).

Gedruckte Rechenzeile im PDF, neu gerechnet:
- Meier: `1'054.47 × (1'520.00 × 55.80 % + 790.00 × 55.80 % + 395.00 × 55.80 % + 1'410.00 × 0.00 %) / 4'115.00 = 386.78`: 386.7816 ✓
- Brunner: `1'054.47 × (… × 44.20 % … + 1'410.00 × 100.00 %) / 4'115.00 = 667.69`: 667.6884 ✓
- Teilungen im PDF: «0.00 % / 33.20 % = 0.00 %» und «33.20 % / 33.20 % = 100.00 %» ✓; «Monate Ihres Mietverhältnisses» Jan–Jun bzw. Jul–Dez mit den Monatswerten des Profils ✓.

## Kontrollfälle

- Seepark A1 Weber NK-22222222-2025-0001 (ganze Periode, `heating_share.byDays = true`, reason `wholePeriod`): Heizung 4'115 × 68/320 = 874.4375 → 874.44 × 365/365 = 874.44 ✓; Zwischensumme 2'296.54, Pauschale 68.90, Nebenkosten 2'365.44, Akonto 2'400.00, Saldo −34.56 → −34.55 (Rundung − 0.01) ✓. Kein Heizprofil-Hinweis im PDF, «365/365 Tage» ✓.
- Seepark B2 Bernasconi NK-22222222-2025-0004 (eigener Satz 2.5 %): alle Beträge ✓, Saldo 75.80.
- Musterhaus Zentrum 1.02 Schmidt NK-11111111-2025-0002 (Tankkategorie «Heating»): Verbrauch 2'650.00 + 6'565.00 − 2'257.20 = 6'957.80; Schlüssel Heizung 70/30: 6'957.80 × (0.7 × 92/492.5 + 0.3 × 1/6) = 1'257.70 ✓; 365/365 Tage; Kaminfeger (Heizkosten-Kategorie ohne Tank) 335.00 × 92/492.5 = 62.58 ✓; Zwischensumme 3'488.85, Pauschale 104.67, Saldo 6.48 → 6.50 Rückerstattung (+ 0.02) ✓. Brennstoffverbrauchs-Tabelle im PDF stimmt.
- Übrige Musterhaus-Abrechnungen 2025 (Müller, Dubois, Rossi): alle Positionen und Totale ✓ (im Skript).

## QR-Rechnungen (Rendering `pdftoppm -png -r 300`, Decoder: OpenCV `QRCodeDetector`, installiert in `.../scratchpad/pylib`; Skript `.../recompute/qr.py`)

| Abrechnung | IBAN | Betrag | Referenz (QRR, 27 Stellen, Prüfziffer mod 10 rekursiv) | Mitteilung | Zahlungspflichtiger |
|---|---|---|---|---|---|
| NK-22222222-2025-0003 Brunner (Pflicht) | CH4431999123000889012 (mod 97 = 1; QR-IBAN, IID 31999) | CHF 113.80 = Saldo | 004126160569515892820870128, Prüfziffer 8 ✓, gleich `qr_bill_reference` und gedruckter Referenz | Nebenkostenabrechnung NK-22222222-2025-0003 | S, Nina Brunner, Seeweg 15, 6003 Luzern, CH ✓ |
| NK-22222222-2025-0004 Bernasconi | gleich | 75.80 = Saldo | 005285854657981694222358122 ✓ | «Conteggio spese accessorie NK-22222222-2025-0004» (it) | Marco Bernasconi ✓ |
| NK-11111111-2025-0001 Müller | gleich | 215.80 = Saldo | 008256493946381972337900056 ✓ | de | Hans Müller ✓ |
| NK-11111111-2025-0003 Dubois | gleich | 142.40 = Saldo | 011538741163399485583320186 ✓ | «Décompte des charges …» (fr) | Pierre Dubois ✓ |

Kreditor in allen: Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, CH. Meier (Rückerstattung), Weber, Schmidt haben keinen Einzahlungsschein, korrekt.

## Geprüft und bestanden

Seepark 2025: Weber (0001), Meier (0002), Brunner (0003), Bernasconi (0004); Musterhaus 2025: Müller (0001), Schmidt (0002), Dubois (0003), Rossi (0004, Beträge); Perioden 2024 aller Gebäude (Skript). PDF-Text (de) von Meier, Brunner, Weber, Schmidt gegen Datenbank. QR-Rechnungen Brunner, Bernasconi, Müller, Dubois. Italienischer (Bernasconi, Rossi) und französischer PDF-Text (Dubois) zeigen dieselben Beträge wie die Datenbank (QR-Zahlteil).

## Nicht bestätigt

- **Webseite der Abrechnung** (Detailansicht A2): ohne Sitzung nicht erreichbar (Backend verlangt JWT; das Auslesen von Geheimnissen aus dem laufenden Prozess wurde zu Recht abgelehnt, einen Token habe ich nicht erzeugt). Die gespeicherten Werte, aus denen die Seite liest, sind bestätigt.
- **PDFs der A2-Abrechnungen in fr, it, en:** vorhanden ist nur die Sprache der Mieter (de). Ein neues Erzeugen mit `language` braucht ebenfalls ein Token. Nur statisch gelesen: In `backend/src/services/pdf.service.ts` haben `partProfile`, `partProfileRun`, `heatingNoteParts`, `heatingPeriodMonths` in fr/it/en dieselben Platzhalter (`{periodMonths}`, `{months}`, `{tenant}`, `{period}`, `{percent}`) wie in de. Zahlenformat und gerenderte Texte in diesen Sprachen nicht gesehen.
- **QR-Rechnung Rossi** (NK-11111111-2025-0004, Musterhaus, nicht im Auftrag): mit OpenCV bei 150/200/300/400 dpi nicht decodierbar. Gedruckter Zahlteil (IBAN, Referenz 00 72551 61911 55763 27967 42135 = `qr_bill_reference`, CHF 238.10 = Saldo, Maria Rossi) stimmt, der Code selbst nicht bestätigt. Möglicherweise Grenze des Decoders; mit zweitem Decoder (zbar) nicht gegengeprüft.
- **Nicht in den Daten vorkommende Fälle** (Heizprofil-Rechnung mit Leistungszeitraum, das teilweise Monate abdeckt; Einzug mitten im Monat; Leistungszeitraum über die Periode hinaus; 0 %-Monate im Leistungszeitraum; Mieter mit Tankkategorie und Teilperiode): die Demodaten enthalten keinen, ich durfte keine Daten anlegen. Mein Skript bildet nur die Monate vollständig im Zeitraum ab; bei Teilmonaten ist die Regel im Dokument nicht ausdrücklich («Monate des Heizprofils in ihren Tagen») und nicht geprüft.
