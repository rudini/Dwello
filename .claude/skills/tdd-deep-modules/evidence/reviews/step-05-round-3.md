# Review: Stage 2 step 1, SKILL.md, round 3 (commit 81d6be3)

Reviewer report (content as returned, condensed formatting).

## Summary
Passing round 3 with no blocker or major findings. All seven round-2 findings are fixed, each checked by running it. The round-2 major (the false claim that `tdd_replay` rejects a changed test) is gone; SKILL.md now states what the replay does not catch (a weakened assertion) and limits "Proof" to phase order, test counts and exit codes. Both reds fail on an assertion for the right reason, both greens pass, all three pins are killed, full suite passes at 81d6be3 (150 tests). SKILL.md is 94 lines, hard rules first, required elements in the required order.

## Commands run (git archive export of each commit, deleted afterwards)
- d9510b6 red: FAIL `'Never change a test after its green' unexpectedly found`; 1773215 green OK; 0e47c1d pin OK; f70aa36 red: FAIL `'depth_report <changed production .ts/.js files>' not found`; 00b7d70 green OK; 1897585 OK. Reds change only the test; greens only SKILL.md and references/.
- Mutations of nine hardened phrases at HEAD: each makes `test_skill_md` fail.
- Full suite at 81d6be3 with node_modules symlinked: 150 tests OK.
- Stash-based way back in a throwaway vitest repo: wrong red, green refused, stash, reset, corrected red, pop, green, `tdd_replay` ACCEPT.
- Nested `package.json` with `"test": "eslint ."`: `tdd-step` exits 2 with a clear message.
- `skill_lint .` from inside the skill directory exits 1 (empty directory name).

## Status of round-2 findings
- [major] false `tdd_replay` claim: fixed and pinned; matches `replay._judge` and `protocol.violations`.
- [minor] stash missing: fixed, verified end to end.
- [minor] droppable elements: fixed, pins killed.
- [minor] `depth_report <changed files>`: fixed.
- [nit] tooling.md refusal list: fixed. [nit] test wrong after its green: answered. [nit] untested text: answered for SKILL.md.

## Tool claims checked against the code
tdd-step refusals and exit codes, tdd-guard, tdd_replay rejection list, depth_report fields, test configuration in green: all match. No remaining overclaims beyond the minors below.

## New findings
- [nit] text added outside red/green (SKILL.md:64 last sentence, two tooling.md additions) is unpinned.
- [minor] one unsupported nested test script makes every tool exit 2; say so in section 1.
- [minor] "a question for the user" leaves no named options.
- [minor] no clean-tree check before the first cycle (`tdd-step` commits everything).
- [nit] `depth_report` with no production files: say to skip it.
- [nit] `skill_lint .` fails from inside the skill directory (step 07).

VERDICT: PASS
