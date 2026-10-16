# Datenprüfung #229, Runde 2

Geprüfter Commit: `6fcd5837` (Worktree `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/review-229-daten2`). Die laufende App (Fusszeile «Version 0.4.11+968-g23a94250») ist aus `23a94250` gebaut; `git diff 23a94250 6fcd5837 -- backend/src/services/pdf.service.ts` ändert nur den Schlusspunkt von `heatingPeriodSums` in de/fr/it/en.
Datenbank `dwello_persona`, Backend :3301, Frontend :3300. Geprüft: die vier Entwürfe, die Dr. Weber in «Seepark Residenz» für die Periode 01.01.2025–30.09.2025 mit dem Heizprofil «Heizung + Warmwasser» erstellt hat.

## Befunde

| ID | Schweregrad | Datensatz | Erwartet | Tatsächlich |
|----|-------------|-----------|----------|-------------|
| – | – | – | – | – |

Keine Befunde. Alle Beträge auf den Rappen, alle Prozente auf zwei Stellen, der Satz zu den Summen und die QR-Rechnung stimmen in Datenbank, Webseite und PDF (de, fr, it, en und gespeichert) überein.

## Vorgehen und Belege

Skripte und Ausgaben im Scratchpad `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/dp229r2/` (meine eigenen Skripte aus Runde 1, kein Dwello-Code):

- `export.sh`: liest Rechnungen, Kategorien, Wohnungen, Mietverträge, Verteilschlüssel, Heizprofile, Tankbestände, Abrechnungen, Positionen und Mieter als JSON aus `dwello_persona` (nur `select`).
- `recompute229.py`: Neuberechnung nach den Regeln 1–10 von `docs/nebenkostenabrechnung-anforderungen.md`. Zeitanteil nach Tagen (Mietstage / Tage der Periode bzw. des Leistungszeitraums in der Periode); Heizkosten bei Ein- oder Auszug nach Heizprofil: Summe der Monatsanteile der Mietzeit / Summe der Monatsanteile der Periode (ein angebrochener Monat nach Tagen), Saldo kaufmännisch auf 5 Rappen. Ausgabe `recompute.out`: `MISMATCHES: 0`.
- `checkpdf229.py`: `pdftotext` jedes PDF gegen `expected.json`: Prozent im Hinweis und in der Position, Monatsliste in der Sprache, Satz «zusammen x %. Die Monate der Abrechnungsperiode haben im Heizprofil zusammen y %» (und die fr/it/en-Fassungen) genau dann, wenn y ≠ 100.00, x = Summe der gedruckten Monate, y = Summe der Profilmonate der Periode; Saldo und Saldo vor Rundung. Ausgabe `checkpdf.out`: `MISMATCHES 0` (80 Prüfungen). Im ersten Lauf zeigte die englische Prüfung 2 Abweichungen, weil mein Muster «together» erwartete; der Code-Text ist «in total» (`pdf.service.ts:276`), das Muster habe ich angepasst. Das ist kein Befund.
- `qr.py` (zxing-cpp im Scratchpad-venv `../venv`) dekodiert die mit `pdftoppm -png -r 200` gerenderten Seiten; `qrcheck.py` prüft Kopf, IBAN (mod 97, QR-IID), Kreditor, Betrag, Währung, Schuldner, Referenztyp, Referenz = gespeichert, 27 Stellen, Prüfziffer Modulo 10 rekursiv, Mitteilung und Trailer. Ausgabe `qrcheck.out`: `MISMATCHES 0`.
- Webseite: `GET /statements/<id>` mit einer selbst signierten Sitzung (Cookie `dwello_session`, nur GET), Text in `web/web.txt`.

Reproduzieren:

```bash
R=/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/dp229r2
$R/export.sh $R/in && python3 -I $R/recompute229.py $R/in NK-22222222-2025-0001 NK-22222222-2025-0002 NK-22222222-2025-0003 NK-22222222-2025-0004 | tail -1
python3 -I $R/checkpdf229.py $R/expected.json $R/pdf/*.pdf | tail -1
$R/../venv/bin/python -I $R/qr.py $R/png/*.png > $R/qr.out && python3 -I $R/qrcheck.py $R | tail -1
```

