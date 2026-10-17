# Collected workflow review (2026-10-17)

Collected review per skill `workflow-review`, "Collected review". Only findings and proposals; nothing here is applied. The product owner decides which to apply.

## Files covered

The last collected review, `workflow-rules-findings-summary.md` (2026-10-15 20:03, with `workflow-rules-apply-*.md`), covers the per-task reviews up to issue-212 and migrations-frozen. No collected review names the files below (added 2026-10-15 after it, or 2026-10-16/17). Some of their points were applied meanwhile by the guardrails changes of 2026-10-16 (`d32ca39b`, `ef3c9378`, `571ebde1`, `6198743d`); those are marked "applied" and not proposed again.

- Per-task reviews (13): `workflow-rules-review-issue-142.md`, `-issue-147.md`, `-issue-159.md`, `-issue-186.md`, `-issue-208.md`, `-issue-209.md`, `-issue-217.md`, `-issue-226.md`, `-issue-229.md`, `-issue-233.md`, `-issue-241.md`, `-axe-ui-only.md`, `-e2e-speed.md`.
- Notes (37): `workflow-notes-ci-shards.md`, `-issue-107-193-194.md`, `-issue-108-59.md`, `-issue-109-67-69.md`, `-issue-110.md`, `-issue-112-52.md`, `-issue-115.md`, `-issue-116-141.md`, `-issue-117-145-58.md`, `-issue-129.md`, `-issue-131.md`, `-issue-136-72-73-61.md`, `-issue-138-93-92.md`, `-issue-144.md`, `-issue-156.md`, `-issue-160.md`, `-issue-247-230-232.md`, `-issue-248-253.md`, `-issue-296.md`, `-issue-351-249.md`, `-issue-356.md`, `-issue-357.md`, `-issue-358.md`, `-issue-363.md`, `-issue-63-105-106.md`, `-issue-64-87-55.md`, `-issue-65.md`, `-issue-74.md`, `-issue-79.md`, `-issue-83-84.md`, `-issue-86.md`, `-issue-89.md`, `-issue-96-104.md`, `-issue-97-101.md`, `-o34.md`, `-w3c.md`, `-w3d.md`.
- Coordinator observations (counted as one source "coordinator"), see the last section.

Short names below drop the prefix (`109-67-69` = `workflow-notes-issue-109-67-69.md`, `R-217` = `workflow-rules-review-issue-217.md`).

## Groups, most frequent first

