# Datenprüfung #241, Runde 1 (daten-pruefer)

- Geprüfter Commit: `3ae2b1d6` (Worktree `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/review-241-daten`, Diff `git diff 88583151 3ae2b1d6`); die laufende App meldet im Fuss «Version 0.4.11+1034-g3ae2b1d6».
- Daten: `dwello_persona` (nur gelesen; keine Schreibzugriffe, kein `generate-pdf`).
- Datensatz: Abrechnung NK-22222222-2025-0005 (`fd3f2fb3-07c3-4b76-a464-75431e0d321f`), Nina Brunner, Wohnung A2, «Seepark Residenz», Mietvertrag `b0000002-0002-0002-0002-000000000003` ab 01.07.2025, Periode 01.01.–31.12.2025, Sprache des Mieters `de`.
- Eigenes Nachrechnungsskript (Regeln aus `docs/nebenkostenabrechnung-anforderungen.md`, «Regeln in Dwello» 1, 3, 5, 8, 9 und Thema 6; kein Dwello-Code importiert oder kopiert): `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/daten241/recompute.py`, Ausgabe `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/daten241/out-recompute.txt`.

## Befunde

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| – | – | – | – | – |

Keine Befunde. Alle Beträge stimmen auf den Rappen mit gespeicherten Werten, Webseite und PDF überein.

## Nachrechnung (Belege)

Reproduktion: `python3 -I /tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/daten241/recompute.py` (liest Rechnungen, Kategorien, Verteilschlüssel, Wohnungen, Mietvertrag, Heizprofil und Abrechnung per `psql` aus `dwello_persona`).

Grundlagen: Periode 365 Tage, Mietstage 01.07.–31.12.2025 = 184 (gespeichert 184), Schlüsselwerte Fläche 82/320, Einheiten 1/4 (gespeichert gleich).

| Position | Kosten Liegenschaft | Wohnungsanteil | Zeitanteil | Ihr Anteil | Ergebnis |
|---|---|---|---|---|---|
| TV/Kabelanschluss (1 Rechnung 31.01.2025, Pro Einheit) | 912.00 | 912.00 × 1/4 = 228.00 | 184/365 (0.5041) | 114.94 | OK (gespeichert, PDF, Web) |
| Heizung (4 Rechnungen, inkl. 20.01.2026 mit Leistungszeitraum 01.10.–31.12.2025; die Rechnung 20.01.2025 mit Leistungszeitraum Q4 2024 zählt richtig nicht) | 4'115.00 | 1'054.47 | Heizprofil «Heizung + Warmwasser» Jul–Dez 3.7+3.6+3.7+9.5+10.7+13.0 = 44.20 % von 100 % | 466.08 | OK |
| Hauswart (4 Rechnungen à 765.00) | 765 + 765 + 765 + 572.20 = 2'867.20 | 2'867.20 × 82/320 = 734.72 | (765×0/90 + 765×0/91 + 765×184/365 + 572.20×92/92) / 2'867.20 = 0.33406942 → 33.41 % | 734.72 × 0.33406942 = 245.4511 → 245.45 | OK |
| Kaltwasser (4 Rechnungen) | 2'060.00 | 527.88 | 184/365 | 266.11 | OK |
| Allgemeinstrom (2 Rechnungen) | 499.30 | 127.95 | 184/365 | 64.50 | OK |

Auszug Skriptausgabe (Hauswart):

```
  Kosten Liegenschaft  erwartet    2867.20  gespeichert    2867.20  OK
  Wohnungsanteil       erwartet     734.72  gespeichert     734.72  OK
  Zeitanteil           erwartet     0.3341  gespeichert     0.3341  OK
  Ihr Anteil           erwartet     245.45  gespeichert     245.45  OK
  share_percentage     erwartet     8.5606  gespeichert     8.5606  OK
  Zeitanteil exakt 0.33406942 (gewichtet); gerundeter Zeitanteil × Wohnungsanteil = 245.47
  invoice_parts gleich: True
```

