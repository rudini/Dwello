# Workflow rules review 2026-11-01 (2)

Collected review of the workflow notes that no dated review covers yet (skill `workflow-review`, «Collected review»). The only such note is from the second part of the NFR session.

Covered files: `workflow-notes-nfr-part-2.md`.

| # | Rule | Count | Cost the note shows | Proposal |
|---|---|---|---|---|
| 1 | `CLAUDE.md`, «Done means» («more visible» when a persona meets an older Blocker/Major in its task) together with skill `pull-request`, «Never without the product owner» | 1: #683 | One question to the product owner about a rule they had already decided in #186 (scenario «Geänderte vordefinierte Kategorie nennt keinen festen Grund»). The persona met it only because its task asked it to switch the choice. | A persona finding that contradicts an earlier issue's decision becomes a `needs-decision` issue and does not hold up the merge, unless the change breaks that decision. |
| 2 | `CLAUDE.md`, Gotchas, «Branches» | 1: #683, #681 | None in this session, but the way of working is unwritten: the next issue was prepared on a local branch and cherry-picked after the merge. | Name it in «Branches» as an allowed way of working. |
| 3 | Skill `bdd-acceptance` and `CLAUDE.md`, Workflow 1 (watch the scenario fail at the missing behavior) | 1: #681 | A scenario that was red at an earlier step looked as if it had been seen red. The code review caught it (681-review-1 C-1), which cost one extra round. | Add: a scenario with several new behaviors is seen red for each behavior on its own step. |
| 4 | Stop hook `~/.claude/stop-hook-git-check.sh` | 1 more (as in `workflow-rules-review-2026-11-01.md`, row 1) | Two turns that only answered «Workflow 9 holds the push». | As there: a setting outside the repository. |
