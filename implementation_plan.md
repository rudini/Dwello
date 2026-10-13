# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 22 - October 2026: Instructions checked against "Getting the most out of Opus 5.5"

Review in the chat of 13.10.2026 (findings R-1 to R-7); the product owner chose R-1 to R-6. No scenario: instructions and agent config only, no app change.

- [x] R-1 `/tdd` no longer stops for user confirmation; plan goes into the checklist (`.claude/skills/tdd/SKILL.md`)
- [x] R-2 `bdd-acceptance`: no confirmation of actor, terms or next page in Dwello (`.claude/skills/bdd-acceptance/SKILL.md`)
- [x] R-3 `/tdd` points to deepcheck instead of the missing `/codebase-design` skill (`.claude/skills/tdd/SKILL.md`)
- [x] R-4 ask before destructive git and database commands (`.claude/settings.json`)
- [x] R-5 `code-reviewer` and `persona` report one findings table (`.claude/agents/code-reviewer.md`, `.claude/agents/persona.md`)
- [x] R-6 ponytail's three-line limit does not shorten the run summary (`.claude/skills/ponytail/SKILL.md`)
- [x] Review of the slice by `code-reviewer`; findings fixed (`.claude/settings.json`, `.claude/agents/code-reviewer.md`, `.claude/agents/persona.md`, `.claude/skills/tdd/SKILL.md`)
- [ ] Re-review of the delta by `code-reviewer`

Findings (`docs/reviews/opus-instructions-review-1.md`):
- C-1 `db:reset` drops the dev database without asking - Major - fixed
- C-2 prefix rules miss `-f … down -v`, `push origin x --force`, `rm -fr` - Major - fixed (wildcards in the middle, per the Claude Code permissions docs)
- C-3 more commands that discard work - Minor - fixed
- C-4 code-reviewer lists Minor/Nit twice - Minor - fixed
- C-5 persona lists findings twice - Minor - fixed
- C-6 plugin copy of ponytail lacks the Dwello sentence - Minor - rejected: `/ponytail` resolves to the project skill `.claude/skills/ponytail`; the plugin's skill is namespaced (`ponytail:ponytail`), and the project copy already carried Dwello-only lines before
- C-7 `dropdb` asks for the test databases too - Nit - fixed (only `dwello`)
- C-8 `git clean` asks for a dry run too - Nit - rejected: a prompt on a rare dry run costs less than a narrower rule that misses `-df`
- C-9 "the issue" assumes every task has one - Nit - fixed
