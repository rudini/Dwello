# Review: Stage 2 step 3, `skill_lint`, round 2 (commit ce5403b)

Reviewer report (content as returned, condensed formatting).

## Summary
FAIL, one major open. Holds: real skill lints clean; 18 tests pass; replay of all 21 commits in f98a428..ce5403b clean (reds fail on an assertion for the right reason, greens pass, reds touch only the test, greens only lint.py); lint.py deep (one call), CLI 22 lines; trigger result consistent with the eval set and the description. Fails: the round-1 major is fixed only for the five named wordings; a one- or two-word negation in front of a required element ("Do not …", "Never …") still lints OK, because a phrase only has to be a substring of its section. DESIGN.md's known-limits line wrongly says these elements are covered.

## Commands
- `scripts/skill_lint` → OK; `tests.test_skill_lint` → 18 OK.
- Replay: b54a1a4/986ab2b, 89bd842/de3b6a2, 82f9afb/6511ba7, d05ae44/b263f3a, f299d1e/f5eb43c, ae6dfc0/2d79c21, 99547d4/d4362e1 all as expected; docs/eval commits OK.
- Code mutants killed: star/default matcher, `type == command`, `_program`, duplicate threshold, fence stripping, type checks, references rule, new phrases. Survived: `.endswith` → `.find >= 0`, `except ValueError` → other, fence regex variant (equivalent), `isinstance(entry, dict)` → True, `sorted` → `list`.
- SKILL.md mutants caught: deleted rule/step/item lines, the five named inversions, "Write tests on private methods", "Mix refactoring with green", "Delete assertions freely", "Interface about as big as", "Sketch one interface design", "Record the chosen design", "Many lines per behaviour", "Design note (optional)", indented heading. Passing: "Do not/Never/Don't pull complexity downward", "Do not compare them by depth", "Do not name the one hidden decision", "Never sketch two interface designs", "Do not record the chosen design with a one-sentence reason", "More than one test per cycle is fine", "Break any of these when it would be faster", "In some refactor phases", "Red. Write all tests", "skip the short design note", "Batch freely … is a myth", HTML comments, `~~~` fences.
- Hook probes: accepted `… tdd-guard || true` and another skill's guard; rejected `bash …/tdd-guard` (false positive), `; exit 0`, unbalanced quotes.
- Evals: result consistent with eval set (12 queries, 12/12, runs 3); model not re-run.

## Status of round-1 findings
- [major] keyword pinning: partly fixed (N1).
- [minor] references: fixed. [minor] hook check: fixed for the named cases; `|| true` accepted (N4). [minor] types: fixed. [minor, TDD] `re.error`: answered; repeats with `except ValueError` (N3). [minor] eval set: fixed; README command inconsistent (N5). [nit] CRLF, BOM, fences, duplicate keys: fixed; unreadable file documented.

## New findings
- **N1 [major] lint.py:18-40, :96; DESIGN.md:116** a negation in front of a required element passes. Fix: anchor each element to its bolded list-item label; red with "Do not"/"Never" in front of each; correct DESIGN.md.
- N2 [minor] other process statements can be inverted (covered by N1's fix for bolded ones).
- N3 [minor, TDD] `except ValueError` in `_program` untested.
- N4 [minor] hook command with `|| true` or another skill's guard accepted; `bash …/tdd-guard` rejected; `endswith` and `isinstance(entry, dict)` unpinned.
- N5 [minor] evals/README.md command uses 1 run; TESTLIST says 10/10.
- N6 [minor] TESTLIST step 3 lacks the round-1 behaviours.
- N7 [nit] `~~~` fences and HTML comments; integer `PreToolUse` / `hooks` values give a traceback; `sorted` mutant.

VERDICT: FAIL
