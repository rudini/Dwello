# Datenprüfung #133 «Abgerechnet bis» (Commit e130340)

Geprüft gegen die laufende Persona-Datenbank `dwello_persona`, Backend :3301, Frontend :3300. Eigene Nachrechnung in `/tmp/claude-0/-home-user-Dwello/7dca54b3-8fb5-564d-9204-e9a5d0d94e11/scratchpad/recompute.py` und `.../recompute2.py` (Regeln aus `docs/nebenkostenabrechnung-anforderungen.md`, Regeln 1, 3, 5, 6, 8, 9; kein Code von Dwello importiert). Eingaben: `invoices`, `distribution_keys`, `apartments`, `rental_contracts`, `heating_profiles`.

## Ergebnis

Keine Abweichung gefunden. Es gibt keinen Befund D-n.

| ID | Schweregrad | Datensatz | Erwartet | Tatsächlich |
|----|-------------|-----------|----------|-------------|
| – | – | – | – | keine Befunde |

Beobachtung ohne Wirkung auf Beträge (kein Befund): Die Abrechnungsseite im Web (`/statements/ad6ce28a-…`) zeigt nur «275 Mietstage», nicht «Abgerechnet bis 31.03.2025». Nur das PDF nennt es. Die Anforderung verlangt es für die Seite nicht.

## 1. Reto Gisler, NK-22222222-2025-0005 (Mietvertrag e7875f71-…, B1)

Eingaben: Vertrag 01.01.2024, Akonto 200.–/Monat, `billed_until` 2025-03-31, keine Verwaltungspauschale. Periode 01.01.–31.12.2025. Gebäude: 4 Wohnungen, Fläche A1 68 + A2 82 + B1 75 + B2 95 = 320 m². Heizprofil «Heizung + Warmwasser».

- Mietstage: 01.04.–31.12.2025 = 275. Gespeichert `rental_days` 275, `rental_start` 2025-04-01. Stimmt.
- Heizprofil Apr–Dez: 9.3 + 5.6 + 3.7 + 3.7 + 3.6 + 3.7 + 9.5 + 10.7 + 13.0 = 62.8 %. Gespeichert 62.8. Stimmt.
- Rechnungen 2025 (nach Rechnungsdatum, Fernwärme Q4 2025 über Leistungszeitraum 01.10.–31.12.2025, Fernwärme Q4 2024 fällt aus der Periode): TV 912.00, Heizung 1520 + 790 + 395 + 1410 = 4115.00, Hauswart 4 × 765 = 3060.00, Kaltwasser 490 + 520 + 545 + 505 = 2060.00, Allgemeinstrom 236.90 + 262.40 = 499.30.

| Position | Wohnungsanteil (eigen) | Zeitanteil | Ihr Anteil (eigen) | Gespeichert / Web / PDF |
|---|---|---|---|---|
| TV/Kabel (1/4) | 228.00 | 275/365 | 171.78 | 171.78 / 171.78 / 171.78 |
| Heizung (75/320) | 964.45 | 62.8 % | 605.67 | 605.67 / 605.67 / 605.67 |
| Hauswart | 717.19 | 275/365 | 540.35 | 540.35 / 540.35 / 540.35 |
| Kaltwasser | 482.81 | 275/365 | 363.76 | 363.76 / 363.76 / 363.76 |
| Allgemeinstrom | 117.02 | 275/365 | 88.17 | 88.17 / 88.17 / 88.17 |
| Summe, Ihre Nebenkosten | | | 1'769.73 | 1769.73 / 1'769.73 / 1'769.73 |

- Akonto: April bis Dezember = 9 × 200 = 1'800.00. Gespeichert 1800.00. Stimmt. Januar bis März sind nicht gezählt.
- Saldo vor Rundung: 1'769.73 − 1'800.00 = −30.27. Auf 5 Rappen: −30.25 (Rundung −0.02 in der Anzeige, vom Betrag aus gesehen). Gespeichert `balance` −30.25. Web und PDF zeigen «Rückerstattung vor Rundung 30.27, Rundung auf 5 Rappen – 0.02, Rückerstattung 30.25». Stimmt.
- Für 01.01.–31.03.2025 wird nichts berechnet: Mietstage 275 statt 365, Akonto 9 statt 12 Monate, Heizprofil ohne Jan–Mär (62.8 % statt 100 %), `rental_start` 2025-04-01.
- Zwischenwerte im API (`/api/v1/statements/ad6ce28a-…`): `periodShare` 0.7534 und 0.6280, `positionRentalDays` 275, `billedDays` 365, `sharePercentage` je = Ihr Anteil / Kosten. Stimmen mit der Nachrechnung.
- PDF (deutsch, 2 Seiten, `pdftotext -layout`): die Zeile «Ihr Mietverhältnis in dieser Periode: 01.01.2025 – 31.12.2025. Abgerechnet bis 31.03.2025; diese Abrechnung umfasst 01.04.2025 – 31.12.2025 (275 Mietstage von 365 Tagen)» stimmt mit dem Vertrag. Zeitanteile «275/365 Tage» und «62.80 %», Seite 2 mit Heizprofil «Heizung + Warmwasser» und Monaten Apr–Dez mit den Prozenten der Tabelle. Das gespeicherte PDF (`pdf_blob`, base64) ist byte-gleich mit `.../weber-w5d/pdf/gisler-2025.pdf`.
- QR-Rechnung: Es gibt keine. Der Saldo ist eine Rückerstattung, das PDF hat keine QR-Seite und kein Bild (`pdfimages -list` leer, beide Seiten angesehen). Das ist richtig, eine Rückerstattung bekommt keinen Einzahlungsschein. Gespeicherte `qr_bill_reference` 008189779738177995327788063: Prüfziffer (Modulo 10 rekursiv) = 3, stimmt.

