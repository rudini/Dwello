# Workflow rules review, 29.10.2026

Collected review at the end of the request «open functional issues, one pull request each» (#773, #484, #512, #506, #817 with #942, #578; skill `workflow-review`). It covers the notes written since `workflow-rules-review-2026-10-28.md`; the other issues of this request wrote none.

Covered files: `workflow-notes-issue-817.md`.

## Open proposals

| # | Rule | Came up | What it costs | Proposal |
|---|---|---|---|---|
| 1 | `CLAUDE.md`, Workflow 1, with the scenarios «Stand der Datenschutzerklärung» and «Stand der Nutzungsbedingungen» and the scenarios that pin whole legal sentences | `issue-817` | Every change of a legal text waits for the product owner twice: once for the text (fach-reviewer, issue) and once for the «Stand» date, which two scenarios pin to a fixed day; added sentences had to stand apart from pinned ones. | Let the issue that decides a legal text also approve the «Stand» date in the same pull request, or check in the scenario that a «Stand» is shown and is not older than the last change of the legal texts. |
| 2 | `src/__tests__/no-german-in-code.test.ts` | `issue-817` | A German message with «lang» made unrelated code (`%lang%`) fail the check; the text had to be reworded. | Leave short words or words that are also identifiers out of the word list. |
| 3 | `tests/e2e/CLAUDE.md`, «Failure states» and «No scenario» | `issue-817` | Code review asked in two rounds for scenarios of refusals a form action builds from a failing backend call; `FailRequests` cannot reach them. | Say in «Failure states» that `FailRequests` reaches the page's error handling, not a form action's `fail()`. |
| 4 | `~/.claude/stop-hook-git-check.sh` against `CLAUDE.md`, Workflow 9 | `issue-817` (as in `workflow-rules-review-2026-10-28.md`, proposal 1); this request about 15 times | as before | as before; the product owner's setting outside the repository. |
