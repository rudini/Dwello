# Workflow notes: issue 643 (scenarios are the specification)

| Rule | What happened | Proposed change |
| --- | --- | --- |
| `.claude/skills/grill-me/SKILL.md`, steps 1 and 5 | The request was a new workflow rule with no issue yet; the skill starts by reading an issue and ends by writing into one. The interview ran on the request itself, and the issue (#643) was opened from the answers afterwards. | Step 1: "Read the issue, or, when the request has none yet, the request and the rules it touches"; step 5: "… into the issue, opened from the answers with a template when there was none". |
