# Workflow notes: #419 (default KI model qwen3-vl:8b-instruct)

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, Workflow 2 («A test must fail before the code changes») | The change of a default value in `backend/src/config/llm.ts` has no behaviour a test can show short of pinning the string; no test was written, the issue says «Scenario: none». The rule does not say whether a configuration default counts. | Say that a changed default value or a documentation change needs no red test when the issue says «Scenario: none» for that reason. |
| `backend/CLAUDE.md`, `llm:eval` «before and after» | The prompts were unchanged; the «before» run of the new model (#415, same commit range of `backend/src`) was reused instead of a second paid run. | Say that a change of model only needs one run of the new model when no prompt changed. |
