# Review: Stage 2 step 3, `skill_lint` (round 1; commit f98a428)

Reviewer report (content as returned, condensed formatting).

## Summary
The real skill lints clean; 12 tests pass; every red/green in the replay fails or passes for the right reason; the step-07 pin reproduces as KILLED; the trigger evals reproduce. One call, rules in one table, a 22-line CLI. FAIL because the depth-check and Design It Twice elements are pinned by keywords only, so a one-word edit that inverts an element ("Prefer classitis") still lints OK.

## Commands
- `scripts/skill_lint` → OK; `tests.test_skill_lint` → 12 OK.
- Replay of 26 commits: reds fail on the right assertion, greens/refactors OK; reds touch only the test, greens only lint.py / skill_lint.
- Pin: `except re.error` → `except ZeroDivisionError` KILLED.
- Mutants passing lint: "Prefer classitis", "Add pass-through wrappers freely", "Split by size alone", "Cumbersome tests are fine", "Compare them by line count", all references links and the directory removed, `description: [list]` / `42`, duplicate `name:`, `command: 'echo scripts/tdd-guard'`, `type: prompt`, hard rules inside a code fence, CRLF (correct, but contradicts DESIGN.md).
- Mutants caught: heading level/case, `name: 123`, unknown key via anchor, empty file, BOM (as "no frontmatter"), malformed hook shapes, missing/dangling/directory guard, SKILL.md as a directory.
- False positives: `matcher: "*"` and an absent matcher (match-all in Claude Code) reported as unregistered.
- Trigger evals: one should-trigger and one harder near miss (pytest TDD) re-run, both pass; README's parallel-run explanation plausible (`run_eval.py` counts only its own uuid name).

## Findings
- **[major] lint.py:21-22, 30-33** depth-check and Design It Twice elements pinned by keywords, not by the element. Fix: element phrases ("no classitis", "no pass-through wrappers", "do not split by size alone", "cumbersome tests signal a wrong interface", "compare them by depth") and a red that inverts each.
- [minor] "details in references/" only checks that existing links resolve; none at all passes.
- [minor] hook check too strict (`*`, empty or absent matcher) and too loose (`type: prompt`, substring command).
- [minor] non-string `description` / `name` pass through `str()`.
- [minor, TDD] refactor a01913c added the `re.error` handling (pinned later).
- [minor] eval set lacks TDD-on-the-wrong-stack near misses; 1 run per query.
- [nit] DESIGN.md CRLF claim wrong; BOM reported as "no frontmatter"; headings inside code fences counted; duplicate keys last-wins; unreadable SKILL.md gives a traceback.

VERDICT: FAIL
