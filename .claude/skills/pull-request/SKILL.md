---
name: pull-request
description: Push, open, drive to green and merge the pull request of a finished Dwello task (CLAUDE.md, Workflow 9). Load when a task is done, before its first push, and on every later push, CI result or merge conflict of its pull request.
---

# Pull request

`CLAUDE.md`, "Done means", says when a task is ready for this; nothing is pushed before. Only the session that holds the product owner's task runs this skill, never a subagent or a session it started.

## Which pull requests

- One task, one pull request. Related issues of one request (they change the same files, texts, rows or screens, or the request names them together) are implemented together in one pull request with one `Fixes #n` per issue, and its description names each issue's scenario or `No scenario: <reason>`; one of them that turns out not to be ready gets `Refs #n`, a question in the issue and its place under "Blocked on me". Unrelated issues of one request get one pull request each; the closing report of each names the next.
- An issue the product owner allows to be split gets one pull request per part: `Refs #n`, the last one `Fixes #n`.
- A Blocker/Major whose fix is the decided text of another ready issue is fixed in the same pull request, which then closes both.
- A glossary term the product owner decided in the issue the task closes: when its «Decided (product owner)» names the rows, the task writes them into `UBIQUITOUS_LANGUAGE.md` and the pull request says so; otherwise the task finishes with that edit under "Blocked on me" (a marker would make CI refuse the pull request), and the pull request is merged only after the product owner made the edit.

## Before each push

1. Before the first push, merge `origin/main` once (no rebase, no force-push); later merges only as in "Open and drive". Then "Before marking anything complete" (`CLAUDE.md`) passes. Commit the reports, the plan and the archive (Workflow 8) before this push too: each later push cancels the CI run in progress and starts the full run again (only a push that changes nothing but documentation after a green run skips the tests).
2. Closing review: when code (`src/`, `backend/src/`, `backend/migrations/`, `messages/`, `tests/`, `tools/`, `.claude/hooks/`) changed since the last reviewed commit (Minor/Nit fixes, a conflict resolved in it, a CI fix), one `code-reviewer` round on that delta (skill `slice-review`), its own slice for the round limit. A merge of `main` counts only with a conflict resolved in `src/`, `backend/src/`, `backend/migrations/` or `messages/` (`git show --remerge-diff <merge>` shows it); a clean merge, or one resolved only in `tests/`, `docs/` or generated files, gets a line in the next round's prompt instead. A CI fix only in `tests/e2e/` (steps, fixtures, tasks) with a green run rides the next round, or the review of the merge it comes with, instead of a round of its own. Only a Blocker/Major it reports gets another round. A delta only in reports (`docs/reviews/`, persona reports in `docs/design/personas/`), `implementation_plan.md` or `docs/archive/` needs none, and the round's range leaves out the reviews, the plan and the archive (`git diff <base> <commit> -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/archive'`; with a merge of `main` in the delta: `git diff <last reviewed> <merge>^1`, its conflict resolution `git show --remerge-diff <merge>`, and `git diff <merge> <commit>` for what follows it, each with the same pathspec).

## Open and drive

- Push the branch, open the pull request in English with `Fixes #n` per issue (or `Refs #n` in the KI case, `backend/CLAUDE.md`); subscribe to its activity. If the session cannot wait for CI, say under "Blocked on me" that the pull request waits for CI and is not merged.
- Merge a newer `main` into the open pull request only for a merge conflict, or a red check that `main` fixes (a pull request need not be up to date with `main`: pushes to `main` run the full CI); not while it waits on the product owner. A conflict in app code (as in step 2) gets a `code-reviewer` round on the merge commit.
- Red CI: fix the cause and push. A fourth round of CI fixes needs the product owner first. Read only the failing jobs (the check runs of the latest commit, not the job list with every step), and of each log only its end or a `grep` for the error; one subagent at most per round extracts what a log holds.
- Right before merging: read the check runs of the latest commit and the open findings again. Merge with a merge commit once CI is green and the pull request is mergeable, or turn on auto-merge (merge commit) once nothing but CI is left, so GitHub merges when the required checks pass; name its CI screenshot comment, or that there is none, in the closing report.
- Never without the product owner: what `CLAUDE.md`, "When to ask", lists for pushes and merges (merging while a Blocker/Major is open includes the two kinds "Done means" lets a task finish with).

## After the merge

The push to `main` runs the full CI, every browser included; pull requests run the E2E tests in Chromium and the API driver only. A red run on `main` opens the issue «CI auf main ist rot» (job "Main status"). After the merge, arm one check-in about 45 minutes later (`send_later`) and read the run of `main` that contains the merge commit (still waiting or running: arm another check-in); when it is red, its failure is this task's, as a red check of the pull request was (one run may test several merges: the failing scenario and `git log` show whose). Fix it in a new pull request with `Fixes #<that issue>` from this branch restarted on `origin/main`, through this skill again; a failure that is not this merge's goes as a comment on the issue and under "Blocked on me".

Done when the pull request is merged and the run of `main` with its merge is green or its failure is handled as above, or the state is under "Blocked on me".
