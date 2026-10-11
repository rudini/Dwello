# Response to step 04, round 2

- [major] skipped / expected-failure tests count as passing: red cf2af74 (two subtests fail with `OK (skipped=1)` and `OK (expected failures=1)`), green 5de67bf (summary must be exactly `OK`), refactor f9afc48 (skip counting dropped; a bare `OK` implies none).
- [minor] a test can write a review: red "suite cannot write a review", green 85c53cb (reviews are read before the suite runs).
- [minor, TDD] untested branches: pinned (directory and broken-symlink reviews, a suite without output); mutation log `evidence/mutations/step-04-round-2-pins.txt`, 4/4 KILLED.
- [minor] untracked review files count, last-stderr-line scraping: documented as known limits in DESIGN.md; a review that never went through the gate is a process violation outside the tool's reach, and the faking routes are deliberate.
- [nit] refactor a8772a1 output change: accepted as is; the message is informational.
- [nit] `\d` matching Unicode digits: harmless (duplicates collide by value), left as is.
