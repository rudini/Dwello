---
name: commit-gates
description: What the four Dwello commit hooks (fallow, deepcheck, testcheck, commit subject) check and how to fix what they report. Load when one of them blocks a git commit or git push, before committing one slice while the next is in progress, or to check a commit subject first.
---

# Commit gates

Four `PreToolUse` hooks (`.claude/settings.json`) run before every `git commit` and `git push` in a Bash command and block the whole command, so its edits and its `git add` are dropped too. Stage and commit in separate commands, and after a blocked commit check `git show --stat HEAD`. On push they also gate merge commits, which no commit hook sees. Fix the reported finding, never work around the gate. The hooks find the git calls with one shared matcher (`.claude/hooks/git-calls.mjs`, #710): `git -C <dir>` (quoted, `-C/x`), `-c key=val`, a `cd` or subshell before the call; text in quotes or a heredoc body is no call (its header names what it does not follow).

## Fallow (`.claude/hooks/fallow-gate.sh`)

- Blocks new unused exports or files, duplication, and complexity/CRAP findings. Fix them by un-exporting, deleting or splitting the function. `bunx fallow audit` shows the findings before committing; CI runs the same audit.
- A CRAP finding on a Svelte template is estimated, not measured: move expressions into `$derived` or a function, or a loop into a child component.
- Only findings the change introduces block (`fallow audit` default gate `new-only`; a clone group on the base commit stays `"introduced": false` when a touched file's lines move around it). A duplication finding in code the change only touches: check `introduced` in `bunx fallow audit --format json` first; never reshape the code only to get past an inherited one. One the change introduces: fix it when it is small and changes no behavior (note it in the plan), else ask the product owner.
- The gate audits the working tree: to commit one slice while the next is in progress, `git stash push --keep-index -u` first and `git stash pop` after.
- A preparing export (a Parallel Change step) and its first user form one commit. A script run by hand gets a `package.json` script, which makes it an entry point.
- A clone group across translation tables (the same keys, one table per language) is an expected warning, not a finding to fix.
- When it finds no base branch (a single-branch clone) it blocks: `git fetch origin main:refs/remotes/origin/main` fixes it.

## Deepcheck (`.claude/hooks/deepcheck-gate.sh`)

Runs the changed-scope deepcheck (`bun run deepcheck:audit` shows it by hand) and blocks new or worsened shallow modules (pass-through layers, thin facades); CI runs the same check (job "Deep modules"). Fix the design, not the numbers; a deliberate exception needs `// deepcheck-ignore-file -- reason`.

## Testcheck (`.claude/hooks/testcheck-gate.sh`)

Runs testcheck on the changed test files (`bun run testcheck:audit` shows it by hand) and blocks a test that can pass without checking what it claims (an empty test, `expect` without a called matcher, an unawaited `resolves`/`rejects`, a tautology, assertions only in a `catch`, a swallowing `try` or an unawaited callback) and two tests of one block with the same title or the same body; CI runs the same check (job "Test checks"). Fix the test as the finding says (`tools/testcheck/README.md`, "Rules"); a test that is right as it is gets `// testcheck-ignore <rule> -- <reason>` on the line above it, visible in the review.

## Commit subject (`.claude/hooks/commit-msg-gate.mjs`)

Blocks `git commit -m` with a subject that breaks `CLAUDE.md`, "Conventions" (type and scope from the lists there, at most 50 characters, no period), and a `git push` while any commit since `origin/main` (merges left out, as in CI «Commit subjects») has one, whatever gave its subject (`-F`, a heredoc file). A subject found at the push: reword the unpushed commit (`git commit --amend` for the last one). `node .claude/hooks/commit-msg-gate.mjs --check "<subject>"` checks a subject first. Commits in another repository (a scratch repository, reached by `git -C`, a `cd` or the cwd) pass; a worktree of Dwello is checked wherever it lies.

## Push to main (`.claude/hooks/main-push-guard.mjs`)

Asks before a `git push` whose resolved target is `main` (#713): a bare `git push` with `main` checked out (by `@{push}`, also with `push.default=matching` or a mirror remote), `HEAD`/`@`, `HEAD:main`, `heads/main`, `:main`, the refspecs `:` and `*`, `--all`/`--mirror`, wherever a `cd`, `git -C` or `--git-dir` points and behind `env`, variables, `command` or `timeout`. A refspec to another branch (`main-fix`) and text that only mentions a push (in quotes) pass; a `cd` or `pushd` the hook cannot resolve (`$VAR`, `~`, `cd -`) makes a push ask; a push inside backticks is not seen (one in `$(…)` is); `bash -c '…'` is not followed. It never blocks, it only asks; the ask rules for force and delete in `.claude/settings.json` stay. Tests: `tools/claude-hooks/main-push-guard.test.ts`.
