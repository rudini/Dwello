# Workflow notes: issue #296

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, Gotchas, "Branches" (commit only on a named branch) | The session was started by a coordinator on a detached HEAD at `main`, told to use "the branch this session was created with", but none existed; it created `claude/w10b-start-year-296` from `origin/main`. | Say what a session does when it starts detached: create `claude/<short-task>-<issue>` from `origin/main`. |
