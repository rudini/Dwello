# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: statement position ↔ invoices (#96) and statement detail like the PDF (#104)

- [x] #96 Each statement position stores the invoices it billed (id, description, amount and days in the period; the change of the Tankbestand with `fuelStock`): migration `0008_line_item_invoices.sql`, `schema.ts`, `calculation.service.ts`, `statement.service.ts`, `docs/data-model.md`; `statement-invoices.pg.test.ts`
- [x] #96 The statement detail's hint counts invoices of the period recorded, changed or deleted since, from the stored link (`statement-invoices.service.ts`, `GET /statements/:id/changed-invoices`, `+page.server.ts`); pg tests for new, changed amount, changed category, deleted, made non-allocable, none, statement without stored link
- [x] #96 «Rechnung schon abgerechnet» / «Abrechnungen nicht aktuell» from the stored link (`GET /invoices/:id/statements`, `src/lib/server/invoice.ts`); scenario «Warnung bei einer nach der Abrechnung geänderten Rechnung»
- [x] #104 Statement detail: tenancy dates in the period (`PartiesPanel.svelte`), Wohnungsanteil and Zeitanteil per line, total «Ihre Nebenkosten» (`CostTable.svelte`), each line links to its invoices, with their days where they differ (`LineInvoices.svelte`, #240); mapper `src/lib/server/statement.ts`, `src/lib/types.ts`
- [x] Texts in `messages/{de,fr,it,en}.json`; contracts `statement.json`, `statement-changed-invoices.json`, `invoice-statements.json`; `docs/PRD-Dwello.md`
- [x] fach-reviewer on the @wip scenarios before implementing: `docs/reviews/w1b-fachreview-1.md`
- [ ] Slice review (code-reviewer), feature review (personas, fach-reviewer, daten-pruefer)
- [ ] Contracts, lint, check, type-check, affected tests and E2E before the push
