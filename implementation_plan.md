# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: skill slice-review

Request (chat, no issue): move the procedure of `CLAUDE.md` Workflow 4 to 6 (worktree per reviewer, prompt, report path, plan line, triage) into a skill `slice-review`, so `CLAUDE.md` keeps the rules and gets shorter; the agents stay agents. No scenario: agent instructions only.

- [x] Skill `.claude/skills/slice-review/SKILL.md` with the procedure, nothing lost from `CLAUDE.md`
- [x] `CLAUDE.md` Workflow 1, 4, 5, 6 point to the skill instead of repeating it
- [x] Checks: test:coverage (2442), lint, check, backend test (615) + type-check
- [ ] Review against the Opus 5.5 guide (`code-reviewer`, own worktree), triage
- [ ] Archive session, push to PR #215
