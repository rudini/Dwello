# Workflow notes: W4c, #64 #87 #55

| Rule | What happened in this task | Proposed change |
|---|---|---|
| Skill `pull-request`, "Which pull requests" («one pull request per issue») | As in `workflow-notes-issue-109-67-69.md`. New: #87 delegates its Mahnfrist rule to #64 («decided in #64»), so both change the same lines of `src/lib/overview.ts` and the settings; one pull request with `Fixes` for each issue. | Allow one pull request for issues whose decisions refer to each other. |
| Skill `workflow-review`, "Collected review" | As in `workflow-notes-issue-109-67-69.md`: left to the coordinator. | – |
| `tests/e2e/CLAUDE.md`, "No scenario" | The overview task «Überfällige Abrechnungen prüfen» counts the statements of every parallel scenario, and the settings (Zahlungsfrist, Mahnfrist) are global to them. Neither the task's absence during the Mahnfrist nor a non-default setting can be checked in isolation; the list of "No scenario" cases does not name this, so the reason had to be argued. The step-1 domain review even asked for such a negative scenario. | Add to the list: a result aggregated over all records (a count without a name) whose absence is to be checked, and a value of a global setting other than its default. |
| Skills `commit-gates` and `ponytail-review` | The fallow complexity gate blocked a fifth `if` in `settingsErrors`; the rules table that fixed it was then a code-review Minor (ponytail, "refactor of existing code"). | Say in skill `commit-gates` that a refactor forced by the gate is not a ponytail finding. |
