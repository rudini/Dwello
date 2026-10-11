# Review: Stage 2b step 10 (doubles and depth rules in SKILL.md), round 2 (commit e6c23d2)

Reviewer report (content as returned, condensed formatting).

## Summary
Whole suite 223 OK; `skill_lint` OK; SKILL.md 98 lines with every element of requirements (2) and (3) (hard rule 6 doubles, hard rule 4 test boundary and helpers, section 5 swarm); nothing in references/ or DESIGN.md contradicts them; the recorded Dwello conflict is accurate. Red 11f6986 fails only the new test (4 subtests, `0 != 1 : skill_lint: OK`); green 78baa52 touches only lint.py, whole suite passes.

FAIL: every removal of a required element is now caught, but inverting an element inside its own sentence is not. A one-word prefix still lints OK ("Not every fake of a boundary has a contract test suite...", "Never wrap a framework module ... in a small project-owned adapter; mock `$app/*` with vi.mock"). `lint.ITEMS` blocks exactly this for the labels of hard rules 1-5, and the documented known limit covers only contradictions "in another sentence". Five of the nine round-1 attacks still pass, although the response says the red's cases are the reviewer's attacks.

## Commands
- Clone at HEAD: 223 OK; `skill_lint` OK. 11f6986 changes only test_skill_lint.py (+27); 78baa52 only lint.py (+5/-2); e6c23d2 only DESIGN.md, TESTLIST.md, the response.
- Red replay at 11f6986: 4 failures (contract optional, adapter dropped, helpers are details, swarm is fine), each `0 != 1 : skill_lint: OK`. Green replay at 78baa52: 223 OK.
- 14 lint mutations: caught: dropping the contract sentence, "an adapter", dropping "A functional core is fine...". Pass with OK: "Not every fake ...", "When convenient, every fake ...; usually skip it", "Never wrap ... adapter; mock `$app/*` with vi.mock ...", helpers "... is a mistake, so export and test each one", "Mock freely; it is a myth that you need no mocks or spies of your own logic; avoid real objects by default", "never use real objects by default", "Double anything, not only mail, login, ...", "Not many mocks in a test signal a wrongly cut interface", "It is outdated that the test boundary is the public interface ...", "... are classitis too, in theory only; export and test them freely", rule 6 body moved under "Optional tips".
- `docs/test-pyramid.md:33` says `vi.mock` for `$app/*`; 27 files, as DESIGN.md:138 states.

## Round-1 findings
- [major] lint fragments: fixed for removal; inversion inside the same sentence open.
- [major] swarm verdict: fixed for removal; a trailing qualifier still passes.
- [minor] TESTLIST tick: fixed. [minor] `vi.mock` conflict: fixed (DESIGN.md:138). [minor] references/depth.md: answered. [minor] "untested" vs hard rule 4: fixed (DESIGN.md:139).
- [nit] "framework modules": answered. [nit] fragment limit "moot": not accurate (inversion inside a sentence passes, DESIGN.md:140 documents only another sentence).

## New findings
- **[major]** lint.py:19-29, 40-49 — new rule statements matched as substrings anywhere in the section; a one-word prefix or a clause flips a required element and lints OK. Fix: require each statement as a whole sentence anchored at a sentence start and running to its terminator, or make each element its own bold item in `ITEMS`; a red subtest per attack.
- **[minor]** step-10-round-1-response.md:3, TESTLIST.md:292 — "the reviewer's attacks are the red's cases" covers only 3 of 9; state which, guard or document the rest.
- **[nit]** DESIGN.md:140 — known limit does not mention inversion or qualification inside the same sentence.

VERDICT: FAIL
