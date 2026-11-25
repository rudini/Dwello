# Fachreview #1478, Runde 1 (vor der Umsetzung)

Gegenstand: die zwei `@wip`-Szenarien in `tests/e2e/features/statement-detail.feature:823-860` und der geplante Umbau von `delivery()` in `backend/src/services/invoice.service.ts:587-589`. Worktree `review-1478-fach`, Commit 9507aa4.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Die Zeile unter der Position (PDF `partDelivery`) und die Zeile auf der Detailseite (`statements_part_delivery`, `_profile`) sagen bei Holz «Lieferung in den Tank». Holz kommt nicht in den Tank. Das ist falsch. |
| M-1 | Mietrecht | Major | Kein Hinweis im PDF erklärt, warum die Holzrechnung mit dem Liefertag 30.09. über die ganze Periode zählt und dass ohne Tankbestand der Einkauf als Verbrauch gilt. Fehlt der Anfangs- oder Endbestand des Tanks, erscheint `sharesNoteDelivery`, auch wenn nur Holz geliefert wurde. Dieser Hinweis spricht nur von Lieferungen «in den Tank». |
| V-2 | Verwalter | Major | Der Plan prüft mit der Spalte `fuel`, also mit `not no_tank`. Damit nimmt er ein «Gebäude ohne Tank» aus, das in der Periode noch einen Tankbestand hat (Tank im Jahr stillgelegt, Umstieg von Öl auf Pellets oder Holz). Nach dem Wortlaut des Entscheids gilt die Regel auch dort. |
| V-3 | Verwalter | Minor | Glossar: «Verbrauch (Heizmaterial)» (`UBIQUITOUS_LANGUAGE.md:163`), «Brennstoff (Kategorie)» (`:104`) und «Anteil nach Heizprofil» (`:158`) nennen nur die Lieferungen der Kategorie des Tankbestands. Die Sätze stehen unten im Abschnitt «Glossar». |
| V-4 | Verwalter | Minor | Die negative Prüfung in Zeile 843 kann nie scheitern. Bei Anfangs- und Endbestand kehrt `sharesNote` schon im Zweig `data.fuel` zurück (`backend/src/services/pdf-cost-table.ts:232`), also vor `sharesNoteDelivery`. Besser: den neuen Hinweis aus M-1 positiv prüfen, als `Und steht im PDF " Für Heizmaterial einer anderen Kategorie …"`, ohne das führende Leerzeichen. |

## V-1: Zeile «Lieferung in den Tank» bei einer zweiten Brennstoff-Kategorie

- **Beleg:** Nach dem Plan bekommt die Holzrechnung `inPeriod.delivery: true`. Daraus folgt:
  - PDF: `partText` wählt `partDelivery` (`pdf-cost-table.ts:164`). Die Zeile heisst dann «…, Lieferung in den Tank, gilt für die ganze Abrechnungsperiode…» (`backend/src/services/pdf-texts/de.ts:73`).
  - Detailseite: `LineInvoices.svelte:34-35` wählt `statements_part_delivery` bzw. `statements_part_delivery_profile` (`messages/de.json:1572-1573`).
  - Die Zeile erscheint nur, wenn die Position Rechnungen über verschiedene Tage hat (`invoiceParts`). Das ist der Fall, wenn es neben der Holzlieferung eine zweite Holzrechnung gibt, z.B. eine Wartung mit Leistungszeitraum.
