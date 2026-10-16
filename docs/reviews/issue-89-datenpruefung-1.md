# Datenprüfung #89 / #124: Verwaltungspauschale pro Mietvertrag (Commit 0c7a596)

Geprüft gegen die laufende Persona-Datenbank `dwello_persona` (nur lesend), Backend :3301 (GET mit selbst signiertem JWT), Frontend :3300 (Cookie `dwello_session`), die gespeicherten PDFs und PDFs in de/fr/it/en.

Skripte (nicht im Repository), alle unter `/tmp/claude-0/-home-user-Dwello/c539e8ea-b211-51a3-8d7c-2c40389c0007/scratchpad/dp/`:
- `recompute.py`: unabhängige Neuberechnung aus Rechnungen, Kategorien, Verteilschlüsseln, Wohnungen, Verträgen, Tankbeständen, Heizprofil (Regeln aus `docs/nebenkostenabrechnung-anforderungen.md`, «Regeln in Dwello» 1-9). Dwello-Rechencode nicht verwendet. Aufruf: `python3 -I recompute.py`.
- `pdfcheck.py` / `pdfcheck2.py`: sucht alle erwarteten Beträge im PDF-Text (gespeicherte PDFs bzw. alle vier Sprachen).
- `qr.py`: QR-Rechnungen (`pdftoppm -png -r 300`, Decoder `zxing-cpp` im venv `dp/venv`).

## Ergebnis

