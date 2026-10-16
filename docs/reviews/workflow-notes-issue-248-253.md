# Workflow notes: statement list tenancy dates and missing PDF (#248, #253)

| Rule location | What happened in this task | Proposed change |
|---|---|---|
| `docs/design/personas/demo-records.md` | It lists the statements 2025 as «draft», but the demo data creates a PDF for every one. The first persona run could not reach the state the change adds («PDF noch nicht erstellt»); a second run needed SQL in `dwello_persona` to remove one PDF. | Say in `demo-records.md` that every demo statement has a PDF, and give the SQL that removes one for a review of the «no PDF» state. |
| `.claude/skills/workflow-review`, "Collected review" | The request covered two issues, so by the letter this session writes a collected review. But it is one of ten sessions run in parallel by a coordinator: each would write a collected review of the same notes on the same day and conflict in `docs/reviews/`. This session wrote none and left it to the coordinator. | A session started by a coordinator writes no collected review; the coordinator's session does, once all are merged. |
