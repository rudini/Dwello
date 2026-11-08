# Datenprüfung #707 (Demodaten), Commit ea0f7a0

Geprüft gegen: Worktree `/tmp/claude-0/-home-user-Dwello/357df375-575f-5bf7-9a62-5d4a4f57a152/scratchpad/review-707-daten`, laufende App mit `dwello_persona` (nur lesend), Backend :3301, Frontend :3300.

Ergebnis: keine Abweichung gefunden. Keine Blocker, Major oder Minor.

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|----|---------|-----------|----------|-------------|
| – | – | – | – | keine Befunde |

## Vorgehen

- Eigenes Skript `/tmp/claude-0/-home-user-Dwello/357df375-575f-5bf7-9a62-5d4a4f57a152/scratchpad/dp/recompute.py` (Python, Decimal). Es liest Rechnungen, Verteilschlüssel, Wohnungen, Mietverträge, Akonto-Staffel und Heizprofil aus der Datenbank. Es nutzt keinen Dwello-Code. Regeln aus `docs/nebenkostenabrechnung-anforderungen.md`, «Regeln in Dwello» 1, 3, 5, 8, 9.
- Das Skript rechnet pro Seepark-Abrechnung: Rechnungen der Periode (Leistungszeitraum nach Tagen aufgeteilt), Wohnungsanteil nach Schlüssel (m² bzw. Einheit, kaufmännisch auf 2 Stellen), Zeitanteil (Mietstage im Leistungszeitraum, Heizung nach Heizprofil und Betrag gewichtet), Verwaltungspauschale, Akonto, Saldo (Nachzahlung ab-, Rückerstattung auf 5 Rappen aufgerundet). Es vergleicht gegen `utility_statements` und `utility_statement_line_items`. Ergebnis: `DIFFS: 0`, alle Zeilen OK. Reproduzieren: `python3 -I recompute.py` im Ordner `dp`.
- Web-Seite: `/statements/<id>` für alle 7 Seepark-Abrechnungen, mit selbst signiertem Persona-JWT als Cookie abgerufen (`dp/webcheck.py`). Die Seite nennt jeden Betrag der Datenbank (Positionen, Wohnungsanteil, Zwischensumme, Verwaltungspauschale, Total, Akonto, Saldo). Auch die 4 Mietstage-Brüche (`184/184`, `181/181`, `0/181`, `184/365`, `181/365`) stimmen.
- PDF: die gespeicherten PDFs (`pdf_blob`, nur gelesen, nicht über den GET-Endpunkt, der bei Entwürfen neu erzeugt und schreibt) mit `pdftotext -layout` gelesen (`dp/pdfcheck.py`). Jeder Betrag jeder Position und der Summen steht darin.
- QR-Rechnung: `pdftoppm -png -r 300` der letzten Seite, dekodiert mit `zxing-cpp` im venv `dp/venv` (`dp/qr.py`). Geprüft: SPC-Version 0200, IBAN (Prüfsumme mod 97), Betrag, Währung, Schuldner, Referenztyp QRR, 27-stellige Referenz mit Prüfziffer (Modulo 10), Mitteilung. Die Referenz gleicht `qr_bill_reference` in der Datenbank.

## Nachgerechnete Werte

Gartenpflege SR-2024-016: CHF 730.00, 01.07.2024 – 30.06.2025, 365 Tage, davon 184 Tage 2024 und 181 Tage 2025. 730 × 184/365 = 368.00, 730 × 181/365 = 362.00 (zusammen 730.00).

