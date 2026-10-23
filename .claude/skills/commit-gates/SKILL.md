---
name: commit-gates
description: What the three Dwello commit hooks (fallow, deepcheck, commit subject) check and how to fix what they report. Load when one of them blocks a git commit or git push, before committing one slice while the next is in progress, or to check a commit subject first.
---

# Commit gates

Three `PreToolUse` hooks (`.claude/settings.json`) run before every `git commit` and `git push` in a Bash command and block the whole command, so its edits and its `git add` are dropped too. Stage and commit in separate commands, and after a blocked commit check `git show --stat HEAD`. On push they also gate merge commits, which no commit hook sees. Fix the reported finding, never work around the gate.

## Fallow (`.claude/hooks/fallow-gate.sh`)

- Blocks new unused exports or files, duplication, and complexity/CRAP findings. Fix them by un-exporting, deleting or splitting the function. `bunx fallow audit` shows the findings before committing; CI runs the same audit.
- A CRAP finding on a Svelte template is estimated, not measured: move expressions into `$derived` or a function, or a loop into a child component.
- Only findings the change introduces block (`fallow audit` default gate `new-only`; a clone group on the base commit stays `"introduced": false` when a touched file's lines move around it). A duplication finding in code the change only touches: check `introduced` in `bunx fallow audit --format json` first; never reshape the code only to get past an inherited one. One the change introduces: fix it when it is small and changes no behavior (note it in the plan), else ask the product owner.
- The gate audits the working tree: to commit one slice while the next is in progress, `git stash push --keep-index -u` first and `git stash pop` after.
- A clone group across translation tables (the same keys, one table per language) is an expected warning, not a finding to fix.
- When it finds no base branch (a single-branch clone) it blocks: `git fetch origin main:refs/remotes/origin/main` fixes it.

## Deepcheck (`.claude/hooks/deepcheck-gate.sh`)

Runs the changed-scope deepcheck (`bun run deepcheck:audit` shows it by hand) and blocks new or worsened shallow modules (pass-through layers, thin facades); CI runs the same check (job "Deep modules"). Fix the design, not the numbers; a deliberate exception needs `// deepcheck-ignore-file -- reason`.

## Commit subject (`.claude/hooks/commit-msg-gate.mjs`)

Blocks `git commit -m` with a subject that breaks `CLAUDE.md`, "Conventions" (type and scope from the lists there, at most 50 characters, no period), and a `git push` while any commit since `origin/main` (merges left out, as in CI «Commit subjects») has one, whatever gave its subject (`-F`, a heredoc file). A subject found at the push: reword the unpushed commit (`git commit --amend` for the last one). `node .claude/hooks/commit-msg-gate.mjs --check "<subject>"` checks a subject first. Commits in another repository (a scratch repository, reached by `git -C` or the cwd, not by a `cd` in the command) pass; a worktree of Dwello is checked wherever it lies.
