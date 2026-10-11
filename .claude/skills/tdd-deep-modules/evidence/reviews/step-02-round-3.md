# Step 2 review, round 3: `tdd_replay` (HEAD b2a6404)

Verdict PASS. Reviewer report (content as returned, condensed formatting).

## Summary
Round-2 major N1 fixed: the four original attacks plus 14 new skip/filter variants on real bun and vitest histories are all rejected with "removes tests". N4 fixed: the caller's prunable, locked and normal worktrees, dirty/staged/untracked files, HEAD and branches unchanged. The five spec sabotages still rejected. Round-3 commits test-first (each red fails only its new test; each green passes the whole suite, 88 tests). Mutation kills and the 0/12 SIGTERM claim reproduce. Remaining minors: two weakening cheats in the documented class, a mutation gap in skip statuses, a conservative false reject when a `test.todo` becomes a real test, orphaned vitest processes after SIGTERM.

## Commands run (key output)
- Full suite at HEAD: `Ran 88 tests in 135.9s OK`.
- Red cd7821b: 4 subtest failures (each `REPLAY: ACCEPT` where reject expected); green 84c9bc3 87 OK; red 95e049b 1 failure (pruned prunable worktree); green fbd9d3d 88 OK.
- Mutations: bun `skipped = frozenset()` killed; vitest skip statuses `if False` killed; `removed = known.tests - run.tests` killed; `status in ("skipped",)` SURVIVED.
- SIGTERM test 12 runs: 0 failed. Signals on a slow vitest red: SIGTERM rc 143, SIGINT rc 130 (traceback); worktree, status, HEAD restored; vitest children kept running from the deleted tree (~8 s).
- bun JUnit: `test.skip`, `test.todo`, `describe.skip`, `-t` -> `<skipped/>`; `--bail` omits later tests. vitest JSON: `test.todo` status `todo`.

## Status of round-2 findings
N1 fixed (bun: test.skip, test.todo, test.skipIf, describe.skip, test.only, -t, --bail, bunfig root; vitest: test.skip, test.todo, test.only, test.skipIf, testNamePattern, exclude, bail; test-phase -t). N2 acknowledged. N3 documented (variant M1). N4 fixed. N5-N7 documented. N8, N9 acknowledged.

## Own attacks
Good bun and vitest histories ACCEPT; production before red, import errors (bun missing export, vitest missing export, vitest missing module), two tests in one red, `test.each` with 2 rows, refactor on red, claimed red: all REJECT.

## New findings
- M1 [minor] neutralising an old test without touching its assertion (bun `mock.module` in a preload added in red; vitest `setupFiles` + `vi.mock`; `test.failing` in refactor) is accepted; widen the documented weakening limit.
- M2 [minor] `suite.py:149`: vitest `todo`/`pending` statuses unpinned (mutation survives); add a vitest `test.todo` subtest.
- M3 [minor] `replay.py:87`: a skipped/todo placeholder turned into a real failing test counts as 0 new tests (legitimate red rejected); undocumented.
- M4 [minor] SIGTERM/SIGINT to the replay PID leaves vitest children running briefly from the deleted tree; SIGINT prints a traceback.
- M5 [nit] projects using `--bail`/`bail` get legitimate reds/greens rejected as "removes tests"; undocumented.
- M6 [nit] green fbd9d3d also commits an evidence file.

## Deep-module assessment
`replay(repo, rev_range) -> [Verdict]` + `ReplayError` narrow and deep; N1 fix small; `suite.Run` has 8 fields (getting wide); `_judge` six arguments (carry-over). Safety holds except orphan processes.

## Verifier gaming
None found.

VERDICT: PASS
