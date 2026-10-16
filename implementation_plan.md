# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16: fewer review rounds and less bookkeeping

Request (chat): apply the three proposals of the guardrail analysis: re-review only for Blocker/Major plus one closing round before the pull request; red evidence in the commit instead of plan lines, no Major for missing notes; workflow reviews collected instead of one per task, with the right to propose removing rules. Rules only, so no scenario and no workflow review (Workflow 7).

- [ ] Re-review only for a Blocker/Major fix; Minor/Nit code fixes go into the closing `code-reviewer` round before the push (`CLAUDE.md` Workflow 6, 9)
- [ ] Red evidence in the slice's commit message (`Red:` lines) instead of `Scenario red`/`Test red`/`Skills` plan lines; a missing one is a Minor (`CLAUDE.md` Workflow 1–3, `.claude/agents/code-reviewer.md`)
- [ ] Workflow notes per task only when something came up; a collected workflow review on request, which may propose removing or shortening rules (`CLAUDE.md` Workflow 7)
- [x] `code-reviewer` round on the rule diff
- [x] Checks (exit 0 each): `bun run test:coverage`, `bun run lint`, `bun run check`, `cd backend && bun run test && bun run type-check`
- [ ] Archive the session, push, pull request, CI, merge
  code-reviewer round 1 (docs/reviews/guardrails-review-1.md): fixed C-1 (Major: closing round without end; Minor/Nit fixes from it get no further round), C-2 (test pyramid), C-3, C-4, C-5, C-6, C-7
