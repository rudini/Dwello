# Workflow notes: #132 (W1c, outdated drafts in the wizard preview)

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, Gotchas, "One build" ("E2E may run while personas run") | In the cloud container the persona build (`persona-stack.sh`) and a `vitest` DOM run at the same time ended the worker process (exit 137, out of memory); the stack and the run were lost and had to be started again, alone. | Add to "One build": in a cloud session run the persona build alone, and start E2E or the full `vitest` only once `persona-stack.sh` prints `ready`. |
| `CLAUDE.md`, "Working on an issue" | #132's "Done means" is worded for a decision issue, while its "Decided" section asks for two implementations (options 1 and 4). The coordinator's request named only option 1; option 4 was split into #338 and the pull request says so. | The "Decision" template could say: when the decision asks for code, its implementation issue is opened in the same step, so a "Setze #n um" on the decision issue does not have to split it. |
