# Datenprüfung W9d (Commit 12ec34d), Runde 1

Geprüft gegen die laufende Persona-Stack-Datenbank `dwello_persona` (nur lesend; nichts versendet, nichts geändert ausser dem Abruf der PDFs über die App).
Skript: /tmp/claude-0/-home-user-Dwello/b8c95026-3aa3-5859-8108-acb1ea5b0967/scratchpad/recompute.py (rechnet aus Rechnungen, Flächen, Verträgen, Heizprofil; kein Dwello-Code). QR-Decoder: /tmp/claude-0/-home-user-Dwello/b8c95026-3aa3-5859-8108-acb1ea5b0967/scratchpad/decode.py (zxing-cpp, installiert in .../scratchpad/pylib).
Abgerufene PDFs: /tmp/claude-0/-home-user-Dwello/b8c95026-3aa3-5859-8108-acb1ea5b0967/scratchpad/daten/{weber,nina,marco}.pdf

Hinweis zu den IDs: die genannten `b0000002-…` sind Vertrags-IDs, nicht Mieter-IDs. Mieter: Weber a0000001-…-0005, Brunner a0000001-…-0010, Bernasconi a0000001-…-0007.

## Ergebnis

Keine Findings. Alle Beträge stimmen auf den Rappen; die Texte sind in der Sprache des Mieters; die Spalte «Kosten des Gebäudes» enthält je Position die Gebäudekosten.

| ID | Schweregrad | Datensatz | Erwartet | Tatsächlich |
|----|-------------|-----------|----------|-------------|
| – | – | – | – | keine Abweichung gefunden |

## Nachrechnung (eigenes Skript gegen DB und PDF)

Gebäudekosten 2025 aus den Rechnungen (Rechnung ohne Leistungszeitraum zählt nach Rechnungsdatum in der Periode, mit Leistungszeitraum nach Tagen; Fernwärme Q4 2024, Rechnungsdatum 20.01.2025, zählt 0 Tage; Fernwärme Q4 2025, Rechnungsdatum 20.01.2026, zählt voll):
TV/Kabel 912.00, Hauswart 3'060.00, Heizung 1'520+790+395+1'410 = 4'115.00, Kaltwasser 2'060.00, Allgemeinstrom 499.30. Fläche gesamt 320 m², 4 Wohnungen.

| Position | Weber A1 (68 m², 365 T.) | Brunner A2 (82 m², 184 T., Heizprofil 44.20 %) | Bernasconi B2 (95 m², 365 T.) |
|---|---|---|---|
| TV/Kabel | 228.00 / 228.00 | 228.00 / 114.94 | 228.00 / 228.00 |
| Hauswart | 650.25 / 650.25 | 784.13 / 395.29 | 908.44 / 908.44 |
| Heizung | 874.44 / 874.44 | 1'054.47 / 466.08 | 1'221.64 / 1'221.64 |
| Kaltwasser | 437.75 / 437.75 | 527.88 / 266.11 | 611.56 / 611.56 |
| Allgemeinstrom | 106.10 / 106.10 | 127.95 / 64.50 | 148.23 / 148.23 |
| Zwischensumme | 2'296.54 | 1'306.92 | 3'117.87 |
| Pauschale | 3 % = 68.90 | 3 % = 39.21 | 2.5 % (eigener Satz) = 77.95 |
| Ihre Nebenkosten | 2'365.44 | 1'346.13 | 3'195.82 |
| Akonto | 12 × 200 = 2'400.00 | 6 × 240 = 1'440.00 | 12 × 260 = 3'120.00 |
| Saldo vor Rundung | −34.56 | −93.87 | +75.82 |
| Rundung | +0.04 | +0.03 | −0.02 |
| Saldo | Rückerstattung 34.60 | Rückerstattung 93.90 | Nachzahlung 75.80 |

(Format Wohnungsanteil / Ihr Anteil; eigene Rechnung = gespeicherter Wert = PDF = Web-Seite in jeder Zelle.)
Gespeichert in `utility_statements`: total_costs 2365.44 / 1346.13 / 3195.82, management_fee 68.90 / 39.21 / 77.95, balance −34.60 / −93.90 / 75.80. Zeilen in `utility_statement_line_items` (tenant_share, apartment_share) identisch zur Rechnung. Heizprofil Brunner: Jul–Dez 3.7+3.6+3.7+9.5+10.7+13.0 = 44.2 %, PDF Seite 2 nennt dieselben Monatsanteile (fr: «juil. 3.70 %, août 3.60 %, …»).
Rundung nur zugunsten des Mieters (Nachzahlung ab-, Rückerstattung aufgerundet) und Vorzeichen der Zeile (+ wenn der Betrag grösser wird) stimmen in allen drei PDFs.

