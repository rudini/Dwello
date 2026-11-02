# Workflow notes: issue #1057

| Rule | What happened | Proposed change |
| --- | --- | --- |
| `backend/CLAUDE.md`, "Tests" (pg tests against `dwello_test` from the migrations) | The pg test of `e2e-sent-days-ago.ts` (#1004) builds its own table by hand and gave `sent_at` the type `timestamptz`, while the schema has `timestamp` without zone. The test was green, the script wrong, and the E2E scenario failed again late in the evening (#1057). No rule says a test with hand-made tables copies the column types of the schema. | Add to "Tests": a test that creates its own tables (an E2E script on a database of its own) copies the column types from `src/db/schema.ts` / `migrations/`, or runs on a migrated database. |
