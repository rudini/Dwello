# Workflow notes: structure report

| Rule | What happened | Proposed change |
|---|---|---|
| `implementation_plan.md`, header «Parallel sessions» | At the start the plan had no open session, so this task wrote its own. Meanwhile another session opened `## Session: NFR issues … (#742 first)` on `main`, and the merge before the push conflicted. The header only says how to tell at the start. | Add: «A session that appears on `main` later makes this one parallel: at the merge take `main`'s plan and move the checklist into the pull request description.» |
| `CLAUDE.md`, Workflow 9 (stop hook) | As in `workflow-notes-architecture-phase-2.md`: the stop hook asked twice to push while the `code-reviewer` round was still running. | – |
