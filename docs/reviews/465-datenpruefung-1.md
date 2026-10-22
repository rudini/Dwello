# Datenprüfung #465: Statement-PDF als Brief (Commit ac690222)

Ergebnis: **keine Befunde** (kein Blocker, Major, Minor oder Nit). Alle Beträge, die QR-Rechnung, die Heizanteile, Briefkopf, Ort/Datum und Quellenzeile stimmen mit der Datenbank überein. Auf Seite 1 ist nichts abgeschnitten, und nichts überlappt.

| ID | Schweregrad | Datensatz | Erwartet | Tatsächlich |
|----|-------------|-----------|----------|-------------|
| (keine) | – | – | – | – |

## Vorgehen
- Eigenes Skript, das nur aus der Datenbank liest: `/tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/w465-recompute.py`. Es nutzt keinen Dwello-Code. Regeln aus `docs/nebenkostenabrechnung-anforderungen.md` (Themen 5, 6, 8) und `UBIQUITOUS_LANGUAGE.md`.
- Weitere Skripte: `w465-qr.py` (QR-Dekodierung mit zxing-cpp aus `pylib` im Scratchpad) und `w465-bbox.py` (Textpositionen, `pdftotext -bbox`).
- Aufruf: `python3 -I <Skript>`. Das Skript liest `dwello_persona`. Die PDFs liegen unter `.../weber-465/`.
- Die gespeicherten `pdf_blob` beider Abrechnungen sind byte-gleich mit `meier.pdf` und `brunner.pdf` (Skriptausgabe `blob==file True`).

## Eingaben (Datenbank)
- Wohnung A2: 82 m² von 320 m² (Verteilschlüssel Pro Fläche), 1 von 4 Wohnungen (Pro Einheit).
- Rechnungen 2025:
  - Kabelanschluss 912.00
  - Hauswart 4 × 765 = 3'060.00
  - Wasser 490 + 520 + 545 + 505 = 2'060.00
  - Allgemeinstrom 236.90 + 262.40 = 499.30
  - Fernwärme mit Leistungszeitraum: 1'520 (Q1), 790 (Q2), 395 (Q3), 1'410 (Q4) = 4'115.00. Die Q4-Rechnung 2024 (Rechnungsdatum 20.01.2025) und die Q4-Rechnung 2025 (Rechnungsdatum 20.01.2026) zählen nach Leistungszeitraum richtig.
- Verwaltungspauschale 3 %. Akonto Meier 6 × 220, Brunner 6 × 240. Heizprofil «Heating + Hot Water», Summe 100.00 %.
- Einstellungen: Telefon `079 456 12 34`, E-Mail `helga.meier@bluewin.ch`, IBAN `CH4431999123000889012`.

## Geprüft und bestanden

### Beträge (Neuberechnung = Datenbank = PDF, auf den Rappen)
| Position | Meier (-0002) | Brunner (-0003) |
|---|---|---|
| TV/Kabelanschluss: Wohnungsanteil / Ihr Anteil | 228.00 / 113.06 (181/365) | 228.00 / 114.94 (184/365) |
| Heizung: Wohnungsanteil / Zeitanteil / Ihr Anteil | 1'054.47 / 56.14 % / 591.94 | 1'054.47 / 43.86 % / 462.53 |
| Kaltwasser: Wohnungsanteil / Ihr Anteil | 527.88 / 261.77 | 527.88 / 266.11 |
| Hauswart: Wohnungsanteil / Ihr Anteil | 784.13 / 388.84 | 784.13 / 395.29 |
| Allgemeinstrom: Wohnungsanteil / Ihr Anteil | 127.95 / 63.45 | 127.95 / 64.50 |
| Zwischensumme | 1'419.06 | 1'303.37 |
| Verwaltungspauschale (3 %) | 42.57 | 39.10 |
| Ihre Nebenkosten | 1'461.63 | 1'342.47 |
| Akonto | 1'320.00 | 1'440.00 |
| Saldo vor Rundung | Nachzahlung 141.63 | Rückerstattung 97.53 |
| Rundung auf 5 Rappen | – 0.03 (141.60) | + 0.02 (97.55) |
| Saldo (Datenbank `balance`) | 141.60 | –97.55 |

