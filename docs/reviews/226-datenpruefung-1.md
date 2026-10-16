# Datenprüfung #226, Runde 1

- Geprüfter Commit: `cf49fa58` (Diff `fee5c0e9..cf49fa58`), Worktree `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/review-226-daten`
- Daten: `dwello_persona` (nur gelesen), Backend :3301 (`/health` 200), Frontend :3300
- Datensatz: Abrechnung NK-22222222-2025-0005 (`39da2ca2-9c50-4597-aa6a-4db3dff969e0`), Nina Brunner, Wohnung A2, «Seepark Residenz», Mietvertrag `b0000002-0002-0002-0002-000000000003` ab 01.07.2025, Periode 01.01.2025 – 31.12.2025, Sprache des Mieters `de`
- Nachrechnung: `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/dp226/tools/recompute.py` (eigene Regeln aus `nebenkostenabrechnung-anforderungen.md` «Regeln in Dwello» 1, 3, 5, 6, 8, 9 und Glossar; kein Dwello-Code importiert oder kopiert), Ausgabe `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/dp226/recompute.out`

Ergebnis: Alle Beträge, Zeitanteile, `invoice_parts`, die gedruckten Zeilen und die Formel stimmen auf den Rappen. Kein Blocker oder Major. Ein Minor betrifft den Erläuterungstext unter der Tabelle, nicht die Beträge.

## Befunde

| ID | Schweregrad | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| D-1 | Minor | PDF NK-22222222-2025-0005, Erläuterung unter «Kostenübersicht» | Die Erläuterung zum Zeitanteil erklärt auch die neuen Rechnungszeilen «… 0/90 Tage», «… 92/92 Tage» (Tage einer Rechnung mit Leistungszeitraum), also mit dem vorhandenen Zusatz «; bei einer Rechnung mit Leistungszeitraum Ihre Mietstage darin von dessen Tagen in der Periode» | «Zeitanteil: Ihre Mietstage in der Abrechnungsperiode; bei Heizkosten der Anteil nach dem Heizprofil.» Der Zusatz fehlt; die Zeile Hauswart zeigt 50.00 %, nicht 184/365 |

### D-1: Erläuterung des Zeitanteils nennt die Tage der Leistungszeiträume nicht (Minor, Text)

Das ist ein Textbefund, kein Betragsfehler: Die Beträge stimmen. Er gehört inhaltlich zu Dr. Weber bzw. `fach-reviewer`.

Beleg (`pdftotext -layout` des gespeicherten PDF):

```
Hauswart                          Pro Fläche (m²)                          3'060.00              784.13            50.00 %              392.07
  01.01.2025 – 31.03.2025: 765.00, 0/90 Tage
  ...
Kosten Liegenschaft: ... Zeitanteil: Ihre Mietstage in der Abrechnungsperiode; bei Heizkosten
der Anteil nach dem Heizprofil.
```

Ursache: `sharesNote()` in `backend/src/services/pdf.service.ts` setzt `sharesNoteDays` nur, wenn eine Position `shareDays` mit `total !== periodDays` hat. Eine Position nur mit `invoiceParts` löst den Zusatz nicht aus, obwohl ihre Zeilen genau diesen Fall zeigen («x/y Tage» über die Tage eines Leistungszeitraums). Auf dem Basis-Commit hätte die gleiche Position 50.00 % mit derselben Erläuterung gezeigt. Die Lücke bestand also schon, die neuen Zeilen machen sie aber sichtbarer.

Reproduktion: `psql postgresql://dwello:dwello@localhost:5432/dwello_persona -At -c "select pdf_blob from utility_statements where id='39da2ca2-9c50-4597-aa6a-4db3dff969e0'" | base64 -d | pdftotext -layout - - | grep -A2 "Kosten Liegenschaft:"`

## Nachrechnung im Einzelnen

Eingaben aus der Datenbank:
- 4 Wohnungen: A1 68 m², A2 82 m², B1 75 m², B2 95 m². Total 320 m², 4 Einheiten.
- Mietstage: 01.07.2025 – 31.12.2025 = 184 von 365. Gespeichert sind 184, 2025-07-01, 2025-12-31.
- Akonto: 240.00 × 6 Monate = 1'440.00.
- Heizprofil «Heizung + Warmwasser»: Jul 3.7 + Aug 3.6 + Sep 3.7 + Okt 9.5 + Nov 10.7 + Dez 13.0 = 44.2 %. Die Summe der Periode (Jan–Dez) ist 100 %.
- Rechnungen 2025 (Regel 1):
  - Heizung 1'520 + 790 + 395 + 1'410 = 4'115.00. Die Rechnung vom 20.01.2026 mit Leistungszeitraum 01.10.–31.12.2025 zählt ganz. Die Rechnung vom 20.01.2025 mit Leistungszeitraum Q4 2024 zählt nicht.
  - Hauswart: 4 × 765.00 mit Leistungszeitraum je Quartal = 3'060.00.
  - Kaltwasser 2'060.00, Allgemeinstrom 499.30, TV/Kabel 912.00.

