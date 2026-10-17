# Datenprüfung #363 / Entscheid #91 (nur im Mietvertrag vereinbarte Nebenkosten)

Geprüft: DB `dwello_persona` (nur gelesen), Worktree a9bd54a. Eigenes Skript: `/tmp/claude-0/-home-user-Dwello/e60c0fa6-2a4d-5c91-b5be-bcf2af1f206b/scratchpad/dc/recompute.py` (liest JSON-Auszüge der Tabellen in `.../scratchpad/dc/*.json`, rechnet aus Rechnungen, Tankbestand, Schlüsselformeln, Flächen, Mietstagen, Heizprofil, Akonto, Pauschale, ohne Dwello-Code). Regeln aus `docs/nebenkostenabrechnung-anforderungen.md` und `UBIQUITOUS_LANGUAGE.md`. Aufruf: `python3 -I recompute.py`.

## Ergebnis

Keine Blocker, keine Major, keine Minor. Eine Beobachtung (Nit/Hinweis). Alle Beträge stimmen auf den Rappen.

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|----|---------|-----------|----------|-------------|
| D-1 | Nit (Beobachtung, kein Fehler der Änderung) | Entwurf NK-11111111-2025-0002 (Vertrag b0000001-…-0002) | Entwurf wird nach Vertragsänderung nicht neu gerechnet; das ist so gewollt (Abrechnung hält Stand bei Erstellung fest), aber der Vermieter sieht keinen Hinweis | Persona (Anna) hat um 02:39:46 «Garden Maintenance» im Vertrag auf nicht vereinbart gestellt, der Entwurf (erstellt 02:34:56) enthält die Position weiterhin (1 Position «Garden Maintenance», `agreed_category_ids` enthält sie). Die Abrechnung ist in sich stimmig, weicht aber vom aktuellen Vertrag ab. Zur Entscheidung des Auftraggebers, ob ein Hinweis nötig ist. |

Reproduktion D-1:
```
psql ... -c "select c.name from contract_categories cc join categories c on c.id=cc.category_id where contract_id='b0000001-0001-0001-0001-000000000002' and not agreed"   -- Garden Maintenance, Treppenhausreinigung
psql ... -c "select count(*) from utility_statement_line_items li join utility_statements s on s.id=li.statement_id where s.statement_number='NK-11111111-2025-0002' and li.description='Garden Maintenance'"   -- 1
```

## Neu gerechnet: NK-33333333-2025-0001 (Laura Keller, Entwurf)

Eingaben: Fläche 72 / 255 m² (EG 72, OG1 98, OG2 85 leer, Nenner bleibt 255), 365/365 Mietstage, Schlüssel «Pro Fläche». Heizkosten = Rechnung 4'880.00 + Anfangsbestand 1'792.00 − Endbestand 1'494.00 = 5'178.00 (Heizprofil wholePeriod, ganze Periode).

| Position | Kosten Liegenschaft | Wohnungsanteil = Ihr Anteil | gespeichert | OK |
|---|---|---|---|---|
| Schneeräumung (920 + 380) | 1'300.00 | 367.06 | 367.06 | ja |
| Kaltwasser | 470.00 | 132.71 | 132.71 | ja |
| Allgemeinstrom (182.60 + 196.30) | 378.90 | 106.98 | 106.98 | ja |
| Heizung | 5'178.00 | 1'462.02 | 1'462.02 | ja |
| Treppenhausreinigung | 960.00 | 271.06 | 271.06 | ja |
| Zwischensumme | | 2'339.83 | (Summe Positionen) | ja |
| Verwaltungspauschale 3 % (vereinbart) | | 70.19 | 70.19 | ja |
| Ihre Nebenkosten | | 2'410.02 | `total_costs` 2410.02 | ja |
| Akonto 12 × 190 | | 2'280.00 | 2280.00 | ja |
| Saldo vor Rundung | | +130.02 | | |
| Saldo (zugunsten Mieter auf 5 Rp, ab) | | 130.00 | `balance` 130.00 | ja |

Treppenhausreinigung ist in Lauras Abrechnung enthalten; `agreed_category_ids` hat 13 Einträge, identisch mit den 13 `contract_categories`-Zeilen mit `agreed = true` des Vertrags b0000003-…-0001.

## Neu gerechnet: NK-33333333-2025-0002 (Kevin Fischer, Entwurf)

Fläche 98 / 255 m², 365/365 Mietstage, keine Pauschale (Vertrag: nicht vereinbart, 0 %).

| Position | Kosten Liegenschaft | Wohnungsanteil = Ihr Anteil | gespeichert | OK |
|---|---|---|---|---|
| Kaltwasser | 470.00 | 180.63 | 180.63 | ja |
| Allgemeinstrom | 378.90 | 145.62 | 145.62 | ja |
| Heizung | 5'178.00 | 1'989.98 | 1'989.98 | ja |
| Schneeräumung | ausgeschlossen (nicht vereinbart) | – | keine Zeile | ja |
| Treppenhausreinigung | ausgeschlossen (nicht vereinbart) | – | keine Zeile | ja |
| Zwischensumme = Ihre Nebenkosten | | 2'316.23 | `total_costs` 2316.23 | ja |
| Pauschale | | 0.00 | 0.00 / 0.00 % | ja |
| Akonto 12 × 250 | | 3'000.00 | 3000.00 | ja |
| Saldo vor Rundung | | −683.77 | | |
| Saldo (Rückerstattung aufgerundet, +0.03) | | −683.80 | `balance` −683.80 | ja |

