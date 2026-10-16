---
name: workflow-review
description: Notes on the rules that guided a Dwello task, and the collected review of those notes (CLAUDE.md, Workflow 7). Load at the end of a task that changed the app, its tests or tooling (also a task that ends blocked), and when the product owner asks for a workflow review.
---

# Workflow review

The rules: `CLAUDE.md`, `tests/e2e/CLAUDE.md`, `backend/CLAUDE.md`, the skills in `.claude/skills`, the agents in `.claude/agents`, the hooks in `.claude/hooks` and the documents these make binding (`docs/test-pyramid.md`, `docs/design/personas/README.md`, `.github/ISSUE_TEMPLATE/`).

Both steps only write: change no rule, skill, agent or hook because of them, and open no issue or `offene-punkte.md` row for their findings (an exception to "Open work"). The product owner decides which to apply. Neither holds up the pull request.

## Notes per task

When: once a feature is done (also a bug fix a user can see, a change only the operator sees such as CI, startup messages or deployment, or a task that ends blocked); not for a task that changes only docs or rules. Write them before the session is archived (Workflow 8), or before the closing report when the task ends blocked.

Only where a rule was unclear, contradicted another, was missing, cost effort without benefit, or was worked around: one row per point (rule location, what happened in this task, proposed change) in `docs/reviews/workflow-notes-<task>.md`, `<task>` being the issue (`issue-42`) or, without one, a short name of the task. A point an earlier note or review already names gets «as in <file>» and only what is new. Nothing came up: no file. A note is committed with the task and named under "Found".

## Collected review

When: the product owner asks for one, or at the end of a request that covered several issues (in the session of the last one).

Read the notes and the per-task reviews (`workflow-rules-review-issue-*.md`, `workflow-rules-review-migrations-frozen.md`; the numbered `workflow-rules-review-<n>.md` are older reviews or code-review rounds and are left out) that no collected review covers yet, group them by rule, and write `docs/reviews/workflow-rules-review-<YYYY-MM-DD>.md` (`-2` for a second one that day): the files it covers, then one proposal per group with how often it came up. A proposal may also remove or shorten a rule; it names the cost the notes show and what the rule caught in the reports.

Done when the note or the collected review is committed, or it is clear that nothing came up.
