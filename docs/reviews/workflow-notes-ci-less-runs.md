# Workflow notes: less CI per change, run 634

| Rule location | What happened in this task | Proposed change |
|---|---|---|
| `CLAUDE.md`, Workflow 8 ("end: … move the session to the archive before the final commit") and its item "PR" | As in `workflow-notes-issue-464.md`: Session C1 stayed in the plan on `main` with its item "PR" open after #473 was merged, so this task archived it first. New: the cause is the order itself. The session moves to the archive before the push, so its "PR" item can only be ticked as "pushed after this archive"; C1 instead kept the plan for the PR's first CI result and never came back after the merge. | Say in Workflow 8 that the "PR" item is ticked when archiving, as "pushed after this archive", and that CI results after the merge go into the pull request, not the plan. |
