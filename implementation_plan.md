# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 23 - October 2026: B-13, an apartment counts as free when its contracts cannot be loaded (#143)

Branch `claude/b13-contracts-unknown` (from `claude/workflow-improvements`, on the product owner's request). Finish line: «Done means» of #143 plus `CLAUDE.md`, "Workflow".

- [x] Scenarios `@wip` in `contract-new.feature` and `contract-edit.feature` with the contracts request answered with an error; seen failing
  Scenario red: `contract-form.steps.ts:228/232` «sees the text of Hinweis bei der Wohnung / beim Vertragsbeginn», received null (the apartment passed as free)
- [x] No `fach-reviewer` before implementing: no domain rule, amount or term changes, the message `contracts_apartment_contracts_unknown` exists in all four languages
- [x] DOM test wizard (`contract-wizard.dom.test.ts`): failing contracts request shows the message, no «frei ab» notice, no start limit
- [x] DOM test form (`contract-edit.dom.test.ts`): the same
- [x] Wizard and form: the chosen apartment's unknown contracts show the message at the apartment choice and the start field;
  `forAvailability` answers null for contracts not loaded, for both (`src/lib/contract-form.ts`)
- [x] New screen state `contracts-unknown` in `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`
- [ ] Slice review `code-reviewer`; findings triaged
- [ ] Feature review: personas Helga and Sven (UI changed)
- [ ] Remove `@wip`; all checks of `CLAUDE.md` pass
- [x] Archive the finished Session 21 (`open-work.test.ts` allows one session)
- [ ] Final check: instructions followed, list of improvements to instructions and skills

Files: `src/lib/contract-form.ts`, `src/routes/contracts/{ContractForm,new/ContractWizard,new/ApartmentStep,new/PeriodStep}.svelte`,
`src/__tests__/contract-{edit,wizard}.dom.test.ts`, `tests/e2e/{features,steps,tasks,targets,questions,screenplay}/…`,
`tests/a11y/screens.json`, `docs/archive/implementation-plan-verlauf.md`
