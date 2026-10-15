# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-15 (5): bug #135, statement wizard hides dropped draft values and existing statements

Task: open `bug` issues one by one (#122, #123, #125, #126, #127, #128 merged in rudini/Dwello#181, #182, #189, #196, #197, #198); now #135. Skipped while labelled `entscheiden`: #93, #124, #130, #131, #136, #138, #141, #193, #194.

- [x] Scenarios `@wip` in `statement-generate.feature`: a deleted building from the draft is named; a building with a 2024 statement shows it in step 2. Scenario red: «Ein Gebäude aus dem Entwurf gibt es nicht mehr» – the notice said only «Entwurf wiederhergestellt Ihre Angaben … sind wieder da»; «Schon abgerechnete Mietverträge …» – `generate-building-billed-…` received null
- [ ] fach-reviewer on the scenarios (domain terms Mietvertrag, Abrechnung)
- [ ] `restoredSelection` returns what it dropped; the draft notice says so (unit + DOM test)
- [ ] Step 2 shows per building how many Mietverträge of the period have a statement, by the rule of the preview (`statement-generation.ts`); none created when all have one (DOM test)
- [ ] Texts in de/fr/it/en; new states in `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`
- [ ] Skills: tdd, ponytail, ponytail-review
- [ ] Checks: test:coverage, lint, check, backend test + type-check, deepcheck:audit, E2E
- [ ] code-reviewer
- [ ] Personas
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-135.md`
- [ ] PR, CI, merge
