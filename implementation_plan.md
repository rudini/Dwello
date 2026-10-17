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
- [x] code-reviewer round 1: `docs/reviews/w8d-review-1.md` (C-1 Major fixed with a DOM test seen red; C-3, C-4, C-10 fixed; C-2, C-5 to C-9, C-11 left, reasons in the report summary)
- [x] personas round 1: `docs/design/personas/helga-w8d.md` (P-1 = C-1; P-2 to #366; P-5 button wording fixed), `docs/design/personas/dr-weber-w8d.md` (P-1, P-2, P-6 wording fixed with tests seen red; P-3 to #366; P-4 is #82's)
- [x] fach-reviewer round 2: `docs/reviews/w8d-fachreview-2.md` (no Blocker/Major; V-11 = C-1; V-13, V-14 fixed; V-10, V-12, V-15, V-16 left)
- [x] new issues: #364 (letter offered up front, missing address before sending, later bounces), #366 (record how and when a statement was sent)
- No daten-pruefer: no amount, statement PDF or QR-bill changes; the e-mail attaches the PDF as stored (byte comparison in `statement-mail.pg.test.ts`), the Zahlungsfrist recomputed by fach-reviewer in both rounds
- [x] persona-stack sends e-mail to the mail catcher (`docs/design/tools/persona-stack.sh`: MAIL_FROM and the catcher were missing, every e-mail failed as «not set up»)
- [ ] persona re-runs on the changed texts (Helga: button and letter dialog; Dr. Weber: send dialog, help)
- [ ] closing code-reviewer round, workflow-review, plan archived, pull request `Fixes #86`
- Files: `backend/src/services/{statement-send,pdf,reminder-letter,statement-pdf}.service.ts` (`reminder-letter.ts`), `backend/src/routes/statements.ts`, `backend/src/db/schema.ts` (comment), `backend/scripts/mail-catcher.ts`, `src/lib/server/{statement-actions,documents}.ts`, `src/lib/types.ts`, `src/routes/statements/[id]/{+page.svelte,+page.server.ts,SendDialog.svelte,SendFeedback.svelte,StatusActions.svelte}`, `messages/*.json`, `docs/{PRD-Dwello,api-specification,data-model}.md`, `tests/contracts/statement-send-refused.json`, tests and scenarios
