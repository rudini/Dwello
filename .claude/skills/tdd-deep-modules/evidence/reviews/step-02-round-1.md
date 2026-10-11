# Review of step 2: `tdd_replay` (round 1)

Verdict FAIL. Reviewer report (content as returned, condensed formatting).

## Summary
Tests at HEAD pass (79). Each of the 13 red commits fails only its new test via an AssertionError; greens pass; mutation evidence reproduces; the five named sabotages are rejected for the right reasons. Rejected anyway: four bun histories fool `tdd_replay` (exit 0, `REPLAY: ACCEPT`): a red whose failing test is an old test; a red that deletes a test; a test-phase commit that drops tests via `package.json`; two new tests with the same name.

## Commands run (key output)
- Full suite at HEAD: `Ran 79 tests in 107s OK`.
- `tests.test_tdd_replay` at every step-2 commit: every red fails exactly its new test (9d9f5d5 "can't open file tdd_replay"; 943a944 `0 != 1`; b9c7c24, 6c18b14, b357e16, c33006d, c95ac5b accepted; 6fe5729, caaac9e crashed exit 1 empty stdout; 3534a79 four subtests tracebacks; 593d579 traceback; 5142390 vitest error exit=2; 0c0d02c "adds 2"); every green and pin passes; refactor c89cc75 17/17; HEAD 79. `tests.test_tdd_step` at d0fa5fa and 4c69675 OK.
- Mutations at HEAD: worktree removal -> pass KILLED; `removed = frozenset()` KILLED; evidence files match.
- Safety: normal runs and SIGINT leave checkout, branch, worktree list unchanged; SIGTERM leaves a worktree behind.
- `tdd_replay` on the skill's own history: rejected (`not a TDD phase commit`), worktree cleaned.

## Findings
1. [major] `replay.py:83-85`: the failing test in a red need not be the new one (no failing-test ids). Repro: red appends a failing expect to the old test "adds" and adds a new passing test "adds zero" -> ACCEPT.
2. [major] `replay.py:87`: red may remove tests (repro: red replaces "adds" by a failing "muls"; green breaks add) -> ACCEPT.
3. [major] test phase can drop tests through test configuration (`scripts.test` narrowed to `bun test mul.test.ts`) -> ACCEPT.
4. [major] `suite.py:118-120,136-137`: duplicate test names collapse into one id; a red adding a failing and a passing `test("adds")` -> ACCEPT.
5. [minor, root in step-1 `protocol.py:36-41`] bun's `*_test.ts`/`*_spec.ts` names are classified as production.
6. [minor] `replay.py:30-48`: SIGTERM leaves a registered worktree and temp dir.
7. [minor] `tdd_replay:20-22`: unexpected crashes exit 1 (same as REJECT) with a traceback.
8. [minor] `replay.py:36`: merges always rejected ("nothing changed"), contradicting DESIGN.md.
9. [minor] renaming or moving a test in refactor is rejected (undocumented).
10. [minor] first red 9d9f5d5 failed because the script did not exist.
11. [minor] green 729e954 brought in the whole engine at once (then honestly pinned).
12. [nit] the skill's own history cannot pass `tdd_replay`.
13. [nit] a contradicting `TDD-Phase` trailer is ignored.
14. [nit] replayed vitest may write its cache through the borrowed node_modules symlink (inferred, not verified).

## Deep-module assessment
`replay(repo, rev_range) -> [Verdict]` + `ReplayError`: narrow, hides range listing, base run, worktree, cleaning, node_modules, trailer comparison, judging. Weak spots: mutable list in a frozen dataclass; `_judge` takes six positional arguments; failing-test ids missing from `suite.Run` (natural fix: `failing: frozenset`). Test-id scheme must stay unique for duplicate names.

VERDICT: FAIL