| Position | Kosten Liegenschaft | Wohnungsanteil (Schlüssel) | Zeitanteil | Ihr Anteil | DB | PDF | Webseite |
|---|---|---|---|---|---|---|---|
| TV/Kabelanschluss | 912.00 | 912 × 1/4 = 228.00 | 184/365 = 0.5041 | 228.00 × 184/365 = 114.94 | = | = (184/365 Tage) | = 114.94 |
| Kaltwasser | 2'060.00 | 2'060 × 82/320 = 527.875 → 527.88 | 184/365 | 266.11 | = | = | = |
| Hauswart | 3'060.00 | 3'060 × 82/320 = 784.125 → 784.13 | (765×0/90 + 765×0/91 + 765×92/92 + 765×92/92) / 3'060 = 0.5000 | 784.13 × 0.5 = 392.065 → 392.07 | = | = (50.00 %) | = |
| Heizung | 4'115.00 | 4'115 × 82/320 = 1'054.46875 → 1'054.47 | Heizprofil 44.20 % | 1'054.47 × 0.442 = 466.08 | = | = (44.20 %) | = |
| Allgemeinstrom | 499.30 | 499.30 × 82/320 = 127.945625 → 127.95 | 184/365 | 64.50 | = | = | = |

Gespeicherte Hilfswerte:
- `share_percentage` (Ihr Anteil / Kosten Liegenschaft): 12.6031, 12.9180, 12.8127, 11.3264, 12.9181. Alle stimmen.
- `position_rental_days`/`billed_days`: 184/365 bei TV, Kaltwasser und Allgemeinstrom. Bei Hauswart und Heizung sind sie leer, wie Regel 5 verlangt (Rechnungen über verschiedene Tage bzw. Heizprofil).

`invoice_parts` des Hauswarts (gespeichert = erwartet):

| start | end | amount | total (Tage in der Periode) | days (Mietstage darin) |
|---|---|---|---|---|
| 2025-01-01 | 2025-03-31 | 765 | 90 | 0 |
| 2025-04-01 | 2025-06-30 | 765 | 91 | 0 |
| 2025-07-01 | 2025-09-30 | 765 | 92 | 92 |
| 2025-10-01 | 2025-12-31 | 765 | 92 | 92 |

- Die Summe der Beträge, 3'060, entspricht Kosten Liegenschaft.
- Die anderen Positionen haben keine `invoice_parts`. Das ist richtig: Alle Rechnungen einer solchen Position haben dieselben Tage, oder die Position läuft nach dem Heizprofil.
- Die anderen Seepark-Abrechnungen 2025 (0001, 0002, 0004) wurden vor der Änderung der Hauswart-Rechnungen erstellt und haben keine `invoice_parts`. Sie sind nicht betroffen.

Gedruckte Zeilen und Formel (PDF, Seite 1), Zeichen für Zeichen gleich der erwarteten Ausgabe des Skripts (ohne Tausendertrennzeichen im Skript):

```
01.01.2025 – 31.03.2025: 765.00, 0/90 Tage
01.04.2025 – 30.06.2025: 765.00, 0/91 Tage
01.07.2025 – 30.09.2025: 765.00, 92/92 Tage
01.10.2025 – 31.12.2025: 765.00, 92/92 Tage
(765.00 × 0/90 + 765.00 × 0/91 + 765.00 × 92/92 + 765.00 × 92/92) / 3'060.00 = 50.00 %
```

Summen:

| Wert | Erwartet | DB | PDF | Webseite |
|---|---|---|---|---|
| Zwischensumme | 114.94 + 266.11 + 392.07 + 466.08 + 64.50 = 1'303.70 | – | 1'303.70 | 1’303.70 |
| Verwaltungspauschale 3 % | 39.111 → 39.11 | 39.11 | 39.11 | 39.11 |
| Ihre Nebenkosten | 1'342.81 | 1342.81 | 1'342.81 | 1’342.81 |
| Geleistete Akontobeiträge | 1'440.00 | 1440.00 | – 1'440.00 | − 1’440.00 |
| Saldo vor Rundung | −97.19 (Rückerstattung 97.19) | – | 97.19 | 97.19 |
| Rundung auf 5 Rappen | Der Betrag steigt von 97.19 auf 97.20, also «+ 0.01» (Regel 8) | – | + 0.01 | + 0.01 |
| Saldo | −97.20 (Rückerstattung) | −97.20 | 97.20 | 97.20 |
| Frist | 16.10.2026 + 30 Tage = 15.11.2026 | 2026-11-15 | 15.11.2026 | 15.11.2026 |

