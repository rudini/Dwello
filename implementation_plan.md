# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16 W5d: «Abgerechnet bis» on the Mietvertrag (#133)

- [x] Read #133 and its comments (Option 3; a period past «Abgerechnet bis» bills Mietstage and Akonto from the day after); #281 and #130 do not change its outcome; no implementation issue exists, the decision is the requirement
- [x] @wip scenarios (run skips, Mietstage from the day after, contract page, edit form and help), seen red at the missing behaviour
- [x] fach-reviewer before implementing (`docs/reviews/w5d-fachreview-1.md`): V-1 (Akonto checked with a Saldo), M-1 (PDF tenancy line), V-2 (lock of billed Mietstage uses the same first day; a changed «Abgerechnet bis» goes through it), V-3, V-5, V-7 (hint checked), V-9 fixed; V-4 covered by `contract-actions.test.ts`; V-6 → #327, wizard field (V-7) → #328, wordings (M-1, V-8) → #325
- [x] Backend: migration `0015_contract_billed_until.sql`, contract API, `billingStart` for Mietstage, Zeitanteil, heating share and Akonto, the lock of billed Mietstage, PDF tenancy line (`billed-until.pg.test.ts`)
- [x] BFF: `billsIn` (`src/lib/contract-status.ts`) for the run and `missingStatements`; #211 reuses it
- [x] UI: field and help in the edit form, «Abgerechnet bis» on the contract page, hint in the missing-statements warning; texts in four languages; term row in `i18n-begriffe.md` (❓, #325); a11y seed Dora with «Abgerechnet bis»
- Files: `backend/migrations/0015_contract_billed_until.sql`, `backend/src/db/schema.ts`, `backend/src/routes/contracts.ts`, `backend/src/services/{contract,calculation,prorating,statement-pdf,pdf}.service.ts`, `src/lib/{contract-status,contract-form,types}.ts`, `src/lib/server/statement-generation.ts`, `src/lib/ui/DateInput.svelte`, `src/routes/contracts/{ContractForm.svelte,[id]/+page.server.ts,[id]/+page.svelte,[id]/ContractTerms.svelte,[id]/MissingStatement.svelte}`, `messages/*.json`, `tests/contracts/{contract,building-contracts}.json`, `tests/e2e/**`, `docs/{data-model,api-specification}.md`, `docs/design/i18n-begriffe.md`
- [x] Code review round 1 (`docs/reviews/w5d-review-1.md`): C-1 (scenario moved with today), C-2 (mistyped date cleared «Abgerechnet bis»), C-3 (refusal scenario), C-6, C-7 fixed; C-4 covered by the part-month test; C-5 → #325; C-8 left
- [x] Persona Helga (`docs/design/personas/helga-w5d-abgerechnet-bis.md`): no Blocker/Major; P-1 to P-5 stay in the report
- [x] Persona Dr. Weber (`docs/design/personas/weber-w5d-abgerechnet-bis.md`): P-1 (Major, preview names no days or «Abgerechnet bis») → #327, P-2 (Major, Akonto row without derivation) → #325, both need the product owner's decision; P-3, P-4 → #325; P-6 → #337
- [x] fach-reviewer round 2 (`docs/reviews/w5d-fachreview-2.md`): V-10 (Major, a draft «Abgerechnet bis» covers promised a new statement) fixed; V-14 fixed; V-11 left in the report; V-12 → #337; V-13 → #327
- [x] daten-pruefer (`docs/reviews/w5d-datenpruefung-1.md`): no discrepancy
- [ ] Checks before push; workflow notes; archive the session
- [ ] Push, pull request, CI and merge (CLAUDE.md, Workflow 9)
