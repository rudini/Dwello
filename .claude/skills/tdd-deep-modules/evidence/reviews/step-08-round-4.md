# Review: Stage 2 step 4 (`verify_all`, `tddcore/gate.py`, `selfcheck.py`, `verifiers.lock`), round 4 (commit d00834b)

Extra round granted by the user after three failed rounds. Reviewer report (content as returned, condensed formatting).

## Summary
Both round-3 majors are fixed and pinned; attacks A and B no longer work (B also from `scripts/` and `scripts/tests/`). Replay clean, 3 pins killed, `verify_all` still has no branches or loops, the documented lock command gives `STAGE2: PASS` on a full copy, the real run gives the expected FAIL. One major remains, undocumented: the gate runs the locked code (`verify_all`, `tddcore/__init__.py`, `gate.py`, `lint.py`, `selfcheck.py`, `verdicts.py`) before it checks that code's hashes, so a three-line edit to `tddcore/__init__.py` (lock untouched) gives `STAGE2: PASS` on a broken SKILL.md. No code fix exists without a trust anchor outside the skill; DESIGN.md claims otherwise.

## Commands
- Replay: afdf3f2 24 OK; f228a92 red / c53d570 green; b8b0353 red / bd9d1b3 green; b62d0c1 pin 27 OK; 9769779 refactor 27 OK; d00834b 27 OK. Reds change only the test, greens only gate.py / selfcheck.py.
- Pin log 3/3 KILLED. Extra: symlink list KILLED; moving the review reads or `_lock` after `own_suite` SURVIVES.
- Documented lock command: `STAGE2: PASS` from `/`, the skill dir and under `python3 -I`; full git copy with fake round-4 PASS reviews: all OK, exit 0, no stray files or temp dirs.
- Real run: tests OK, skill_lint OK, 01-05 and 07 PASS, 06 FAIL (round 3), 08 FAIL (round 3), lock missing, `STAGE2: FAIL` (expected).
- Attack A (suite repairs SKILL.md): FAIL. Attack B (`unittest/` in cwd) from the skill dir, `scripts/`, `scripts/tests/`: FAIL.
- Audit hook: no import/exec/compile in the parent after the test subprocess.
- Attack C: `tddcore/__init__.py` gains `from tddcore import gate as _gate, lint as _lint` / `_gate._lock = lambda skill: []` / `_lint.problems = lambda skill: []` → `STAGE2: PASS`, exit 0, lock unchanged.

## Round-3 findings
cwd imports: fixed. Lint after suite: fixed. `__pycache__` exclusion: pinned. Temp cache leak: documented. Two walks: fixed.

## New findings
- **[major] gate.py:15-18, verify_all:15, DESIGN.md:80, :117** the lock is checked by the code it locks; an edit that disables the check passes with the lock untouched, undocumented. Fix: known-limits line naming those files; an independent check with system tools (`tail -n +2 verifiers.lock | sha256sum -c` plus the documented `find` compared against the lock); correct DESIGN.md:80.
- [minor] the ordering of `_lock` and the review reads before the suite is not pinned.
- [minor] `-P` needs Python 3.11+; not documented.
- [nit] paths with whitespace cannot be locked (fails closed).
- [nit] two blank lines inside the test class.

VERDICT: FAIL
