# Workflow rules review: issue #128 (FORMULA_NOT_COMPUTABLE shows the engine's English detail)

Rules that guided the task, with what happened and a proposed change. Review only: nothing here is applied.

## R-1 An issue names the wrong cause

- **Rule:** `CLAUDE.md` "Open work" (an issue's decisions are its text) and "Coding guidelines, Before coding" (state assumptions).
- **What happened:** #128 says the detail comes from mathjs; the evaluation uses the JavaScript `Function` constructor, so the detail is the engine's `SyntaxError`/`TypeError` text. The fix is the same, but a reader of the issue would look for mathjs. Nothing asks to correct an issue's description when the work shows it wrong.
- **Proposal:** "Open work" adds: when the work shows an issue's problem description wrong in a detail that does not change the task, say so in the pull request (and, if the issue stays open, in a comment), without asking first.

## R-2 «@wip» scenario needs the page precondition the neighbours use

- **Rule:** `tests/e2e/CLAUDE.md` ("reuse existing steps first").
- **What happened:** the first `@wip` run failed for the wrong reason (no form on the page), because the step «… erfasst» does not open the form itself; the neighbouring scenario starts with «ist auf der Seite "Neuer Verteilschlüssel"». The failing line made it plain, so the cost was one run.
- **Proposal:** none; the red-for-the-right-reason check of Workflow 1 caught it as intended.
