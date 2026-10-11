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

Commit every phase with `scripts/tdd-step <test|red|green|refactor> "<message>"`; it runs the tests itself and refuses a phase the tests do not support. Verify a history with `scripts/tdd_replay <base>..HEAD`. While this skill is active, a hook blocks edits to production files unless the last phase allows production code (red, green, refactor).
