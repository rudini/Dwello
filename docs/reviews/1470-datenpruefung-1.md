# Datenprüfung #1470, Runde 1

Geprüfter Stand: Worktree `review-1470-daten` (Commit 5b7cfe1). Die Datenbank `dwello_persona` und das PDF stammen vom laufenden Stack, der auf 5b7cfe1 läuft. Der Commit 4ac21d0 (nur PDF-Texte) ist am Stack nicht geprüft, siehe «Nicht bestätigt».

## Befunde

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|----|---------|-----------|----------|-------------|
| – | – | – | – | Keine Befunde. Alle Beträge, der Saldo und die QR-Rechnung stimmen mit meiner Neuberechnung überein. |

Geprüft: Abrechnung NK-11111111-2025-0005 (Claudia Steiner, Wohnung 3.02, Entwurf) mit allen 8 Abrechnungspositionen (Lift, Hauswart, Kaltwasser, Allgemeinstrom, Gartenpflege, Kehricht, Heizung, Kaminfeger) in der Datenbank, auf der Webseite und im deutschen PDF; Heizposition mit Lieferung MZ-2025-010 und Brennerservice MZ-2025-1470; Akontobeiträge; Saldo und Rundung auf 5 Rappen; QR-Rechnung Seite 3 (IBAN, Betrag, Referenz samt Prüfziffer, Mitteilung, Zahlungspflichtige).

## Neuberechnung (Skript `/tmp/claude-0/-home-user-Dwello/1050036a-1394-59ea-a01a-2a53c78f1ce6/scratchpad/dp-1470/recompute.py`)

Das Skript liest Rechnungen, Wohnungen, Verteilschlüssel, Heizprofil und Mietvertrag per `psql` (nur SELECT) aus `dwello_persona`. Es importiert keinen Dwello-Code. Regeln aus `docs/nebenkostenabrechnung-anforderungen.md`, Thema 5, 8, 9 und 10.

Eingaben:
- Fläche 55.00 von 492.50 m², 1 von 6 Wohnungen.
- Mietstage 15.08.–31.12.2025 = 139 von 365 Tagen.
- Verwaltungspauschale 3 %.
- Akonto CHF 180.00 pro Monat ab 15.08.2025.
- Tankbestand: nur die Ablesung vom 31.12.2023 ist vorhanden, es gibt weder Anfangs- noch Endbestand für 2025. `buildings.no_tank = false`.

Heizung (Verteilschlüssel «Heizung 70 % Fläche / 30 % Einheit»):
- Wohnungsanteil: 6'933.00 × (0.7 × 55 / 492.5 + 0.3 / 6) = 888.62.
- Lieferung MZ-2025-010, CHF 6'565.00, über die ganze Periode nach Heizprofil:
  - Mietermonate 1.97 (3.6 × 17/31) + 3.70 + 9.50 + 10.70 + 13.00 = 38.87 %.
  - Monate der Periode im Profil: 100.00 %.
  - Anteil 38.87 / 100 = 38.87 %.
- Brennerservice MZ-2025-1470, CHF 368.00, 01.07.–31.12.2025:
  - Monate im Profil: 3.7 + 3.6 + 3.7 + 9.5 + 10.7 + 13 = 44.20 %.
  - Mietermonate: 38.87 %.
  - Anteil 38.87 / 44.20 = 87.94 %.
