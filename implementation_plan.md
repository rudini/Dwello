# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session 2026-10-17 CI: E2E shards on main within their time limit

No scenario: CI configuration only, no app behaviour changes.

- [x] E2E shards on main get 60 minutes instead of 30 (run #534 on main: both E2E shards cancelled at 30:20 with every browser; pull requests keep 30)
- [ ] Slice review (`code-reviewer`)
- [ ] Plan archived, pull request, CI
