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
- [x] code-reviewer round 1: `docs/reviews/reminders-review-1.md`
- [x] persona Helga: `docs/design/personas/helga-issue-107-193-194.md`
- [x] fach-reviewer round 2: `docs/reviews/reminders-fachreview-2.md`
- [x] daten-pruefer: `docs/reviews/reminders-datenpruefung-1.md`
- [x] review fixes: no next reminder date once paid (C-1/V-13), test after the 3rd (C-2), re-marking on a later day (C-4), `docs/api-specification.md` (C-3), one `swissDate` (C-8), «Als versendet markieren» names the letter and offers its remade PDF (V-14, P-4; `documents/+page.server.ts`, `MarkedSentNotice.svelte`, state `documents marked-sent`), overview subtracts only overdue statements (V-16, C-6), «sends a reminder» waits for its outcome (E2E race)
- [x] code-reviewer round 2: `docs/reviews/reminders-review-2.md`; persona Helga re-run on the notice: `docs/design/personas/helga-issue-107-193-194-2.md`
- [x] round-2 fixes: scenario step for the notice (C-11), notice in a live region with its button as the Alert action (C-12, C-17), no «Keine Briefe zu versenden» beside it (Helga P-1), `marked-sent` not in the seed list (C-16); the filter links' ternaries moved into `filters` because the fallow gate counted them against the documents template (C-13)
- [x] code-reviewer round 3: `docs/reviews/reminders-review-3.md` (no Blocker/Major); new step seen red without the notice
- [x] workflow notes: `docs/reviews/workflow-notes-issue-107-193-194.md`
- [ ] full E2E (chromium, api) on the final commit
- [ ] plan archived
