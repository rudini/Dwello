# Code-Review #1478, Runde 2 (93a7f8e..396a597)

Geschlossen: C-1, C-2

C-1 ist geschlossen. Die Rechnungsseite lässt «Nur die Tage in der Abrechnungsperiode zählen.» bei einer eintägigen Rechnung einer Brennstoff-Kategorie neben dem Tank weg (`InvoiceFacts.svelte:20-23, 53`). Das stimmt mit `delivery()` im Backend überein (`invoice.service.ts:588-590`, Zweig `!!tank`). C-2: Die Commit-Nachricht von 396a597 nennt den pg-Test jetzt als Test, der bestehendes Verhalten festhält.

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-3 | Minor | src/routes/invoices/[id]/+page.server.ts:19 | Kein Test prüft die neue Zeile `fuel: categories.some(... category.isFuel)`. Die DOM-Tests geben `fuel` direkt mit (`invoice-pages.dom.test.ts:581, 587`). `invoices.test.ts` prüft für die Detailseite nur `tank` (Zeilen 421-448). Entfernt man `&& category.isFuel` oder vergleicht man die falsche Kategorie, bleiben alle Tests grün. |
| C-4 | Minor | src/routes/invoices/[id]/InvoiceFacts.svelte:21-23 | `fuelDelivery` prüft `invoice.isValidUtilityCost` nicht. `tankDelivery()` (`src/lib/invoice.ts:27-31`) und das Backend (`invoice.service.ts:583`, Filter `isValidUtilityCost = true`) prüfen es beide. Bei einer nicht umlagefähigen eintägigen Rechnung einer Brennstoff-Kategorie neben dem Tank verschwindet der Satz darum jetzt. Bei derselben Rechnung in der Kategorie des Tanks bleibt er stehen. Ein Test für diesen Rand fehlt. |
| C-5 | Minor | tests/e2e/features (keine Änderung) | Die Korrektur ändert, was die Rechnungsseite zeigt, aber kein Szenario prüft das. Der Satz `invoices_service_period_days` kommt in keinem Szenario vor, auch nicht beim Fall des Tanks aus #1469 (`grep -rn "Nur die Tage" tests/e2e` findet nichts). Das Szenario von #1478 deckt die Abrechnung ab, die Rechnungsseite nicht. Ich bewerte das als Minor: Das Fehlen besteht schon auf der Basis, und der DOM-Test zeigt das Verhalten auf der tiefsten Ebene, die es zeigen kann. |

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - `bunx vitest run src/__tests__/invoice-pages.dom.test.ts`: 136 bestanden; der erste neue Test war vor der Korrektur rot; ohne den Guard `fuel` wird der zweite rot
  - `bun run check`, `bun run lint`, die Commit-Hooks
- Durch Lesen bestätigt: Ohne `!fuelDelivery` wäre der erste neue Test rot. Ohne `!!fuel` wäre der zweite rot.
- Nicht bestätigt:
  - Ob `categories` aus `invoiceChoices` zur Laufzeit `isFuel` tragen. `localCategory` und `src/lib/server/category.ts:31` legen es nahe. Einen Vertrag in `tests/contracts` für `categories?limit=all` habe ich nicht geprüft.
  - Ob `tank` (die Kategorie der letzten Ablesung, `src/lib/server/invoice.ts:29`) dem Tankbestand der Periode im Backend entspricht. Das Vorgehen besteht schon vorher und wird hier nicht geändert.

Geprüft: Delta in `+page.server.ts`, `+page.svelte`, `InvoiceFacts.svelte`, `invoice-pages.dom.test.ts` und `implementation_plan.md`; keine neuen Texte und keine neuen Bildschirme; Fall #1474 ohne `tank` unverändert (`!!tank`); ponytail-review: Lean already.
