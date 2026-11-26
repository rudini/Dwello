# Code-Review 1478-feature, Runde 1 (e3a39ad..15f39b7)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Blocker | src/lib/invoice.ts:36-45, src/routes/invoices/[id]/InvoiceFacts.svelte:20,50-55 | `otherFuelDelivery` schliesst die Kategorie des Tanks nicht aus. Eine eintägige Rechnung **in der Kategorie des Tanks** (die immer `isFuel` ist) zeigt jetzt «Zählt als Lieferung von Heizmaterial, nicht in den Tank … Für diese Kategorie gibt es keinen Tankbestand …» und direkt darunter «Zählt als Lieferung in den Tank.» |
| C-2 | Minor | tests/e2e/steps/invoice-detail.steps.ts:288-289 | Der neue Step steht zwischen dem Kommentar `// after the amount as positive anchor (#1469)` und dem Step `sagt die Rechnung nichts zum Tank`, zu dem der Kommentar gehört. Jetzt beschreibt er den falschen Step. |
| C-3 | Minor | src/__tests__/invoices.test.ts:267-279 | Der umgeschriebene Test prüft nur noch, dass `toInvoice` `category.isFuel` durchreicht. Das leistet `toCategory` (`src/lib/server/category.ts:31`) schon auf der Basis, der Test kann also ohne die Änderung nicht rot werden. Keine der Commit-Messages (ab913ad, 15f39b7) nennt ihn als Pin von bestehendem Verhalten. |

## C-1: Lieferung in den Tank zeigt auch den Hinweis «nicht in den Tank»

**Warum falsch:**
- Laut Docstring (`src/lib/invoice.ts:34`) gilt die Funktion für eine Rechnung «of another fuel category». Der Code prüft aber nur `!!tank && isValidUtilityCost && category.isFuel && start === end`.
- Einen Tankbestand gibt es nur in einer Kategorie, die umlagefähig und als Brennstoff markiert ist (`backend/src/services/fuel-stock.service.ts:143-150`, `isFuelCategory`). Das Flag lässt sich danach nicht mehr entfernen (`category.service.ts:191`, `CATEGORY_FUEL_HAS_STOCK`).
- Darum ist die Kategorie aus `tank` immer `isFuel: true`. Für jede eintägige Lieferung in den Tank sind dann `fuelDelivery` und `delivery === true` beide wahr.
- `InvoiceFacts.svelte:50` zeigt dann `invoices_fuel_delivery`, und `tankHint()` zeigt `invoices_tank_delivery`. Das ist der Hauptfall von #1469: Die Seite sagt dem Verwalter zugleich, dass die Rechnung in den Tank zählt, nicht in den Tank zählt und dass es keinen Tankbestand gibt.
- Vor dieser Änderung war der Fehler unsichtbar: `fuelDelivery` blendete nur «Nur die Tage …» aus, was `delivery === true` ohnehin tat. Erst der neue Text macht ihn sichtbar.
- Das Backend schliesst die Kategorie des Tanks dagegen aus. In `invoice.service.ts:589` steht `invoice.categoryId === tank?.categoryId || (…isFuel…)`, und `kind` und `tankDelivery` unterscheiden zwischen `true` und `'fuel'`.

**Warum die Tests es nicht zeigen:**
- In den DOM-Tests von «Lieferung in den Tank» (`src/__tests__/invoice-pages.dom.test.ts:552-575`) hat die Tank-Kategorie `c1` die Angabe `isFuel: false` (`unset`, Zeile 52). In der App kommt das nicht vor.
- Im Szenariogrundriss `invoice-detail.feature:245-254` (Zeile `2025-03-10`) prüft der Step nur `invoice-tank-hint`. Er bleibt grün, obwohl daneben `invoice-fuel-hint` steht.

**So zeigt man den Fehler:**
- DOM-Test: `show(InvoicePage, { data: { invoice: invoice({ servicePeriodStart: '2025-03-10', servicePeriodEnd: '2025-03-10', category: { ...categories[0], isFuel: true } }), tank: 'c1' } })`.
- Erwartet wird, dass `byTestId('invoice-fuel-hint')` `null` ist. Heute ist das Element vorhanden.
- In E2E: ein neues Szenario für die Kategorie des Tanks mit eintägigem Leistungszeitraum, das sagt, die Rechnung sage nichts zur Lieferung von Heizmaterial. Das bestehende Szenario auf `main` bleibt unverändert.

**Fix:**
- In `otherFuelDelivery` die Bedingung `invoice.categoryId !== tank` ergänzen. Dafür `categoryId` in den `Pick` aufnehmen.
- Alternativ in `InvoiceFacts` `fuelDelivery` nur bei `delivery === undefined` setzen.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - `bun run lint`, `bun run check`
  - `bun run fitness -- --base origin/main --structure`
  - Backend: `bun run type-check`, `bun run test` (2454 pass vor dem Umzug von `isFuel`, danach `api-contracts.pg.test.ts` und `fuel-stock.pg.test.ts` 188 pass)
  - `bunx vitest run --changed origin/main`
  - E2E chromium+api auf invoice-detail, statement-detail und statement-generate (337 passed)
  - Prettier, Commit-Hooks
- Ebenfalls vom Aufrufer gemeldet: die Rot-Läufe der Render-Tests V-6 und V-7, des DOM-Tests V-10 und des api-contracts-Tests. Nach dem Lesen würde jeder davon ohne die Änderung fehlschlagen.
- Ob «Holz» in `{categories}` doppelt erscheinen kann: `fuelDeliveryText`, `pdf-cost-table.ts:241-244`, fügt die Kategorie jeder Position an, ohne Dubletten zu entfernen. Ich habe nicht geprüft, ob eine Kategorie in `lineItems` mehr als eine Position haben kann, etwa mit zwei Verteilschlüsseln. Kein Test deckt das ab.

Geprüft:
- Die Wortlaute von V-6, V-7 und V-10 stimmen in de, fr, it und en mit `docs/reviews/1478-fachreview-2.md` überein.
- `fuelIntroDeliveryFuel` ersetzt `fuelIntro` auch in der Höhenberechnung.
- Der Contract `invoice.json` hat `category.isFuel`; `invoice-list.json` hat kein `category`.
- Das alte Top-Level-`isFuel` wird nirgends mehr gelesen. `toInvoice` reicht `isFuel` über `toCategory` durch.
- Das neue Szenario ist Screenplay-konform (Target, Question `Text.of`, Step).
- Die geänderten Schritte in statement-detail sind neu auf dem Branch.
- Für den reinen Hinweistext ohne eigene Bedienelemente braucht es keine neue Zeile in `screens.json`.
