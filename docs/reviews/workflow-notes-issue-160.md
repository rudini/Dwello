# Workflow notes: #160 / #373 (word-wise search)

| Rule | What happened | Proposed change |
|---|---|---|
| `tests/e2e/CLAUDE.md`, "Rules", Isolation (`seed.names` appends a UUID) | A search scenario with apartment «B1» was flaky: «B1» is contained in the hex UUID of the scenario's building name («…b158…»), so the word-wise search found «B2» too, one run in three. | Add: «A search or filter scenario searches for values a UUID cannot contain (letters g–z, a dot), since every seeded name ends with one.» |
| `.github/ISSUE_TEMPLATE/decision.md`, "Done means" (implementation issue) | The session was asked to implement the decided option right away. It opened #373 only to close it in the same pull request with #160, and copied the decision into it. | When the decision is implemented in the same task, let the pull request close the decision issue directly, with the "Done means" written into the decision issue. |
| `CLAUDE.md`, "Process" (a new state into `screens.json`) | The existing `filtered-empty` state now shows the search term, and the language check flagged the German fixture term «keine-treffer-a11y» on fr/it/en. Nothing says that fixture input shown on a screen has to be language-neutral. | In `tests/e2e/fixtures/screens.ts` or the rule: «Values a state types in are not words of any language: screens may repeat them.» |
