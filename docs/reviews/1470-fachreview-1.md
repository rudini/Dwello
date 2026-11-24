# Fachreview #1470, Runde 1 (Szenarien vor der Umsetzung, Commit a88917b)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Der Plan («Gebäude mit Tankbestand, Periode nicht `covered`») erfasst auch ein Gebäude ohne Tank (stillgelegt) nach dem Jahr der Stilllegung: Dort ist keine Rechnung eine Lieferung in den Tank |
| V-2 | Verwalter / Mietrecht | Major | Ohne Anfangs- und Endbestand erklärt das PDF die neue Regel nirgends; sein allgemeiner Satz sagt das Gegenteil («eine Rechnung mit Leistungszeitraum zählt mit den Tagen, die in die Periode fallen») |
| V-3 | Verwalter / Mietrecht | Major | Steht die Lieferung als Zeile unter einer Position mit Rechnungen über verschiedene Tage, druckt der Plan «Leistungszeitraum 01.01.2025 – 31.12.2025», einen Zeitraum, den der Beleg nicht zeigt, und keinen Rechnungsnamen |
| V-4 | Verwalter | Minor | Hinweis #339 («Heizkosten: Rechnungen ohne Leistungszeitraum», `statements_heating_whole_text`) zählt die eintägige Lieferung weiter als «Rechnung mit Leistungszeitraum» und verspricht, dass ein eingetragener Leistungszeitraum etwas ändert, obwohl jetzt beide über die ganze Periode zählen (`invoice-completeness.service.ts:326-337`). Lösung: Eine Lieferung ohne Bestand aus `heatingInvoices` herausnehmen wie die mit Bestand, z.B. über dieselbe Markierung wie bei V-3 |
| V-5 | Verwalter | Minor | Vorbestehend, nicht im Umfang von #1470: Ein Gebäude ganz ohne Tankbestand, das mit Öl heizt (Frage `statements_tank_text`), rechnet eine eintägige Heizöl-Rechnung weiter nur an ihrem Tag ab. Das ist derselbe Fehler für den Mieter, ohne Kategorie des Tankbestands kann Dwello die Lieferung aber nicht erkennen. Eine Einschränkung auf Gebäude mit Tankbestand ist nach dem Entscheid richtig (Frage 1) |

## V-1 (Major): Gebäude ohne Tank nach der Stilllegung

**Beleg:**
- `backend/src/services/fuel-stock.service.ts:57`: `covered` ist falsch, sobald kein Tankbestand nach dem Vortag der Periode erfasst ist und der Anfangsbestand nicht über 0 liegt. Das trifft zwei Fälle:
  - (a) Die Bestände sind vergessen worden. Der Tank läuft weiter, und der Abrechnungslauf meldet die fehlenden Bestände (`invoice-completeness.service.ts:303-318`, Szenario «Ein vergessener Tankbestand fällt auf»).
  - (b) Der Tank ist stillgelegt: `buildings.no_tank` ist gesetzt, oder der Endbestand 0 des Stilllegungsjahres ist der Anfangsbestand.
- Für (b) behandelt Dwello das Gebäude schon heute wie eines ohne Tank:
  - `invoice-completeness.service.ts:300`: `if (building?.noTank && !readings?.covered) return null;`
  - `invoice-completeness.service.ts:325`: «a tank decommissioned before the period shares its category by #71 again (#72)».
- Glossar «Gebäude ohne Tank» (`UBIQUITOUS_LANGUAGE.md:164`): «Es hat keinen Tank … oder der Tank ist stillgelegt».
- Szenarien `statement-generate.feature:422-446`.

**Warum falsch:** Nach der Stilllegung gibt es keinen Tank, in den geliefert wird. Eine eintägige Rechnung der früheren Kategorie ist dann z.B. ein Service oder eine Wärmepumpen-Wartung an einem Tag, oder eine Restmengen-Abholung. Nach dem Plan zählte sie neu über die ganze Periode. Jede andere Rechnung (Glossar «Brennstoff (Kategorie)») und dieselbe Kategorie bei #71 zählen dagegen mit den Tagen ihres Leistungszeitraums. Der Mieter am Tag der Rechnung und die übrigen Mieter tragen damit andere Beträge, als die Regel für Rechnungen ergibt.

