# testcheck

Finds unit tests that can pass without checking what they claim, and test titles that do not say what their test checks, in TypeScript Vitest (and Jest-style) test files (internal tool, never published). It reads the syntax tree only (TypeScript compiler API): it never runs a test. How accurate it is, measured on Dwello and 15 open-source repositories: `testcheck-validation.md`.

A finding says "this test can pass although the code is wrong" or "this title does not describe its test". It is not a verdict on test quality: a test without findings can still check the wrong thing.

## Rules

Gate rules fail `check`; each was right in at least 90 % of its findings on every corpus it was measured on (`testcheck-validation.md`).

| Rule | Finds | Fix |
|---|---|---|
| `empty-test` | a test that neither runs code nor asserts (an empty body, only declarations) | write the test or delete it |
| `dangling-expect` | `expect(x)` without a called matcher, also `expect(x).toBeNull` without `()` (Chai's `expect(x).to.be.true` is fine) | call the matcher |
| `unawaited-assertion` | `expect(p).resolves/rejects…` or `expect.poll(…)` neither awaited nor returned: it settles after the test passed | `await` it |
| `tautology` | an assertion that holds whatever the code does: a built-in matcher on literals that is always true (`expect(true).toBe(true)`), a variable compared with itself (`expect(x).toEqual(x)`; two calls compared with each other check determinism and pass), `not.toThrow` on an async function | assert on the result of the code under test |
| `catch-only-assertion` | every assertion sits in a `catch`: when the code stops throwing, the test passes | `expect(() => …).toThrow(…)`, `await expect(…).rejects…`, or `expect.assertions(n)` |
| `swallowed-assertion` | an assertion in a `try` with an empty `catch`, so a failing assertion is caught and dropped (a `catch` with statements counts as handling the error) | rethrow, or remove the `try` |
| `callback-only-assertion` | every assertion sits in a callback the test does not wait for (`then`, `setTimeout`, `on`, `subscribe`, …) | await the promise or event; a callback in a `new Promise` or `Promise.all` the test awaits or returns counts as waited for (tests with a `done` parameter are left out) |
| `duplicate-title` | two tests of the same block with the same title | name what each one checks |
| `duplicate-body` | two tests of the same block with the same code (comments and layout aside) under different titles: one title claims something its test does not check, or one test is a copy | make the body check what the title says, or delete the copy |

Hint rule, shown but never failing: `loop-only-assertion`, every assertion sits in a loop (`for…of`, `forEach`, `map`, `every`, …) over data that may be empty, so an empty result passes. Loops over data the test fixes itself are left out: literals, module constants, imports, `each` rows, `split` results, literal ranges, functions declared in the test file. Assert the length first.

What counts as an assertion: calls named `expect`, `assert`, `should`, `verify` or `check`, alone or starting a camelCase name (`checkTotals`, not `checkout`; methods: `expect`, `assert`, `should`), `fail`, a `throw`, a function of the same file that asserts (also through another one), Testing Library `getBy*`/`findBy*` queries (they throw when nothing matches), and type assertions tsc checks (`expectTypeOf`, `assertType`, `Expect<Equal<…>>`, `@ts-expect-error`, a typed declaration or `satisfies` in a test that asserts nothing else).

Skipped and todo tests (`it.skip`, `describe.skip`, `it.todo`) are left out. `it.each`/`test.for` tests are checked, but not by the title rules (their title is a template). Tests declared in a loop are not compared by the title rules either; tests in different functions (`describe` blocks, helpers like `describeMatrix`) never are.

## Usage

Requires Node >= 22.18 (runs the TypeScript sources directly through Node's type stripping).

```bash
bun run testcheck:scan src backend/src tools   # every finding in these paths (never fails)
bun run testcheck:audit                        # changed test files vs HEAD (working tree, staged, untracked), agent mode
bun run testcheck:ci -- origin/main            # changed since the merge-base with the PR base, GitHub annotations
bun run testcheck:baseline                     # (re)write .testcheck-baseline.json from the current state
```

Exit codes: 0 ok, 1 a gate rule fails, 2 tool error.

## Gate on changed test files

`check` analyses the test files (`*.test.*`, `*.spec.*`) changed since the base: HEAD by default (working tree, staged and untracked files), the merge-base with `--changed-since <ref>`. A finding of a gate rule fails it unless:

- it is in `.testcheck-baseline.json` **as committed at the base** (`git show <base>:.testcheck-baseline.json`), so a change cannot baseline its own findings; the baseline holds `<file>#<full test title>#<rule>` per finding and is empty today;
- a comment on the line above the test or above the finding suppresses it: `// testcheck-ignore <rule> -- <why the test is right>`. A suppression without a known rule or without a reason is a finding of its own (`invalid-suppression`).

Formats: human (default; failures, then `hint:` lines), `--format github` (`::error` for gate rules, `::warning` for hints), `--agent` (nothing when the gate passes, else `testcheck: <n> finding(s) fail the test gate` and the first five failures with the fix).

## Wiring

| Where | What | Blocks? |
|---|---|---|
| Claude Code hook `.claude/hooks/testcheck-gate.sh`, `PreToolUse` on Bash (`.claude/settings.json`, timeout 60 s) | before every `git commit` / `git push` (same matching and fail-open policy as `deepcheck-gate.sh`): `check --agent`, on push with `--changed-since` the upstream (else `origin/HEAD`, else `origin/main`); exit 2 with the findings on stderr when the gate fails | yes, the Bash call |
| `CLAUDE.md` | the commit hook gates every commit; agents run `bun run testcheck:audit` to see findings before committing | — |
| CI job "Test checks" (`.github/workflows/ci.yml`, pull requests) | `bun run testcheck:ci -- "origin/<base>"`: annotations | yes |

Only a gate verdict blocks the hook; a crash, a tool error, or missing `jq` or `node` fail open with a single notice.

## Measuring

```bash
bun run testcheck:measure -- <cache dir>                       # precision per rule from eval/labels.json
bun run testcheck:measure -- <cache dir> --unlabelled out.jsonl # also write the findings without a label
bun run testcheck:seed -- src backend/src <cache dir>/*        # recall on planted defects
```

`measure` clones the repositories of `eval/corpus.json` (pinned commits) into the cache dir on first use. A change to a rule that adds findings leaves them unlabelled: label them (`tp`/`fp` with a reason in `eval/labels.json`) before reporting a precision.

## Known limits

- No data flow and no types: a helper imported from another file is not followed (`expectSomething()` counts by its name, `runTestWith(tester)` does not), and a name resolves to its first declaration in the file.
- The title rules compare tests with each other; they cannot tell whether a single title fits its body. A free comparison of title words with body words was measured and dropped (`testcheck-validation.md`).
- Rules measured and dropped for low precision: `no-assertion` (a test that runs code but asserts nothing; most were deliberate "does not throw" or type-only tests) and `conditional-assertion` (every assertion under an `if`).
