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

- [x] a hand-built good history (test, red, green, refactor, red, green) is accepted
- [x] a commit that only claims red (its suite passes) is rejected
- [x] an import error committed as red is rejected
- [x] production code committed before its red test (in the red commit) is rejected
- [x] a refactor on red (refactor whose suite fails) is rejected
- [x] two new tests in one cycle (framework discovery: one fails, one passes) are rejected
- [x] a trailer exit code that differs from the real run is rejected
- [x] a history that ends in red is rejected
- [x] a commit without a phase prefix is rejected
- [x] green or refactor that removes tests is rejected
- [x] a bad range, an empty range, a missing argument or a path outside git exits 2
- [x] vitest histories replay (the worktree borrows node_modules)
- [x] the replay leaves the caller's working tree, index and branch untouched
- [x] a test added outside red is rejected
- [x] a range that starts at the first commit is replayed
- [x] a commit without a test framework is rejected
- [x] tests that exist before the range are not counted as new (the base commit is run too)

## Step 3: PreToolUse hook `tdd-guard`, registered in SKILL.md frontmatter

Reads the hook JSON on stdin. Exit 2 (with the reason on stderr) blocks the tool call; exit 0 lets it through.
Rule: a production file may be edited only when the next commit may contain production code, i.e. the last phase is `red` (towards green) or `green`/`refactor` (towards a refactor). After start or `test`, production edits are blocked.

- [x] Edit of a production file after a `test` commit is blocked (exit 2, reason names the file and the phase)
- [x] Edit of a production file after `red` is allowed
- [x] after `green` and `refactor` it is allowed (refactoring)
- [x] in a repository without TDD commits (start) it is blocked
- [x] Write of a new production file is judged the same way; Write/Edit of a test file is always allowed
- [x] MultiEdit is covered; tools without a file_path (Bash, NotebookEdit: notebooks are never production) pass
- [x] files outside a git repository pass; malformed input is a non-blocking error (exit 1), never a block
- [x] SKILL.md registers the hook in its `hooks:` frontmatter (PreToolUse, matcher for the edit tools, command path into the skill)

## Stage 1 check: `scripts/verify_stage1 [skill-dir]`

Runs the skill's test suite and reads the final reviewer verdict of every step (`evidence/reviews/step-NN-round-M.md`, highest M per step, last line `VERDICT: ...`). Prints each step's final verdict, then `STAGE1: PASS` (exit 0) only if the suite passes and every step 01-03 ends in `VERDICT: PASS`; otherwise `STAGE1: FAIL` (exit 1) with the reason.

- [x] all steps passed and the suite passes -> `STAGE1: PASS`, exit 0, one verdict line per step
- [x] a step whose latest round failed -> `STAGE1: FAIL`
- [x] a missing step review -> `STAGE1: FAIL` naming the step
- [x] a failing test suite -> `STAGE1: FAIL`
- [x] two reviews with the same round number (`round-2`, `round-02`) -> `STAGE1: FAIL`
- [x] a suite that did not really pass (exit 0 after a failure via `os._exit`, every test skipped, a failing test skipped or expected to fail) -> `STAGE1: FAIL`
- [x] a review the suite writes while it runs does not count
- [x] pins: a directory or broken symlink as review, a suite without output -> `STAGE1: FAIL`
- [x] an empty or non-UTF-8 review -> `STAGE1: FAIL`, no traceback
- [x] pins: round 10 after round 9, `.bak` and `-response.md` files ignored, `PASS (with caveats)` is no pass

# Stage 2

## Step 1: SKILL.md (< 400 lines, most important rules at the top, details in references/)

Checked by `scripts/tests/test_skill_md.py` against the real SKILL.md.

- [x] the hard rules come first, before the workflow: no production code without a failing test; never delete assertions or paste computed values into expected values; never mix refactoring with green; no tests on private methods
- [x] the workflow sections appear in order: detect context, Design It Twice, behaviour test list, Red/Green/Refactor via tdd-step (one test at a time), depth check in every refactor, design note at the end
- [x] Design It Twice names the one hidden decision, two interface designs compared by depth, one chosen with a one-sentence reason
- [x] the depth check names: interface much simpler than implementation, no classitis, no pass-through wrappers, complexity pulled downward, no splitting by size alone, cumbersome tests signal a wrong interface
- [x] fewer than 400 lines; every `references/...` link points to an existing file