- Die Rundung folgt Thema 8: Nachzahlung ab-, Rückerstattung aufgerundet.
- Kosten des Gebäudes pro Position (912.00 / 4'115.00 / 2'060.00 / 3'060.00 / 499.30) stimmen mit den Rechnungen überein. Jeder dieser Beträge und jeder Wohnungs- und Mieteranteil steht auf der jeweiligen PDF.
- Die Rechnung geht in beiden PDFs auf (Zwischensumme + Pauschale = Nebenkosten; Nebenkosten – Akonto = Saldo vor Rundung).
- Zahlungsfrist 22.11.2026 = Abrechnungsdatum 23.10.2026 + 30 Tage (Einstellung `payment_deadline_days`). Sie steht so auf beiden PDFs.

### Heizanteile der zwei Mieter
- Meier `heating_share.percent` 55.8 und Brunner 44.2: zusammen **100.0 %** der Heizperiode.
- Monatsanteile: Meier Jan–Jun 13.6 + 12.1 + 11.5 + 9.3 + 5.6 + 3.7 = 55.8. Brunner Jul–Dez 3.7 + 3.6 + 3.7 + 9.5 + 10.7 + 13.0 = 44.2.
- Zeitanteil der Position (`period_share`) 0.5614 + 0.4386 = 1.0000. Ihr Anteil Heizung 591.94 + 462.53 = 1'054.47 = Wohnungsanteil, ohne Rappen-Rest.
- Die Anteile je Heizrechnung auf den PDFs sind richtig: Meier Q1 und Q2 je 100 %, Q3 und Q4 je 0 %. Brunner umgekehrt.

### QR-Rechnung Meier (Seite 3, mit `pdftoppm -r 300` gerendert und dekodiert)
| Feld | QR-Inhalt | Erwartet / Zahlteil |
|---|---|---|
| IBAN | CH4431999123000889012 (Modulo 97 = 1, QR-IID 31999) | Einstellung `iban`; auf dem Zahlteil `CH44 3199 9123 0008 8901 2` |
| Betrag, Währung | 141.60 CHF | Datenbank 141.60; Zahlteil und Empfangsschein CHF 141.60 |
| Referenztyp, Referenz | QRR, `008670827848369562739485584` | Datenbank `qr_bill_reference`; Prüfziffer nach Modulo 10 rekursiv = 4, QR hat 4; Zahlteil `00 86708 27848 36956 27394 85584` |
| Zahlbar durch | Sarah Meier, Hirschmattstrasse 21, 6003 Luzern, CH | Mieterdaten der Datenbank. Der Text unter «Zahlbar durch» (Empfangsschein und Zahlteil) ist gleich. |
| Mitteilung | `Nebenkostenabrechnung NK-22222222-2025-0002` | Zahlteil «Zusätzliche Informationen» gleich |
| Zahlbar an | Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich | Zahlteil gleich |

Brunner (Rückerstattung) hat erwartungsgemäss kein Zahlteil: 2 Seiten, Bitte um die IBAN im Text.

### Briefkopf, Ort/Datum, Quellenzeile
- Briefkopf Seite 1: «Muster Immobilien AG / Bahnhofstrasse 1 / 8001 Zürich / Telefon 079 456 12 34 / helga.meier@bluewin.ch» entspricht der Tabelle `configuration`. Die Anschrift stimmt mit Mieter (Meier: Hirschmattstrasse 21, 6003 Luzern; Brunner: Seeweg 15, 6003 Luzern) und Gebäude (Seepark Residenz, Seeweg 15, 6003 Luzern) überein.
- «Zürich, 23.10.2026»: Ort aus `company_city`, Datum gleich `statement_date` 2026-10-23.
- Anrede, Mietzeitraum und Mietstage («01.01.2025 – 30.06.2025 (181 Mietstage von 365 Tagen)», «01.07.2025 – 31.12.2025 (184 …)») stimmen mit `rental_start`, `rental_end` und `rental_days` überein. Die Grussformel steht nach den Hinweisen.
- Quellenzeile: «Quelle der Monatsanteile: …» ist Zeichen für Zeichen gleich `heating_share.sources.de` (= `heating_profiles.source_de`). Das gilt für beide Abrechnungen. Die Zeile steht im Abschnitt «Heiz- und Warmwasserkosten» auf Seite 2.

### Layout und Schrift
- Alle Wörter liegen innerhalb der Seite A4 (595.28 × 841.89 pt), 0 Wörter ausserhalb, 0 überlappende Wörter. Das gilt für alle 5 Seiten. Seite 1 beider PDFs liegt in x 56.7–538.6 und y 40.0–810.8. Auf Seite 3 liegt das Zahlteil bei x 14.2–561.9.
- Die gerenderte Seite 1 Meier ist sauber: Briefkopf, Adressfenster, Ort/Datum, Betreff, Saldokasten, Tabelle und Fusszeile ohne Abschnitt.
- Schrift: `LiberationSans` und `LiberationSans-Bold`, beide eingebettet (emb yes, sub yes, uni yes), in beiden PDFs. Umlaute und Sonderzeichen («Zürich», «», «–», «×») sind in `pdftotext` korrekt lesbar.

### PDF-Grösse
- `meier.pdf`: 53'039 Byte, 3 Seiten (Datenbank `pdf_blob`: 70'720 Zeichen Base64).
- `brunner.pdf`: 31'700 Byte, 2 Seiten (42'268 Zeichen Base64).

## Nicht bestätigt
- Die Webseite der Abrechnung (http://localhost:3300) habe ich nicht gelesen. Beträge gegen Datenbank und PDF stimmen, aber ich habe keinen Seitenvergleich gemacht.
- PDFs in fr/it/en: Für diese Datensätze gibt es nur die deutschen PDFs. Die Quellenzeile in fr/it/en habe ich nur in `heating_share.sources` (Datenbank) gelesen, nicht gedruckt gesehen.
- Fremdes Adressfenster: Ich habe nur geprüft, dass nichts überlappt oder abgeschnitten ist, nicht die Lage des Adressfensters nach DIN 5008 / C5/6.
- Rundungsdetail der Heizanteile: Ich habe mit der Rundung der Zeitanteile auf 4 Stellen (zwei Stellen in %) gerechnet. Die Ergebnisse stimmen auf den Rappen mit allen Werten überein; für andere Rechnungskonstellationen (angebrochene Monate, Tankbestand) habe ich keine Daten geprüft, ausserhalb des Auftrags.
- Der Vergleich mit dem Stand vor der Änderung (e6b3623a, Beträge unverändert) ist nicht gemacht: Ich habe nur den Ist-Stand gegen eine unabhängige Rechnung geprüft. Die Beträge stimmen mit dieser, also hat die Änderung (soweit diese Datensätze zeigen) keine Berechnung verändert.