Nicht umverteilt: Kevins Schneeräumung (1'300 × 98/255 = 499.61) und Treppenhausreinigung (960 × 98/255 = 368.94) bleiben beim Vermieter; Lauras Anteile sind gegenüber dem Nenner 255 unverändert (367.06 und 271.06), der Nenner enthält weiterhin alle drei Wohnungen. Die Anteile der beiden Mieter summieren sich nicht auf die Gesamtkosten, die Differenz trägt der Vermieter (inkl. leere Wohnung OG2).

`agreed_category_ids` Kevin: 11 Einträge = 13 Kategorien minus Snow Removal (20d09934-…) minus Treppenhausreinigung (15d4c6df-…); identisch mit den `agreed = true`-Zeilen von b0000003-…-0002. `contract_categories`: Kevin Snow Removal = false, Treppenhausreinigung = false (je 1 Zeile, `agreed` false), Laura alle 13 true. Gesamt 148 Zeilen; Anzahl nicht vereinbarter Kategorien je Vertrag: 8d5e232f… 2, b…1-0002 2, b…3-0002 2, alle übrigen 0.

## PDF Kevin (pdf_blob NK-33333333-2025-0002, 2 Seiten, deutsch)

`pdftotext -layout` der dekodierten Datei (`.../scratchpad/dc/kevin.pdf`, `kevin.txt`):
- Positionen: Kaltwasser 470.00 / 180.63, Allgemeinstrom 378.90 / 145.62, Heizung 5'178.00 / 1'989.98, je 365/365 Tage, «98.00 / 255.00 m²». Keine Zeile Schneeräumung, keine Zeile Treppenhausreinigung. Stimmt.
- Zwischensumme 2'316.23, Ihre Nebenkosten 2'316.23, Akonto – 3'000.00, Rückerstattung vor Rundung 683.77, Rundung + 0.03, Rückerstattung 683.80. Stimmt. Keine Zeile Verwaltungspauschale (0 %). Heiz- und Warmwasserkosten: 1'792.00 + 4'880.00 – 1'494.00 = 5'178.00. Stimmt.
- Seite 2, «Hinweise»: «Abgerechnet sind nur die im Mietvertrag vereinbarten Nebenkosten: Kaltwasser, Allgemeinstrom, Heizung.» Die genannten Kategorien sind genau die abgerechneten (nicht der Mietvertrag-Katalog von 11 Kategorien). Entspricht dem Entscheid.
- QR-Rechnung: keine, da Rückerstattung (kein Zahlteil, «Wir überweisen Ihnen den Betrag bis 16.11.2026»). Das ist nach Saldo-Regel richtig; `qr_bill_reference` gespeichert 001656612712735815165240856 (27 Stellen, nicht im PDF verwendet; Prüfziffer nicht relevant, da kein QR-Code gedruckt).

## Übrige Abrechnungen

Alle 19 Abrechnungen der Demo-Daten (Gebäude 1, 2, 3; 2024 und 2025, auch die zweigeteilte Wohnung 22222222-2025-0002/0003 mit Heizprofil, Leistungszeiträume, Pauschale 2.5 % und 0 %) mit dem Skript neu gerechnet: jede Position (Gesamt, Wohnungsanteil, Mieteranteil), Pauschale, Total, Akonto und Saldo stimmen auf den Rappen mit den gespeicherten Werten überein; Ausgabe `python3 -I recompute.py | grep -A40 mismatches` ist leer. `updated_at` der älteren Abrechnungen liegt in der Seed-Zeit (02:34), nur die zwei neuen Entwürfe und das PDF von Kevin wurden später geschrieben: nichts hat die übrigen verändert.

Unterschiede zwischen gespeicherten `agreed_category_ids` und aktuellen Verträgen sind erklärt: 33333333-2024-0001 (Laura) fehlt Treppenhausreinigung (Kategorie später angelegt), 33333333-2024-0002 (Kevin) hat Snow Removal gespeichert, Vertrag jetzt nicht mehr (bezahlte Abrechnung bleibt, wie sie war), 11111111-2024-0002/2025-0002 siehe D-1.

## Geprüft und bestanden

NK-33333333-2025-0001, NK-33333333-2025-0002 (Positionen, Ausschlüsse, Keine-Umverteilung, Zwischensumme, Pauschale, Total, Akonto, Saldo, Rundung, agreed_category_ids, contract_categories, PDF-Text), alle 17 übrigen Abrechnungen (Neuberechnung ohne Abweichung).

## Nicht bestätigt

- QR-Rechnung von Laura Keller (NK-33333333-2025-0001, Nachzahlung 130.00 CHF): kein gespeichertes PDF (`pdf_blob` leer). Ein PDF abzurufen würde `pdf_blob` schreiben, das war nicht erlaubt. IBAN, Betrag, Referenz mit Prüfziffer, Mitteilung und Schuldner damit nicht dekodiert. Kevins PDF enthält wegen Rückerstattung keine QR-Rechnung, es gab nichts zu dekodieren (kein QR-Decoder installiert, nicht nötig).
- PDF in fr/it/en: nur das deutsche PDF von Kevin liegt gespeichert vor; weitere Sprachen hätten eine Neuerzeugung (Schreibzugriff) verlangt.
- Webseite der Abrechnungen (http://localhost:3300): Backend und Frontend verlangen eine Anmeldung (`/api/statements/<id>` 404 ohne Sitzung, Frontend 303); keine Sitzung zur Verfügung, deshalb nur die gespeicherten Werte in der DB und das PDF verglichen, nicht die Bildschirmanzeige.
- Verwaltungspauschale-Satz Laura: gespeicherter Satz 3.00 stimmt mit der Vorgabe 3 % überein; der Vertrag hat keinen eigenen Satz (`management_fee_percent` leer), der Lauf-Satz selbst (Einstellung `management_fee_pct`) wurde nicht aus der DB gelesen (keine Tabelle `settings`).
