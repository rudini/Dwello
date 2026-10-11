# Review: Stage 2 step 1, SKILL.md, round 2 (fix commits 44bbdd6..95b186b)

Reviewer report (content as returned, condensed formatting).

## Summary
All 13 round-1 findings are fixed or reasonably answered, verified by running them: the way back from a wrong red (`git reset --soft HEAD~1`, corrected red, green) gives `tdd_replay` ACCEPT; `tdd-step red` accepts `package.json`; each new red fails on its own assertion; each green passes; full suite at 5f26287: 133 tests OK.

One new major: SKILL.md:64 says "Never change a test after its green: `tdd_replay` rejects that." That is false (the replay accepted a refactor that rewrote an older test's input and expectation, and a red that replaced an assertion with `expect(true).toBe(true)`), and it contradicts section 5's "change the interface in a refactor" / "update the calls inside the tests".

## Commands run
- Replay of 21da7a9, 44bbdd6, b9ad728, 4132a3d, 19bce39, 5f31876, c243e46, 48726ac, e0821af, 95b186b, 5f26287: reds fail on exactly their new element; greens OK; reds change only the test, greens only SKILL.md.
- Throwaway vitest repo: wrong red, reset, corrected red, green → ACCEPT; green changing package.json refused; reset with production code in the tree → red refused twice until the production file is stashed; refactor rewriting an old test and a red weakening an assertion → ACCEPT.
- `depth_report dbl.js add.test.js package.json` → exit 2 (package.json not TS/JS).
- Mutant without hard rule 5, without the "Never batch" paragraph and without "one-sentence reason" → `test_skill_md` still OK.

## Status of round-1 findings
All fixed (rule 2, dependency dead end, weak tests, exit code, DESIGN.md:81, moving tests, escape, commands, depth_report, sketches, TS typing); tdd_replay list mostly fixed (omits "red's failing test must be its new test").

## New findings
- **[major] SKILL.md:64** false statement about `tdd_replay`, contradicting section 5; lines 68 and 94 overstate what the replay checks; hard rule 2 is not enforced by any tool. Fix: reword (a refactor may change how a test calls the module, never what it expects; the replay does not catch weakened assertions), soften line 68, pin with a red.
- [minor] SKILL.md:64 the way back omits stashing green work already written (`git stash push -u -- <files>`, pop after the new red).
- [minor] test_skill_md: "one-sentence reason" and one-test-per-cycle statements can be dropped unnoticed.
- [minor] SKILL.md:72 `depth_report <changed files>` exits 2 on non-JS/TS files; say "changed production .js/.ts files".
- [nit] tooling.md:9 refactor is also refused after `test` or a non-phase commit.
- [nit] nothing about a test of the current cycle found wrong right after its green.
- [nit] green c243e46 added more text than its test asked for.

VERDICT: FAIL
