# Step 03, round 1: response to findings

| Finding | Severity | Fix |
|---|---|---|
| `..` bypasses the guard | major | dc95333 -> 9318870: the target path is resolved before classification |
| symlinked / case-different paths fail open | major | same pair (symlinked-checkout subtest); the repository root is resolved too |
| other odd input crashes with a traceback | minor | ba886a7 -> 351adc0: clean non-blocking error (exit 1) for odd shapes |
| only Write/Edit/MultiEdit guarded | minor | documented (DESIGN.md Known limits) |
| hook path assumes the project-level skill location | minor | documented |
| case-sensitive suffix check | minor | 4443e81 -> 56dda50 |
| generous test-name heuristics | minor | documented |
| green 4378202 broader than minimal | nit | acknowledged |
| reds failing on crashes | nit | acknowledged (assertions target the intended behaviour) |
| allowed phases hard-coded in the CLI | assessment | d60f538: `protocol.production_may_follow` derives them from the phase table |
