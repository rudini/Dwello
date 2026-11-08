# Workflow notes: issue #1258

| Rule | What happened | Proposed change |
|---|---|---|
| `tools/fitness/ratchet.json`, `display` (#815) | A new paragraph shown when a draft is listed beside a sent statement compares `status === 'draft'` in a component that already has the same kind of comparison listed; the fitness check failed and the line went into `display` with the same reason, word for word. | Let one `display` entry cover a file (path and reason, no line), so a second status branch of the same display needs no new entry. |
| `CLAUDE.md`, "Done means" (a finding a persona meets in its task on this change counts as more visible) | Sven's P-1 (the contract refusal's description, its first paragraph, ending in a colon before the list) was the same on `main`; because he met it in his task it became a Major of this slice and needed a second fach-reviewer round and a persona re-run. It held up: the fix made the refusal understandable by screen reader. | None; noted as a rule that caught a real problem. |
