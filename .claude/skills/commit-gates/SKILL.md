---
name: commit-gates
description: What the five Dwello commit hooks (fallow, deepcheck, testcheck, fitness, commit subject) check and how to fix what they report. Load when one of them blocks a git commit or git push, before committing one slice while the next is in progress, or to check a commit subject first.
---

# Commit gates

Five `PreToolUse` hooks (`.claude/settings.json`) run before every `git commit` and `git push` in a Bash command and block the whole command, so its edits and its `git add` are dropped too. Stage and commit in separate commands, and after a blocked commit check `git show --stat HEAD`. On push they also gate merge commits, which no commit hook sees. Fix the reported finding, never work around the gate. The hooks find the git calls with one shared matcher (`.claude/hooks/git-calls.mjs`, #710): `git -C <dir>` (quoted, `-C/x`), `-c key=val`, a `cd` or subshell before the call; text in quotes or a heredoc body is no call (its header names what it does not follow). fallow, deepcheck and testcheck judge the project wherever the call runs, also a commit in a scratch repository.

## Fallow (`.claude/hooks/fallow-gate.sh`)

- Blocks new unused exports or files, duplication, and complexity/CRAP findings. Fix them by un-exporting, deleting or splitting the function. `bunx fallow audit` shows the findings before committing; CI runs the same audit.
- A CRAP finding on a Svelte template is estimated, not measured: move expressions into `$derived` or a function, or a loop into a child component; a child component goes to a module with room under fitness `fat-module` (`$lib/<area>`), not next to its page, so the split does not trip the next gate (#1411).
- Only findings the change introduces block (`fallow audit` default gate `new-only`; a clone group on the base commit stays `"introduced": false` when a touched file's lines move around it). A duplication finding in code the change only touches: check `introduced` in `bunx fallow audit --format json` first; never reshape the code only to get past an inherited one. One the change introduces: fix it when it is small and changes no behavior (note it in the plan), else ask the product owner.
- The gate audits the working tree: to commit one slice while the next is in progress, `git stash push --keep-index -u` first and `git stash pop` after.
- A preparing export (a Parallel Change step) and its first user form one commit. A script run by hand gets a `package.json` script, which makes it an entry point.
- A clone group across translation tables (the same keys, one table per language) is an expected warning, not a finding to fix.
- When it finds no base branch (a single-branch clone) it blocks: `git fetch origin main:refs/remotes/origin/main` fixes it.

## Deepcheck (`.claude/hooks/deepcheck-gate.sh`)

Runs the changed-scope deepcheck (`bun run deepcheck:audit` shows it by hand) and blocks new or worsened shallow modules (pass-through layers, thin facades); CI runs the same check (step "Deep modules" of the job "Lint and types"). Fix the design, not the numbers; a deliberate exception needs `// deepcheck-ignore-file -- reason`.

## Testcheck (`.claude/hooks/testcheck-gate.sh`)

Runs testcheck on the changed test files (`bun run testcheck:audit` shows it by hand) and blocks a test that can pass without checking what it claims (an empty test, `expect` without a called matcher, an unawaited `resolves`/`rejects`, a tautology, assertions only in a `catch`, a swallowing `try` or an unawaited callback) and two tests of one block with the same title or the same body; CI runs the same check (step "Test checks" of the job "Lint and types"). Fix the test as the finding says (`tools/testcheck/README.md`, "Rules"); a test that is right as it is gets `// testcheck-ignore <rule> -- <reason>` on the line above it, visible in the review.

## Fitness (`.claude/hooks/fitness-gate.sh`)

On a `git commit` while a file under `src/`, `backend/src/` or `tools/fitness/` is changed, runs `bun run fitness -- --base origin/main` as CI does and blocks on an error (a fat file or module, a dependency against the layer direction, a loosened ratchet); it prints the error lines. Fix it in the slice before its review: `docs/architecture/fitness-functions.md` names each check. New files count only once Git knows them (`git add` or `git add -N` before the commit command). A run that ends without its summary line («Fitness: N errors, M warnings») passes with a notice; a push is left to CI.

CI also runs `--structure` (Ä1 `structure-maintainability`: a changed file's fallow maintainability may drop by at most 1 point); run `bun run fitness -- --base origin/main --structure` before the push. It measures the committed HEAD, so commit a fix before measuring it; in a shallow clone run `git fetch --unshallow origin main` first, or hotspot churn shows a false drop. To raise a file's score, read its row in `bunx fallow health --format json` (`fan_out`, `complexity_density`, `maintainability_index`) and lower the branches (`??`, `?.`, `||`, `&&`, ternaries) in the touched functions first; line count alone barely moves it, and a new import costs about as much as a split saves, so do not split a file only for the score (#1411).

## Commit subject (`.claude/hooks/commit-msg-gate.mjs`)

Blocks `git commit -m` with a subject that breaks `CLAUDE.md`, "Conventions" (type and scope from the lists there, at most 50 characters, no period), and a `git push` while any commit since `origin/main` (merges left out, as in CI «Commit subjects») has one, whatever gave its subject (`-F`, a heredoc file). A subject found at the push: reword the unpushed commit (`git commit --amend` for the last one). `node .claude/hooks/commit-msg-gate.mjs --check "<subject>"` checks a subject first. Commits in another repository (a scratch repository, reached by `git -C`, a `cd` or the cwd) pass; a worktree of Dwello is checked wherever it lies.

## Push to main (`.claude/hooks/main-push-guard.mjs`)

Asks before a `git push` whose resolved target is `main` (#713): a bare `git push` with `main` checked out (by `@{push}`, also with `push.default=matching` or a mirror remote), `HEAD`/`@`, `HEAD:main`, `heads/main`, `:main`, the refspecs `:` and `*`, `--all`/`--mirror`, wherever a `cd`, `git -C` or `--git-dir` points and behind `env`, variables, `command` or `timeout`. A refspec to another branch (`main-fix`) and text that only mentions a push (in quotes) pass; a `cd` or `pushd` the hook cannot resolve (`$VAR`, `~`, `cd -`) makes a push ask; a push inside backticks is not seen (one in `$(…)` is); `bash -c '…'` is not followed. It never blocks, it only asks; the ask rules for force and delete in `.claude/settings.json` stay. Tests: `tools/claude-hooks/main-push-guard.test.ts`.
