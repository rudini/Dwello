# Workflow rules reviews: findings and their status (2026-10-15)

Summary of all `docs/reviews/workflow-rules-review-*.md`. Reviews 1 to 9 were applied on 2026-10-14 (commits 3b4db73, 2f8b7ba, 7784acc), except the findings listed below as still open then; the reviews of issue-122 to issue-202 and migrations-frozen had not been applied. "Applied" names where the change now is.

## Applied in this change

| Finding (review) | Point | Where now |
|---|---|---|
| W-28 (5), 123 R-1, 127 R-1, 202 #1, migrations W-2 | "No scenario" only named server-side failures; states the E2E stack cannot produce (server clock, backend start, a refusal's body, KI answer quality) had no rule; a scenario without steps cannot fail for the right reason | `CLAUDE.md` Workflow 1 |
| 202 #1, #2 | KI prompt changes need `llm:eval` before and after; its needs were undocumented | `CLAUDE.md` Workflow 1, `backend/CLAUDE.md` Commands |
| 176 W-9 | Data leaving the server in a new way makes the privacy statement a legal text of the task | `CLAUDE.md` Workflow 1 |
| 135 W-2 | Check results given to a reviewer came from an older commit | `CLAUDE.md` Workflow 4 |
| W-8 (2), 122 R-3, 174 W-8 | `git worktree remove --force` not needed; `node_modules` cannot be read (read dependencies through `node -e`; the deny rule stays) | `CLAUDE.md` Workflow 4 |
| 123 R-2, 126 R-2, 127 R-2, 202 #3 | Persona runs for states the persona stack cannot produce, unless a persona can reach a new text of them; outside-service results via SQL in `dwello_persona`, run by the caller | `CLAUDE.md` Workflow 5 |
| 137 W-1 | Whether personas review a PDF-only change | `CLAUDE.md` Workflow 5 |
| 173 R-3 | Persona app shows one build state; name the build-time value (`APP_VERSION` already reaches the build) | `CLAUDE.md` Workflow 5 |
| 176 W-3 | `fach-reviewer` and `daten-pruefer` in step 5 also need a worktree | `CLAUDE.md` Workflow 5 |
| 176 W-6 | Parallel personas switch each other's interface language | `CLAUDE.md` Workflow 5 |
| W-3 (2) | Re-review after fixes of Minors/Nits only | `CLAUDE.md` Workflow 6 |
| W-14 (3), 135 W-3 | Every text fix triggered a full persona round | `CLAUDE.md` Workflow 6 |
| 176 W-4 | Round limit for fixes of feature-review findings | `CLAUDE.md` Workflow 7 |
| migrations W-3 | Whether operator-facing changes need the workflow review | `CLAUDE.md` Workflow 7 |
| W-4 (2), 122 R-1 | A request covering several issues: one session and pull request per issue | `CLAUDE.md` Workflow 8 |
| 126 R-1, 128 R-1 | An issue's text wrong in a detail (cause, a place the app lacks) | `CLAUDE.md` Coding guidelines, Before coding |
| 174 W-4 | A glossary term the product owner decided in the issue being closed | `CLAUDE.md` Design-Regeln, Copy |
| 125 R-1, 174 W-5 | `+server.ts` pages are screens; states need a meaning in `stateMeanings` | `CLAUDE.md` Design-Regeln, Process |
| 174 W-6 | French guillemets with U+00A0 lived only in a test | `CLAUDE.md` Conventions, UI languages |
| 176 W-2 | No commit scope for categories and privacy | `CLAUDE.md` Conventions, Commits |
| 125 R-4, 135 W-4 (in part), 176 W-1 | A blocked commit drops the whole command, `git add` included | `CLAUDE.md` Gotchas; all three gates now say so. 135 W-4's dry run (`--check`) is not added: the message plus `git show --stat HEAD` covers the loss |
| 135 W-1, 137 W-3, 174 W-3 | Fallow CRAP estimates on templates, duplication in touched code | `CLAUDE.md` Gotchas, Fallow gate |
| 173 R-4 | Commit gate blocked commits in scratch repositories (decided by repository, so Dwello worktrees elsewhere stay checked) | `.claude/hooks/commit-msg-gate.mjs` (test: `tools/claude-hooks/commit-msg-gate.test.ts`) |
| 176 W-11 | `pkill -f` kills its own shell | `CLAUDE.md` Gotchas, One build |
| 174 W-1 | `persona-stack.sh` assumed `/home/user/Dwello` | `docs/design/tools/persona-stack.sh` |
| 174 W-2 | Session-start hook miscounted commits behind `main` in a shallow clone | `.claude/hooks/session-start.sh` (no number in a shallow clone; the merge base does not help there, checked in a scratch clone) |
| W-9, W-27 (2, 5) | Steps tied to one page; reuse steps (grep) | `tests/e2e/CLAUDE.md` Layers |
| 135 W-5, 137 W-4 | Dates that move with today; preselections across parallel scenarios | `tests/e2e/CLAUDE.md` Isolation |
| 137 W-2 | Negative checks name the shortest word | `tests/e2e/CLAUDE.md` Negative checks |
| 174 W-7 | Failing a form action | `tests/e2e/CLAUDE.md` Failure states |
| 125 R-3 | Pages without scripts and `data-hydrated` | `tests/e2e/CLAUDE.md` Rules |
| W-25 (5) | A second variant of one state | `tests/a11y/screens.json` `$comment` |
| 123 R-3 | A set clock moves only Bun's clock | `backend/CLAUDE.md` Tests |
| 173 R-1, R-2 | No layer for CI/deploy logic; build-time constants in components | `docs/test-pyramid.md` Rules |
| 122 R-2, 176 W-5, 174 W-8 | Browser chrome; KI stand-in in the persona app; demo data is invented | `docs/design/personas/README.md` |
| W-16 (3) | Personas may read network requests and cookies for claims about the system | `.claude/agents/persona.md` |
| 125 R-2 (first half) | Pages outside the app: system colours in a `<style>` element | `docs/design/token-referenz.md` |
| W-13 (3), W-21 (4), 126 R-3, 176 W-12 | Issue template: the source of a complete list, tests that pin the old behaviour, migrations | `.github/ISSUE_TEMPLATE/task.md` |
| 176 W-8 | Legal abbreviations («Abs.») made `abs` a German word | `src/__tests__/no-german-in-code.test.ts` |
| 173 R-5 | Skill `grill-me` missing | `.claude/skills/grill-me/SKILL.md` |

