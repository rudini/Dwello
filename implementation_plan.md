# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 21 - October 2026: Workflow rules from the Screenplay session

Decided by the product owner in the chat of 13.10.2026 on the report of proposals E1-E13: E1 (a), E2, E8, E10-E13.

- [x] E1 (a) failure states get a scenario: one failing request answered with an error at the browser boundary
  (`docs/test-pyramid.md`, `tests/e2e/CLAUDE.md`, `CLAUDE.md` step 1, `.claude/skills/bdd-acceptance/SKILL.md`)
- [x] E2 ask before starting when a conflict drops a finish-line item (`CLAUDE.md`, Before coding)
- [x] E8 after the 3rd round, Minors/Nits of a known kind become open work once (`CLAUDE.md` step 7)
- [x] E10 named branches only, no detached HEAD (`CLAUDE.md`, Gotchas)
- [x] E11 one branch, one session (`CLAUDE.md`, Gotchas)
- [x] E12 a task with a push is done when only the push waits for approval (`CLAUDE.md`, Keep going)
- [x] E13 stay in scope (`CLAUDE.md`, Coding guidelines)
- [x] Archive the finished Screenplay session (PR #149) as Session 20 (`docs/archive/implementation-plan-verlauf.md`)
- [x] Review of the slice by `code-reviewer`; findings fixed (`CLAUDE.md`, `docs/test-pyramid.md`, `.claude/agents/code-reviewer.md`)

Findings (`docs/reviews/workflow-rules-review-1.md`):
- E11 wording also bound review subagents - Minor - fixed
- «Ask only when» did not list the new asking cases - Minor - fixed
- «status 500» vs «error status» - Minor - fixed
- «never invented data» checked by nobody - Minor - fixed (code-reviewer checks it)
- server-side failures and `@api` not covered by E1 (a) - Minor - fixed
- plan referred to a report outside the repo - Minor - fixed
- commit subject over 50 characters - Minor - fixed (amended, not pushed)
- archive move not in the checklist - Nit - fixed
- «say so once» without a place - Nit - fixed
