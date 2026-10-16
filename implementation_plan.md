# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: statement wizard (#251, #252, #201)

Request: «Setze #251 #252 #201 um». Branch `claude/statement-wizard-251-252-201`.

- [x] #251: step 4 asks «trotzdem erstellen» only for real findings, not for existing statements alone (scenario, unit test of `needsConfirmation`)
- [x] #252: the wizard's saved time in Swiss time (`DraftNotice`, `SaveStatus`). No scenario: the E2E browser runs in the machine's time zone and the stack sets none per scenario; DOM test with a set time zone
- [x] #201 a: «Alle Gebäude» leaves out buildings whose Mietverträge all have a statement in the period, said next to the counter (scenario)
- [x] #201 b: step 2 adds «Wenn Sie es wählen, wird dafür nichts erstellt.» and how an existing draft is recalculated (today: delete it and create again; «Neu berechnen» of #132 does not exist yet) (scenario)
- [x] #201 c: a restored wizard opens in the step it was left in, if still valid (scenario)
- [x] #201 d: discarding the input asks first («Ihre Angaben werden gelöscht.»); the notice can be closed (scenarios; new dialog state in `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`)
- [x] fach-reviewer on the scenarios before the first test turns green
- [x] fach-reviewer round 1 (`docs/reviews/wizard-fachreview-1.md`)
- [x] Fachreview M-1: a statement that covers only part of a contract's days in the period stays a finding (confirmation in step 4, kept by «Alle Gebäude»); `billedContracts` counts such contracts (`partly`), the preview passes them on (`partlyBilled`)
- [x] Checks on the slice: lint, check, backend type-check, all vitest, E2E `statement-generate.feature`, `contract-new.feature`, axe and language rows of both wizards
- [ ] Slice reviews (code-reviewer)
- [ ] Feature review (personas, fach-reviewer)
- [ ] Checks before push; archive session; pull request, CI, merge

Files: `src/lib/ui/{DraftNotice,SaveStatus}.svelte`, `src/lib/utils/format.ts`, `src/lib/statement-wizard.ts`, `src/lib/server/statement-generation.ts`, `src/routes/statements/generate/{+page.server.ts,StatementWizard,BuildingStep,BuildingChoice,PreviewChecks}.svelte`, `messages/{de,fr,it,en}.json`, tests in `src/__tests__/`, `tests/e2e/` (features, steps, tasks, questions, targets), `tests/a11y/screens.json`, `docs/reviews/wizard-fachreview-1.md`
