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

### Step 1, review round 3 (fixes)

- [x] a suite that crashes before collecting is kept (error) in a mixed repo
- [x] green cannot change test configuration (`vite.config.*`, `pytest.ini`, `pyproject.toml`, `setup.cfg`, `tox.ini`)
- [x] a test named after unhandled errors is still red
- [x] non-UTF-8 package.json exits 2
- [x] non-ASCII test file names are detected
- [x] pins: pytest config sections alone, highest exit code in mixed repos

### Step 1, review round 4 (fixes)

- [x] vitest `.resolves` / `.rejects` failures are red
- [x] nested `bun test` package runs; bun assertion = red, thrown error refused; crashed bun run kept as error
- [x] unsupported nested test script exits 2 (pin)
- [x] pytest without a report is an error even with exit 0
- [x] `pytest.toml`, `.pytest.ini`, `package.json` are test configuration
- [x] pins: vitest summary anchor, broken vitest suite kept in mixed repos, todo-only suite does not pass

### Step 1, review round 5 (fixes)

- [x] config cycle redone: red with discriminating subtests, then green
- [x] interrupted pytest next to an assertion failure is not red
- [x] bun file that fails to load (missing import, top-level throw) is not red
- [x] trailer records the highest exit code of every command run
- [x] bun missing from PATH exits 2
- [x] `bun test` found in `NODE_ENV=... bun test`, `bun test || true`, `bun test; ...`
- [x] npm init placeholder test script means no tests
- [x] vitest: Error thrown inside a matcher is not red; pins for plain thrown Error, assertion-worded Error, bun assertion + thrown error

### Step 1, scope narrowed to vitest and bun (after review round 6)

- [x] generic behaviours ported to bun fixtures (test refactor)
- [x] Python test suites are not supported (exit 2)
- [x] a detected framework without tests makes the run an error
- [x] bun error counts come only from bun's own closing summary

## Step 2: `tdd_replay <commit-range>`

Re-runs every commit of the range in a separate worktree and decides from the real runs. Exit 0 + `REPLAY: ACCEPT`, exit 1 + `REPLAY: REJECT` (with the reasons per commit), exit 2 for usage or git errors.

- [ ] a hand-built good history (test, red, green, refactor, red, green) is accepted
- [ ] a commit that only claims red (its suite passes) is rejected
- [ ] an import error committed as red is rejected
- [ ] production code committed before its red test (in the red commit) is rejected
- [ ] a refactor on red (refactor whose suite fails) is rejected
- [ ] two new tests in one cycle (framework discovery: one fails, one passes) are rejected
- [ ] a trailer exit code that differs from the real run is rejected
- [ ] a history that ends in red is rejected
- [ ] a commit without a phase prefix is rejected
- [ ] green or refactor that removes tests is rejected
- [ ] a bad range or a path outside git exits 2
- [ ] vitest histories replay (the worktree borrows node_modules)
- [ ] the replay leaves the caller's working tree, index and branch untouched