| Abrechnung | Mieter | Mietstage | Gartenpflege Wohnungsanteil / Ihr Anteil | Saldo (gerundet) | paid_amount |
|---|---|---|---|---|---|
| NK-22222222-2024-0001 | Weber A1 | 366 (Garten 184/184) | 78.20 / 78.20 | 10.30 | 10.30 |
| NK-22222222-2024-0002 | Meier A2 | 366 (184/184) | 94.30 / 94.30 | 218.20 | 218.20 |
| NK-22222222-2024-0003 | Bernasconi B2 | 366 (184/184) | 109.25 / 109.25 | 138.20 | 138.20 |
| NK-22222222-2025-0001 | Weber A1 | 365 (181/181) | 76.93 / 76.93 | 44.65 (roh 44.67) | Entwurf |
| NK-22222222-2025-0002 | Meier A2 | 181 (181/181) | 92.76 / 92.76 | 237.15 (roh 237.17) | Entwurf |
| NK-22222222-2025-0003 | Brunner A2 | 184 (0/181) | 92.76 / 0.00 | –97.55 (roh –97.53) | Entwurf |
| NK-22222222-2025-0004 | Bernasconi B2 | 365 (181/181) | 107.47 / 107.47 | 185.95 (roh 185.97) | Entwurf |

