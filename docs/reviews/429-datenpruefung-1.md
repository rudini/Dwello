# Datenprüfung #429 «Nebenkostenpauschale pro Monat», Runde 1

Geprüft: Commit fa9cc056 (Worktree `/tmp/claude-0/-home-user-Dwello/3fdb8c73-c9cc-5628-83f0-67a7b1a60366/scratchpad/review-429-daten`, Änderung 4e59e224..fa9cc056), laufende Persona-Umgebung (Frontend :3300, Backend :3301, Datenbank `dwello_persona`). Stand der Daten: 18.10.2026. Es wurde nichts in der Datenbank verändert (nur SELECT, GET-Seiten, der Stored-PDF-Download und die nicht speichernde `/statements/preview`).

Eigene Rechnung: `/tmp/claude-0/-home-user-Dwello/3fdb8c73-c9cc-5628-83f0-67a7b1a60366/scratchpad/calc/recompute.py` (Abrechnung 2025, Jahr 2024 mit `recompute24.py`) und `.../calc/pages.py` (Monatlich total gegen alle Seiten). Beide lesen nur aus der Datenbank, kein Dwello-Rechencode.

## Ergebnis in einem Satz

Kein Blocker, kein Major, kein Minor. Alle Beträge stimmen auf den Rappen; die Pauschale kommt in Abrechnung, PDF und Vorschau nicht vor. Ein Nit (Hinweis, keine Fehlberechnung) und «Nicht bestätigt» siehe unten.

## Befunde

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| D-1 | Nit | Vertrag 41492510-5d69-40f7-b8af-b521fe10d51f (Rosa Gerber, Akonto 0.00, Pauschale 120.00) | Fachliche Frage, kein Rechenfehler: eine Abrechnung für diesen Vertrag zieht kein Akonto ab (Pauschale wird nie abgerechnet), die Mieterin hätte dann die vollen Nebenkostenanteile als Nachzahlung. Die Regel «nie abgerechnet» verlangt das so; ob die App davor warnen soll, ist nicht festgelegt. | Nicht durch Erzeugen einer Abrechnung geprüft (würde Daten ändern; Vertrag beginnt 01.11.2026, noch keine Abrechnungsperiode). Nur zur Kenntnis. |

## Geprüft und bestanden

### 1. Vertrag Thomas Weber (b0000002-0002-0002-0002-000000000001), Pauschale 50.00

Eingaben aus der Datenbank: Wohnung A1 68.00 m², Gebäude Seepark Residenz 4 Wohnungen, Fläche 320.00 m² (68+82+75+95), Mietvertrag 01.04.2022 unbefristet, Akonto 200.00, Verwaltungspauschale vereinbart, Satz des Laufs 3 %, kein Tankbestand im Gebäude, alle 12 Kategorien vereinbart. Mietstage 365/365 (alle Rechnungen ohne Leistungszeitraum im Jahr 2025, Fernwärme Q4 mit Leistungszeitraum 01.10.–31.12.2025, Rechnungsdatum 20.01.2026, zählt voll).

Abrechnung NK-22222222-2025-0001 (Entwurf), Periode 01.01.–31.12.2025:

| Position | Kosten Gebäude | Schlüssel | Eigene Rechnung | Gespeichert | Webseite | PDF |
|---|---|---|---|---|---|---|
| TV/Kabel | 912.00 | 1/4 | 228.00 | 228.00 | 228.00 | 228.00 |
| Hauswart | 3'060.00 | 68/320 | 650.25 | 650.25 | 650.25 | 650.25 |
| Heizung | 4'115.00 | 68/320 | 874.44 (874.4375) | 874.44 | 874.44 | 874.44 |
| Kaltwasser | 2'060.00 | 68/320 | 437.75 | 437.75 | 437.75 | 437.75 |
| Allgemeinstrom | 499.30 | 68/320 | 106.10 (106.10125) | 106.10 | 106.10 | 106.10 |
| Zwischensumme | | | 2'296.54 | | 2'296.54 | 2'296.54 |
| Verwaltungspauschale 3 % | | | 68.90 (68.8962) | 68.90 | 68.90 | 68.90 |
| Ihre Nebenkosten (`total_costs`) | | | 2'365.44 | 2365.44 | 2'365.44 | 2'365.44 |
| Akonto 12 × 200.00 | | | 2'400.00 | 2400.00 | 2'400.00 | 2'400.00 |
| Saldo vor Rundung | | | −34.56 | | 34.56 Rückerstattung | 34.56 |
| Rundung auf 5 Rappen (Rückerstattung aufgerundet) | | | +0.04 | | +0.04 | +0.04 |
| Saldo (`balance`) | | | −34.60 | −34.60 | 34.60 Rückerstattung | 34.60 |

