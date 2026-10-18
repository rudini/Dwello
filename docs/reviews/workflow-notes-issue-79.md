# Workflow notes: issue #79 (Saldo rounded in the tenant's favour)

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, Workflow 1 and 2 («every new test was seen red») | Two display tests (detail page, PDF) feed a new Saldo into code the change does not touch; they could only be shown red by flipping a sign or putting the old rounding back by hand. | Say that a test pinning existing display code to new data shows its red by a deliberate mutation, and that the pull request names it. |
| `CLAUDE.md`, Design-Regeln («never edit» `UBIQUITOUS_LANGUAGE.md`) vs. the closing pull request | The glossary already carried the new rule, with «geplant (#79)» in its code column; the pull request closes #79 but may not remove the marker, and `check-issues.mjs` only checks `TODO(fachlich prüfen, #n)`. | Let a session drop a «geplant (#n)» marker of the issue it closes, or have `check-issues.mjs` list such markers for the product owner. |
| `backend/CLAUDE.md`, Layout (migrations) with parallel sessions | `0013` was free at the start and taken on `main` before the push; the file, its test filter and a doc reference had to be renamed after the merge. | Name a migration only at the push, or keep its number out of tests and docs. |
| `CLAUDE.md`, Gotchas, «One build» | The full E2E run (869 tests) next to the persona stack moved at about one test per few seconds; it was stopped in favour of the affected scenarios after the merge. | Recommend `--grep` of the affected tags while personas run; the full run stays CI's. |
