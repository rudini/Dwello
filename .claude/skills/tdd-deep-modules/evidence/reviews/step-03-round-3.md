# Review of step 3: `tdd-guard` (round 3)

Verdict PASS. Reviewer report (content as returned, condensed formatting).

## Summary
No production edit got past the guard when it should block; legitimate test, docs and config edits went through. Round-2 N1 fixed: the hook asks git for the directory's place in the repository (`git rev-parse --show-prefix` in the nearest existing directory) plus the rest of the resolved path, so the raising `relative_to(root)` is gone. N2 fixed. Round-3 red/green pairs clean; full suite 107 OK. Weak spot: the two path-mapping lines are unpinned (removing the git prefix or the target `.resolve()` passes the suite; without `.resolve()` the round-1 symlink fail-open returns). Three small issues: leading-whitespace top-level dir fails open (contrived); edits under `.git/` now blocked (fails closed); a source subdirectory on another mount is silently unguarded.

## Commands run (key output)
- Full suite: `Ran 107 tests in 156.523s OK`; registration OK; repo clean afterwards.
- Per commit (`-p test_tdd_guard.py`): acd2dfc 11 OK; red 69f563d fails only its new test (assertion); green 6f9ee74 12 OK; red e4340e5 fails only its new test; green af2d20b 13 OK; 207c808 13 OK.
- Pin 207c808: mutant `suffix.lower()` -> `suffix` killed.
- Probes (HEAD `test: list`): blocked [2]: `src/calc.ts`, `src/../tests/../src/calc.ts`, `src/new/deep/x.ts`, `tëst/x.ts`, `tests/link.ts -> ../src/calc.ts` (reported `src/calc.ts`), `GIT_DIR` set (`tests/x.ts` fails closed). Allowed [0]: `tests/helpers.ts`, `README.md`, repo dir, `src` dir.
- Fake git: upper-cased prefix -> blocked (TESTS fails closed); toplevel upper-cased -> blocked; dubious ownership -> exit 1 with message; filesystem-boundary "not a git repository" -> exit 0 silent; no git -> traceback exit 1; component > 255 chars -> OSError exit 1.
- Mutations (`test_tdd_guard.py`): drop prefix SURVIVES; drop target `.resolve()` SURVIVES; silent git failures killed; git failure -> 0 killed; `strip()` -> `rstrip("\n")` survives (expected).

## Status of round-2 findings
N1 FIXED (macOS behaviour argued, not tested on a real case-insensitive disk). N2 FIXED. N3, N7 documented. N4 gone (target resolve untested instead, F1). N5 pinned. N6 acknowledged.

## New findings
- F1 [minor] `tdd-guard:24`, `:35` (core of the N1 fix) not pinned: add an edit in an existing `tests/` directory and a symlinked file inside `tests/` pointing to production code; the toplevel-case test is now stale.
- F2 [minor] `tdd-guard:35` `.strip()` lets a top-level directory named with leading whitespace (`" tests"`) pass as tests; use `.rstrip("\n")`.
- F3 [minor] `tdd-guard:30` a source subdirectory on another mount is silently unguarded (git's boundary message contains "not a git repository").
- F4 [minor/nit] files under `.git/` are judged as repo-root files and blocked (fails closed).
- F5 [nit] git missing -> traceback.
- TDD: clean; the green 6f9ee74 added the prefix path without a test demanding it (F1).

## Deep-module assessment
Thin adapter (~30 lines); policy in `protocol`; git-computed prefix simplifies the mapping. No gaming; one overstatement in DESIGN.md ("resolved" untested since round 3).

VERDICT: PASS
