

## Session: #922 P2 fitness function, queries per route

- [x] Product owner decision recorded in #922 (changes #781: a CI gate on query counts, timing stays manual)
- [x] `queryFindings`, `tightenQueries` and the `routeQueries` rule of `loosened` in `tools/fitness/fitness.ts` (`fitness.test.ts`)
- [x] `p2-benchmark.ts --queries [--update]`: small fixed dataset, counts every SQL query of one call per route after a warm-up
- [x] CI step «Queries per route» next to the upgrade check; red run with the N+1 of #919 put back («needs 256 queries (ratchet 28)»); counts stable over runs, `outdated` grows only per building and period
- [x] Docs (`fitness-functions.md`, `utility-tree.md` P2)
- [x] Slice review round 1 (closing): `docs/reviews/i922-review-1.md`; C-1 (Minor: a change only to `tools/fitness` did not run the step) fixed in the `changes` filter of `ci.yml`; the dashboard's growth per building and contract (68 → 82 queries) needs no issue at 214 ms, the ratchet now stops it growing
- [x] No scenario: CI tooling only
- [x] PR `Fixes #922`: pushed after this archive