## Step 2: `scripts/depth_report <file>...`

Design it twice. Hidden decision: how a TypeScript/JavaScript module's interface and implementation are measured from its source text (which exports count, how parameters, pass-throughs, unused code and tests are found).
- A: one call `depth.measure(root, path) -> Depth` that returns every metric and the findings; the CLI only formats.
- B: one function per metric (`surface`, `size`, `pass_throughs`, ...) that the CLI calls and combines into findings.
- Chosen: A, because the CLI then knows one name and the rules that turn metrics into findings stay inside the module that computes them.

Per module, one line: `<path>: surface S, size N, ratio R, classitis yes|no, pass-through P, tests T, unused U, duplicate D -> deep | <findings>`. Surface = exported names + parameters of exported functions + public methods of exported classes and their parameters. Size = code lines (no blanks, no comments). Ratio = size / surface. Exit 0 when no module has a finding, 1 when one has, 2 for usage errors. Fixtures: `scripts/tests/depth_fixtures/{deep,shallow,bloated}.ts`.

- [x] a deep module (one export, a large body) -> surface, size and ratio reported, verdict `deep`, exit 0
- [x] a shallow module (many one-line exports) -> verdict names the low ratio, exit 1
- [x] pass-through wrappers (a body that only returns another call with the same arguments) are counted and named a finding
- [x] classitis: two or more classes with at most two methods each is a finding
- [x] test boundary: the number of test files that import the module; none is a finding
- [x] bloat: unused private functions and duplicated lines are counted; any unused function or three duplicated lines is a finding
- [x] export forms: `export { a, b as c }`, `export default function`, `export const` arrow functions and values, `export type`/`interface`, class methods without `private`/`#`, constructor parameters
- [x] usage errors (no file, a missing file, a file that is not .ts/.js, outside git) -> exit 2 with a message
- [x] block comments are not code: neither size nor duplicates count them
- [x] found by a run on Dwello's own modules: a dotted module name (`apartment.service`) is matched whole; a SvelteKit `$lib/...` import counts as a test import
- [x] round 1 review: wrapped and generic signatures count; nothing in comments counts; arrow and awaiting forwards are pass-throughs; object-literal members are not duplicates; classes without methods are not classitis; `require()` counts; unused function expressions are bloat; a directory is "not a file"; pins for enum, declare, abstract class, `export *`, let/var, generators, async arrows, getters, non-UTF-8 input, dynamic imports and untracked test files
- [x] round 2 review: only an arrow whose whole body is the call is a pass-through (no chained, operated or ternary bodies, no name taken from an earlier line); a call that changes an argument is not a pass-through; parameters are counted by their brackets and each declarator counts; block-bodied, typed, async and generic arrow forwards are pass-throughs; repeated array openers are not duplicates
- [x] round 3 review: a call in an `if`/`while` condition is not a function header; a comparison in a default value does not merge parameters; pins for where signatures and bodies end (comma, line break, closing bracket, statement before the brace, no parameters, arrow return type, generic function, arrow types in type parameters and type arguments, a statement across lines)

## Step 3: `scripts/skill_lint [skill-dir]`

Design it twice. Hidden decision: what a valid `tdd-deep-modules` skill must contain (frontmatter rules, the required sections and phrases, their order, the line limit, the reference files).
- A: `lint.problems(skill_dir) -> [str]`, one message per problem, each naming what is missing; the CLI prints them.
- B: a `Skill` object with `frontmatter()`, `sections()`, `references()` that the CLI checks against rules it holds.
- Chosen: A, because the rules then live in one place behind one call, and the CLI and `verify_all` only need "which problems, if any".

