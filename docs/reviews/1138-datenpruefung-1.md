# Datenprüfung #1138, Runde 1

Gegenstand: Commit c90d956 (Worktree `.../scratchpad/review-1138-daten`), Tankbestand-Satz und Leerstand-Satz der Kostenabstimmung (Vorschau des Abrechnungslaufs und «Berichte»). Datenbank `dwello_persona`, Backend :3301, Frontend :3300 (laufend, nur lesend benutzt; die Vorschau ist eine Form-Action ohne Schreibzugriff).

## Ergebnis

Keine Befunde. Alle geprüften Werte stimmen auf den Rappen und auf den Tag mit meiner unabhängigen Nachrechnung überein.

| ID | Schwere | Datensatz | erwartet | tatsächlich |
|---|---|---|---|---|
| (keine) | | | | |

## Vorgehen

- Skript (nur aus der Datenbank und den Anforderungsdokumenten abgeleitet, kein Import von Dwello-Code): `/tmp/claude-0/-home-user-Dwello/5b9a0c75-7428-555e-9004-2167452cdb19/scratchpad/d1138/recompute.mjs` (Aufruf `node recompute.mjs <von> <bis>`). Es liest `fuel_stocks`, `invoices`, `apartments`, `rental_contracts`, rechnet
  - Kosten der Heizposition = Lieferungen der Periode + Anfangsbestand (Stichtag Vortag des Periodenbeginns) − Endbestand (Stichtag Periodenende), Satz nur wenn Anfangs- oder Endbestand ungleich 0;
  - Leerstandstage je Wohnung = Tage der Periode (beide Enden eingeschlossen), an denen «Aufgehoben ab» nicht erreicht ist und kein Mietvertrag von Vertragsbeginn bis Vertragsende läuft; Reihenfolge Stockwerk, dann Nummer numerisch;
  und ruft damit `GET /api/v1/reports/reconciliation` und `GET /api/v1/statements/run-reconciliation` (selbst signiertes Test-JWT mit dem bekannten Persona-Secret) auf und vergleicht Feld für Feld.
- Seiten: `/reports/<Gebäude>?periodStart&periodEnd` in de, fr, it, en (Skript `.../d1138/page.sh`), Vorschau-Action `POST /statements/generate?/preview` (Auswertung `.../d1138/dv.mjs`).
- Die Ausgabe von `recompute.mjs` schloss mit «mismatches: 0» für 2025 und 2024 (alle drei Gebäude, beide Endpunkte).

## Gegenüberstellung 2025-01-01..2025-12-31

| Gebäude | Anfangsbestand / Endbestand (DB) | Lieferung (DB) | Heizung Kosten des Gebäudes: Rechnung | API Bericht | API Vorschau | Seite Berichte | Leerstand: Rechnung | API (beide) | Seite |
|---|---|---|---|---|---|---|---|---|---|
| Alpenblick | 1’792.00 / 1’494.00 | 4’880.00 | 4’880 + 1’792 − 1’494 = 5’178.00 | 5’178.00, fuelStock 1792/1494 | 5’178.00, fuelStocks 1792/1494 | keine Seite (404, keine Abrechnung 2025: gewollt, `reportPeriods`) | 2.01 = 365 | `[{2.01, 365}]` | über die Vorschau-Action bestätigt |
| Musterhaus Zentrum | 2’650.00 / 2’257.20 | 6’565.00 | 6’565 + 2’650 − 2’257.20 = 6’957.80 | 6’957.80, fuelStock 2650/2257.2 | 6’957.80, gleiche Bestände | «In «Heizung» ist die Veränderung des Tankbestands enthalten: Anfangsbestand CHF 2’650.00, Endbestand CHF 2’257.20.» | 2.02 = 365, 3.02 = 365 (Stockwerk 2 vor 3) | `[{2.02,365},{3.02,365}]` | «Leerstand in dieser Abrechnungsperiode: Wohnung 2.02 (365 Tage), Wohnung 3.02 (365 Tage).» |
| Seepark Residenz | kein Tankbestand | – | Heizung 4’115.00 ohne Satz (Kategorie ist Brennstoff-frei, keine Ablesungen) | fuelStock null in allen 6 Positionen | `fuelStocks: []` | kein Tankbestand-Satz | B1 = 365; A2: Vertrag bis 30.06., Nachmieter ab 01.07. = 0 Tage (keine Lücke) | `[{B1,365}]` | «Leerstand in dieser Abrechnungsperiode: Wohnung B1 (365 Tage).» |

Zusätzlich 2024-01-01..2024-12-31 (Schaltjahr, 366 Tage):

