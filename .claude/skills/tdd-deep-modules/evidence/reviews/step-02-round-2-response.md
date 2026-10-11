# Step 02, round 2: response to findings

| Finding | Severity | Fix |
|---|---|---|
| N1 skipped/filtered tests count as present | major | cd7821b -> 84c9bc3: `Run.skipped` (bun JUnit `<skipped>`, vitest skipped/pending/todo); a test that ran before and no longer runs counts as removed in every phase. All four attacks (bun skip, bun `-t` in a test phase, vitest skip, vitest `testNamePattern`) are subtests; evidence/mutations/step-02-round-3-pins.txt (3/3 killed) |
| N2 green 482da59 with a flaky failing suite | minor | acknowledged; fixed by b5164dd with before/after evidence |
| N3 red can weaken an old test | minor | documented (DESIGN.md Known limits) |
| N4 global `git worktree prune` | minor | 95e049b -> fbd9d3d: prune removed; `remove --force --force` alone keeps the SIGTERM test at 0/12 failures (evidence/mutations/step-02-sigterm-race.txt) |
| N5 non-code test data | minor | documented |
| N6 root ranges and the stub limit | minor | documented |
| N7 same-named test inserted before the old one | nit | documented |
| N8 docs commit re-wrapped a line | nit | acknowledged |
| N9 one test method with several subtests | nit | each such test covers one rule with several attack shapes; acknowledged |
