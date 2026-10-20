# Workflow notes: issue #458

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, Workflow 8 (plan; `open-work.test.ts` allows one session) | Ten workers ran in parallel; each would have replaced the other's session in `implementation_plan.md`. The coordinator ruled: keep the foreign open session, keep the checklist in the pull request, write the session straight into `docs/archive/implementation-plan-verlauf.md`. As in `workflow-notes-issue-464.md` for a foreign unfinished session. | Say in Workflow 8 what a parallel run does with the plan (one session per branch, or the archive only). |
| `CLAUDE.md`, Design-Regeln «fr/it/en show no German» and `tests/e2e/questions/language.ts` | A setting the operator writes once is shown unchanged in all four languages (`OPERATOR_SERVER_COUNTRY`, `MAIL_PROVIDER_*`, as `LLM_PROVIDER_COUNTRY`). The E2E values «Deutschland», «Schweiz», «Muster Mail AG» failed the language check; fixed with «Liechtenstein» and a seed value. | Name in `tests/e2e/CLAUDE.md` that E2E values of such settings are seed values in `language.ts` or words without German, so the check is not red for user data. |
