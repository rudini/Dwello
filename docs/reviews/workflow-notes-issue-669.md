# Workflow notes: #669 (contracts-retry toasts)

| Rule | What happened | Proposed change |
|---|---|---|
| Issue text «reports `docs/design/personas/*-b15-3.md`» | As in `workflow-notes-issue-668.md`: Sven's b15-3 report is not in the history; only Helga's (`git show ebc0708:docs/design/personas/helga-b15-3.md`). | — |
| `tools/open-work/check-issues.mjs` («has "Proposed (confirm before starting)" but not the label needs-decision») | #1138 kept an empty «Proposed» heading with «—» after the label was removed; the check failed «Lint and types» on every pull request (seen on #1150) until the heading was deleted. | Let the check ignore a «Proposed» section whose body is empty or «—», or let `issue-work` say to delete the heading when the section is confirmed. |
| `docs/architecture/fitness-functions.md` / CI's `fitness.ts --base origin/main` | A local run printed its finding («Ä1 … allowed 30 and 16») among other lines and a grep for «fail/error» missed it, so CI found it on #1150. | Make `fitness.ts` end with one line «N findings» (or a non-zero summary line) so a local run is read by its last line, not by grep. |
| `CLAUDE.md`, «Done means» (more visible): a finding a persona meets in its task counts as made more visible | Sven S-1 (toast auto-dismiss under focus) and S-2/Helga H-3 (blocked apartment kept) were on the base commit but met in the task; they became this task's Majors and doubled its scope. | — (the rule worked as written; noted for scope estimates of persona-driven issues) |
