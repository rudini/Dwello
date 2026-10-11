# Step 02, round 1: response to findings

| Finding | Severity | Fix |
|---|---|---|
| 1 red's failing test may be an old test | major | c259a15 -> 7172c90 (bun), 87ba793 -> 95c2501 (vitest): `Run.failing` ids; red's failing tests must be exactly its new test |
| 2 red may remove tests | major | d141a5c -> 9e2d7cb: no phase may remove tests |
| 3 test phase drops tests via package.json | major | same commit pair (second subtest) |
| 4 same-named tests collapse | major | 1264c39 -> 1343805: repeated ids in a file get `#n` (bun and vitest) |
| 5 bun `*_test.ts` / `*_spec.ts` are production | minor | 1703af7 -> 2f95b89 |
| 6 SIGTERM leaves a worktree | minor | a12ffce -> 1745f9a (handler); b5164dd fix for TERM during `git worktree add` (5/12 failing runs before, 0/12 after: evidence/mutations/step-02-sigterm-race.txt) |
| 7 crash exits 1 | minor | 4d1a5e2 -> 482da59: unexpected errors exit 2 with a message |
| 8 merges always rejected, doc says otherwise | minor | DESIGN.md corrected: merges are rejected; replay linear histories |
| 9 renaming/moving tests in refactor rejected | minor | documented in DESIGN.md |
| 10 first red failed because the script did not exist | minor | acknowledged (history) |
| 11 green 729e954 large | minor | acknowledged; its behaviours were pinned with mutation evidence |
| 12 skill's own history not replayable | nit | acknowledged: built before the tool existed, with the repository's commit convention |
| 13 contradicting TDD-Phase trailer ignored | nit | acknowledged: the subject prefix is the phase (spec) |
| 14 vitest cache via borrowed node_modules | nit | documented |
| deep-module weak spots | assessment | b7eebd9: verdicts immutable (tuple + replace) |
