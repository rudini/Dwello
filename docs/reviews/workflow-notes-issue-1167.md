# Workflow notes: #1167

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, "Done means" vs. skill `pull-request`, "Never without the product owner" | Anna's Major #1257 (the refusal advises deleting apartments, which the UI cannot) existed on `main` and needs a product decision. «Done means» lets the task finish with it under "Blocked on me". The skill still forbids merging while it is open, so the requested auto-merge waited for a second answer from the product owner. | When the product owner records, in the issue it creates, that such a Major does not hold up the merge, the merge goes ahead. Or say in «Done means» that a decision-only Major on the base commit does not block the merge. |
| `CLAUDE.md`, Workflow 1, «Spec change approved» | #1167 approved the change of «the step in building-detail.feature». That step is shared by three features (tenant, contract). Its check fails in all three once the button is gone, so the orchestrator had to confirm the wider reading. | An issue that approves a step change names every feature that uses the step (`grep -rn "<step>" tests/e2e/features`). Or the approval covers every use of that step. |
