---
name: pull-request
description: Push, open, drive to green and merge the pull request of a finished Dwello task (CLAUDE.md, Workflow 9). Load when a task is done, before its first push, and on every later push, CI result or merge conflict of its pull request.
---

# Pull request

`CLAUDE.md`, "Done means", says when a task is ready for this; nothing is pushed before. Only the session that holds the product owner's task runs this skill, never a subagent or a session it started.

## Which pull requests

- One task, one pull request. Related issues of one request (they change the same files, texts, rows or screens, or the request names them together) are implemented together in one pull request with one `Fixes #n` per issue; one of them that turns out not to be ready gets `Refs #n`, a question in the issue and its place under "Blocked on me". Unrelated issues of one request get one pull request each; the closing report of each names the next.
- An issue the product owner allows to be split gets one pull request per part: `Refs #n`, the last one `Fixes #n`.
- A Blocker/Major whose fix is the decided text of another ready issue is fixed in the same pull request, which then closes both.
- A glossary term the product owner decided in the issue the task closes: the task finishes with that edit to `UBIQUITOUS_LANGUAGE.md` under "Blocked on me" (a marker would make CI refuse the pull request), and the pull request is merged only after the product owner made the edit.

## Before each push

1. Before the first push, merge `origin/main` once (no rebase, no force-push); later merges only as in "Open and drive". Then "Before marking anything complete" (`CLAUDE.md`) passes.
2. Closing review: when code (`src/`, `backend/src/`, `backend/migrations/`, `messages/`, `tests/`, `tools/`, `.claude/hooks/`) changed since the last reviewed commit (Minor/Nit fixes, a conflict resolved in it, a CI fix), one `code-reviewer` round on that delta (skill `slice-review`), its own slice for the round limit. Only a Blocker/Major it reports gets another round. A delta only in reports (`docs/reviews/`, persona reports in `docs/design/personas/`), `implementation_plan.md` or `docs/archive/` needs none, and the round's range leaves out the reviews, the plan and the archive (`git diff <base> <commit> -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/archive'`; with a merge of `main` in the delta: `git diff <last reviewed> <merge>^1`, its conflict resolution `git show --remerge-diff <merge>`, and `git diff <merge> <commit>` for what follows it, each with the same pathspec).

## Open and drive

- Push the branch, open the pull request in English with `Fixes #n` (or `Refs #n` in the KI case, `backend/CLAUDE.md`); subscribe to its activity. If the session cannot wait for CI, say under "Blocked on me" that the pull request waits for CI and is not merged.
- Merge a newer `main` into the open pull request only for a merge conflict, a red check that `main` fixes, or when GitHub refuses the merge because the branch is behind; not while it waits on the product owner. A conflict in app code gets a `code-reviewer` round on the merge commit.
- Red CI: fix the cause and push. A fourth round of CI fixes needs the product owner first.
- Right before merging: read the check runs of the latest commit and the open findings again. Merge with a merge commit (the repository has no auto-merge) once CI is green and the pull request is mergeable; name its CI screenshot comment, or that there is none, in the closing report.
- Never without the product owner: what `CLAUDE.md`, "When to ask", lists for pushes and merges (merging while a Blocker/Major is open includes the two kinds "Done means" lets a task finish with).

Done when the pull request is merged, or its state is under "Blocked on me".
