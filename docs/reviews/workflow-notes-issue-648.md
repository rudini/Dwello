# Workflow notes: issue 648

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, Workflow 9, and skill `pull-request` (push and merge by the session) | Renaming a label is a repository setting a cloud session cannot write (HTTP 403), and `check-issues.mjs` reads the label on every CI run, so the push had to wait for the product owner's rename (code review C-1). | Name in the skill `pull-request` that a change needing a repository setting (labels, rulesets) lists the owner's commands under "Blocked on me" before the push. |
| `CLAUDE.md`, "Open work" (non-functional points stayed in `offene-punkte.md` «until the quality requirements are set up») | 107 rows had piled up; four checkers found 105 still true, 2 done or partly done. | None; the rows are issues now (#648). |
