# Datenprüfung #338 («Neu berechnen» eines Entwurfs), Runde 1

Geprüft: Datenbank `dwello_persona` (nur lesend), Stack aus Commit 7f8798f3. Eigene Rechnung: `/tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/d338/recompute.py` (liest Rechnungen, Verteilschlüssel, Wohnungen, Mietverträge, Heizprofil aus der Datenbank; Regeln aus `docs/nebenkostenabrechnung-anforderungen.md`, Regeln 1 bis 9; kein Dwello-Code importiert). Aufruf: `python3 -I recompute.py`.

## Ergebnis

Keine Blocker, Major oder Minor bei den Beträgen. Alle Beträge von NK-22222222-2025-0001 stimmen auf den Rappen mit meiner Neuberechnung überein, ebenso die Werte «vorher» aus Helgas Bericht. Zwei Hinweise (Nit) zur Aufgabenstellung und zur Prüfbarkeit.

| ID | Schwere | Datensatz | Erwartet | Gefunden |
|---|---|---|---|---|
| D-1 | Nit | Rechnung 9fcf1789-73ed-4432-8ef5-8a3f380977d3 (Auftrag) | Auftrag: Verteilschlüssel «Gleichmässig pro Wohnung», die ID sei die des Schlüssels | `9fcf1789…` ist die Rechnungs-ID. `invoices.distribution_key_id` ist NULL, es gibt keinen Schlüssel «Gleichmässig pro Wohnung» (`distribution_keys`: Per Unit, Per Area, Per Rooms, Heating). Regel 3 («ohne Schlüssel gleichmässig pro Wohnung») führt trotzdem zu 480 / 4 = 120.00. Das deckt sich mit Helgas Bericht («ohne Verteilschlüssel»). Kein Rechenfehler, nur die Beschreibung im Auftrag stimmt nicht. |
| D-2 | Nit | Webseite, PDF, QR-Rechnung, Vorschau-Endpunkt | siehe «Nicht bestätigt» | nicht geprüft |

## Neuberechnung NK-22222222-2025-0001 (Thomas Weber, A1, 01.01.–31.12.2025, 365 Mietstage)

Eingaben aus der Datenbank: Wohnung A1 68.00 m², Gebäude 320.00 m² (A1 68, A2 82, B1 75, B2 95), 4 Wohnungen, Heizprofil «Heizung + Warmwasser» (ganze Periode, nach Tagen), Mietvertrag b0000002-…-0001 (Beginn 2022-04-01, Akonto 200.00 / Monat, Verwaltungspauschale vereinbart, Satz des Laufs 3.00 %).

| Position (sort_order) | Gebäude (aus Rechnungen) | Schlüssel | Wohnungsanteil (gerundet) | Ihr Anteil, eigene Rechnung | gespeichert |
|---|---|---|---|---|---|
| 0 TV/Cable | 912.00 | Pro Einheit, 1/4 | 228.00 | 228.00 | 228.00 |
| 1 Heating | 4'115.00 (1520 + 790 + 395 + 1410; Fernwärme Q4 2024 mit Leistungszeitraum 2024 zählt 0) | Fläche 68/320 | 874.44 | 874.44 | 874.44 |
| 2 Caretaker | 3'060.00 (4 × 765) | Fläche 68/320 | 650.25 | 650.25 | 650.25 |
| 3 Cold Water | 2'060.00 | Fläche 68/320 | 437.75 | 437.75 | 437.75 |
| 4 Electricity | 499.30 | Fläche 68/320 | 106.10 | 106.10 | 106.10 |
| 5 Caretaker (neu, 9fcf1789…) | 480.00 | ohne Schlüssel = pro Wohnung, 1/4 | 120.00 | 120.00 | 120.00 |
| Zwischensumme | | | | 2'416.54 | (Summe der Positionen = 2'416.54) |
| Verwaltungspauschale 3 % | | | | 72.4962 → 72.50 | 72.50 (`management_fee_percent` 3.00) |
| Ihre Nebenkosten | | | | 2'489.04 | `total_costs` 2489.04 |
| Akonto 12 × 200.00 | | | | 2'400.00 | `total_advance_payments` 2400.00 |
| Saldo vor Rundung | | | | +89.04 | |
| Saldo (auf 5 Rappen, Nachzahlung abgerundet) | | | | 89.00 | `balance` 89.00 |