Heizprofil «Heizung + Warmwasser» (Abfrage auf `heating_profiles`): Jan 13.60, Feb 12.10, Mär 11.50, Apr 9.30, Mai 5.60, Jun 3.70, Jul 3.70, Aug 3.60, Sep 3.70 → Jan–Sep **66.80 %**, Jahr 100.00 %.

Gespeichert (`select statement_number, heating_share::text from utility_statements where period_end='2025-09-30'`):

- NK-22222222-2025-0004: `byDays` false, `percent` 83.53, `periodPercent` 66.8, Monate 1–6 = 13.6/12.1/11.5/9.3/5.6/3.7.
- NK-22222222-2025-0001: `byDays` false, `percent` 16.47, `periodPercent` 66.8, Monate 7–9 = 3.7/3.6/3.7.
- NK-22222222-2025-0002, -0003: `{"byDays": true}`.

## Geprüft und bestanden

Neu berechnet und mit Datenbank, Webseite und PDF verglichen:

- **NK-22222222-2025-0004** (Sarah Meier, A2, Mietzeit 01.01.–30.06.2025, 181 von 273 Tagen, Nachzahlung):
  - Heizung: 55.80 / 66.80 = 0.835329 → `period_share` 0.8353, `percent` 83.53 (= 0.8353 × 100), `periodPercent` 66.80, Monate Jan–Jun wie im Profil. 693.16 × 0.835329 = 579.02.
  - Übrige Positionen 181/273 (0.6630): TV/Kabel 228.00 → 151.16; Hauswart 588.09 → 389.91; Kaltwasser 398.47 → 264.19; Allgemeinstrom 60.71 → 40.25. Gesamtkosten und Wohnungsanteile (82 / 320 m², 1 / 4 Wohnungen) gleich.
  - Zwischensumme 1'424.53, Verwaltungspauschale 3 % 42.74, Ihre Nebenkosten 1'467.27, Akonto 6 × 220.00 = 1'320.00, vor Rundung 147.27, Rundung − 0.02, **Nachzahlung 147.25**. Datenbank, Webseite und PDF de/fr/it/en gleich.
  - PDF de/fr/it/en und das vor meiner Prüfung gespeicherte PDF: Hinweis und Position 83.53 %, Monatsliste in der Sprache («Jan 13.60 %, … Jun 3.70 %», «janv. … juin», «gen … giu», «Jan … Jun»), Satz «; zusammen 55.80 %. Die Monate der Abrechnungsperiode haben im Heizprofil zusammen 66.80 %» (fr «au total 55.80 % … totalisent 66.80 %», it «in totale 55.80 % … totalizzano 66.80 %», en «in total 55.80 % … total 66.80 %»). x = 13.60+12.10+11.50+9.30+5.60+3.70 = 55.80.
  - QR-Rechnung de/fr/it/en/gespeichert: IBAN CH4431999123000889012 (= `configuration.iban`, mod 97 gültig, QR-IID 31999), Kreditor Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, CH; Betrag 147.25 CHF; Schuldner Sarah Meier, Hirschmattstrasse 21, 6003 Luzern, CH; Referenz QRR 001278108960965487170431354 (27 Stellen, Prüfziffer gültig, = gespeichert); Mitteilung «Nebenkostenabrechnung / Décompte des charges / Conteggio spese accessorie / Utility Cost Statement NK-22222222-2025-0004» je Sprache; Trailer EPD.
