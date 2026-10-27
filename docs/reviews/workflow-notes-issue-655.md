# Workflow notes: issue-655

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, "Design-Regeln", Process (a new state, or a change that makes an existing state show another variant, gets rows in `tests/a11y/screens.json`) | A refusal that existed before without a row (409 «Name vergeben», form-level) moved to the Name field. Whether that is "another variant" of a state that has no row was unclear; I added no row, as `category-new` has none for the same refusal, and the code-reviewer agreed. | Say that a state without a row whose message only moves to a field (the Field error slot another row already covers) needs no new row. |
