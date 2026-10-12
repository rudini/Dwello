# Review: Stage 2b step 09 (two-tier suite), round 4 (commit 61e8c5c)

Round granted by the user after three failed rounds. Reviewer report (content as returned, condensed formatting).

## Summary
The round-3 major is fixed: a trailing `test:` commit that breaks the full or fast suite is rejected, whatever tier it claims and whatever its trailer says, and `tdd-step test` refuses such a commit when the claimed tier fails. All SKILL.md-literal histories (S1, S2, S2c) are still accepted by the real `tdd-step` at every step and by `tdd_replay`; round-1/2 attacks (A4, A5c, test list after a fast green) stay rejected. Each round-4 red fails on an assertion for the right reason; each green changes one production file and passes; the pin mutation fails as recorded; whole suite at HEAD 233 OK. No blocker, no major; three minor findings on edges of the new `test` rule and the docs.

## Commands
- Clone at 61e8c5c: 233 OK (135 s).
- 30d1647: only the new test fails (`0 != 1`); 3f55a01: replay.py only, OK; 3bf80f0: only the new test fails; 21974f1: protocol.py only, OK.
- Pin mutation (rule "test list after a green on the fast suite" -> `if False:`): the pin fails (failures=1).
- Throwaway bun 1.4.2 repos (tiered package.json, pg test reads `data.json`): S1, S2, S2c every step exit 0, replay ACCEPT; X1 (design note breaks the pg test) `tdd-step test` exit 0 on fast, replay REJECT ("the range must end with the full suite passing ..."); X1 with `--suite full` refused, hand commit REJECT; X1b refused, hand commit REJECT; S2b refused, hand commit REJECT; A4 REJECT; A5c REJECT; X6 ACCEPT (finding 1); E (finding 2).
- SKILL.md 98 lines.

## Round-3 findings
- [major] trailing `test:` commit unchecked: fixed (X1, X1 `--suite full`, X1b).
- [minor] DESIGN.md Rules: fixed. [minor] fast-only test-list range: fixed by documentation. [nit] redo a green: fixed. [nit] replay test: fixed with pin.

## New findings
- **[minor]** protocol.py:61 — the `test` rule checks only the claimed tier and only right after a green or refactor: a mid-range `test:` commit can break a full-tier test through data, a later fast green can restore it, the task ends full-green and the replay accepts (X6); DESIGN.md:45 reads as if the full suite were protected. Fix: reject a `test:` commit whose full run gains failures, or document.
- **[minor]** protocol.py:61 — with an empty fast suite (all tests `*.pg.test.ts`), `tdd-step test "design note"` after an all-full task is refused ("0 of 0 tests failed"); `--suite full` works but no doc says so. Fix: judge on the full run when the fast run has no tests, or document; add a test either way.
- **[minor]** SKILL.md:49 — section 3 does not mention the new `test` refusals; name them or point to tooling.md.

VERDICT: PASS
