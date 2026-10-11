# Review, round 6: `tdd-step` (commits `7d3e574..5e9d563`)

Verdict FAIL. Reviewer report (content as returned, condensed formatting).

## Summary
All three round-5 majors fixed for the named cases (reproduced). Every red but one fails for the right reason; every green passes, is minimal and touches only production code. Remaining: (1) the new "trailer = highest exit code of every command run" rule includes `python -m unittest discover`, which Dwello does not use; it always exits 5, so every Dwello commit gets `TDD-Exit-Code: 5`, red and green alike; (2) red `b47a943` directly follows red `b04e6ae`, changes an existing test's expectation and leaves two tests failing (the tool's own rule forbids red after red); (3) a new way around the bun fix (minor).

## Commands run (key output)
- Full suite at HEAD: `Ran 83 tests in 113s OK`.
- Every commit in its own worktree: 4436307 revert OK; reds 6b1cce5, 0ab277e, f6554c2, b04e6ae, 3288ff5, a0ac4a5, bd6e67b, 023a7d6 fail for the right reason; **b47a943 FAILED (failures=2)**; greens dfbc5c1, 0a9dd47, 269edbf, 2f28119, 5ce13a2, 2f6b7f4, ec78bda, 727814a OK and touch only suite.py/protocol.py; pin 6f7594d OK.
- Dwello-shaped repo (vitest + one `.claude/tools/helper.py`): red and green both `TDD-Exit-Code: 5`.
- Real Dwello clone: `suite.run` exit_code=5, outcome error (`bun: 0 of 0 tests failed (46 errors outside tests); 6 of 1300 tests failed`).
- bun: a passing test that prints `3 errors` -> outcome error; a test logging `0 errors` next to a real load error -> red committed.
- vitest: `.resolves.toBe`, failing `toThrow`, `expect.unreachable`, `toSatisfy(() => { throw new Error("expected widget") })` accepted as red; inline snapshot mismatch refused (documented).

## Status of round-5 findings
1. bun load errors: FIXED for named cases (fragile scan, new finding 3). 2. red/green redo: FIXED. 3. refactor 8f3b197: FIXED. 4. refactor deleting vitest tests: "fixed" but causes new finding 1 and was committed with a TDD violation (new finding 2). 5. bun missing: FIXED. 6. unpinned guards: FIXED (7/7). 7. script shapes / placeholder: FIXED (`cd x && bun test` drops the cd). 8. Error inside matcher: MOSTLY FIXED (message starting "expected " still accepted). 9-10 nits: addressed/FIXED.

## New findings
1. [major] `suite.py:54`: trailer exit code includes left-out frameworks; in Dwello unittest always exits 5, so the trailer cannot tell red from green. Fix: per-command exit codes, or leave out "no tests collected" codes.
2. [major, TDD] red `b47a943` after red `b04e6ae`, changes an existing test's expectation, 2 tests failing.
3. [minor] `suite.py:150-152`: bun error detection is a first-match scan of mixed stdout/stderr; test output can mask or fake bun's summary.
4. [minor] `suite.py:128-129`: splitting on `&&`/`||`/`;` not quote-aware; `cd backend && bun test` loses the cd (undocumented).
5. [nit] `protocol.py:28`: `is_production` public, used only internally (for step 3).

## Deep-module assessment
`suite.run` narrow and deep (ran/empty slightly leaky; string heuristics growing). protocol small and deep. tdd-step thin CLI. Tests drive only the CLI; no verifier gaming.

VERDICT: FAIL