| Gebäude | Heizung Kosten des Gebäudes: Rechnung | API / Seite | Leerstand |
|---|---|---|---|
| Alpenblick | 5’120 + 1’536 − 1’792 = 4’864.00 | 4’864.00, Anfangsbestand 1’536.00, Endbestand 1’792.00 (Endbestand höher als Anfangsbestand: Satz bleibt) | 2.01 = 366 (API und Seite de/en) |
| Musterhaus Zentrum | 6’890 + 2’120 − 2’650 = 6’360.00 | 6’360.00, 2’120.00 / 2’650.00 | 2.02 = 366, 3.02 = 366 |
| Seepark Residenz | kein Tankbestand | kein Satz | B1 = 366 |

Weitere Kontrollen, alle ohne Abweichung:
- Summe «Kosten des Gebäudes» Musterhaus 2025: 1’690 + 3’680 + 3’840 + 762.80 + 935 + 990 + 6’957.80 + 335 = 19’190.60 = Total auf der Seite; Seepark 11’008.30 = Total auf der Seite.
- Verwaltungspauschale Musterhaus 2025: Summe `utility_statements.management_fee` = 422.63 = Seite in de, fr, it, en (neuer Zeilentext in allen vier Sprachen vorhanden und gleich dem Wortlaut aus `docs/reviews/1138-fachreview-1.md`).
- Sprachen Musterhaus 2025: de, fr, it, en nennen dieselben Beträge (CHF 2’650.00 / 2’257.20) und dieselben Tage; Wortlaut der Sätze entspricht dem Fachreview (fr mit U+00A0 vor «:» und in « »), Einzahl/Mehrzahl «Tage»/«jours»/«giorni»/«days».
- Lücken-Logik gegen Fachreview-Beispiele von Hand nachgerechnet: 16.03.–30.04. = 16 + 30 = 46 Tage, 01.11.–31.12. = 30 + 31 = 61 Tage, zusammen 107 (stimmt mit dem Beispiel des Fachreviews überein). Die Randfälle (aufgehoben, mehrere Lücken, 1 Tag) lassen sich mit den Persona-Daten nicht herstellen, ohne sie zu ändern; sie sind im Backend-Test `cost-reconciliation.pg.test.ts` abgedeckt (Lesen des Tests, nicht ausgeführt).

Reproduzieren:
```
cd /tmp/claude-0/-home-user-Dwello/5b9a0c75-7428-555e-9004-2167452cdb19/scratchpad/d1138
node recompute.mjs 2025-01-01 2025-12-31
node recompute.mjs 2024-01-01 2024-12-31
./page.sh 11111111-1111-1111-1111-111111111111 fr 2025-01-01 2025-12-31 | grep -E "stock|Vacance"
```

Geprüft: Kostenabstimmung (Berichte und Vorschau Abrechnungslauf) von Alpenblick, Musterhaus Zentrum und Seepark Residenz für 2025 und 2024: Tankbestand-Satz (Anfangs-/Endbestand, Heizkosten des Gebäudes), Leerstand-Satz (Tage, Reihenfolge), Totale, Verwaltungspauschale (Musterhaus 2025), Sprachen de/fr/it/en der Berichte-Seiten.

## Nicht bestätigt

- **Wizard-Seite im Browser (Vorschau-Schritt, gerenderte Sätze):** Ich habe keinen Browser (Zugriff auf Playwright/Chromium verweigert). Geprüft habe ich stattdessen die Antwort der Form-Action `POST /statements/generate?/preview` (`fuelStocks`, `vacancies`, Totale, Heizposition, je Gebäude gleich wie die API). Das Rendern in `CostReconciliation.svelte`/`ReconciliationSentences.svelte` (gleiche Komponente wie «Berichte», dort bestätigt) habe ich nur im Code gelesen.
- **Alpenblick unter «Berichte» 2025:** Die Seite gibt es nicht (404, keine Abrechnung für 2025, die Perioden von «Berichte» sind die mit Abrechnung). Der Wert ist nur über die API und die Vorschau bestätigt. Unter «Berichte» zeigt Alpenblick 2024 den Satz (bestätigt).
- **QR-Rechnungen / PDF:** Von der Änderung nicht betroffen (Kostenabstimmung ist kein PDF und hat keinen Einzahlungsschein); nicht geprüft.
- **Randfälle der Leerstandstage** (zwei Lücken, aufgehobene Wohnung, Einzahl «1 Tag», Tankbestand 0/0, Bestand 600/600) nicht an Daten bestätigt, weil die Persona-Datenbank nicht verändert werden darf und ich die App nicht selbst starte; ich habe die Regel aus Fachreview und `UBIQUITOUS_LANGUAGE.md` (Leerstand, Z. 209) von Hand gegengerechnet und die Logik in `cost-reconciliation.service.ts` gelesen (kein Widerspruch gefunden).
