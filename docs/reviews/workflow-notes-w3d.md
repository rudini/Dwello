# Workflow notes W3d (#62, #75)

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, "Open work" (issue "Done means" from the template "Decision") | Both issues carry the decision template's "Done means" («an implementation issue is created»), but the coordinator asked to implement them directly. The decision became the requirement; no implementation issue was opened. | When the product owner decides in the issue and the change is small, let the decision issue's "Done means" read «implemented, or an implementation issue exists». |
| `CLAUDE.md`, "Conventions: Commits" (types) | A commit that only adds a `@wip` scenario and its steps has no fitting type (`feat`, `fix`, `docs`, `chore`); it went in as `docs(tests)`. | Name the type for test-only commits (e.g. `chore(tests)`) in the list. |
