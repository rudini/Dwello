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
- [x] Slice review `code-reviewer`; findings triaged (round 1)
- [x] Feature review: personas Helga and Sven (UI changed), round 1
- [x] Remove `@wip`
- [x] H1: hint also at «Prüfen»; scenario «Die Prüfung nennt die nicht geladenen Mietverträge»
  Scenario red: `contract-form.steps.ts` «sees the text of Hinweis in der Prüfung», received null (fix stashed)
- [x] Code review of the persona fixes (round 3, delta); new state `contracts-unknown-review` (axe, languages)
- [ ] All checks of `CLAUDE.md` pass
- [x] Archive the finished Session 21 (`open-work.test.ts` allows one session)
- [x] Final check: instructions followed, list of improvements to instructions and skills

#151 (Helga H2/H3, decided by the product owner on 13.10.2026: implement now, on this branch):
- [ ] Scenario `@wip` «Mietverträge der Wohnung erneut laden» (`contract-edit.feature`): first contracts request fails, the second not; seen failing
- [ ] `fach-reviewer` on the scenario and the new text (domain term «Überschneidung», consequence of saving)
- [ ] DOM tests: «Erneut versuchen» loads the contracts again, input stays (form and wizard)
- [ ] Hint text with consequence and action, button «Erneut versuchen» (all four languages)
- [ ] axe and language states still cover the hint with the button
- [ ] Code review of the delta; persona Helga on H2/H3
- [ ] All checks; #151 closes with the merge (`Fixes #151`)

Findings (`docs/reviews/b13-contracts-unknown-review-1.md`):
- M1 form takes «unknown» and the start limit from two requests - Minor - fixed (tests first)
- M2 the choice labels an apartment with unknown contracts like a free one - Minor - open work U-15 (`docs/design/offene-punkte.md`)
- M3 hints not announced (no live region) - Minor - fixed (tests first)
- M4 new test between a comment and its describe - Minor - fixed
- M5 the a11y state fails every `/api/contracts` request - Minor - rejected: one endpoint, answered only with an error status, as `docs/test-pyramid.md` allows; the edit page asks it once per apartment
- N1 `forAvailability` reads the list untyped - Nit - fixed
- N2 «no start suggested» and empty `min` also held before the fix - Nit - rejected: the test as a whole fails before the fix (the hints)
- N3 «Remove @wip» not ticked - Nit - fixed
- N4 «(Haiku review)» in a comment - Nit - fixed

Findings round 2 (`docs/reviews/b13-contracts-unknown-review-2.md`): round 1 resolved, M5 and N2 rejections hold.
- N5 the always-present empty live region adds a flex gap - Nit - rejected: an always-present `role="status"` is the pattern of `start-date-notice`; hiding it (`display:none`/`contents`) makes screen readers miss the hint (M3)
- ponytail-review: `contractsUnknown` target duplicated `apartmentContractsUnknown` - fixed

Findings personas (`docs/design/personas/helga-b13.md`, `docs/design/personas/sven-b13.md`):
- Helga H1 no hint at «Prüfen», save active - Major - fixed (DOM test and scenario first)
- Helga H2 «Seite neu laden» loses the edit form's input - Major - open: issue #151 (`entscheiden`), the advice is the text #143 decided
- Helga H3 the hint does not say the consequence, no «Erneut versuchen» - Major - open: issue #151
- Helga H4 the choice shows the apartment like a free one - Minor - open work U-15 (= review M2)
- Helga H5 the same hint twice on the edit page - Minor - rejected: «Done means» of #143 names both places; announced once only (Sven 3)
- Helga H6, H7, H8; Sven 6, 7 - Minor/Nit - open work U-16 (existed before)
- Sven 1, 2 hint not linked to the fields - Minor - open work U-16 (needs an extra description in `Field.svelte`)
- Sven 3 hint announced twice in the edit form - Minor - fixed (test first)
- Sven 4 no hint at «Prüfen» - Minor - fixed (= H1)
- Sven 5 the hint omits the consequence - Minor - open: issue #151

Findings round 3 (`docs/reviews/b13-contracts-unknown-review-3.md`):
- M1 the hint at «Prüfen» has no axe and language state - Major - fixed (`contracts-unknown-review`)
- hint at «Vertragsbeginn» not announced when the request fails only after step 2 - Minor - open work U-16
- `unknown = false` default in `ReviewStep` unused - Nit - rejected: same prop shape as the sibling steps
- H2/H3 open - see «Blocked on me» (issue #151)

Final check of the instructions: `docs/reviews/b13-instruktionen-pruefung.md`

Files: `src/lib/contract-form.ts`, `src/routes/contracts/{ContractForm,new/ContractWizard,new/ApartmentStep,new/PeriodStep}.svelte`,
`src/__tests__/contract-{edit,wizard}.dom.test.ts`, `tests/e2e/{features,steps,tasks,targets,questions,screenplay}/…`,
`tests/a11y/screens.json`, `docs/archive/implementation-plan-verlauf.md`, `docs/design/offene-punkte.md`, `src/routes/contracts/new/ReviewStep.svelte`, persona reports
