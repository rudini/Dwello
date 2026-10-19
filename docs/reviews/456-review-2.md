# Slice-Review #456, Runde 2 (Abschlussrunde): Link vom Gebäude zu seinen Rechnungen

Bereich: `8c0ebca2..b523a282` (ein Commit, `b523a282 fix(buildings): reuse the invoices link text`), ohne `docs/reviews`, `docs/design/personas` und `implementation_plan.md`. Worktree: `/tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/review-456-2`. Gelesen habe ich alle sieben geänderten Dateien des Deltas.

## Status der Befunde aus Runde 1

| ID | Schwere | Status | Beleg |
|----|---------|--------|-------|
| C-1 | Minor | erledigt | `src/routes/buildings/[id]/+page.svelte:38` nutzt `m.dashboard_invoices()`, wie `invoicesOf` in `src/lib/overview.ts:115`. `buildings_invoices` ist in allen vier `messages/*.json` gestrichen. `dashboard_invoices` (Zeile 262) hat in allen vier Sprachen genau den bisherigen Wortlaut. Deshalb ändert sich kein sichtbarer Text, und `buildings-pages.dom.test.ts:214` («Rechnungen ansehen») gilt unverändert. |
| C-2 | Nit | erledigt | `tests/e2e/tasks/building-detail.ts:14`: `invoicesButton` steht jetzt alphabetisch zwischen `fuelStockRows` und `saveFuelStockButton`. |
| C-3 | Nit | erledigt | `tests/e2e/steps/building-detail.steps.ts:13`: Der Import aus `../questions/invoices` steht bei den anderen Question-Imports, vor den Task-Imports. |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-4 | Nit | `implementation_plan.md:112` | Ausserhalb des Review-Bereichs, nur als Hinweis: Der abgehakte Plan-Eintrag nennt noch `buildings_invoices` und «four languages». Es ist die einzige verbliebene Erwähnung des Schlüssels ausserhalb von `docs/reviews`. Vor dem Archivieren der Session auf `dashboard_invoices` (wiederverwendet) anpassen. |

Kein Blocker, kein Major.

## Geprüft und bestätigt

- **Keine Referenz mehr auf `buildings_invoices`:** `grep -rn buildings_invoices` im Worktree (ohne `node_modules`, `src/lib/paraglide`, `.git`) findet nur `implementation_plan.md:112` (C-4) und den Bericht der Runde 1. Code, Tests und Messages enthalten den Schlüssel nicht mehr. Damit fehlt in keiner Sprache ein Schlüssel, und kein Schlüssel ist verwaist.
- **Keine Verhaltensänderung:** Der Wortlaut ist identisch (de «Rechnungen ansehen», fr «Voir les factures», it «Vedere le fatture», en «View invoices»). `href`, `testid` und `icon` bleiben unverändert. Das Szenario `building-detail.feature:40-43` und der Target `building-invoices-button` sind nicht betroffen. Ein neues Szenario oder ein Rot-Lauf ist deshalb nicht nötig.
- **Nichts Fremdes im Delta:** Die sieben Dateien gehören zu C-1 bis C-3. Andere Zeilen sind nicht umformatiert.
- **ponytail-review:** Das Delta ist netto −4 Zeilen und lässt nichts Ungenutztes zurück.
- Die Persona-Befunde P-1 bis P-3 (Helga) sind laut Aufrufer nicht Teil dieses Deltas und wurden hier nicht geprüft.

## Nicht bestätigt

- `bun run lint` (0) und `bun run check` (0 Fehler) auf b523a282: vom Aufrufer gemeldet.
- `bunx vitest run src/__tests__/buildings-pages.dom.test.ts src/__tests__/i18n.test.ts` (60 bestanden): vom Aufrufer gemeldet. Ich habe den Lauf nicht wiederholt. In Runde 1 scheiterte er im Review-Worktree an fehlenden `node_modules`. Dass der Test bestehen muss, habe ich am Code geprüft: gleicher Wortlaut von `dashboard_invoices`.
- E2E für dieses Delta: wurde nicht gemeldet und nicht gestartet. Da Target und Wortlaut unverändert sind, erwarte ich keine Auswirkung. Belegt ist das nur durch Lesen.
