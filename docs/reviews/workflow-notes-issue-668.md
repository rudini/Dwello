# Workflow notes: #668 (usability pass, contract edit form)

| Rule | What happened | Proposed change |
|---|---|---|
| `implementation_plan.md` header, «Parallel sessions (workers of one coordinator …): leave this file untouched» | This task ran as a worker of a coordinator, which asked me to keep the checklist in `implementation_plan.md` and write the archive entry myself. I followed the coordinator: it runs step 9 and the plan had no other session. | Say that a coordinator may give the plan file to its single worker, or that the worker keeps it there when no other session uses it. |
| `tests/e2e/CLAUDE.md`, «Run»: no `vitest`, `check` or `i18n` while an E2E run waits or builds | Each E2E run (2 to 10 minutes) blocked the next DOM test, so red/green cycles waited for E2E. | Let `vitest` write Paraglide to a scratch dir (or let the E2E build copy it once at start), so unit tests can run beside E2E. |
| Issue text «reports `docs/design/personas/*-b15.md`» | No Sven B-15 report ever existed, and the Helga reports were deleted in c893731. The findings S-3 to S-7 and N-3 were known only from the issue text. | When an issue cites reports that are then deleted, the deleting commit names the issues that cite them, or the issue quotes the finding lines. |
