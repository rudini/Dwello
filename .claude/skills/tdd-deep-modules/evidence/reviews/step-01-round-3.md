# Review, round 3: `tdd-step` (fixes `cc84bbb..HEAD`, HEAD `f444743`)

Verdict FAIL. Reviewer report (content as returned, condensed formatting).

## Summary
One major problem remains, introduced by the round-2 major fix. e824729 drops any framework with `ran == 0` from the combined result. A pytest run that crashes before writing its JUnit report also gets `ran=0`, so in a mixed repo the crash is silently dropped and `green`/`refactor` are committed with `TDD-Exit-Code: 0` while the Python suite is broken or never ran. Triggers reproduced: pytest not installed in the interpreter running `tdd-step`; a green change breaking a module that `conftest.py` imports. DESIGN.md's "missing pytest is refused as an error" is false for mixed repos.

Holds up: TDD history clean (all 30 commits re-run; each red fails only its new test/subtests with AssertionError; every green/refactor/pin/docs passes). Round-2 minors fixed except gaps below. Dwello works (vitest, 1300 tests, Python left out). Round-2 pin mutations killed.

## Commands run (key output)
1. Suite at HEAD: `Ran 58 tests in 55.995s OK`.
2. Every commit in `cc84bbb..HEAD` in its own worktree: reds fail only their new test (or its subtests) with AssertionError; greens, refactors b165607/f00c75c, pin 220fb95, docs: OK. Reds change only test files.
3. Dwello fresh clone with a real node_modules copy: `tdd-step test "note"` rc=0, `TDD-Exit-Code: 0`; `suite.run('.')` ran 1300 tests. (With a node_modules symlink 6 tests fail: setup artifact.)
4. Round-2 pins: 4/4 KILLED.
5. 19 own mutations: 13 KILLED; SURVIVED: tox.ini and setup.cfg section strings, `async` in the test-function regex, vitest no-report `ran` 1 -> 0, `ran + load_errors` -> `ran`, `max(exit_code)` -> `min`.

## Status of round-2 findings
- [major] mixed repos: PARTIALLY FIXED (failing assertions/collection errors refused; reopened when pytest crashes before its report).
- plain pytest / setup.cfg / tox.ini: FIXED in behaviour; section strings no longer pinned.
- green empties suite via config: PARTIALLY FIXED (`vite.config.*`, `pytest.ini`, `pyproject.toml`, `setup.cfg`, `tox.ini` not test code).
- vitest unhandled errors: FIXED (substring check gives false positives).
- pytest DID NOT RAISE / fail: FIXED.
- non-UTF-8 / odd package.json: MOSTLY FIXED (non-UTF-8 bytes inside package.json crash).
- test run creating files: FIXED.
- surviving mutations: FIXED.
- TESTLIST: updated only at the end. Limits documented, but the missing-pytest claim is wrong for mixed repos.

## New findings
- [major] `suite.py:132` + `suite.py:250-255`: green/refactor accepted while the Python suite never ran or is broken in mixed repos (no-report pytest gets `ran=0` and is dropped). Repro A: conftest imports a module that green breaks -> green rc=0, exit 0. Repro B: venv without pytest, Python test failing -> green rc=0, exit 0. Fix: no-report pytest path `ran=1` + outcome error, or drop only runs that collected no tests (exit 5).
- [minor] `protocol.py:32-33`: green can exclude the failing test via `vite.config.js` exclude or `pytest.ini` `--deselect` (reproduced).
- [minor] `suite.py:123-124`: in mixed repos, unittest tests unreachable by root discovery are silently ignored.
- [minor] `suite.py:209`: unhandled-error substring check refuses a red whose test name contains "unhandled error".
- [minor] `suite.py:179`: non-UTF-8 bytes in package.json crash with UnicodeDecodeError.
- [minor] unpinned clauses (surviving mutations above).
- [minor] DESIGN.md points to `tdd_replay`, which does not exist yet.
- [nit] `snapshot()` misses tracked-but-ignored files; small race between check and `git add -A`.
- [nit] `git ls-files` quotes non-ASCII paths (core.quotepath): `test_ü.py` invisible to detection.
- [nit] `"Failed: "` also accepts pytest-timeout's `Failed: Timeout`.
- [nit] TESTLIST updated after the cycles; no `test` phase commits; e824729 slightly more than its test forces.

## Deep-module assessment
suite.py deep (weak spot: `ran` doubles as "tests executed" and "keep this framework", with inconsistent sentinels). protocol.py deep. tdd-step thin CLI, acceptable. No hard-coded special cases or claim-checking found.

VERDICT: FAIL
