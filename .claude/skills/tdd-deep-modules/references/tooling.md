# Tooling: details

All scripts live in `scripts/` of this skill and run from anywhere inside the repository.

## tdd-step

`scripts/tdd-step <test|red|green|refactor> [--suite fast|full] "<message>"` runs every supported suite (vitest and `bun test`, one run per `package.json`) in the chosen tier, checks the phase rules and commits all changes as `<phase>: <message>` with the trailers `TDD-Phase`, `TDD-Exit-Code` and `TDD-Suite`.

Two tiers, both read from each `package.json`: the **fast** suite (no database, no external network) is `scripts["test:fast"]`, or `scripts.test` where the package declares none; the **full** suite (adds database tests such as `*.pg.test.ts` and contract tests) is `scripts.test`. Vitest packages run vitest in both tiers. Test, red and green run the fast suite unless `--suite full` is given; use it for a test that lives only in the full tier (SQL behaviour). Refactor always runs the full suite. The last commit of every task must run the full suite all green: a refactor, or `green --suite full` when there is nothing to refactor.

It refuses (exit 1, nothing committed) when:

- nothing changed, or the phase may not follow the last one (red after red, green without red, refactor after red, after a `test:` commit or after a commit that is not a phase);
- **test:** code changed;
- **red:** the suite passes, the failure is not an assertion (import, syntax, setup or unhandled errors), more than one test fails, or production code changed;
- **green / refactor:** any test fails or errors; green may not change tests or test configuration (`package.json`, `vitest.config.*`, `vite.config.*`);
- **green** after a red on the full suite without `--suite full`; **refactor** with `--suite fast`; **test** right after a green on the fast suite (a new task needs the last one ended on the full suite); **test** after a green or refactor when the suite fails;
- any phase: the test run changed the working tree.

Exit 2 means it could not judge: not a git repository, no supported runner, a runner not installed, or an unknown `--suite`.

## The first red for a new module

A test that imports a file that does not exist fails with an import error, which is never a valid red, and the hook blocks a production stub until a red exists. So the first test of a new module imports it dynamically and turns the missing module into an assertion failure:

```js
test("total sums the prices", async () => {
  const price = await import("./price.js").catch(() => ({}));
  expect(price.total?.([1, 2])).toBe(3);
});
```

Green then creates the module. In TypeScript the caught import is typed `{}`; cast it (`as Partial<typeof import("./price")>`) or switch to a static import in the next refactor. Later tests import it normally.

## tdd-guard (the hook)

The skill registers a PreToolUse hook on Write, Edit and MultiEdit. It blocks edits to production code while the last commit is a `test:` phase or not a TDD phase at all. After red, green and refactor, production edits are allowed; `tdd-step` then judges the commit.

## tdd_replay

`scripts/tdd_replay <base>..<head>` checks out every commit of the range in a temporary worktree, runs both suites (fast and full) of each commit, judges the commit on the tier of its `TDD-Suite` trailer, and rejects: a commit that is not a phase commit (ordinary and merge commits included), a missing or unknown `TDD-Suite` trailer, a trailer exit code that does not match the real run of that tier, a refactor, or the last green or refactor of a task (before the next task's `test:` commit, and the last one of the range), not run on the full suite or failing it, a red on the fast suite whose new test exists only in the full tier, a green on the fast suite after a red on the full suite, a green that skips red's test, a test that stops running in the fast suite (for example through a changed `test:fast`), production code before red, a red that fails by error, a red that adds other than exactly one test, a red whose failing test is not its new test, a test added outside red, a refactor or green on a red suite, removed or skipped tests, a range whose last commit leaves the full suite failing, and a history that ends in red. Exit 0 ACCEPT, 1 REJECT, 2 cannot judge.

## depth_report

`scripts/depth_report <path>...` prints for every module its interface surface, implementation size, depth ratio, classitis indicator, pass-through count, test boundary and a bloat check. Read it during refactor.
