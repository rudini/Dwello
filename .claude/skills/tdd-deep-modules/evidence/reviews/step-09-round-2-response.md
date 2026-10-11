# Response to step 09 (two-tier suite), round 2

- [major] trailing `test:` commit (design note) rejected: red/green "trailing test commits" (faaa9da, 8f8d379). A task ends at a green or refactor that a `test:` commit follows and at the range's last green or refactor; `test:` commits are not held to the rule (a range without any green or refactor is judged by its last commit, as before). SKILL.md section 6 says to commit the note after the task's last refactor or full green.
- [major] mid-task list edit turns a fast green into a task end: red/green "test list after fast green" (abe40d9, 9540d13). A protocol rule: a `test:` commit right after a green on the fast suite is refused, by `tdd-step` at commit time and by the replay. SKILL.md section 3: list lines added during a task ride in the next red or refactor; a `test:` commit after a green starts a new task.
- [minor] a task without a test list merges with the one before: SKILL.md section 3 now says every task begins with its own test-list commit and that `tdd_replay` relies on it.
- [minor] refactor making a broken full test pass within a task: kept as a documented limit (DESIGN.md Known limits).
- [nit] "the final commit" message for mid-range ends: kept; tooling.md and DESIGN.md say what a task end is.
- [nit] tooling.md and DESIGN.md:55 wording: fixed (both suites per commit; phase and tier read from subject and trailer, judged from the runs).
- [nit] vitest runs twice per replayed commit: documented. [nit] message starting with `--`: documented.
- [nit] fixture signing: fixture repos set `commit.gpgsign false` (70cffcc); the suite passes without the environment override.