## Not applied

| Finding (review) | Reason |
|---|---|
| W-1 (2, 3) merge without asking when all open Majors are of the two kinds step 7 allows | Left out on the product owner's request on 2026-10-14 (commit 3b4db73); still a decision for the product owner |
| 174 W-8 allow reading `node_modules` | A permission change in `.claude/settings.json` is the owner's call; the documented workaround (`node -e`) is applied instead |
| 123 R-2 (second half) `daten-pruefer` only for amounts, not dates | Rejected: a statement's dates are printed in the PDF and the QR-bill, which Workflow 5 sends to `daten-pruefer` |
| migrations W-1 rules that end with an outside event name who records it | Not applied: the one case (migrations) is fixed and recorded; a rule about writing rules has no reader at the moment it matters |
| W-7 (2–5), 174 W-9, 176 W-10 stop hook asks to push early | Outside the repository; `CLAUDE.md` Workflow 9 already says it does not override the workflow |
| W-10 (2), 128 R-2, 202 #4 | The reviews propose no change |
| 125 R-2 (second half) the design guard allows exactly that | No change needed: the guard checks only `style` attributes, so a `<style>` element already passes (`src/__tests__/design-guard.test.ts:21`) |
| 176 W-7 E2E stand-ins in the test pyramid | Already applied in #176 (`docs/test-pyramid.md`, E2E row) |
