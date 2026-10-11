# Review: Stage 1 `verify_stage1`, round 3 (step 04)

Reviewer report (content as returned, condensed formatting).

## Summary
The round-2 major is fixed: a failing test marked `@unittest.skip` or `@unittest.expectedFailure` now fails Stage 1 (the summary must be exactly `OK`). The round-2 minor about a test writing its own review is fixed: reviews are read before the suite runs. Other minors are pinned or documented in DESIGN.md "Known limits". Replayed cf2af74..fb7c865: both reds fail on an assertion with the expected message; greens, refactor and pins pass; the refactor is behaviour-neutral. All 4 pinned mutations re-run and KILLED. On a clean clone at fb7c865, `verify_stage1` prints `STAGE1: PASS`, exit 0. (A run in the live working tree caught a concurrent red commit of another step and correctly printed `STAGE1: FAIL`.)

## Commands run
- Replay: cf2af74 `FAILED (failures=2)` (`OK (skipped=1)`, `OK (expected failures=1)`); 5de67bf, f9afc48 OK (8); b188941 `FAILED (failures=1)` (`tests: OK`); 85c53cb OK (9); fb7c865 OK (10).
- Extra mutations: removing `done.returncode == 0 and` SURVIVED; replacing the `ran > 0` check with `True` SURVIVED; three others KILLED.
- Clean clone at fb7c865: `tests: OK`, steps 01/02/03 PASS (rounds 7/3/3), `STAGE1: PASS`, exit 0, 2m41s.
- Adversarial fixtures: module-level SkipTest, SkipTest in setUpClass, skipTest() in a body, unexpected success, atexit `os._exit(3)` after OK, NUL after verdict, CRLF: all correct. `load_tests` returning an empty suite: PASS (minor). Separator characters in the last line, Arabic-Indic digits, `.MD` suffix, FIFO review: nits.

## Status of previous findings
- [major] skipped / expected-failure tests: fixed.
- [minor] a test can write a review: fixed.
- [minor] untracked reviews, last-stderr-line scraping: documented.
- [minor, TDD] untested branches: pinned, KILLED.
- [nit] message change, `\d`: accepted.

## New findings
- [minor] `selfcheck.py:17`: the returncode and `ran > 0` checks are not pinned by a test.
- [minor] `selfcheck.py:11-12`: a `load_tests` returning an empty suite hides failing tests; document or detect.
- [nit] `verdicts.py:20-21`: `splitlines()` splits on separator characters.
- [nit] `verdicts.py:9`: case-sensitive glob; no timeout on the suite; FIFO review hangs. No false PASS.
- [nit, process] name the commit checked when the tree changes concurrently.

## Design / depth
`verdicts.final` and `selfcheck.own_suite` are deep; `verify_stage1` is a thin CLI. No pass-through wrappers.

No blocker or major findings.

VERDICT: PASS
