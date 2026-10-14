# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 31 - October 2026: C-15, text-only fixes in the 3rd review round

Request: fix C-15 (`docs/reviews/workflow-rules-review-7.md`, `offene-punkte.md` H-24) as decided: a fix that changes no behavior is confirmed by a delta review, not a test; push; review independently against the Opus 5.5 guide.

- [x] `CLAUDE.md` step 7: such a fix counts when one delta review by the same reviewer confirms it and raises no new Blocker/Major; no 4th round; H-24 removed (commit 2f8b7ba)
- [x] code-reviewer round 1 (`docs/reviews/workflow-rules-review-8.md`): fixed C-1 (Major: user-visible texts stay behavior, step 6), C-2 (stop condition covers an unconfirmed delta review), C-3 ("agent instructions" instead of "rules"), C-4 (report named in the 3rd round's plan line), C-5 (status of C-15 in session 30's line), C-6 (`.claude/agents/code-reviewer.md` done criterion)
- Checks: no code changed; `open-work.test.ts` run for the plan
- Files: `CLAUDE.md`, `.claude/agents/code-reviewer.md`, `docs/design/offene-punkte.md`, `docs/archive/implementation-plan-verlauf.md`, `docs/reviews/workflow-rules-review-8.md`
