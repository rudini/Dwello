# Response to step 09 (two-tier suite), round 3

Round 4 granted by the user after three failed rounds.

- [major] trailing `test:` commits unchecked: red/green "trailing test breaks suite" (30d1647, 3f55a01): the range's last commit must leave the full suite passing ("the range must end with the full suite passing"), whatever its tier; and red/green "test commit keeps tests green" (3bf80f0, 21974f1): a protocol rule refuses a `test` commit after a green or refactor whose run fails, in `tdd-step` and in the replay.
- [minor] DESIGN.md Rules: the `test` rules are listed; "no code files change" with non-code files named as not policed.
- [minor] a range of only a fast test-list commit: now consistent with the rule set: the last commit is held to the full suite (as a task end when no green or refactor exists); DESIGN.md Replay says so.
- [nit] how to redo a green: SKILL.md section 4 (`git reset --soft HEAD~1`, then `tdd-step green --suite full`).
- [nit] replay test for a test list after a fast green: pin, mutation recorded in step-09-pins.txt.
