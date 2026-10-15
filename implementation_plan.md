# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #202 KI judges a new Kategorie without the existing ones

- [x] Scenario «KI beurteilt eine neue Kategorie wie die bestehenden» (@wip) red. Scenario red: `schlägt die KI vor, die Kategorie als umlagefähig zu erfassen` – allowedChosen false (categories.steps.ts:171)
- [x] fach-reviewer on the @wip scenario
- [x] Unit test: allocability prompt lists the predefined Kategorien (not own ones, product owner 2026-10-15 after M-1), red then green. Test red: «zeigt der KI die bestehenden Kategorien mit ihrer Umlagefähigkeit (#202)» – expect(received).toContain(expected)
- [x] Prompt gets the predefined Kategorien (`backend/src/config/llm.ts`, `backend/src/services/llm.service.ts`); stub answers from them
- [ ] `bun run llm:eval` before/after (MiniMax; qwen2.5:3b not reachable here)
- [ ] code-reviewer round 1
- [x] Scenario green, @wip removed (moved to `tests/e2e/features/categories-ki.feature` after V-1)
- Skills: tdd, ponytail, ponytail-review
- Files: `backend/src/config/llm.ts`, `backend/src/services/llm.service.ts`, `backend/scripts/llm-stub.ts`, `backend/src/__tests__/category-allocability.pg.test.ts`, `tests/e2e/features/categories{,-ki}.feature`, `tests/e2e/steps/categories.steps.ts`
- fach-reviewer round 1 (docs/reviews/202-scenario-fachreview-1.md): open –, fixed M-1, V-1, V-2, M-2, V-3
- [ ] Feature review: fach-reviewer (prompt = domain rules); no persona (no screen or text changed)
- [ ] Before marking complete: coverage, lint, check, backend test + type-check, categories E2E
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-202.md`
- [ ] PR `Fixes #202`, CI green, merge
