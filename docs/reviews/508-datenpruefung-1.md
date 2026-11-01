# Datenprüfung 508-1: Summe der Heizkosten in der Vorschau (Commit 1a57dde)

Geprüft gegen die laufende Persona-Instanz (Datenbank `dwello_persona`, Backend :3301, Frontend :3300), Worktree `/tmp/scratchpad/review-508-daten-pruefer`. Die Datenbank habe ich nur gelesen. Meine Rechnung steht unabhängig vom Dwello-Code in `/tmp/scratchpad/dp508/recompute.mjs`. Sie liest Rechnungen, Verteilschlüssel, Mietverträge, Heizprofil, Tankbestand und gespeicherte Positionen aus der Datenbank und leitet die Regeln aus `UBIQUITOUS_LANGUAGE.md` (Zeilen 151, 156, 179, 196, 198, 203) und `docs/reviews/508-fachreview-1.md` («Fix: Definition pro Wohnung») ab.

## Befunde

| ID | Schwere | Record | Erwartet | Tatsächlich |
|---|---|---|---|---|
| – | – | keine Befunde | – | – |

Es gibt keinen Blocker, kein Major und kein Minor. Jede Zahl der Antwort stimmt auf den Rappen mit meiner Rechnung überein, und die Definitionen entsprechen dem Fachreview.

## Nachrechnung: Wohnung A2, Lauf 2025-01-01..2025-12-31, Heizprofil «Heizung + Warmwasser», 3 %

**Eingaben aus der Datenbank**

- Verteilschlüssel aller vier Heizrechnungen: «Per Area (m²)», `{area}`. Fläche A2 = 82.00 m² von 320.00 m² (68 + 82 + 75 + 95), also 25.625 %.
- Heizkategorien: «Heating» und «Chimney Sweep» (`is_heating_cost`). Im Gebäude gibt es nur Rechnungen der Kategorie «Heating» und keinen Tankbestand (`fuel_stocks`: 0 Zeilen für 22222222-…). Die Kategorie ist `is_fuel`, aber ohne Bestände rechnet jede Rechnung mit den Tagen ihres Leistungszeitraums (Zeile 156).
- Heizrechnungen mit Leistungszeitraum in der Periode: Q1 1'520.00 (01.01.–31.03.), Q2 790.00 (01.04.–30.06.), Q3 395.00 (01.07.–30.09.), Q4 1'410.00 (01.10.–31.12.; Rechnungsdatum 20.01.2026), zusammen 4'115.00. Die Rechnung «Q4 2024» (1'350.00, 01.10.–31.12.2024) liegt ausserhalb.
- Mietverträge: Sarah Meier 01.08.2021–30.06.2025, Nina Brunner ab 01.07.2025. Beide haben «Heating» und «Chimney Sweep» vereinbart (`contract_categories.agreed`). Es gibt keinen Leerstand.
- Gespeicherte Abrechnung NK-22222222-2025-0007: Position «Heating» mit total_amount 4'055.00 (= 1'350.00 + 1'520.00 + 790.00 + 395.00, also die Rechnungen nach Rechnungsdatum ohne Leistungszeitraum, ohne Q4 2025), apartment_share 1'039.09, period_share 0.5580, tenant_share 579.81.

**Rechnung**

| Grösse | Rechnung | Betrag |
|---|---|---|
| Heizkosten der Wohnung | 4'115.00 × 82/320 = 1'054.46875, gerundet (pro Rechnung gerundet 389.50 + 202.44 + 101.22 + 361.31: gleich) | **1'054.47** |
| Mieteranteil Sarah (heutige Regel) | Q1 + Q2 voll, Q3 + Q4 null: 2'310.00 × 25.625 % = 591.9375 | 591.94 |
| Mieteranteil Nina (heutige Regel) | Q3 + Q4 voll: 1'805.00 × 25.625 % = 462.53125 | 462.53 |
| Anteil der Mieter | 591.94 + 462.53 | **1'054.47** |
| Anteil des Vermieters | Leerstand 0 Tage, beide Verträge vereinbaren Heizkosten | **0.00** (`landlordFor` null: stimmt) |
| Gespeichert Sarah, nur Heizposition | 1'039.09 × 55.8 % = 579.81 (Summe der Monatsanteile Jan–Jun 13.6 + 12.1 + 11.5 + 9.3 + 5.6 + 3.7 = 55.8) | 579.81 |
| Verrechnet | 579.81 (gespeichert, `sum(tenant_share)` der Heizpositionen, ohne Verwaltungspauschale) + 462.53 (Nina neu) | **1'042.34** |
| Unterschied | 1'042.34 − 1'054.47 = −12.13, über 0.05, also «weniger» | **12.13, `less`** |

