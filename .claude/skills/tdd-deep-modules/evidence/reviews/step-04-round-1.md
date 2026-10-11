# Review: Stage 1 `verify_stage1` (round 1; commits 7d585b2..94611cd, e43e8f7..b5abc34)

Verdict FAIL. Reviewer report (content as returned, condensed formatting).

## Summary
Core cases work: latest round chosen numerically (`round-10` beats `round-9`), `.bak` and `-response.md` ignored, `PASS (with caveats)` rejected, erroring/zero/missing suites FAIL, each step's verdict printed; 4 tests pass; every red/green/refactor replays correctly. Rejected: two reproduced false `STAGE1: PASS` cases and an empty-review crash; the tests cover only the four listed paths.

## Commands run (key output)
- `python3 -m unittest tests.test_verify_stage1`: 4 OK.
- Real skill dir: `tests: OK`, step 01 PASS (round 7), step 02 PASS (round 3), step 03 FAIL (round 2), `STAGE1: FAIL`, exit 1.
- Adversarial fixtures: correct for round-10 FAIL, `.bak`, trailing spaces, caveats, CRLF, zero tests, import error, missing tests dir, missing `__init__.py`. WRONG: `round-2.md` FAIL + `round-02.md` PASS -> PASS exit 0; failing test then `os._exit(0)` -> `tests: F`, PASS exit 0; failing test in a subdirectory without `__init__.py` -> silently skipped, PASS; all tests skipped -> PASS (questionable). CRASH: empty latest review (IndexError), review is a directory (IsADirectoryError), non-UTF-8 review (UnicodeDecodeError).
- Commit replay: reds 3150632, bf36b13, 7f8900e, e43e8f7 fail for the right reason; greens feba2ef, c4acd05, 94611cd, d695d1a and refactor b5abc34 OK.

## Findings
- [major] `verdicts.py:10-12`: same round number in two spellings (`round-2`, `round-02`) collide; glob order decides -> false PASS.
- [major] `verify_stage1:16`: suite judged by exit code alone; `os._exit(0)` after a failing test -> false PASS. Require an `OK` summary and `Ran N tests` with N > 0.
- [major] `verdicts.py:16`: empty/whitespace review -> IndexError traceback (directory and non-UTF-8 crashes [minor]).
- [minor] test files in subdirectories without `__init__.py` are not discovered.
- [minor] a fully skipped suite passes.
- [minor] `verify_stage1:17`: empty stderr -> IndexError.
- [minor] an earlier `VERDICT: FAIL` line is ignored (matches the "last line" contract).
- [minor] tests miss every gaming case; TESTLIST checkboxes still unticked.
- [minor, TDD] green feba2ef included the filename filter and the None branch without a test.
- [nit, TDD] red 7f8900e failed via a crash (acceptable).
- [nit] real run slow (full suite).

## Deep-module assessment
`verdicts.final` hides globbing and latest-round choice, but the PASS rule lives in the CLI (raw last line returned), the module has no direct tests, and "did the suite really pass" stays in the CLI (where the `os._exit` gap is). Return a parsed verdict instead.

VERDICT: FAIL
