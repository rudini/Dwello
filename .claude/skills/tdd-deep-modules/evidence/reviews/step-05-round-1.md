# Review: Stage 2 step 1, SKILL.md (round 1; commits 7a8bc20..21da7a9)

Reviewer report (content as returned, condensed formatting).

## Summary
SKILL.md (88 lines) has every required element in the required order; hard rules first; references/ links resolve. The "first red for a new module" pattern works with vitest and bun. Every red failed on an assertion for the right reason, every green passed. Failed on three majors: a hard rule the tools reject, an undocumented dead end in green when a dependency is needed, and tests that do not check the content of three workflow sections.

## Commands run
- `wc -l SKILL.md` → 88; section order verified.
- Replayed 14 commits with `git archive`: reds fail with matching AssertionErrors, greens and 97bce31, 21da7a9 OK; reds change only `test_skill_md.py`, greens only SKILL.md or references/.
- Full suite: 123 tests, OK.
- First-red pattern, vitest and bun: `tdd-step red` exit 0, `tdd-guard` allows the production file afterwards (exit 2 before), `tdd-step green` exit 0, `tdd_replay` ACCEPT.
- Fixing a wrong test in its own red: `tdd-step red` exit 0, `tdd_replay` REJECT ("red must add exactly one new test, but adds 0").
- Green touching package.json: refused ("green may only change production code, not tests: package.json").
- Mutant: sections 1, 3, 4 emptied → `test_skill_md` still OK.

## Findings
- **[major] SKILL.md:21** hard rule 2 ("a test that is wrong gets fixed in its own red") produces a history `tdd_replay` rejects. Fix: say what to actually do.
- **[major] SKILL.md:59, references/tooling.md:12** dead end when green needs `package.json` or `vite.config.*`: after red only green is allowed, green refuses test configuration. Fix: document that these changes go into the red and how to recover.
- **[major] scripts/tests/test_skill_md.py** sections 1, 3, 4 checked only as headings; green b4a0bc5 added 39 untested lines. Fix: a red per section asserting key content.
- [minor] references/tooling.md:14: "test run changed the working tree" is exit 1, not 2.
- [minor] DESIGN.md:81 still says a stub must exist before the first red; contradicts tooling.md.
- [minor] SKILL.md:70-75: merging modules or changing interfaces invites moving/renaming tests, which the replay rejects as removed tests. Add a warning.
- [minor] SKILL.md:30: no escape when the skill does not apply; description overlaps a generic tdd skill.
- [minor] SKILL.md:31: "run every suite the way tdd-step will" names no command.
- [minor, pending] `scripts/depth_report` did not exist yet (step 2).
- [nit] tooling.md tdd_replay list incomplete (non-phase commits, only red adds tests).
- [nit] SKILL.md:44: record the sketches in the test list file so they survive.
- [nit] tooling.md example: in TypeScript the dynamic import is typed `{}`; mention a cast or converting to a static import later.

VERDICT: FAIL
