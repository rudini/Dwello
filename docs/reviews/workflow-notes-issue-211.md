# Workflow notes: #211, #199

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, "Open work" (an issue is ready when its decisions are in its text; look for open `entscheiden` issues first) | #211 says «depends on #133». #133 is decided but not implemented, and has no `entscheiden` label, so the readiness check passed. The dependency only stopped the task in the domain review of the scenarios (V-3), after the scenarios, steps and red unit tests were written. | Add to the readiness check: an issue that names «depends on #n» is ready only when #n is closed, or the issue says what to do until then. |
| `CLAUDE.md`, Workflow 1 (fach-reviewer before implementing) | Worked as intended: it found that the decided short Abrechnungsperiode (#199) lets one building's invoices be shared out at over 100 % (M-1, now #281), before any production code existed. | None; keep it. |
| `CLAUDE.md`, Workflow 9 and "When to ask" (push nothing before "Done means"; ask before a push) | The task ended blocked on product decisions. Its local commits (scenarios, review report, these notes) exist only in the ephemeral cloud container; the issue comments point to a branch nobody can see. | Allow a task that ends blocked to push its branch without opening a pull request, so the work and the report survive the container. |
