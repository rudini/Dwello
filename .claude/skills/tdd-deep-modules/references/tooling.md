# Tooling: details

All scripts live in `scripts/` of this skill and run from anywhere inside the repository.

## tdd-step

`scripts/tdd-step <test|red|green|refactor> "<message>"` runs every supported suite (vitest and `bun test`, one run per `package.json`), checks the phase rules and commits all changes as `<phase>: <message>` with the trailers `TDD-Phase` and `TDD-Exit-Code`. It refuses (exit 1, nothing committed) when:

- nothing changed, or the phase may not follow the last one (red after red, green without red, refactor after red);
- **test:** code changed;
- **red:** the suite passes, the failure is not an assertion (import, syntax, setup or unhandled errors), more than one test fails, or production code changed;
- **green / refactor:** any test fails or errors; green may not change tests or test configuration.

Exit 2 means it could not judge: not a git repository, no supported runner, a runner not installed, or the test run changed the working tree.

## A new module needs a stub first

A test that imports a function that does not exist fails with an import error, which is never a valid red. Create the smallest stub (the exported name, returning nothing useful) in the previous green or refactor commit, then write the red against it.

## tdd-guard (the hook)

The skill registers a PreToolUse hook on Write, Edit and MultiEdit. It blocks edits to production code while the last commit is a `test:` phase or not a TDD phase at all. After red, green and refactor, production edits are allowed; `tdd-step` then judges the commit.

## tdd_replay

`scripts/tdd_replay <base>..<head>` checks out every commit of the range in a temporary worktree, re-runs the suite and rejects: a trailer that does not match the real exit code, production code before red, a red that fails by error, a red that adds more than one test, a refactor or green on a red suite, removed or skipped tests, and a history that ends in red. Exit 0 ACCEPT, 1 REJECT, 2 cannot judge.

## depth_report

`scripts/depth_report <path>...` prints for every module its interface surface, implementation size, depth ratio, classitis indicator, pass-through count, test boundary and a bloat check. Read it during refactor.
