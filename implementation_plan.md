# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: apply the workflow rules reviews

Request (chat, no issue): summarize the findings of all `docs/reviews/workflow-rules-review-*.md`, apply those not yet applied, then review the changes independently against the Opus 5.5 guide (claude.dev/blog/getting-the-most-out-of-opus-5-5). Reviews 1 to 9 were applied on 2026-10-14 (commits 3b4db73, 2f8b7ba, 7784acc; W-1 left out on request); the later reviews (issue-122 to issue-202, migrations-frozen) were not. No scenario: changes rules, hooks and test tooling only, no app behaviour.

- [x] Tooling, test first: commit gate skips commits outside the project and says the whole command was dropped; fallow and deepcheck gates say the same; `no-german-in-code` ignores abbreviations of legal citations (176 W-8, 173 R-4, 125 R-4, 135 W-4, 176 W-1)
  Test red: commit-msg-gate «lets … through in a repository outside the project» (3 cases) – status 2; «says that nothing in the blocked command ran» – stderr without it; fallow/deepcheck gate tests (stashed hooks) – stderr without it; «zählt Abkürzungen einer Rechtsangabe nicht» – expected true to be false
  Skills: tdd, ponytail, ponytail-review (round 2: reuse `tools/deepcheck/test/helpers.ts` in the worktree test, applied)
- [x] Scripts: `persona-stack.sh` from its own place (174 W-1); `session-start.sh` prints «some» instead of a count in a shallow clone (174 W-2; counting from the merge base gave 35 either way in a scratch clone)
- [x] Rules in `CLAUDE.md`, `tests/e2e/CLAUDE.md`, `backend/CLAUDE.md`, `docs/test-pyramid.md`, personas README, `persona.md`, `token-referenz.md`, `screens.json`, task template
- [x] Findings summary `docs/reviews/workflow-rules-findings-summary.md` (applied, rejected with reason)
- [x] Checks: test:coverage (2438), lint, check, backend test (614) + type-check, deepcheck:audit, fallow audit
- [ ] Independent review against the Opus 5.5 guide (`code-reviewer`, own worktree), triage
  code-reviewer round 1 (`docs/reviews/workflow-rules-apply-review-1.md`): open -, fixed C-1 (Major), C-2 (Major), C-3 to C-18
  Test red (C-1, C-3): commit-msg-gate worktree outside its folder and the two cd cases - status 0 with the hook of eee15f1
- [ ] Archive session, push, pull request, CI, merge

Files: `CLAUDE.md`, `tests/e2e/CLAUDE.md`, `backend/CLAUDE.md`, `docs/test-pyramid.md`, `docs/design/personas/README.md`, `docs/design/token-referenz.md`, `docs/design/tools/persona-stack.sh`, `.claude/agents/persona.md`, `.claude/hooks/{commit-msg-gate.mjs,fallow-gate.sh,deepcheck-gate.sh,session-start.sh}`, `.claude/skills/grill-me/SKILL.md`, `.github/ISSUE_TEMPLATE/task.md`, `tests/a11y/screens.json`, `src/__tests__/no-german-in-code.test.ts`, `tools/claude-hooks/*.test.ts`, `tools/deepcheck/test/hook.test.ts`, `docs/reviews/workflow-rules-findings-summary.md`, `docs/reviews/workflow-rules-apply-review-1.md`
