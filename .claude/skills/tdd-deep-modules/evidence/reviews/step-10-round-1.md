# Review: Stage 2b step 10 (doubles and depth rules in SKILL.md), round 1 (commit 7a4445f)

Reviewer report (content as returned, condensed formatting).

## Summary
Whole suite at 7a4445f: 217 OK; `skill_lint` OK; SKILL.md 98 lines with the hard rules at the top. Every element of requirement (2) is in hard rule 6 ("Doubles only at system boundaries", about 90 words); requirement (3) sits in hard rule 4 (test boundary, no tests and no exports for helpers) and section 5 (swarm item). Each of the 5 reds fails only on assertions about the new rule; each of the 5 greens touches only SKILL.md or lint.py and passes the whole suite.

FAIL: `skill_lint` guards the new rules more loosely than `test_skill_md.py` and the earlier hard rules. "contract test suite", "project-owned adapter", "pure helper functions ... are implementation details" and the swarm's "classitis" are not in `lint.REQUIRED`; the contract and helper phrases are fragments without modal or subject, so deleting the contract mandate or the adapter instruction still lints OK. The rule also clashes with Dwello's docs/test-pyramid.md (`vi.mock` for `$app/*`, 27 files) and with `depth_report`'s "untested" finding; neither conflict is noted.

## Commands
- Clone at 7a4445f; whole suite 217 OK; `skill_lint` OK.
- `git show --stat` per step-10 commit: test lists only TESTLIST.md; reds only the test files; c9eed37, dccc291, efe7a5a only SKILL.md; cedc971, fa680af only lint.py.
- Red replays: b112766, b90842b, 5fd51a8 fail on the missing rule text; 39fcda8 (7 subtests) and 9bcafa1 (5 subtests) fail with `0 != 1 : skill_lint: OK`. Green replays all OK (run serially with commit signing off after the signer failed under parallel load).
- Lint attack, 9 mutations all `skill_lint: OK`: contract suite made optional; contract sentence "when convenient"; adapter replaced by "Mock `$app/*` directly with vi.mock; if you ever write an adapter, fake the adapter, not the framework"; helpers given their own tests and exports; own-logic mocks allowed; boundary list negated; swarm "fine: export and test each of them"; rule 6 moved to an "Optional tips" paragraph under a stub item; test boundary inverted.

## Findings
- **[major]** scripts/tddcore/lint.py:22-27 — required doubles/boundary phrases leave out "contract test suite", "project-owned adapter", "pure helper functions inside it are implementation details", and the kept ones are fragments; removing the contract mandate or the adapter instruction lints OK. Fix: require "every fake of a boundary has a contract test suite", "in a small project-owned adapter", "pure helper functions inside it are implementation details", "with no tests and no public exports of their own", each with a red subtest.
- **[major]** scripts/tddcore/lint.py:45-46 — the swarm item's verdict "counts as classitis" is not required (section 5 already contains "no classitis"). Fix: require "with one caller each are classitis", with red subtests in both tests.
- **[minor]** TESTLIST.md:259-260 — "skill_lint names a SKILL.md without the doubles rule" ticked although only 6 of 8 elements are guarded.
- **[minor]** SKILL.md:25 vs docs/test-pyramid.md:33 — the adapter rule contradicts Dwello's `vi.mock` for `$app/*` (27 files); record the conflict as an open point and leave the decision to the user; ideally say new tests use the adapter, existing ones migrate in a refactor.
- **[minor]** references/depth.md — no swarm section and nothing on doubles.
- **[minor]** DESIGN.md:76 — `depth_report`'s "untested" finding pushes toward tests for helper modules, contradicting hard rule 4; record it for the depth_report step.
- **[nit]** SKILL.md:25 — "framework modules" in the boundary list reads as allowing direct doubles; write "framework modules (through an adapter)".
- **[nit]** DESIGN.md:135 — the lint known limit does not mention fragment phrases.

VERDICT: FAIL