- Die Pauschale (50.00 je Monat, 600.00 im Jahr) steht nicht im Akonto, nicht in den Kosten, nicht im Saldo. `pdftotext` des PDF findet weder «Nebenkostenpauschale» noch 50.00 noch 600.00 (Zählung 0; das einzige Wort «Verwaltungspauschale» ist die Verwaltungspauschale).
- Das gespeicherte PDF (`pdf_blob`, md5 04b28be67ca8b9ce26c1bd1aa049ce4e) ist identisch mit dem Download über `/statements/<id>/pdf`. Es wurde 00:08:03 erzeugt, der Vertrag mit Pauschale 50.00 zuletzt 00:07:37 geändert: das PDF entstand also nach dem Setzen der Pauschale.
- Vorschau `POST /api/v1/statements/preview` (speichert nichts) mit dem heutigen Vertrag (Pauschale 50.00): subtotal 2296.54, managementFee 68.9, totalCosts 2365.44, totalAdvancePayments 2400, balance −34.6. Gleich wie gespeichert.
- Rückerstattung: kein Zahlteil, kein QR-Code auf der Seite (PDF-Seite gerendert, `pdftoppm -png`, Seite 1 und 2 angesehen).
- Zusatzprobe, Abrechnung NK-22222222-2024-0001 (bezahlt, 366 Tage): eigene Rechnung Zwischensumme 2'261.90, Verwaltungspauschale 67.86, Total 2'329.76, Saldo −70.24 → −70.25. Gespeichert 2329.76 / −70.25. Gleich.
- Weitere gespeicherte Abrechnungen der übrigen Verträge wurden nicht neu gerechnet: keiner hat eine Pauschale ungleich 0.

### 2. Neuer Vertrag Rosa Gerber (41492510-5d69-40f7-b8af-b521fe10d51f), Alpenblick OG2, ab 01.11.2026

Nettomiete 1500.00 + Zusatzmiete 0.00 + Akonto 0.00 + Pauschale 120.00 = **1'620.00**. Vertragsliste, Vertragsseite (de, fr, it, en), Wohnungsseite OG2 (Zeile «CHF 1'620.00 monatlich total», fr/it/en ebenso) und Mieterseite zeigen 1'620.00. Die Vertragsseite zeigt die Zeile «Nebenkostenpauschale CHF 120.00» (fr «Forfait de frais accessoires», it «Forfait per le spese accessorie», en «Flat-rate utility charge»).

### 3. «Monatlich total» aller 12 Verträge

Rechnung: `base_rent + coalesce(additional_rent,0) + monthly_advance_payment + flat_rate_utility_charge`. Verglichen mit Vertragsliste, Vertragsseite, Wohnungsseite und Mieterseite (`pages.py`, 36 Prüfungen, 0 Abweichungen; Ausgabe «fails 0»). Die Wohnungsseite zeigt für laufende und künftige Verträge das Total, für beendete Verträge in der Verlaufszeile («Beendet», Prüfung: Betrag steht auf der Seite).

| Vertrag | Netto | Zusatz | Akonto | Pauschale | Total | Liste | Vertrag | Wohnung | Mieter |
|---|---|---|---|---|---|---|---|---|---|
| Rosa Gerber OG2 | 1500 | 0 | 0 | 120 | 1'620.00 | ok | ok | ok | ok |
| Nina Brunner A2 | 1620 | 80 | 240 | 0 | 1'940.00 | ok | ok | ok | ok |
| Marco Bernasconi B2 | 1750 | 100 | 260 | 0 | 2'110.00 | ok | ok | ok | ok |
| Pierre Dubois 2.01 | 1650 | 0 | 270 | 0 | 1'920.00 | ok | ok | ok | ok |
| Laura Keller EG | 1350 | 50 | 190 | 0 | 1'590.00 | ok | ok | ok | ok |
| Anna Schmidt 1.02 | 1850 | 120 | 300 | 0 | 2'270.00 | ok | ok | ok | ok |
| Thomas Weber A1 | 1200 | 0 | 200 | 50 | 1'450.00 | ok | ok | ok | ok |
| Sarah Meier A2 (beendet) | 1550 | 80 | 220 | 0 | 1'850.00 | ok | ok | ok | ok |
| Kevin Fischer OG1 | 1800 | 120 | 250 | 0 | 2'170.00 | ok | ok | ok | ok |
| Hans Müller 1.01 | 1450 | 100 | 240 | 0 | 1'790.00 | ok | ok | ok | ok |
| Maria Rossi 3.01 | 2400 | 150 | 350 | 0 | 2'900.00 | ok | ok | ok | ok |
| Kevin Fischer 1.01 (beendet) | 1350 | 100 | 180 | 0 | 1'630.00 | ok | ok | ok | ok |

