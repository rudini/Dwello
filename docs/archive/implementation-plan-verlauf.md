

## Session: #782 upgrade check (U1), part 1

- [x] Ä1 cycles end after #912 (P90 6 ≤ 8); the contract dates are props and parameters, not copied shapes (named in the pull request)
- [x] A failing migration leaves its data unchanged, is not recorded and names file and cause (`migrations.pg.test.ts`, pins kept behaviour)
- [x] The upgrade check compares the amount sums of the statement tables before and after (red shown with a probe migration on `balance`)
- [x] What the container does on a failed migration, recorded in #782 and `fitness-functions.md` §4: exit 1, cause in the first log line, restart loop, not «unhealthy» (decision of the product owner)
- [x] Slice review round 1 (closing): `docs/reviews/i782-review-1.md`; C-1 and C-2 (Minor, docs) fixed; question to the product owner posted in #782
- [x] No scenario: tooling and a pinning test, no app behaviour
- [x] PR `Refs #782` (the empty demo tables and the «unhealthy» decision stay open): pushed after this archive
