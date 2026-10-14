# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 35 - October 2026: nightly issue triage

From the user: an agent that categorizes each new issue and points out duplicates. Decided in the session: it only suggests (never closes), fills missing labels only (topic label, `entscheiden`), runs as a nightly cloud routine on Haiku, marks checked issues with `triaged`, at most 20 per night oldest first, reports duplicates on the newer issue and up to 3 related issues in one `Triage:` comment, rules live in a skill. No scenario: agent instructions only, no app behavior changes.

- [x] Skill `.claude/skills/issue-triage/SKILL.md`
- [ ] code-reviewer round 1
- [ ] Independent review of the skill against "Getting the most out of Opus 5.5" (claude.dev blog, 22 Sep 2026)
- [ ] Checks, push, pull request, merge
- [ ] Routine: nightly 02:13 Europe/Zurich, Haiku, prompt "run the skill issue-triage" (created after the merge, the routine clones `main`)
- [ ] Session archived

Files: `.claude/skills/issue-triage/SKILL.md`, `implementation_plan.md`.
Skills: none (no code changed).
