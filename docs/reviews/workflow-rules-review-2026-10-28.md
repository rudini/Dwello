# Workflow rules review, 28.10.2026

Collected review at the end of the session «Phase 2 Refactoring mit Fitness Functions» (skill `workflow-review`). It covers every workflow note written since the last numbered review (`workflow-rules-review-6.md`, 14.10.2026); no dated collected review existed before. Each point was checked against `main` (0efe4eb1) before it was taken up: what has been applied since is listed as done, not proposed again. Points this session met without writing a note (the issues of Phase 2 after #910) are marked «this session».

Covered files: `workflow-notes-issue-94.md`, `-issue-620.md`, `-h28-heating-hints.md`, `-issue-643.md`, `-issue-648.md`, `-architecture-phase-2.md`, `-issue-790.md`, `-deps-graph.md`, `-issue-788.md`, `-issue-815.md`, `-issue-837-c2.md`, `-issue-837-c4a.md`, `-testcheck.md`, `-issue-655.md`, `-issue-676.md`.

## Open proposals

| # | Rule | Came up | What it costs | Proposal |
|---|---|---|---|---|
| 1 | `~/.claude/stop-hook-git-check.sh` against `CLAUDE.md`, Workflow 9 | `architecture-phase-2` («as in earlier notes»); this session about 40 times | Each review wait ends in a turn that only answers «holding the push». The hook never changed a decision. | The hook lies outside the repository, so this is the product owner's setting: let it stay silent while a reviewer subagent runs, or when the unpushed commits are on a branch whose pull request is not yet opened. Nothing in the repository needs to change. |
| 2 | Skill `slice-review`, 1 «Worktree» (`node_modules` linked into the review worktree) | `issue-837-c4a`; this session in every review round (i654, i781, i910, i916, i922) | Every reviewer lists the test runs as «reported by the caller»; the link exists but the deny rule blocks it, so it buys nothing. | Drop the link from step 1 and say that the reviewer judges the checks the prompt names (as it already does), or allow running (not reading) through the link. |
| 3 | `tools/arch-baseline/run.sh` writes into the committed `out/` | `issue-788`, `issue-837-c2`, `issue-837-c4a`; this session twice (#910, #912) | About 40 tracked files rewritten per measurement and restored by hand each time. `lib.ts` already honours `ARCH_OUT`; `run.sh` sets `OUT=tools/arch-baseline/out` itself. | Let `run.sh` take `ARCH_OUT` (default `out/`) and say in `docs/architecture/baseline.md` that a later measurement reports numbers with `ARCH_OUT=$(mktemp -d)`; only a new baseline commits `out/`. |
| 4 | `tools/fitness` literal-set check counts `Pick`/`Omit` key unions | `issue-837-c2`, `issue-837-c4a` | Twice a type was rewritten only to get past the check (`Partial<ContractRow>`, a derived type). | Skip string unions that are the second argument of `Pick`/`Omit` (property keys, not values). |
| 5 | Skill `commit-gates` (fallow `unused-export`, `unused-file`) | `architecture-phase-2` (a preparing export); this session (#781: a tool run by hand) | A Parallel Change step could not be its own commit; a hand-run script needed a `package.json` script before fallow accepted it. | One line each in `commit-gates`: a preparing export and its first user form one commit; a script run by hand gets a `package.json` script, which makes it an entry point. |
| 6 | `CLAUDE.md`, Workflow 7 and skill `pull-request` («Before each push», closing round for `tools/`) | `architecture-phase-2` | Three closing rounds on a comment line, a moved JSDoc or `fitness --update` output; none found anything. | Exempt comment-only deltas and generated ratchet updates (`--update` output) from the closing round, like reports and the plan. |
| 7 | `docs/design/personas/README.md`, «Build-time values» | `issue-676` | One persona run on a build that showed «Version unbekannt», reported as a Blocker. | Write the example as `APP_VERSION=v0.4.0` and say that a development version takes the `git describe` form (`v0.12.0-123-gabcdef1`). |
| 8 | `tests/e2e/CLAUDE.md`, «No scenario» | `issue-676` | An issue asked for a layout test the E2E build cannot produce. | Add «a build-time value other than the one the E2E build bakes in (`APP_VERSION`)», with a persona build as the check of the real layout. |
| 9 | `CLAUDE.md`, «Design-Regeln», Process (rows in `tests/a11y/screens.json`) | `issue-655` | An unclear rule, resolved by the code reviewer. | Say that a state without a row whose message only moves into a field (an error slot another row covers) needs no new row. |
| 10 | Skill `slice-review`, 2 «The prompt» (report name `<slice>-review-<n>.md`) | `issue-788` | A reused slice name overwrote an earlier report in `docs/reviews/`. | Say that the slice name must not exist in `docs/reviews/` yet (`ls docs/reviews/<slice>-*`). |
| 11 | `CLAUDE.md`, «Documentation (read when relevant)» | `deps-graph` | A request was planned before anyone knew the import graph and cycle check already existed. | Add `docs/architecture/fitness-functions.md` (architecture checks in CI, `bun run fitness`, `bun run fitness:p2`). |
| 12 | Skill `pull-request` (push and merge by the session) | `issue-648` | A push waited on a label rename the session cannot make (HTTP 403). | Say that a change needing a repository setting (labels, rulesets) lists the owner's commands under «Blocked on me» before the push. |
| 13 | `CLAUDE.md`, Workflow 2 («the commit that adds it says so») with slice-review's «do not amend» | `issue-815` | A pinning test's commit could not be reworded while under review. | Allow the statement in the pull request text, or in the next commit's message, for a commit already under review. |
| 14 | No rule (security alerts) | `issue-790` | The alert APIs answer 403; a local CodeQL run (1.4 GB) was found by trial. | Name the way in skill `issue-work`: CodeQL alerts arrive as `nfr:security` issues; the current state comes from a local `codeql database analyze` with the `*-code-scanning.qls` suites and `bun audit` in the root and `backend/`. |

## Applied since the note

| Rule | Note | Now |
|---|---|---|
| Commit subject of `git commit -F` / heredoc | `h28-heating-hints`, `issue-790`, `architecture-phase-2` | The gate checks `-F -` too; this session it blocked a 51- and a 53-character subject given that way. |
| E2E browser shim and «check the links first» | `architecture-phase-2`, `issue-790` | `.claude/hooks/pw-shim.sh` knows both layouts; `tests/e2e/CLAUDE.md` says to check the links before running again. |
| Persona stack for a fresh installation | `issue-620` | `persona-stack.sh --fresh` (#774). |
| A Major that needs a product decision blocks the merge | `issue-94` | `CLAUDE.md`, «When to ask»: merging while such a Major is open needs the product owner. |
| Refusal codes of `CodedError` subclasses | `issue-94` | `backend-codes.test.ts` matches `new \w+(…)` (#716). |
| A global setting in parallel scenarios | `issue-94` | `tests/e2e/CLAUDE.md`, «Global records», with `withSettingsLock`. |
| CRAP of a Svelte template | `issue-94` | `commit-gates` names `$derived` or a child component. |
| `grill-me` without an issue | `issue-643` | The skill covers a request that has none yet. |
| `DATE_CMP` and `===` against today | `issue-815` | #815 part D3. |
| New untracked files and `bun run fitness` | `architecture-phase-2` | Named in `docs/architecture/fitness-functions.md` (`git add -N`). |
| Hand-run evaluation scripts; heredocs naming `git commit` | `testcheck` | Decided by the product owner on 26.10.2026 and applied. |

## Not checked

- `issue-815`, third row: whether the import scan of `bun run fitness` still misses a staged file. `02-imports.ts` reads the working tree today, but the note's case (a staged fixture) was not reproduced.
