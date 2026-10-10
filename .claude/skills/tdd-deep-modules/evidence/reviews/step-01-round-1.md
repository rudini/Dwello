# Review: `tdd-step` (commits 9dafc39..6277756, branch `tdd-deep-modules-skill`)

## Summary
The commit history follows TDD well. I re-ran the suite at every one of the 43 commits. Every `red` commit fails on exactly one test, the newly added one, with an AssertionError. Every `green`, `refactor` and `pin` commit passes. Most green diffs are minimal.

`suite.py` is a reasonably deep module. `protocol.py` is mostly deep but exposes a few internals.

The tool itself has real gaps against the spec:
- **Red check can be bypassed from a subdirectory:** run from a subdirectory, a `red` commit can include untracked production code without being refused.
- **Framework detection is limited:** it only recognises unittest and vitest, so common Python layouts (pytest, a `tests/` folder without `__init__.py`) can never reach red or green.
- **Weak test coverage:** one rule in the vitest error classification was written in a green commit without a failing test, and no test checks it today (removing it still passes).
- **Wrong refusals:** some real behaviour failures are refused, and output written to stderr after the test summary breaks the Python classification.
- **Crashes:** several cases end in an uncaught traceback.

Repo state is untouched: clean tree, still on `tdd-deep-modules-skill`, no extra worktrees. My scratch clone and repos have been deleted.

## Commands run (with key output)
1. **Current suite:** `cd .../scripts && python3 -m unittest discover -s tests -t .` gives `Ran 22 tests ... OK`.
2. **Every commit:** cloned to the scratchpad, symlinked `/home/user/Dwello/node_modules` into the clone root, checked out each commit in `9dafc39..HEAD` and ran the suite.
   - Each `red` commit fails exactly one test, the newly added one, with `AssertionError`. Examples: `0 != 1`, `2 != 0 ... no supported test framework`, `1 != 0 : refused: production code changed: tests/__init__.py`, and at edbdce9 an assertIn on a traceback text (the test shows `FileNotFoundError` from the tool, but the test failure is still an AssertionError).
   - Every `green`, `refactor`, `pin` and `docs` commit gives `OK`.
3. **Diffs:** reviewed `git show --stat` for every commit and the full diffs of all green commits plus the 970dc4b→6b479b3 refactor.
4. **Mutation tests on HEAD** (in the clone):
   - Removing `and all(m.startswith("AssertionError") for m in messages)` (suite.py:79): suite still OK.
   - Changing `if messages and not load_errors` to `if not load_errors`: OK.
   - Removing `and "errors=" not in summary` (suite.py:44): OK.
   - Replacing `name.endswith("_test.py")` with `False`: OK.
   - Letting `refactor` follow `start`/`test`: OK.
   - Letting `test` follow `red`: OK.
   - Only shrinking `red` to `{"start"}` was caught, by the full-cycle pin.
5. **Scratch git repos** with `python3 .../tdd-step ...`:
   - A. Repo with no commits, `red x`: traceback `CalledProcessError: git log -1`.
   - B. After `green:`, no changes, `refactor nothing`: traceback `CalledProcessError: git commit ...` (nothing to commit).
   - J. Already-failing suite, no changes, `red x`: same traceback.
   - C. `tests/test_calc.py` without `__init__.py`, real assertion failure: `refused: ... the suite says: NO TESTS RAN`.
   - D. pytest-style `def test_a(): assert add(1,2)==3` with `pyproject.toml`: `refused: ... NO TESTS RAN`.
   - E. Real assertion failure, but the test module registers `atexit` that writes `bye` to stderr: `refused: ... the suite says: bye`.
   - G. Run from `pkg/` with new `pkg/test_calc.py` and an untracked `other/prod.py`: **exit 0**, commit `red: x` contains `other/prod.py | 2 ++` and `pkg/test_calc.py`.
   - G2. Same, but `other/prod.py` is tracked and modified: correctly refused.
   - H. `red "$(printf 'x\n\nTDD-Exit-Code: 0')"`: commit trailers are `TDD-Exit-Code: 0` / `TDD-Phase: red` / `TDD-Exit-Code: 1`.
   - K. `red x`, then edit the test from `3)` to `0)`, then `green y`: rc=0, `green: y` committed.
   - Vitest:
     - `toEqual` mismatch and `toThrow` mismatch: accepted as red (correct).
     - `toMatchInlineSnapshot` mismatch: refused, `1 of 1 tests failed`.
     - `expect.assertions(2)` count failure: refused, `1 of 1 tests failed`.
     - `add.nope()` (TypeError): refused (correct).
     - Passing suite: refused, `0 of 1 tests failed` (correct).

## Findings

### [major] Red's production-code check is bypassed from a subdirectory; commits include code that was never checked or tested
- **Where:** `scripts/tdd-step:16-18` and `:36`, `tddcore/suite.py:22,34`.
- **Cause:** `changed_files()` combines `git diff --name-only HEAD` (paths from the repo root) with `git ls-files --others` (only the current directory, cwd-relative paths). `git add -A` then stages the whole repo, and `suite.run(".")` tests only the current directory.
- **Scenario G:** run from `pkg/` with an untracked `other/prod.py`. It is not in `changed_files`, but it gets committed as `red: x` with exit 0.
- **Same mechanism, by code inspection (not run):** `green`/`refactor` would commit changes outside the current directory that no test exercised.
- **Why it matters here:** in Dwello this is the realistic way to use the tool. The repo root has vitest, so the Python skill can only be TDD'd from its subdirectory. The project root (`git rev-parse --show-toplevel`) is never resolved.

