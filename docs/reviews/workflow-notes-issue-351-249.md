# Workflow notes: #351, #249 (session W9d)

| Rule | What happened in this task | Proposed change |
|---|---|---|
| Skill `pull-request`, "Which pull requests" (one pull request per issue) and the coordinator's task («open the PR with "Fixes #n" per issue») | The request covered two issues on the same PDF; the coordinator asked for one pull request closing both, the skill for one per issue. Followed the coordinator: both changes are a few lines in the same files and the commits hold both. | Allow one pull request for several small issues on the same files when the request asks for it, with one `Fixes #n` per issue. |
| `CLAUDE.md`, "Done means" («every new test was seen red») for a bug that `main` already fixed (#351) and for tests that pin text already right (fr/it/en of #249) | The tests can only be red against the old code: the condition of `getStatementPdf` and the fr/it/en words were changed for a moment by hand and put back. Costs a few minutes, no rule says how. | Name the case: a test of behaviour that is already right shows its red by reverting the fixing condition (or mutating the pinned text) for one run, recorded in the plan. |
| Skill `ponytail` ("load before writing code") | The code change was four string literals replaced by `sed`; the skill was not loaded before it. | Skip the load for a change that only replaces texts. |
