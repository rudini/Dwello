---
name: tdd
description: Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests.
---

# Test-Driven Development

Tests verify behavior through public interfaces, not implementation details: a test that breaks on a refactoring that kept the behavior was testing the implementation. Layers, runners and test doubles in Dwello: `docs/test-pyramid.md` (no mocked database, no mocks of Dwello's own modules; outside systems only at the boundary).

## One test at a time

Do not write all tests first and then all implementation ("horizontal slicing"): tests written in bulk test imagined behavior and the shape of things, and they pass when behavior breaks. Write one test, make it pass, then the next; each test answers what the last cycle taught.

```
WRONG (horizontal):
  RED:   test1, test2, test3
  GREEN: impl1, impl2, impl3

RIGHT (vertical):
  RED→GREEN: test1→impl1
  RED→GREEN: test2→impl2
  RED→GREEN: test3→impl3
```

## Workflow

1. **Plan:** read `UBIQUITOUS_LANGUAGE.md`, so test names and interfaces use the domain's words. Decide the interface changes and the behaviors to test (the ones the scenario and the task or issue name, critical paths, complex logic), and list the behaviors in the checklist of `implementation_plan.md`. Look for deep modules (small interface, deep implementation, `tools/deepcheck/README.md`); the commit hook checks them. Do not wait for approval: the scenario and the task already say what to build (`CLAUDE.md`, "When to ask").
2. **Tracer bullet:** one test for the first behavior, red, then the least code that turns it green. It proves the path end to end.
3. **Loop:** for each further behavior, one test, red, then only enough code to pass it; nothing for tests not yet written.
4. **Refactor:** once all tests pass, remove duplication, deepen shallow modules and fix what the new code reveals about existing code, running the tests after each step. Refactor only while green: with a red test, a failure no longer tells whether the refactoring or the missing code caused it.
