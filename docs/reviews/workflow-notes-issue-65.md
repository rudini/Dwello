# Workflow notes: issue #65 (W8c)

| Rule | What happened | Proposed change |
|------|---------------|-----------------|
| `.github/ISSUE_TEMPLATE/` (Decision), "Options" | Option B named a rule («the 3-month gap only for categories with more than one invoice a year») for a check that runs per building and only when there is no year before. The product owner decided it; the conflict showed only when the implementation began. | The Decision template asks that each option name the code path it changes and when that path runs, so a decision cannot target a case the code never reaches. |
| `CLAUDE.md`, "Working on an issue" | Part of a decided issue was implementable (the thresholds), part needed a new decision (the gap rule). No rule says whether to ship the decided part with `Refs #n` or to stop. This task shipped it with `Refs #n` and set `entscheiden` again. | One sentence: «When only part of a ready issue turns out to need a decision, ship the rest with `Refs #n`, ask in the issue and set `entscheiden` again.» |
