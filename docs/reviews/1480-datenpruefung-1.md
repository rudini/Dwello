# Datenprüfung 1480, Runde 1: Seepark Residenz, Abrechnungen 2025

Geprüfter Stand: Branch `ccr-153ae8d3-conoid-1480` in `/home/user/Dwello`, HEAD `f2eec9e`. Datenbank `dwello_persona`, gelesen am 26.11.2026 zwischen 20:09 und 20:14 UTC. Nichts verändert, keine Tests gelaufen.

## Ergebnis

Keine Befunde. Alle vier Abrechnungen 2025 stimmen auf den Rappen mit meiner eigenen Nachrechnung überein, in der Datenbank, auf den Webseiten (Screenshots) und in den zwei vorhandenen PDFs mit QR-Rechnung.

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| – | – | – | – | keine Abweichung gefunden |

Geprüft: Rechnung 3633ae9e (Pellets), Abrechnungen NK-22222222-2025-0001 (Weber, A1), -0002 (Meier, A2), -0003 (Brunner, A2), -0004 (Bernasconi, B2), PDFs und QR-Rechnung von -0002 und -0003, Anteil des Vermieters (Leerstand B1).

## Vorgehen

Skript: `/tmp/claude-0/-home-user-Dwello/c886409d-428b-57e9-8b50-0b7fc9169d0e/scratchpad/dp1480/recompute.py` (Python, Decimal). Es liest Rechnungen, Verteilschlüssel, Wohnungen, Mietverträge, Heizprofil und Akonto per psql aus der Datenbank. Es nutzt keinen Dwello-Code. Regeln aus `docs/nebenkostenabrechnung-anforderungen.md` (Thema «Regeln», Nr. 1 bis 10), Ausgabe in `expected.json` im selben Ordner.

Eingaben:
- Periode 01.01.2025 – 31.12.2025 (365 Tage). Gebäude `no_tank = true`, keine `fuel_stocks`.
- Wohnungen 68, 82, 75, 95 m², zusammen 320 m²; 4 Einheiten. B1 (75 m²) hat 2025 keinen Mietvertrag.
- Zählende Rechnungen 2025:

| Kategorie | Betrag |
|---|---|
| Gartenpflege | 362.00 |
| TV/Kabelanschluss | 912.00 |
| Hauswart | 3'060.00 |
| Kaltwasser | 2'060.00 |
| Allgemeinstrom | 499.30 |
| Heizung | 5'315.00 |

- Gartenpflege: 730.00 für 01.07.2024 – 30.06.2025, davon 181 von 365 Tagen in 2025, also 362.00.
- Heizung: Fernwärme 1'520.00, 790.00, 395.00 und 1'410.00 (Q4 mit Rechnungsdatum 20.01.2026, Leistungszeitraum Q4 2025) plus die Pelletrechnung 1'200.00. Die Fernwärme-Q4-2024-Rechnung (1'350.00, Datum 20.01.2025) zählt nicht in 2025.
- Pelletrechnung: eintägiger Leistungszeitraum 05.10.2025 in einer Brennstoffkategorie, Gebäude ohne Tank, deshalb als Lieferung über die ganze Periode.
- Heizprofil «Heizung + Warmwasser»: Monatswerte zusammen 100.00 %.

Anteil je Mietvertrag (nach Regeln 3, 5, 8, 9): Wohnungsanteil = Kosten × Schlüsselanteil, auf 2 Stellen gerundet. Zeitanteil = Mietstage / Tage, bei Heizung und Teilperiode nach Heizprofil je Rechnung. Anteil = Wohnungsanteil × Σ(Rechnung × Anteil) / Σ Rechnung. Dazu Verwaltungspauschale auf die Zwischensumme, minus Akonto, Saldo für den Mieter auf 5 Rappen gerundet.

## Vergleich Datenbank, Nachrechnung, Web, PDF

Alle Beträge CHF. «DB» = `utility_statement_line_items` und `utility_statements`; «Web» = Screenshots des Persona-Laufs; «PDF» = Text der Datenbank-PDFs (`pdftotext -layout`).

| Position | Weber A1 (0001) | Meier A2 (0002) | Brunner A2 (0003) | Bernasconi B2 (0004) |
|---|---|---|---|---|
| Gartenpflege | 76.93 | 92.76 | 0.00 | 107.47 |
| TV/Kabelanschluss | 228.00 | 113.06 | 114.94 | 228.00 |
| Hauswart | 650.25 | 388.84 | 395.29 | 908.44 |
| Heizung | 1'129.44 | 763.52 | 598.45 | 1'577.89 |
| Kaltwasser | 437.75 | 261.77 | 266.11 | 611.56 |
| Allgemeinstrom | 106.10 | 63.45 | 64.50 | 148.23 |
| Zwischensumme | 2'628.47 | 1'683.40 | 1'439.29 | 3'581.59 |
| Verwaltungspauschale | 3 %: 78.85 | 3 %: 50.50 | 3 %: 43.18 | 2.5 %: 89.54 |
| Ihre Nebenkosten (`total_costs`) | 2'707.32 | 1'733.90 | 1'482.47 | 3'671.13 |
| Akonto | 2'400.00 (12 × 200) | 1'320.00 (6 × 220) | 1'440.00 (6 × 240) | 3'120.00 (12 × 260) |
| Saldo vor Rundung | 307.32 | 413.90 | 42.47 | 551.13 |
| Rundung | −0.02 | keine | −0.02 | −0.03 |
| Saldo (Nachzahlung) | 307.30 | 413.90 | 42.45 | 551.10 |

