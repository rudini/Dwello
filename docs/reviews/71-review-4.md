# Code-Review 4 zu #71: Fix 1615e9e (C-1 und C-2 aus Runde 3)

Geprüft im Worktree `review-71-code4` (detached auf 1615e9e), Delta `git diff 9da12ef 1615e9e`. Gelesen habe ich alle vier geänderten Dateien: `calculation.service.ts`, `heating-distribution.pg.test.ts`, `docs/reviews/71-review-3.md` und `docs/archive/implementation-plan-verlauf.md`. Dazu im Umfeld: `fuel-stock.service.ts` (`periodReadings`, `fuelStockChange`) und `invoice-completeness.service.ts` (`stockFinding`).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | erledigt | backend/src/services/calculation.service.ts:387-388, :219 | Der Tank wird jetzt an der Periode erkannt (`periodReadings(...).covered`). Ein stillgelegter Tank (Anfangsbestand 0, keine spätere Ablesung) hebt #71 nicht mehr auf. |
| C-2 | erledigt | backend/src/services/calculation.service.ts:206, :388 | Statt einer `Set` gibt es nur noch eine `tankCategory`. |
| C-3 | Minor | backend/src/services/calculation.service.ts:388 | Neuer Randfall: Der Tank ist in Betrieb, aber die Ablesung am Tag vor der Periode fehlt, und es gibt keine Ablesung danach (z. B. nur `2022-12-31`, Periode 2024). Dann ist `covered` false, und eine Tanklieferung mit Leistungszeitraum wird nach ihren Monaten geteilt statt über die Periode. Vorher galt die Ausnahme. Die Vollständigkeitsprüfung meldet die fehlenden Ablesungen (`noTank` false), und die Abrechnung bucht dann ohnehin Einkäufe statt Verbrauch. Deshalb blockiert das den Merge nicht. Ein Test dazu fehlt. |

## Prüfung des Fixes

- **Korrektheit.** Testfall: Periode 2024 mit den Ablesungen `2022-12-31` 700 und `2023-12-31` 0.
  - `opening` ist dann 0, und nach `2023-12-31` gibt es keine Ablesung. Also ist `covered` false, `tankCategory` ist null und `ownDays` ist true.
  - `sharedByInvoices` zählt die Profilmonate Januar bis März für einen Einzug im Mai. Das ergibt 0.
  - `fuelStockChange` liefert ohne `closing` nichts.
  - Das Jahr der Stilllegung selbst bleibt Tank: Der Anfangsbestand ist grösser als 0, oder es gibt eine Ablesung in der Periode.
  - Der bestehende Tank-Test hat einen Anfangsbestand von 500. Für ihn ist `covered` true, die Ausnahme bleibt.
- **Guard `!run.tankCategory ||`.** Er ist nötig. Ohne ihn würde eine Gruppe mit `categoryId` null bei `tankCategory` null als Tankgruppe gelten.
- **`noTank`.** Die Berechnung beachtet die Markierung nicht, `stockFinding` schon. Das ist folgerichtig: `covered` allein sagt, ob die Periode Brennstoff aus dem Tank hat. `noTank` steuert nur, ob die Ablesung verlangt wird.
- **Roter Test.** Ich habe ihn nur durch Lesen geprüft. Ohne die Änderung enthielte `tankCategories` die Kategorie `heatingId`. Dann wäre `ownDays` false und `invoiceParts` null. `line.invoiceParts![0]` würfe also, und `tenantShare` wäre der Anteil des Laufs (0.52 × 1000) statt 0. Der Test schlägt ohne den Fix fehl.
- **Isolation.** `afterEach` löscht `fuelStocks` und `invoices` des Gebäudes (Z. 237-240).
- **Ponytail.** Der Diff ist minimal. Der Import `listFuelStocks` ist entfernt, nichts Unbenutztes bleibt zurück.
- **Dokumentation.** Die Zeile im Verlauf passt. `71-review-3.md` ist der Bericht der Vorrunde und gehört zur Änderung. Nichts im Delta ist fremd.
- **Commit-Betreff.** `fix(statements): no tank exception after shutdown` hält die Konventionen ein (≤ 50 Zeichen).

## Nicht bestätigt

- Backend `bun run test` auf 1615e9e (808 bestanden, Abdeckung 94.4 %): vom Aufrufer gemeldet. Laut Auftrag nicht erneut ausgeführt.
- Lint, `type-check` und fallow auf 1615e9e: vom Aufrufer gemeldet.
- Der neue Test war zuerst rot: vom Aufrufer gemeldet, von mir nur durch Lesen bestätigt (siehe oben).
- C-3: Nicht ausgeführt, nur aus `periodReadings` Z. 42 und `shareOfGroup` Z. 219 abgeleitet.
