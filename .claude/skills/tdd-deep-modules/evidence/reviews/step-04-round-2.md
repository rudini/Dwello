# Review: Stage 1 `verify_stage1`, round 2 (step 04)

Reviewer report (content as returned, condensed formatting).

## Summary
All three round-1 majors are fixed and reproduced: same-number rounds fail, `os._exit(0)` after a failure fails, empty, non-UTF-8, directory and broken-symlink reviews fail without a traceback. 8 tests pass; every round-2 red fails for the right reason, greens and the refactor pass when replayed. The real run gives `STAGE1: PASS`, exit 0.

Rejected for one reason: a suite where a failing test is marked `@unittest.skip` or `@unittest.expectedFailure` is accepted as passed as long as one other test runs. The round-1 fix only closed the "every test skipped" case.

## Commands run
- `python3 -m unittest tests.test_verify_stage1` → `Ran 8 tests ... OK`.
- `python3 scripts/verify_stage1` → `tests: OK`, steps 01-03 PASS, `STAGE1: PASS`, exit 0.
- Commit replay of 5c492b0, 3deb890, 181c43e, 9f6e339, c4f0d7c, a75950a, a8772a1, e5ae07d: reds fail for the right reason, greens/refactor/pins pass.
- Adversarial fixtures under /tmp (cleaned up):

| Scenario | Result |
|---|---|
| `sys.exit(0)` in a test after a failure | FAIL (correct) |
| `sys.exit(0)` / `os._exit(0)` at import | FAIL (correct) |
| test SIGKILLs the interpreter | FAIL (correct) |
| no test files | FAIL (correct) |
| failing test in `tests/sub/` without `__init__.py` | PASS (documented) |
| `@unittest.skip` on the failing test plus one passing test | **PASS** |
| `@unittest.expectedFailure` on a failing test | **PASS** |
| monkeypatched `wasSuccessful`, fake `OK` + `os._exit(0)`, atexit fake | PASS (deliberate) |
| test writes a passing `step-03-round-9.md` | PASS (suite runs before reviews are read) |
| atexit warning after a genuine `OK` | false FAIL |
| `round-+3.md`, full-width duplicates, broken symlink, directory, lower-case verdict, BOM, tab | correct |

## Status of round-1 findings
- [major] duplicate round numbers: fixed.
- [major] `os._exit(0)` false pass: fixed.
- [major] empty review crash: fixed.
- [minor] fully skipped suite: fixed only for the fully skipped case (see new major).
- [minor] empty stderr: fixed, untested.
- [minor] subdirectories without `__init__.py`, earlier `VERDICT: FAIL` line: documented.
- [minor] gaming pins: added, mutation log 3/3 KILLED (not re-run).

## New findings
- **[major] `selfcheck.py:16-18`: skipped tests and expected failures count as a passing suite.** An agent adds `@unittest.skip` or `@unittest.expectedFailure` to its red test; summary `OK (skipped=1)` / `OK (expected failures=1)`, `STAGE1: PASS`. The skill itself treats skipping as cheating. Fix: require the summary to be exactly `OK`; add a red for each case.
- [minor] `verify_stage1:13-18`: the suite runs before the reviews are read; a test can write a review. Untracked review files count.
- [minor] `selfcheck.py:13-14`: verdict from the last stderr line; late warnings give a false FAIL, deliberate fakes a false PASS.
- [minor, TDD] green 9f6e339 adds untested branches (`errors="replace"`, `exit code N, no output`).
- [minor, TDD] green a75950a catches `OSError`, untested for directories and broken symlinks.
- [nit] refactor a8772a1 changes the printed duplicate message.
- [nit] `verdicts.py:11`: `\d` matches Unicode digits.

## Deep-module assessment
`verdicts.final` and `selfcheck.own_suite` are deep interfaces; the CLI is a thin loop. `own_suite` judges by scraping text and is gameable at its edge.

VERDICT: FAIL