Skriptausgabe (Auszug):

```
Mietstage 184/365 (2025-07-01..2025-12-31); stored 184 2025-07-01..2025-12-31
Caretaker: 4 Rechnung(en), tage
  Wohnungsanteil     expected       784.13 stored       784.13 OK
  Zeitanteil         expected       0.5000 stored          0.5 OK
  Ihr Anteil         expected       392.07 stored       392.07 OK
  Formel erwartet: (765.00 × 0/90 + 765.00 × 0/91 + 765.00 × 92/92 + 765.00 × 92/92) / 3060.00 = 50.00 %
  invoice_parts      expected [...] stored [...] OK
Zwischensumme 1303.70
Saldo vor Rundung -97.19 Rundung -0.01
  Saldo              expected       -97.20 stored        -97.2 OK
ALL OK
```

Reproduktion: `python3 -I /tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/dp226/tools/recompute.py`

QR-Rechnung:
- Der Saldo ist eine Rückerstattung. Nach Anforderungen Thema 6 und PDF-Aufbau Punkt 10 gibt es deshalb keinen Zahlteil.
- Beide Seiten wurden mit `pdftoppm -png` gerendert (`/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/dp226/page-1.png`, `page-2.png`). Sie zeigen keinen Zahlteil, und `pdfimages -list` findet keine Bilder. Das ist richtig.
- Die gespeicherte `qr_bill_reference` `002731994960365909342726183` hat 27 Stellen. Ihre Prüfziffer (Modulo 10 rekursiv) ist 3 und stimmt.

Gespeichertes PDF: `pdf_blob` (base64) ist byte-gleich mit `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/dr-weber-226/nina.pdf` (`cmp`). Das PDF wurde um 09:39:28 erzeugt, nach der letzten Rechnungsänderung um 09:38:19 und nach der Abrechnung um 09:39:06.

## Geprüft und bestanden

- Stammdaten der Abrechnung NK-22222222-2025-0005: Mietstage, Mietbeginn und -ende, Periode
- Alle 5 Abrechnungspositionen: Kosten Liegenschaft, Wohnungsanteil, Zeitanteil, Ihr Anteil, `share_percentage`, `position_rental_days`/`billed_days`; dazu in der Datenbank, im PDF (de) und auf der Webseite `/statements/39da2ca2-…` (alle Positionen und Beträge, per serverseitig gerendertem HTML)
- `invoice_parts` Hauswart gegen die vier Rechnungen `c0000002-2025-4000-8000-000000000017/20/24/27`; keine `invoice_parts` bei den übrigen vier Positionen
- PDF: vier Rechnungszeilen und die Formel des Hauswarts, Zeitanteil 50.00 %
- Zwischensumme, Verwaltungspauschale, Ihre Nebenkosten, Akonto, Saldo vor Rundung, Rundung (+ 0.01), Saldo −97.20 sowie Rückerstattungsfrist (Datenbank, PDF, Webseite)
- Kein Zahlteil bei Rückerstattung; Prüfziffer der gespeicherten QR-Referenz

## Nicht bestätigt

- PDF auf Französisch, Italienisch und Englisch: Der Mieter hat die Sprache `de`, gespeichert ist nur das deutsche PDF. Ein PDF in einer anderen Sprache entstünde nur, wenn die Sprache des Mieters geändert würde. Das hätte die Persona-Daten verändert, deshalb habe ich es nicht getan. Die Zeilen nutzen `t.days` der jeweiligen Sprache; geprüft habe ich das nicht.
- QR-Rechnung (IBAN, Betrag, Referenz, Mitteilung, Schuldner): Für diesen Datensatz gibt es keine, weil der Saldo eine Rückerstattung ist. Eine Nachzahlung mit `invoice_parts` gibt es in `dwello_persona` nicht.
- Webseite: Sie zeigt weder Zeitanteil noch Rechnungszeilen. Die Änderung betrifft laut Auftrag nur das PDF, deshalb gibt es dazu keinen Vergleich.