| # | Rule location | Count | Proposal |
|---|---|---|---|
| G1 | Decision-template "Done means" vs "Setze #n um" (`CLAUDE.md` "Open work", `.github/ISSUE_TEMPLATE/decision.md`) | 13 + coordinator | Rewrite on decision |
| G2 | Skill `pull-request`, "Which pull requests" (one PR per issue) | 12 + coordinator | Allow one PR for related issues |
| G3 | Fallow and commit-subject gates (skill `commit-gates`, Gotchas "Commit gates") | 11 | Document the expected workarounds |
| G4 | Persona runs and demo data (`docs/design/personas/README.md`, `demo-records.md`, `persona-kit.mjs`) | 13 + coordinator | Caller-run SQL as standard, fix the language line |
| G5 | Axe and language states (`CLAUDE.md` Design-Regeln "Process", `tests/e2e/tasks/accessibility.ts`, `fixtures/screens.ts`) | 11 | State-handler rules in `tests/e2e/CLAUDE.md` |
| G6 | "Every new test was seen red" (`CLAUDE.md` "Done means", Workflow 1/2) | 9 | Name the mutation way |
| G7 | Stop hook `~/.claude/stop-hook-git-check.sh` | 9 | Stop noting; change the hook |
| G8 | Skill `workflow-review`, "Collected review" with parallel sessions | 9 + coordinator | Coordinator writes it |
| G9 | `tests/e2e/CLAUDE.md` "Rules", Isolation and E2E data | 9 | Three more lines |
| G10 | `tests/e2e/CLAUDE.md` "No scenario" | 8 | Add two cases, or a dated seed path |
| G11 | Skill `slice-review` (worktree, triage, rounds) | 13 | Reviewers do not run tests; same-cause rule |
| G12 | Gotchas "Branches", session start and merges | 8 + coordinator | Name the branch for a detached start |
| G13 | Local checks and machine load ("Before marking anything complete", Gotchas "One build") | 8 + coordinator | One heavy run at a time |
| G14 | "Open work" / "Working on an issue": partial delivery, stale issue text | 6 + coordinator | `Refs` rule for partial delivery |
| G15 | Decided texts vs review findings (`CLAUDE.md` "Coding guidelines", skill `grill-me`, Decision template) | 5 + coordinator | Reviewers know a decided text |
| G16 | Migration numbering (`backend/CLAUDE.md` "Layout") | 4 + coordinator | Number at the push |
| G17 | Workflow 1 `fach-reviewer` wait vs skill `tdd` | 3 (+3 "paid off") | Keep; one line in `tdd` |
| G18 | Workflow 5 feature review: `daten-pruefer` scope | 4 | Narrow trigger, own records |
| G19 | Merging with an open Blocker/Major (`CLAUDE.md` "When to ask", skill `pull-request`) | 1 + coordinator | Align with "Done means" |
| G20 | CI from a session (skill `pull-request`, Workflow 6 paths) | 4 + coordinator | `.github/workflows/`, dirty PRs, logs |
| G21 | Glossary markers and naming (`UBIQUITOUS_LANGUAGE.md`, `no-german-in-code.test.ts`) | 4 | Drop own «geplant (#n)» |
| G22 | Ask rules in unattended sessions (`.claude/settings.json`) | 1 + coordinator | Name prompting commands and alternatives |
| G23 | Plan archive (`CLAUDE.md` Workflow 8) | coordinator | Append-only, conflict-free form |
| G24 | Single points | 9 | See list |

### G1 Decision-template "Done means" on a decided issue (13 + coordinator)

- Files: 109-67-69, 110, 115, 129, 144, 160, 247-230-232, 63-105-106, 74, 83-84, 86, 96-104, w3d; coordinator.
- What happened: the issue kept «decision recorded … or an implementation issue created» after the product owner decided; the request was to implement. Every worker asked or had to be told that "Decided (product owner)" is the requirement; 160 opened #373 only to close it.
- Proposal: in `CLAUDE.md` "Open work", one sentence: «"Setze #n um" on a decided decision issue implements its "Decided (product owner)" section; the pull request closes it, no implementation issue.» And in `decision.md`: when deciding, the product owner (or `grill-me`) replaces "Done means" with the task's.

### G2 One pull request per issue (12 + coordinator)

- Files: 108-59, 109-67-69, 112-52, 116-141, 117-145-58, 131, 247-230-232, 351-249, 63-105-106, 64-87-55, w3c, R-186 (W-1, rule arrived mid-task); coordinator.
- Cost: issues sharing message keys, a stored field or a screen would have needed stacked branches; 108-59 and 112-52 split after the fact, copying files onto a second branch. 10 of 12 followed the coordinator against the skill.
- What the rule caught: nothing in the notes; it keeps a pull request small and its `Fixes` honest.
- Proposal (shortens the rule): «Issues that change the same code, texts or data, or whose decisions refer to each other, share one pull request with one `Fixes #n` each and name each issue's scenario; independent issues get their own branch from the start (decide before the first scenario, not at the push).»

### G3 Commit gates (11)

- Files: 107-193-194 (blocked command dropped plan edits and file moves), 116-141 (editing one member of an existing clone family shows as introduced; a python edit dropped too), 117-145-58 (indentation turns an old clone into a new one), 156, 357, 358 (Svelte template counts as one function for CRAP), 357 (red tests that import a missing module blocked as `unresolved_imports`), 64-87-55 (gate-forced refactor then flagged by ponytail), 138-93-92 (merge commit subject blocked), R-208 #4 (subject length, cost only), R-142 W-3. R-217 W-4 (stash for one slice) is applied (`commit-gates` description).
- Proposal, in `commit-gates`: (a) «a refactor the gate forces is expected; name it in the commit, reviewers do not flag it as unrelated or ponytail»; (b) «an existing clone can show as introduced after editing or re-indenting one member: compare with `bunx fallow audit` on `main` first»; (c) «a new page or a new `{#if}` branch in a detail page: plan a component and a DOM test with it»; (d) «conclude a merge with `git commit --no-edit`»; (e) «red tests importing a module that does not exist yet stay staged until it exists, or the gate skips `unresolved_imports` under `__tests__`». In Gotchas "Commit gates": «edits by any tool (python, sed) in the same command are lost too».

### G4 Persona runs and demo data (13 + coordinator)

- Files: 110 (README line 31 is wrong: the language is the `PARAGLIDE_LOCALE` cookie, two languages ran in parallel; kit fixes `locale: 'de-CH'`), 115 (missing fixed-term contracts inserted by SQL), 117-145-58 (persona typed a query string, false Major), 131 (no period with unbilled contracts named), 136-72-73-61 (every 2025 preview blocked by drafts), 248-253 and 63-105-106 (every demo statement already has a PDF), 83-84 (clear `pdf_blob` after SQL that changes a PDF), 86 (no mail catcher; fixed), 96-104 and 356 (persona may not delete its own records; one-shot result screen lost), R-217 W-3 (no sample upload files; non-ASCII names break `setFiles`), R-233 W-7 (three saving buildings only). Persona-kit path (R-159, R-208, R-217) is fixed (`cf7825e6`); R-229 #1 is applied ("Demo records in the way").
- Coordinator: persona runs needed SQL-seeded data, and sessions edited or removed demo rows in `dwello_persona`.
- Proposal: (a) fix README line 31: «the language is a cookie of the persona's browser; personas in different languages may run in parallel» and let `open()` take a `locale`; (b) widen "Demo records in the way" to «records missing or in the way: the caller adds or removes them by SQL in `dwello_persona` and names the SQL»; (c) `demo-records.md`: every demo statement has a PDF (SQL to clear it), 2025 drafts block the wizard (SQL once), which building/period still has unbilled contracts; (d) «saving includes deleting the persona's own records; act on a one-shot result in the same session»; (e) «change filters through the page, not the address bar»; (f) `persona-stack.sh` provides the E2E sample files with ASCII names.

### G5 Axe and language states (11)

- Files: R-142 W-2 (seed happens to show a state), R-186 W-10 (another kind of record is a state), 356 (a changed state counts; `+server.ts` refusals missed; a saving state per look), 363 (a state handler that saves changes the next look; a shared component's state only on one screen), 89 (notice inside a wizard step), 96-104 (one seed for all screens widens every screen's data), w3c (`Intl` names flagged as German; `default` row required for a record-only screen), 160 (typed fixture term flagged as German), R-233 W-4 (seeded file names must be language-neutral).
- Proposal: in `CLAUDE.md` "Process": «a state the change adds or changes (a new control or text), also one missing before; a state the default seed happens to show still gets its own entry; another kind of record (predefined vs own, sent vs draft) is a state; a notice inside a wizard step is covered by `every-wizard-step` with seed data». In `tests/e2e/CLAUDE.md`: «a state handler runs once per viewport, scheme and language on the same records: it saves nothing, or uses a fresh period per look; every value it types or seeds and the screen shows is digits, English or carries a UUID; `Intl` data is masked, not UI text».

### G6 "Every new test was seen red" (9)

- Files: 110 (guard scenario red only at unit level), 136-72-73-61 (guard tests green on base), 351-249 and 79 (test of behaviour already right: red by a hand mutation), 156 and R-226 #1 (scenario added or changed by a review shown red only through its lower-layer test), R-217 W-6 (red of review-driven scenario not recorded), R-e2e-speed W-1 (runner configuration no test loads), 357 (red tests could not be committed, G3).
- What the rule caught: R-217 C-29 and R-226 C-4 (reviewers found scenarios never seen red).
- Proposal (keep, add one sentence): «A test of behaviour already right, or a guard, shows its red by a deliberate mutation of the code for one run; a scenario changed for a finding may show its red through the lower-layer test of the same behaviour; a runner configuration by a run before and after. The commit names how.»

### G7 Stop hook (9)

- Files: 108-59, 112-52, 117-145-58, 358, 63-105-106, 86, 89, R-186 W-9, R-226 #5.
- Cost: 3 to 6 prompts per task, local red-on-purpose commits (R-226). The hook is outside the repo; CLAUDE.md Workflow 9 already says it overrides nothing.
- Proposal: change the hook (skip a branch without an open pull request; ignore untracked files under `docs/reviews/` and `docs/design/personas/`). Until then, notes stop repeating it (remove from the notes' scope).

### G8 Collected review with parallel sessions (9 + coordinator)

- Files: 109-67-69, 136-72-73-61, 156, 247-230-232, 248-253, 63-105-106, 64-87-55, 83-84, w3c; coordinator (most workers left it to the coordinator, as the skill allows only by reading "the session of the last one").
- Proposal: in `workflow-review`, "Collected review": «When a coordinator started parallel sessions, only the coordinator writes it, once all have merged.»

### G9 E2E isolation and data (9)

- Files: R-159 #2 (unsuffixed lookup on an unfiltered list), 160 («B1» inside a UUID hex), o34 (select by list position), 64-87-55 (two scenarios saving the global settings form), 97-101 (preselected heating profile deleted by a parallel scenario; no refusal cause in E2E logs), R-186 W-3 (preconditions on predefined shared records), 138-93-92 (no way to date a sent statement in the past), 363 (task leaving a step must wait for what it loads), R-226 #2 (PDF helper decodes differently under Node).
- Proposal: in "Isolation": «choose your own record by id or suffixed name, never by position or bare number; search terms a UUID cannot contain (g–z, a dot); only one scenario submits the settings form; a predefined record changes only through a seed helper that restores it». In "Layers": «a task leaving a step waits for what the step loads». Let the E2E backend log the cause of a `CALCULATION_FAILED` refusal.

### G10 "No scenario" list (8)

- Files: 107-193-194 (record older than today), 108-59 (third reminder needs passed deadlines), 64-87-55 (aggregate count, non-default global setting), 83-84 (wording of existing texts), 138-93-92 (form action failure shows SvelteKit's page), R-233 W-2 (screen-reader-only text; `blob:` is testable), R-186 W-4 (KI stand-in failure trigger), 109-67-69 and 131 (issue named only unit tests for visible text, Major each; issue template).
- Proposal: add «a record whose date must lie in the past when no endpoint sets it» and «a result aggregated over all records, or a non-default global setting»; or, cheaper overall, a test-only seed that ages records, which removes both cases. Task template: «a visible change names its scenario or a "No scenario" case».

### G11 Skill `slice-review` (13)

- Worktree (6): 107-193-194, 112-52, 136-72-73-61, 89, 96-104 (reviewers cannot run vitest: `node_modules` read denied, hydrate writes under `node_modules`), 83-84 (`bun test` in `backend/` recreates `dwello_test`). Cost: every report says «reported by the caller»; the link buys nothing.
- Triage and rounds (7): R-159 #3 and R-226 #3 (one cause, several reviewers), R-209 #1 (container restart is not a failed start), R-147 #2 (agent type missing after `add_repo`), 144 (rewording a reviewed text), 138-93-92 and R-233 W-3 (which round a fix belongs to). R-217 W-5 and R-186 W-6 are applied.
- Proposal: drop the two `ln -s` lines and say «reviewers read; the caller runs the checks they name»; in "Triage": «findings with one cause share one fix and one test; a run lost to a restart is restarted with the app; a missing agent type runs as a general-purpose agent that reads the agent file first; rounds count per commit range reviewed».

### G12 Branches and session start (8 + coordinator)

- Files: 109-67-69, 116-141, 129, 296, 357, w3c (detached HEAD, no branch to use); 358 (append conflict dropped a closing `});`); 74 (shallow clone, `git log -S` named the wrong commit); coordinator (sessions created from a revision start detached or on an old branch; the hook message comes only at the commit).
- Proposal: Gotchas "Branches": «a session that starts detached creates `claude/<task>-<issue>` from `origin/main` before the first change»; «after keeping both sides of a conflict, run `bun run check` before the merge commit». "Cloud sessions": «the clone is shallow: `git fetch --unshallow` before naming the commit that introduced a line».

### G13 Local checks and machine load (8 + coordinator)

- Files: 358 (vitest, check and lint in one command next to five personas: container restarted twice, exit 137), 107-193-194 (full E2E for over an hour; subprocess unit tests time out), 79 (full E2E next to personas), R-233 W-6 (exit code, not the passed count), R-159 #4 (check red on `main` by the hour), R-axe-ui-only W-3 and ci-shards (full suites for a `ci.yml` change); coordinator (persona build plus vitest out of memory). R-233 W-5 is applied (own persona build).
- Proposal: Gotchas "One build": «heavy runs one at a time (full vitest, check, a persona build, E2E); while personas run, E2E only with `--grep` of the affected tags; the full run is CI's». "Before marking anything complete": «a check red identically on `origin/main` is named under "Blocked on me" and does not block»; for a change outside the app paths, lint and the checks it affects only.

### G14 Working on an issue: partial delivery, stale text (6 + coordinator)

- Files: 65 (part of a decided issue needed a new decision: shipped with `Refs`, `entscheiden` set again), R-147 #1 (a "Done means" bullet voided by an earlier change), 74 (premise already fixed by #25), 138-93-92 (issue names the test file), R-241 #3 (issue describes a state the app cannot reach), R-233 W-1 (split issue; applied in `pull-request`); coordinator (`Refs` vs `Fixes` when one issue of a group is not ready).
- Proposal: «When part of a ready issue needs a new decision, ship the rest with `Refs #n`, ask in the issue and set `entscheiden` again; issues of the group that are done get `Fixes`.» «An issue an earlier change already fixed: pin it with a test red without that fix, close it naming the fixing pull request.» Task template "Problem": how a landlord reaches the state; "Done means" names behaviour, not test files.

### G15 Decided texts vs review findings (5 + coordinator)

- Files: R-241 #1 (decided label wrong for cases its example missed), 247-230-232 (does wording under "Options" count as decided?), 65 (an option targeted a code path that never runs), 109-67-69 (overlapping pull request carries the same text), R-208 #3 (task's own doc vs code: fixed on the wrong side, no decision needed); coordinator (W3f #388: a reviewer Major against a PO-decided wording the worker cannot fix).
- Proposal: the reviewer prompt (skill `slice-review`) names the texts the issue decided; a finding against one is reported as «needs product decision», not as a Major for the worker. `grill-me`: check each decided text against the cases the code produces before writing "Decided". Wording only under "Options" is not decided.

### G16 Migration numbering (4 + coordinator)

- Files: 115 (renumbered twice), 138-93-92, 79, 97-101; coordinator (0016, 0018, 0019, 0020 each clashed; #297 went 0010 → 0018 → 0020 → 0021; merged dev databases need `db:reset`).
- Proposal: `backend/CLAUDE.md` "Layout": «take the number after the last merge of `origin/main` before the push; tests, plan and docs name the migration without its number». Optional: a CI check that no two migrations share a number. Note in "Troubleshooting" that a renumbered migration needs `db:reset` of the dev database.

### G17 `fach-reviewer` wait vs `tdd` (3, plus 3 "paid off")

- Cost: 131, 86 (tests written red in bulk: horizontal slicing `tdd` warns against), 357 (G3). R-186 W-7 is applied.
- What the rule caught: R-208 F-1 (PDF explanation contradicted), 89 V-1 and M-1 (Art. 269d OR), R-241 V-1 (decided label false).
- Proposal: keep the rule; in `tdd`: «the wait for `fach-reviewer` is the one allowed batch of red tests».

### G18 Workflow 5, `daten-pruefer` (4)

- Files: 97-101 (numbering change, no amount: skipped by judgement), R-208 #2 (no session: cannot see fr/it/en PDFs), R-209 #3 (case not in demo data), 247-230-232 (checks a later fix on a copy). R-229 #2, R-226 #4, R-241 #5 are applied ("after the persona").
- Proposal: trigger «amounts, PDF content or QR-bill fields»; a PDF text change in several languages names one persona run per language; `daten-pruefer` may create records in its own demo building, else the case rests on pg tests (say so).

### G19 Merging with an open Blocker/Major (1 + coordinator)

- Files: R-142 W-1 (applied: check open `entscheiden` issues first); coordinator (12 of about 45 pull requests green but unmerged waiting on the product owner, often for pre-existing Majors moved into new `entscheiden` issues: #386, #387, #388, #352, #353).
- Check: `CLAUDE.md` "Done means" lets a task finish with a Blocker/Major that needs a product decision or existed before; "When to ask" asks before «merging while a Blocker/Major is open» without that exception; skill `pull-request` makes it explicit that this «includes the two kinds "Done means" lets a task finish with». Not a contradiction in words, but the skill turns the narrower reading into the rule, so "Done means" item 4 ends in "Blocked on me" every time.
- Proposal: «A Blocker/Major moved into its own issue that the change does not make worse does not block the merge»; change "When to ask" to «merging while a Blocker/Major of this change is open» and drop the parenthesis in `pull-request`.

### G20 CI from a session (4 + coordinator)

- Files: R-axe-ui-only W-2 and ci-shards (`.github/workflows/` is not in the re-review paths; round-1 Major was a gate green with no test run), ci-shards (required checks not readable), o34 (CI logs only via `get_job_logs` with `return_content`; artifacts 403), R-e2e-speed W-2 (a pull request without an issue); coordinator (a pull request with a merge conflict gets no CI at all; three sessions waited on CI that never ran).
- Proposal, `pull-request` "Open and drive": «no check runs on a pull request that is not mergeable: merge `origin/main` first»; «read CI logs with `get_job_logs` (`return_content: true`), artifacts are not reachable»; add `.github/workflows/` to the closing-review paths; a pull request without an issue names the request and its scenario or `No scenario`. Name the required checks in `docs/test-pyramid.md`.

### G21 Glossary markers and naming (4)

- Files: 79 and 358 (an entry «geplant (#n)» the closing pull request may not touch), R-186 W-2 (guard rejects «Abs.»), R-217 W-7 («Beleg» vs `document` in identifiers).
- Proposal: a session may drop the «geplant (#n)» of the issue it closes, or `check-issues.mjs` lists such markers for the product owner without holding the merge; the German guard allows abbreviations ending in «.».

### G22 Ask rules in unattended sessions (1 + coordinator)

- Files: 115 (`git checkout *-- *` prompt nobody saw); coordinator (`rm -r*`, `rm -f*`, `git checkout *-- *`, compound python/sed commands: 6 interrupts, W5, W5b twice, W7c, W9c's `fach-reviewer` subagent).
- What the rules catch: destructive commands; no note reports one caught. Cost: stalled sessions until a human or coordinator noticed.
- Proposal: keep the rules; Gotchas "Cloud sessions" names the commands that prompt and the alternatives (show a red by Edit out and back, not `git checkout --`; no `rm`, files in the scratchpad; one tool per command); a coordinator copies that line into every prompt.

### G23 Plan archive (coordinator)

- The archive `docs/archive/implementation-plan-verlauf.md` conflicts on every merge of `main` when many sessions archive at once.
- Proposal: one archive file per session (`docs/archive/sessions/<branch>.md`), or archive at the end of the file with a `merge=union` attribute.

### G24 Single points (one file each)

- R-209 #2: Prettier applies to `src/` only (`.prettierignore`); run the check from the root.
- 83-84: Fedlex via the filestore HTML with `curl`, WebFetch 503.
- R-axe-ui-only W-1: `docs/design/arbeitsregeln.md:20` «never edit the workflow» reads as general; scope it to the redesign.
- w3d: no commit type for a test-only commit (`chore(tests)`).
- 117-145-58: `code-reviewer` checks a value is rendered before asking to change its text.
- R-241 #4: duplicate `offene-punkte.md` IDs (applied: `open-work.test.ts` checks them).
- R-217 W-1: a change of the default model and a new prompt as `llm:eval` triggers.
- R-217 W-8: `gh api` without GitHub MCP (applied in "Open work").
- o34: a flaky-test row names evidence, not a suspect (no rule change).

## Coordinator observations (10 parallel sessions, 2026-10-16/17)

Merged into the groups above as one source each:

| Observation | Group |
|---|---|
| One pull request per issue vs related issues given together; workers had to choose | G2 |
| Ask rules stall unattended cloud sessions; 6 nudges (W5, W5b twice, W7c, W9c's `fach-reviewer`) | G22 |
| A "dirty" pull request gets no CI; three sessions waited | G20 |
| Migration numbers clash (0016, 0018, 0019, 0020; #297 renumbered three times); dev databases need `db:reset` | G16 |
| Decision-style "Done means" vs implementing "Decided" | G1 |
| Plan archive conflicts on every merge of `main` | G23 |
| Partial delivery: `Refs` vs `Fixes` when one issue of a group is not ready | G14 |
| Persona build plus vitest out of memory in one container | G13 |
| Sessions created from a revision start detached or on an old branch; the hook message comes late | G12 |
| 12 of ~45 pull requests green but unmerged on pre-existing Majors moved to `entscheiden` issues (#386, #387, #388, #352, #353); `pull-request` is stricter than `CLAUDE.md` "Done means" | G19 |
| Reviewer Major against a decided wording (W3f #388) cannot be fixed by the worker | G15 |
| Persona runs need SQL-seeded data; sessions edited or removed demo rows in `dwello_persona` | G4 |
| The collected review was left to the coordinator by most workers | G8 |
