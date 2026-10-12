# Review: Stage 2b step 12 (verify_all stage 2b), round 2 (commit 0c4d742)

Final review of the end state before the lock is rewritten. Reviewer report (content as returned, condensed formatting).

## Summary
No blockers and no major issues. Whole suite 236 OK; `skill_lint` OK; SKILL.md 98 lines with the six hard rules right after the two-sentence intro. Real `verify_all` at HEAD prints `STAGE2B: FAIL` for the expected reasons only (steps 01-11 PASS, step 12 PASS round 1, lock still names step-08-round-6.md and lists the nine scripts changed since). Simulated finish (fake passing step-12-round-2.md, lock written by the DESIGN.md command): `verify_all` exits 0 with all 12 verdicts, `verifiers.lock: OK`, `STAGE2B: PASS`; both system-tool checks silent, exit 0. Every attack was caught. `verify_all`, `gate.py`, `selfcheck.py` and `verdicts.py` unchanged since round 1. The stage 2b scripts diff (`5e63e61..HEAD`) adds only test files; no new non-test files, symbolic links, mode changes or tracked bytecode. The lock can be written as planned.

## Commands
- Clone at 0c4d742: 236 OK (137 s); `skill_lint` OK; SKILL.md 98 lines.
- Real `verify_all` (3m26s, exit 1): tests OK, skill_lint OK, steps 01-11 PASS (rounds 7/3/3/3/3/4/3/6/4/4/4), step 12 PASS (round 1), lock names step-08-round-6.md, nine "changed since its review" lines, `STAGE2B: FAIL`.
- Simulated finish: lock of 17 lines; `sha256sum --check` and `diff` silent; `verify_all` `STAGE2B: PASS`, exit 0; no `__pycache__` or temp directory left.
- Attacks caught: edited `depth.py` (full run), added `tddcore/extra.py`, `tddcore/sub/x.py`, `tddcore/tests/evil.py`, hidden files, symbolic links (directory, file, dangling), lock naming round 1 or `./evidence/...`, step 12 round 3 FAIL, step 10 round 5 FAIL (full run), duplicate lock line. Accepted correctly: CRLF lock, a planted `.pyc` in `__pycache__` (never loaded by `verify_all`).

## Round-1 findings
- [minor] DESIGN.md:86 "stage 2": fixed. [minor] Known limits wording: fixed.
- [nit] `gate.stage2` and test names: not fixed (cosmetic). [nit] no direct missing step 09-12 review case: not fixed (covered by the 12-line assertion).

## New findings
- **[minor]** DESIGN.md:86 — "ties every file the scripts can load" overstates: `__pycache__/` is excluded and the other CLIs load bytecode from `scripts/tddcore/__pycache__`; only `verify_all` ignores it. Say "every source file" and add a Known-limits line.
- **[nit]** DESIGN.md:68 — "stage 2's depth check": historical, accurate.

VERDICT: PASS