Prints `skill_lint: OK` and exits 0, or one `skill_lint: <problem>` line per problem and exits 1; exit 2 when the directory has no SKILL.md. Frontmatter is read with PyYAML.

- [x] the real skill passes
- [x] frontmatter: none, unreadable YAML, missing or non-kebab `name`, `name` other than the directory, missing description, description over 1024 characters or with angle brackets, an unknown key -> each named
- [x] the hook: a PreToolUse entry whose matcher covers Write and Edit and whose command runs the skill's `scripts/tdd-guard`, and the script exists and is executable
- [x] every required section and phrase present; a missing one is named with its section
- [x] order: hard rules first, the six workflow sections in order, design note last
- [x] SKILL.md has fewer than 400 lines
- [x] every `references/...` link resolves
- [x] no SKILL.md -> exit 2
- [x] trigger tests with skill-creator's `run_eval.py` (evidence, not part of the suite: they call the model)
- [x] a broken hook matcher regex is no match, not a crash
- [x] the statements hardened by the SKILL.md reviews are required too (one-sentence reason, one test per cycle, no second test before the first is green, never what it expects, the stash, changed production .ts/.js files, not assertion strength)
- [x] a relative skill path (`skill_lint .`) is judged by the real directory name; a SKILL.md that is not UTF-8 is named
- [x] trigger tests: `evals/trigger-eval.json` (5 should, 7 near misses), result 12/12 with 3 runs each in `evals/trigger-result.json`
- [x] round 1 review: inverted elements named; the three reference files must be linked; hook matcher rules (`*`, empty, absent), only `command` hooks, the program is the guard; `name`/`description` must be text; a byte order mark is named; headings in code fences are no sections; duplicate keys are named
- [x] round 2 review: a negation in front of a bold list item is named (`ITEMS`); the framing sentences "break none of these" and "in every refactor phase" are required; the hook command must run exactly this skill's guard (directly or through sh/bash), malformed hook values give no traceback; `~~~` fences and HTML comments hold no sections

## Step 4: `scripts/verify_all [skill-dir]` and `verifiers.lock`

Design it twice. Hidden decision: what "stage 2 passes" means (which checks, which review steps, which files the lock covers and how the lock is tied to a review).
- A: `gate.stage2(skill) -> (passed, lines)`; `verify_all` prints the lines and exits 0 or 1, nothing else.
- B: `verify_all` calls `selfcheck`, `lint`, `verdicts` and a lock checker itself and combines them.
- Chosen: A, because the entry point must hold no logic, and B would put the pass rule into it.

Review steps: 01-03 stage 1 tools, 04 `verify_stage1`, 05 SKILL.md, 06 `depth_report`, 07 `skill_lint`, 08 `verify_all`. `verifiers.lock`: a `reviewed: evidence/reviews/step-08-round-N.md` line, then one `<sha256>  <path>` line per file under `scripts/` except the tests (see DESIGN.md).

- [x] everything passes -> `tests: OK`, `skill_lint: OK`, one verdict line per step 01-08, `verifiers.lock: OK`, `STAGE2: PASS`, exit 0
- [x] a step whose latest review failed, or that has none -> `STAGE2: FAIL`
- [x] a skill_lint problem is printed and fails the stage
- [x] a failing own suite fails the stage
- [x] `verifiers.lock` missing, a verifier changed after the lock, or a lock that names a review that is not step 08's latest passing one -> `STAGE2: FAIL` naming the cause
- [x] `verify_all` holds no logic: no branches or loops, only a call to `gate.stage2`, printing and the exit
- [x] round 1 review: the lock covers every file under `scripts/` but the tests (`tddcore/__init__.py` included; an added file is "not locked"); exactly one well-formed line per file (duplicates and junk named); a lock that is not UTF-8 is named; the lock names the real file of step 08's latest review and that review must pass; a copy of the real verifiers run without arguments checks its own skill
- [x] round 2 review: run without arguments (as "Done when" does), a module added to `scripts/` cannot shadow an import; a symbolic link under `scripts/` is named; crafted bytecode next to a verifier or a test is never loaded; only the top-level `scripts/tests/` is left out of the lock
- [x] round 3 review: the lock, the reviews and the lint read their input before the suite runs (a test that repairs SKILL.md cannot help); a `unittest` package in the working directory cannot replace the test runner; bytecode caches left by normal runs are not locked
- [x] round 4 review: pins that a test writing a passing review or a fresh lock during the suite cannot change the gate's result; DESIGN.md names the self-check limit and gives an independent `sha256sum --check` command; Python 3.11+ documented