Die Verwaltungspauschale bleibt draussen. In der gespeicherten Abrechnung ist `management_fee` ein eigenes Feld (42.21 = 3 % von 1'406.93), und die Zeilen enthalten sie nicht.

**Vergleich mit der Antwort des Dienstes**

Ausgabe von `node /tmp/scratchpad/dp508/recompute.mjs` (Ausschnitt):

```
MY RESULT { costs: '1054.47', tenants: '1054.47', landlord: '0.00', billed: '1042.34', difference: '12.13', result: 'less' }
API 200 {"heatingWithoutServicePeriod":[],"oldHeatingRule":["5f545faf-…"],"heatingSums":[{"statementId":"5f545faf-…","costs":"1054.47","tenants":"1054.47","landlord":"0.00","billed":"1042.34","difference":"12.13","result":"less","landlordFor":null}]}
```

Alle sechs Felder stimmen. Die Antwort ist unabhängig vom Heizprofil: `node /tmp/scratchpad/dp508/scan.mjs` ruft den Endpunkt für alle Gebäude, die Jahre 2023–2026 und alle Heizprofile (und ohne Profil) auf. Es kommt nur dieser eine Eintrag, jedes Mal mit denselben Zahlen. Das ist richtig, weil beide Mietverträge die Rechnungszeiträume ganz abdecken.

**Seite (Vorschau) und Sprachen**

- `POST http://localhost:3300/statements/generate?/preview` (Cookie `dwello_session`, Origin, `x-sveltekit-action`) liefert in `de`, `fr`, `it`, `en` dasselbe `changed[0].heatingSum` mit denselben Beträgen (Skript `/tmp/scratchpad/dp508/page.mjs`). Die Seite zeigt die Beträge also unverändert.
- Die Texte setze ich aus `messages/*.json` und dem Format von `formatCurrency` (de-CH, `’`) zusammen (`/tmp/scratchpad/dp508/texts.mjs`):
  - de: Die Heizkosten der Wohnung betragen CHF 1’054.47. Die Abrechnungen der Wohnung verrechnen dafür zusammen CHF 1’042.34 ohne Verwaltungspauschale, CHF 12.13 zu wenig.
  - fr: Les frais de chauffage du logement s’élèvent à CHF 1’054.47. Les décomptes du logement en facturent ensemble CHF 1’042.34 sans les frais d’administration, soit CHF 12.13 de moins.
  - it: Le spese di riscaldamento dell’appartamento ammontano a CHF 1’054.47. I conteggi dell’appartamento ne addebitano insieme CHF 1’042.34 senza le spese amministrative, ossia CHF 12.13 in meno.
  - en: The heating costs of the apartment amount to CHF 1’054.47. The apartment’s statements charge CHF 1’042.34 for them in total, without the management fee: CHF 12.13 too little.
- Die 24 Texte der sechs Schlüssel `statements_heating_sum_costs`, `_costs_vacancy`, `_costs_landlord`, `_more`, `_less`, `_equal` sind in allen vier Sprachen wörtlich gleich wie in der Tabelle des Fachreviews (`/tmp/scratchpad/dp508/msgs.mjs`: 24 gleich, 0 abweichend). `statements_heating_sum_period_first` fehlt in `messages/*.json`. Das ist gewollt, denn V-2 wartet auf den Product Owner (nicht Teil dieses Diffs). Hier greift es nicht, weil `heatingWithoutServicePeriod` leer ist.

**Definition gegen das Fachreview (Punkte 1–5)**

1. Heizkosten der Wohnung = Wohnungsanteil vor dem Zeitanteil, nach dem Verteilschlüssel jeder Rechnung, ohne Verwaltungspauschale. Stimmt: 1'054.47 ist unabhängig vom Heizprofil.
2. Anteil der Mieter = Summe der Mieteranteile der Mietverträge nach heutiger Regel. Anteil des Vermieters = Kosten minus Anteil der Mieter. Stimmt, hier 0.00 (kein Leerstand).
3. Verrechnet = bestehende, nicht ersetzte Abrechnung der Periode (gespeichert) plus neue Abrechnung (so, wie der Lauf sie berechnen würde), Heizpositionen ohne Verwaltungspauschale. Stimmt: 579.81 + 462.53.
4. Unterschied = Verrechnet − Anteil der Mieter, unter 0.05 «gleich viel». Stimmt, ohne 5-Rappen-Rundung (sie gilt nur für den Saldo).
5. Die Zeile steht einmal pro Wohnung, bei der ersten Abrechnung nach der alten Regel. Stimmt: ein Eintrag, auf der Abrechnung von Sarah Meier.

Das Beispiel des Fachreviews (Lindenhof, Szenario `statement-generate.feature:789-801`) habe ich von Hand mit meiner Methode nachgerechnet: Heizprofil «Winter» [18,16,13,8,4,1,0,0,3,9,13,15], Marc ab 01.05. alt 2'000.00 × 45 % = 900.00, Eva neu 1'000.00 × 47 % + 1'000.00 = 1'470.00, Leerstand April 8 % von 1'000.00 = 80.00. Das ergibt Kosten 2'000.00, Mieter 1'920.00, Vermieter 80.00, verrechnet 2'370.00, 450.00 zu viel. Der erwartete Text im Szenario stimmt.

Zur Saldo-Rundung (nicht Teil der Änderung, nur zur Kontrolle): Sarahs gespeicherte Abrechnung hat 1'449.14 − 1'320.00 = 129.14, gerundet zugunsten des Mieters (Nachzahlung abgerundet) 129.10. Das stimmt.

Reproduzieren:

```
cd /tmp/scratchpad/dp508 && node recompute.mjs   # Nachrechnung und API-Antwort
node scan.mjs                                      # alle Gebäude, Jahre, Profile
node page.mjs                                      # BFF-Aktion der Vorschau in de/fr/it/en
node texts.mjs; node msgs.mjs                      # Texte
```

Geprüft: Seepark Residenz, Wohnung A2 (aaaa2222-…-2222), Abrechnung NK-22222222-2025-0007 (Sarah Meier, Vertrag b0000002-…-0002), Vertrag von Nina Brunner (b0000002-…-0003) als neue Abrechnung des Laufs, Antwort `GET /api/v1/statements/run-heating` und BFF-Aktion `preview` in de/fr/it/en, Texte `statements_heating_sum_*` in de/fr/it/en, Lindenhof-Szenario von Hand.

## Nicht bestätigt

- **PDF und QR-Rechnungen:** Der Diff ändert weder ein PDF noch eine QR-Rechnung (14 Dateien: Dienst, Texte, Wizard, Tests, Contract, Szenario). Ich habe darum keine PDF-Seite gerendert und keinen QR-Code dekodiert.
- **Gerenderte Seite:** In der Umgebung gibt es keinen Headless-Browser. Ich habe die Antwort der BFF-Aktion in vier Sprachen geprüft und den Text aus `messages/*.json` mit `formatCurrency` zusammengesetzt, nicht das gerenderte DOM gelesen. Orte: `/tmp/scratchpad/dp508/page.mjs`, `texts.mjs`.
- **Fälle mit Leerstand oder Mietvertrag ohne vereinbarte Heizkosten:** In `dwello_persona` gibt es keine versendete Abrechnung nach der alten Regel mit diesem Fall (`scan.mjs` findet nur A2), und die Daten darf ich nicht ändern. Diese Zweige habe ich nur im Code und über das Beispiel des Fachreviews von Hand geprüft (Lindenhof, siehe oben), nicht gegen die Datenbank. Der pg-Test `invoice-completeness.pg.test.ts` («nennt die Heizkosten der Wohnung, den Leerstand …») deckt Leerstand ab, aber nur mit Bereichsprüfungen und `costs: '2000.00'`.
- **Mietverträge mit unterschiedlich vereinbarten Heizkategorien (nur Lesen des Codes, kein Datenbeleg):** `heatingSumsOf` nimmt die Heizkosten der Wohnung als `Math.max` über die Verträge (`statement-run.service.ts`, Schleife über `planned`), und `calculateStatement` liefert je Vertrag nur die vereinbarten Kategorien (`calculation.service.ts:365`). Vereinbart Vertrag A nur «Heating» und Vertrag B nur «Chimney Sweep», wären die Heizkosten der Wohnung zu klein ausgewiesen und der Anteil des Vermieters falsch. Ich habe dafür keinen Datensatz und halte es nicht für einen Befund, nur für eine Stelle, die das Fachreview (Punkt 1: alle Heizpositionen der Wohnung, unabhängig von der Vereinbarung) etwas anders beschreibt.
- **Nicht aktuelle Abrechnung:** In der Vorschau steht bei Sarahs Abrechnung `outdated: false`, obwohl sich die Rechnungsmenge seit dem Erstellen geändert hat (4'055.00 gespeichert gegen 4'115.00 heute). `GET /statements/outdated` führt sie dagegen auf. Das gehört nicht zu #508, und ich habe die Regel dazu nicht geprüft.
- **Satz `statements_heating_sum_period_first` (V-2):** nicht im Diff. Er wartet laut Fachreview auf den Product Owner.
