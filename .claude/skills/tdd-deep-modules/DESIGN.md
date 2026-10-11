# tdd-deep-modules: design and limits

## Scope

`tdd-step` supports the two test runners Dwello uses: **vitest** (frontend) and **bun test** (backend). Python suites (pytest, unittest) were supported earlier and removed by decision after review step-01 round 6, to keep the classification surface small. A repository without a vitest or bun test setup exits 2.

## Modules

| Module | Interface | Hides |
|---|---|---|
| `scripts/tddcore/suite.py` | `run(root) -> Run(exit_code, outcome, summary, failed, ran)`, `NoFramework` | finding every vitest / bun package, running each, parsing vitest JSON and bun JUnit + summary, classifying, combining |
| `scripts/tddcore/protocol.py` | `PHASES`, `phase_of(subject)`, `is_production(path)`, `violations(previous, phase, run, changed)` | phase order table, file classification, every refusal rule |
| `scripts/tddcore/replay.py` | `replay(repo, rev_range) -> [Verdict(commit, phase, run, violations)]`, `ReplayError` | listing the range, a private worktree, borrowing `node_modules`, running each commit, judging it |
| `scripts/tdd-step` | CLI | git plumbing: repository root, changed files, working-tree snapshot, index restore |
| `scripts/tdd_replay` | CLI | output format and exit codes (0 accept, 1 reject, 2 usage/git error) |

## Detection

Every tracked `package.json` (root and nested, e.g. Dwello's `backend/`), run in its own directory:
- `vitest` in dependencies -> vitest (`npx --no-install vitest run` with the JSON reporter); must be installed in that `node_modules`, else exit 2.
- otherwise a `scripts.test` with a `bun test ...` segment (split on `&&`, `||`, `;`; env prefixes such as `NODE_ENV=test bun test` work) -> that segment through `sh -c` with a JUnit reporter. Other parts of the script (coverage checks, `cd x &&`) are not run; the segment runs in the package.json directory. bun must be on PATH, else exit 2.
- npm's placeholder `echo "Error: no test specified" && exit 1` means no tests; any other `scripts.test` exits 2 (unsupported). Malformed or oddly shaped package.json exits 2.

Every detected framework counts. Combined: outcome is the worst (error > fail > pass), the exit code the highest, failures and run counts summed. A framework that has no tests, writes no report, or crashes makes the run an error. A "pass" in which no test ran (none found, all skipped or todo) is an error.

## Classification

`outcome = "fail"` (a red) only when every failure is an assertion failure:
- vitest: failure messages start with `AssertionError`, or `Error: expected ...` / `Error: promise resolved|rejected ...` raised inside vitest's assertion chain (`.resolves`, `.rejects`); no file-level load error; no `Vitest caught N unhandled error(s)` line.
- bun: every JUnit `<failure>` has `type="AssertionError"`, and bun's closing summary (the counter lines above `Ran N tests across`) reports no `N error(s)`; files that fail to load never reach bun's JUnit report.

Everything else that is not a pass is `"error"` (import, syntax, load, config, thrown errors, unhandled errors, no tests).

Deliberately strict: a vitest snapshot mismatch, an `expect.assertions(n)` miss, `expect.poll` timeouts or a thrown non-assertion error is not accepted as red.

Production file = code suffix (`.py .js .jsx .mjs .cjs .ts .tsx .mts .cts .svelte .vue`) that is not a test file (`test_*.py`, `*_test.py`, `*.test.*`, `*.spec.*`, or under `tests/`, `test/`, `__tests__/`). Test configuration also counts as test files, because it decides which tests run: `package.json`, `vitest.config.*`, `vite.config.*` (and Python's `conftest.py`, `pytest.ini`, `.pytest.ini`, `pytest.toml`, `pyproject.toml`, `setup.cfg`, `tox.ini`). Non-code files (JSON other than package.json, CSS, SQL, Markdown) are neither and are not policed.

## Rules (`protocol.violations`)

- Order: `test` and `red` follow start/test/green/refactor; `green` only follows `red`; `refactor` follows green/refactor.
- `test`: no code changes (test list only).
- `red`: suite fails with exactly one failing assertion; no production file changed.
- `green`: all tests pass; no test file or test configuration changed.
- `refactor`: all tests pass (test and production code may change).
- Every phase commit needs a change.
- `tdd-step` also refuses when running the tests changed the working tree, so the commit is exactly what was tested.

## Replay (`tdd_replay <commit-range>`)

Every commit of the range (first-parent, oldest first) is checked out in a temporary git worktree (cleaned with `git clean -fdx`, installed `node_modules` linked from the caller's checkout) and its tests are run. The commit before the range is run too, to know which tests already exist. Each commit is judged from its own run, never from its subject or trailers:
- the commit must carry a phase prefix; the protocol rules above apply with the claimed phase;
- its `TDD-Exit-Code` trailer must equal the real exit code;
- red adds exactly one new test id and its failing tests are exactly that new test; no other phase adds tests; no phase removes tests (test ids come from the frameworks' reports: bun JUnit test cases, vitest assertion results; a repeated name in a file gets a `#n` suffix, so same-named tests do not collapse);
- the range must not end in red.

## Known limits

- The previous phase is read from the HEAD subject prefix (`red: ...`), which a hand-made commit can fake; `tdd_replay` (step 2) re-runs history and does not trust subjects or trailers.
- `tdd-step` cannot tell a new failing test from an existing test that broke; red requires exactly one failing test, and `tdd_replay` checks that exactly one new test was discovered.
- Refactor can weaken a test or skip some (not all) tests while the suite stays green.
- Tests run on the working tree; a gitignored file the tests depend on is not committed. The working-tree snapshot uses a fresh index, so a test run that modifies a tracked-but-gitignored file is not noticed.
- Dwello's backend tests need PostgreSQL (`bun test --preload ./scripts/test-db.ts`). Without a database the bun run fails, so every red, green and refactor in Dwello is refused there. That is the rule, not a bug.
- A bun run that exits non-zero with no failing test and no reported error (for example a coverage threshold) is an error, never red.
- A new function or module cannot get its first red without existing production code: importing something that does not exist is an import error, which is never red. The stub has to exist before the cycle (from an earlier green or refactor). Stage 2's skill text addresses this when the interface is designed.
- The replay judges the first-parent chain; a merge commit shows no changed files and is therefore rejected ("nothing changed"). Replay linear TDD histories.
- Renaming or moving a test in refactor reads as one test removed and one added, so the replay rejects it. Rename tests as part of their red, or not at all.
- A test-phase commit whose run crashes (no test ids) reads as removing every test.
- The replay worktree borrows `node_modules` through a symlink, so tools that cache inside `node_modules` (vitest's `.vite` cache) write into the caller's installation.
- `tdd_replay` exits 2 (not 1) on any unexpected error, so a crash is never read as REJECT; SIGTERM and Ctrl-C remove the replay worktree.