- Zeitanteil der Position: (6'565 × 38.87 % + 368 × 87.94 %) / 6'933 = 41.4746 %, gedruckt 41.47 %.
- Ihr Anteil: 888.62 × 0.414746… = 368.55.
- Die Varianten «Summe der Teile × Schlüsselanteil» und «Teile auf zwei Stellen gerundet» ergeben ebenfalls 368.55. Rechnet man mit dem auf 4 Stellen gerundeten Zeitanteil 0.4147, ergibt das 368.51. Dwello rechnet ungerundet, wie bei den übrigen Positionen (z. B. Lift 281.67 × 139/365 = 107.27).

Übrige Positionen (Wohnungsanteil / Zeitanteil / Ihr Anteil):

| Position | Kosten | Wohnungsanteil | Zeitanteil | Ihr Anteil |
|---|---|---|---|---|
| Lift | 1'690.00 | 281.67 | 139/365 | 107.27 |
| Hauswart | 3'680.00 | 410.96 | 139/365 | 156.50 |
| Kaltwasser | 3'840.00 | 428.83 | 139/365 | 163.31 |
| Allgemeinstrom | 762.80 | 85.19 | 139/365 | 32.44 |
| Gartenpflege | 935.00 | 104.42 | 139/365 | 39.77 |
| Kehricht | 990.00 | 165.00 | 139/365 | 62.84 |
| Kaminfeger | 335.00 | 37.41 | 38.87 % (Heizprofil) | 14.54 |

Summen:
- Zwischensumme 945.22.
- Verwaltungspauschale 3 % = 28.3566, gerundet 28.36.
- Ihre Nebenkosten 973.58.
- Akonto: 17/31 × 180 = 98.71, plus 4 × 180 = 720.00, zusammen 818.71.
- Saldo vor Rundung 154.87. Gerundet auf 5 Rappen zugunsten des Mieters (Nachzahlung abgerundet): 154.85, Rundung – 0.02.

Vergleich mit den gespeicherten Werten und dem PDF. Alle Werte stimmen auf den Rappen überein:
- `utility_statements`: `total_costs` 973.58, `management_fee` 28.36, `total_advance_payments` 818.71, `balance` 154.85, `advance_lines` 98.71 + 720.
- `utility_statement_line_items`: `total_amount`, `apartment_share`, `period_share`, `tenant_share` und `share_percentage` aller 8 Positionen. Heizung: 6933.00 / 888.62 / 0.4147 / 368.55 / 5.3159. Kaminfeger: 0.3887 / 14.54. Die Summe der `tenant_share` ist 945.22.
- Heizung, `invoice_parts` und `invoices`: Teil 1 (Lieferung) mit `delivery: true`, 139 von 365 Tagen, 38.87 %, CHF 6565, Zeitraum 01.01.–31.12.2025. Teil 2 mit 139 von 184 Tagen, 87.94 %, CHF 368, 01.07.–31.12.2025.
- Alle 20 Rechnungen der Periode stehen in genau einer Position, keine fehlt oder ist doppelt.
- PDF (Text mit `pdftotext`, `dp-1470/stored.txt`): jede Zeile der Kostenübersicht, die Zeile «Ihr Anteil: 888.62 × Zeitanteil (6'565.00 × 38.87 % + 368.00 × 87.94 %) / 6'933.00 = 368.55», die Monatsanteile, Zwischensumme, Verwaltungspauschale, Akontozeilen, «Nachzahlung vor Rundung 154.87», «Rundung auf 5 Rappen – 0.02» und «Nachzahlung CHF 154.85». Die gespeicherte `pdf_blob` und die von der Persona heruntergeladene `weber-1470/steiner.pdf` haben denselben Text (diff leer).
- Webseite (Screenshot der Persona `weber-1470/12-after-pdf.png`): Beträge, Zeitanteile (41.47 %, 38.87 % nach Heizprofil, 139/365), Anteile in Prozent (Heizung 5.32 %, Kaminfeger 4.34 %, Lift 6.35 %, Hauswart 4.25 %), Zwischensumme, Verwaltungspauschale, Akonto, Saldo vor Rundung 154.87, Rundung – CHF 0.02 und Saldo Nachzahlung CHF 154.85. Die Zeile der Lieferung zeigt «Lieferung in den Tank, gilt für die ganze Abrechnungsperiode: CHF 6'565.00, Anteil nach Heizprofil: 38.87 %».

## QR-Rechnung

Es gibt kein Decoder-Paket in der Umgebung und ich durfte keines installieren. Ich habe daher einen eigenen QR-Decoder geschrieben (`dp-1470/qrdec.py`: Version 11, Fehlerkorrekturstufe M, Maske 0, Format-BCH geprüft, Reed-Solomon-Syndrome aller 5 Blöcke gleich null, Segmente Byte und Numerisch). Er dekodiert das eingebettete Bild von Seite 3 (`pdfimages`, `dp-1470/img-000.png`). Das Schweizer Kreuz ist ein Vektor-Overlay und nicht im Rasterbild. Das ist nicht der Dekodierung durch einen Bank-Scanner gleichwertig, die Decodierung ist aber vollständig fehlerkorrekturgeprüft.

Inhalt:

| Feld | Wert | Prüfung |
|---|---|---|
| Header | SPC / 0200 / 1 | in Ordnung |
| IBAN | CH4431999123000889012 | gleich `configuration.iban`, mod 97 = 1, QR-IID 31999 |
| Kreditor | S, Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, CH | gleich der Adresse im PDF |
| Betrag, Währung | 154.85 CHF | gleich Saldo |
| Zahlungspflichtiger | S, Claudia Steiner, Bahnhofstrasse 42, 8001 Zürich, CH | gleich dem PDF |
| Referenztyp, Referenz | QRR 007112941690320101601262831 | gleich `qr_bill_reference`, Prüfziffer (Modulo 10 rekursiv) über die ersten 26 Stellen = 1, in Ordnung |
| Mitteilung | Nebenkostenabrechnung NK-11111111-2025-0005 | in Ordnung |
| Schluss | EPD | in Ordnung |

Der Text auf Empfangsschein und Zahlteil (Konto, Referenz, Betrag CHF 154.85, Zahlbar durch) stimmt mit dem QR-Inhalt überein.

## Nicht bestätigt

- **PDF in Französisch, Italienisch und Englisch:** Nicht geprüft. Die Sprache wird beim Erzeugen festgelegt (`POST /statements/:id/generate-pdf`, `body.language`); `GET /statements/:id/pdf` liefert nur das gespeicherte PDF. Ein neues PDF zu erzeugen würde `pdf_blob` ändern, das war nicht erlaubt. Die vier Dateien `dp1470/s_{de,fr,it,en}.pdf` aus dem ersten, abgebrochenen Lauf haben alle denselben deutschen Text (Textdiff gegen `stored.txt` leer), sind also nur die gespeicherte deutsche Fassung viermal. Die Beträge sind sprachunabhängig. Die neuen Textschlüssel `partDelivery` und `sharesNoteDelivery` habe ich im Quelltext (`backend/src/services/pdf-texts/{fr,it,en}.ts`, Diff gegen origin/main) geprüft: die Platzhalter sind gleich wie in `de.ts`. Die gerenderte Zahlenschreibweise in diesen Sprachen ist nicht angesehen.
- **Commit 4ac21d0 (neue PDF-Texte `heatingNoteDelivery`, längere `sharesNoteDelivery`):** Der laufende Stack zeigt noch 5b7cfe1. Im PDF steht dort unter «Heiz- und Warmwasserkosten» noch «38.87 % für eine Rechnung ohne Leistungszeitraum», obwohl die Lieferung (mit Leistungszeitraum am Lieferdatum) ebenfalls zählt. Im Diff 5b7cfe1..4ac21d0 in `pdf-heating.ts` und `pdf-texts/*.ts` ist das durch `heatingNoteDelivery` ersetzt («für eine Rechnung, die für die ganze Abrechnungsperiode gilt»). Das PDF mit diesen Texten habe ich nicht gesehen. Amounts ändern sich mit 4ac21d0 laut Diff nicht (nur Texte).
- **Webseite:** Ich habe sie nicht selbst abgerufen (Anmeldung nötig, kein GET ohne Sitzung). Verglichen habe ich den Screenshot der Persona (`weber-1470/12-after-pdf.png`), der kleine Schrift im Gesamtbild zeigt; die Werte oben sind daraus gelesen. Die Webseiten in fr/it/en habe ich nicht angesehen.
- **Weitere Fälle der Änderung:** Nicht geprüft habe ich Gebäude mit `no_tank = true` in einer Periode ohne Tankbestand und Lieferungen in einer Periode mit Anfangs- und Endbestand (Verbrauchsrechnung). Der Auftrag nannte nur diesen einen Datensatz.
