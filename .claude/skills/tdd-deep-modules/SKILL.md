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
2. **Never delete assertions, and never paste computed values into expected values.** An expected value comes from the requirement, worked out by hand, never copied from what the code returned. A test that is wrong gets fixed in its own red, never weakened to make code pass.
3. **Never mix refactoring with green.** Green is the smallest change that makes the new test pass. Clean-up waits for the refactor step, which starts and ends with every test passing.
4. **No tests on private methods.** Test behaviour through the module's public interface. If you want to test something private, the interface is wrong or a deeper module is missing.
5. **One test per cycle.** Red adds exactly one new test and sees it fail for the right reason: an assertion, never an import, syntax or setup error.
