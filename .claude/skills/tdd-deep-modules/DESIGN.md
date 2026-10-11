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
- red adds exactly one new test id and its failing tests are exactly that new test; no other phase adds tests; no phase removes tests, and a test that ran before and is now skipped, todo or filtered out counts as removed (test ids come from the frameworks' reports: bun JUnit test cases, vitest assertion results; a repeated name in a file gets a `#n` suffix, so same-named tests do not collapse);
- the range must not end in red.

## Hook (`tdd-guard`)

Registered in the `hooks:` frontmatter of `SKILL.md` as a `PreToolUse` hook for `Write|Edit|MultiEdit`, so it is active once the skill is invoked (for the rest of the session). It reads the hook JSON from stdin, resolves the file's git repository and the phase of its HEAD commit, and exits 2 (blocking, reason on stderr) when the file is production code and the last phase is `start` or `test`. Test files, test configuration and non-code files always pass; files outside git pass; unreadable input is a non-blocking error (exit 1).

Paths are resolved (`..`, symlinks) and the file's place in its repository comes from git (`git rev-parse --show-prefix` in the nearest existing directory), so no path spelling, symlink or letter case has to match git's own; a git failure other than "not a git repository" is reported as a non-blocking error; code suffixes are matched without case. The phases after which production edits are allowed come from the protocol table (`production_may_follow`), the same rules `tdd-step` enforces.

Deviation from the original wording "blocks edits to production files unless the last phase was red", made on purpose and told to the user: the hook allows production edits whenever the next commit may contain production code under `tdd-step`'s rules, i.e. after `red` (towards green) and after `green`/`refactor` (towards a refactor). Allowing them only after red would make every refactor of production code impossible, which contradicts the refactor phase and stage 2's depth check in every refactor. Behaviour smuggled into a refactor stays the documented weak spot (no new or removed tests is all `tdd_replay` can check).

## Stage 1 check (`verify_stage1`)

`verify_stage1 [skill-dir]` runs the skill's own suite (`tddcore/selfcheck.own_suite`: passes only with exit 0, a bare `OK` summary (no skips, no expected failures) and at least one test run) and, before the suite runs, reads every step's latest review (`tddcore/verdicts.final`: the highest round number of `evidence/reviews/step-NN-round-M.md`; its last line must be exactly `VERDICT: PASS`; two files for one round number or an empty/unreadable review fail). It prints the suite summary and each step's final verdict, then `STAGE1: PASS` (exit 0) or `STAGE1: FAIL` (exit 1).

## Depth report (`depth_report`)

`depth_report <file>...` measures TypeScript/JavaScript modules from their source text (`tddcore/depth.measure(root, path) -> Depth`; the CLI only formats). Surface = exported names + parameters of exported functions + public methods of exported classes and their parameters (constructor parameters count, `private`, `protected` and `#` members do not; `export { a, b }` counts names only). Size = non-blank lines outside comments; every metric reads the module with comments removed. Findings: ratio below 4 (shallow), two or more classes with one or two methods (classitis; classes without methods, such as error types, do not count), functions or arrow functions whose body only returns (or awaits) a call with their own parameters (pass-through), no test file importing the module through a relative or `$lib/` import, dynamic `import()` or `require()` (untested), unused private top-level functions or three or more repeated statement lines of at least 12 characters, not counting members of object, array and argument literals (bloat). Exit 0 without findings, 1 with findings, 2 for usage errors.

## Known limits

- The previous phase is read from the HEAD subject prefix (`red: ...`), which a hand-made commit can fake; `tdd_replay` (step 2) re-runs history and does not trust subjects or trailers.
- `tdd-step` cannot tell a new failing test from an existing test that broke; red requires exactly one failing test, and `tdd_replay` checks that exactly one new test was discovered.
- Red and refactor can weaken an existing test while the suite stays as required: change its assertion, invert it (`test.failing`, `test.fails`), or mock the code under test in a setup file (`--preload`, `setupFiles`). Neither `tdd-step` nor `tdd_replay` reads assertions or mocks. (Skipping or filtering tests is caught by `tdd_replay`.)
- A skipped or todo placeholder that a red turns into a real test is not new (its id existed), so that red is rejected ("adds 0"); write the new test without a placeholder.
- With `--bail` (bun) or `bail` (vitest), tests after the first failure do not run, so a red or green with a failure reads as removing them; do not use bail with these tools.
- Stopping `tdd_replay` with a signal removes its worktree; a vitest child process may keep running from the deleted directory until its tests end.
- Test data that is not code (for example a JSON file of expected values at the repository root) is not classified as test code, so green may change it.
- Tests run on the working tree; a gitignored file the tests depend on is not committed. The working-tree snapshot uses a fresh index, so a test run that modifies a tracked-but-gitignored file is not noticed.
- Dwello's backend tests need PostgreSQL (`bun test --preload ./scripts/test-db.ts`). Without a database the bun run fails, so every red, green and refactor in Dwello is refused there. That is the rule, not a bug.
- A bun run that exits non-zero with no failing test and no reported error (for example a coverage threshold) is an error, never red.
- A same-named test inserted before an existing one in the same file takes the existing test's id (`#n` numbering follows report order), so that red is rejected; add same-named tests after the existing ones.
- Importing a module that does not exist is an import error, which is never red. The first test of a new module therefore imports it dynamically and catches the failure, so the red is an assertion (references/tooling.md); a static import of a missing module is refused.
- The replay judges the first-parent chain; a merge commit shows no changed files and is therefore rejected ("nothing changed"). Replay linear TDD histories.
- Renaming or moving a test in refactor reads as one test removed and one added, so the replay rejects it. Rename tests as part of their red, or not at all.
- A test-phase commit whose run crashes (no test ids) reads as removing every test.
- The replay worktree borrows `node_modules` through a symlink, so tools that cache inside `node_modules` (vitest's `.vite` cache) write into the caller's installation.
- `tdd_replay` exits 2 (not 1) on any unexpected error, so a crash is never read as REJECT; SIGTERM and Ctrl-C remove the replay worktree.
- The hook guards `Write`, `Edit` and `MultiEdit` only. Production files changed through `Bash` (`sed -i`, redirection) or `NotebookEdit` are not blocked; `tdd-step` and `tdd_replay` still judge them at commit time.
- The hook command assumes the skill lives at `$CLAUDE_PROJECT_DIR/.claude/skills/tdd-deep-modules` (Claude Code documents no skill-directory variable for hooks). Installed elsewhere, the command fails with a non-blocking error and the guard is off.
- Test-file names are matched generously (`test_*`, `*_test.*`, `*.test.*`, `*.spec.*`, test directories); a production file named like a test passes the guard.
- A hardlink inside a test directory to a production file is classified by its own path (test code), so editing it changes production content unguarded; creating one needs Bash, which is unguarded anyway.
- The hook reads the phase from the HEAD subject; a hand-made `git commit -m "red: ..."` (through Bash) unlocks it. `tdd_replay` judges such commits from real runs later.
- `verify_stage1` reads only a review's last line; an earlier `VERDICT: FAIL` line in the same file does not count. Test files in subdirectories of `scripts/tests` without `__init__.py` are not discovered. Untracked review files count. The suite verdict comes from unittest's last stderr line: a late warning after `OK` fails the check, and a test that deliberately prints `OK` and exits 0 can fake a pass.
- `tdd-guard`: a source directory on another mount than the repository is outside git's discovery and passes silently; files under `.git/` are judged like files at the repository root (they fail closed after a test commit); without git on PATH the hook prints a traceback (non-blocking).
- `depth_report` reads source text with regular expressions, not a parser: comment markers inside strings (`"http://..."`), parameter lists with nested parentheses, nested type parameters (`<T extends Map<K, V>>`), abstract methods, symlinked module names and import aliases other than `$lib` (tsconfig paths) are not understood. A module without exports gets ratio = size. Repeated query fragments (`.from(table)`, `const today = ...`) count as duplicates, so large service modules often show a bloat finding; the numbers are prompts for the refactor, not verdicts.
