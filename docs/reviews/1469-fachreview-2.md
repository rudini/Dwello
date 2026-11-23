# Fachreview #1469, Runde 2 (Schritt 1): Vorschau-Hinweis zu M-1

Commit 74eb861 (Diff cedb7d3..74eb861), Vorbericht docs/reviews/1469-fachreview-1.md.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| – | – | – | Keine offenen und keine neuen Befunde. |

Geschlossen: M-1 (Entscheid PO 23.11.2026, Option A; Szenario statement-generate.feature:317-330), M-3 (Glossarzeile «Anteil nach Heizprofil» mit «Mit Tankbestand in der Periode …», UBIQUITOUS_LANGUAGE.md:158; Rest in #1470).

## Titel, Ton, mehrere Kategorien

- **Titel:** `statements_tank_not_delivery_title`, siehe Tabelle. Er sagt die Folge wie `statements_late_title` und entspricht dem Namen des Ziels im Szenario («Hinweis auf Rechnungen, die nicht als Lieferung in den Tank zählen», targets/statement-generate.ts:170).
- **Ton:** `info` (Standard von InvoiceHint.svelte:12), wie `heating-without-service-period` und `late-invoices`. Der Hinweis hält nichts an und verlangt keine Bestätigung (Szenario: «verlangt die Vorschau keine Bestätigung»). Er erscheint auch bei einer echten Tankrevision, die richtig erfasst ist. `caution` brauchen in der Vorschau nur Fälle, die eine Bestätigung oder ein Handeln verlangen (`uncategorized-invoices`, PreviewChecks.svelte:128-133).
- **Mehrere Kategorien:** Einen Hinweis zeigen, nicht einen pro Kategorie. Das folgt dem Vorbild `heatingWholeText` (src/lib/statement-wizard.ts:396-401): eine Kategorie gibt `statements_finding_tank_not_delivery` mit `{category}`, mehrere geben `statements_finding_tank_not_delivery_many` mit `{categories}`, darunter die Rechnungen pro Gebäude. Mehrere Alerts mit demselben Titel würden sich wiederholen, und jede gelistete Rechnung liegt ohnehin in der Kategorie des Tanks ihres Gebäudes. Die Namen werden ohne Guillemets aufgezählt (`Intl.ListFormat` direkt über die Namen, nicht über `statements_heating_category`). So passt die Mehrzahl zum beschlossenen Einzeltext «In der Kategorie {category} …» und zu `statements_finding_stock_keys`, die beide keine Guillemets haben.

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| statements_tank_not_delivery_title | Rechnungen, die nicht als Lieferung in den Tank zählen | Factures qui ne comptent pas comme livraison dans la citerne | Fatture che non contano come fornitura nel serbatoio | Invoices that do not count as a delivery into the tank |
| statements_finding_tank_not_delivery | In der Kategorie {category} zählt eine Rechnung mit einem Leistungszeitraum über mehrere Tage nicht als Lieferung in den Tank, sondern mit den Tagen ihres Leistungszeitraums. Ist eine solche Rechnung eine Lieferung, tragen Sie als Beginn und als Ende den Tag der Lieferung ein. | Dans la catégorie {category}, une facture dont la période de prestation dure plusieurs jours ne compte pas comme livraison dans la citerne, mais selon les jours de sa période de prestation. Si une telle facture est une livraison, saisissez le jour de la livraison comme début et comme fin. | Nella categoria {category} una fattura con un periodo di prestazione di più giorni non conta come fornitura nel serbatoio, ma secondo i giorni del suo periodo di prestazione. Se una tale fattura è una fornitura, inserisca il giorno della fornitura come inizio e come fine. | In the category {category}, an invoice with a service period of several days does not count as a delivery into the tank but by the days of its service period. If such an invoice is a delivery, enter the day of delivery as both start and end. |
| statements_finding_tank_not_delivery_many | In den Kategorien {categories} zählt eine Rechnung mit einem Leistungszeitraum über mehrere Tage nicht als Lieferung in den Tank, sondern mit den Tagen ihres Leistungszeitraums. Ist eine solche Rechnung eine Lieferung, tragen Sie als Beginn und als Ende den Tag der Lieferung ein. | Dans les catégories {categories}, une facture dont la période de prestation dure plusieurs jours ne compte pas comme livraison dans la citerne, mais selon les jours de sa période de prestation. Si une telle facture est une livraison, saisissez le jour de la livraison comme début et comme fin. | Nelle categorie {categories} una fattura con un periodo di prestazione di più giorni non conta come fornitura nel serbatoio, ma secondo i giorni del suo periodo di prestazione. Se una tale fattura è una fornitura, inserisca il giorno della fornitura come inizio e come fine. | In the categories {categories}, an invoice with a service period of several days does not count as a delivery into the tank but by the days of its service period. If such an invoice is a delivery, enter the day of delivery as both start and end. |

## Nicht bestätigt

- **Bedingung im Backend:** Noch nicht umgesetzt, darum nicht geprüft. Damit der Hinweis zur Rechnung passt, muss er dieselbe Kategorie und dieselbe Bedingung «Tankbestand in der Periode» nehmen wie `delivery` in invoice.service.ts:578 (`tank.covered`). «In der Periode» muss heissen, dass sich der Leistungszeitraum mit der Periode überschneidet. Gelesen: nur Vorbericht und Glossar :104, :158, :163.
- **Kategorie in der Liste:** Nicht gelesen, ob HintedInvoices.svelte die Kategorie jeder Rechnung zeigt. Für den Fall mit mehreren Kategorien ist das nicht nötig (siehe oben).

Geprüft: Das Szenario passt zum Entscheid. Mehrtägige Rechnung der Kategorie des Tanks bei Anfangs- und Endbestand wird genannt, die eintägige Lieferung nicht, keine Bestätigung, der beschlossene Text wörtlich. Seed `fuelStock` legt den Tankbestand in «Heizung» an (fixtures/backend.ts:561). Begriffe gemäss i18n-begriffe.md:140-144.
