# Workflow notes: issues #1264, #1265

| Rule | What happened | Proposed change |
|---|---|---|
| skill `slice-review`, "Triage" (a Minor that two or more personas meet in the same place becomes an issue) | Helga P-1 (the message after «Erneut versuchen» covers the field) and Sven P-3 (the same message does not name the apartment and stays) are about one message but different defects; the same pair was not opened as an issue in #1158. Here they became one issue (#1289) on the reading «same message = same place». | Say whether «same place» means the same element or the same defect. |
| `CLAUDE.md`, Workflow 1 (fach-reviewer before texts) and "When to ask" | The step-1 fach-reviewer found that a third text in the step (outside the decision of #1264) said the old term; it went to the product owner as #1287 and came back decided while the feature review ran, so it joined the same pull request as its own slice. It worked without waiting, through the orchestrating session. | None; noted as a path that worked. |