Kein Blocker, kein Major. Alle 19 Abrechnungen der Datenbank (nicht nur die genannten) stimmen in Zwischensumme, Pauschale, Total, Akonto und Saldo (5-Rappen-Rundung) auf den Rappen mit der Neuberechnung, der Webseite und den PDFs überein. Der gespeicherte Satz stimmt bei allen mit dem Vertrag überein. Drei Nits.

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|----|---------|-----------|----------|-------------|
| D-1 | Nit | Kevin Fischer, Alpenblick 2025 (`5e814f1c`) und 2024 (`143acdfb`), Pauschale «Nein» | Webseite und PDF zeigen dasselbe | Webseite zeigt die Zeile «Verwaltungspauschale 0 % der Zwischensumme CHF 0.00», das PDF lässt die Zeile weg (nur «Zwischensumme» und gleich hohe «Ihre Nebenkosten») |
| D-2 | Nit | Webseite Abrechnung Laura Keller (`5223d216`), Spalte «Anteil» | Gleicher Verteilschlüssel (72/255 = 28.2353 %) zeigt für alle Positionen denselben Anteil | «Allgemeinstrom» zeigt 28.23 %, die anderen drei 28.24 %: der Anteil wird aus den gerundeten Beträgen (106.98 / 378.90 = 28.2344 %) zurückgerechnet. Betrag selbst stimmt. Besteht schon vor #89. |
| D-3 | Nit | Glossar `UBIQUITOUS_LANGUAGE.md` («Saldo», «Rundung auf 5 Rappen») gegen Code | Eine Regel | Glossar: Rundung «zugunsten des Mieters» (als «geplant (#79)» vermerkt); Anforderungen Regel 8 und Code: kaufmännisch. Folge: Keller 2025 Rückerstattung 149.17 wird zu 149.15 (zugunsten des Mieters wäre 149.20). Implementierung stimmt mit der Anforderungsdatei überein; nur die Dokumente widersprechen sich. Besteht schon vor #89. |

## Belege je Befund

### D-1
PDF (`pdf/NK-33333333-2025-0002.txt`, `pdftotext -layout`):
```
Zwischensumme                                   2'815.84
Ihre Nebenkosten                                2'815.84
```
(keine Zeile «Verwaltungspauschale»), in allen vier Sprachen. Webseite:
`curl -s -b "dwello_session=<JWT>" http://localhost:3300/statements/5e814f1c-9258-4a2c-9c7f-9d148cd3c866` enthält «Zwischensumme | CHF 2’815.84 | Verwaltungspauschale | 0 % der Zwischensumme | CHF 0.00 | Gesamtkosten | CHF 2’815.84». Die Beträge sind richtig; nur die Darstellung weicht ab. Die Anforderungen schreiben für «Nein» keine Darstellung vor. Auch die redundante Zeile «Zwischensumme» im PDF ist harmlos.

### D-2
`select description, tenant_share, share_percentage from utility_statement_line_items where statement_id='5223d216-3ac7-4d3b-aa41-dde9396547ba'` ergibt 28.2354 / 28.2362 / 28.2344 / 28.2352; Webseite 28.24 / 28.24 / 28.23 / 28.24 %. Das PDF druckt «72.00 / 255.00 m²» und ist richtig.

### D-3
`grep -n "zugunsten" UBIQUITOUS_LANGUAGE.md` (Zeilen 156, 157) gegen `docs/nebenkostenabrechnung-anforderungen.md` Zeile 148 («kaufmännisch auf 5 Rappen gerundet»). Das PDF von Keller 2025 zeigt «Rückerstattung vor Rundung 149.17, Rundung auf 5 Rappen – 0.02, Rückerstattung 149.15».

## Neuberechnung (Auszug der betroffenen Abrechnungen; Ausgabe von `recompute.py`)

Alle Werte CHF. «DB» = gespeicherter Wert, Neuberechnung identisch (OK). Saldo vor Rundung → gerundet auf 5 Rappen (kaufmännisch).

| Abrechnung | Vertrag | Satz erwartet / gespeichert | Zwischensumme | Pauschale | Total | Akonto | vor Rundung | Saldo |
|---|---|---|---|---|---|---|---|---|
| Keller EG Alpenblick 2025 (`5223d216`) | vereinbart, Satz Lauf 3 % | 3 % / 3.00 | 2068.77 | 62.06 | 2130.83 | 2280.00 | -149.17 | -149.15 |
| Fischer OG1 Alpenblick 2025 (`5e814f1c`) | nicht vereinbart | 0 % / 0.00 | 2815.84 | 0.00 | 2815.84 | 3000.00 | -184.16 | -184.15 |
| Fischer OG1 Alpenblick 2024 (`143acdfb`) | nicht vereinbart | 0 % / 0.00 | 2970.20 | 0.00 | 2970.20 | 3000.00 | -29.80 | -29.80 |
| Keller 2024 (`c7b0b377`) | vereinbart | 3 % / 3.00 | 2182.19 | 65.47 | 2247.66 | 2280.00 | -32.34 | -32.35 |
| Bernasconi B2 Seepark 2025 (`7c1e95d8`) | eigener Satz 2.5 | 2.5 % / 2.50 | 3117.87 | 77.95 | 3195.82 | 3120.00 | 75.82 | 75.80 |
| Bernasconi B2 Seepark 2024 (`fd0efbb4`) | eigener Satz 2.5 | 2.5 % / 2.50 | 3069.48 | 76.74 | 3146.22 | 3120.00 | 26.22 | 26.20 |
| Weber A1 Seepark 2025 (`4db92f3f`) | vereinbart, Lauf 3 % | 3 % / 3.00 | 2296.54 | 68.90 | 2365.44 | 2400.00 | -34.56 | -34.55 |
| Meier A2 Seepark 2025 (`5d2315bf`, 181 Tage, Heizprofil) | vereinbart | 3 % / 3.00 | 1415.51 | 42.47 | 1457.98 | 1320.00 | 137.98 | 138.00 |
| Brunner A2 Seepark 2025 (`870b1fe1`, 184 Tage, Heizprofil) | vereinbart | 3 % / 3.00 | 1306.92 | 39.21 | 1346.13 | 1440.00 | -93.87 | -93.85 |

Unabhängige Herleitung Alpenblick 2025: Heizung nach Verbrauch 1792.00 + 4880.00 − 1494.00 = 5178.00; Schneeräumung 920 + 380 = 1300; Allgemeinstrom 182.60 + 196.30 = 378.90; Kaltwasser 470. Keller (72/255): 367.06 + 132.71 + 106.98 + 1462.02 = 2068.77; 3 % = 62.0631 → 62.06. Fischer (98/255): 499.61 + 180.63 + 145.62 + 1989.98 = 2815.84; 0 %.

Seepark 2025: Fernwärme 1520 + 790 + 395 + 1410 (Q4 2025, Rechnungsdatum 20.01.2026, Leistungszeitraum 01.10.-31.12.2025) = 4115.00; Fernwärme Q4 2024 (Leistungszeitraum 2024) zählt nicht. Kabelanschluss 912 pro Einheit = 228. Die Pauschale von Meier/Brunner folgt der Zwischensumme der Heizprofil-Anteile (55.8 % / 44.2 %).

Rate gegen Vertrag: `select ... from utility_statements s join rental_contracts c on c.id=s.contract_id`: bei allen 19 Abrechnungen gilt: nicht vereinbart → 0.00; eigener Satz (Bernasconi 2.50) → eigener Satz; sonst Satz des Laufs (3.00 in den Demodaten und im Alpenblick-Lauf der Persona). Der Vertrag von Graf (2.02, eigener Satz 4.00) beginnt 2027 und hat keine Abrechnung. Der Satz des Laufs ist in der Datenbank nicht gespeichert, ich konnte ihn nur aus dem gespeicherten Satz der Abrechnung ablesen (siehe «Nicht bestätigt»).

## Webseite

`GET /statements/<id>` (Cookie-Sprache de, fr, en für beide Alpenblick-2025-Abrechnungen; it nur geladen, nicht im Text ausgewertet) zeigt Zwischensumme, Pauschale («3 % der Zwischensumme» bzw. «0 % …»), Gesamtkosten, Akonto, «vor Rundung», Rundung, Saldo mit denselben Beträgen wie die Datenbank. API `GET /api/v1/statements/5e814f1c-…` liefert `managementFeePercent "0.00"`, `managementFee "0.00"`, `totalCosts "2815.84"`, `balance "-184.15"`.

## PDFs

- Gespeicherte PDFs aller 19 Abrechnungen (Sprache des Mieters: de, fr, it): alle Beträge (Zwischensumme, Pauschale, Total, Akonto, vor Rundung, Rundung mit Vorzeichen, Saldo) kommen im Text vor; die Pauschalenzeile nennt den gespeicherten Satz («3 %», «2.5 %»). Bei 0 % fehlt die Zeile (D-1). Vorzeichen der Rundung geprüft (z. B. Weber 2024: -70.24 → -70.25, «+ 0.01»; Keller 2025: «– 0.02»).
- Alle Sprachen: Ich habe die Abrechnungen mit dem Code des Commits in einer Wegwerf-Kopie der Datenbank (`pg_dump` in `dwello_review89`, danach gelöscht) in de, fr, it und en neu gerendert (76 PDFs); `pdfcheck2.py` findet bei allen alle Beträge. Pauschalenzeile in en: «Management fee: 2.5 % of the subtotal of CHF 3'117.87»; fr: «Frais de gestion : 3 % du sous-total de CHF 2'068.77»; it: «Spese di gestione: 3 % del subtotale …».

## QR-Rechnungen (`qr.py`, 300 dpi, Seite 2)

IBAN `CH4431999123000889012` (Prüfziffer mod 97 = 1, QR-IBAN, daher Referenztyp QRR), Zahlungsempfänger Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, CHF. Referenz je 27 Ziffern, Prüfziffer (Modulo 10 rekursiv) gültig und gleich `qr_bill_reference` in der Datenbank.

| Abrechnung | Betrag im QR | Saldo DB | Schuldner im QR | Mitteilung |
|---|---|---|---|---|
| NK-11111111-2024-0001 Müller | 72.60 | 72.60 | Hans Müller, Bahnhofstrasse 42, 8001 Zürich | Nebenkostenabrechnung NK-… |
| NK-11111111-2024-0004 Rossi | 35.70 | 35.70 | Maria Rossi, … | Conteggio spese accessorie NK-… |
| NK-11111111-2025-0001 Müller | 215.80 | 215.80 | Hans Müller | Nebenkostenabrechnung NK-… |
| NK-11111111-2025-0003 Dubois | 142.40 | 142.40 | Pierre Dubois | Décompte des charges NK-… |
| NK-11111111-2025-0004 Rossi | 238.10 | 238.10 | Maria Rossi | Conteggio spese accessorie NK-… |
| NK-22222222-2024-0002 Meier | 121.05 | 121.05 | Sarah Meier, Hirschmattstrasse 21, 6003 Luzern | Nebenkostenabrechnung NK-… |
| NK-22222222-2024-0003 Bernasconi | 26.20 | 26.20 | Marco Bernasconi, Seeweg 15, 6003 Luzern | Conteggio spese accessorie NK-… |
| NK-22222222-2025-0002 Meier | 138.00 | 138.00 | Sarah Meier | Nebenkostenabrechnung NK-… |
| NK-22222222-2025-0004 Bernasconi | 75.80 | 75.80 | Marco Bernasconi | Conteggio spese accessorie NK-… |

Schuldneradressen stimmen mit der Tabelle `tenants` überein. Zusätzlich zeigen die neu gerenderten PDFs von Meier und Bernasconi 2025 in allen vier Sprachen dieselben QR-Daten (Mitteilung in der jeweiligen Sprache, z. B. «Utility Cost Statement NK-22222222-2025-0004»).
Abrechnungen mit Rückerstattung (Saldo ≤ 0, u. a. Keller und Fischer in Alpenblick) haben erwartungsgemäss keinen Zahlteil und keinen QR-Code (kein Code gefunden).

## Geprüft und bestanden

Alle 19 Abrechnungen (Zwischensumme, Pauschale, Total, Akonto, Saldo, Satz): Musterhaus Zentrum 2024 und 2025 (Müller, Schmidt, Dubois, Rossi), Seepark 2024 (Weber, Meier, Bernasconi) und 2025 (Weber, Meier, Brunner, Bernasconi), Alpenblick 2024 und 2025 (Keller, Fischer). Genannte Datensätze: `5223d216`, `5e814f1c`, Seepark-2025-Entwürfe, Bernasconi (2.5 %), Weber (3 %), Fischer 2024 (0 %), je mit Webseite (Alpenblick 2025) und PDF.

## Nicht bestätigt

- Der Satz des Abrechnungslaufs (hier «3 %») steht nicht in der Datenbank; ich kann nur bestätigen, dass der gespeicherte Satz mit dem Vertrag und der genannten Eingabe übereinstimmt, nicht, was im Lauf eingegeben wurde. Die Obergrenze 10 % und der Vorrang des eigenen Satzes bei abweichendem Satz des Laufs sind an den Daten nicht prüfbar, weil keine Abrechnung mit abweichendem Lauf-Satz existiert (keine Daten geändert, um sie zu erzeugen). Einziger eigener Satz in den Daten: Bernasconi 2.5 %; das Constraint `rental_contracts_management_fee_percent_check` (0-10) ist in der Datenbank vorhanden.
- Webseite: nur die beiden Alpenblick-2025-Abrechnungen und nur de/fr/en im Text ausgewertet (it geladen, HTTP 200, nicht gelesen); die Seiten der Seepark-Entwürfe und von Fischer 2024 wurden nicht geladen (Beträge dort über API/DB und PDF bestätigt; nur für Fischer 2025 die API).
- Sprachen: Für die gespeicherten PDFs gilt nur die Sprache des Mieters. Die Prüfung in en (und für Mieter anderer Sprache) beruht auf Neuberechnung des PDFs mit dem Code des Commits in einer Kopie der Datenbank, nicht auf dem Download der laufenden App, denn `generate-pdf` würde in der Persona-Datenbank schreiben. Die Referenz (`qr_bill_reference`) leite ich nicht selbst aus der Abrechnungs-ID ab; geprüft ist nur Format, Prüfziffer und Gleichheit mit der Datenbank.
- Die Persona-Datenbank wurde nicht verändert (nur SELECT und GET). Die Wegwerf-Kopie `dwello_review89` ist gelöscht.
