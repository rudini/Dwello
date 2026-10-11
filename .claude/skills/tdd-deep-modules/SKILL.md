---
name: tdd-deep-modules
description: Enforced test-driven development with deep modules for vitest and bun projects. Use when building features or fixing bugs test-first, when the user asks for red-green-refactor, strict TDD or deep modules, or wants a TDD history verified.
hooks:
  PreToolUse:
    - matcher: "Write|Edit|MultiEdit"
      hooks:
        - type: command
          command: '"$CLAUDE_PROJECT_DIR"/.claude/skills/tdd-deep-modules/scripts/tdd-guard'
---

# TDD with deep modules

Build behaviour one failing test at a time, and keep every module deep: a small interface hiding a lot of implementation. The tools in `scripts/` enforce the cycle; this file says how to work with them.

## Hard rules

Break none of these, even when it would be faster.

1. **No production code without a failing test.** Production code changes only in green (to pass the one failing test) or in refactor (behaviour unchanged, all tests green). While this skill is active, the `tdd-guard` hook blocks production edits at any other time.
2. **Never delete assertions, and never paste computed values into expected values.** An expected value comes from the requirement, worked out by hand, never copied from what the code returned. A test that is wrong is never weakened to make code pass; section 4 says how to undo a wrong red.
3. **Never mix refactoring with green.** Green is the smallest change that makes the new test pass. Clean-up waits for the refactor step, which starts and ends with every test passing.
4. **No tests on private methods.** The test boundary is the public interface of the deep module or service: test behaviour through it. Pure helper functions inside it are implementation details, with no tests and no public exports of their own. If you want to test something private, the interface is wrong or a deeper module is missing.
5. **One test per cycle.** Red adds exactly one new test and sees it fail for the right reason: an assertion, never an import, syntax or setup error.
6. **Doubles only at system boundaries.** No mocks or spies of your own logic; use real objects by default. Double only what the system does not own: mail, login, network, framework modules, external backends. Every fake of a boundary has a contract test suite that runs against both the fake and the real implementation. Wrap a framework module (such as SvelteKit's `$app/*`) in a small project-owned adapter and fake the adapter, not the framework. Many mocks in a test signal a wrongly cut interface: fix the interface, not the test.

## 1. Detect the context

Before the first test:

- Find the test runners: vitest (a `package.json` with `vitest`) and/or `bun test` (a `scripts.test` with `bun test`), at the root and in nested packages such as `backend/`. This skill is only for vitest and `bun test` projects. Where neither exists, the skill does not apply: stop, tell the user, and do not edit production code in this session, because the `tdd-guard` hook stays active and blocks it.
- Run every suite as `tdd-step` will, each in its package directory: `npx vitest run` for vitest, the `bun test` part of `scripts.test` for bun. All must pass now. If one does not, stop and report; never start a cycle on a red suite.
- Read the last commit: `git log -1 --format=%s`. A `red:` subject means a cycle is open; finish it with green first.
- Find the module that owns the behaviour and its public interface. Note where its tests live.

## 2. Design it twice

Before the first test, because tests freeze the interface:

1. **Name the one hidden decision** the module owns, in one sentence: what callers will never have to know (a file format, a rounding rule, which runner runs). No hidden decision, no module.
2. **Sketch two interface designs** that differ in kind (one general call versus several special calls, value versus result object, function versus stateful object), each with a signature and one call site.
3. **Compare them by depth:** how much must a caller know, does the hidden decision leak into a signature, how much behaviour sits behind the interface, how short is the first test?
4. **Record the chosen design with a one-sentence reason**: "Chosen: <design>, because <reason about depth>."

The decision, both sketches and the sentence go into the design note (section 6). Details and a worked example: [references/design-it-twice.md](references/design-it-twice.md).

## 3. Write the behaviour test list

Write the list into `TESTLIST.md` (or the place the project uses), headed by the hidden decision, both sketches and the chosen design from section 2, so they survive a long session. Commit it with `scripts/tdd-step test "<what>"`; the test phase may not change code. Every task begins with its own test-list commit: `tdd_replay` finds the end of each task by it.

- One line per behaviour, phrased as an observable outcome through the chosen interface ("rejects an empty name", not "calls validate()").
- Order: the simplest behaviour that forces the interface into existence first, then the core cases, then edge cases and errors.
- The list is a plan, not a contract: add lines when a cycle teaches you something, in the next red or refactor commit (a `test:` commit after a green starts a new task); tick lines off as their green commits land.

## 4. Red, green, refactor with tdd-step

One behaviour from the list per cycle:

1. **Red.** Write one test for the behaviour, run it, and see it fail on an assertion for the reason you expect. Commit with `scripts/tdd-step red "<behaviour>"` (add `--suite full` when the test lives only in the full tier, such as a `*.pg.test.ts`). It refuses when the suite passes, when the failure is an import, syntax or setup error, when more than one test fails, and when production code changed.
2. **Green.** Write the least production code that makes this test pass. Commit with `scripts/tdd-step green "<behaviour>"` (`--suite full` after a red on the full suite). It refuses unless every test passes and refuses changes to tests or test configuration.
3. **Refactor.** With everything green, improve the design (section 5), run the tests after each change, and commit with `scripts/tdd-step refactor "<what changed>"`; refactor always runs the full suite. Skip the commit when there is nothing to improve.

**Two tiers.** The fast suite (no database, no external network: `scripts["test:fast"]`, else `scripts.test`) checks red and green; the full suite (`scripts.test`: adds database and contract tests) checks every refactor and the end of every task. The last commit of a task, before the next task's test list, runs the full suite all green: a refactor, or `green --suite full` when there is nothing to refactor.

Test configuration (`package.json`, new dependencies, `vitest.config.*`, `vite.config.*`) counts as a test file: change it in the red or in a refactor before it, never in green.

**The way back from a wrong red.** If the open red's test is wrong, or green turns out to need a test-configuration change, first set aside any production code already written (`git stash push -u -- <files>`), undo the red with `git reset --soft HEAD~1` (it is your own, unpushed commit), fix the test or add the configuration, commit the red again, then `git stash pop`. After its green, a test's expectations are fixed: a refactor may change how a test calls the module, never what it expects. `tdd_replay` does not catch a weakened assertion; that rule is yours to keep. A test found wrong after its green (this cycle or an earlier one) is a question for the user.

For a module that does not exist yet, the first test imports it dynamically so the red is an assertion, not an import error (example in references/tooling.md).

Never batch: no second test before the first is green, no clean-up inside green. `tdd-step` runs the tests itself and records the real exit code in a `TDD-Exit-Code` trailer; do not commit phases by hand. `scripts/tdd_replay <base>..HEAD` re-runs the history and rejects phase-order, test-count and exit-code violations (references/tooling.md lists them). Details: references/tooling.md.

## 5. Depth check in every refactor

In every refactor phase, with all tests green, run `scripts/depth_report <changed production .ts/.js files>` and walk this list. Fix what fails in the same refactor, one change at a time, tests green after each.

- **Interface much simpler than the implementation.** A caller learns few names, parameters and rules; a lot happens behind them. A module about as big as its interface is shallow: merge it into its caller or callee.
- **No classitis.** Many tiny classes or files that each forward to the next spread one decision over many places. Merge them.
- **No swarm of exported helpers.** A functional core is fine as internal structure, but many small exported pure functions with one caller each are classitis too: they turn implementation details into interface. Keep them private behind the module's interface, and test them through it; `depth_report` names the swarm.
- **No pass-through wrappers.** A function that only forwards its arguments with the same shape hides nothing. Call the target directly or give the wrapper a real job.
- **Pull complexity downward.** When the module or every caller could handle a case (defaults, normalisation, retries), handle it inside the module once.
- **Do not split by size alone.** A long function that hides one decision stays whole; split only along separate decisions.
- **Cumbersome tests signal a wrong interface.** Many mocks, long setup or reaching into internals mean the interface is wrong, not the test. Change the interface in a refactor; never test private methods instead.

When merging modules or changing an interface, keep every test's name and file: `tdd_replay` identifies tests by file and name and rejects a refactor that seems to remove one. Update the calls inside the tests instead.

Details: [references/depth.md](references/depth.md).

## 6. Design note

When the test list is done, write a short design note (in the PR description, or `DESIGN.md` next to the module) and commit it as `scripts/tdd-step test "design note"` after the task's last refactor or full green, or with the last refactor:

- **Hidden decision:** the one sentence from section 2.
- **Both designs:** the two sketches, and the chosen one with its one-sentence reason.
- **Interface:** the final public names and what each promises.
- **Depth:** the latest `scripts/depth_report` lines for the module, and what changed during refactors.
- **Open points:** behaviours left out on purpose, and known limits.
- **Proof:** `scripts/tdd_replay <base>..HEAD` printed ACCEPT for the history (it proves phase order, test counts and exit codes, not assertion strength).
