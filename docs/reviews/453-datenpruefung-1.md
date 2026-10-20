# Datenprüfung #453 «Abgerechnet bis» (Runde 1)

Worktree: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/review-453-daten` (443df22f). Datenbank `dwello_persona`, nur gelesen.
Eigene Rechnung: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/w/recompute.py` (Python/Decimal, liest Rechnungen, Flächen, Heizprofil, Tankbestände und Mietvertrag aus der DB; kein Dwello-Code).
Geprüftes PDF: `pdf_blob` der Abrechnung NK-33333333-2025-0001 (erzeugt 20:03:24, nach der letzten Änderung der Mietverträge 20:00/20:01 und der Rechnungen 19:47), Kopie `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/w/stored-de.pdf`, Seiten als PNG daneben.

## Ergebnis

Kein Blocker, kein Major. Alle Zahlen und Daten des gespeicherten PDFs stimmen auf den Rappen mit meiner Neurechnung und den gespeicherten Werten überein. Ein Teil der Prüfung ging nicht (Web-Seite, PDF in fr/it/en, Vorschau des Abrechnungslaufs): siehe «Nicht bestätigt».

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| D-1 | Nit (besteht schon vor #453) | PDF NK-33333333-2025-0001, Adressblock «Gebäude» | «Wohnung EG, 72.00 m²» | «Wohnung EG, EG, 72.00 m²» (Wohnungsnummer EG und Stockwerk 0 beide als «EG») |
| D-2 | Nit | PDF Seite 1, neue Mietverhältnis-Zeile | Abstand wie bei einem Absatz (die Zeile ist ein eigener Gedanke) | Die Zeile steht ohne Abstand direkt unter «Abrechnungsnr. …» und wirkt wie dessen Fortsetzung (siehe `w/pg-1.png`). Der Inhalt ist richtig. |

D-1 und D-2 ändern keinen Betrag und kein Datum.

D-1 beweist:
```
pdftotext -layout stored-de.pdf - | grep "Wohnung EG"
Wohnung EG, EG, 72.00 m²
psql ... -c "select number,floor from apartments where id='aaaa3333-3333-3333-3333-111111111111'"  -> EG | 0
```
Ich habe nicht geprüft, ob die Basis dasselbe zeigt; es hängt nicht an der Änderung.

## Nachrechnung Laura Keller (EG), Periode 2025

Eingaben aus der DB: Vertragsbeginn 01.11.2022, kein Vertragsende, «Abgerechnet bis» 30.06.2025, Akonto CHF 190.00 pro Monat, Verwaltungspauschale 3 %. Flächen EG 72.00 / OG1 98.00 / OG2 85.00, zusammen 255.00 m². Alle Rechnungen des Gebäudes haben den Schlüssel «Pro Fläche» und keinen Leistungszeitraum. Heizprofil «Heizung + Warmwasser» (Jul 3.70, Aug 3.60, Sep 3.70, Okt 9.50, Nov 10.70, Dez 13.00; das ganze Jahr 100.00). Tankbestand Alpenblick 31.12.2024 CHF 1'792.00, 31.12.2025 CHF 1'494.00.

| Grösse | Meine Rechnung | Gespeichert | PDF |
|---|---|---|---|
| Tag danach / abgerechnete Tage | 01.07.2025 – 31.12.2025 | `rental_start/end` ebenso | ebenso |
| Mietstage / Tage der Periode | 184 / 365 | 184 | «184 Mietstage von 365 Tagen», «184/365 Tage» |
| Mietverhältnis in der Periode | 01.01.2025 – 31.12.2025 (Beginn 2022 liegt vor der Periode, kein Ende) | – | gleich |
| Akonto | 6 × 190.00 = 1'140.00 | `total_advance_payments` 1140.00 | «Akontobeiträge ab 01.07.2025 … 1'140.00» (Satz und Totalzeile) |
| Schneeräumung (920 + 380) | 1'300.00; Wohnung 367.06; Anteil 185.04 | 1300.00 / 367.06 / 185.04 | gleich |
| Kaltwasser | 470.00; 132.71; 66.90 | gleich | gleich |
| Allgemeinstrom (182.60 + 196.30) | 378.90; 106.98; 53.93 | gleich | gleich |
| Heizung (1'792 + 4'880 − 1'494) | 5'178.00; 1'462.02; 44.20 % → 646.21 | 5178.00 / 1462.02 / 0.4420 / 646.21 | gleich, Tankrechnung Seite 2 gleich |
| Zwischensumme | 952.08 | – | 952.08 |
| Verwaltungspauschale 3 % | 28.56 | 28.56 | 28.56 |
| Ihre Nebenkosten | 980.64 | `total_costs` 980.64 | 980.64 |
| Saldo vor Rundung | −159.36 | – | «Rückerstattung vor Rundung 159.36» |
| Saldo, 5 Rappen zugunsten Mieter | −159.40 (Rundung 0.04) | `balance` −159.40 | «Rundung auf 5 Rappen + 0.04», «Rückerstattung CHF 159.40» |
| Monatsanteile Seite 2 | Jul–Dez, Summe 44.20 | `heating_share` | «Anteile der abgerechneten Monate Ihres Mietverhältnisses: Jul 3.70 %, … Dez 13.00 %» |
| Zahlungsfrist | Abrechnungsdatum 19.10.2026 + 30 Tage = 18.11.2026 | `payment_deadline` 2026-11-18 | «bis 18.11.2026» |

Weitere bestätigte Punkte:
- Rechnungen: 14 Rechnungen des Gebäudes, 6 mit Datum 2025 in umlagefähigen Kategorien; die Rechnungen von 2024 zählen nicht. Die Position Heizung enthält die Rechnung 4'880.00 und «Veränderung Tankbestand» 298.00.
- Verteilschlüssel: `key_values` `{"area":[72,255]}`; PDF «72.00 / 255.00 m²».
- Vereinbarte Kategorien: alle 12 des Vertrags angekreuzt; das PDF nennt die vier abgerechneten (Schneeräumung, Kaltwasser, Allgemeinstrom, Heizung).
- Das Total der Position gewichtet nach Wohnungsanteil × Zeitanteil; beide Rundungswege (auf den gerundeten Wohnungsanteil und direkt) ergeben dieselben Rappen.

## Kevin Fischer (OG1)

«Abgerechnet bis» 31.12.2025 = Ende der Periode 2025, Vertrag ohne Ende. Nach Glossar («Abrechnungsperioden, die bis dahin enden») ist der Vertrag übergangen: Es gibt keine Abrechnung 2025 für OG1 (Tabelle `utility_statements` hat für ihn nur NK-33333333-2024-0002, Status replaced). Das passt.

## QR-Rechnung

Die Abrechnung ist eine Rückerstattung (−159.40). Nach Anforderung 10 (`docs/nebenkostenabrechnung-anforderungen.md`) gibt es eine QR-Rechnung nur bei Nachzahlung. Das PDF hat keinen Zahlteil: `w/pg-1.png` und `w/pg-2.png` zeigen keinen. Es gibt also nichts zu dekodieren. Die gespeicherte Referenz `qr_bill_reference` = 008008842887359736268528798 steht nur in der DB. Ob die Referenzprüfziffer stimmt, habe ich nicht geprüft, da sie nirgends gedruckt wird (siehe unten).

## Geprüfte und bestandene Datensätze

- Abrechnung NK-33333333-2025-0001 (Laura Keller): Daten, Mietstage, Akonto, 4 Positionen, Zwischensumme, Pauschale, Total, Saldo und Rundung, Zahlungsfrist, Heiz-Seite 2.
- Mietvertrag b0000003-…-0001 (Keller): Beginn, Ende, «Abgerechnet bis», Akonto, Pauschale.
- Mietvertrag b0000003-…-0002 (Fischer): «Abgerechnet bis» = Periodenende, keine Abrechnung 2025.
- Rechnungen, Tankbestände und Heizprofil Alpenblick 2025.
- Texte der Zeilen in `backend/src/services/pdf.service.ts` (de/fr/it/en, `tenancyBilledLine`, `heatingMonthsBilled`, `partProfileBilled`) gelesen: gleiche Platzhalter in allen vier Sprachen ({tenancyStart}, {end}, {billedUntil}, {start}, {days}, {total}); Wortlaut plausibel, aber nicht als PDF gerendert.

## Nicht bestätigt

1. **Web-Seite der Abrechnung, API-Antworten, Vorschau des Abrechnungslaufs («{Beginn} – {Ende}, {Tage} Mietstage, Akonto CHF …») und das PDF in fr/it/en.** Dafür braucht es eine angemeldete Sitzung. Ich wollte ein Sitzungs-JWT aus dem bekannten Persona-Secret (`persona-stack.sh`) selbst signieren; das hat die Berechtigungsprüfung des Systems abgelehnt (Credential-Zugriff). Ich habe es nicht umgangen. Eine andere Sprache würde ausserdem über `POST /api/statements/:id/generate-pdf` das gespeicherte PDF überschreiben, was ich nicht darf. Der Auftraggeber kann entweder eine Sitzung für diese GET-Abfragen freigeben oder die vier Sprachen (und die Seite) selbst abrufen; ich vergleiche sie dann gegen die obige Tabelle.
2. **Gespeichertes PDF ist nur de.** Die Mieterin hat `language = de`, also ist das gespeicherte PDF deutsch. Die Sprachen fr/it/en sind nur im Quelltext gelesen.
3. **QR-Rechnung:** nicht vorhanden (Rückerstattung), daher nichts zu dekodieren; eine Nachzahlung mit «Abgerechnet bis» liegt in den Daten nicht vor und blieb ungeprüft (IBAN, Betrag, Referenz mit Prüfziffer, Mitteilung, Zahlungspflichtiger). Ich habe keinen QR-Decoder installiert, weil kein QR-Code zu prüfen war. Falls eine Nachzahlung gebraucht wird, braucht es einen Vertrag mit höheren Kosten als Akonto und eine freigegebene Änderung.
4. **Vorschau für Fischer (OG1):** nur über die Logik (übergangener Vertrag) bestätigt, nicht über die Vorschau selbst.
5. **Abrechnung eines Teils der Periode mit Ende vor dem Periodenende** (Tage = Ende − «Abgerechnet bis») und die Verwaltungspauschale/Akonto bei geändertem Akonto sind in den Daten nicht vorhanden und deshalb nicht geprüft.
