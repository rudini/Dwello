# Review: Stage 2b step 09 (two-tier suite), round 3 (commit 7a1db95)

Reviewer report (content as returned, condensed formatting).

## Summary
Both round-2 majors are fixed: the literal SKILL.md history (test, red, green, refactor full, `test "design note"`) and a task whose list line rides in the next red are accepted by `tdd_replay`, and the real `tdd-step` accepts every step; A4 and A5c stay rejected; round-3 reds fail for the right reason; each green touches one production file and passes the whole suite.

FAIL on one new problem: the design-note fix means the replay no longer checks any `test:` commit after the range's last green or refactor, so the range's HEAD can leave the full (or fast) suite red and still be accepted, even when it claims `--suite full` and records exit 1. The round-2 code rejected this history.

## Commands
- Clone at 7a1db95: 222 OK (138 s), no signing override needed.
- faaa9da: only the new test fails, on an assertion; 8f8d379: 221 OK, replay.py only; abe40d9: only the new test fails (0 != 1); 9540d13: 222 OK, protocol.py only; 70cffcc: fixture.py only.
- Throwaway bun 1.4.2 repos with the real tools: S1 (test, red, green fast, refactor, `test "design note"`) ACCEPT; S2 (list line in the next red) ACCEPT; S2b (`tdd-step test` after a fast green) refused, exit 1; S2c (`green --suite full`, design note) ACCEPT; A4 REJECT at the green and at the `test:` commit; A5c REJECT; X5 (trailing note narrows `scripts.test`) REJECT.
- X1: S1 but the design-note commit changes `data.json` so the `.pg` test fails: `tdd-step test` exit 0, replay ACCEPT; with `test --suite full` (trailer exit 1) also ACCEPT; at 5380e6d REJECT ("the final commit must pass the full suite"). X1b: the note breaks a fast test: ACCEPT. X2: a range of only the fast test-list commit: REJECT ("final commit must run the full suite"); with `--suite full`: ACCEPT.

## Round-2 findings
- [major] design note as trailing `test:` commit rejected: fixed (opens the hole below).
- [major] mid-task list edit turns a fast green into a task end: fixed (S2, S2b, A4).
- [minor] task without its own test list: documented. [minor] refactor repairing a broken full test: documented limit. [nits]: fixed or kept knowingly.

## New findings
- **[major]** replay.py:55-61 — a `test:` commit after the range's last green or refactor is not checked, so HEAD can fail the full or fast suite and be accepted (X1, X1b); a `test:` commit may change non-code files (`.json`, `.sql`, `.env`) and `tdd-step test` never checks the run. Fix: hold the range's last commit to "the full run passes" whatever its tier, or require `test:` commits to leave both tiers' outcomes unchanged, or have `tdd-step test` refuse a failing run after a green or refactor; add a test.
- **[minor]** DESIGN.md:42-51 — the Rules list lacks "test may not follow a green on the fast suite"; "`test`: no code changes" overstates (non-code files may change).
- **[minor]** replay.py:61 — a range of only a fast test-list commit is rejected while trailing test commits are exempt; inconsistent, message gives no hint.
- **[nit]** protocol.py:61-63 — "redo the green with --suite full" has no how-to in SKILL.md.
- **[nit]** tests/test_tiers.py — no replay test for a test list after a fast green.

VERDICT: FAIL
