# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 35 - October 2026: nightly issue triage

From the user: an agent that categorizes each new issue and points out duplicates. Decided in the session: it only suggests (never closes), fills missing labels only (topic label, `entscheiden`), runs as a nightly cloud routine on Haiku, marks checked issues with `triaged`, at most 20 per night oldest first, reports duplicates on the newer issue and up to 3 related issues in one `Triage:` comment, rules live in a skill. No scenario: agent instructions only, no app behavior changes.

- [x] Skill `.claude/skills/issue-triage/SKILL.md`
- [x] code-reviewer round 1; fixes: no `entscheiden` for «Options» issues (C-1), `issue_write` update with a fresh read and a check after it (C-2), topic labels defined in the skill, not attributed to CLAUDE.md (C-3), one rule for doubt (C-4), step reference (C-5), heading named exactly (C-8), `bug` wording (C-7)
- [x] Independent review of the skill against "Getting the most out of Opus 5.5" (claude.dev blog, 22 Sep 2026), round 1; fixes: report under the three CLAUDE.md headings (G-1, G-9), "When to stop" section (G-2), label write checked (G-3), CLAUDE.md code workflow out of scope (G-4), never stop to ask (G-5), finish line instead of a cap (G-6), skipped issues go to the label step (G-7), placeholders instead of real numbers (G-8), non-functional points (G-10), step reference (G-11), comment lines that apply (G-12)
- [x] Round 2 (delta) of both reviews; fixes: labels set before the comment, `triaged` last, a resumed run fills the gaps again (C-9, G-14, G-7), comment and template line for non-functional points (C-10, G-18), the kinds as listed in CLAUDE.md (C-14), any heading level for «Proposed» (C-11, G-19), exact label check (G-15), stop report names issue and labels (G-16), finish line allows a stopped run (C-13, G-17)
- [ ] Label `triaged` exists after the first run (C-6; the first run is started by hand)
- [ ] Checks, push, pull request, merge
- [ ] Routine: nightly 02:13 Europe/Zurich, Haiku, prompt "run the skill issue-triage" (created after the merge, the routine clones `main`)
- [ ] Session archived

Files: `.claude/skills/issue-triage/SKILL.md`, `implementation_plan.md`, `docs/reviews/issue-triage-{review,guide-review}-{1,2}.md`.
Skills: none (no code changed).

code-reviewer round 1 (`docs/reviews/issue-triage-review-1.md`): fixed C-1 (Major), C-2, C-3, C-4, C-5 (Minor), C-7, C-8 (Nit); open C-6 (Minor, plan item)
guide review round 1 (`docs/reviews/issue-triage-guide-review-1.md`): fixed G-1, G-2, G-3, G-4, G-5 (Major), G-6, G-7, G-8, G-9, G-10 (Minor), G-11, G-12 (Nit); G-13 (Nit) rejected: the owner chose Haiku; Sonnet stays the fallback if duplicate suggestions turn out wrong
code-reviewer round 2 (`docs/reviews/issue-triage-review-2.md`): fixed C-9, C-10 (Minor), C-11, C-13, C-14 (Nit); rejected C-12: G-13 is a rejected finding, not open work
guide review round 2 (`docs/reviews/issue-triage-guide-review-2.md`): fixed G-14, G-16, G-18 (Minor), G-15, G-17, G-19 (Nit)