**Lösung:** Die Lieferung ohne Bestand gilt nur, wenn `periodReadings` nicht `null` ist und nicht (`noTank` und nicht `covered`). Das ist dieselbe Bedingung, unter der der Abrechnungslauf noch nach dem Tankbestand fragt. `getInvoicesForStatement` braucht dafür `buildings.no_tank`. Der Plan muss das schon heute lesen, weil `noTank` in `periodReadings` fehlt. Vorschlag: `noTank` dort mitgeben, dann sehen es `stockFinding` und `getInvoicesForStatement` gleich.

Ein pg-Test pinnt beide Fälle:
- Bestand 2022-12-31 = 800, `noTank`, eintägige Rechnung 2024: zählt 1/1 Tag.
- Dasselbe ohne `noTank`: zählt 366/366 Tage.

Die Glossarzeile unten nennt die Einschränkung. Sie verdeutlicht nur den Entscheid («delivery into the tank»), denn ein stillgelegter Tank bekommt keine Lieferung. Sieht der Aufrufer darin mehr als eine Schärfung, gehört sie als Rückfrage in #1470.

## V-2 (Major): Das PDF erklärt die Regel nicht und sagt das Gegenteil

**Beleg:**
- `backend/src/services/pdf-texts/de.ts:120` `sharesNote`: «eine Rechnung mit Leistungszeitraum zählt mit den Tagen, die in die Periode fallen».
- Der erklärende Satz `sharesNoteFuel` («Er zählt über die ganze Abrechnungsperiode, auch wenn eine Lieferung einen Leistungszeitraum hat.») steht nur mit `data.fuel` (`pdf-cost-table.ts:229`). `data.fuel` gibt es nur mit beiden Beständen (`statement-pdf.service.ts:235-238`).
- Im Szenario zeigt das PDF «900.00 450.00 139/365 Tage 171.37». Der Beleg zeigt aber den Leistungszeitraum 30.09.2025 – 30.09.2025.
- OR Art. 257b Abs. 2 (Fedlex, Stand 1.10.2026): «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.»

**Warum falsch:** Ein Mieter, der den Beleg einsieht, findet einen eintägigen Leistungszeitraum. Nach dem Satz des PDFs hätte er dann 0/1 oder 1/1 Tag erwartet, nicht 139/365. Die Abrechnung lässt sich so nicht nachvollziehen.

**Lösung:**
- Einen neuen Satz `sharesNoteDelivery` (Wortlaut unten) an `sharesNote` anhängen, wenn das PDF ohne `data.fuel` eine Lieferung in den Tank über die ganze Periode abrechnet. Dafür braucht die Rechnung in der Position eine Markierung, siehe V-3.
- Szenario 1 erhält zusätzlich: `Und steht im PDF "Eine Lieferung von Heizmaterial in den Tank zählt über die ganze Abrechnungsperiode, auch wenn sie einen Leistungszeitraum hat."`

## V-3 (Major): Die Zeile der Lieferung unter einer Position

**Beleg:**
- `pdf-cost-table.ts:159-160`: Ohne `noPeriod`, `whole` und `fuelStock` wird die Zeile mit `partLine` gedruckt, d.h. «Leistungszeitraum {start} – {end}: CHF {amount}, Ihre Mietstage …» (`de.ts:74`). Der Plan setzt `{start: periodStart, end: periodEnd}` ohne Markierung, das ergibt «Leistungszeitraum 01.01.2025 – 31.12.2025».
- `nameOf` (`pdf-cost-table.ts:164-165`) nennt die Rechnung nur bei `noPeriod` oder bei gleichen Zeilen.
- `partNoPeriod` («… ohne Leistungszeitraum …») wäre ebenfalls falsch, denn die Rechnung hat einen.
- Dieselbe Zeile druckt heute schon der Weg mit Bestand, wenn neben Lieferung und Veränderung Tankbestand eine Tankrevision steht. Die Änderung macht das häufiger sichtbar.

