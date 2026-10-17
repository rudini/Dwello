# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W9c: privacy statement (#82) and documents of former tenants (#178)

Branch `claude/w9c-privacy-82-178`. Both issues' "Decided" sections are the requirement (no separate implementation issues exist).

- [x] #82 `@wip` scenarios (privacy.feature, authentication.feature, sprachen.feature, demo.feature), committed and reviewed by `fach-reviewer` before implementing (round 1: `docs/reviews/w9c-fachreview-1.md`)
- [x] #82 controller from `OPERATOR_*`, «Betreiber» explained, right of access (DSG) (R-1 open: #330)
- [x] #82 retention: kept until the landlord deletes, 10 years (Art. 958f OR, only for those required to keep books), no automatic deletion (R-2 follow-up: #332)
- [x] #82 third parties per configured provider (sign-in, mail transport via `GET /api/v1/mail-transport`, OpenPLZ, Google Maps): country, disclosure abroad, link; what the sign-in provider learns (SMTP provider and server country: #333)
- [x] #82 Google sign-in without `access_type=offline`/`prompt=consent`, no profile picture taken over (JWT, refresh, `/auth/me`)
- [x] #82 server log: purpose, reader, retention set by the operator
- [x] #82 cookie lifetime from `JWT_EXPIRY`; cookies can be refused (Art. 45c lit. b FMG, fach-reviewer agreed, R-9)
- [x] #82 sign-in page links the privacy statement
- [x] #82 terms: demo paragraph (screens.json `terms`/`demo`); «Liegenschaftsverwalter»; FR «rappels de paiement et les rappels»; draft notice reviewed, `TODO(fachlich prüfen, #82)` removed
- [x] #178 tenant page and overview name uploaded documents older than the end of the tenant's last Mietvertrag (No scenario: the upload API stamps the current time, so a document from before a past Vertragsende cannot be seeded; unit and DOM tests). Overview task that never ends: #331; glossary terms: #334
- [x] code-reviewer round 1 (`docs/reviews/w9c-review-1.md`): no Blocker/Major; C-1, C-2, C-4 fixed
- [x] fach-reviewer round 2 (`docs/reviews/w9c-fachreview-2.md`): R-20, R-21, R-22, R-23..R-25, R-27, V-5..V-7 fixed; R-5 Resend safeguard from Resend's DPA (not confirmed from the primary source, noted in #333); R-26, V-8 kept
- [x] personas `docs/design/personas/helga-w9c.md` (P-1, P-2 → #331) and `dr-weber-w9c.md` (P-1 → #330; P-2 → #346, P-3/P-8/P-9 → #347 existed before; P-5 fixed; P-7 → #333)
- [ ] plan archived, PR merged

Files: `src/routes/privacy/*`, `src/routes/terms/*`, `src/routes/login/+page.svelte`, `src/lib/server/{oauth,auth,operator}.ts`, `src/routes/auth/{me,refresh}/+server.ts`, `src/hooks.server.ts`, `src/app.d.ts`, `src/lib/stores.ts`, `src/lib/former-tenant-documents.ts`, `src/lib/overview.ts`, `src/routes/dashboard/+page.server.ts`, `src/routes/tenants/[id]/*`, `backend/src/{app.ts,mail/index.ts}`, `messages/*.json`, tests and features.