# Stage 2b

The tool commits of this stage are made by hand in the repository's commit style (`chore(tests): red ...`, `feat(build): green ...`, `chore(build): refactor ...`): `tdd-step` runs only vitest and bun suites, and this skill's own suite is Python (`DESIGN.md`, Scope). Each red is run and seen failing on an assertion before its commit.

## Step 09: two-tier suite (`tdd-step --suite`, `tdd_replay`)

Design it twice. Hidden decision: which command a package runs for each tier and which phases need which tier.
- A: `suite.run(root, tier)` reads the tier's command from each package.json (`scripts["test:fast"]` for fast, falling back to `scripts.test`; `scripts.test` for full); the tier rules live in `protocol.violations(..., suite=, previous_suite=)`, shared by `tdd-step` and `tdd_replay`.
- B: a separate `tiers` module that returns command lists, with `tdd-step` and `tdd_replay` each checking the tier rules themselves.
- Chosen: A, because the tier's command is one more detail of "how a package runs its tests" (already hidden in `suite`) and the rules stay in the one place both tools share.

Fast tier = `scripts["test:fast"]` of each package.json (its `bun test` segment), or `scripts.test` where a package declares no fast suite; vitest packages run vitest in both tiers. Full tier = `scripts.test`. Trailer `TDD-Suite: fast|full`.

- [x] red without `--suite` runs the fast suite and records `TDD-Suite: fast`
- [x] `red --suite full` runs the full suite and records `TDD-Suite: full` (a test that lives only in the full tier)
- [x] green without `--suite` runs the fast suite; `green --suite full` runs the full suite
- [x] green after a red on the full suite must run the full suite
- [x] refactor runs the full suite by default, and refuses `--suite fast`
- [x] an unknown or missing `--suite` value exits 2 with usage
- [x] replay: each commit is run with the tier of its `TDD-Suite` trailer (exit-code trailer checked against that run); a missing trailer is rejected
- [x] replay: a refactor verified only against the fast suite is rejected
- [x] replay: a final commit verified only against the fast suite is rejected
- [x] replay: a red claimed on the fast suite for a test that exists only in the full tier is rejected
- [x] replay: a green that does not run red's test (skips it, or runs a tier without it) is rejected
- [x] the existing sabotage cases still pass

## Step 10: doubles rule and depth rule in SKILL.md (checked by `test_skill_md.py` and `skill_lint`)

- [x] the hard rules (top section) hold the doubles rule, short: no mocks or spies of your own logic; real objects by default; doubles only at system boundaries (mail, login, network, framework modules, external backends); every fake of a boundary has a contract test suite run against both the fake and the real implementation; framework modules (`$app/*`) are wrapped in a small project-owned adapter and the adapter is faked, not the framework; many mocks in a test signal a wrongly cut interface
- [x] the hard rules name the test boundary: the public interface of the deep module or service; pure helpers inside it are implementation details, with no tests and no public exports of their own
- [x] the depth check names the swarm of exported helpers: a functional core is fine as internal structure, but many small exported pure functions with one caller are classitis
- [x] `skill_lint` names a SKILL.md without the doubles rule (its phrases and its bold item)
- [x] `skill_lint` names a SKILL.md without the test boundary or the swarm item

### Step 09, review round 1 (fixes)