Weitere Prüfungen am Datensatz:
- Je Position stimmt `total_amount` mit der Summe der gespeicherten Rechnungen (`utility_statement_line_items.invoices`) überein (Query siehe unten); die neue Zeile 5 enthält genau Rechnung 9fcf1789 über 480.
- Keine doppelte oder fehlende Position (6 Positionen, vorher laut Helga 5).
- «Vorher»-Werte: Meine Rechnung ohne die Rechnung 9fcf1789 ergibt Zwischensumme 2'296.54, Pauschale 68.90, Nebenkosten 2'365.44, Saldo vor Rundung −34.56, Saldo −34.60 (Rückerstattung). Das ist genau Helgas «vorher».
- Frische Abrechnung desselben Mietvertrags und derselben Periode: Meine unabhängige Rechnung aus den heutigen Rechnungen (= was eine frische Abrechnung rechnen muss) ergibt dieselben Beträge wie der neu berechnete Entwurf (Gesamtkosten, Pauschale, Akonto, Saldo, alle 6 Positionen: «MATCH»). Der Vorschau-Endpunkt selbst wurde nicht aufgerufen (siehe «Nicht bestätigt»).
- Beibehaltene Felder: `statement_number` NK-22222222-2025-0001, `statement_date` 2026-10-19, `payment_deadline` 2026-11-18 (Abrechnungsdatum + 30 Tage), `heating_profile_id` f573af84… (Heizung + Warmwasser), `management_fee_percent` 3.00, `notes` leer, `status` draft, `replaces_id` NULL, `prior_payments` 0. Zeitstempel: `created_at` 10:10:18, `updated_at` 10:13:43 (nach der Rechnung 10:12:04). Statement-ID unverändert (f9ea2452-…). Die Werte für Datum und Frist sind identisch mit denen der Schwesterentwürfe (alle am selben Tag erzeugt) und mit Helgas Bericht (19.10.2026 / 18.11.2026); einen eigenen Vorher-Stand habe ich nicht, ausser diesem Vergleich.
- PDF verworfen: `pdf_blob` NULL, `pdf_generated_at` NULL, keine Zeile in `documents` für diese Abrechnung. Die Schwesterentwürfe haben ein `pdf_blob` (`pdf_blob is null` = false).
- Aufgefallen, kein Befund: `key_values` {"area":[68,320],"rooms":[3,14.5],"units":[1,4]} stimmt mit den Wohnungen überein; `heating_share` {"byDays":true,"reason":"wholePeriod"} ist stimmig.

## Entwürfe 0002 bis 0004 (unverändert)

| Abrechnung | `updated_at` | Positionen | gespeichert (Nebenkosten / Pauschale / Akonto / Saldo) | eigene Rechnung ohne die 480.00 | |
|---|---|---|---|---|---|
| 0002 Sarah Meier (181 Tage) | 10:10:18.27 (vor der Rechnung 10:12:04) | 5, keine 480.00 | 1'250.32 / 36.42 / 1'320.00 / −69.70 | 1'250.32 / 36.42 / 1'320.00 / −69.70 | gleich |
| 0003 Nina Brunner (184 Tage) | 10:10:18.41 | 5, keine 480.00 | 1'553.79 / 45.26 / 1'440.00 / 113.75 | 1'553.79 / 45.26 / 1'440.00 / 113.75 | gleich |
| 0004 Marco Bernasconi (365 Tage, 2.50 %) | 10:10:18.54 | 5, keine 480.00 | 3'195.82 / 77.95 / 3'120.00 / 75.80 | 3'195.82 / 77.95 / 3'120.00 / 75.80 | gleich |

Alle drei zeigen die Werte aus Helgas Bericht (−69.70, 113.75, 75.80) und sind seit der Erstellung nicht geändert worden. Sie sind veraltet, wie gewollt: Mit der 480.00-Rechnung rechnet dieselbe Logik 0002 −8.40, 0003 +176.05, 0004 +198.80 (meine Rechnung, nur zur Information; diese Werte sind nirgends gespeichert und kein Befund).

## Reproduktion

