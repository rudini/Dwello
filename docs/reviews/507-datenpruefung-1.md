# Datenprüfung #507 (Commit 575416f gegen b871708)

Datenbank dwello_persona, Frontend :3300 (Build enthält den neuen Text), Backend :3301. Nichts geändert, nichts gespeichert (Skripte nur im Scratchpad).
Eigene Nachrechnung: /tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/w507-recompute.py (liest Rechnungen, Verteilschlüssel-Einheiten, Heizprofil, Mietzeiten, Akonto aus der DB; kein Dwello-Code). Seite gelesen mit /tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/w507-page.mjs (de/fr/it/en, Cookie PARAGLIDE_LOCALE). PDF aus `utility_statements.pdf_blob` (pdftotext, pdftoppm 300 dpi, zxing-cpp).

## Befunde

| ID | Schweregrad | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| (keine) | | | | |

Keine Abweichung in Beträgen, Prozenten oder Saldo. Keine Blocker, Major, Minor, Nit.

## Geprüft und bestanden

Regel (nebenkostenabrechnung-anforderungen.md, Thema 5): Anteil nach Heizprofil je Rechnung = Monatsanteile des Mietverhältnisses im Leistungszeitraum / Monatsanteile des Heizprofils im Leistungszeitraum, zwei Stellen. Heizprofil «Heizung + Warmwasser»: 13.6 12.1 11.5 9.3 5.6 3.7 3.7 3.6 3.7 9.5 10.7 13.0 (Summe 100.00).

### NK-22222222-2025-0003 (Nina Brunner, Miete 01.07.–31.12.2025, 184 Tage)

| Rechnung | Betrag | Profil im Zeitraum | Mietmonate darin | Eigene Rechnung | Gespeichert | Seite (de/fr/it/en) | PDF |
|---|---|---|---|---|---|---|---|
| Fernwärme Q1 | 1'520.00 | 37.20 | 0 | 0.00 % | 0 | 0.00 % | 0.00 % / 37.20 % = 0.00 % |
| Fernwärme Q2 | 790.00 | 18.60 | 0 | 0.00 % | 0 | 0.00 % | 0.00 % |
| Fernwärme Q3 | 395.00 | 11.00 | 11.00 | 100.00 % | 100 | 100.00 % | 100.00 % |
| Fernwärme Q4 | 1'410.00 | 33.20 | 33.20 | 100.00 % | 100 | 100.00 % | 100.00 % |

- Σ(Betrag × Prozent) / Σ Betrag = (395 + 1410) / 4115 = 0.438639 -> Zeitanteil 43.86 % (gespeichert period_share 0.4386, Seite und PDF 43.86 %).
- Wohnungsanteil: 4115.00 × 82/320 m² = 1'054.47 (gespeichert, Seite, PDF gleich).
- Ihr Anteil: 1'054.47 × 0.438639 = 462.53 (gespeichert 462.53, Seite 462.53, PDF 462.53). Spalte «Anteil» 11.24 % = 462.53 / 4115 (Seite).
- Übrige Positionen (Fläche bzw. Einheit × 184/365): TV 114.94, Kaltwasser 266.11, Hauswart 395.29, Allgemeinstrom 64.50 – alle gleich wie eigene Rechnung, Seite, PDF.
- Zwischensumme 1'303.37; Verwaltungspauschale 3 % = 39.10; Nebenkosten 1'342.47 (gespeichert total_costs gleich); Akonto 6 × 240.00 = 1'440.00; Saldo vor Rundung -97.53, Rundung zugunsten Mieter + 0.02 -> Rückerstattung 97.55 (gespeichert -97.55, PDF 97.55).
- Kein QR-Zahlteil, weil Rückerstattung: richtig (PDF-Seiten 1 und 2 ohne QR-Code decodiert).

### NK-22222222-2025-0002 (Sarah Meier, Miete 01.01.–30.06.2025, 181 Tage)

