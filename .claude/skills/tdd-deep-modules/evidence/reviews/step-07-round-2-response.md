# Response to step 07 (skill_lint), round 2

- N1 [major] negation in front of an element: red "negated items" puts "Do not" in front of every bold list item of the hard rules, Design It Twice, the cycle (Red/Green/Refactor), the depth check and the design note (24 subtests); green adds `lint.ITEMS`: each item must open a list line exactly (`- **Label**` or `1. **Label**`), else "'<section>' has no item **<label>**". DESIGN.md's known-limits line now says what is and is not covered.
- N2 [minor] framing sentences: red/green "framing sentences": "break none of these" (hard rules) and "in every refactor phase" (depth check) are required. Bold items cover "Red."/"Green."/"Refactor."; the plain sentence "One behaviour from the list per cycle" was already required.
- N3 [minor, TDD] `except ValueError` untested: the "unbalanced quote" case in red "exact guard command" pins it (it must be rejected without a traceback).
- N4 [minor] hook command: red/green "exact guard command": the command must run exactly `.claude/skills/<this skill>/scripts/tdd-guard`, directly or through `sh`/`bash`; `… || true` and another skill's guard are rejected, `bash …/tdd-guard` accepted; an entry that is not a mapping, a numeric `PreToolUse` and a numeric `hooks` are rejected without a traceback (pins `isinstance`).
- N5 [minor] README command now uses `--runs-per-query 3`; TESTLIST says 12/12 with 3 runs.
- N6 [minor] TESTLIST step 3 lists the round-1 and round-2 behaviours.
- N7 [nit] `~~~` fences and HTML comments: red/green. Numeric hook values: covered by N4. `sorted` → `list` mutant on duplicate keys: left (only affects the order of messages when two keys are duplicated).