- [x] every task (not only the range) ends on the full suite: a green or refactor before a `test:` commit is a task end
- [x] a commit whose fast run loses a test that ran in the previous fast run is rejected (both tiers run for every commit)
- [x] `tdd-step`: `--suite` anywhere but right after the phase, `--suite=x` and other `--` words exit 2 with usage
- [x] refactor: `TIERS` and `default_tier(phase)` live in `protocol`; `Verdict.suite` has no default
- note: red a81080a changed the old usage assertion together with the new test, so it failed two tests; the old assertion had to follow the new usage text and could not stay green in that red. Accepted as an exception, recorded here.

## Step 11: `depth_report` names a swarm of exported helpers as classitis

A swarm member is an exported function (`export function f` or `export const f = (...) =>`) whose body has at most 10 code lines (20 since review round 1) and whose name the module uses exactly once besides its declaration (one caller, inside the module: exported only to be tested) and, since review round 1, no other production file names. Three or more members are classitis (`classitis yes`, finding `classitis: exported helpers with one caller: a, b, c`). Fixtures: `swarm.ts.txt` (known bad: the deep amount parser with its helpers exported and tested one by one) and `deep.ts.txt` (known good: the same functional core kept private).

- [x] the known-bad swarm is flagged as classitis, naming the helpers
- [x] the known-good functional core (private helpers, one exported entry point) stays deep
- [x] only small, one-caller exports count: an export with two callers, with no caller in the module, or with a body over 10 lines is no member; two members are no swarm

## Step 12: `verify_all` checks stage 2b

Stage 2b replaces stage 2's pass line: the reviews of steps 01-12 (09 two-tier suite, 10 SKILL.md rules, 11 helper swarm, 12 `verify_all`), the lock tied to step 12's latest passing review, the last line `STAGE2B: PASS` or `STAGE2B: FAIL`. The existing `test_verify_all.py` expectations change with it in one red (its helpers and expected lines all name the steps, the lock step and the pass line).

- [x] everything passing -> one verdict line per step 01-12, `verifiers.lock: OK`, `STAGE2B: PASS`; every failure case ends in `STAGE2B: FAIL`; the lock must name step 12's latest passing review

### Step 09, review round 2 (fixes)

- [x] `test:` commits after a task's last green or refactor (the design note) are no task end
- [x] `tdd-step test` (and the replay) refuse a test list right after a green on the fast suite
- [x] fixture repos turn commit signing off

### Step 10, review round 1 (fixes)

- [x] `skill_lint` requires the doubles and depth rules as whole statements: "every fake of a boundary has a contract test suite", "in a small project-owned adapter", "pure helper functions inside it are implementation details", and in the depth check "with one caller each are classitis" (the reviewer's attacks are the red's cases)
- note: the conflict with Dwello's `vi.mock` for `$app/*` is recorded in DESIGN.md (Known limits) as the user's decision

### Step 10, review round 2 (fixes)

- [x] `skill_lint` names a doubles, boundary or swarm statement that is inverted or qualified inside its own sentence, or moved off its bold item's line (`lint.STATEMENTS`); the red's cases are the ten round-2 attacks that linted OK (not every fake, when convenient, never wrap, helpers tested, mock freely, double anything, not many mocks, outdated boundary, swarm in theory, optional tips). Of the round-1 attacks, three were covered by round 1's red; the rest are these.

### Step 11, review round 1 (fixes)

- [x] a helper another production file names is no member (public functions such as `qr-bill.service.ts`'s are no longer flagged)
- [x] recursive calls inside a helper's own body are no callers
- [x] overload signatures are neither callers nor extra helpers; each name is listed once
- [x] helpers up to 20 code lines count as small (the older ">10 lines" test now uses a 21-line body; its expectation is unchanged)
- [x] refactor: `Depth.has_classitis` holds the verdict, the CLI only prints it

### Step 11, review round 2 (fixes)

- [x] an object return type (`): { v: number } {`, `Promise<{ ... }>`) is skipped before the body is measured: long object-returning helpers are not small, recursive object-returning helpers are not one-caller helpers
- [x] other production files are read without comments: a name in a comment there is no use
- [x] pin: the twenty-line test uses a 20-line body (cap 19 fails it)
- no-caller exports, unrelated same-name functions and bracketed `const` expressions: Known limits