| Rechnung | Betrag | Profil im Zeitraum | Mietmonate darin | Eigene Rechnung | Gespeichert | Seite (de/fr/it/en) |
|---|---|---|---|---|---|---|
| Fernwärme Q1 | 1'520.00 | 37.20 | 37.20 | 100.00 % | 100 | 100.00 % |
| Fernwärme Q2 | 790.00 | 18.60 | 18.60 | 100.00 % | 100 | 100.00 % |
| Fernwärme Q3 | 395.00 | 11.00 | 0 | 0.00 % | 0 | 0.00 % |
| Fernwärme Q4 | 1'410.00 | 33.20 | 0 | 0.00 % | 0 | 0.00 % |

- Zeitanteil (1520 + 790) / 4115 = 0.561361 -> 56.14 %; Ihr Anteil 1'054.47 × 0.561361 = 591.94 (gespeichert, Seite, PDF gleich); Anteil-Spalte 14.38 %.
- Übrige Positionen × 181/365: TV 113.06, Kaltwasser 261.77, Hauswart 388.84, Allgemeinstrom 63.45 (gleich).
- Zwischensumme 1'419.06; Verwaltungspauschale 3 % = 42.57; Nebenkosten 1'461.63; Akonto 6 × 220.00 = 1'320.00; Saldo vor Rundung 141.63, Rundung zugunsten Mieter -0.03 -> Nachzahlung 141.60 (gespeichert 141.60, PDF 141.60).
- QR-Rechnung (PDF Seite 2, 300 dpi, zxing-cpp decodiert): Version SPC 0200, IBAN CH4431999123000889012 (Modulo 97 = 1, entspricht der Konfiguration `iban`), Zahlungsempfänger Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich CH, Betrag 141.60 CHF, Schuldner Sarah Meier, Hirschmattstrasse 21, 6003 Luzern CH (entspricht tenants), Referenztyp QRR, Referenz 009087401876769488376098068 (gleich `qr_bill_reference`, Prüfziffer Modulo 10 rekursiv: erwartet 8, vorhanden 8), Mitteilung «Nebenkostenabrechnung NK-22222222-2025-0002», Trailer EPD. Alles bestätigt.

### Kontrolldatensätze ohne Heizprofil (Heizung nach Tagen, unverändert durch #507)
NK-22222222-2025-0001 und -0004 (ganze Periode, byDays): alle Positionen, Wohnungsanteile, Zwischensummen, Pauschale und Saldo (-34.60 bzw. +75.80, auf 5 Rappen zugunsten des Mieters) stimmen mit der Nachrechnung überein. Die Seite zeigt dort keinen Heizprofil-Text (nicht gerendert, DB-Stand: `heating_share.byDays = true`, `invoice_parts` leer); siehe Nicht bestätigt.

### Sprachen der Seite
de, fr, it, en zeigen für beide Abrechnungen dieselben Prozentwerte und denselben Betrag; der Satz «Anteil nach Heizprofil / part selon le profil de chauffage / quota secondo il profilo di riscaldamento / share under the heating profile» erscheint bei jeder der vier Rechnungen, die Mietstage-Formulierung nicht mehr. Die Formelzeile (Ihr Anteil / Votre part / La sua quota / Your share) gleich in allen Sprachen. Die übrigen Positionen zeigen weiterhin x/365 Tage.

## Nicht bestätigt

- PDF in fr, it, en: das gespeicherte PDF ist deutsch (Mieter beider Abrechnungen mit Sprache de); eine andere Sprache des PDF habe ich nicht erzeugt, da ich keine Daten ändern darf. Das PDF ist durch #507 nicht geändert (kein Backend-Diff: `git diff b871708 575416f --stat -- backend` leer).
- Seite der Abrechnungen 0001 und 0004 (nach Tagen) und Heizrechnungen ohne Leistungszeitraum, ausserhalb der Periode (`whole`) sowie Tankbestand (`fuelStock`): die vier neuen Textvarianten `_no_period_profile`, `_beyond_profile`, `_stock_profile` kommen in den Demodaten nicht vor, ich habe sie weder nachgerechnet noch gerendert. Geprüft ist nur die Variante `statements_part_line_profile` (Leistungszeitraum innerhalb der Periode).
- Randfälle der Regel (angebrochener Monat mit Tagesbruch, 0 % im Heizprofil mit Rückfall auf Mietstage): im Skript implementiert, aber in den Demodaten gibt es keinen solchen Fall, daher nicht gegen gespeicherte Werte verglichen.
- Rendering/Layout der Seite (nur Text gelesen, kein Screenshot).
