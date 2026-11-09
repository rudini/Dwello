# Code-Review 1309-7 (Abschlussrunde CI-Fix, `238ddf05..dee96209`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/services/invoice.service.ts:70, tests/contracts/invoice.json:32 | `selectWithDetails` liefert `distributionKey.formula` jetzt in jeder Rechnungs-Antwort (`GET /invoices`, `/invoices/:id`, Rechnungen einer Abrechnung …). Der Vertrag `tests/contracts/invoice.json` nennt das Feld nicht (der Drift-Test prüft nur eine Teilmenge und bleibt deshalb grün), und der Typ in `backend/src/api/invoice.ts:29` führt es als optional, obwohl es immer geliefert wird. CLAUDE.md, Gotchas: Ändert sich eine API-Antwort, wird ihr Vertrag nachgeführt. |
| C-2 | Minor | backend/src/services/apartment.service.ts:384-389, statement-invoices.service.ts:71 | Kein Test führt die Prüfung der Listen über `apartmentsByBuilding` mit einer aufgehobenen Wohnung oder einer früheren Fläche. Die Tests zu #1336/#1301 in `statement-key-failure.pg.test.ts:356-430` laufen über `/invoices/completeness` (direkter Pfad, `apartmentsOf`), nicht über `/statements/outdated` oder das Dashboard. Die Werte stimmen nach dem Lesen trotzdem: Beide Pfade nutzen `keyValues`, und dieselbe Wohnungsmenge kommt bei FK und innerJoin heraus. Nur die Reihenfolge ist anders (ohne `orderBy`). Das spielt keine Rolle, weil die Listen nur `uncalculableKeys.length > 0` bzw. `'key'` auswerten und nicht die genannte Wohnung. Trotzdem bleibt die neue Abfrage ohne eigenen Test. |

Keine Blocker, keine Major.

Geprüft:
- Gemeinsame Ablesungen: `periodReadings` hat dieselben Argumente wie vorher, und weder `getInvoicesForStatement` noch `fuelStockChange` verändern das Ergebnis.
- `stock`: Das Ergebnis von `agreedStockOf(change, agreedCategoryIds)` gleicht `agreedStock` je Abrechnung, weil `agreedCategoryIds` erst nach dem geteilten `fuelStockChange` angewendet wird.
- `keys`: `bills` und `change` sind dieselben Aufrufe wie im direkten Pfad.
- `{units}`-Abkürzung: Sie ist exakt. `distributionAmong` setzt `units: 1`, die Formel ergibt also nie einen negativen Wert, nie überall null und keine Division. Ohne Wohnungen kam auch vorher `[]` heraus.
- Formel aus dem Join statt `calculateBuildingDistribution(keyId)`: gleiches Ergebnis. «no formula» ergab schon vorher «OTHER». Ein Schlüssel, den es nicht gibt, ist durch den FK ausgeschlossen (`distributionKey!` setzt das schon voraus). Die Lieferung aus `getInvoice` nutzt ebenfalls `selectWithDetails` und hat die Formel.
- Übrige Aufrufer (`statement.service.ts:957`, `invoice-completeness.service.ts:400`) laufen unverändert über `apartmentsOf`.
- Ratchet und Doku-Zahlen (67/21) stimmen mit dem Diff überein.
- ponytail-review: keine ungenutzten Reste, keine Kopie eines bestehenden Helfers.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: lint, check, fitness, Backend type-check, Backend `bun run test` (2215, mit Coverage, vor der Typänderung `formula?`), vitest (4699), `bun tools/fitness/p2-benchmark.ts --queries` (outdated 21), E2E chromium statement-detail, statement-generate, dashboard, reports (322).
- Die Abfragezahl 21 und die Zahl 67 des Dashboards habe ich nicht nachgezählt. Gelesen habe ich nur `tools/fitness/ratchet.json` und `docs/architecture/fitness-functions.md`.