## 2. Übrige Mieter in Seepark Residenz (kein Einfluss durch Gisler)

Dieselbe Nachrechnung (Wohnungsanteil auf Rappen, mal Zeitanteil, Pauschale auf die Summe, Saldo auf 5 Rappen), ohne Normalisierung der Gebäudesummen:

| Abrechnung | Nebenkosten eigen | Pauschale | Total | Saldo eigen | Gespeichert (Total / Saldo) |
|---|---|---|---|---|---|
| 2025-0001 Weber (365 Tage) | 2296.54 | 68.90 | 2365.44 | −34.55 | 2365.44 / −34.55 |
| 2025-0002 Meier (181 Tage, 55.8 %) | 1415.51 | 42.47 | 1457.98 | 138.00 | 1457.98 / 138.00 |
| 2025-0003 Brunner (184 Tage, 44.2 %) | 1306.92 | 39.21 | 1346.13 | −93.85 | 1346.13 / −93.85 |
| 2025-0004 Bernasconi (365 Tage) | 3117.87 | 77.95 | 3195.82 | 75.80 | 3195.82 / 75.80 |

Die Gebäudesummen sind überall gleich (912.00 / 4115.00 / 3060.00 / 2060.00 / 499.30), die Wohnungsanteile nutzen immer 320 m² und 4 Wohnungen. Die Anteile von Gisler (75 m²) sind nicht von den anderen abgezogen. Die Statements 2024-0001 bis 0003 sind `paid` und unverändert.

## 3. Hans Müller (Musterhaus Zentrum, b0000001-…), `billed_until` 2023-12-31

- Vertrag ab 01.03.2021, `billed_until` liegt vor der Periode 2024, also alle Tage zählen. `rental_days` 366 und 365, `rental_start` 01.01. Stimmt.
- NK-11111111-2024-0001 (paid): Positionen 275.00 + 551.88 + 576.41 + 115.77 + 137.97 + 160.00 + 1000.49 + 49.06 = 2866.58, Pauschale 3 % = 86.00, Total 2952.58, Akonto 2880.00, Saldo 72.58 auf 72.60. Gespeichert 2952.58 / 72.60.
- NK-11111111-2025-0001 (sent): 3005.65, Pauschale 90.17, Total 3095.82, Akonto 2880.00, Saldo 215.82 auf 215.80. Gespeichert 3095.82 / 215.80.
- Stichproben der Positionen: Aufzug 1650 / 6 = 275.00, Hauswart 3600 × 75.5 / 492.5 = 551.88, Heizung 6360 × (0.7 × 75.5/492.5 + 0.3/6) = 1000.49.
- `updated_at` beider Abrechnungen (23:48:57 und 23:48:59) liegt vor der Änderung des Vertrags (23:52:48): sie sind nicht neu berechnet worden.

## Geprüft und bestanden

- Utility statement NK-22222222-2025-0005 (Reto Gisler): alle fünf Positionen, Summe, Akonto, Saldo mit Rundung, Mietstage, Heizprofil, `heating_share`, `key_values`, Zahlungsfrist 16.11.2026, API, Web (deutsch), PDF (deutsch).
- Seepark Residenz 2025: Weber, Meier, Brunner, Bernasconi (Beträge nachgerechnet).
- Seepark Residenz 2024: drei bezahlte Abrechnungen unverändert vorhanden (Beträge nicht neu gerechnet, nicht betroffen).
- Hans Müller 2024 und 2025: Beträge nachgerechnet.

## Nicht bestätigt

- **PDF in fr, it, en der Abrechnung Gisler.** Die Sprache folgt der Sprache des Mieters (`tenant.language` = de) oder dem Parameter `language` von `POST /api/v1/statements/:id/generate-pdf`; das speichert ein neues PDF in der Persona-Datenbank, was ich nicht darf. Ich wollte eine Kopie der Datenbank anlegen (`createdb`) und das Backend des Worktrees auf einem anderen Port starten. Das hat die Berechtigungsprüfung abgelehnt, ich habe es nicht umgangen. Gelesen habe ich nur die Vorlagen `tenancyBilledLine` in `backend/src/services/pdf.service.ts` (Zeilen 83, 161, 239, 317); sie sind in allen vier Sprachen vorhanden und haben dieselben Platzhalter. Das gerenderte PDF habe ich nicht gesehen. Entscheid beim Auftraggeber: Kopie der Datenbank erlauben oder einen Mieter mit anderer Sprache und `billed_until` anlegen.
- **QR-Rechnung dekodieren.** Es gibt keine (Rückerstattung), daher kein IBAN-, Betrags- und Referenzvergleich. Eine QR-Rechnung mit `billed_until` (Nachzahlung) ist in den Daten nicht vorhanden und deshalb nicht geprüft.
- **Teilmonat beim Akonto.** `billed_until` liegt hier am Monatsende, die Regel «Teilmonat nach Tagen» wird von keinem Datensatz ausgeübt.
- **Web in fr, it, en.** Die Sprache gehört zum Konto und wird beim Wechsel gespeichert; ich habe nur Deutsch gesehen.
- **Sicht auf den Vertrag und den Hinweis «fehlende Abrechnungen»** (Vertragsseite): nicht Teil dieser Datenprüfung.
