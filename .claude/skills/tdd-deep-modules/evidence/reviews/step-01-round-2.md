# Review, round 2: `tdd-step` (fixes in `6277756..HEAD`, HEAD `cc84bbb`)

Verdict FAIL. Full reviewer report as returned (verbatim content, condensed formatting):

## Summary
FAIL, because of one major correctness hole. In a repo that has both vitest and Python tests, `green`/`refactor` run only vitest. A green commit is accepted while Python tests fail, so "refuse green unless ALL tests pass" is broken. Dwello is exactly this kind of repo.

What holds up: TDD history is clean (re-ran the suite at all 36 commits in `6277756..HEAD`; every red fails only its new test with an AssertionError and touches only test files; every green/refactor/pin/docs commit passes). Green diffs are small and each is driven by its test. Round-1 scenarios are fixed: subdirectory bypass, tracebacks, forged trailer, test edits in green, atexit noise, pins. Every round-1 mutation is now killed by the full suite. Modules are reasonably deep.

## Commands run (key output)
1. Suite at HEAD: `Ran 44 tests ... OK`.
2. Every commit re-run in worktrees with node_modules symlinked. Reds (df53306, e5d7db0, 1e67859, c159dd9, 914eaa1, 8c91f00, ab2c246, 1fd0c72, 406593c, b0b8eed, 9071632, 5aa1a93, 1ccb48d, 07df552, fc2f0e2, 22f6a5d) each fail only their new test; all others OK.
3. Mutations against the full suite: all 6 round-1 mutations killed; also killed: `not errors` guard, AssertionError prefix narrowing, `failed != 1`, rename branch, read-tree restore, conftest marker, vitest-installed check, `_has_python`. SURVIVED: `-uall` -> `-unormal` (tdd-step:19); `.spec.` removed (protocol.py:32); `_TEST_DIRS` -> `{"tests"}` (protocol.py:21); `exit_code == 1 and` removed (suite.py:128, likely equivalent); `-p no:cacheprovider` removed.
4. Round-1 G fixed. D (pytest without config) and D2 (`setup.cfg [tool:pytest]`) still `NO TESTS RAN`.
5. Scratch repos: mixed vitest+unittest repo, Python failing: `green` rc=0, `TDD-Exit-Code: 0`. Dwello clone: `tdd-step green` from the skill dir ran Dwello's root vitest (`6 of 1300 tests failed`), skill Python tests never run. vitest assertion failure + unhandled TypeError in a timer: red accepted. vitest green after adding config `include:["nothing/**"], passWithNoTests:true`: rc=0. pytest `DID NOT RAISE`: red refused. Crashes: `\xff` on stderr and non-UTF-8 untracked filename (UnicodeDecodeError); package.json `{"devDependencies": null}` (TypeError), `[]` (AttributeError). Merge conflict handled; intent-to-add rename not misparsed.

## Status of round-1 findings
Subdirectory bypass FIXED. Detection PARTIALLY FIXED (mixed repos run only vitest; bare pytest / setup.cfg / tox.ini still NO TESTS RAN). Untested clauses FIXED. Output after summary FIXED. Tracebacks FIXED for listed cases. Forged trailer FIXED. Phase from subject kept and documented (acceptable). Green weakening tests FIXED for test files (config bypass below). Several failing tests in red FIXED. Refactor 6b479b3 acknowledged (3344ab9 also changes a message). Leaks mostly FIXED. Weak trailer assertions FIXED.

## New findings
- [major] Mixed repos: green/refactor pass with failing Python tests; Python-only TDD impossible in Dwello (`suite.py:30-36` with `tdd-step:42`). Fix: run every detected framework and combine, or refuse mixed repos with exit 2.
- [minor] Plain pytest projects (no config, or `setup.cfg`/`tox.ini` config) never reach red or green (`suite.py:110-114`).
- [minor] Green can empty the suite through config files (`vitest.config.js` include nothing + passWithNoTests; `conftest.py` skipping everything) because they count as production (`protocol.py:24-33,51-53`).
- [minor] vitest unhandled errors ignored in red classification (`suite.py:98-105`).
- [minor] pytest `DID NOT RAISE` / `pytest.fail()` refused as red (`suite.py:131`); not documented.
- [minor] Crashes: non-UTF-8 output or file names (`suite.py:45,70,117`, `tdd-step:19`); unexpected package.json shapes (`suite.py:72`).
- [minor] Commit contents can differ from what was tested: gitignored inputs; files created by the test run are committed (`tdd-step:46-52`).
- [minor] Clauses with surviving mutations: `-uall`, `.spec.`, `test/` and `__tests__/`.
- [nit] TESTLIST.md not updated; 3344ab9 changes a message; `sys.executable` not the project venv; missing pytest not NoFramework; unittest counts failing subTests separately.

## Deep-module assessment
suite.py deep (`outcome` bare string; `failed` semantics differ per framework). protocol.py deep. tdd-step thin CLI + git plumbing, acceptable.

VERDICT: FAIL