**Warum falsch:** Das PDF nennt einen Leistungszeitraum, den es auf keinem Beleg gibt, und keinen Rechnungsnamen. Der Mieter findet den Beleg nicht (OR Art. 257b Abs. 2, oben).

**Lösung:**
- Kein bestehender Text passt, daher ein neuer `partDelivery` (Wortlaut unten), mit Rechnungsnamen (`nameOf` auch bei der Markierung).
- `getInvoicesForStatement` setzt dafür an `inPeriod` eine Markierung `delivery: true`, analog zu `fuelStock`, beim Weg mit und ohne Bestand. `partOf` (`calculation.service.ts:159-168`) und `partText` reichen sie weiter.
- Mit Heizprofil: Kopf bis `{amount}`, dann `partProfileRun` wie bei `noPeriod` (`pdf-cost-table.ts:128`), denn die Lieferung zählt mit dem Anteil der Periode.
- Ein Szenario pinnt es. Vorschlag: wie Szenario 1, zusätzlich `eine Rechnung der Kategorie "Heizung" über "184" Franken vom "2025-12-31" für die Zeit vom "2025-07-01" bis "2025-12-31"`.
  - Erwartet: `"Rechnung vom 05.10.2025, Lieferung in den Tank, gilt für die ganze Abrechnungsperiode: CHF 900.00, Ihre Mietstage 139 von 365 Tagen"`
  - Mieteranteil 0.5 × (900 × 139/365 + 184 × 139/184) = 0.5 × (342.74 + 139.00) = 240.87.

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| `partDelivery` (pdf-texts) | `{name}, Lieferung in den Tank, gilt für die ganze Abrechnungsperiode{colon}CHF {amount}, Ihre Mietstage {days} von {total} Tagen` | `{name}, livraison dans la citerne, valable pour toute la période de décompte{colon}CHF {amount}, {days} jours de location sur {total} jours` | `{name}, fornitura nel serbatoio, vale per l’intero periodo di conteggio{colon}CHF {amount}, {days} giorni di locazione su {total} giorni` | `{name}, delivery into the tank, applies to the whole billing period{colon}CHF {amount}; your days rented: {days} of {total} days` |
| `sharesNoteDelivery` (pdf-texts, mit führendem Leerzeichen) | ` Eine Lieferung von Heizmaterial in den Tank zählt über die ganze Abrechnungsperiode, auch wenn sie einen Leistungszeitraum hat.` | ` Une livraison de combustible dans la citerne compte pour toute la période de décompte, même si elle a une période de prestation.` | ` Una fornitura di combustibile nel serbatoio conta per l’intero periodo di conteggio, anche se ha un periodo di prestazione.` | ` A delivery of fuel into the tank counts for the whole billing period, even if it has a service period.` |
| `statements_part_delivery` (messages) | `Lieferung in den Tank, gilt für die ganze Abrechnungsperiode: {amount}, Ihre Mietstage {days} von {total} Tagen` | `Livraison dans la citerne, valable pour toute la période de décompte : {amount}, {days} jours de location sur {total}` | `Fornitura nel serbatoio, vale per l’intero periodo di conteggio: {amount}, i suoi giorni di locazione {days} su {total}` | `Delivery into the tank, applies to the whole billing period: {amount}; your days rented: {days} of {total}` |
| `statements_part_delivery_profile` (messages) | `Lieferung in den Tank, gilt für die ganze Abrechnungsperiode: {amount}, Anteil nach Heizprofil: {percent} %` | `Livraison dans la citerne, valable pour toute la période de décompte : {amount}, part selon le profil de chauffage : {percent} %` | `Fornitura nel serbatoio, vale per l’intero periodo di conteggio: {amount}, quota secondo il profilo di riscaldamento: {percent} %` | `Delivery into the tank, applies to the whole billing period: {amount}; share under the heating profile: {percent} %` |

