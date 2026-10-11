# Step 01, round 3: response to findings

| Finding | Severity | Fix |
|---|---|---|
| Crashed pytest dropped in mixed repos | major | d019aef -> 5f74290: `Run.empty` (collected no tests) replaces `ran` as the drop criterion; a run without a report is an error and is kept. Mutation (drop by `ran`) killed: evidence/mutations/step-01-round-3-pins.txt |
| Green excludes failing test via config | minor | 71bedfc -> 91c04fe: `pytest.ini`, `pyproject.toml`, `setup.cfg`, `tox.ini`, `vite.config.*` are test configuration |
| Unhandled-error substring false positive | minor | e4e8fd0 -> 0dc2138: match vitest's `Vitest caught N unhandled error(s) during the test run` line |
| Non-UTF-8 package.json crash | minor | cdbccac -> b54449f |
| Unreachable unittest tests silently ignored in mixed repos | minor | documented in DESIGN.md Known limits |
| Unpinned clauses | minor | 01a7ce8 pins (config sections, max exit code), 6/6 killed; d0afa65 removed the unpinned `async` alternative; vitest no-report `ran` now 0 with `empty=False`; `+ load_errors` removed (empty covers it) |
| DESIGN.md mentions tdd_replay | minor | marked as step 2 |
| snapshot misses tracked-but-ignored files | nit | documented |
| core.quotepath hides non-ASCII names | nit | 163ad56 -> 8ecfcdf `git ls-files -z` |
| `Failed: Timeout` accepted | nit | documented |
| TESTLIST after the cycles | nit | acknowledged; step 2 starts with a test-list commit |

Also: evidence/mutations/mutate.py now reports BASELINE-FAILS instead of KILLED when the test fails before mutation.
