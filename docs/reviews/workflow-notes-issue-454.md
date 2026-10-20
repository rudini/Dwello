# Workflow notes: #454

| Rule (location) | What happened in this task | Proposed change |
|---|---|---|
| Workflow 1 (red tests while `fach-reviewer` reports, `CLAUDE.md`) | Lower-layer tests written red after domain review 1, before the product owner's decisions, encoded the rule the decision then changed (`statement-invoices.pg.test.ts` «meldet nichts, wenn der Verbrauch gleich bleibt», found as V-16 in round 2). | Say that tests for a finding waiting on a product decision are written only after it; until then only the scenarios of the findings without one. |
| Commit gates, fallow (skill `commit-gates`) | A one-line change in `src/routes/contracts/[id]/+page.server.ts` made the gate report the file's existing `load` (cyclomatic 59) as new; the mapping had to move into `toContract` with a helper to commit. | As in `workflow-notes-issue-199.md` for duplication: name complexity of code the change only touches, and allow a small extraction without asking. |
| `tests/e2e/CLAUDE.md` (debugging a failing state) | The E2E backend's stdout is dropped (`playwright.config.ts`, webServer), so a `console.log` added to find why `decline-dialog` failed showed nothing; `console.error` did. | One line under «Run»: backend output reaches the run's log only on stderr. |
| Worktree guard (session) | Compound shell commands with variables, loops or heredocs containing `$` were refused; edits went through Python scripts in the scratchpad. | As in `workflow-notes-issue-199.md`. |
