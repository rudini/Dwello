# Workflow rules review: issue #123 (the backend's today is the Swiss day)

Rules that guided the task, with what happened and a proposed change. Review only: nothing here is applied.

## R-1 "No scenario" is defined only for server-side failures

- **Rule:** `CLAUDE.md` Workflow 1 (every bug fix a user can see starts with a scenario; `No scenario: server-side failure` only for a failure between server parts).
- **What happened:** the bug shows only between midnight and 01:00/02:00 Swiss time; the E2E stack runs the real backend with the real clock and has no way to set it, so no scenario can go red. The pg test sets Bun's clock instead, and the pull request says `No scenario: <reason>`, a reason the rule does not name.
- **Proposal:** Workflow 1 adds a second case: behaviour that depends on the server's clock or time zone gets a lower-layer test with a set clock and `No scenario: server clock`.

## R-2 Feature review for a change no running app can show

- **Rule:** `CLAUDE.md` Workflow 5 ("what a screen shows changed (also through a backend change): subagent `persona`"; "amounts, statements, PDFs … changed: `daten-pruefer`").
- **What happened:** what screens show changes only in the night hours; the persona stack uses the real clock, so a persona would see exactly what it saw before. The statement date and the reminder's deadline (a PDF) change in those hours too, but no amount. Personas and `daten-pruefer` were not run; the pg test covers each case.
- **Proposal:** Workflow 5 says a change visible only under a state the persona stack cannot produce (a clock, an outside service) needs no persona run when a test at the lowest layer shows it, and that `daten-pruefer` applies to amounts, not dates.

## R-3 A pg test cannot set the database's clock

- **Rule:** `backend/CLAUDE.md`, "Tests" (never mock the database).
- **What happened:** `setSystemTime` moves only Bun's clock; PostgreSQL's `current_date` stays on the real day. The test therefore sets the clock to 23:30 UTC of the real UTC day, so both clocks agree on the UTC day and the SQL cases are red before the fix; on a database in another time zone the SQL cases would not show the bug.
- **Proposal:** `backend/CLAUDE.md` notes that a test with a set clock takes the real UTC day, and that SQL reads today only through `sqlToday`.
