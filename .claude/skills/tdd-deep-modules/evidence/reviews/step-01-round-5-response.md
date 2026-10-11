# Step 01, round 5: response to findings

| Finding | Severity | Fix |
|---|---|---|
| bun load errors hidden next to an assertion | major | f6554c2 -> 269edbf: bun's own `N error(s)` summary makes the run an error |
| red 11f62f6 wrong reason, green 4bb221b edited the test | major (TDD) | 4436307 reverted both; 6b1cce5 redid the red (each subtest fails because green is accepted); dfbc5c1 green |
| refactor 8f3b197 changed behavior | major (TDD) | 0ab277e -> 0a9dd47: regression test (interrupted pytest next to an assertion failure is not red), guard restored |
| refactor deleting all vitest tests, trailer 0 | minor | b04e6ae + b47a943 -> 2f28119: trailer = highest exit code of every command run (the earlier expectation for a left-out unittest run changed in a red commit, not in green). Replay (step 2) will reject refactors that remove tests. |
| bun missing -> traceback | minor | 3288ff5 -> 5ce13a2 exit 2 |
| unpinned guards | minor | 023a7d6 pins + 6f7594d; evidence/mutations/step-01-round-5-pins.txt (7/7 killed) |
| bun script shapes / npm placeholder | minor | a0ac4a5 -> 2f6b7f4 (split on `&&`/`||`/`;`, run via `sh -c`); bd6e67b -> ec78bda placeholder |
| Error thrown inside a `.resolves` matcher | minor | 023a7d6 -> 727814a: only chai-worded messages count inside the assertion chain |
| green 1dff965 nested vitest unforced; pin in red 5466d6f | nit | acknowledged; pins are now committed separately or declared in the red commit message |
| DESIGN.md red also refused without DB | nit | fixed |
