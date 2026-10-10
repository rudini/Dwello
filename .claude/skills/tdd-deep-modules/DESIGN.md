# tdd-deep-modules: design and limits

## Modules

| Module | Interface | Hides |
|---|---|---|
| `scripts/tddcore/suite.py` | `run(root) -> Run(exit_code, outcome, summary, failed)`, `NoFramework` | framework detection (vitest > pytest > unittest), running, parsing JSON/JUnit/text reports, classifying |
| `scripts/tddcore/protocol.py` | `PHASES`, `phase_of(subject)`, `is_production(path)`, `violations(previous, phase, run, changed)` | phase order table, file classification, every refusal rule |
| `scripts/tdd-step` | CLI | git plumbing (root, changed files, index restore) |

## Classification

- `outcome = "fail"` only when every failure is an assertion failure: unittest `FAILED (failures=N)` without `errors=`; pytest JUnit `<failure>` messages starting with `assert`/`AssertionError` and no `<error>`; vitest failure messages starting with `AssertionError` and no file-level load error. Everything else that is not a pass is `"error"` (import, syntax, collection, config, other exceptions, no tests).
- Deliberately strict: a vitest snapshot mismatch, an `expect.assertions(n)` miss or a test that raises a non-assertion exception is not accepted as red. Write the red test so it fails on an assertion.
- Production file = code suffix (`.py .js .jsx .mjs .cjs .ts .tsx .mts .cts .svelte .vue`) that is not a test file (`test_*.py`, `*_test.py`, `*.test.*`, `*.spec.*`, or under `tests/`, `test/`, `__tests__/`). Non-code files (JSON, CSS, SQL, Markdown) are neither and are not policed.

## Rules (`protocol.violations`)

- Order: `test` and `red` follow start/test/green/refactor; `green` only follows `red`; `refactor` follows green/refactor.
- `test`: no code changes (test list only).
- `red`: suite fails with exactly one failing assertion; no production file changed.
- `green`: all tests pass; no test file changed.
- `refactor`: all tests pass (test and production code may change).
- Every phase commit needs a change.

## Known limits

- The previous phase is read from the HEAD subject prefix (`red: ...`), which a hand-made commit can fake; `tdd_replay` re-runs history and does not trust subjects or trailers.
- `tdd-step` cannot tell a new failing test from an existing test that broke; red requires exactly one failing test, and `tdd_replay` checks that exactly one new test was discovered.
- Refactor can still weaken a test while keeping the suite green.