- **NK-22222222-2025-0001** (Nina Brunner, A2, Mietzeit 01.07.–30.09.2025, 92 von 273 Tagen, Rückerstattung):
  - Heizung: 11.00 / 66.80 = 0.164671 → `period_share` 0.1647, `percent` 16.47, `periodPercent` 66.80, Monate Jul–Sep. 693.16 × 0.164671 = 114.14.
  - Übrige Positionen 92/273 (0.3370): 76.84, 198.18, 134.28, 20.46.
  - Zwischensumme 543.90, Pauschale 16.32, Ihre Nebenkosten 560.22, Akonto 720.00, vor Rundung −159.78, Rundung + 0.02 (Betrag wird grösser), **Rückerstattung 159.80**. Datenbank, Webseite, PDF de/fr/it/en gleich.
  - PDF de/fr/it/en: 16.47 % in Hinweis und Position, Monatsliste Jul/Aug/Sep (juil./août/sept., lug/ago/set), Satz mit x = 3.70+3.60+3.70 = 11.00 und y = 66.80. Keine QR-Rechnung (Rückerstattung), richtig.
  - Zusammen mit 0004: 16.47 % + 83.53 % = 100 % der Heizkosten von A2; 55.80 + 11.00 = 66.80, kein Leerstand.
- **NK-22222222-2025-0002** (Marco Bernasconi, ganze Periode): alle Positionen 273/273, Zwischensumme 2'244.35, Pauschale 67.33, Ihre Nebenkosten 2'311.68, Akonto 2'340.00, vor Rundung −28.32, Rundung − 0.02, **Rückerstattung 28.30**. `heating_share` `byDays: true`; PDF de/fr/it/en ohne Heizprofil-Hinweis und ohne Summensatz, Heizung «273/273 Tage». Keine QR-Rechnung, richtig.
- **NK-22222222-2025-0003** (Thomas Weber, A1, ganze Periode): Zwischensumme 1'671.28, Pauschale 50.14, Ihre Nebenkosten 1'721.42, Akonto 1'800.00, vor Rundung −78.58, Rundung + 0.02, **Rückerstattung 78.60**. `byDays: true`; PDF ohne Hinweis und Summensatz. Keine QR-Rechnung, richtig.

Webseite aller vier: Beträge der Positionen, Zwischensumme, Pauschale, Gesamtkosten, Akonto, Saldo vor Rundung, Rundung mit Vorzeichen und Saldo wie oben; Mietstage 181 / 92 / 273 / 273.

Nebenwirkungen meiner Prüfung (vom Koordinator erlaubt): Für alle vier Entwürfe habe ich `POST /api/v1/statements/:id/generate-pdf` in fr, it, en und zuletzt de aufgerufen. Gespeichert ist bei allen das deutsche PDF. Bei 0004 ist der Text des gespeicherten PDF gleich wie vorher (`diff` der `pdftotext`-Ausgaben leer, nur CreationDate neu); Abrechnungsdatum 16.10.2026, Zahlungsfrist 15.11.2026, Status Entwurf und QR-Referenz sind gleich geblieben. 0001–0003 hatten vorher kein PDF; jetzt haben sie ein deutsches PDF und eine gespeicherte `qr_bill_reference` (das Erzeugen speichert sie auch bei einer Rückerstattung; ihre PDFs drucken keine QR-Rechnung). Zustände vorher und nachher in `before.txt` und `after.txt`. Nichts versendet oder gelöscht, keine Profile geändert.

## Nicht bestätigt

- **Schlusspunkt des Satzes (Commit `6fcd5837`):** Die laufende App ist aus `23a94250` gebaut; ihre PDFs enden ohne Punkt («… zusammen 66.80 %»). Dass der geprüfte Commit den Punkt druckt, habe ich nur im Code-Diff gesehen, nicht in einem erzeugten PDF. Die Zahlen ändert dieser Diff nicht.
- **Angebrochener Monat nach Tagen:** Alle Ein- und Auszüge der vier Abrechnungen liegen auf Monatsgrenzen; der Fall, dass ein Monat nur teilweise gemietet ist, kam nicht vor.
- **Ältere Abrechnung ohne `heating_share` (vor #209)** und ein Profil, dessen zwölf Monate nicht genau 100.00 % ergeben: wie in Runde 1 nicht in den Daten vorhanden.
