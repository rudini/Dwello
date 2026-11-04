# Workflow notes, issue #1088

## Note 1: a decision that widens the task in the middle of the feature review

The product owner's answers to the step-1 Fachreview («keine kurze Periode», then «Altdaten dürfen so nicht vorkommen») widened #1088 from a per-building setting to «no short periods and no other periods at all», enforced by the backend. Each answer removed further non-`@wip` scenarios on `main` (#199, #408, #486 and sub-year calculation scenarios). `CLAUDE.md`, Workflow 1, asks for an issue whose «Decided (product owner)» names the scenario change; the session recorded each answer as its own «Decided» section in #1088 and named the removed scenarios by example («e.g.»), not one by one. Proposal: say in Workflow 1 whether a decision may approve scenario removals by kind («every scenario with a statement period under a year») or must list them.

## Note 2: a fat-module limit decides where a domain rule lives

The backend guard «whole periods only» belonged in `statement.service.ts` (where `generateStatement` lives), but that module was at its dependency limit (21) and `routes/statements.ts` at its line limit; it went into `statement-run.service.ts` as `generateInPeriod`, which the route calls instead. The corrections path (`correctStatement`) and the demo data call `generateStatement` directly and so skip the guard by design. The fitness message proposes a module of its own, which would have added a dependency again. No change proposed; noted so a later reader knows why the guard sits there.

## Note 3: a pre-existing E2E failure found by a local full run

`datenexport.feature` «Die Dateinamen des Exports in der Sprache der Oberfläche» (fr) fails in this container on `origin/main` too (the download gets no file name). The full local run is the only place it showed; it is not this task's and is left to CI and, if red there, its own issue.