## Sprache und Begriff «Gebäude» (#249, #351)

- Weber (de): PDF «Gebäude» (Kopfblock), Spaltenkopf «Kosten des Gebäudes», Hinweis «Kosten des Gebäudes: …», «Wohnungsanteil: der Anteil Ihrer Wohnung an den Kosten des Gebäudes …». `grep -i Liegenschaft` in allen abgerufenen PDF-Texten und Web-Seiten: kein Treffer.
- Brunner (Mieter-Sprache in DB `fr`): frisch abgerufenes PDF ist französisch («Immeuble», «Coûts de l’immeuble», «Décompte des charges», «Remboursement», Seite 2 «Frais de chauffage et d’eau chaude»), byte-gleicher Text wie Persona-PDF nina-after.pdf; nina-de.pdf (vor der Umstellung) war deutsch. Das in der DB gespeicherte Entwurfs-`pdf_blob` (pdf_generated_at 17.10.2026 02:08:40, nach der Umstellung) ist ebenfalls französisch.
- Bernasconi (it): italienisch («Immobile», «Costi immobile», «Quota appartamento», «Quota temporale», «Conteggio spese accessorie»); gleicher Text wie marco-it.pdf.
- Spalte «Kosten des Gebäudes»/«Coûts de l’immeuble»/«Costi immobile» zeigt je Position die Gebäudekosten (912.00 / 3'060.00 / 4'115.00 / 2'060.00 / 499.30) und nicht den Wohnungsanteil. Web-Seite (Spalte «Kosten des Gebäudes») zeigt dieselben Werte.

## QR-Rechnungen

- Bernasconi (Nachzahlung 75.80): Seite 2 mit 300 dpi gerendert (`pdftoppm -png -r 300 -f 2 -l 2`), mit zxing-cpp dekodiert: SPC 0200 1; IBAN CH4431999123000889012 (QR-IBAN, IID 31999; mod-97 = 1); Betrag 75.80 CHF; Kreditor Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich; Zahlungspflichtiger Marco Bernasconi, Seeweg 15, 6003 Luzern; Referenztyp QRR; Referenz 010754493771112189700095952 (27 Stellen, Prüfziffer mod 10 rekursiv = 2, stimmt; gleich `qr_bill_reference` in DB und gedruckter Referenz «01 07544 93771 11218 97000 95952»); Mitteilung «Conteggio spese accessorie NK-22222222-2025-0004» (italienisch, Mieter-Sprache); Zusatzinformation EPD.
- Weber und Brunner: Rückerstattung, die PDFs haben keinen Zahlteil (Weber 1 Seite, Brunner 2 Seiten ohne Zahlteil), also kein QR zu prüfen. Prüfziffern der gespeicherten `qr_bill_reference` beider Entwürfe stimmen trotzdem (010652936646236814282932894, 002478721504781792530672879).
- Zusatzprobe (ausserhalb des Auftrags): Entwurfs-PDF Meier (de, NK-…-0002) im `pdf_blob`: QR dekodierbar, Referenz 001026100470958013163502083, Prüfziffer 3 stimmt; Betrag nicht nachgerechnet.

## Geprüft und bestanden

- Weber 2025 Entwurf NK-22222222-2025-0001 (de): Beträge, Rundung, Begriffe, Web-Seite = PDF.
- Brunner 2025 Entwurf NK-22222222-2025-0003 (fr): Beträge inkl. Heizprofil, Rundung, Sprache fr in PDF und gespeichertem Blob, Persona-PDF nina-after.pdf identisch zum frischen Abruf.
- Bernasconi 2025 Entwurf NK-22222222-2025-0004 (it): Beträge, eigener Satz 2.5 %, Rundung, Sprache it, QR-Rechnung.
- Gebäudekosten je Position und Spaltenkopf in allen drei Sprachen.

## Nicht bestätigt

- #351 zweiter Teil, «das beim Versenden erzeugte PDF entsteht in der Sprache zum Zeitpunkt des Versands»: nicht geprüft, weil ein Versand den Datensatz ändern würde (Auftrag: nichts versenden). Geprüft ist nur, dass der Entwurf dem Sprachwechsel folgt (Brunner de -> fr, gleicher Tag) und dass der gespeicherte Entwurfs-Blob die aktuelle Sprache trägt.
- Sprache Englisch: kein Datensatz mit Mieter-Sprache en in den genannten Datensätzen; die englischen Texte des PDFs sind nicht geprüft.
- Das Persona-PDF nina-de.pdf zeigt «Gebäude»; ein Vergleich mit dem Stand vor f900e5b («Liegenschaft») wurde nicht gemacht, da die Zielseite nur den neuen Stand prüft.
