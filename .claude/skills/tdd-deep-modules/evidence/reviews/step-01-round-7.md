# Review, round 7: `tdd-step` (commits `b1a23b0..HEAD` = `7e20b25..a2565f9`), scope vitest + bun

Verdict PASS. Reviewer report (content as returned, condensed formatting).

## Summary
No blocker or major findings. All three round-6 findings reproduced as fixed within the vitest + bun scope. Every red fails only in its new test (or its subtests) with an AssertionError for the right reason; every green passes, changes only `suite.py` and is minimal; refactors (including test refactor 7e20b25) keep the suite green. 15 earlier mutation pins, adapted to current code, still killed. On a real Dwello clone the tool detects vitest at the root and bun in `backend/`. Remaining: one unpinned guard, one weakened assertion, a narrow bun-summary bypass, leftover Python text.

## Commands run (key output)
- Suite at every commit (worktrees, node_modules linked): b1a23b0 83 OK; 7e20b25 77 OK; red 46b5c78 FAILED (2 subtests of the new test, `0 != 2`); d418a45 59 OK; df52531 OK; red 9877572 FAILED (1, `0 != 1`); 1589a6b OK; 66f059f OK; red d5a0d2d FAILED (2 subtests); 43859a7 OK; dc3bf14 OK; a2565f9 61 OK. Greens and code refactors touch only `tddcore/suite.py`; reds only tests.
- Real Dwello clone: `Run(exit_code=1, outcome='error', summary='bun: 0 of 0 tests failed (46 errors outside tests); 6 of 1300 tests failed')` (bun errors: missing backend node_modules / PostgreSQL; documented).
- Dwello-shaped scratch repo (root vitest, backend bun with preload+coverage script, `.claude/tools/*.py` incl. a failing python test): test -> red -> green all exit 0, trailers 0 / 1 / 0.
- Mutations (full suite): 15 killed; survived: removing `not load_errors` (finding 1), changing the "vitest is not installed" message (finding 2), dropping `is_file()` in `_files` (unpinned, behaviour correct); equivalent: unhandled regex on stderr only, bun `reported and`.
- bun 1.4.2 JUnit types: AssertionError for toThrow, toEqual, rejects, resolves, toHaveBeenCalled, expect.assertions, inline snapshot, node:assert; not for TypeError, TimeoutError, UnreachableError.
- Non-ASCII package dir (`bäckend/ä.test.ts`): red committed, trailer 1.

## Status of round-6 findings
1. Trailer exit code 5 in Dwello: FIXED (red 1, green 0; real clone exit 1).
2. Red after red (b47a943/b04e6ae): not repeated; behaviour and tests removed in 46b5c78; tool refuses red after red. Accepted as resolved.
3. bun error detection: FIXED for named cases (narrow bypass, finding 3).

## New findings
1. [minor] `suite.py:178`: vitest `not load_errors` guard unpinned (vitest assertion failure next to a file that fails to load must be refused as red).
2. [minor] `tests/test_tdd_step.py:518`: test refactor 7e20b25 weakened the "vitest is not installed" message assertion.
3. [minor] `suite.py:140-152`: bun's `snapshots: +N added` line stops the summary scan (with gitignored `__snapshots__/` a load error can hide). Fix: skip non-counter lines inside the block.
4. [nit] `suite.py:99`: unsupported-script message still lists pytest, unittest.
5. [nit] unused Python fixtures in `tests/fixture.py:10-25`; six blank lines in `suite.py:51-56`.
6. [nit] `suite.py:94`: non-string `scripts.test` raises TypeError.
7. [nit] `suite.py:134`: a test logging `Vitest caught 1 unhandled error during the test run` gets a red refused (safe side).

## Deep-module assessment
`suite.run(root) -> Run` + `NoFramework`: narrow, hides detection, runners, parsing, summary scan, combining (`Run.ran` public but used only by `_combine`). protocol small and deep (Python file classification documented). tdd-step thin CLI.

## Verifier gaming
None found; tests drive the real CLI against real vitest/bun runs.

VERDICT: PASS
