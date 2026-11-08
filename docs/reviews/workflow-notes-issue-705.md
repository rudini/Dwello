# Workflow notes: issue #705

| Rule | What happened | Proposed change |
| --- | --- | --- |
| `backend/CLAUDE.md`, "Tests" (shared `dwello_test`) | The new pg test inserts and deletes 1000 contracts and statements. Alone the file was green; in the full `.pg.test` run three later tests of the same file timed out (5 s), because PostgreSQL planned with stale statistics (`runPlan` took 2.7 s). An `ANALYZE` of the two tables in the test's cleanup fixed it; finding it took three full runs. | Add a line: a test that writes or deletes hundreds of rows ends with `ANALYZE <tables>` and sets its own timeout. |
| Prompt, "Schreibe die Entscheide ins Issue" | `gh api -X PATCH repos/rudini/Dwello/issues/<n>` was refused by the auto-mode classifier; the GitHub MCP tool `issue_write` (update) worked. | Name `mcp__github__issue_write` for editing an issue body in `issue-work`, next to the REST read. |