- Brunner trägt von der Gartenpflege 2025 nichts: Sie mietet ab 01.07.2025, die Rechnung deckt 01.01. – 30.06.2025. Das gilt nach Regel 5 (Mietstage im Leistungszeitraum). Die Position steht mit 0.00 in Abrechnung, Seite und PDF.
- Meier trägt die ganze Gartenpflege 2025 (181 Mietstage = 181 Tage der Rechnung in der Periode), Brunner nichts: die Summe der Mieter von A2 ist 92.76 (Wohnungsanteil), also nichts doppelt oder verloren.
- Alle drei bezahlten Abrechnungen: `paid_amount` = `balance` = Betrag in `payments[0]` = Betrag der QR-Rechnung.
- Verwaltungspauschale: 70.20, 83.25, 79.47 (2,5 %), 71.20, 45.35, 39.10, 80.63 (2,5 %), alle gleich nachgerechnet.
- Heizung Meier 56.14 % (1'520 + 790 von 4'115), Brunner 43.86 % (395 + 1'410), Mieterwechsel mit Heizprofil «Heizung + Warmwasser» nachgerechnet: 591.94 und 462.53.

## Punkt 2: Datum der versendeten und bezahlten Abrechnungen

`select count(*) filter (where status<>'draft') sent, count(*) filter (where status<>'draft' and (created_at::date>statement_date or pdf_generated_at::date>statement_date)) later from utility_statements` ergibt `10|0`. `created_at` und `pdf_generated_at` stehen auf `statement_date` 08:00. Die Web-Seite zeigt im Verlauf «Erstellt 14.04.2025, 10:00 / PDF erstellt 14.04.2025, 10:00 / Versendet 14.04.2025 / Bezahlt 05.05.2025» (10:00 ist 08:00 UTC in Schweizer Sommerzeit). Entwürfe zeigen «Erstellt 07.11.2026, 19:51», unverändert.

## Punkt 3: Alpenblick-Wohnungsnummern

Datenbank: `0.01` (72.00 m²), `1.01` (98.00 m²), `2.01` (85.00 m², leer). PDF NK-33333333-2024-0001: «Wohnung 0.01, EG, 72.00 m²»; NK-33333333-2024-0002: «Wohnung 1.01, 1. OG, 98.00 m²». Web-Seiten: «Laura Keller, Alpenblick, Wohnung 0.01», «Kevin Fischer, Alpenblick, Wohnung 1.01». Beträge der beiden Alpenblick-PDFs stehen in der Datenbank (`pdfcheck.py`).

## Stichprobe Musterhaus

NK-11111111-2024-0001 (Müller, Wohnung 1.01) von Hand nachgerechnet: Heizung 6'360.00 = Anfangsbestand 2'120.00 + Einkauf 6'890.00 – Endbestand 2'650.00; Schlüssel 70 % Fläche / 30 % Einheit gibt 1'000.49. Positionen zusammen 2'866.58, Pauschale 3 % = 86.00, Total 2'952.58, Akonto 2'880.00, Saldo roh 72.58, gerundet 72.55, `paid_amount` 72.55. Stimmt mit Datenbank, PDF und QR-Rechnung (72.55) überein; die Zahlen sind von der Änderung unberührt (kein Seepark-Datensatz fliesst ein).

## Geprüft

Geprüft: NK-22222222-2024-0001 bis -0003 (Datenbank, Web-Seite, PDF, QR-Rechnung), NK-22222222-2025-0001 bis -0004 (Datenbank, Web-Seite, PDF, QR-Rechnung; bei -0003 keine QR-Rechnung, weil Rückerstattung), Rechnung SR-2024-016 (Aufteilung 368.00 / 362.00), NK-11111111-2024-0001 (Datenbank, PDF, QR-Rechnung), NK-33333333-2024-0001 und -0002 (Wohnungszeile PDF und Web-Seite), `paid_amount` = `balance` bei allen 9 bezahlten Abrechnungen, `created_at` / `pdf_generated_at` bei allen 10 nicht entworfenen Abrechnungen.

## QR-Rechnungen (dekodiert)

| Abrechnung | Betrag | Referenz | Prüfziffer | Schuldner | Mitteilung |
|---|---|---|---|---|---|
| 2024-0001 | 10.30 | 007242083128279273591006726 | ok | Thomas Weber, Seeweg 15, 6003 Luzern | Nebenkostenabrechnung NK-22222222-2024-0001 |
| 2024-0002 | 218.20 | 009449823995419493709695659 | ok | Sarah Meier, Hirschmattstrasse 21, 6003 Luzern | Nebenkostenabrechnung NK-22222222-2024-0002 |
| 2024-0003 | 138.20 | 002231507235013081958775585 | ok | Marco Bernasconi, Seeweg 15, 6003 Luzern | Conteggio spese accessorie NK-22222222-2024-0003 |
| 2025-0001 | 44.65 | 005964251259606751179281811 | ok | Thomas Weber | Nebenkostenabrechnung NK-22222222-2025-0001 |
| 2025-0002 | 237.15 | 010159423896081772676725375 | ok | Sarah Meier | Nebenkostenabrechnung NK-22222222-2025-0002 |
| 2025-0004 | 185.95 | 001650677216792014935496775 | ok | Marco Bernasconi | Conteggio spese accessorie NK-22222222-2025-0004 |
| 11111111-2024-0001 | 72.55 | 009740905183858984375191170 | ok | Hans Müller, Bahnhofstrasse 42, 8001 Zürich | Nebenkostenabrechnung NK-11111111-2024-0001 |

Alle: IBAN CH4431999123000889012 (Prüfsumme mod 97 ok), Währung CHF, Empfänger Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, Referenztyp QRR. Betrag und Schuldner stimmen mit Saldo und Mieter der Abrechnung überein.

## Nicht bestätigt

- PDF auf Französisch und Englisch: Die Demodaten haben für die betroffenen Seepark-Mieter nur Deutsch (Weber, Meier, Brunner) und Italienisch (Bernasconi); beide geprüft. Eine fr- oder en-Fassung gibt es nur, wenn man sie neu erzeugt (POST `generate-pdf` mit `language`, oder GET `/pdf` bei einem Entwurf). Das schreibt in die Datenbank und war nicht erlaubt.
- Das PDF der Entwürfe (2025) ist das beim Laden gespeicherte. Beim Herunterladen über die Seite erzeugt Dwello es neu (Datum «Abrechnungsdatum» dann der Tag des Abrufs). Diesen neu erzeugten Stand habe ich nicht geprüft (Schreibzugriff), die Beträge stehen in der Datenbank und sind dieselben.
- Alpenblick-Abrechnungen: nur die Wohnungszeile in PDF und Seite geprüft, ihre Beträge nicht neu gerechnet (nicht von der Änderung berührt, nur Abgleich PDF gegen Datenbank).
- Musterhaus: nur NK-11111111-2024-0001 unabhängig nachgerechnet; die übrigen Musterhaus-Abrechnungen nicht.
- Rechnungs-Seite (`/invoices`) mit SR-2024-016: nur in der Datenbank geprüft (730.00, 01.07.2024 – 30.06.2025, Per Area), die Anzeige nicht.
