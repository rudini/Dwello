# Workflow notes: #699, #706, #708

| Rule | What happened in this task | Proposed change |
|---|---|---|
| Skill `issue-work`, first bullet («add the label when you find one without it») | All three issues change scenarios that are not `@wip` on `main` and had no `needs-decision`. The product owner decided all three in the same session within minutes (AskUserQuestion), so adding the label and removing it again would only have produced two label events; the session skipped it. | Add `needs-decision` only when the decision is not taken in the session that found the gap. |
| `CLAUDE.md`, Workflow 1 («scenarios are the specification») with `tests/e2e/CLAUDE.md` («A step refactoring that checks the same is free») | A renamed step that checks the same still needs `Spec change approved`, because its feature lines change; only a change to the step body is free. Clear in the end, but the two sentences read as if a pure rename were free. | Say in `tests/e2e/CLAUDE.md` that a step refactoring is free only when no feature line changes. |