Jede Zelle ist in der Nachrechnung, in der Datenbank und im Web (Screenshots 12, 14, 15, 16) gleich. Meier und Brunner zusätzlich im PDF.

Heizung im Einzelnen:
- Kosten des Gebäudes 5'315.00, Wohnungsanteil A2 1'361.97 (5'315 × 82/320 = 1'361.96875). Meier: 1'361.97 × (1'520 × 100 % + 790 × 100 % + 395 × 0 % + 1'200 × 55.80 % + 1'410 × 0 %) / 5'315 = 763.52, Zeitanteil 56.06 %. Brunner: 1'361.97 × (0 + 0 + 395 × 100 % + 1'200 × 44.20 % + 1'410 × 100 %) / 5'315 = 598.45, Zeitanteil 43.94 %.
- Heizprofil Meier Jan–Jun 13.6 + 12.1 + 11.5 + 9.3 + 5.6 + 3.7 = 55.80 %, Brunner Jul–Dez 3.7 + 3.6 + 3.7 + 9.5 + 10.7 + 13.0 = 44.20 %. Zusammen 100.00 %: die Lieferung wird für A2 vollständig verteilt.
- Meier + Brunner: 763.52 + 598.45 = 1'361.97 = Wohnungsanteil A2. Gleiches gilt für TV (228.00), Hauswart (784.13), Kaltwasser (527.88), Allgemeinstrom (127.95) und Gartenpflege (92.76 + 0.00).
- Anteil aus `invoice_parts` der DB (Teil der Pelletrechnung, `delivery: "noTank"`): Meier `days 181, percent 55.8`, Brunner `days 184, percent 44.2`, Gesamtdauer je 365 Tage. Stimmt mit der Nachrechnung.
- Nur die Pelletrechnung (nicht ausgewiesen): 1'200 × 82/320 = 307.50, Meier 171.585 und Brunner 135.915. Die Abrechnungen zeigen diese Teilbeträge nirgends, nur die gewichtete Gesamtposition.

PDFs (Meier und Brunner, je 3 Seiten, Text aus der Datenbank):
- Die Kostenübersicht, die Zeile «Rechnung vom 10.10.2025, Lieferung von Heizmaterial, gilt für die ganze Abrechnungsperiode: CHF 1'200.00, Anteil nach Heizprofil: 55.80 %» (Brunner 44.20 %), die Berechnung «Ihr Anteil: 1'361.97 × Zeitanteil (…) / 5'315.00 = 763.52» (Brunner 598.45), Zwischensumme, Verwaltungspauschale, Akontobeiträge und Saldo sind in Betrag und Rechnungsweg gleich wie die Nachrechnung.
- Brunner zeigt «Nachzahlung vor Rundung 42.47», «Rundung auf 5 Rappen – 0.02», «Nachzahlung 42.45». Meier hat keine Rundungszeile (413.90 ist schon auf 5 Rappen).
- Der Absatz zur Erläuterung nennt «Für das Gebäude ist kein Tank erfasst, oder der Tank ist stillgelegt. Die Lieferungen von Heizmaterial («Heizung») … sind deshalb als Verbrauch abgerechnet, also der Einkauf; …».

## Anteil des Vermieters (Leerstand)

Gebäudekosten minus die Summe aller Mieteranteile der vier Abrechnungen:

| Position | Gebäude | Summe Mieter | Rest beim Vermieter | Anteil B1 (75/320, Referenz) |
|---|---|---|---|---|
| Gartenpflege | 362.00 | 277.16 | 84.84 | 84.84 |
| TV/Kabelanschluss | 912.00 | 684.00 | 228.00 | 228.00 (1/4) |
| Hauswart | 3'060.00 | 2'342.82 | 717.18 | 717.19 |
| Heizung | 5'315.00 | 4'069.30 | 1'245.70 | 1'245.70 |
| Kaltwasser | 2'060.00 | 1'577.19 | 482.81 | 482.81 |
| Allgemeinstrom | 499.30 | 382.28 | 117.02 | 117.02 |

