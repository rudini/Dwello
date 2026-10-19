# Workflow notes: tokens and speed of the agent workflow

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, Workflow 8 («`open-work.test.ts` allows one session»; start: archive a finished session, then a new `## Session`) | `main` holds Session I1 of another, still running session with open PR items, so this task could neither archive it nor add its own session. It went in as a `###` part under I1, as #468 and O-38 of other branches did before. | Say that a task started while another session's plan is open adds a `###` part to it and archives only that part. |
| `CLAUDE.md`, Gotchas, «Context» (added in this task) | `/compact` is a CLI command the agent cannot run itself, so the rule can only point the product owner to it; the 30 % autocompact does the rest. | None for now; check after a few feature sessions whether autocompact at 30 % fires and how far the cache reads drop. |
