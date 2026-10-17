# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-17 W8d: e-mail statements (#86, Option 2)

- [x] #86 read (no comments, no implementation issue): the decision is the requirement; #283, #305, #322 do not change its outcome
- [x] @wip scenarios `tests/e2e/features/statement-send.feature` incl. failure states (no e-mail address, mail refused; «not set up»: `No scenario`, the E2E stack always sends to the mail catcher, covered by `statement-mail.pg.test.ts`), seen red at the missing behaviour
- [x] fach-reviewer round 1 before implementing: `docs/reviews/w8d-fachreview-1.md` (V-1 Major fixed: Zahlungsfrist step and pg check; R-1 Major: the provider's country is #82's decision, done by W9c; V-2, V-3, V-7, V-8, V-9, R-2 fixed; V-4, V-5, V-6 to an issue)
- [x] backend: `POST /statements/:id/send` (`statement-send.service.ts`): e-mail with the PDF dated today in the tenant's Sprache, Dokument `type: statement`; letter or `byLetter` only marks sent; a failed e-mail is a coded refusal and leaves «Entwurf»
- [x] frontend: send dialog per channel, failure alert with «Per Brief zustellen», Dokument title in the UI language, the statement's Dokument not counted as Mahnung; help text `help_statements_4`; texts in four languages
- [x] privacy statement: `privacy_third_1` names statements by e-mail and what their PDF holds (country of the provider: #82, W9c)
- [x] screens.json / accessibility.feature / sprachen-bildschirme.feature: `statement-empty-detail` `send-dialog`, `send-refused` (Carla wants e-mail without an address)
- [ ] slice review (code-reviewer), feature review (personas, fach-reviewer, daten-pruefer), plan archived, pull request `Fixes #86`
- Files: `backend/src/services/{statement-send,pdf,reminder-letter,statement-pdf}.service.ts` (`reminder-letter.ts`), `backend/src/routes/statements.ts`, `backend/src/db/schema.ts` (comment), `backend/scripts/mail-catcher.ts`, `src/lib/server/{statement-actions,documents}.ts`, `src/lib/types.ts`, `src/routes/statements/[id]/{+page.svelte,+page.server.ts,SendDialog.svelte,SendFeedback.svelte,StatusActions.svelte}`, `messages/*.json`, `docs/{PRD-Dwello,api-specification,data-model}.md`, `tests/contracts/statement-send-refused.json`, tests and scenarios
