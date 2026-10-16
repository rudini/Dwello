# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: statement wizard (#251, #252, #201)

Request: «Setze #251 #252 #201 um». Branch `claude/statement-wizard-251-252-201`.

- [ ] #251: step 4 asks «trotzdem erstellen» only for real findings, not for existing statements alone (scenario, unit test of `needsConfirmation`)
- [ ] #252: the wizard's saved time in Swiss time (`DraftNotice`, `SaveStatus`). No scenario: the E2E browser runs in the machine's time zone and the stack sets none per scenario; DOM test with a set time zone
- [ ] #201 a: «Alle Gebäude» leaves out buildings whose Mietverträge all have a statement in the period, said next to the counter (scenario)
- [ ] #201 b: step 2 adds «Wenn Sie es wählen, wird dafür nichts erstellt.» and how an existing draft is recalculated (today: delete it and create again; «Neu berechnen» of #132 does not exist yet) (scenario)
- [ ] #201 c: a restored wizard opens in the step it was left in, if still valid (scenario)
- [ ] #201 d: discarding the input asks first («Ihre Angaben werden gelöscht.»); the notice can be closed (scenarios; new dialog state in `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`)
- [ ] fach-reviewer on the scenarios before the first test turns green
- [ ] Slice reviews (code-reviewer)
- [ ] Feature review (personas, fach-reviewer)
- [ ] Checks before push; archive session; pull request, CI, merge