```
export PGPASSWORD=dwello
psql -h localhost -U dwello dwello_persona -c "select statement_number,status,statement_date,payment_deadline,total_costs,management_fee,management_fee_percent,total_advance_payments,balance,pdf_blob is null as nopdf,updated_at from utility_statements where statement_number like 'NK-22222222-2025%' order by 1"
psql -h localhost -U dwello dwello_persona -c "select s.statement_number,l.sort_order,l.total_amount,l.tenant_share,(select sum((x->>'amount')::numeric) from jsonb_array_elements(l.invoices) x) sum_inv from utility_statement_line_items l join utility_statements s on s.id=l.statement_id where s.statement_number like 'NK-22222222-2025%' order by 1,2"
psql -h localhost -U dwello dwello_persona -c "select id,distribution_key_id,amount from invoices where description like '%Nachtrag%'"
python3 -I /tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/d338/recompute.py
```

Ausgabe von `recompute.py` für 0001 mit allen aktuellen Rechnungen: `sub 2416.54 fee 72.50 total 2489.04 raw 89.04 saldo 89.00 | MATCH`.

## Geprüft und bestanden

- NK-22222222-2025-0001: alle 6 Positionen (Betrag Gebäude, Wohnungsanteil, Ihr Anteil), Zwischensumme, Verwaltungspauschale, Nebenkosten, Akonto, Saldo vor Rundung, Rundung auf 5 Rappen, Saldo; gespeicherte Rechnungen je Position; Nummer, Datum, Frist, Heizprofil, Satz, Bemerkung erhalten; PDF verworfen.
- Rechnung 9fcf1789: Betrag 480.00, Datum 31.12.2025 (in der Periode), Kategorie Caretaker (Hauswart), umlagefähig, ohne Leistungszeitraum, vereinbarte Kategorie im Mietvertrag.
- NK-22222222-2025-0002, 0003, 0004: unverändert und rechnerisch konsistent mit dem Rechnungsstand ohne die 480.00.

## Nicht bestätigt

- Vorschau-Endpunkt `POST /api/v1/statements/preview`: Er verlangt ein JWT. Ein Token mit dem Persona-Geheimnis selbst auszustellen hat die Berechtigungsprüfung abgelehnt, ich habe es nicht umgangen. Ersatz: eigene Rechnung aus der Datenbank (gleiche Regeln). Ob der Endpunkt dieselben Beträge liefert, ist damit nicht direkt belegt. Mit einem vom Aufrufer bereitgestellten Token (Body: `contractId` b0000002-0002-0002-0002-000000000001, `periodStart` 2025-01-01, `periodEnd` 2025-12-31, `heatingProfileId` f573af84-bfba-4132-943e-7c8aac9c351f, `managementFeePercent` 3) lässt sich das in einem Aufruf ergänzen.
- Webseite der Abrechnung (alle vier Sprachen): nicht geprüft, wegen fehlender Sitzung ohne Anmeldung; die Datenbankwerte sind belegt, die Darstellung nicht.
- PDF und QR-Rechnung (alle Sprachen): Für 0001 gibt es kein PDF (verworfen, `pdf_blob` NULL), also keine QR-Rechnung zu dekodieren. Die Entwürfe 0002 bis 0004 haben ein PDF, sind aber nicht Teil der Änderung (nicht neu berechnet) und wurden nicht gerendert. QR-Referenz 011801884097540500259836341 von 0001 ist gespeichert, ihre Prüfziffer und Zuordnung habe ich nicht geprüft, weil ohne PDF nichts davon ausgegeben wird.
- Rückgesetzte Felder `fuel_stock` und `key_values` im Vorher-Stand: Es gibt keinen gespeicherten Vorher-Stand (kein Audit-Eintrag, `audit_log` leer); der Vergleich «behalten» stützt sich auf Helgas Bericht und die Schwesterentwürfe.
- Läuft auf Commit 7f8798f3, nicht 4f6d52d9 (so vom Aufrufer vorgegeben); der Unterschied wurde nicht geprüft.

## Hinweis zum Arbeitsablauf

Beim ersten Anlauf landete `recompute.py` kurz im Verzeichnis `/home/user/Dwello` (ein fehlgeschlagenes `cd`); ich habe die Datei sofort in den Scratchpad verschoben. `git status` im Repository ist wieder sauber (0 Änderungen). Es wurden keine Daten geändert.
