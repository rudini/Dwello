# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #202 KI judges a new Kategorie without the existing ones

- [ ] Scenario «KI beurteilt eine neue Kategorie wie die bestehenden» (@wip) red
- [ ] fach-reviewer on the @wip scenario
- [ ] Unit test: allocability prompt lists the Kategorien, red then green
- [ ] Prompt gets the Kategorien (`backend/src/config/llm.ts`, `backend/src/services/llm.service.ts`); stub answers from them
- [ ] `bun run llm:eval` before/after (MiniMax; qwen2.5:3b not reachable here)
- [ ] code-reviewer round 1
- [ ] Scenario green, @wip removed
- [ ] Feature review: fach-reviewer (prompt = domain rules); no persona (no screen or text changed)
- [ ] Before marking complete: coverage, lint, check, backend test + type-check, categories E2E
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-202.md`
- [ ] PR `Fixes #202`, CI green, merge
