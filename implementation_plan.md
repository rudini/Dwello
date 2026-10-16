# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: statement position ↔ invoices (#96) and statement detail like the PDF (#104)

- [x] #96 Each statement position stores the invoices it billed (id, description, amount and days in the period; the change of the Tankbestand with `fuelStock`): migration `0010_line_item_invoices.sql`, `schema.ts`, `calculation.service.ts`, `statement.service.ts`, `docs/data-model.md`; `statement-invoices.pg.test.ts`
- [x] #96 The statement detail's hint counts invoices of the period recorded, changed or deleted since, from the stored link (`statement-invoices.service.ts`, `GET /statements/:id/changed-invoices`, `+page.server.ts`); pg tests for new, changed amount, changed category, deleted, made non-allocable, none, statement without stored link
- [x] #96 «Rechnung schon abgerechnet» / «Abrechnungen nicht aktuell» from the stored link (`GET /invoices/:id/statements`, `src/lib/server/invoice.ts`); scenario «Warnung bei einer nach der Abrechnung geänderten Rechnung»
- [x] #104 Statement detail: tenancy dates in the period (`PartiesPanel.svelte`), Wohnungsanteil and Zeitanteil per line, total «Ihre Nebenkosten» (`CostTable.svelte`), each line links to its invoices, with their days where they differ (`LineInvoices.svelte`, #240); mapper `src/lib/server/statement.ts`, `src/lib/types.ts`
- [x] Texts in `messages/{de,fr,it,en}.json`; contracts `statement.json`, `statement-changed-invoices.json`, `invoice-statements.json`; `docs/PRD-Dwello.md`
- [x] fach-reviewer on the @wip scenarios before implementing: `docs/reviews/w1b-fachreview-1.md`
- [x] Slice review round 1: `docs/reviews/w1b-review-1.md`
- [x] fach-reviewer round 2: `docs/reviews/w1b-fachreview-2.md`
- [x] Personas: `docs/design/personas/marco-w1b.md`, `docs/design/personas/dr-weber-w1b.md`
- [x] Fixes (V-15/C-1 statements before #96 by time as before; V-16/C-2 Zeitanteil in days like the PDF; C-3 screen `statement-parts-detail` in the axe and language checks, and the rounding rows of the cost table as valid `<dl>`; C-4 Tankbestand pg test; C-6, C-8, C-10, C-12; Marco P-1 Zeitanteil «nach Heizprofil»; M-3/Dr. Weber P-1 refund wording; V-14, V-17, P-6); issue #307 for a changed Tankbestand
- [x] Slice review round 2: `docs/reviews/w1b-review-2.md`; C-17 scenarios for the Zeitanteil in days and by heating profile
- [ ] daten-pruefer, closing code-reviewer round (merge with main, C-17)
- [ ] Contracts, lint, check, type-check, affected tests and E2E before the push
