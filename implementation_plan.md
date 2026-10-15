# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-15 (7): bug #212, small KI model still rejects Treppenhausreinigung

- [ ] Stub reproduces the small model's answer unless the prompt carries the new rules; scenario «KI beurteilt eine neue Kategorie wie die vordefinierten» red
- [ ] fach-reviewer on the proposed rule wording before implementing
- [ ] Unit test: prompt carries the rules and an answer-neutral JSON example, red then green
- [ ] Prompt rules + neutral JSON example (`backend/src/config/llm.ts`)
- [ ] code-reviewer round 1
- [ ] Before marking complete: coverage, lint, check, backend test + type-check, categories E2E
- [ ] `llm:eval` with qwen2.5:3b: product owner (not reachable here)
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-212.md`
- [ ] PR `Fixes #212`, CI green, merge
