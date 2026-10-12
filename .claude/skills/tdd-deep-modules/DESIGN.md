# tdd-deep-modules: design and limits

## Scope

`tdd-step` supports the two test runners Dwello uses: **vitest** (frontend) and **bun test** (backend). Python suites (pytest, unittest) were supported earlier and removed by decision after review step-01 round 6, to keep the classification surface small. A repository without a vitest or bun test setup exits 2.

## Modules

| Module | Interface | Hides |
|---|---|---|
| `scripts/tddcore/suite.py` | `run(root, tier) -> Run(exit_code, outcome, summary, failed, ran)`, `NoFramework` | finding every vitest / bun package, the command of each tier, running each, parsing vitest JSON and bun JUnit + summary, classifying, combining |
| `scripts/tddcore/protocol.py` | `PHASES`, `TIERS`, `default_tier(phase)`, `phase_of(subject)`, `is_production(path)`, `violations(previous, phase, run, changed, suite, previous_suite)` | phase order table, file classification, every refusal rule, the tier rules |
| `scripts/tddcore/replay.py` | `replay(repo, rev_range) -> [Verdict(commit, phase, run, violations, suite)]`, `ReplayError` | listing the range, a private worktree, borrowing `node_modules`, running each commit, judging it |
| `scripts/tdd-step` | CLI | git plumbing: repository root, changed files, working-tree snapshot, index restore |
| `scripts/tdd_replay` | CLI | output format and exit codes (0 accept, 1 reject, 2 usage/git error) |

## Detection

