# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session W15c: Nebenkostenpauschale on the Mietvertrag (#429)

Branch `claude/w15c-pauschale-429`. Product owner 2026-10-17: field «Nebenkostenpauschale pro Monat», shown everywhere the Akonto is, counts in «Monatlich total», never billed, not on the PDF.

- [x] @wip scenarios: record in the wizard (review step, total), edit and contract page, apartment monthly costs, statement does not bill it (the statement scenario pins kept behaviour), warning, carry-over
- [x] fach-reviewer on scenarios, texts and glossary rows before implementing (`docs/reviews/429-fachreview-1.md`)
- [x] Migration 0025 `flat_rate_utility_charge` (not null, default 0), schema, routes, service, API contracts, `docs/data-model.md`
- [x] Form: field in `RentStep`, `contract-form`, `contract-wizard` (summary, total, carry-over, `flatRateNotice`), hint «Kein Akonto» points to it
- [x] Display: contract page (`ContractTerms`), apartment monthly costs (`MonthlyCostsCard`), every «Monatlich total» (`contract-history.monthlyTotal`, contract list)
- [x] Glossary rows «Nebenkostenpauschale», «Monatlich total» (product owner confirms the wording in the PR); i18n-begriffe already has the term (#66)
- [x] Axe and language state `flat-rate-warning` on `contract-new` and `contract-edit`
- [x] Slice review round 1 (`docs/reviews/429-review-1.md`)
- [x] Feature review: fach-reviewer round 2 (`docs/reviews/429-fachreview-2.md`), personas Helga and Dr. Weber (`docs/design/personas/helga-429.md`, `weber-429.md`), daten-pruefer round 1 (`docs/reviews/429-datenpruefung-1.md`)
- [x] Fixes from the feature review: the note «Keine Nebenkosten vereinbart» informs instead of warning when a Pauschale is entered (`AgreedCategories.svelte`, `agreed-categories.dom.test.ts`); reviewed wording of the hint «Kein Akonto», the warning title and en text; glossary row without the repeated sentence; `monthlyTotal` test (`tenant-detail.test.ts`)
- [x] Dr. Weber P-1 (warning with Akonto and Pauschale) contradicts the decision in #429: #432
- [ ] Product owner confirms the glossary rows and the hint sentence in #429
- [ ] Closing code-review round, PR `Fixes #429`

Files: `backend/migrations/0025_contract_flat_rate.sql`, `backend/src/{db/schema.ts,routes/contracts.ts,services/contract.service.ts}`, `src/lib/{types,contract-form,contract-wizard}.ts`, `src/lib/server/{apartment,contract-history}.ts`, `src/routes/contracts/{+page.server.ts,[id]/+page.server.ts,[id]/ContractTerms.svelte,new/RentStep.svelte}`, `src/routes/apartments/[id]/MonthlyCostsCard.svelte`, `messages/*.json`, `UBIQUITOUS_LANGUAGE.md`, `tests/contracts/contract{,s}.json`, `tests/a11y/screens.json`, `tests/e2e/**`.
