# Response to step 09 (two-tier suite), round 1

- [major] only the range end held to the full suite: red/green "every task ends full" (739f82d, d733af0). A task ends at every green or refactor followed by a `test:` commit, and at the end of the range; each end must have run the full suite and passed it (same messages as the final commit). DESIGN.md (Replay, Known limits: a task without a test list merges with the one before) and SKILL.md ("before the next task's test list") say so.
- [major] a changed `test:fast` hides a test from the fast tier: red/green "fast suite loses test" (a9766bd, 11c67b4). The replay now runs both suites of every commit (and of the base); a test that ran in the previous fast run and no longer runs in this fast run is "removes tests from the fast suite". Cost (two runs per commit) documented.
- [minor] stray `--suite`: red/green "stray options exit 2" (f3ab15d, ddfc3d0): any `--` word other than a leading `--suite X` exits 2 with usage.
- [minor] red a81080a failed two tests: acknowledged; the old usage assertion had to change with the usage text in that red. Recorded in TESTLIST.md.
- [minor] tier rules in the CLI: refactor 481a9a1, `protocol.TIERS` and `protocol.default_tier(phase)`, used by `tdd-step` and `replay`.
- [nit] message-only rule: kept on purpose for a clearer reason; DESIGN.md says it only names the cause.
- [nit] `Verdict.suite` default dropped (481a9a1). [nit] DESIGN.md interface table updated. [nit] docs/test-pyramid.md names `bun run test:fast`. [nit] "no external network" in DESIGN.md, SKILL.md and tooling.md.
