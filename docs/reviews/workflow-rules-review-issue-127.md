# Workflow rules review: issue #127 (schema refusals without code; invoice edit shows raw text)

Rules that guided the task, with what happened and a proposed change. Review only: nothing here is applied.

## R-1 A failure scenario with a status only cannot show a bug in the answer's body

- **Rule:** `CLAUDE.md` Workflow 1 (a state only a failing request reaches gets its scenario, "answered with an error status only, at the browser boundary"); `tests/e2e/CLAUDE.md`, "Failure states".
- **What happened:** the bug is in how the UI shows a refusal's *text* (a backend answer with `error` but no `code`). `FailRequests` answers 500 without a body, which the UI already turned into its own sentence. A `@wip` scenario was written, went red for the wrong reason (the page showed the general sentence, not the backend's text) and was dropped for "No scenario: server-side failure" with DOM tests.
- **Proposal:** Workflow 1 says that a bug in how a refusal's body is shown is shown at the DOM layer with the body as the backend sends it (a contract), and needs no scenario; the status-only rule covers states, not texts.

## R-2 Persona review for a text only an outside answer reaches

- **Rule:** `CLAUDE.md` Workflow 5.
- **What happened:** as on #123 and #126, the changed text appears only for a backend answer the persona stack cannot produce. No persona ran; the reason is in the plan. This is the third task in a row with the same gap.
- **Proposal:** as proposed in `workflow-rules-review-issue-123.md` R-2: a change visible only in a state the persona stack cannot produce needs no persona run when a lower-layer test shows it.
