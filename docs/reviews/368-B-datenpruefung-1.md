# Datenprüfung #368 Slice B («Vereinbart ab»), Runde 1

Code-Stand 11182cbd (Worktree `.../scratchpad/review-368-B-daten`), Datenbank `dwello_persona` (nur gelesen), Gebäude Musterhaus Zentrum, Periode 2025.

## Ergebnis in einem Satz

Der betroffene Entwurf NK-11111111-2025-0002 stimmt auf den Rappen mit meiner unabhängigen Nachrechnung überein (Datenbank, PDF de, PDF fr/it/en). Es gibt keinen Blocker und keinen Major. Drei kleine Befunde (Minor/Nit). Die Webansicht und der Browser konnten nicht geprüft werden (siehe «Nicht bestätigt»).

## Befunde

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| D-1 | Minor | Randfall, nicht Datensatz der Persona: Heizung (Tank-Kategorie) mit «Vereinbart ab» 01.10.2025 bei Mietvertrag über die ganze Periode (nur in einer Kopie der Datenbank nachgestellt) | `utility_statements.heating_share` sagt, die Heizkosten seien nach dem Heizprofil ab dem Tag verteilt (Prozent 40.50, nicht `byDays`). PDF und Webansicht können dann das Heizprofil und die Monate nennen. | `heating_share` bleibt `{"byDays": true, "reason": "wholePeriod", …}`, obwohl die Position «Heizung» mit 40.50 % nach Heizprofil gerechnet ist (Betrag 509.37 stimmt). Folge: Das PDF zeigt «40.50 %» ohne die Monate des Heizprofils und ohne Herleitung; die Webansicht liest `byDays` und hält das Heizprofil für «nicht angewandt, ganze Periode» (aus dem Code `src/lib/server/statement.ts` Z. 26-28, 49-53 und 128 geschlossen, nicht gerendert). |
| D-2 | Nit | NK-11111111-2025-0002, PDF, Zeile Gartenpflege | Der Tag und die Tage stehen dort, wo die Mieterin sie sucht: «184/365 Tage» mit dem Hinweis, welche 184 Tage (01.07.2025 – 31.12.2025). | Die Zeile zeigt nur «184/365 Tage». Der Tag «(ab 01.07.2025)» steht erst in den Hinweisen auf Seite 2, die Erklärung ist ein allgemeiner Satz. Die Kopfzeile sagt weiter «365 Mietstage von 365 Tagen». Rechnerisch richtig, aber die 184 muss man selbst herleiten. |
| D-3 | Nit | NK-11111111-2025-0002, PDF auf Italienisch (nur beim Neurendern in einer Kopie erzeugt; die gespeicherte PDF ist Deutsch) | Die Zeile «Rimborso 95.70» steht mit den Zeilen davor auf Seite 1. | Die letzte Zeile «Rimborso 95.70» steht allein oben auf Seite 2, getrennt vom Rest der Saldo-Zeilen (Seite 1 endet mit «Arrotondamento a 5 centesimi»). Ursache ist der Seitenumbruch der Saldo-Zeilen, nicht der neue Text (die Zeilen vor dem Umbruch haben sich mit #368 nicht geändert); ich habe den Basis-Commit nicht gerendert, ob es dort gleich ist, ist nicht belegt. |

## Belege und Reproduktion

### Eigene Nachrechnung (Skript `.../scratchpad/dp/recalc.py`)

Aufruf: `python3 -I /tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/dp/recalc.py`. Das Skript liest Rechnungen, Verteilschlüssel (Fläche, Einheiten, Heizung 70 % Fläche / 30 % Einheit), Wohnungen, Tankbestände, Mietverträge, `agreed_from` und Akonto aus der Datenbank und rechnet allein nach den Regeln aus `docs/nebenkostenabrechnung-anforderungen.md` und `UBIQUITOUS_LANGUAGE.md`. Es importiert keinen Dwello-Code. Ausgabe: `DIFFS: 0` für alle vier Abrechnungen des Gebäudes (zuerst stand eine Differenz bei -95.70; die lag an meiner Rundungsrichtung bei Rückerstattungen und ist im Skript behoben: Rückerstattung wird aufgerundet, also betragsmässig grösser).

NK-11111111-2025-0002 (Anna Schmidt, Wohnung 1.02, 92.00 m², Mietvertrag seit 01.06.2022, 365 Mietstage; Gebäude 492.50 m², 6 Wohnungen):

| Position | Kosten Gebäude | Wohnungsanteil | Zeitanteil | Ihr Anteil | DB |
|---|---|---|---|---|---|
| Lift (Pro Einheit 1/6) | 1'690.00 | 281.67 | 365/365 | 281.67 | gleich |
| Allgemeinstrom (Fläche) | 762.80 | 142.49 | 365/365 | 142.49 | gleich |
| Kaltwasser | 3'840.00 | 717.32 | 365/365 | 717.32 | gleich |
| Hauswart | 3'680.00 | 687.43 | 365/365 | 687.43 | gleich |
| Gartenpflege (540 + 395 = 935.00; ab 01.07.2025) | 935.00 | 174.66 | 184/365 | 88.05 | gleich |
| Kehricht (Pro Einheit) | 990.00 | 165.00 | 365/365 | 165.00 | gleich |
| Heizung (Tank: 2'650.00 + 6'565.00 – 2'257.20 = 6'957.80; Schlüssel 18.0761 %) | 6'957.80 | 1'257.70 | 365/365 | 1'257.70 | gleich |
| Kaminfeger (Fläche) | 335.00 | 62.58 | 365/365 | 62.58 | gleich |

- Mietstage ab 01.07.2025: Jul 31 + Aug 31 + Sep 30 + Okt 31 + Nov 30 + Dez 31 = 184, Tage der Periode 365. 174.66 × 184/365 = 88.0477 → 88.05 (mit einfacher Rundung aus 935 × 92/492.5 × 184/365 ebenfalls 88.05, kein Rundungsunterschied).
- Zwischensumme 3'402.24; Verwaltungspauschale 3 % = 102.0672 → 102.07; Nebenkosten 3'504.31 (= `total_costs`); Akonto 12 × 300.00 = 3'600.00; Saldo vor Rundung -95.69; auf 5 Rappen zugunsten der Mieterin -95.70 (Rundung «+ 0.01» im PDF). Die Angaben der Persona stimmen alle.
- DB: `total_costs 3504.31`, `management_fee 102.07`, `management_fee_percent 3.00`, `total_advance_payments 3600.00`, `balance -95.70`, `agreed_from {"45468429-…": "2025-07-01"}`, Positionen `position_rental_days 184`, `billed_days 365`, `period_share 0.5041`, `share_percentage 9.4171` (= 88.05/935).
- Vertrag: `contract_categories` (Vertrag b0000001-…-0002, Gartenpflege) `agreed = t`, `agreed_from = 2025-07-01`; keine andere Kategorie dieses Vertrags hat ein Datum oder ist nicht vereinbart.

Übrige Abrechnungen des Gebäudes 2025, gleiches Skript, alle Positionen (Gesamtkosten, Wohnungsanteil, Mieteranteil, Tage), Pauschale, Gesamtkosten, Akonto und Saldo:

- NK-11111111-2025-0001 (Hans Müller, versendet): Zwischensumme 3'005.65, Pauschale 90.17, 3'095.82, Akonto 2'880.00, vor Rundung 215.82, Rundung -0.02, Nachzahlung 215.80. Gleich.
- NK-11111111-2025-0003 (Pierre Dubois): 3'382.38 inkl. Pauschale 98.52, Akonto 3'240.00, Nachzahlung 142.35. Gleich.
- NK-11111111-2025-0004 (Maria Rossi): 4'438.12 inkl. Pauschale 129.27, Akonto 4'200.00, Nachzahlung 238.10. Gleich.
- Alle 3 haben `agreed_from = {}` und keine Position wurde durch #368 verändert (Gartenpflege 143.34 / 161.37 / 227.82 mit 365/365).

Gegenprobe Gebäude Seepark Residenz (die geänderte Codestelle `fromDay` läuft für alle Abrechnungen): `.../scratchpad/dp/b2.py` rechnet alle Positionen ohne Heizung der vier Abrechnungen 2025 nach (365, 181 und 184 Mietstage): alle gleich. Heizung und Saldo der zwei Ganzjahres-Abrechnungen (0001: Heizung 874.44, Zwischensumme 2'296.54, Pauschale 68.90, Saldo -34.60; 0004: Heizung 1'221.64, Pauschale 77.95, Saldo 75.80) stimmen auch. Die Heizung der Teiljahres-Abrechnungen von Seepark (mit Leistungszeiträumen) habe ich nicht nachgerechnet.

### PDF gegen Datenbank (`.../scratchpad/dp/cmp.py`)

- `pdf_blob` von 0001-0004 dekodiert; das PDF von 0002 ist bytegleich zu `.../scratchpad/weber-368-b/NK-2025-0002.pdf` (`cmp`).
- Je Abrechnung 8 Positionszeilen im PDF mit Kosten, Wohnungsanteil, «x/y Tage» und Ihr Anteil = Datenbank; Zwischensumme, Pauschale, Nebenkosten, Akonto und Saldo kommen im PDF vor und stimmen. Der Satz zu «Vereinbart ab» steht nur im PDF von 0002 (Seite 2) und nicht in 0001, 0003, 0004.
- PDF 0002: «Gartenpflege (ab 01.07.2025)» in den Hinweisen, Zeile «184/365 Tage 88.05», «Rückerstattung vor Rundung 95.69, Rundung auf 5 Rappen + 0.01, Rückerstattung 95.70», Zahlungsfrist 21.11.2026 (22.10.2026 + 30 Tage). Keine QR-Rechnung (Rückerstattung, richtig).
- Sprachen: Ich habe die Abrechnung 0002 in einer Kopie der Datenbank (`dp_368_scratch`, nach der Prüfung gelöscht) mit der Worktree-Funktion `generateStatementPdf` auf de/fr/it/en gerendert, die persona-Datenbank blieb unberührt. fr: «Entretien du jardin (dès le 01.07.2025)», «184/365 jours», 88.05; it: «Cura del giardino (dal 01.07.2025)», «184/365 giorni»; en: «Garden Maintenance (from 01.07.2025)», «184/365 days». Beträge in allen Sprachen gleich (3'402.24 / 102.07 / 3'504.31 / 95.69 / +0.01 / 95.70). Der neue Erklärungssatz steht in allen vier Sprachen. Kein deutscher Rest in fr/it/en.

### QR-Rechnungen (Decoder `zxing-cpp` im venv `.../scratchpad/dp/venv`, `dec.py`, Seiten mit `pdftoppm -r 300 -png`)

| Abrechnung | IBAN | Betrag | Referenz | Prüfziffer | Mitteilung | Zahlungspflichtiger |
|---|---|---|---|---|---|---|
| 0001 | CH4431999123000889012 (Mod-97 gültig, QR-IID 31999) | 215.80 CHF | 006654856354352139764766713 = DB | 3, korrekt | Nebenkostenabrechnung NK-11111111-2025-0001 | Hans Müller, Bahnhofstrasse 42, 8001 Zürich |
| 0003 | gleich | 142.35 CHF | 006541826309579153893349282 = DB | 2, korrekt | Décompte des charges NK-11111111-2025-0003 | Pierre Dubois, gleiche Adresse |
| 0004 | gleich | 238.10 CHF | 008897007743711895216261596 = DB | 6, korrekt | Conteggio spese accessorie NK-11111111-2025-0004 | Maria Rossi, gleiche Adresse |

Betrag = `balance`, Typ QRR, Gläubiger Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, Adresse stimmt mit den Mieterdaten überein. Die Referenzen von 0002 (000398414293654558139827677, Prüfziffer 7) und der Seepark-Abrechnung (…674, Prüfziffer 4) sind ebenfalls gültig; 0002 hat keine QR-Rechnung, weil der Saldo eine Rückerstattung ist.

### Randfälle von «Vereinbart ab» (nur in Kopie der Datenbank, mit `recalculateStatement` aus dem Worktree neu gerechnet, gegen meine Handrechnung)

Wohnung 1.02, Mietvertrag über die Periode (365 Tage):

| Fall | Erwartet | Tatsächlich |
|---|---|---|
| Garten ab 01.01.2026 (nach Periodenende) | keine Position Gartenpflege; Zwischensumme 3'314.19, Pauschale 99.43, 3'413.62, Saldo -186.38 → -186.40 | gleich |
| Garten ab 31.12.2025 | 174.66 × 1/365 = 0.48; Pauschale 99.44; Saldo -185.89 → -185.90 | gleich |
| Garten ab 15.03.2025 | 292 Tage, 139.73; 3'557.54; Saldo -42.46 → -42.50 | gleich |
| Garten ab 01.05.2024 (vor Periode) | wie ohne Datum, 174.66 | gleich |
| Heizung ab 01.10.2025 (Heizprofil Mittelland, Okt 10 + Nov 13.5 + Dez 17 = 40.5 %) | 1'257.70 × 40.5 % = 509.37; Pauschale 82.22; 2'822.74; Saldo -777.26 → -777.30 | gleich (aber D-1) |
| Kaminfeger (Heizkostenkategorie ohne Tank) ab 01.10.2025 | 62.58 × 40.5 % = 25.34; Saldo -44.84 → -44.85 | gleich |

Wohnung 2.xx Seepark, Mietvertrag 01.01.–30.06.2025 (181 Tage), Hauswart (784.13): ab 01.04.2025 → 91 Tage, 195.50, Saldo -57.51 → -57.55; ab 30.06.2025 → 1 Tag, 2.15; ab 01.07.2025 (nach Vertragsende, in der Periode) → Position entfällt; ab 01.01.2025 → 388.84 wie die gespeicherte Abrechnung (1'461.63, Saldo 141.60). Alles gleich.

Reproduktion von D-1: Kopie der Datenbank (`pg_dump dwello_persona | psql dp_368_scratch`), `update contract_categories set agreed_from='2025-10-01' where contract_id='b0000001-0001-0001-0001-000000000002' and category_id='3988f370-50a8-41a4-a2b2-d1cdb99ff156'`, dann `recalculateStatement('086fcee7-16f1-4281-ba2f-91caa6e8bacb')` (Skript `.../scratchpad/dp/recalc.ts`, Aufruf mit `DATABASE_URL=…/dp_368_scratch bun run recalc.ts <id>` im Ordner `backend` des Worktrees). Danach: `select heating_share from utility_statements where id='086fcee7-…'` gibt `{"byDays": true, "reason": "wholePeriod", …}`; die Position Heizung hat `tenant_share 509.37`, `period_share 0.4050`, `billed_days` leer. Das PDF (`render.ts`) zeigt in der Zeile Heizung «40.50 %», in den Hinweisen «Heizung (ab 01.10.2025)», aber keinen Heizprofil-Block. Vergleich: Die Teiljahres-Abrechnung NK-22222222-2025-0003 zeigt bei Heizung die Monate des Heizprofils und die Herleitung der Prozentzahl.

## Geprüft und bestanden

- NK-11111111-2025-0002: alle 8 Positionen, Zwischensumme, Pauschale, Nebenkosten, Akonto, Saldovorrundung, Rundung, Saldo; Angaben der Persona; PDF de und neu gerendert fr/it/en; Zahlungsfrist; Fehlen der QR-Rechnung bei Rückerstattung; Referenz-Prüfziffer.
- NK-11111111-2025-0001 / 0003 / 0004: alle Positionen, Summen, Saldo, PDF (de/fr/it), QR-Rechnung (IBAN, Betrag, Referenz samt Prüfziffer, Mitteilung, Zahlungspflichtiger).
- NK-22222222-2025-0001 / 0002 / 0003 / 0004: Positionen ohne Heizung, bei 0001 und 0004 auch Heizung, Pauschale, Saldo; Referenz-Prüfziffer von 0001.
- Mietvertrag Anna Schmidt: nur Gartenpflege hat `agreed_from`.
- Randfälle in der Kopie (Tabelle oben): alle Beträge gleich meiner Handrechnung.
- Persona-Datenbank blieb unverändert (4 Abrechnungen des Gebäudes, letzte Änderung 22.10.2026 19:12:26 = Neuberechnung durch die Persona).

## Nicht bestätigt

- **Webansicht** von NK-11111111-2025-0002 (`/statements/<id>` auf :3300): nicht geprüft. Die Seite braucht eine Anmeldung (OAuth); einen Sitzungsschlüssel selbst auszustellen wurde mir von der Berechtigungsprüfung verweigert, und ich habe es nicht umgangen. Die Zahlen, die die Seite zeigt, kommen aus denselben Datenbankwerten, die ich geprüft habe; die Abbildung auf der Seite (z. B. «184/365 Tage», Zeile Heizung bei D-1) ist nur aus dem Code gelesen, nicht gerendert.
- **PDF in fr/it/en der gespeicherten Abrechnung**: In der persona-Datenbank liegt nur die deutsche PDF von 0002 (Mieterin spricht Deutsch). Die anderen Sprachen habe ich in einer Kopie der Datenbank mit dem Code des Worktrees gerendert (nicht das, was das Backend auf :3301 ausliefert); die gespeicherte PDF wollte ich nicht neu erzeugen, weil `generate-pdf` die Datenbank ändert.
- **Heizung der Teiljahres-Abrechnungen im Gebäude Seepark Residenz** (Leistungszeiträume, Heizprofil): nicht nachgerechnet; der Code dafür wird von der Änderung nur durch den unveränderten Pfad (`from` leer) durchlaufen. Die Abrechnungen ohne Heizung und die zwei Ganzjahres-Abrechnungen stimmen.
- **Basis-Commit c98684ba**: nicht gerendert; ob der Seitenumbruch bei D-3 dort gleich ist, ist nicht belegt.
- Gebäude Alpenblick: nicht geprüft (nicht Teil der Aufgabe).
