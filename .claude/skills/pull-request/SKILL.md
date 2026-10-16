---
name: pull-request
description: Push, open, drive to green and merge the pull request of a finished Dwello task (CLAUDE.md, Workflow 9). Load when a task is done, before its first push, and on every later push, CI result or merge conflict of its pull request.
---

# Pull request

`CLAUDE.md`, "Done means", says when a task is ready for this; nothing is pushed before. Only the session that holds the product owner's task runs this skill, never a subagent or a session it started.

## Which pull requests

- One task, one pull request. A request that covers several issues is one session with one pull request per issue; the closing report of each names the next.
- An issue the product owner allows to be split gets one pull request per part: `Refs #n`, the last one `Fixes #n`.
- A Blocker/Major whose fix is the decided text of another ready issue is fixed in the same pull request, which then closes both.

## Before each push

1. Before the first push: "Before marking anything complete" (`CLAUDE.md`). Before a later one: lint, check and the tests its change affects; CI runs the rest.
2. Closing review: when code (`src/`, `backend/src/`, `backend/migrations/`, `messages/`, `tests/`, `tools/`, `.claude/hooks/`) changed since the last reviewed commit (Minor/Nit fixes, a conflict resolved in it, a CI fix), one `code-reviewer` round on that delta (skill `slice-review`). Only a Blocker/Major it reports gets another round; its Minors/Nits are fixed or recorded as open work.

## Open and drive

- Push the branch, open the pull request in English with `Fixes #n` (`Refs #n` for a KI prompt not measured with the default model, `backend/CLAUDE.md`), the scenario or `No scenario: <reason>`, and the checks with their exit codes; subscribe to its activity. If the session cannot wait for CI, say under "Blocked on me" that the pull request waits for CI and is not merged.
- A merge conflict: merge `origin/main` (no rebase, no force-push). A conflict in app code gets a `code-reviewer` round on the merge commit.
- Red CI: fix the cause and push. A fourth round of CI fixes needs the product owner first.
- Right before merging: read the check runs of the latest commit and the open findings again. Merge with a merge commit (the repository has no auto-merge) once CI is green and the pull request is mergeable; name its CI screenshot comment, or that there is none, in the closing report.
- Never without the product owner: a push or pull request where they said to only commit, a push to `main`, a force-push, merging with a red check (also one red on `main`), merging while a Blocker/Major is open (also the two kinds "Done means" lets a task finish with).

A stop hook outside the repository (`~/.claude/stop-hook-git-check.sh`) may ask to commit, amend or push earlier: it does not override this skill or the slice commits of Workflow 4.

Done when the pull request is merged, or its state is under "Blocked on me".