Ebenfalls geprüft und gleich: `share_percentage` aller fünf Positionen, `position_rental_days`/`billed_days` = 184/365 bei TV, Kaltwasser, Allgemeinstrom, leer bei Heizung und Hauswart; `invoice_parts` nur beim Hauswart.

### invoice_parts (Hauswart) gegen die Rechnungen

| Rechnung | Leistungszeitraum (DB) | erwartet | gespeichert |
|---|---|---|---|
| c0000002-2025-…-017, 31.03.2025, 765.00 | 01.01.–31.03.2025 | start 2025-01-01, end 2025-03-31, amount 765, days 0, total 90, kein `noPeriod`, kein `whole` | gleich |
| c0000002-2025-…-020, 30.06.2025, 765.00 | 01.04.–30.06.2025 | 2025-04-01..2025-06-30, 765, 0/91 | gleich |
| c0000002-2025-…-024, 30.09.2025, 765.00 | keiner | Periode 2025-01-01..2025-12-31, 765, 184/365, `noPeriod: true` | gleich |
| c0000002-2025-…-027, 31.12.2025, 765.00 | 01.10.2025–31.01.2026 (123 Tage) | 2025-10-01..2025-12-31, 765 × 92/123 = 572.1951 → 572.20, 92/92, `whole: {start 2025-10-01, end 2026-01-31, amount 765}` | gleich |

Die Rechnungen wurden um 15:02 geändert, die Abrechnung um 15:03:58 erstellt: die gespeicherten Teile gehören zum aktuellen Stand der Rechnungen.

### Gedruckte Zeilen (PDF, Deutsch)

`pdftotext -layout` des gespeicherten PDF (identisch mit `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/dr-weber-241/nina.pdf` und mit dem Download `GET /api/v1/statements/fd3f2fb3-…/pdf`, `cmp` ohne Unterschied) zeigt genau die vom Skript aus den gespeicherten Teilen erwarteten Zeilen:

```
Leistungszeitraum 01.01.2025 – 31.03.2025: CHF 765.00, Ihre Mietstage 0 von 90 Tagen
Leistungszeitraum 01.04.2025 – 30.06.2025: CHF 765.00, Ihre Mietstage 0 von 91 Tagen
Ohne Leistungszeitraum: CHF 765.00, Ihre Mietstage 184 von 365 Tagen der Abrechnungsperiode
Leistungszeitraum 01.10.2025 – 31.01.2026 (Rechnung CHF 765.00), davon 01.10.2025 – 31.12.2025: CHF 572.20, Ihre Mietstage 92 von 92 Tagen
Ihr Anteil: 734.72 × (765.00 × 0/90 + 765.00 × 0/91 + 765.00 × 184/365 + 572.20 × 92/92) / 2'867.20 = 245.45
```

Mit dem Taschenrechner aus den gedruckten Zahlen nachgerechnet: 734.72 × 957.8438 / 2'867.20 = 245.4511 → 245.45, gleich der Spalte «Ihr Anteil». Der gerundete Prozentwert ergäbe 734.72 × 33.41 % = 245.47; die neue Erläuterung sagt das («Der Prozentwert ist gerundet; Ihr Anteil folgt aus der Berechnung unter der Position.»). Die gerenderte Seite (`pdftoppm -png`, `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/daten241/page-1.png`) zeigt die Zeilen lesbar unter «Hauswart», ohne Überlappung; die vierte Zeile bricht um.

### Summen, Verwaltungspauschale, Saldo

```
Summe Positionen 1157.08; Verwaltungspauschale 3.00% = 34.71 (gesp. 34.71); Ihre Nebenkosten 1191.79 (gesp. total_costs 1191.79)
Akonto 6 × 240.00 = 1440.00 (gesp. 1440.00); Saldo vor Rundung -248.21; Rundung +0.01; Saldo -248.2 (gesp. -248.20)
QR-Rechnung erwartet: nein (Rückerstattung)
```

