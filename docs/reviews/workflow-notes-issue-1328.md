# Workflow notes: #1328

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, Workflow 1 («Scenarios are the specification»), and skill `issue-work` | The product owner approved a new Übersicht text with the one scenario I named (`dashboard.feature:142`). The E2E run then showed a second scenario (`dashboard.feature:161`) checking a fragment of the old text; it needed a second approval round, first refused, then approved. | Before asking for a spec change of a text, grep every feature file for each sentence and fragment of its current value (all of them, not only the scenario that quotes it whole) and name every hit in the request. |
