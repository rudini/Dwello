# Step 01, round 1: response to findings

| Finding | Severity | Fix (red -> green commits) |
|---|---|---|
| Subdirectory bypass | major | df53306 -> e3d530a (run from `git rev-parse --show-toplevel`); 64a9e62 changed files via `git status --porcelain -z` (root-relative); 9071632 -> 5c4d7b1 renames |
| Detection: pytest, unsupported setups | major | e5d7db0 -> 1e84ab8 pytest markers; 1e67859 -> 1c8cfa0 pytest classification via JUnit; c159dd9 -> 0228b21 AssertionError under pytest; 914eaa1 -> 7ce64a2 pytest fixture errors; 8c91f00 -> 4999603 unsupported `scripts.test` exits 2; ab2c246 -> ca02bd0 malformed package.json / uninstalled vitest exit 2. Unittest `tests/` without `__init__.py` still reports NO TESTS RAN (an honest refusal; documented). |
| Untested classification clauses | major | d438b87 pins, each mutation-checked: evidence/mutations/step-01-round-1-pins.txt (6/6 killed) |
| Output after unittest summary | minor | 1fd0c72 -> 3faa364 |
| Tracebacks | minor | 406593c -> 21455d3 empty phase; b0b8eed -> 64a9e62 no commits yet; fc2f0e2 -> 5275461 rejected commit restores index, exit 2; 22f6a5d -> 4766060 outside git |
| Forged trailer via message | minor | 5aa1a93 -> 871ae41 message collapsed to one line |
| Phase read from subject | minor | kept: the spec asks for the phase prefix; documented in DESIGN.md, replay re-verifies |
| Green weakens tests / several failing tests in red | minor | 1ccb48d -> 3837354 green may not change tests; 07df552 -> 3f9b334 red needs exactly one failing test (unittest, pytest, vitest) |
| Refactor 6b479b3 changed behaviour | minor | acknowledged; history not rewritten. The changes are now covered by tests (multi-word messages, all violations listed, no-output fallback). |
| Leaks | minor | 3344ab9 `PHASES` replaces CLI access to the table; constants private. `is_production` stays public for the PreToolUse hook (step 3). Uninstalled vitest is now `NoFramework`. |
| Weak trailer assertions | nit | df53306 exact trailer values |
| Snapshot / expect.assertions refused | minor | deliberate strictness, documented in DESIGN.md |
