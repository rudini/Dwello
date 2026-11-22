# Workflow notes: #1464, follow-up (link back to the Abrechnungslauf)

| Rule | What happened | Proposal |
|---|---|---|
| `implementation_plan.md`, header, «Start»: the archive file is `docs/archive/sessions/<n>.md`, `<n>` the lowest issue number the session closes | #1464 was reopened for a follow-up; its first pull request (#1465) already wrote `docs/archive/sessions/1464.md`, so the second session closing #1464 has no free name. Used `1464-back.md` (the branch suffix). | Say what a second session closing the same issue is named, e.g. `<n>-<branch suffix>.md`. |
| `docs/design/personas/README.md`, «Reports»: reports of finished tasks are removed by the task's own archive step | The first session of #1464 left `marco-1464.md` and `sven-1464.md` in `docs/design/personas/`; this session removed them with its own reports in its archive step, since it closes #1464. | When an issue is reopened for a follow-up, say whether the first session's archive step removes its reports or the follow-up's does. |