Der Rest ist überall der Anteil der leeren Wohnung B1 (Abweichung höchstens 1 Rappen durch Rundung der Mieteranteile bei Hauswart). Der Pelletanteil von B1 (1'200 × 75/320 = 281.25) bleibt beim Vermieter. Die Lücken zwischen Meier und Brunner sind null (kein Leerstand in A2, Auszug 30.06., Einzug 01.07.). Kein Anteil des Vermieters wird auf Mieter verschoben.

## QR-Rechnungen

Seite 3 jedes PDFs mit `pdftoppm -png -r 300 -f 3 -l 3` gerendert, mit `zxing-cpp` (Python, installiert in `/tmp/claude-0/-home-user-Dwello/c886409d-428b-57e9-8b50-0b7fc9169d0e/scratchpad/dp1480/venv`) dekodiert. Skripte `dec.py`, `chk.py`, Bilder `qr-meier-3.png`, `qr-brunner-3.png` im selben Ordner.

| Feld | NK-…-0002 Meier | NK-…-0003 Brunner |
|---|---|---|
| Header | SPC / 0200 / 1 | SPC / 0200 / 1 |
| IBAN | CH4431999123000889012 (mod 97 = 1, QR-IID 31999, entspricht `configuration.iban`) | gleich |
| Zahlbar an | Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, CH (gleich wie `configuration`) | gleich |
| Betrag, Währung | 413.90 CHF (gleich Saldo und PDF) | 42.45 CHF (gleich Saldo und PDF) |
| Zahlbar durch | S, Sarah Meier, Hirschmattstrasse 21, 6003 Luzern, CH (gleich `tenants`) | S, Nina Brunner, Seeweg 15, 6003 Luzern, CH (gleich `tenants`) |
| Referenztyp / Referenz | QRR 009608727668776989575518180 | QRR 005320758771263026277658480 |
| Prüfziffer (mod 10 rekursiv) | berechnet 0, gedruckt 0 | berechnet 0, gedruckt 0 |
| Referenz = `qr_bill_reference` und 20 Hex-Stellen der Abrechnungs-ID dezimal | ja | ja |
| Mitteilung | Nebenkostenabrechnung NK-22222222-2025-0002 | Nebenkostenabrechnung NK-22222222-2025-0003 |
| Trailer | EPD | EPD |

Die gedruckte Referenz im Zahlteil (00 96087 27668 77698 95755 18180 und 00 53207 58771 26302 62776 58480) entspricht dem QR-Inhalt. Die Prüfziffer rechnete ich mit der SIX-Tabelle 0 9 4 6 8 2 7 1 3 5 und bestätigte sie an der SIX-Beispielreferenz 21 00000 00003 13947 14300 09017 (Prüfziffer 7).

## Nicht bestätigt

- **PDFs und QR-Rechnungen von NK-22222222-2025-0001 (Weber) und -0004 (Bernasconi):** Es gibt keine PDFs (`pdf_blob` leer). Sie zu erzeugen würde Daten der Persona-Datenbank verändern. Die Beträge dieser beiden Abrechnungen sind aber in Datenbank und Web bestätigt (QR-Betrag 307.30 und 551.10 nicht gelesen).
- **PDFs in fr, it, en:** Mieter Meier, Brunner und Weber haben `language = de`, nur Bernasconi `it`. Ein PDF in einer anderen Sprache entsteht nur durch `POST /api/statements/:id/generate-pdf` mit einer Sprache, das den gespeicherten PDF-Blob überschreibt. Das habe ich nicht getan. Ich habe nur die Textbausteine gelesen (`/home/user/Dwello/backend/src/services/pdf-texts/{de,fr,it,en}.ts`: `partDeliveryFuel`, `sharesNoteDeliveryNoTank` und `messages/{de,fr,it,en}.json`: `statements_part_delivery_fuel_profile`). Alle vier Sprachen haben die Platzhalter {amount}, {days}, {total}, {percent}, {categories}. Gerenderte Zeilen und Beträge in fr, it und en: nicht gesehen. Die Beträge hängen nicht von der Sprache ab.
- **Webseite live:** Die Webseite verlangt eine Anmeldung (OAuth). Ich habe kein Token ausgestellt und mich nicht angemeldet. Der Vergleich mit dem Web stützt sich auf die Screenshots des Persona-Laufs (Dr. Weber, 20:06 bis 20:07): `/tmp/claude-0/-home-user-Dwello/c886409d-428b-57e9-8b50-0b7fc9169d0e/scratchpad/dr-weber-1480/12-meier-after.png`, `14-brunner.png`, `15-weber.png`, `16-bernasconi.png`. Die Datenbankwerte sind seither gleich geblieben (`balance`, `total_costs`).
- **Web und PDF in fr, it, en der Webseite:** nicht angesehen, aus demselben Grund. Die Beträge sind sprachunabhängig.

Hinweis: Das PDF von NK-22222222-2025-0002 wurde während meiner Prüfung neu erzeugt (`pdf_generated_at` 20:11:08, vorher 20:07:41), vermutlich von einer anderen Sitzung. Text und Beträge sind identisch mit der Kopie des Persona-Laufs (`diff` der `pdftotext`-Ausgabe leer). Ich habe das aktuelle PDF aus der Datenbank geprüft (`db-meier.pdf`, `db-brunner.pdf` im Ordner `dp1480`); QR-Inhalt und Beträge stammen aus diesem Stand.

Geprüft: Rechnung 3633ae9e-abb8-45f5-a06f-d286ed9130fa; Abrechnungen NK-22222222-2025-0001, -0002, -0003, -0004 (Positionen, Anteile, Verwaltungspauschale, Akonto, Saldo, Rundung auf 5 Rappen); PDF und QR-Rechnung NK-22222222-2025-0002 und -0003; Anteil des Vermieters (B1) je Position.
