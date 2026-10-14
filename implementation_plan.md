# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 34 - October 2026: workflow review after each feature

From the user: after each feature, review whether instructions, skills, agents or hooks should change, write the findings to `docs/reviews/workflow-rules-review-*.md`, implement none of them. No scenario: agent instructions only, no app behavior changes.

- [x] `CLAUDE.md` Workflow step 7: paragraph "Workflow review" (scope, evidence, report path, review only, no issues or rows for its findings)
- [x] code-reviewer round 1; fixes: review named under "Found" and does not hold up step 9 (C-1), report name `workflow-rules-review-<task>.md` clear of the old numbered reports (C-2), which tasks it covers (C-3), cross-reference in "Open work" (C-4), committed with the task, plan item, before archiving (C-5), session back in the plan until the reviews end (C-6), binding documents in scope (C-7)
- [ ] code-reviewer round 2 (delta)
- [ ] Session archived

Files: `CLAUDE.md`, `docs/archive/implementation-plan-verlauf.md`, `docs/reviews/workflow-review-rule-review-1.md`.
Skills: none (no code changed).

code-reviewer round 1 (`docs/reviews/workflow-review-rule-review-1.md`): fixed C-1 (Major), C-2, C-3, C-4, C-6 (Minor), C-5, C-7 (Nit)
