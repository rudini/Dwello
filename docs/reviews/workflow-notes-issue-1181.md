# Workflow notes: issue #1181

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, "When to ask"; skill `issue-work` ("Decided (product owner)") | The task said to decide open product questions by recommendation and write them under «Decided (product owner)». The rules know only decisions the product owner made; the section now holds a decision the session made on that instruction, which the section itself says in its first line. | Name the case: a decision made under a delegating instruction goes under «Decided (product owner)» with a first line saying so, or under its own heading. |
| Skill `issue-work` ("Read and write issues …") | `gh api -X PATCH repos/rudini/Dwello/issues/<n>` to write the decision was refused by the session's permission check; `mcp__github__issue_write` worked. | Say that writes go through the GitHub MCP tools; `gh api` only for reads and search. |
