# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session 2026-10-16 W4b: payment of a statement (#138, #93, #92)

- [ ] @wip scenarios (statement-detail.feature), fach-reviewer before implementing
- [ ] #138: Zahlungsdatum not before the Abrechnungsdatum, not after today, a real calendar date; backend refuses with codes `PAID_DATE_INVALID`, `PAID_DATE_BEFORE_STATEMENT`, `PAID_DATE_IN_FUTURE` (four languages, api-specification, error-codes.pg.test); BFF checks the same with the bound and shows backend refusals with `backendMessage`
- [ ] #93: setting a statement to paid stores its Saldo as `paid_amount` when no amount is given; `paidThisMonth` counts only Nachzahlungen; dashboard.pg.test without hand-written `paid_amount`; demo-data.pg.test adjusted. No scenario: `paid_amount` and `paidThisMonth` appear on no screen
- [ ] #92: «Zahlung zurücksetzen» on a paid statement, confirmed with its consequence; back to Versendet (Überfällig after the Zahlungsfrist), paid date and amount cleared; the reset stored and listed in the Verlauf (new table, migration)
- [ ] a11y and language rows for the new dialog state
- [ ] Slice reviews, feature review (persona, fach-reviewer, daten-pruefer if amounts)
- [ ] Workflow notes, archive the session, pull request
