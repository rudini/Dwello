# Review of step 3: `tdd-guard` (round 2)

Verdict FAIL. Reviewer report (content as returned, condensed formatting).

## Summary
`..` bypass fixed; symlink fail-open fixed; case-insensitive suffix works; odd input shapes give a clean non-blocking error; round-2 TDD history (`dc95333..d60f538`) clean; refactor d60f538 keeps behaviour. Incomplete: whenever `target.relative_to(root)` raises, the hook exits 1 (non-blocking) and the edit goes through; `Path.resolve()` does not canonicalise case on macOS, so a path whose repo prefix differs in case from git's toplevel still fails open. The response claimed this fixed; no test covers case.

## Commands run (key output)
- Full suite at HEAD (step-3 files identical to 8ce9feb): `Ran 104 tests in 153.470s OK`.
- Per commit: reds dc95333, 4443e81, ba886a7 fail only their new test; greens 9318870, 56dda50, 351adc0 and refactor d60f538 OK; reds touch only tests.
- Probes: all `..` variants blocked [2]; symlinked checkout, symlinked dir/file inside tests, outside file linking in, dangling link blocked [2]; link pointing out of the repo [0] (correct); relative paths [2]; `calc.TS`, `Calc.Tsx` [2]; new deep dirs, trailing slash, `//` [2]; Windows-style paths [2]; symlink loop [2]; legit edits (tests/helpers.ts, README.md, package.json, .git/hooks/x.py, empty path) [0]; `tool_input: null` clean [1]; NUL byte traceback [1]; case-different root via fake git -> ValueError [1] (edit allowed); hardlink tests/hl.ts -> src/calc.ts [0]; dubious ownership [0].
- Mutations: remove target `.resolve()` caught; remove `.lower()` caught; drop AttributeError caught; widen `production_may_follow` caught; remove root `.resolve()` SURVIVES.

## Status of round-1 findings
`..` fixed. Symlink fixed; case-different NOT fixed (N1). Odd input fixed (post-parse errors still traceback, acceptable). Write/Edit/MultiEdit-only documented. Skill location documented. Suffix case fixed. Generous names documented. Phases from protocol fixed.

## New findings
- N1 [major] `tdd-guard:30`: any path/root mismatch fails open (macOS case). Fix: derive the relative path from git (`git rev-parse --show-prefix` in the existing ancestor + remaining components), or catch ValueError and block.
- N2 [minor] `tdd-guard:28-29`: any git failure counts as outside git and is allowed silently (e.g. dubious ownership).
- N3 [minor] hardlinks are invisible to the hook (setup needs Bash); worth a Known-limits line.
- N4 [nit] root `.resolve()` untested.
- N5 [nit] 56dda50 changes `protocol._is_code` without a `violations()`-level test.
- N6 [nit] reds with 2-3 subtests of one test method (acceptable).
- N7 [nit] phase read from the subject only (hand-made `red:` commit via Bash unlocks the guard; replay judges it later).

## Deep-module assessment
Thin adapter; phase policy in protocol. Weak: path-to-repo mapping (N1) — let git compute the prefix; `production_may_follow` hard-codes ("green", "refactor") while `violations` encodes the same knowledge. No gaming.

VERDICT: FAIL
