# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-15 (2): bug #126, failed reminder e-mails show the raw SMTP error

Task: open `bug` issues one by one (#122, #123, #125 merged in rudini/Dwello#181, #182, #189); now #126. Skipped while labelled `entscheiden`: #93, #124, #130, #131, #136, #138, #141.

- [x] No scenario: server-side failure (between the backend and the mail server; the E2E mail catcher accepts every address)
- [x] Backend: any other delivery failure stored as `MAIL_DELIVERY_FAILED`, the transport's text logged; old documents with an unknown text read as `MAIL_DELIVERY_FAILED`; `reminders.pg.test.ts` with an SMTP stand-in that refuses an address. Test red: «legt die Mahnung mit einem Code statt dem Text des Mailservers zum Versand bereit» – deliveryErrorCode null, the server's 550 text stored; «nennt auch für eine früher gespeicherte Fehlermeldung …» – received null
- [x] Frontend: `deliveryErrorText` never shows the stored text; unit test. Test red: «zeigt statt des Texts des Mailservers die Meldung …» – received «550 5.1.1 User unknown»; `statement-pages.dom.test.ts` pinned the raw text in the reminder feedback and now expects the message
- [x] Message `backend_mail_delivery_failed` (without «E-Mail-Einstellungen»: the user has none, the operator sets up mail) in de/fr/it/en; `docs/api-specification.md`
- [x] Skills: tdd, ponytail, ponytail-review
- [x] Checks: test:coverage (2416), lint, check, backend test + type-check, deepcheck:audit, E2E chromium + api statement-reminder, documents (8 passed)
- [ ] code-reviewer
- [ ] Personas
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-126.md`
- [ ] PR, CI, merge

Files: `backend/src/services/document.service.ts`, `reminder.service.ts`, `backend/src/__tests__/reminders.pg.test.ts`, `src/lib/backend-error.ts`, `src/__tests__/backend-error.test.ts`, `statement-pages.dom.test.ts`, `messages/*.json`, `docs/api-specification.md`