- **Warum falsch:** Die Rechnung gehört nicht zum Tank. Der Abschnitt «Heiz- und Warmwasserkosten» zählt sie zu Recht nicht zu «Lieferungen «Heizung»» (`statement-pdf.service.ts:239` filtert nach `stock.categoryId`). Die Zeile behauptet aber eine Lieferung in den Tank. Der Mieter findet sie dann in der Verbrauchsrechnung nicht.
- **Fix:**
  - Eigene Texte `partDeliveryFuel` (PDF) sowie `statements_part_delivery_fuel` und `statements_part_delivery_fuel_profile` (UI), Wortlaut unten.
  - Sie gelten für eine Lieferung, deren Kategorie nicht die Kategorie des Tankbestands ist (`tank` vorhanden, `categoryId !== tank.categoryId`).
  - Der Teil braucht dafür ein Merkmal, das mit den `invoiceParts` gespeichert wird, z.B. `delivery: 'fuel'` statt `true`. Bei fehlendem Anfangs- oder Endbestand kennt das PDF die Kategorie des Tanks sonst nicht.
  - `partProfileRun` hängt an `{amount}` an (`pdf-cost-table.ts:127-128`) und passt ohne Änderung.
  - Ohne jeden Tankbestand (#1474) bleibt alles wie heute.

## M-1: Kein Hinweis auf den Einkauf ohne Tankbestand und die ganze Periode

- **Beleg:**
  - Mit beiden Beständen gibt `sharesNote` nur `sharesNoteFuel` aus, dazu `sharesNoteFuelOther` (`pdf-cost-table.ts:232`). Wortlaut: «Kosten des Gebäudes bei Heizmaterial aus dem Tank: der Verbrauch (siehe Heiz- und Warmwasserkosten). Er zählt über die ganze Abrechnungsperiode, auch wenn eine Lieferung einen Leistungszeitraum hat.» (`pdf-texts/de.ts:132`). Das gilt nur für den Tank. Zur Holzrechnung sagt das PDF nichts.
  - Ohne beide Bestände setzt `tankDelivery` (`statement-pdf.service.ts:123`) den Hinweis bei jeder Rechnung mit `delivery`. Er lautet: «Für den Tank sind der Anfangs- und der Endbestand nicht beide erfasst. Die Lieferungen von Heizmaterial in den Tank … sind deshalb als Verbrauch abgerechnet …» (`pdf-texts/de.ts:134`).
  - Ist nur Holz geliefert worden, beschreibt dieser Satz keine Rechnung des PDF. Die Holzlieferung bleibt unerklärt.
- **Gesetz:** VMWG, Fedlex, Stand 1. Oktober 2025 (`eli/cc/1990/835_835_835/20251001`).
  - Art. 5 Abs. 2 lit. a: «Darunter fallen insbesondere die Aufwendungen für: a. die Brennstoffe und die Energie, die verbraucht wurden;»
  - Art. 8 Abs. 2: «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen und über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen.»
- **Warum es ein Mangel ist:** Für die zweite Kategorie gibt es keinen Tankbestand (Entscheid). Abgerechnet wird darum der Einkauf, nicht der Verbrauch. Das weicht von lit. a ab.
  - #1470 und #1474 haben diese Abweichung im PDF offengelegt: Fachreview 1470-1 V-2 und `sharesNoteDelivery`.
  - Für die zweite Kategorie fehlt diese Offenlegung.
  - Der Beleg nennt einen Liefertag, das PDF aber 139/365 Tage. Ohne Hinweis kann der Mieter das nicht nachvollziehen.
- **Fix:**
  - `tankDelivery` nur für Lieferungen der Kategorie des Tankbestands setzen.
  - Ein neues Merkmal, z.B. `fuelDelivery`, für die Lieferungen einer anderen Brennstoff-Kategorie einführen. Es hängt den neuen Satz `sharesNoteDeliveryFuel` an, in beiden Zweigen von `sharesNote`: nach `sharesNoteFuel` bzw. `sharesNoteFuelOther`, und ohne `data.fuel` nach `from` bzw. `sharesNoteDelivery`.
  - Wortlaut unten. Das Szenario in Zeile 828 prüft den Satz (siehe V-4).

## V-2: Gebäude ohne Tank mit Tankbestand in der Periode

- **Beleg:**
  - `fuel` ist `coalesce(is_fuel and not no_tank, false)` (`invoice.service.ts:62`).
  - `periodReadings` gibt bei `no_tank` dennoch Bestände zurück, wenn die Periode `covered` ist (`fuel-stock.service.ts:65`).
  - Der Plan verknüpft «eintägig und `fuel`» mit ODER. Bei einem «Gebäude ohne Tank» mit Ölbestand in der Periode zählt eine eintägige Pellet- oder Holzrechnung darum weiter nur an ihrem Tag.
- **Warum falsch:**
  - Der Entscheid sagt: «a fuel category (`is_fuel`) that is not the category of the building's Tankbestand counts like a delivery». Das Gebäude hat in dieser Periode einen Tankbestand. Nach dem Wortlaut gilt die Regel also.
  - Der Fall ist typisch für einen Umstieg im Jahr: Öltank stillgelegt, danach Pellets.
  - Es ist derselbe Schaden wie #1474 V-5: Die Kosten trägt nur der Mieter des Liefertags.
  - Der Hinweis auf #1474 im Entscheid beschreibt, *wie* die Rechnung zählt. Er schränkt nicht ein, *wo* die Regel gilt.
- **Fix:**
  - Gibt es für die Periode einen Tankbestand (`tank` nicht `null`), zählt die eintägige Rechnung jeder Brennstoff-Kategorie als Lieferung, mit `categories.isFuel`, ohne `no_tank`.
  - Nur ohne Tankbestand bleibt die Spalte `fuel` mit `no_tank` massgebend (#1474).
  - Lesen Sie den Entscheid anders, ist das eine Frage an den Product Owner.

## Wortlaut

| key | de | fr | it | en |
|-----|----|----|----|----|
| `partDeliveryFuel` (pdf-texts) | `{name}, Lieferung von Heizmaterial, gilt für die ganze Abrechnungsperiode{colon}CHF {amount}, Ihre Mietstage {days} von {total} Tagen` | `{name}, livraison de combustible, valable pour toute la période de décompte{colon}CHF {amount}, {days} jours de location sur {total} jours` | `{name}, fornitura di combustibile, vale per l’intero periodo di conteggio{colon}CHF {amount}, {days} giorni di locazione su {total} giorni` | `{name}, delivery of fuel, applies to the whole billing period{colon}CHF {amount}; your days rented: {days} of {total} days` |
| `sharesNoteDeliveryFuel` (pdf-texts, mit führendem Leerzeichen) | ` Für Heizmaterial einer anderen Kategorie als der des Tanks ist kein Tankbestand erfasst. Seine Lieferungen in dieser Abrechnungsperiode sind deshalb als Verbrauch abgerechnet, getrennt vom Verbrauch aus dem Tank; sie zählen über die ganze Abrechnungsperiode, auch wenn eine Lieferung einen Leistungszeitraum hat.` | ` Pour le combustible d’une autre catégorie que celle de la citerne, aucun stock de combustible n’est saisi. Ses livraisons pendant cette période de décompte sont donc décomptées comme consommation, séparément de la consommation de la citerne ; elles comptent pour toute la période de décompte, même si une livraison a une période de prestation.` | ` Per il combustibile di un’altra categoria rispetto a quella del serbatoio non è registrata alcuna scorta di combustibile. Le sue forniture in questo periodo di conteggio sono quindi conteggiate come consumo, separatamente dal consumo del serbatoio; contano per l’intero periodo di conteggio, anche se una fornitura ha un periodo di prestazione.` | ` For fuel in a category other than the tank’s, no fuel stock is recorded. Its deliveries in this billing period are therefore billed as consumption, separately from the consumption from the tank; they count for the whole billing period, even if a delivery has a service period.` |
| `statements_part_delivery_fuel` (messages) | `Lieferung von Heizmaterial, gilt für die ganze Abrechnungsperiode: {amount}, Ihre Mietstage {days} von {total} Tagen` | `Livraison de combustible, valable pour toute la période de décompte : {amount}, {days} jours de location sur {total}` | `Fornitura di combustibile, vale per l’intero periodo di conteggio: {amount}, i suoi giorni di locazione {days} su {total}` | `Delivery of fuel, applies to the whole billing period: {amount}; your days rented: {days} of {total}` |
| `statements_part_delivery_fuel_profile` (messages) | `Lieferung von Heizmaterial, gilt für die ganze Abrechnungsperiode: {amount}, Anteil nach Heizprofil: {percent} %` | `Livraison de combustible, valable pour toute la période de décompte : {amount}, part selon le profil de chauffage : {percent} %` | `Fornitura di combustibile, vale per l’intero periodo di conteggio: {amount}, quota secondo il profilo di riscaldamento: {percent} %` | `Delivery of fuel, applies to the whole billing period: {amount}; share under the heating profile: {percent} %` |

` ` steht für ein geschütztes Leerzeichen. Es steht an denselben Stellen wie in `partDelivery` bzw. `statements_part_delivery`; in `messages/*.json` als Zeichen U+00A0, nicht als Escape.

## Glossar (V-3)

| Zeile | Satz |
|-------|------|
| «Verbrauch (Heizmaterial)», ersetzen | «Lieferungen sind nur die Rechnungen der Kategorie des Tankbestands …» → «Lieferungen in den Tank sind nur die Rechnungen der Kategorie des Tankbestands …» |
| «Verbrauch (Heizmaterial)», am Ende anfügen | «Ist für die Abrechnungsperiode ein Tankbestand erfasst, zählt in jeder anderen Brennstoff-Kategorie eine Rechnung mit eintägigem Leistungszeitraum ebenfalls wie eine Lieferung: Sie zählt ganz in der Abrechnungsperiode ihres Lieferdatums, über die ganze Periode nach den Mietstagen oder nach dem Heizprofil. Sie gehört nicht zum Verbrauch aus dem Tank; eine solche Kategorie hat keinen eigenen Tankbestand, abgerechnet wird ihr Einkauf (#1478).» |
| «Brennstoff (Kategorie)», ersetzen | «Ist gar kein Tankbestand erfasst, siehe Verbrauch (Heizmaterial) (#1474).» → «Ist gar kein Tankbestand erfasst oder ist es nicht die Kategorie des Tankbestands, siehe Verbrauch (Heizmaterial) (#1474, #1478).» |
| «Anteil nach Heizprofil», ersetzen | «Lieferungen in den Tank zählen immer über die ganze Periode, auch ohne Anfangs- oder Endbestand (siehe Verbrauch (Heizmaterial)).» → «Lieferungen in den Tank zählen immer über die ganze Periode, auch ohne Anfangs- oder Endbestand, ebenso Lieferungen einer anderen Brennstoff-Kategorie (siehe Verbrauch (Heizmaterial)).» |

## Nicht bestätigt

- **Gebäude ohne Tank in den Perioden nach dem Umstieg (zu V-2):** Ist der Ölbestand aufgebraucht, ist die Periode nicht mehr `covered`. Dann gilt für Pellets bzw. Holz wieder der Entscheid zu #1474: Bei `no_tank` ist keine Rechnung eine Lieferung, die Kosten trägt nur der Mieter des Liefertags. Ausserdem lehnt `otherTankCategory` (`fuel-stock.service.ts:153`) einen Tankbestand der neuen Kategorie ab, solange Ölbestände erfasst sind.
  - Vorschlag für ein Issue (`domain`, `needs-decision`): «Ein Gebäude ohne Tank, das auf ein anderes Heizmaterial mit Lager umgestellt hat (z.B. Öl → Pellets): Zählt eine eintägige Rechnung der neuen Brennstoff-Kategorie als Lieferung über die ganze Periode, und kann die neue Kategorie einen Tankbestand bekommen?»
- **Bestehende Abrechnungen:** Abrechnungen mit einer eintägigen Rechnung der zweiten Kategorie, die vor der Änderung erstellt wurden, sollten nach ihr «nicht aktuell» sein. Versendete müssten berichtigt werden. Ob `billedAsIs` (`statement-invoices.service.ts:120`) die neuen Tage erkennt, habe ich nicht im Code nachverfolgt.
- **Heizprofil «Winter»:** Aug 0 + Sep 2 + Okt 8 + Nov 14 + Dez 26 = 50 %. Die Monatswerte habe ich nicht in der Datenbank gefunden: `dwello_e2e` ist leer, die Quelle in den Fixtures nicht gefunden. Das bestehende, nicht-`@wip` Szenario mit «900.00 450.00 50.00 % 225.00» (`statement-detail.feature:806`) läuft aber mit demselben Profil.

Geprüft:
- Zahlen: 15.08.–31.12. = 17 + 30 + 31 + 30 + 31 = 139 Tage. 900.00 / 2 = 450.00; × 139/365 = 171.37; × 50 % = 225.00. Bei einer Rechnung allein über die ganze Periode gibt es keine Teilzeile (`calculation.service.ts:226`).
- Verbrauchsrechnung: Die Holzlieferung gehört nicht in die Verbrauchsrechnung des Tanks (`statement-pdf.service.ts:239`, Art. 5 Abs. 2 lit. a VMWG) und nicht in den Verteilschlüssel der Veränderung Tankbestand (`keyFor`, `fuel-stock.service.ts:83`). `tank` bleibt `undefined`, das ist richtig.
- Hinweise, die passen: `heatingNoteDelivery` und `partProfileRun` sind allgemein formuliert. Auch ohne Tankbestand (#1474) passt alles wie heute.
- Vorschau-Prüfungen (`invoice-completeness.service.ts:328-390`):
  - `withoutBesideWith` nimmt Lieferungen schon aus, `oldHeatingRule` meldet für eine Rechnung über die ganze Periode nichts mehr. Beides ist richtig.
  - `tankNotDelivery`, `stockFinding` und `withoutServicePeriod` betreffen nur die Kategorie des Tanks und brauchen nichts.
- Rechnungsseite: `invoices_tank_delivery` und `invoices_service_period_fuel` bleiben auf die Kategorie des Tanks beschränkt. Der Entscheid verlangt nichts weiter, und `invoices_service_period_help` sagt für eine eintägige Holzrechnung nichts Falsches.
