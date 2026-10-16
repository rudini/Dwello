# Code-Review 3 (Abschluss): Hinweise der Rechnungsprüfung, Fixes aus Runde 2

Gegenstand: eigener Commit 90441e0 (`git show 90441e0`) im Worktree `review-hints-code3`, dazu der Merge c0ed280 (origin/main) auf seine Wirkung auf den a11y-Zustand `invoice-hints`. Gelesen: alle Dateien aus 90441e0 (pg-Test, `docs/api-specification.md`, `implementation_plan.md`, Feature, Question, Steps; Persona-Bericht `helga-invoice-hints-2.md` und `hints-review-2.md` als Belege), dazu `invoice-completeness.service.ts:235-258` (`withoutServicePeriod`), `tests/e2e/fixtures/backend.ts:29-31,275-278` (`predefinedCategory` nach `nameDE`, `seed.fuelStock` mit Kategorie «Heating»), `statement-detail.steps.ts:212` (Schritt Tankbestand), `targets/statement-generate.ts:56-66`, `tests/e2e/CLAUDE.md:74` (Negativprüfungen), Merge-Diff `tests/e2e/tasks/accessibility.ts`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-12 | Minor | `invoice-completeness.service.ts:250-253` | Aus Runde 2 unverändert offen (Heizöl ohne erfassten Tankbestand bleibt im Hinweis); laut Aufrufer bewusst als Minor im Bericht belassen |

Keine neuen Befunde. Ponytail: Lean already. Ship. (Eine Question, ein Schritt, ein Szenario; die Verschiebung der pg-Tests ist reine Einrückung.)

## Stand der Befunde aus Runde 2

- **C-10 (Major) behoben.** Szenario «Heizöl für den Tank steht nicht im Hinweis auf Rechnungen nach der Abrechnungsperiode» (`statement-generate.feature:162-169`), ohne `@wip`. Tankbestand per `seed.fuelStock` in der Kategorie «Heating», die Lieferung per `invoiceOn(…, "Heizung", …)` über `nameDE`, also dieselbe Kategorie: der Filter `notInArray(categoryId, fuelStocks…)` greift. Positiver Anker (Kaminfeger, 20.01.2025) in derselben Liste vor der Negativprüfung, wie `tests/e2e/CLAUDE.md:74` verlangt; die Negativprüfung fragt die Anzahl der Zeilen mit «15.01.2025» im Hinweis (`countOfLateInvoicesOn`, `Count.of`, Wert statt ja/nein). Ohne den `or(…)`-Filter stünde die Heizöl-Rechnung vom 15.01.2025 (innerhalb 90 Tagen, ohne Leistungszeitraum, umlagefähig) im Hinweis: Anzahl 1, rot. Deckt sich mit dem gemeldeten Rot (Expected 0, Received 1). Feature-Text ohne UI-Wörter; Schritt ruft nur eine Question (Screenplay eingehalten).
- **C-11 (Minor) behoben.** `api-specification.md:122` nennt `description` in den Listen und die Ausnahme der Kategorie des Tankbestands.
- **C-13 (Nit) behoben.** Beide Tests im `describe('Hinweise mit eigenem Gebäude')`; Inhalt unverändert (nur Einrückung). Die Bitte war, den #130-Test in den passenden `describe` der Befunde pro Kategorie zu legen; ein eigener `describe` ist ebenso vertretbar, kein neuer Befund.
- **C-12 (Minor)** offen, siehe Tabelle.

## Merge c0ed280

Der Merge ändert in `tests/e2e/tasks/accessibility.ts` nur die Upload-Zustände (`startUpload` ersetzt durch `uploadBelege(example.building, …)`, Importe angepasst). Die Zeile `'invoice-hints': (example) => previewOf('2025', 'late-invoices', '2025-05-31')(example)` (`accessibility.ts:299`) und `previewOf` sind unberührt; die entfernten Importe (`Upload`, `uploadBuildingSelect`, `uploadFileInput`, `uploadInvoicesButton`, `File`) werden vom Zustand `invoice-hints` nicht benutzt. Kein Einfluss auf den Zustand dieses Slices erkennbar.

## Nicht bestätigt

- Backend `bun test src/__tests__/invoice-completeness.pg.test.ts` (10 pass), E2E «Heizöl für den Tank» (rot ohne Filter, grün mit), eslint `tests/e2e`: **vom Aufrufer gemeldet**, nicht wiederholt (E2E darf ich nicht starten; Rot durch Lesen bestätigt, siehe C-10).
- Auf e814447: lint, check, type-check, vitest, `statement-generate.feature` 30 passed, a11y/Sprachzeilen `invoice-hints` 4 passed: **vom Aufrufer gemeldet**. Nach dem Merge wurden die a11y-Zeilen `invoice-hints` nicht erneut ausgeführt; durch Lesen kein Bruch (siehe Merge).
- Dass die Standardkategorie «Heating» das `nameDE` «Heizung» trägt: aus dem Szenario-Grün des Aufrufers abgeleitet, Seed-Daten nicht nachgelesen.
- `bun run check` / `lint` auf 90441e0 (neuer Import `countOfLateInvoicesOn`): nur eslint `tests/e2e` vom Aufrufer gemeldet; `Count` war in der Question-Datei bereits importiert.
