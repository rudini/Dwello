# Workflow rules review: axe check only on UI changes

Task: the CI check "Accessibility (axe)" runs only when a pull request changes the UI (`.github/workflows/ci.yml`). No issue.

## Findings

- **W-1, unclear:** `docs/design/arbeitsregeln.md:20` says "Never edit the workflow; suggestions go to `offene-punkte.md`". The task was exactly a workflow edit asked for by the product owner. The rule reads as general, but comes from the redesign brief. Proposal: scope the line to the redesign (or delete it) so that a direct request to change CI is not in apparent conflict.
- **W-2, missing:** Workflow 6 lists the paths whose change requires a re-review (`src/`, `backend/src/`, …, `.claude/hooks/`); `.github/workflows/` is not in it, although a CI change can let a broken pull request pass. In this task the review fixes to `ci.yml` needed no re-review by that rule. Proposal: add `.github/workflows/` to the list.
- **W-3, cost without benefit:** "Before marking anything complete" demands the full frontend and backend test suites for a change that touches only `ci.yml` and docs; they cannot be affected and CI runs them again. Proposal: for a change outside the app paths of Workflow 6, require only lint and the checks the change itself affects.
