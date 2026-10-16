# Workflow notes: shard E2E and axe in CI

| Rule location | What happened in this task | Proposed change |
|---|---|---|
| `CLAUDE.md`, Workflow 6 (paths that need a re-review) | As in `workflow-rules-review-axe-ui-only.md` (W-2): the Major C-1 fix in `ci.yml` needed no re-review by the letter of the rule. New: the round-1 Major was a gate that could report green with no test run, exactly the kind of CI fault the rule should catch. | Add `.github/workflows/` to the list. |
| `CLAUDE.md`, "Before marking anything complete" | As in `workflow-rules-review-axe-ui-only.md` (W-3): full frontend and backend suites for a change to `ci.yml` and docs only. | As proposed there. |
| Branch protection (not documented) | Whether "E2E tests" and "Accessibility (axe)" are required checks is not readable from a session (403), so the task added a gate job to keep both names. | Name the required checks in `docs/test-pyramid.md`. |
