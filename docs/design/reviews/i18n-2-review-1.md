# i18n step 2 – review 1

Scope: commit 3c5c981 (dashboard, buildings, `overview.ts`, `apartment.ts`, `contract-status.ts`, statement status labels, `building-form.ts`, `building-type.ts`, `localName`). Independent read-only reviewer. Result: 0 blockers, 0 majors, 7 minors. Getters, German wording, floors (as in the PDF), official canton names, stored building types and terms verified by the reviewer; 1670 unit tests, lint, check, deepcheck, Fallow clean.

| # | Severity | Finding | Done |
|---|---|---|---|
| 1 | Minor | Screen check exempted «Graubünden» in every language | Exempt only in English (the English name) |
| 2 | Minor | `clientWidth <= 1` skip in the 390 px check too broad | Excludes only `#svelte-announcer` by selector |
| 3 | Minor | `.fallowrc.json` reformatted; plan's reason for `ignoreExports` imprecise | Reason corrected in the plan; formatting kept (JSON written by tool) |
| 4 | Minor | it «dal {date}» for both «ab» and «seit» | `contracts_period_from` → «a partire dal {date}» |
| 5 | Minor | fr/it «loués/locati» also for one apartment | `dashboard_occupied_one` (singular) when the count is 1 |
| 6 | Minor | `localName(c as never)` hides types | Typed as `Parameters<typeof localName>[0]` |
| 7 | Minor | BuildingFigures calls the status messages directly | Kept: importing `statusLabels` from both modules made Fallow report duplicate exports |

Screen check after the fixes (`sprachen-bildschirme.feature`, dashboard, building and error screens, fr/it/en at 390 px): 15 of 19 pass; the 4 failing show only the apartment status legend («Was bedeutet der Mietstatus?»), which is step 3.
