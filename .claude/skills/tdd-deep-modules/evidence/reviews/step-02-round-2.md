# Step 2 review, round 2: `tdd_replay`

Verdict FAIL. Reviewer report (content as returned, condensed formatting).

## Summary
Tests at HEAD (16704d6): 86 OK. All four round-1 attacks rejected; every round-2 red fails its new test, every green makes it pass; the `fix(build)` evidence reproduces. Rejected: skipped tests count as present, so a red (bun or vitest) or a test phase can turn existing tests off and a later green can break their behaviour -> `REPLAY: ACCEPT`. The test-phase case is round-1 #3 with `bun test -t` instead of `bun test nothing`.

## Commands run (key output)
- Full suite at HEAD: `Ran 86 tests in 118.988s OK`.
- Reds c259a15, 87ba793, d141a5c, 1264c39, 1703af7, a12ffce fail only their new test; 4d1a5e2 fails the crash test (and the SIGTERM test flaked in that run). Greens 7172c90, 95c2501, 9e2d7cb, 1343805, 1745f9a, 2f95b89 pass; 482da59 fails the SIGTERM test 2/2 under load; refactor b7eebd9 passes.
- `fix(build)` evidence: SIGTERM test 2/12 failing at b5164dd~1, 0/12 at b5164dd.
- Signals with slow bun tests: SIGTERM rc 143, SIGINT rc -2 (traceback); worktree list, status, HEAD restored every time.

## Status of round-1 findings
1 fixed. 2 fixed for removal; skipping open (N1). 3 partly fixed (`bun test -t muls` accepted). 4 fixed (`#n`; nested describes do not collide). 5, 6, 7 fixed. 8, 9 documented. 10-14 acknowledged.

## New findings
- N1 [major] `replay.py:81-92`, `suite.py:111-121,141-147`: skipped tests count as present. A1 (bun red `test.skip("adds")` + failing "muls", green breaks add), V1 (vitest same), V2 (vitest red sets `testNamePattern: "muls"`), A3 (bun test phase `"bun test -t muls"`) all ACCEPT. Fix: track skipped/running ids; "was running, now skipped" counts as removed in every phase.
- N2 [minor] green 482da59 committed while the full suite failed (flaky SIGTERM test from 1745f9a); b5164dd fixed it without a new red (disclosed, justified).
- N3 [minor] a red can weaken an old test and a green then break it (W1); DESIGN.md documents weakening only for refactor.
- N4 [minor] `replay.py:51`: unconditional `git worktree prune` deletes the caller's unrelated prunable worktree metadata.
- N5 [minor] a green can change non-code test data (`expected.json`) and pass.
- N6 [minor] a range starting at the root commit cannot accept a real project (stub limit); undocumented.
- N7 [nit] same-named test inserted before the old one takes the base id; a legitimate red is rejected.
- N8 [nit] docs commit 16704d6 also re-wrapped a line in replay.py.
- N9 [nit] reds d141a5c and 1264c39 each add one test method with two subtests (two behaviours in spirit).

Correctly rejected: describe-block move, `test.only`, old test made failing next to a passing new one, same-named passing+failing, `HEAD..HEAD~2`, `--all`, non-phase commits, trailer mismatches, the five spec sabotages.

## Deep-module assessment
`replay(repo, rev_range) -> [Verdict]` + `ReplayError` narrow and deep; verdicts immutable. `_judge` takes six positional arguments and mixes protocol rules with test-id rules. `suite.Run` needs a skipped/running set. Cleanup works for success, failure, SIGTERM, SIGINT; only overreach is the global prune.

VERDICT: FAIL
