# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session 2026-10-16 W4b: payment of a statement (#138, #93, #92)

- [x] @wip scenarios (statement-detail.feature), fach-reviewer before implementing (`docs/reviews/w4b-fachreview-1.md`; V-5 and V-3 → #291, V-9 → #290)
- [x] #138: Zahlungsdatum not before the Abrechnungsdatum, not after today, a real calendar date; backend refuses with codes `PAID_DATE_INVALID`, `PAID_DATE_BEFORE_STATEMENT`, `PAID_DATE_IN_FUTURE` (four languages, api-specification, error-codes.pg.test); BFF checks the same with the bound and shows backend refusals with `backendMessage`
- [x] #93: setting a statement to paid stores its Saldo as `paid_amount` when no amount is given; `paidThisMonth` counts only Nachzahlungen; dashboard.pg.test without hand-written `paid_amount`; demo-data.pg.test adjusted. No scenario: `paid_amount` and `paidThisMonth` appear on no screen
- [x] #92: «Zahlung zurücksetzen» on a paid statement, confirmed with its consequence; back to Versendet (Überfällig after the Zahlungsfrist), paid date and amount cleared; the reset stored and listed in the Verlauf (new table, migration)
- [x] a11y and language rows for the new dialog state
- Files: `backend/migrations/0007_statement_payment_resets.sql`, `backend/src/db/schema.ts`, `backend/src/services/statement.service.ts`, `backend/src/routes/{statements,dashboard}.ts`, `src/lib/{statement,backend-error,types}.ts`, `src/lib/server/{statement,statement-actions}.ts`, `src/routes/statements/` (detail page, StatusActions, MetadataCard, list, mark-paid), `messages/*.json`, `tests/contracts/`, `docs/{api-specification,data-model,PRD-Dwello}.md`, tests, scenarios and a11y rows
- [ ] Slice reviews, feature review (persona, fach-reviewer, daten-pruefer if amounts)
- [ ] Workflow notes, archive the session, pull request
