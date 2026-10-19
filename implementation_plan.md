# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session C2: less CI per change, run 634 (2026-10-19)

Branch `ccr-3510fafb-cx2ywk`. Product owner 2026-10-19: proposals A, C, D and the cause of the red run 634 on `main`. Merge queues exist only for organisations (Session C1), so the pull request stays the full check. No scenario: CI only.

- [x] A: pushes to `main` run build, lint and unit tests only; the full run (every browser, axe) runs nightly and on `workflow_dispatch`; product owner turns on «Require branches to be up to date»
- [x] C: the axe check in 3 shards instead of 5
- [x] D: skill `pull-request`: reports, plan and archive are committed before the first push
- [x] Run 634: `gh api` answered HTTP 502 in the job "Accessibility (axe)" of `e2e-results`, and `fail-fast` cancelled "E2E tests"; retry and no fail-fast (simulated with a `gh` that answers 502 once: old step exit 1, new exit 0; always 502: exit 1)
- [x] `docs/test-pyramid.md`, `docs/tech-stack.md`; files: `.github/workflows/ci.yml`, `.claude/skills/pull-request/SKILL.md`
- [ ] Slice review, PR
