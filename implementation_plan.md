# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: Reminder deadlines and posting (#107, #193, #194)

- [ ] #107: scenario «Nächste Mahnung erst nach der Zahlungsfrist der letzten» (`statement-reminder.feature`) replaces «Zweite Mahnung» (the E2E clock cannot age a reminder past its deadline: the allowed 2nd Mahnung is a `reminders.pg.test.ts` case)
- [ ] #107: `documents.payment_deadline` (migration, schema, `docs/data-model.md`), set from the printed deadline; statement responses carry `nextReminderFrom`
- [ ] #107: coded refusal `REMINDER_TOO_EARLY` with `backend_REMINDER_TOO_EARLY` in all four languages; pg tests refused and allowed
- [ ] #107: reminder history shows each reminder's Zahlungsfrist; detail page and list show from when the next Mahnung is possible; the overview counts no statement before that date (unit test, the overview count cannot be isolated in E2E)
- [ ] #193: marking a reminder as sent remakes its letter with today's date and deadline (No scenario: needs the backend clock to move between creating and posting; `reminders.pg.test.ts` with a set clock)
- [ ] #194: scenario «Nach gescheiterter E-Mail per Post versendete Mahnung gilt als Brief» (`documents.feature`); pg test
- [ ] fach-reviewer on the @wip scenarios before implementing
- [ ] contracts `tests/contracts/*.json`, slice reviews, personas, daten-pruefer, plan archived
