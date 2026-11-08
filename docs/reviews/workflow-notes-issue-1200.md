# Workflow notes: #1200

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, Workflow 1 («Until it reports back, write tests … and watch them fail») and skill `tdd` («One test at a time», no horizontal slicing) | While the fach-reviewer wrote the texts, Workflow 1 asked for tests ahead; I wrote eight lower-layer tests red at once. Two of them pinned params (`left`/`right`, then `part`) the review changed, and one guessed a part (`* ()`) that the implementation had to follow. | In `tdd`, say that tests written during the step-1 wait are drafts: keep them to codes and params the issue or the decision fixes, and expect to rewrite the rest after the review. |