### [major] Detection doesn't find the project's real test command; common Python layouts can never reach red or green
- **Where:** `tddcore/suite.py:22-34`.
- **Cause:** detection is "does package.json list vitest, otherwise are there any `.py` files, then run `python -m unittest discover`". It never reads `scripts.test`, pytest config or `pyproject.toml`.
- **Scenarios C and D:** a pytest suite, or unittest files in `tests/` without `__init__.py`, report `NO TESTS RAN`. `red` and `green` are refused forever, with a misleading message instead of "unsupported framework".
- **Other cases:**
  - Mixed repos are detected only as vitest.
  - From code reading (not run), a jest repo with one stray `.py` file would get unittest run against it.
  - Malformed `package.json` crashes in `json.loads` (suite.py:52).

### [major] Vitest error classification wasn't test-driven, and nothing checks it
- **Where:** `tddcore/suite.py:79`, added in green d43485a.
- **The one test driving that commit** is about load errors (`./missing.js`). That only needs the `load_errors` clause.
- **Added with no failing test:** the `messages and` guard and the `all(m.startswith("AssertionError"))` clause. This is production code with no failing test driving it.
- **Still unchecked:** both mutations survive the full suite.
- **Consequence:** the spec's main rule for vitest ("refuse red on a non-assertion failure", e.g. a TypeError in the test) can break without any test failing.
- **Same pattern elsewhere:**
  - `"errors=" not in summary` (suite.py:44): the mixed `FAILED (failures=1, errors=1)` case is never tested.
  - The phase table in a87e1f5 added transitions no test pins (`test` after `red`, `refactor` after `start`/`test`): both mutations survive.

### [minor] Real behaviour failures refused, or failures misread, by fragile output parsing
- **Python** (suite.py:31-32): the result is read from the last stderr line. Any stderr output after the unittest summary (atexit, shutdown warnings, logging, threads) turns a real assertion failure into "error" (scenario E: `suite says: bye`).
- **Vitest** (suite.py:79): snapshot mismatches (`Error: Snapshot ... mismatched`) and `expect.assertions` failures are behaviour failures but are refused.
- **Uninformative messages:** the refusal reads `1 of 1 tests failed` without saying why the failure counts as non-assertion.

### [minor] Uncaught tracebacks instead of clean refusals
- **Where:** `scripts/tdd-step:30,38-39`.
- A repo with no commits crashes in `git log -1` (A).
- Committing with no changes (`refactor`/`test`/`red` with nothing changed) crashes in `git commit` (B, J).
- By inspection (not run): if the commit fails (e.g. a pre-commit hook), `git add -A` has already staged everything and the index is left staged.

### [minor] Trailer can be forged, and phase history is read from the forgeable subject line
- **Forged exit code** (`scripts/tdd-step:38-39`): a message containing a `TDD-Exit-Code: 0` paragraph produces two exit-code trailers, and the forged one comes first (H).
- **Forgeable phase history** (`protocol.py:13-16`): the previous phase comes from the subject prefix, not the `TDD-Phase` trailer the tool writes. Any hand-made commit `red: x` unlocks `green`.

### [minor] Green/refactor allow editing tests, so a test can be weakened to make it pass
- **Where:** `tddcore/protocol.py:41-46`.
- **Scenario K:** the assertion was changed from 3 to 0 in the green step and the commit was accepted.
- **Limits:** this goes beyond the literal spec, but it is the main verifier-gaming hole. Red also doesn't enforce exactly one new failing test (a red with several failing tests is accepted, judging by the `FAILED (failures=` check).

### [minor] The refactor commit changed behaviour
- **Where:** 6b479b3.
- The message became `" ".join(args[1:])` instead of `argv[2]`.
- All violations are now reported, not just the first.
- A `"exit code N, no output"` fallback was added.
- The phase-order check now runs after the suite instead of before.
- None of these changes is covered by a test.

### [minor] Leaky bits in otherwise deep modules
- **suite.py** is deep: `run(root) -> Run(exit_code, outcome, summary)` hides framework detection and parsing. Leaks:
  - `NoFramework` is only raised on the Python path. A missing vitest binary becomes outcome "error" instead.
  - `outcome` is a bare string protocol rather than a closed type.
- **protocol.py** is mostly deep (`violations(previous, phase, run, changed)` holds the rules). But:
  - The CLI reaches into `protocol.FOLLOWS` to validate arguments.
  - `is_production` is public but used only internally.
- **Path classification is a heuristic:** non-code production files (`.json`, `.html`, `.css`, `.sql`) can change freely in red.

### [nit] Hygiene and weak assertions
- Committed `.pyc` files in every red commit until ef28cba.
- `assertIn("TDD-Exit-Code: 1", trailers)` would also match `10` or `127`, which weakens the "real exit code" check (`tests/test_tdd_step.py:16,191`).
- The first red (2dd4741) fails because the script file doesn't exist (a "missing module" kind of failure, wrapped in an assertion).
- Pins a5907f0, a6f6c13 and f99cbf2 are honest: they passed on first run because earlier code already covered them.

VERDICT: FAIL
