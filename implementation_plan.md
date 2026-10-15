# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-15 (5): bug #135, statement wizard hides dropped draft values and existing statements

Task: open `bug` issues one by one (#122, #123, #125, #126, #127, #128 merged in rudini/Dwello#181, #182, #189, #196, #197, #198); now #135. Skipped while labelled `entscheiden`: #93, #124, #130, #131, #136, #138, #141, #193, #194.

- [x] Scenarios `@wip` in `statement-generate.feature`: a deleted building from the draft is named; a building with a 2024 statement shows it in step 2. Scenario red: «Ein Gebäude aus dem Entwurf gibt es nicht mehr» – the notice said only «Entwurf wiederhergestellt Ihre Angaben … sind wieder da»; «Schon abgerechnete Mietverträge …» – `generate-building-billed-…` received null
- [x] fach-reviewer on the scenarios (domain terms Mietvertrag, Abrechnung)
  - fach-reviewer round 1 (`docs/reviews/issue-135-fachreview-1.md`): fixed V-1 (Major; the text says only what the rule checks: «… eine Abrechnung, die in diese Abrechnungsperiode fällt»; which rule applies is #199, marker in `statement-generation.ts`), V-2 («aus Ihren Angaben»; the term itself is #200), V-3 («Prüfen Sie die gewählten Gebäude»), V-4 (plural and zero cases), V-5 (distinct contracts, rule of `contractsInPeriod`), V-6 («Abrechnungsperiode»), V-7 (existing seed step reused)
- [x] `restoredSelection` returns what it dropped; the draft notice says so. Test red: «übernimmt nur Gebäude und Heizprofile, die es noch gibt» and «meldet nichts als weggefallen …» – received the selection without `dropped`; DOM «nennt ein gelöschtes Gebäude und ein gelöschtes Heizprofil», «nennt die Zahl mehrerer gelöschter Gebäude …» – the wizard read `.join` of undefined
- [x] Step 2 shows per building how many Mietverträge of the period have a statement, by the rule of the run (`billedContracts` in `statement-generation.ts`, BFF `GET /api/statements/billed`); none created when all have one. Test red: «zählt die Mietverträge der Periode …» – `billedContracts is not a function`; DOM «nennt, wie viele Mietverträge …», «sagt, dass für ein Gebäude keine Abrechnung entsteht …», «nennt einen einzelnen …» – no `generate-building-billed-…`
- [x] Texts in de/fr/it/en; new states `draft-dropped` and `buildings-billed` in `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`
- [x] Skills: tdd, ponytail, ponytail-review (one cast dropped)
- [x] Checks: test:coverage (2428), lint, check, backend test (607) + type-check, deepcheck:audit, E2E chromium: both scenarios, «Angefangene Abrechnungen später fortsetzen», axe and language rows of `draft-dropped` and `buildings-billed` (8 passed; after moving the notes into `DraftNotice` for the fallow gate: 18 passed incl. both draft-restored rows)
- [ ] code-reviewer
- [ ] Personas
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-135.md`
- [ ] PR, CI, merge

Files: `src/lib/statement-wizard.ts`, `src/lib/server/statement-generation.ts`, `src/routes/api/statements/billed/+server.ts`, `src/lib/ui/DraftNotice.svelte` (notes), `src/routes/statements/generate/{StatementWizard,BuildingStep,BuildingChoice}.svelte`, `messages/*.json`, tests (`statement-wizard{,.dom}.test.ts`, `statement-generation.test.ts`, `statement-generate.feature` and its steps, a11y states)
