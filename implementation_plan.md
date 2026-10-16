# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16 W5d: «Abgerechnet bis» on the Mietvertrag (#133)

- [x] Read #133 and its comments (Option 3; a period past «Abgerechnet bis» bills Mietstage and Akonto from the day after); #281 and #130 do not change its outcome; no implementation issue exists, the decision is the requirement
- [x] @wip scenarios (run skips, Mietstage from the day after, contract page, edit form and help), seen red at the missing behaviour
- [x] fach-reviewer before implementing (`docs/reviews/w5d-fachreview-1.md`): V-1 (Akonto checked with a Saldo), M-1 (PDF tenancy line), V-2 (lock of billed Mietstage uses the same first day; a changed «Abgerechnet bis» goes through it), V-3, V-5, V-7 (hint checked), V-9 fixed; V-4 covered by `contract-actions.test.ts`; V-6 → #327, wizard field (V-7) → #328, wordings (M-1, V-8) → #325
- [x] Backend: migration `0013_contract_billed_until.sql`, contract API, `billingStart` for Mietstage, Zeitanteil, heating share and Akonto, the lock of billed Mietstage, PDF tenancy line (`billed-until.pg.test.ts`)
- [x] BFF: `billsIn` (`src/lib/contract-status.ts`) for the run and `missingStatements`; #211 reuses it
- [x] UI: field and help in the edit form, «Abgerechnet bis» on the contract page, hint in the missing-statements warning; texts in four languages; term row in `i18n-begriffe.md` (❓, #325); a11y seed Dora with «Abgerechnet bis»
- Files: `backend/migrations/0013_contract_billed_until.sql`, `backend/src/db/schema.ts`, `backend/src/routes/contracts.ts`, `backend/src/services/{contract,calculation,prorating,statement-pdf,pdf}.service.ts`, `src/lib/{contract-status,contract-form,types}.ts`, `src/lib/server/statement-generation.ts`, `src/lib/ui/DateInput.svelte`, `src/routes/contracts/{ContractForm.svelte,[id]/+page.server.ts,[id]/+page.svelte,[id]/ContractTerms.svelte,[id]/MissingStatement.svelte}`, `messages/*.json`, `tests/contracts/{contract,building-contracts}.json`, `tests/e2e/**`, `docs/{data-model,api-specification}.md`, `docs/design/i18n-begriffe.md`
- [ ] Slice review, feature review (personas, fach-reviewer, daten-pruefer)
- [ ] Checks before push; workflow notes; archive the session
- [ ] Push, pull request, CI and merge (CLAUDE.md, Workflow 9)
