# Collected workflow review (2026-10-23)

Collected review per skill `workflow-review`, "Collected review". Only findings and proposals; nothing here is applied. The product owner decides which to apply.

## Files covered

Not covered by `workflow-rules-review-2026-10-20.md` (groups K1 to K13, T1 to T7):

- Notes (8): `workflow-notes-contributor-files.md`, `workflow-notes-issue-449.md`, `-452.md`, `-454.md`, `-576.md`, `-580.md`, `-620.md`, `workflow-notes-session-2026-10-21.md` (#368, #387, #465, #470, #477, #637).
- No per-task review (`workflow-rules-review-<task>.md`) was added since 2026-10-20.
- Left out: `workflow-notes-issue-448.md` and `-451.md`, already in the 2026-10-20 «covers» list and unchanged since that commit (`e002d0a6`).

Already applied since 2026-10-20, so no proposal: migration number at the last merge of `main` (`backend/CLAUDE.md`; 449 and 452 hit it before it landed, two renames each), inherited clone groups (`commit-gates`, `introduced`), the persona report path in `.claude/agents/persona.md` (576), `--keep-db` and `nohup` in `persona-stack.sh`.

## Groups

| # | Rule location | Count | Proposal |
|---|---|---|---|
| L1 | Commit subject gate (`commit-msg-gate.mjs`) | 3 | Check the real subject, not the shell command |
| L2 | fallow gate on touched code (`commit-gates`) | 3 | Complexity of touched code; merge in progress; translation tables |
| L3 | Shared global state (E2E rules, personas) | 3 | Lock and restore for global records; one saving persona; `--fresh` stack |
| L4 | Persona scope and triage (Workflow 5, «Done means», personas README) | 4 | Repeated Minor becomes an issue; skip for a reviewed text change; mark SQL-seeded legacy states; stack outlives the shell |
| L5 | Screen registry (Design-Regeln «Process») | 2 | Variants count as states; `default` first |
| L6 | Pull request checks and merge (`pull-request`, «Before marking anything complete», CI) | 4 | `prettier --check` on added files; read `main`'s last run; check open PRs before changing shared CI; PR body via API |
| L7 | «No scenario» reasons (`tests/e2e/CLAUDE.md`) | 1 | Reason «the failing scenario of the red run covers the fix unchanged» |
| L8 | Round limit and early tests (Workflow 1, 7) | 2 | Step-1 and step-5 reviews are separate slices; no tests for findings waiting on a decision |
| L9 | Tooling hints (Commands, `tests/e2e/CLAUDE.md`, `backend/CLAUDE.md`) | 3 | One line each |
| L10 | Contributor setup (`pull-request`, `open-work.test.ts`) | 2 | Maintainer on the ruleset bypass list |
| L11 | Harness-only (worktree Bash guard) | 1 | None, as in K13 |

### L1 Commit subject gate misses `-F` and heredocs (3)

- Files: contributor-files (six subjects of 51–53 characters on `main`), 576 (52 characters on #591), session-2026-10-21 (three subjects, two caught by CI after the push).
- Cost: two force-pushes, each needing the product owner's approval; the `-m` case of session-2026-10-21 was a miscount (`awk` counts bytes).
- Caught: subjects given with plain `-m`; CI «Commit subjects» catches the rest, but only after the push.
- Proposal: check the commit's own subject (a git `commit-msg` hook, or `git log -1 --format=%s` after the commit) instead of parsing the command; until then, `pull-request` «Before each push» runs CI's subject loop over `origin/main..HEAD`.

### L2 fallow gate on touched code (3)

- Files: 454 (a one-line change reported the file's existing `load`, cyclomatic 59, as new: extraction only for the gate; and during an open merge of `main` the audit used the old merge-base and blocked on `main`'s duplication), 449 (a translation table reported as a clone group, warn only; two identical step bodies blocked and were merged, which was right).
- Caught: the duplicate step definitions in 449.
- Proposal: in `commit-gates`, treat complexity of code the change only touches like an inherited clone (check `introduced`); during a merge of `main`, check with `FALLOW_AUDIT_BASE=origin/main` and conclude the merge when only `main`'s findings remain; name translation tables as an expected clone warning.

### L3 Shared global state (3)

- Files: 580 (axe and language looks read the global KI setting without the lock; `inTurn` and a `finally` restore added by hand; persona Dr. Weber's saves read by Marco and Sven as their own findings), 620 (setup page only on a fresh installation; two improvised instances, as #577 did).
- Cost: two persona reports with misread findings; a hand-built stack per persona.
- Proposal: (a) `tests/e2e/CLAUDE.md` «Rules»: a scenario or screen look that changes or reads a global record takes that instance's lock and restores in `finally`; (b) personas README «Who saves»: one persona saves a global setting, the others' tasks say the page may change; (c) `persona-stack.sh --fresh` (no demo data, no OAuth, fixed `SETUP_CODE`, `LLM_STUB_PULL=on`) with a port offset, one instance per persona that sets Dwello up.

### L4 Persona scope and triage (4)

- Files: 576 (three personas reported the same Minor on «Betreiber Ihrer Dwello-Installation»; by the rule it stays in three reports), session-2026-10-21 (#477: a stack rebuild and run for one decided help sentence, only Minors outside it; app on :3300 lost when the background task ended, two checks open), 452 (a state seeded by SQL that the app can no longer make was reported as a Major; triage had to show it was #379).
- Caught: nothing new in #477's run; in 576 the shared Minor is a real usability point that no rule turns into work.
- Proposal: a Minor that two or more personas meet in the same place becomes an issue; a decided text change whose domain review saw all four languages needs no persona; a task seeded by SQL with a legacy state says so, so the finding is pre-triaged; `persona-stack.sh` detaches with `setsid nohup` (or the README says how to start it so it outlives the shell).

### L5 Screen registry (2)

- Files: 449 (fixture change made the only e-mail tenant show the letter variant; the e-mail variant fell out of axe and language checks, caught as C-1 Major), 452 (first state must be `default`, found only by the a11y test).
- Caught: C-1 by `code-reviewer`, not by the rule.
- Proposal: «Process»: a change that makes an existing state show another variant checks that each variant with its own controls still has a row; each screen in `screens.json` starts with `default`.

### L6 Pull request checks and merge (4)

- Files: 576 (two added files failed CI's `prettier --check`, one CI round; a fix of the E2E summary job conflicted with a parallel fix on `main`), session-2026-10-21 (#636 merged while `main` was already red, found out afterwards; `check-issues.mjs` reads the PR body from the event, so an edited description needs a new push).
- Proposal: add `prettier --check` on files added since `origin/main` to «Before marking anything complete»; `pull-request` «Right before merging» reads the latest run of `main`; before changing a shared CI workflow, fetch `main` and look at open pull requests for the same job; read the body through the API or run on `pull_request: edited`.

### L7 «No scenario» for a red-`main` fix (1)

- File: session-2026-10-21 (#637: the failing axe example covered the fix unchanged; no listed reason fit).
- Proposal: add the reason «the failing scenario of the red run covers the fix unchanged».

### L8 Round limit and early tests (2)

- Files: 580 (six `fach-reviewer` rounds: three on the scenario, three in the feature review; counted as separate slices without a rule), 454 (tests written red before the product owner's decision encoded the rule the decision changed, V-16).
- Caught: V-16 in domain review round 2.
- Proposal: Workflow 7: the scenario review (step 1) and the feature review (step 5) are separate slices for the round limit. Workflow 1: tests for a finding waiting on a product decision are written after it.

### L9 Tooling hints (3)

- Files: 580 (`$state` needs `*.svelte.dom.test.ts`, found by trying; `llm:eval` reported 0 of 48 while backend tests recreated `dwello_test`, so the score did not tell the cause), 454 (E2E backend stdout dropped, only `console.error` shows).
- Proposal: one line each in «Commands», `tests/e2e/CLAUDE.md` «Run», and `backend/CLAUDE.md` «One backend test run at a time» (name `llm:eval`, or its own database, and print the first error when every case fails).

### L10 Contributor setup (2)

- File: contributor-files (template checklist failed `open-work.test.ts`, rewritten as bullets; «Require review from Code Owners» blocks the maintainer's own merges).
- Proposal: `pull-request` names the maintainer account on the ruleset's bypass list, or that such a merge waits for the product owner. The template exemption is optional now that it uses bullets.

### L11 Harness-only (1)

- File: 454 (worktree guard refused loops, variables and heredocs; edits via Python scripts). As in K13: no repo change.

## Decided (product owner, 2026-10-23)

Asked in the session; answers: L1 «check the real subject»; L4 «same Minor → issue», «no persona for a text», «stack outlives the shell»; L6 and L7 all four. The rest: «Entscheide selbst was sinn macht umzusetzen».

| Group | Applied | Where |
|---|---|---|
| L1 | A `git push` checks every subject since `origin/main` (merges left out), whatever gave it | `.claude/hooks/commit-msg-gate.mjs`, skill `commit-gates` |
| L2 | Partly: translation tables are an expected clone warning. Left out: complexity of touched code (it would weaken the gate), a merge-time base (no such switch in fallow's audit) | skill `commit-gates` |
| L3 | Partly: (a) lock and `finally` restore for global records; (b) one persona saves a global setting. Left out: `--fresh` stack (much work for two cases) | `tests/e2e/CLAUDE.md`, personas README |
| L4 | Minor met by two or more personas becomes an issue; no persona for a decided text read by `fach-reviewer` in four languages; servers started with `setsid nohup`. Left out: marking SQL-seeded states (not chosen) | skill `slice-review`, `CLAUDE.md` Workflow 5, `persona-stack.sh` |
| L5 | One row per variant with its own controls; `default` first | `CLAUDE.md` Design-Regeln «Process» |
| L6 | Latest run of `main` read before merging; Prettier on added files before «complete»; PR text read through the API (`PR_NUMBER`). Left out: the shared-workflow check (one case) | skill `pull-request`, `CLAUDE.md`, `check-issues.mjs`, `ci.yml` |
| L7 | «No scenario» reason for a red-`main` fix | `tests/e2e/CLAUDE.md` |
| L8 | Step-1 and step-5 domain reviews count as separate slices; tests for a finding waiting on a decision come after it | `CLAUDE.md` Workflow 1, 7 |
| L9 | Runes need `*.svelte.dom.test.ts`; E2E drops backend stdout; `llm:eval` on `dwello_test` counts as a backend test run | `CLAUDE.md` Commands, `tests/e2e/CLAUDE.md`, `backend/CLAUDE.md` |
| L10 | Not applied: the bypass list is a GitHub setting outside the repository | — |
| L11 | Nothing to apply | — |
