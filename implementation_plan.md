# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: Reminder deadlines and posting (#107, #193, #194)

- [x] #107: scenario «Nächste Mahnung erst nach der Zahlungsfrist der letzten» (`statement-reminder.feature`) replaces «Zweite Mahnung» (the E2E clock cannot age a reminder past its deadline: the allowed 2nd Mahnung is a `reminders.pg.test.ts` case)
- [x] #107: `documents.payment_deadline` (`0007_reminder_payment_deadline.sql`, backfilled from the Swiss creation day, `schema.ts`, `docs/data-model.md`); statement responses carry `nextReminderFrom` (none after the 3rd)
- [x] #107: coded refusal `REMINDER_TOO_EARLY`, `backend_reminder_too_early` in all four languages, dates in Swiss format (`backend-error.ts`); pg tests refused and allowed
- [x] #107: reminder rows show their Zahlungsfrist (`DocumentItem.svelte`, marker #277); detail page hides «Mahnung senden» and shows «Nächste Mahnung möglich ab» (`StatusActions`, `PaymentPanel`); list row (`StatementRow`); the overview leaves out a statement while a Mahnung's Zahlungsfrist runs (`overview.ts`, unit test: the overview count cannot be isolated in E2E)
- [x] #193: marking a reminder as sent remakes its letter with today's date and deadline (`markDocumentPosted`); No scenario: needs the backend clock to move between creating and posting (`reminders.pg.test.ts` with a set clock). Texts now say: mark as sent on the day of posting, then print (`documents_purpose`, `dashboard_task_letters_text_*`, `backend_mail_delivery_failed`, `help_payments_4`, `statements_reminder_by_letter`)
- [x] #194: scenario «Nach gescheiterter E-Mail per Post versendete Mahnung gilt als Brief»; pg test
- [x] fach-reviewer round 1 on the @wip scenarios: `docs/reviews/reminders-fachreview-1.md`
- [x] contracts `statement.json`, `documents.json`; axe and language rows `statement-reminded-detail`
- [x] Workflow note: «failing request» is not the only state E2E cannot reach: `tests/e2e` has no way to age a stored record (a reminder's deadline), so «Zweite Mahnung» had to move to a pg test
- [ ] code-reviewer round 1
- [ ] feature review: personas, fach-reviewer, daten-pruefer
- [ ] plan archived
