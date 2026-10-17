# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session 2026-10-17: shorter reports, one merge, kept-behaviour tests (T3, T2, T6 of `docs/reviews/workflow-rules-review-2026-10-17-2.md`)

- [x] T3: `fach-reviewer` writes a Minor/Nit as its row only; both reviewers report only the delta on a re-review (`.claude/agents/{fach-reviewer,code-reviewer}.md`)
- [x] T2: merge `main` once before the push, reviewed in the closing round; no further merges while the pull request waits (`CLAUDE.md` Gotchas "Branches", `.claude/skills/pull-request/SKILL.md`)
- [x] T6: a test that pins kept behaviour needs no red run (`CLAUDE.md` "Done means" and Workflow 2, `.claude/agents/code-reviewer.md`)
- [x] code-reviewer round 1: `docs/reviews/t3t2t6-review-1.md` (C-1 Major fixed: merge only before the first push; C-2 to C-4 fixed; C-5 stays in the report)
- [ ] code-reviewer round 2 on the C-1 fix
- [ ] session archived, pull request
