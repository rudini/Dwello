# tdd-deep-modules: design and limits

## Modules

| Module | Interface | Hides |
|---|---|---|
| `scripts/tddcore/suite.py` | `run(root) -> Run(exit_code, outcome, summary, failed, ran)`, `NoFramework` | framework detection, running every detected suite and combining them, parsing JSON/JUnit/text reports, classifying |
| `scripts/tddcore/protocol.py` | `PHASES`, `phase_of(subject)`, `is_production(path)`, `violations(previous, phase, run, changed)` | phase order table, file classification, every refusal rule |
| `scripts/tdd-step` | CLI | git plumbing (root, changed files, index restore) |

## Detection

From the repository root, every framework that applies runs:
- vitest: `package.json` lists `vitest` (must be installed in `node_modules`). Another `scripts.test` without vitest exits 2 (unsupported).
- pytest: `pytest.ini`, `conftest.py`, `pyproject.toml [tool.pytest`, `setup.cfg [tool:pytest]`, `tox.ini [pytest]`, or a `test_*.py`/`*_test.py` file with a module-level `def test`.
- unittest: otherwise, when the repository has Python files (`python -m unittest discover` from the root).

A framework that ran no tests is left out when another one ran tests (Dwello: vitest plus Python files that are not a root-discoverable suite). Combined: outcome is the worst (error > fail > pass), exit code the highest, failures and run counts summed. A "pass" in which no test ran (or all were skipped) is an error.

## Classification

- `outcome = "fail"` only when every failure is an assertion failure: unittest `FAILED (failures=N)` without `errors=`; pytest JUnit `<failure>` messages starting with `assert`, `AssertionError` or `Failed:` (`pytest.raises`, `pytest.fail`) and no `<error>`; vitest failure messages starting with `AssertionError`, no file-level load error and no unhandled errors. Everything else that is not a pass is `"error"` (import, syntax, collection, config, other exceptions, no tests).
- Deliberately strict: a vitest snapshot mismatch, an `expect.assertions(n)` miss or a test that raises a non-assertion exception is not accepted as red. Write the red test so it fails on an assertion.
- Production file = code suffix (`.py .js .jsx .mjs .cjs .ts .tsx .mts .cts .svelte .vue`) that is not a test file (`test_*.py`, `*_test.py`, `*.test.*`, `*.spec.*`, `conftest.py`, `vitest.config.*`, or under `tests/`, `test/`, `__tests__/`). Non-code files (JSON, CSS, SQL, Markdown) are neither and are not policed.

## Rules (`protocol.violations`)

- Order: `test` and `red` follow start/test/green/refactor; `green` only follows `red`; `refactor` follows green/refactor.
- `test`: no code changes (test list only).
- `red`: suite fails with exactly one failing assertion; no production file changed.
- `green`: all tests pass; no test file changed.
- `refactor`: all tests pass (test and production code may change).
- Every phase commit needs a change.
- `tdd-step` itself also refuses when running the tests changed the working tree (the commit would not be what was tested).

## Known limits

- The previous phase is read from the HEAD subject prefix (`red: ...`), which a hand-made commit can fake; `tdd_replay` re-runs history and does not trust subjects or trailers.
- `tdd-step` cannot tell a new failing test from an existing test that broke; red requires exactly one failing test, and `tdd_replay` checks that exactly one new test was discovered.
- Refactor can still weaken a test, or skip some (not all) tests, while keeping the suite green.
- Tests run on the working tree; a gitignored file the tests depend on is not committed. `tdd_replay` re-runs clean checkouts and exposes this.
- Python suites run with the interpreter that runs `tdd-step` (`sys.executable`); run `tdd-step` from the project's virtualenv. A detected pytest project without pytest installed is refused as an error, not reported as a missing framework.
- unittest counts each failing `subTest` as a failure, so one new test with two failing subtests is refused as "2 fail".
- Python tests that root-level `unittest discover` cannot reach (like this skill's own tests under `.claude/`) are not part of the project's suite.
