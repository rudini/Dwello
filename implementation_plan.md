# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W10c: agreed Nebenkosten per Mietvertrag (#91)

- [x] Implementation issue for #91 created (own "Done means"): #363; decision issues #368 (agreed from a date, follow-up contract), #369 (glossary)
- [x] `@wip` scenarios (`statement-agreed-costs.feature`, `contract-new.feature`, `contract-edit.feature`) committed, `fach-reviewer` before implementing: `docs/reviews/w10c-fachreview-1.md`
- [x] Slice 1, backend: `contract_categories` (migration 0018, schema, `docs/data-model.md`), new contract with all umlagefähige categories, existing contracts from their statements, calculation bills only agreed categories, API to read and answer; heating profile and Tankbestand only when agreed (V-3), no «Rechnung geändert» for not agreed categories (V-2), demo contracts agree everything
- [x] Code review slice 1: `docs/reviews/w10c-s1-review-1.md`, re-review `w10c-s1-review-2.md`
- [x] Slice 2, statement wizard: question for unanswered categories in the step «Einstellungen», answer stored on the Mietvertrag (saved note); notice of not agreed costs; text of the «Neu» finding; a11y/language state `agreed-costs`
- [x] Code review slice 2 and 4: `docs/reviews/w10c-s2-review-1.md` (C-1 questions loading/failing block «Weiter», C-2 state `agreement-save-failed`, C-6, C-7, C-9 fixed)
- [x] Re-review slice 2 fixes and review slice 3: `docs/reviews/w10c-s3-review-1.md` (C-1 saving the form keeps unanswered categories unanswered, C-2, C-3 state `agreements-failed`, C-6, C-9, C-14, C-15 fixed)
- [x] Closing code review (slice 3 fixes, merge a9bd54a, feature review fixes): `docs/reviews/w10c-close-review-1.md` (C-1 to C-4 scenarios and state, C-5 fixed); `fach-reviewer` round 3 `w10c-fachreview-3.md` (V-12 = C-5, V-11, V-14 fixed)
- [x] Workflow note: `docs/reviews/workflow-notes-issue-363.md`
- [x] Slice 3, contract: checkboxes in «Neuer Mietvertrag» and «Mietvertrag bearbeiten» (help texts per domain review V-6), list in «Prüfen» and on the detail page
- [x] Slice 4, PDF names the agreed categories it bills (domain review M-2), only on statements created since (agreed_category_ids)
- [x] a11y screens and languages for the new states (`statement-generate` `agreed-costs`, `agreement-save-failed`; the contract screens show the boxes in their existing states)
- [x] Feature review: personas `docs/design/personas/marco-w10c.md` (P-1 note when nothing is agreed, P-3 fixed), `weber-w10c.md`; `docs/reviews/w10c-fachreview-2.md` (M-1 PDF line only without uncategorised positions, V-1, V-2 fixed; #382 opened, M-2 added to #368); `docs/reviews/w10c-datenpruefung-1.md` (no findings)
- [x] Marco re-run on the note (P-1 fixed, P-5 Minor stays), `fach-reviewer` round 3 on M-1 (`w10c-fachreview-3.md`)
- [x] Closing re-review round 2: `docs/reviews/w10c-close-review-2.md` (C-11 scenario waits for the save, shown red without the fix; C-12, C-13, C-17 fixed)
- [ ] Session archived, pull request merged

Files changed: `backend/migrations/0018_contract_categories.sql`, `backend/src/db/schema.ts`, `backend/src/services/agreed-category.service.ts`, `contract.service.ts`, `calculation.service.ts`, `statement.service.ts`, `statement-invoices.service.ts`, `backend/src/routes/contracts.ts`, `backend/demo/demo-data.sql`, `docs/data-model.md`, `docs/api-specification.md`, `backend/src/services/pdf.service.ts`, `statement-pdf.service.ts`, `src/lib/server/statement-generation.ts`, `src/lib/server/api-proxy.ts`, `src/routes/api/statements/agreements/`, `src/routes/api/contracts/[id]/agreements/`, `src/routes/statements/generate/AgreedCosts.svelte`, `AgreementQuestion.svelte`, `StatementStep.svelte`, `StatementWizard.svelte`, `messages/*.json`, `tests/a11y/screens.json`, `tests/contracts/contract-agreements.json`, `tests/contracts/contract.json`, `src/lib/contract-form.ts`, `src/lib/contract-wizard.ts`, `src/lib/server/category.ts`, `src/lib/types.ts`, `src/routes/contracts/AgreedCategories.svelte`, `ContractForm.svelte`, `new/` (load, wizard, rent and review step), `[id]/` (load, terms, edit), tests (`agreed-categories.pg.test.ts`, `migrations.pg.test.ts`, `tests/e2e/…`)
