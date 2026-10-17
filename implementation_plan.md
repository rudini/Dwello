# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-17 CI: readable E2E logs, no archive conflicts

No scenario: CI and repository configuration only, no app behaviour changes.

- [x] Reporter `list` on CI, so the log names each failed test (run #540 named none)
- [x] `.gitattributes`: `merge=union` for `docs/archive/implementation-plan-verlauf.md` (every task appends there; four conflicts in one session; a simulated merge of two appended sessions conflicts without it and keeps both with it)
- [ ] Slice review (`code-reviewer`)
- [ ] Plan archived, pull request, CI

Files: `.gitattributes`, `playwright.config.ts`
