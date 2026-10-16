# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session W7b: Kündigungsfrist hint and «Kündigung aufheben» help (#112, #52)

- [x] #112: `@wip` scenarios «Kündigung mit zu kurzer Frist» and «Kündigung mit genügend Frist» in `contract-detail.feature`, seen red; `fach-reviewer` before implementing
- [x] #112: rule «less than 3 calendar months between receipt and Vertragsende» (day clamped) with the four unit cases of the issue
- [x] #112: optional field «Kündigung erhalten am» in «Mietvertrag beenden», help with the form, hint (no block)
- [x] #112: column `notice_received_on` (migration, schema, API, contract, `docs/data-model.md`), shown on the detail page, cleared when the notice is withdrawn
- [x] #112: dialog state with the hint in `tests/a11y/screens.json`; `docs/anforderungen-vertragsende.md` A-3 implemented
- [x] #52: `contracts_withdraw_notice_help` per the glossary in four languages, scenario «Kündigung aufheben» checks it, marker removed
- [x] Fach review round 1: `docs/reviews/w7b-fachreview-1.md` (no Blocker/Major; M-5, V-1, V-3 taken)
- [x] Code review round 1: `docs/reviews/w7b-review-1.md` (no Blocker/Major; C-6, C-10 fixed; C-9 rejected: both callers hold the form, the field is read once in `endOn`)
- [x] Fach review round 2: `docs/reviews/w7b-fachreview-2.md` (no Blocker/Major; M-6, M-7, V-4 fixed)
- [x] Personas: `docs/design/personas/helga-w7b.md`, `docs/design/personas/weber-w7b.md` (no Blocker/Major)
- [ ] Closing code review of the fixes, plan archived, pull requests merged (#52 and #112 separately, skill `pull-request`)

Files: `backend/migrations/0007_contract_notice_received.sql`, `backend/src/db/schema.ts`, `backend/src/routes/contracts.ts`, `backend/src/services/contract.service.ts`, `src/lib/contract-status.ts`, `src/lib/types.ts`, `src/routes/contracts/[id]/{+page.svelte,+page.server.ts,ContractTerms.svelte}`, `src/routes/contracts/new/PeriodStep.svelte`, `messages/*.json`, tests (`contract-status`, `contract-actions`, `contract-end.pg`, `tests/contracts/contract.json`, E2E contract-detail/contract-edit, a11y), docs (`anforderungen-vertragsende.md`, `data-model.md`, `api-specification.md`).
