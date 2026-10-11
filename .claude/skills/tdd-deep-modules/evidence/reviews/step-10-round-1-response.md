# Response to step 10 (doubles and depth rules in SKILL.md), round 1

- [major] lint fragments: red/green "whole rule statements" (11f6986 and its green). `lint.REQUIRED` now holds "every fake of a boundary has a contract test suite", "in a small project-owned adapter" and "pure helper functions inside it are implementation details"; the red's cases are the reviewer's attacks (contract made optional, adapter replaced by `vi.mock`, helpers deserve tests).
- [major] swarm verdict not required: the same red/green requires "with one caller each are classitis" in section 5 (case "swarm is fine").
- [minor] TESTLIST tick: the round-1 fixes are listed under "Step 10, review round 1"; the original line is now true.
- [minor] conflict with Dwello's `vi.mock` for `$app/*`: recorded in DESIGN.md Known limits as open and the user's decision; Dwello's docs are not changed by the skill.
- [minor] references/depth.md: has a "No swarm of exported helpers" section since step 11 (753e6f1).
- [minor] "untested" finding vs hard rule 4: DESIGN.md Known limits says a single-owner helper module is merged into its owner, not given tests.
- [nit] "framework modules" in the boundary list: left as is; the next sentence of the same rule says to fake the adapter, not the framework, and lint requires it.
- [nit] fragment limit in DESIGN.md: moot after the lint fix; the known limit about contradicted sentences stays.
