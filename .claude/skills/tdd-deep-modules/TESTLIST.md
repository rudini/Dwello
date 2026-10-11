# Test list

One behavior per red-green(-refactor) cycle. Tests drive the public CLIs only.
"pin" = characterization test that passed on first run because an earlier cycle
already produced the behavior; each pin was mutation-checked instead.

## Step 1: `tdd-step <test|red|green|refactor> [message]`

- [x] red with an assertion failure commits `red: <message>` with trailers `TDD-Phase: red` and `TDD-Exit-Code: <real exit code>`
- [x] red is refused (exit 1, no commit) when the suite passes
- [x] red is refused when the failure is an import error
- [x] red is refused when no tests ran (config)
- [x] red is refused when the failure is a syntax error (pin)
- [x] red is refused when a test errors with a non-assertion exception (pin)
- [x] red is refused when a production file changed
- [x] green is refused while any test fails
- [x] refactor is refused while any test fails
- [x] phase order: green only after red
- [x] phase order: refactor not right after red
- [x] phase order: red not right after red
- [x] test (test list) phase is refused when code changed
- [x] full cycle commits every phase with the real exit code and a clean tree (pin)
- [x] no supported test framework detected -> exit 2, no commit
- [x] unknown/missing phase -> exit 2 with usage
- [x] vitest: assertion failure is red
- [x] vitest: load error is refused as red
- [x] vitest: JS production edit is refused in red, `*.test.js` is test code
- [x] files under `tests/`, `test/`, `__tests__/` are test code
- [x] vitest: config error is refused as red (no crash)
- [x] vitest: green commits when all pass (pin)

### Step 1, review round 1 (fixes)

- [x] run from a subdirectory: checks and tests the whole repository
- [x] pytest projects detected by config; assertion failure is red
- [x] pytest non-assertion exception refused; unittest-style AssertionError under pytest accepted
- [x] pytest fixture error next to an assertion failure refused
- [x] unsupported package.json test script exits 2; malformed package.json / uninstalled vitest exit 2
- [x] pins: vitest TypeError, vitest without test files, unittest failure+error, `_test.py`, test-after-red, refactor-after-start/test (mutation-checked)
- [x] output after the unittest summary does not hide the result
- [x] phase without changes refused; repo without commits works; staged renames list both paths
- [x] message cannot forge trailers
- [x] green may not change tests; red needs exactly one failing test (unittest, pytest, vitest)
- [x] rejected git commit exits 2 and restores the index; outside git exits 2

### Step 1, review round 2 (fixes)

- [x] mixed repos run every detected framework; green refused if any fails
- [x] a framework that finds no tests is left out when another has tests (Dwello: vitest + stray .py)
- [x] a run in which no test ran is not a pass; skipped tests do not count (unittest, pytest, vitest)
- [x] `conftest.py` and `vitest.config.*` are test code
- [x] vitest unhandled errors refused as red
- [x] pytest `Failed:` (`pytest.raises` not raised, `pytest.fail`) is red
- [x] non-UTF-8 test output and file names do not crash
- [x] unexpected package.json shapes exit 2
- [x] a test run that changes the working tree is refused
- [x] pytest config in `setup.cfg` / `tox.ini`; plain module-level `def test_` without config
- [x] deleted tracked test files do not crash detection
- [x] pins: `-uall`, `.spec.`, `test/`, `__tests__/` (mutation-checked)
