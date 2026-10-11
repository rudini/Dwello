# Review: Stage 2b step 12 (verify_all stage 2b), round 1 (commit 666345f)

Reviewer report (content as returned, condensed formatting).

## Summary
No blocker or major issues. `gate.STEPS` covers 01-12, `LOCK_STEP` is "12", the last line is `STAGE2B: PASS` or `STAGE2B: FAIL`; `verify_all` changed only in its docstring and holds no logic. Red 57c046d changed only `test_verify_all.py` and failed for the right reasons (`STAGE2` vs `STAGE2B`, step 08 vs step 12); green e908f89 changed only `gate.py` and `verify_all`, whole suite passes. The real `verify_all` at 666345f prints `STAGE2B: FAIL` only for the expected reasons (steps 09-12 reviews missing or failing, the lock still names step 08, hashes of files changed since). Every lock and step attack in a copy was caught; with fake passing reviews for 09-12 and the documented lock command, the copy prints `STAGE2B: PASS`, exit 0. Left: old "stage 2" wording in DESIGN.md and a few names.

## Commands
- Whole suite at 666345f: 220 OK (170.9 s).
- Real `scripts/verify_all` (3m30s, exit 1): tests OK, skill_lint OK, steps 01-08 PASS, step 09 FAIL (round 1), steps 10-12 no review, lock names step-08-round-6, nine "changed since its review" lines (depth_report, tdd-step, depth.py, gate.py, lint.py, protocol.py, replay.py, suite.py, verify_all), `STAGE2B: FAIL`. Nothing unexpected.
- Red 57c046d: 16 assertions fail, all `STAGE2` vs `STAGE2B` or step 08 vs step 12; no crashes. Green e908f89: 220 OK.
- Attack copy (fake `step-{09..12}-round-9.md` PASS, documented lock command): end to end `STAGE2B: PASS`, exit 0, `sha256sum --check` and `diff` silent. Caught: lock naming step-08-round-6 (`STAGE2B: FAIL`, exit 1); `./evidence/...` path; removed step 09/10/11 review; step 12 latest round FAIL; lock naming the failing round; lock naming an older passing round; step 10 latest FAIL; edited `depth.py`; added `tddcore/extra.py`; `round-09` next to `round-9`. The old `STAGE2: PASS` line is never printed. Independent commands catch an edit to `gate.py` and an added symbolic link.

## Findings
- **[minor]** DESIGN.md:86 — a stale lock "fails stage 2"; say stage 2b.
- **[minor]** DESIGN.md:137, 139 — Known limits still say "stage 2" and "stage 1 and 2 report FAIL".
- **[nit]** gate.py:12 and test names — `gate.stage2` and test names still say stage 2; cosmetic.
- **[nit]** test_verify_all.py:71 — no case names a missing step 09-12 review directly (covered by the 12-line assertion).

VERDICT: PASS
