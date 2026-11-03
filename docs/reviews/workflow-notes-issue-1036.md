# Workflow notes: #1036

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, Workflow 2 («every new test was seen red») | A container restart lost the worker's report and log with the red runs. Afterwards the red runs could only be judged from the code (code review 1036-1). | Ask a worker to put each red-run line into the commit message of the commit that adds the test, so the evidence survives a restart. |
| `tests/e2e/CLAUDE.md`, "No scenario" / global records | A scenario that changes a global setting (Abrechnungsperiode) needed its own home: the worker added the tag `@frische-installation` and a script that sets the period directly in the database. | Name the fresh installation as the place for scenarios that change a global setting, with the tag. |
