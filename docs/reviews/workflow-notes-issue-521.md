# Workflow notes: issue #521

| Rule | What happened | Proposed change |
|---|---|---|
| `docs/design/personas/README.md`, "Running a review" (demo records a task needs) | The letter only shows after a change of the global setting «Abrechnungsperiode»; the demo data has none. To see that the persona would find a letter at all, I set the setting with a one-off backend script on `dwello_persona`, then recreated the database; the persona changed the setting itself, and the daten-pruefer needed it set again by script. The README names SQL for blocking records, not a changed global setting. | Name a changed setting next to the SQL: the task says which setting the persona changes, or the session sets it before the start and names it in the task. |
