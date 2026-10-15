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
- [x] code-reviewer
  - code-reviewer round 1 (`docs/reviews/issue-126-review-1.md`): open none, fixed C-1 (Major; «senden Sie die Mahnung erneut» would create the next Mahnstufe: the text now says print, post, mark as sent; tests expect it, red with the old text), C-2 (Minor; «email» in en), C-3 (Minor; the pg test checks the server's text in the log), C-4 (Minor; the second pg case uses the document of the first), C-5 (Minor; the deviation from the issue's «mail settings» named in the pull request), C-6 (Nit), C-7 (Nit; TENANT_NO_EMAIL recorded before the try)
- [x] fach-reviewer
  - fach-reviewer round 1 (`docs/reviews/issue-126-fachreview-1.md`): open none, fixed V-1 (Minor; on the statement the place comes first: `statements_reminder_undelivered` «{title} liegt in den Dokumenten zum Versand bereit. {reason}»), V-2 (Minor; «unter «Dokumente» als versendet»), both with the DOM and unit tests red first; V-3 (Minor, before the change: the letter's deadline counts from its creation day) as issue #193; outside #126: no minimum gap between Mahnstufen is issue #107
- [x] Personas
  - persona helga round 1 (`docs/design/personas/helga-issue-126.md`): fixed P-1 (Minor; same as C-1), open P-2 (Minor), P-3 (Nit) as `offene-punkte.md` O-22
  - persona helga round 2 (`docs/design/personas/helga-issue-126-2.md`): fixed P-1 (Minor; same as V-2), open P-2 (Minor: a posted reminder still reads «per E-Mail») as issue #194, P-3 (Nit) as O-22
- [x] Workflow review `docs/reviews/workflow-rules-review-issue-126.md`
- [ ] PR, CI, merge

Files: `backend/src/services/document.service.ts`, `reminder.service.ts`, `backend/src/__tests__/reminders.pg.test.ts`, `src/lib/backend-error.ts`, `src/__tests__/backend-error.test.ts`, `statement-pages.dom.test.ts`, `messages/*.json`, `docs/api-specification.md`
