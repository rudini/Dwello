# Workflow rules review: migrations frozen since the first installation

Task (chat, no issue): drop the "until the first installation" exception for migrations, add a CI check against edits of applied migrations, stop advising `db:reset` for an installation.

| ID | Rule | What happened | Kind | Proposed change |
|----|------|---------------|------|-----------------|
| W-1 | `backend/CLAUDE.md` (migrations): "Until the first installation, changes go into `0001_schema.sql` …" | The rule depended on an event nothing in the repo recorded. After the installation, three commits on 2026-10-14 still edited `0001_schema.sql`; no rule or check noticed. Replaced in this task by a CI check. | missing | Rules that end with an outside event should name who records the event and where (here: the product owner tells, `backend/CLAUDE.md` is updated in the same change). |
| W-2 | `CLAUDE.md`, Workflow 1: "No scenario: server-side failure" covers "a failure only between server parts (a load function, the BFF calling the backend)" | The changed refusals show only when the backend starts, not between server parts. Used "No scenario: server-side failure" by analogy. | unclear | Name backend start and CLI scripts as a case for "No scenario". |
| W-3 | `CLAUDE.md`, Workflow 7 "Workflow review" applies to "a feature … also a bug fix a user can see" | The change is visible to whoever operates the installation, not to the landlord in the app. Unclear whether the review was required; written anyway. | unclear | Say whether operator-facing changes (CI, startup messages, deployment docs) need the workflow review. |
