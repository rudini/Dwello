# Workflow notes: #129 (remove the building map)

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, "Open work" (a decision issue is closed once the decision is recorded and its implementation issue exists) | #129 has the "Decision" shape: its "Done means" asks only for a recorded decision or an implementation issue, yet "Decided (product owner)" holds a ready implementation. The coordinator had to say that the decided section is the requirement. | When a decision issue's decided option is small, allow implementing it in the same issue: its "Decided (product owner)" section becomes the "Done means". |
| `CLAUDE.md`, Gotchas, "Branches" | The cloud session started on a detached HEAD without a session branch, so a branch name had to be made up (`claude/w2b-remove-map-129`). | Say what to name the branch when a session starts detached (e.g. `claude/<task>-<issue>`). |