Ohne Pauschale, ausführlich geprüft: Hans Müller (b0000001-…-000000000001): Vertragsseite 1'450 / Akonto 240 / Nebenkostenpauschale 0.00 / Zusatzmiete 100 / Total 1'790.00. Weber: Zeile Nebenkostenpauschale 50.00, Total 1'450.00 (auch auf Wohnung A1 und Mieterseite).

### 4. Code-Lesung (nur zur Bestätigung, nicht als Rechenquelle)

`git diff 4e59e224 fa9cc056 -- backend/src`: Die Spalte wird nur in `schema.ts`, `contract.service.ts` (Auswahl) und `routes/contracts.ts` (Schema) geführt; `calculation.service.ts` und die PDF-Dienste sind unverändert und nennen die Pauschale nicht (`grep -i flatRate backend/src` findet sie nur dort). Migration 0025: `NOT NULL DEFAULT 0`, die Datenbank hat die Spalte.

## Nicht bestätigt

- **QR-Rechnung:** Keine der betroffenen Abrechnungen hat einen Zahlteil (Weber 2025 und 2024: Rückerstattung; Rosa Gerber: noch keine Abrechnung). IBAN, Betrag, Referenz mit Prüfziffer, Mitteilung und Schuldner eines QR-Codes konnten deshalb nicht dekodiert werden. Unabhängig davon enthalten die Entwürfe/Abrechnungen mit Nachzahlung (NK-11111111-2024-0001, -0004, NK-22222222-2024-0002, -0003, NK-11111111-2025-0001, -0003, -0004, NK-22222222-2025-0003, -0004) Verträge ohne Pauschale; sie sind von der Änderung nicht betroffen und wurden nicht neu gerechnet. Wer einen QR-Code mit Pauschale prüfen will: ein Vertrag mit Pauschale und Nachzahlung müsste angelegt werden (ändert Daten, ausserhalb meiner Rolle).
- **PDF in fr/it/en:** Das PDF von Weber existiert nur in der gespeicherten Sprache (de, Mietersprache). Andere Sprachen erzeugen heisst `generate-pdf` aufrufen und die Daten ändern; nicht getan. Die Zahlen sind sprachunabhängig, die Rechenwerte stammen aus denselben gespeicherten Werten.
- **Webseite der Abrechnung in fr/it/en:** nicht durchgesehen (nur Vertrags- und Wohnungsseiten in allen vier Sprachen).
- **Erzeugen einer neuen Abrechnung für einen Vertrag mit Pauschale:** nur über die Vorschau geprüft (Weber 2025), nicht über `generate`, weil das Daten ändern würde.
- **D-1** (Akonto 0 mit Pauschale): nicht über eine Abrechnung belegt, siehe Befund.

## Reproduktion

```
export PGPASSWORD=dwello
psql -h localhost -U dwello -d dwello_persona -c "select id,base_rent,additional_rent,monthly_advance_payment,flat_rate_utility_charge from rental_contracts"
python3 -I /tmp/claude-0/-home-user-Dwello/3fdb8c73-c9cc-5628-83f0-67a7b1a60366/scratchpad/calc/recompute.py     # Abrechnung 2025, Weber
python3 -I /tmp/claude-0/-home-user-Dwello/3fdb8c73-c9cc-5628-83f0-67a7b1a60366/scratchpad/calc/pages.py         # Monatlich total, alle Seiten (erwartet: fails 0)
```
`pages.py` liest das Sitzungs-JWT aus `calc/tok.txt` (`python3 -I calc/jwt.py > calc/tok.txt`, Secret der Persona-Umgebung, 1 Stunde gültig).