PDF: Zwischensumme 1'157.08, Verwaltungspauschale 34.71, Ihre Nebenkosten 1'191.79, Akonto – 1'440.00, Rückerstattung vor Rundung 248.21, «Rundung auf 5 Rappen – 0.01» (der Betrag wird kleiner, also «–», Regel 8), Rückerstattung 248.20; Kopfkasten «Rückerstattung CHF 248.20». Webseite (`/statements/fd3f2fb3-…`, serverseitig gerendert, per GET mit Persona-Sitzung gelesen): dieselben fünf Beträge der Positionen, Zwischensumme CHF 1'157.08, Verwaltungspauschale CHF 34.71, Gesamtkosten CHF 1'191.79, Akonto − CHF 1'440.00, vor Rundung CHF 248.21, Rundung − CHF 0.01, Saldo: Rückerstattung CHF 248.20.

### QR-Rechnung

Saldo negativ (Rückerstattung): kein Zahlteil erwartet. Das PDF hat 2 Seiten, `pdftotext` findet weder «Zahlteil» noch «Empfangsschein». Damit ist keine QR-Rechnung zu dekodieren. Die gespeicherte `qr_bill_reference` 011959243021421399207209966 hat eine gültige Prüfziffer (Modulo 10 rekursiv: 6). Dass auch Rückerstattungen eine Referenz gespeichert haben, gilt für alle Rückerstattungen der Demodaten (z. B. NK-11111111-2024-0002) und kommt nicht aus dieser Änderung.

## Geprüft und bestanden

- NK-22222222-2025-0005: Mietstage, Schlüsselwerte, alle fünf Abrechnungspositionen (Kosten Liegenschaft, Wohnungsanteil, Zeitanteil, Ihr Anteil, share_percentage, position_rental_days/billed_days), `invoice_parts` des Hauswarts mit `noPeriod` und `whole`, die vier gedruckten Rechnungszeilen und die Zeile «Ihr Anteil», Zwischensumme, Verwaltungspauschale, Ihre Nebenkosten, Akonto, Saldo vor Rundung, Rundung, Saldo; gespeichertes PDF = Kopie von Dr. Weber = Download; Webseite.
- Die übrigen Positionen dieses PDF (ohne `invoice_parts`) drucken weiterhin «184/365 Tage» bzw. den Heizprofil-Prozentwert; die neue Erläuterung erscheint mit den Teilsätzen «Bei einer Rechnung mit Leistungszeitraum …», «Hat eine Abrechnungsposition …», «Der Prozentwert ist gerundet …» und «Bei Heizkosten …», passend zu den Positionen.

## Nicht bestätigt

- **PDF auf Französisch, Italienisch, Englisch:** In `dwello_persona` hat keine Abrechnung ausser NK-22222222-2025-0005 (Sprache `de`) `invoice_parts` (Abfrage über alle 17 Abrechnungen). Ein PDF in einer anderen Sprache entsteht nur über `POST /api/v1/statements/:id/generate-pdf` mit `language`, das das PDF in der Datenbank überschreibt. Das darf ich nicht. Ich habe nur statisch im Diff geprüft, dass `partNoPeriod`, `partBeyond`, `partLine` und `partShare` in fr/it/en dieselben Platzhalter haben wie auf Deutsch (`{amount}`, `{days}`, `{total}`, `{start}`, `{end}`, `{wholeStart}`, `{wholeEnd}`, `{wholeAmount}`, `{apartment}`, `{sum}`, `{costs}`, `{share}`). Die Zahlen sind sprachunabhängig. Beobachtung ohne Schwere (Wortlaut, Sache des fach-reviewer): fr/it/en enden bei `partLine`/`partBeyond` mit «sur {total}» / «su {total}» / «of {total}» ohne «jours/giorni/days», während Deutsch «von {total} Tagen» hat.
- **QR-Code dekodieren:** entfällt, weil die Abrechnung eine Rückerstattung ohne Zahlteil ist (siehe oben). In dieser Datenlage gibt es keine Nachzahlung mit `invoice_parts`.
- **Andere Entwürfe der «Seepark Residenz» 2025** (NK-22222222-2025-0001, -0002, -0004) wurden vor den Änderungen von Dr. Weber erstellt und spiegeln deren Leistungszeiträume nicht. Sie gehören nicht zu den betroffenen Datensätzen und wurden nicht nachgerechnet; der Auftrag nennt nur NK-22222222-2025-0005.