PDF-Zeile mit Heizprofil (de, Kopf von `partDelivery` + `partProfileRun`; Beispiel V-3-Szenario mit Heizprofil «Winter», Einzug 15.08.2025): `Rechnung vom 05.10.2025, Lieferung in den Tank, gilt für die ganze Abrechnungsperiode: CHF 900.00, Anteil nach Heizprofil: 50.00 % (siehe Heiz- und Warmwasserkosten)` (Leerzeichen vor «%» als `\u00a0`, wie in `partProfileRun`).

## Glossar (wörtlich, ganze Zeilen)

| **Verbrauch (Heizmaterial)** | Anfangsbestand plus Lieferungen in den Tank der Abrechnungsperiode minus Endbestand, in CHF; das wird als Heizkosten abgerechnet (Art. 5 Abs. 2 lit. a VMWG). Lieferungen sind nur die Rechnungen der Kategorie des Tankbestands ohne Leistungszeitraum oder mit einem eintägigen (siehe Brennstoff (Kategorie)); die anderen Rechnungen dieser Kategorie gehören nicht zum Verbrauch, sie zählen mit den Tagen ihres Leistungszeitraums in der Periode (#1469). Eine Lieferung zählt ganz in der Abrechnungsperiode ihres Lieferdatums: der Tag ihres Leistungszeitraums, ohne Leistungszeitraum das Rechnungsdatum (#451). Fehlt der Anfangs- oder Endbestand, zählen die Lieferungen der Periode über die ganze Periode, wie eine Rechnung ohne Leistungszeitraum: nach den Mietstagen in der Periode oder nach dem Heizprofil (#1470). Bei einem Gebäude ohne Tank gilt das nur für eine Abrechnungsperiode, nach deren Tankbestand der Abrechnungslauf noch fragt; in den anderen ist keine Rechnung eine Lieferung. | Berechnung |

| **Anteil nach Heizprofil** | Summe der Monatsanteile über die Tage, an denen der Mietvertrag läuft, geteilt durch die Summe der Monatsanteile über die abgerechneten Tage (ohne Leistungszeitraum die Abrechnungsperiode, mit Leistungszeitraum dessen Tage in der Periode). Ein angebrochener Monat zählt mit dem Teil seiner Tage (Monatsanteil × Tage / Tage des Monats). Lieferungen in den Tank zählen immer über die ganze Periode, auch ohne Anfangs- oder Endbestand (siehe Verbrauch (Heizmaterial)). Gerechnet aus diesen Monatswerten, auf zwei Stellen gerundet wie im PDF: geplant, #232. | `utility_statements.heating_share` (`percent`); an der Abrechnungsposition `period_share` |

Anmerkung zur Verbrauch-Zeile:
- «Mit Anfangs- und Endbestand» vor «zählt eine Lieferung ganz in der Abrechnungsperiode ihres Lieferdatums» fällt weg. Seit #1470 gilt der Satz in beiden Fällen, entsprechend dem Entscheid («It belongs to the period of its delivery date»).
- Der letzte Satz ist V-1.

## Antworten auf die Fragen des Aufrufers

1. **Einschränkung auf Gebäude mit Tankbestand:**
   - Die Einschränkung ist richtig. Ohne Tankbestand gibt es keine Kategorie des Tankbestands und damit nach dem Glossar «Brennstoff (Kategorie)» keine Lieferung (Rest: V-5, vorbestehend).
   - Beim Gebäude ohne Tank nach der Stilllegung soll eine eintägige Rechnung **nicht** über die ganze Periode zählen (V-1).
   - Im Stilllegungsjahr selbst ist die Periode `covered`, das ändert sich also nicht.
2. **PDF-Zeile:** Weder `partLine` noch `partNoPeriod` sagt die Wahrheit. Es braucht den neuen Text `partDelivery` (V-3, Wortlaut oben).
3. **Weitere Texte:**
   - Neu gebraucht wird `sharesNoteDelivery` (V-2).
   - Diese Texte bleiben richtig:
     - `invoices_service_period_fuel`: Periode nach dem Tag der Lieferung, sagt nichts zu Tagen.
     - `invoices_tank_delivery`.
     - `statements_finding_stock_tail`: Einkauf statt Verbrauch.
     - `buildings_fuel_delete_text`.
     - `sharesNoteFuel` und `sharesNoteFuelOther`: nur mit beiden Beständen.
     - `fuelInvoices`.
     - `categories_fuel_help`.
   - Der Hinweis #339 `statements_heating_whole_text` wird falsch ausgelöst (V-4). Sein Text bleibt.
4. **Szenarien auf `main`:** Ich habe keines gefunden, das das alte Verhalten ohne Bestand pinnt:
   - E2E: Alle Rechnungen mit eintägigem Leistungszeitraum (`statement-generate.feature:324`, `statement-detail.feature:766`) liegen in Perioden mit beiden Beständen.
   - Backend: Bei `cost-reconciliation-rows.pg.test.ts:86`, `fuel-stock.pg.test.ts:358`, `statement-pdf.pg.test.ts:619` und `invoice-completeness.pg.test.ts:236-250` hat jede Periode Bestände. Im Fall «ohne Tank» gibt es dort keine Bestände, dann ist `readings` gleich `null`.

## Nicht bestätigt

- **Folge für bestehende Abrechnungen:** `billedAsIs` (`statement-invoices.service.ts:27-36`) vergleicht `start`/`end` von `inPeriod`. Nach dem Deploy werden Abrechnungen, die eine eintägige Lieferung ohne Bestand an ihrem Tag abgerechnet haben, «nicht aktuell», und versendete müssen berichtigt werden. Das ist fachlich richtig, denn die alte Abrechnung war zu Lasten des Mieters am Liefertag falsch. Ich habe nicht geprüft, ob die Änderung das mit einem Test zeigt und im Pull Request nennt.
- **Format der PDF-Zeilen:** «900.00 450.00 139/365 Tage 171.37» und «900.00 450.00 50.00 % 225.00» habe ich aus dem Code und dem Muster der Szenarien 773 und 658 abgeleitet. Gerendert habe ich sie nicht, Tests habe ich keine laufen lassen.
- **Verteilschlüssel:** Den gleichmässigen Wohnungsanteil 450.00 (Standard-Verteilschlüssel bei 2 Wohnungen gleicher Fläche) habe ich aus dem Szenario mit Bestand (`statement-detail.feature:773`, «1'400.00 700.00») übernommen, nicht aus den Seed-Daten.

Geprüft:
- **Arithmetik:** 15.08.–31.12.2025 = 17 + 30 + 31 + 30 + 31 = 139 Tage; 450 × 139/365 = 171.3698 → 171.37. Heizprofil «Winter» (Summe 100): Aug 0 + Sep 2 + Okt 8 + Nov 14 + Dez 26 = 50 %; 450 × 50 % = 225.00. Ein Tankbestand vom 2023-12-31 lässt 2025 ungedeckt (`covered` falsch, kein Anfangsbestand), Stichtag-Logik `fuel-stock.service.ts:50-58`.
- **Zuordnung zur Periode:** Die Lieferung gehört über `inPeriodOf` zur Periode ihres Lieferdatums.
- **Plan mit `tank` undefiniert:** Er lässt Veränderung Tankbestand, Kostenabstimmung (`inPeriod.amount` bleibt der volle Betrag) und `tankNotDelivery` unverändert.
- **Rechtliche Einordnung:** VMWG Art. 5 Abs. 2 lit. a (Fedlex, Stand 1.10.2025): «die Brennstoffe und die Energie, die verbraucht wurden». Ohne Bestand ist der Einkauf eine Annäherung an den Verbrauch, auf die `statements_finding_stock_tail` mit Bestätigung hinweist. Den Einkauf über die ganze Periode statt am Liefertag zu verteilen kommt dem Verbrauch näher und belastet den Mieter am Liefertag nicht mehr allein.
