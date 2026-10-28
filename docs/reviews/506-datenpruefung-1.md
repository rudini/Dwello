# Datenprüfung Slice 506, Runde 1

Geprüfter Stand: Worktree `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/review-506-daten` (a642fa8), laufende Persona-Instanz (Frontend :3300, Backend :3301, Datenbank `dwello_persona`).

Methode: eigenes Rechenskript `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/w/recompute.py` (liest Rechnungen, Verteilschlüssel, Wohnungen, Tankbestände, Verträge direkt aus der Datenbank, ohne Dwello-Code). Eichung: Das Skript trifft die gespeicherten Beträge von NK-11111111-2024-0003 (3226.50), NK-33333333-2024-0001 (2247.66, Saldo -32.35) und NK-22222222-2024-0002 (2761.07, Saldo 121.05) auf den Rappen. Die Anfragen liefen mit einem selbst signierten JWT (Secret aus `persona-stack.sh`) als Bearer-Token beim Backend und als Cookie `dwello_session` beim Frontend. Das JWT-Skript liegt unter `.../scratchpad/w/jwt.py`.

## Ergebnis

Die Kernregeln von #506 stimmen auf den Rappen. Ein Befund (Minor) betrifft den Sonderfall eines alten, nicht auf 5 Rappen gerundeten Übertrags.

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| D-1 | Minor | Entwurf, der einen Übertrag mit einem Saldo ausserhalb des 5-Rappen-Rasters zählt (vor #79 kaufmännisch gerundet, z. B. 3.02), nachdem dieser von Hand ausgeglichen wurde. Beispiel: Entwurf NK-33333333-2025-0001 (id `803152e8-02bd-4f50-9c18-810b989d6d19`, inzwischen gelöscht), Übertrag aus NK-33333333-2024-0001 | Saldo -149.20: Die Kosten 2130.83 minus Akonto 2280.00 ergeben -149.17, zugunsten des Mieters auf 5 Rappen gerundet -149.20, mit der Zeile «Rundung auf 5 Rappen + 0.03». | Saldo -149.17 in der Datenbank, im PDF («Rückerstattung CHF 149.17», keine Rundungszeile) und auf der Seite («Sie erstatten dem Mieter CHF 149.17 zurück»). Ursache: `dropFromDrafts` in `backend/src/services/statement.service.ts` zieht den Übertrag vom schon gerundeten Saldo des Entwurfs ab (`balance - <Übertrag>`), statt neu zu runden. Bei einem Übertrag auf 5-Rappen-Raster (3.00) tritt das nicht auf. |

### D-1: Beleg und Reproduktion

Ausgangslage: Alpenblick, Vertrag `b0000003-0003-0003-0003-000000000001`, Abrechnung NK-33333333-2024-0001 (`0a4a75c8-3557-4c85-a27c-293793cd66c1`).

```
-- 1. Abrechnung auf «Erledigt» mit altem, kaufmännisch gerundetem Saldo
update utility_statements set status='settled', balance='3.02', paid_date=null, paid_amount=null,
  payment_recorded_at=null, carry_settled_on=null where id='0a4a75c8-3557-4c85-a27c-293793cd66c1';
-- 2. Entwurf 2025 erzeugen, der den Übertrag zählt
POST /api/v1/statements/generate {contractId, buildingId, periodStart:2025-01-01, periodEnd:2025-12-31}
-- 3. Von Hand ausgleichen
POST /api/v1/statements/0a4a75c8-3557-4c85-a27c-293793cd66c1/carry-settled
```

Ausgabe `select statement_number,status,balance,carried_from_id from utility_statements where contract_id='b0000003-0003-0003-0003-000000000001'`:

```
vorher (Entwurf zählt 3.02):   NK-33333333-2025-0001 | draft | -146.15 | <id>   (Rechnung: 2130.83 - 2280.00 + 3.02 = -146.15, stimmt)
nachher (von Hand ausgeglichen): NK-33333333-2025-0001 | draft | -149.17 |        (erwartet -149.20)
```

Mein Skript: `python3 -I .../w/recompute.py b0000003-0003-0003-0003-000000000001 2025-01-01 2025-12-31 0` gibt `raw -149.17`, `saldo -149.2`. «Neu berechnen» (`POST /api/v1/statements/<id>/recalculation`) korrigiert den Entwurf auf -149.20; das Problem betrifft also nur einen Entwurf, den der Verwalter nicht neu berechnet.

Einordnung Minor: Der Fall braucht einen Saldo, der vor #79 versendet wurde und nicht auf 5 Rappen steht (Anforderungen Thema 8: «Eine vor #79 versendete Abrechnung behält ihren kaufmännisch gerundeten Saldo»). Der Entwurf lässt sich durch «Neu berechnen» heilen.

## Prüfpunkte der Anfrage

### 1. Pierres Abrechnung NK-11111111-2024-0003: bestätigt

- `GET /api/v1/dashboard` → `contractTasks.openCarryOvers` ist `[]`. Pierres Vertrag steht unter `expiredContracts`.
- `carry_settled_on` = 2026-10-28 (Datenbank). Danach kam `replace`, der Status war `replaced`.
- Gegenprobe, dass die Erkennung «offen» arbeitet: NK-11111111-2024-0001 (Hans Müller, Vertrag `b0000001-0001-0001-0001-000000000001`) per SQL auf «erledigt», Saldo 3.00 gesetzt. Die spätere Abrechnung 2025 ist versendet und zählt keinen Übertrag. Folge: `openCarryOvers` = `[{NK-11111111-2024-0001, Hans Müller, 3.00}]`. Das Frontend zeigt die Aufgabe «Übertrag ausgleichen» mit Text (Übersicht). Nach `carry-settled` ist die Liste wieder leer.
- Ein Entwurf 2026 für denselben Vertrag zählte den offenen Übertrag nicht (`carried_from_id` null, Saldo -2880.00 = 0.00 Kosten - 2880.00 Akonto; mit Übertrag wären es -2877.00 gewesen). Der Entwurf ist wieder gelöscht.
- Zweites `carry-settled` auf dieselbe Abrechnung: HTTP 400, `STATEMENT_NO_CARRY_OVER`.

### 2. Ersetzen und berichtigen von NK-11111111-2024-0003: bestätigt

`POST .../replace` (200): Status `replaced`, `paid_amount` 3.00 (= Saldo der ersetzten), `carry_settled_on` 2026-10-28.
`POST .../correction` (201): NK-11111111-2024-0005 (`0c5c9680-46ea-4999-81b5-89621fc15926`), Entwurf, `replaces_id` auf die alte Abrechnung, `prior_payments` 3.00, `carried_from_id` null.

Eigene Rechnung (Skript, Vertrag `b0000001-0001-0001-0001-000000000003`, 366 von 366 Mietstagen, Heizung mit Tankbestand 2120.00 → 2650.00, also Kosten 6890 - 530 = 6360):

| Position | Gebäude | Wohnungsanteil = Ihr Anteil |
|---|---|---|
| Lift (pro Einheit 1/6) | 1650.00 | 275.00 |
| Hauswart (Fläche 85/492.5) | 3600.00 | 621.32 |
| Kaltwasser | 3760.00 | 648.93 |
| Allgemeinstrom | 755.20 | 130.34 |
| Gartenpflege | 900.00 | 155.33 |
| Kehricht (pro Einheit) | 960.00 | 160.00 |
| Heizung (0.7·Fläche + 0.3·Einheit) | 6360.00 | 1086.37 |
| Kaminfeger | 320.00 | 55.23 |

Zwischensumme 3132.52; Verwaltungspauschale 3 % = 93.98; Ihre Nebenkosten 3226.50; Akonto 12 × 270.00 = 3240.00; bereits bezahlt 3.00. Rohsaldo 3226.50 - 3240.00 - 3.00 = **-16.50**, durch 5 teilbar, also keine Rundung. Schlussabrechnung (Vertragsende 2024-12-31 in der Periode, Flag `final` true).

Vergleich: Alle Werte stimmen, in der Datenbank (`balance` -16.50, `total_costs` 3226.50, `total_advance_payments` 3240.00, `management_fee` 93.98), in der API und in der Seite. Das PDF stimmt in allen vier Sprachen (Mieter Pierre ist fr; für de/it/en habe ich seine Sprache kurz umgestellt und danach wieder auf fr gesetzt). Alle 12 Beträge der Positionen, des Tankbestands und der Heizkosten stehen in jedem PDF. Die Texte lauten:
- de: «Rückerstattung CHF 16.50 … bereits bezahlt CHF 3.00», «Bereits bezahlt auf NK-11111111-2024-0003 – 3.00».
- fr: «Remboursement CHF 16.50 … déjà payé CHF 3.00».
- it: «Rimborso CHF 16.50 … già pagato CHF 3.00».
- en: «Refund CHF 16.50 … already paid CHF 3.00».

Auch die Seite in de, fr, it und en (Cookie `PARAGLIDE_LOCALE`) zeigt Zwischensumme 3'132.52, Pauschale 93.98, 3'226.50, Akonto - 3'240.00, «Bereits bezahlt» - 3.00 und Rückerstattung 16.50.

Die ersetzte Abrechnung zeigt weiter «Saldo: Nachzahlung CHF 3.00» (durch das SQL so gesetzt; die Positionen ergäben -13.50).

Da das Ergebnis eine Rückerstattung ist, gibt es kein Zahlteil (Anforderungen: «bei einer Rückerstattung kein Zahlteil»); das PDF enthält keinen QR-Code. Dass auf der Schlussabrechnung kein Mindestbetrag gilt, war an diesem Datensatz nicht zahlenmässig prüfbar, weil der Saldo 16.50 über CHF 5 liegt.

### 3. Zweiter Vertrag: bestätigt (mit D-1 als Sonderfall)

Vertrag Alpenblick EG `b0000003-0003-0003-0003-000000000001`, Abrechnung NK-33333333-2024-0001 auf «erledigt», Saldo 3.00 gesetzt.
- `POST /generate` für 2025 ergab NK-33333333-2025-0001 mit `carried_from_id` = 2024-0001 und Saldo **-146.20**. Eigene Rechnung: Schneeräumung 367.06 + Allgemeinstrom 106.98 + Kaltwasser 132.71 + Heizung 1462.02 (4880 + 1792 - 1494 = 5178) = 2068.77, Pauschale 62.06, Kosten 2130.83, Akonto 2280.00, Übertrag +3.00, Rohsaldo -146.17, gerundet -146.20 (Rundung +0.03). Das PDF zeigt «Übertrag aus Abrechnung + 3.00», «Rückerstattung vor Rundung 146.17», «Rundung auf 5 Rappen + 0.03», «Rückerstattung 146.20».
- Nach `POST .../carry-settled` (200): Entwurf-Saldo **-149.20** (= -146.20 - 3.00), `carried_from_id` null. Eigene Rechnung ohne Übertrag: -149.17, gerundet -149.20. Das PDF zeigt «Rückerstattung vor Rundung 149.17 / Rundung + 0.03 / Rückerstattung 149.20», ohne Übertragszeile.

Zusätzliche Fälle:
- Nachzahlung mit QR-Rechnung: Seepark A2 (Vertrag `b0000002-0002-0002-0002-000000000002`), NK-22222222-2024-0002 auf «erledigt» 3.00, von Hand ausgeglichen, ersetzt und berichtigt. Es entstand NK-22222222-2024-0004 (`5cbffcbc-6858-41ad-9168-20fe74bfd9fc`) mit `prior_payments` 3.00. Eigene Rechnung: Kosten 2761.07 (Heizung nach Leistungsperioden: 1480 + 820 + 410 + 1350 = 4060), Akonto 2640.00, bezahlt 3.00, Rohsaldo 118.07, abgerundet **118.05**. API, PDF und Datenbank stimmen.
- Rückerstattung als Übertrag: Alpenblick OG1, NK-33333333-2024-0002 auf «erledigt» -3.00, von Hand ausgeglichen, ersetzt, berichtigt. Ergebnis: `paid_amount` -3.00, `prior_payments` -3.00, Saldo der berichtigten Abrechnung NK-33333333-2024-0003 **-26.80** (2970.20 - 3000.00 + 3.00 = -26.80, ohne Pauschale, da im Vertrag nicht vereinbart). Das PDF nennt «bereits zurückerstattet + 3.00».

## QR-Rechnung

Es gibt genau eine QR-Rechnung an den betroffenen Datensätzen: im PDF von NK-22222222-2024-0004 (Seite 2, 300 dpi, mit zxing-cpp aus `.../scratchpad/venv` dekodiert, Skript `.../w/dec.py`).

| Feld | Gelesen | Erwartet | Ergebnis |
|---|---|---|---|
| IBAN | CH4431999123000889012 | Einstellung `iban`; QR-IBAN (IID 31999) | gleich; Prüfsumme mod 97 stimmt |
| Betrag, Währung | 118.05 CHF | Saldo 118.05 | gleich |
| Referenz | QRR 004379992560878073317666326 (27 Stellen) | Datenbank `qr_bill_reference` | gleich; Prüfziffer (Modulo 10 rekursiv) stimmt |
| Mitteilung | Nebenkostenabrechnung NK-22222222-2024-0004 | Abrechnungsnummer | gleich |
| Zahlbar an | Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, CH | Einstellungen | gleich |
| Zahlbar durch | Sarah Meier, Hirschmattstrasse 21, 6003 Luzern, CH | Mieterin des Vertrags | gleich |

Pierres berichtigte Abrechnung (Rückerstattung) und die übrigen Entwürfe tragen keine QR-Rechnung, daher keine Dekodierung nötig.

Geprüft: NK-11111111-2024-0003, NK-11111111-2024-0005, NK-11111111-2024-0001 (offener Übertrag in der Übersicht), NK-33333333-2024-0001, NK-33333333-2025-0001, NK-33333333-2024-0002, NK-33333333-2024-0003, NK-22222222-2024-0002, NK-22222222-2024-0004 (Seiten, PDFs; die QR-Rechnung der letzten dekodiert).

## Nicht bestätigt

- Kein Mindestbetrag auf der Schlussabrechnung bei einem Saldo unter CHF 5: Pierres berichtigte Abrechnung hat Saldo -16.50. Eine kleine Rückerstattung oder Nachzahlung auf einer Schlussabrechnung habe ich nicht gerechnet. Ich habe dazu keinen Datensatz gebaut, weil ich keine weitere Abrechnung in Pierres Vertrag verändern wollte.
- PDF der Abrechnungen von Alpenblick und Seepark in fr/it/en: nur de geprüft (die Mieter dort haben de). Die Texte sind dieselben wie bei Pierre. Pierres PDF habe ich in allen vier Sprachen geprüft.
- Seiten der offenen Übertrag-Aufgabe in fr/it/en nicht auf Beträge geprüft (nur de gelesen). Dort stehen nur CHF 3.00 und die Abrechnungsnummer.
- Der «Verlauf» der von Hand ausgeglichenen Abrechnung nennt das Ausgleichen nicht. Das ist keine Anforderung, ich habe es nicht als Befund geführt.

## Änderungen an `dwello_persona`

Neu: Pierre NK-11111111-2024-0003 `replaced` und Entwurf NK-11111111-2024-0005 (bleibt für Personas lesbar); Seepark A2 NK-22222222-2024-0002 `replaced` (Saldo 3.00 per SQL, `carry_settled_on` gesetzt) und Entwurf NK-22222222-2024-0004; Alpenblick OG1 NK-33333333-2024-0002 `replaced` (Saldo -3.00 per SQL) und Entwurf NK-33333333-2024-0003. Zurückgesetzt: NK-11111111-2024-0001 und NK-33333333-2024-0001 auf «bezahlt» mit den alten Werten; meine Entwürfe NK-11111111-2026-0001 und NK-33333333-2025-0001 gelöscht; Pierres Sprache wieder fr.
