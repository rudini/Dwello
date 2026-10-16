# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: statement position ↔ invoices (#96) and statement detail like the PDF (#104)

- [ ] #96 Each statement position stores the invoices it billed (id, amount, days in the period): migration, schema, calculation, `docs/data-model.md`; pg test reads them after generating
- [ ] #96 The statement detail's hint counts invoices of the period that are new, changed or gone since, from the stored link (no timestamps); tests for each case and for «no hint»
- [ ] #96 «Rechnung schon abgerechnet» / «Nicht in den Abrechnungen» from the stored link; scenario for a changed invoice
- [ ] #104 Statement detail: tenancy dates in the period, Wohnungsanteil and Zeitanteil per line, total «Ihre Nebenkosten», each line links to its invoices (with their days where they differ, #240)
- [ ] fach-reviewer on the @wip scenarios before implementing
- [ ] Slice reviews, feature review (personas, fach-reviewer, daten-pruefer), a11y screens
- [ ] Contracts, lint, check, type-check, affected tests and E2E
