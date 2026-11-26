# Code-Review 1478-feature, Runde 2 (15f39b7..ff8e471)

Keine offenen und keine neuen Befunde.

Geschlossen: C-1, C-2, C-3

- C-1: `otherFuelDelivery` (`src/lib/invoice.ts:44`) schliesst jetzt mit `invoice.categoryId !== tank` die Kategorie des Tanks aus. Damit stimmt die Funktion mit dem Backend überein (`invoice.service.ts`, `tankDelivery` `true` gegen `'fuel'`). Der neue DOM-Test (`src/__tests__/invoice-pages.dom.test.ts:598-602`) prüft eine eintägige Rechnung mit `categoryId` `c1` (Vorgabe von `invoice()`, Zeile 70), `isFuel: true` und Tank `c1`. Ohne den Fix wäre `invoice-fuel-hint` vorhanden und der Test rot. Der Aufrufer meldet diesen Rot-Lauf. Es gibt nur einen Aufrufer der Funktion (`InvoiceFacts.svelte:20`), und dieser übergibt die ganze Rechnung, also ist `categoryId` vorhanden.
- C-2: Der Kommentar steht wieder über dem Step `sagt die Rechnung nichts zum Tank`.
- C-3: Die Commit-Message von ff8e471 nennt den Lade-Test aus ab913ad als Pin von bestehendem Verhalten (`toCategory`). Er ist kein Bugfix.

Geprüft: `fuelDeliveryText` (`backend/src/services/pdf-cost-table.ts:241-244`) entfernt jetzt doppelte Kategorienamen. Die Funktion wird in `sharesNote` und in `pdf-heating.ts:59` verwendet. Der neue Render-Test (`statement-pdf-render.test.ts:741-747`) hat zwei Positionen «Holz». Mit dem alten Code ergäbe er «Holz, Holz» und wäre rot.

Für C-1 braucht es kein neues E2E-Szenario. Der Fehler entstand erst auf diesem Branch und war auf `main` nie sichtbar. Der DOM-Test zeigt ihn auf der tiefsten Ebene.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - `bun run lint`, `bun run check`
  - `bun run fitness -- --base origin/main --structure` (0 Fehler)
  - `bunx vitest run src/__tests__/invoice-pages.dom.test.ts` (139 passed)
  - Backend: `bun test src/__tests__/statement-pdf-render.test.ts` (212 pass)
  - Commit-Hooks
  - Rot-Läufe des neuen DOM-Tests und des neuen Render-Tests
- Für ff8e471 nicht gemeldet:
  - Backend `bun run type-check`
  - `bunx vitest run --changed origin/main`
  - die E2E-Szenarien von invoice-detail
- Die Persona-Berichte (`docs/design/personas/marco-1478-2.md`, `weber-1478-2.md`) und `implementation_plan.md` habe ich nur als Dokumente gelesen. Ihre Befunde (P-5, P-6 Minor) gehören nicht zu diesem Code-Review.