Every tracked `package.json` (root and nested, e.g. Dwello's `backend/`), run in its own directory:
- `vitest` in dependencies -> vitest (`npx --no-install vitest run` with the JSON reporter); must be installed in that `node_modules`, else exit 2.
- otherwise a `scripts.test` with a `bun test ...` segment (split on `&&`, `||`, `;`; env prefixes such as `NODE_ENV=test bun test` work) -> that segment through `sh -c` with a JUnit reporter. Other parts of the script (coverage checks, `cd x &&`) are not run; the segment runs in the package.json directory. bun must be on PATH, else exit 2.
- npm's placeholder `echo "Error: no test specified" && exit 1` means no tests; any other `scripts.test` exits 2 (unsupported). Malformed or oddly shaped package.json exits 2.

## Tiers

The project defines two suites, and both tools read their commands from each `package.json`, never assume them: the **full** tier runs `scripts.test` (in Dwello's backend: unit tests, `*.pg.test.ts` against PostgreSQL, and the API contract test `api-contracts.pg.test.ts`); the **fast** tier runs `scripts["test:fast"]` (Dwello's backend: `bun test --path-ignore-patterns=**/*.pg.test.ts`, no database, no external network; `mail.test.ts` binds a stand-in on localhost), or `scripts.test` where a package declares no fast suite. The same `bun test` segment rules apply to both scripts. Vitest packages run `vitest run` in both tiers (Dwello's frontend tests need neither database nor external network). `tdd-step` records the tier in the `TDD-Suite` trailer.

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
- `test`: no code files change (the test list, notes; other non-code files such as `.json` or `.sql` are not policed); after a green or refactor the suite must still pass, and right after a green on the fast suite a `test` commit is refused (it starts a new task, and the task before must end on the full suite).
- `red`: suite fails with exactly one failing assertion; no production file changed.
- `green`: all tests pass; no test file or test configuration changed.
- `refactor`: all tests pass (test and production code may change).
- Tiers: test, red and green run the fast suite unless `--suite full`; refactor runs the full suite (`--suite fast` is refused); a green after a red on the full suite must run the full suite.
- Every phase commit needs a change.
- `tdd-step` also refuses when running the tests changed the working tree, so the commit is exactly what was tested.

## Replay (`tdd_replay <commit-range>`)

Every commit of the range (first-parent, oldest first) is checked out in a temporary git worktree (cleaned with `git clean -fdx`, installed `node_modules` linked from the caller's checkout) and both its suites are run (fast and full). The commit before the range is run too, to know which tests already exist. Each commit's phase and tier are read from its subject and `TDD-Suite` trailer; whether it holds them is judged from its own runs, never from what the commit claims about them:
- the commit must carry a phase prefix and a `TDD-Suite` trailer of `fast` or `full`; the protocol rules above apply with the claimed phase and tier, on the run of the claimed tier;
- its `TDD-Exit-Code` trailer must equal the real exit code of the claimed tier;
- which tests are new comes from the full runs; a test that ran in the previous commit's full run, or in its fast run, and no longer runs in the same tier (gone, skipped, todo, or filtered out, for example by a changed `test:fast`) is removed, and no phase may remove tests; red's new test must be in the run of its claimed tier (a red on the fast suite for a test that exists only in the full tier is rejected; such a red also fails the other red rules, so this rule only names the cause);
- red adds exactly one new test id and its failing tests are exactly that new test; no other phase adds tests; no phase removes tests, and a test that ran before and is now skipped, todo or filtered out counts as removed (test ids come from the frameworks' reports: bun JUnit test cases, vitest assertion results; a repeated name in a file gets a `#n` suffix, so same-named tests do not collapse);
- the range must not end in red, its last commit must leave the full suite passing (also when it is a `test:` commit after the task's end), and the last commit of every task must have run the full suite and passed it. A task ends at every green or refactor that a `test:` commit (the next task's test list) follows, and at the range's last green or refactor (`test:` commits after it, such as the design note, are not held to it; a range without any green or refactor is judged by its last commit). `tdd-step test` refuses a test list right after a green on the fast suite (protocol rule), so the end of a task is known at commit time.

## Hook (`tdd-guard`)

Registered in the `hooks:` frontmatter of `SKILL.md` as a `PreToolUse` hook for `Write|Edit|MultiEdit`, so it is active once the skill is invoked (for the rest of the session). It reads the hook JSON from stdin, resolves the file's git repository and the phase of its HEAD commit, and exits 2 (blocking, reason on stderr) when the file is production code and the last phase is `start` or `test`. Test files, test configuration and non-code files always pass; files outside git pass; unreadable input is a non-blocking error (exit 1).

Paths are resolved (`..`, symlinks) and the file's place in its repository comes from git (`git rev-parse --show-prefix` in the nearest existing directory), so no path spelling, symlink or letter case has to match git's own; a git failure other than "not a git repository" is reported as a non-blocking error; code suffixes are matched without case. The phases after which production edits are allowed come from the protocol table (`production_may_follow`), the same rules `tdd-step` enforces.

Deviation from the original wording "blocks edits to production files unless the last phase was red", made on purpose and told to the user: the hook allows production edits whenever the next commit may contain production code under `tdd-step`'s rules, i.e. after `red` (towards green) and after `green`/`refactor` (towards a refactor). Allowing them only after red would make every refactor of production code impossible, which contradicts the refactor phase and stage 2's depth check in every refactor. Behaviour smuggled into a refactor stays the documented weak spot (no new or removed tests is all `tdd_replay` can check).

## Stage 1 check (`verify_stage1`)

`verify_stage1 [skill-dir]` runs the skill's own suite (`tddcore/selfcheck.own_suite`: passes only with exit 0, a bare `OK` summary (no skips, no expected failures) and at least one test run) and, before the suite runs, reads every step's latest review (`tddcore/verdicts.final`: the highest round number of `evidence/reviews/step-NN-round-M.md`; its last line must be exactly `VERDICT: PASS`; two files for one round number or an empty/unreadable review fail). It prints the suite summary and each step's final verdict, then `STAGE1: PASS` (exit 0) or `STAGE1: FAIL` (exit 1).

## Depth report (`depth_report`)

`depth_report <file>...` measures TypeScript/JavaScript modules from their source text (`tddcore/depth.measure(root, path) -> Depth`; the CLI only formats). Surface = exported names (each declarator of `export const a = 1, b = 2` counts) + parameters of exported functions, counted by their brackets so callback types, default objects and type parameters do not cut the list short, + public methods of exported classes and their parameters (constructor parameters count, `private`, `protected` and `#` members do not; `export { a, b }` counts names only). Size = non-blank lines outside comments; every metric reads the module with comments removed. Findings: ratio below 4 (shallow), two or more classes with one or two methods (classitis; classes without methods, such as error types, do not count), three or more exported functions (`export function f`, `export const f = (...) =>`) whose body (after any return type, object types included) has at most 20 code lines, whose name the module uses exactly once besides declaring it (recursive calls inside its own body and overload signatures do not count) and no other production file of the repository names outside its comments (classitis: a swarm of exported helpers with one caller, exported only to be tested; a functional core of private functions, and public functions other modules use, do not count; `Depth.has_classitis` combines tiny classes and the swarm), functions (after `function`), methods (a name at the start of its line, after optional modifiers) or arrow functions (block or expression body) whose whole body is one call, optionally awaited, that receives exactly their own parameters in order (pass-through), no test file importing the module through a relative or `$lib/` import, dynamic `import()` or `require()` (untested), unused private top-level functions or three or more repeated statement lines of at least 12 characters, not counting members of object, array and argument literals (bloat). Exit 0 without findings, 1 with findings, 2 for usage errors.

## Skill lint (`skill_lint`)

`skill_lint [skill-dir]` checks the skill itself (`tddcore/lint.problems(skill) -> [message]`; the CLI prints them, exit 0 OK, 1 problems, 2 no SKILL.md). Frontmatter (read with PyYAML): present and valid YAML; `name` kebab-case, at most 64 characters, equal to the directory name; `description` present, at most 1024 characters, no angle brackets; only keys Claude Code reads. No byte order mark, no duplicate top-level key, `name` and `description` must be text. The hook: a `PreToolUse` entry whose matcher covers Write and Edit (no, an empty or a `*` matcher matches every tool, as in Claude Code) with a `command` hook that runs exactly `.claude/skills/<name>/scripts/tdd-guard` (directly or through `sh`/`bash`, nothing else on the line), which must exist and be executable. Content: every section in `lint.REQUIRED` with its phrases (case-insensitive), the statements of `lint.STATEMENTS` (the test boundary, the doubles rule, the helper swarm) each written out whole on the line of its bold item, starting a sentence and ending as written, the hard rules first, the six workflow sections in order, the design note last; fewer than 400 lines; every `references/...md` link resolves and the three reference files are linked; `## ` lines inside code fences (``` or ~~~) and HTML comments are not sections. Trigger behaviour is checked separately with skill-creator's `run_eval.py` (`evals/`), because it calls the model.

## Stage 2b check (`verify_all`) and `verifiers.lock`

Stage 2b (the two-tier suite, the doubles and depth rules, the helper swarm) replaced stage 2's pass line; `verify_all` now checks the reviews of steps 01-12 and prints `STAGE2B`. `verify_all [skill-dir]` holds no branches: it moves its own directory from the front to the end of `sys.path` before importing anything but `sys` (so no file in `scripts/` can shadow the standard library or PyYAML), points `sys.pycache_prefix` and `PYTHONPYCACHEPREFIX` (inherited by the test run) at a fresh temporary directory (so no bytecode left in `scripts/` is ever loaded), calls `tddcore/gate.stage2`, prints its lines, removes the cache and exits with `not passed`. The rule lives in `gate.stage2(skill) -> (passed, lines)`: the reviews of steps 01-12 (`gate.STEPS`), the lock and `skill_lint` all read their input first, then the skill's own suite runs (`selfcheck.own_suite`, with `python -P` so nothing in the caller's working directory can replace `unittest`), so nothing a test does can change another check. The suite must pass, `skill_lint` must find nothing, every step's latest review must end in `VERDICT: PASS`, and `verifiers.lock` must hold. It prints `tests: ...`, the lint result, one `step NN: ...` line per step, the lock result, then `STAGE2B: PASS` (exit 0) or `STAGE2B: FAIL` (exit 1).

`verifiers.lock` is written after step 12's clean review (`gate.LOCK_STEP`; it was step 08 for stage 2) and ties every file the scripts can load to it: the first line is `reviewed: evidence/reviews/step-12-round-N.md`, which must be an existing file of step 12's latest round, and that round must pass; then exactly one `<sha256>  <path>` line (lowercase hex, two spaces) for every file under `scripts/` except the top-level `scripts/tests/` and `__pycache__/` directories (all CLIs, `tddcore/*` including `__init__.py`). A file under `scripts/` missing from the lock (for example a new `scripts/hashlib.py`), any symbolic link in the locked part of `scripts/` (everything but `scripts/tests/` and `__pycache__/`), a changed or deleted file, a duplicate or malformed line, or a lock that is not UTF-8 fails stage 2b until a new review passes and the lock is rewritten. This holds for every file under `scripts/` except the ones `verify_all` runs before it hashes them (see known limits); those are checked by the independent command below. Paths with spaces cannot be locked (they always read "not locked"). Write the lock with:

```bash
cd .claude/skills/tdd-deep-modules
{ echo "reviewed: evidence/reviews/step-12-round-N.md"
  find scripts -type f -not -path 'scripts/tests/*' -not -path '*/__pycache__/*' | sort | xargs sha256sum; } > verifiers.lock
```

Check the lock with system tools only, without running any of the skill's code (both commands print nothing and exit 0 when the lock holds). The first catches a changed or missing file; the second lists every entry that is not a directory, so an added file and an added symbolic link (which the lock never holds) both show up:

```bash
cd .claude/skills/tdd-deep-modules
tail -n +2 verifiers.lock | sha256sum --check --quiet
diff <(tail -n +2 verifiers.lock | cut -c67- | sort) \
     <(find scripts -not -type d -not -path 'scripts/tests/*' -not -path '*/__pycache__/*' | sort)
```


## Known limits

- The previous phase is read from the HEAD subject prefix (`red: ...`), which a hand-made commit can fake; `tdd_replay` (step 2) re-runs history and does not trust subjects or trailers.
- `tdd-step` cannot tell a new failing test from an existing test that broke; red requires exactly one failing test, and `tdd_replay` checks that exactly one new test was discovered.
- Red and refactor can weaken an existing test while the suite stays as required: change its assertion, invert it (`test.failing`, `test.fails`), or mock the code under test in a setup file (`--preload`, `setupFiles`). Neither `tdd-step` nor `tdd_replay` reads assertions or mocks. (Skipping or filtering tests is caught by `tdd_replay`.)
- A skipped or todo placeholder that a red turns into a real test is not new (its id existed), so that red is rejected ("adds 0"); write the new test without a placeholder.
- With `--bail` (bun) or `bail` (vitest), tests after the first failure do not run, so a red or green with a failure reads as removing them; do not use bail with these tools.
- Stopping `tdd_replay` with a signal removes its worktree; a vitest child process may keep running from the deleted directory until its tests end.
- Test data that is not code (for example a JSON file of expected values at the repository root) is not classified as test code, so green may change it.
- Tests run on the working tree; a gitignored file the tests depend on is not committed. The working-tree snapshot uses a fresh index, so a test run that modifies a tracked-but-gitignored file is not noticed.
- Dwello's full backend suite needs PostgreSQL (`bun test --preload ./scripts/test-db.ts`). Without a database the full run fails, so every refactor, every `--suite full` step and the final commit of a task are refused there (red and green on the fast suite work). That is the rule, not a bug.
- A green on the fast suite after a red on the fast suite is not checked against the full suite by `tdd-step`; a production change that breaks a database test shows up at the next refactor or the end of the task (both full); `tdd_replay` sees it in that green's full run only as a failure there, not as a violation of the green.
- A task is recognised by its test list: a task that starts with a red instead of a `test:` commit merges with the task before it for the end-of-task rule.
- A vitest package's tiers are the same command; a `test:fast` script in a vitest package is not read.
- `tdd_replay` runs both suites of every commit, so replaying a range needs everything the full suite needs (Dwello: PostgreSQL) and takes about two suite runs per commit; a vitest package (same command in both tiers) runs twice.
- Within one task, a full refactor that makes a database test pass again after a fast green broke it changes behaviour and is accepted; only the task's last commit is held to the full suite.
- A `tdd-step` message whose first word starts with `--` exits 2 (taken for an option); start it with another word.
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
- The helper swarm matches names as words: a helper whose name also appears in a string, a type, a property access or an object key (`obj.toRappen`, `{ toRappen: ... }`) in the module or in any other production file is not counted. Exports through `export { a, b }` lists, `export const f = function (...)` and arrows without brackets around their parameter (`x => ...`) are not read as helpers.
- Only helpers with exactly one caller count: an exported function with no production caller at all (exported and tested, called by nothing) is not counted, because a new module's public functions look the same. A function of the same name declared in an unrelated file also hides a helper. `export const x = (a + b) * c` (a bracketed expression) is read like an arrow helper.
- `depth_report` reads source text with regular expressions, not a parser: comment markers and brackets inside strings (`"http://..."`, `"("`), a comparison written without a space after a name (`a<b`) inside a parameter list, type annotations that contain `=`, abstract methods, symlinked module names and import aliases other than `$lib` (tsconfig paths) are not understood. A module without exports gets ratio = size. Repeated query fragments (`.from(table)`, `const today = ...`) count as duplicates, so large service modules often show a bloat finding; the numbers are prompts for the refactor, not verdicts.
- The doubles rule (hard rule 6) asks for a project-owned adapter around framework modules; Dwello's `docs/test-pyramid.md` still prescribes `vi.mock` for `$app/*`, and 27 files under `src/` and `tests/` do that. Which rule wins in Dwello (migrate the existing mocks, or keep them for old tests) is open and the user's decision; the skill does not change Dwello's docs.
- `depth_report`'s "untested" finding means no test imports the module; for a helper module with a single owner the answer is to merge it into its owner (hard rule 4), not to give it tests of its own.
- `skill_lint` needs PyYAML. Required phrases are matched as text, and every bold list item of the hard rules, Design It Twice, the cycle, the depth check and the design note must open its line exactly (`lint.ITEMS`), so "Prefer classitis" or "Do not name the one hidden decision" fail; a statement that is present and contradicted in another sentence (for the statements of `lint.STATEMENTS`: in another sentence of the same line, or elsewhere), or plain text outside those items, can still pass; a negation or qualifier inside a `lint.STATEMENTS` sentence, or moving it off its item's line, is named. An unreadable SKILL.md (permissions) ends in a traceback.
- `scripts/tests/` and SKILL.md are not in the lock: a weakened test (for example in `test_skill_md.py`) together with a matching SKILL.md edit passes stage 2b without a new review; the review files and git history show it. If `verify_all` crashes before its last statement, its temporary bytecode directory stays behind.
- `verify_all` runs `verify_all` itself, `tddcore/__init__.py`, `gate.py`, `lint.py`, `selfcheck.py` and `verdicts.py` before `gate._lock` hashes them, so an edit to one of those that switches the check off (for example `_lock = lambda skill: []`) passes `verify_all` with the lock untouched. A checker cannot detect a change to itself; the independent commands above (`sha256sum --check` for edits, the `diff` for added files and symbolic links), run with system tools, catch it.
- The verifiers need Python 3.11 or later (`python -P` for the test run); older versions make the test run fail and stage 1 and 2b report FAIL.
- `verifiers.lock` guards the scripts against unreviewed edits and added files, not against an author who edits a script and rewrites the lock in one go (the review files and git history are the record for that), and not against changes outside the skill that Python loads first (`sitecustomize`, `usercustomize`, `.pth` files, `PYTHONPATH`, a replaced interpreter or PyYAML).
