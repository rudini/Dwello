# Review: Stage 2 step 4 (`verify_all`, `tddcore/gate.py`, `verifiers.lock`), round 3 (commit 7a85e2f)

Reviewer report (content as returned, condensed formatting).

## Summary
All round-2 findings are fixed and confirmed. Replay clean; 5 pins killed again; the documented lock command produces an accepted lock; `verify_all` still has no branches or loops; the real run gives the expected FAIL. Two new false-PASS routes from changes inside the skill that leave the lock and every locked verifier untouched, both from the same gap: the test run (`selfcheck.own_suite`) executes code the lock does not cover, and `gate.stage2` reads its lint input after that run.

## Commands
- Replay 20ea023..7a85e2f: 4c362cf 9 OK; dae123f red / 7db2b2a green; 4ff5525 red / 7f7a777 green; 7f774c7 red / 373a20b green; 4043712 red / ec58ced green; b691146 pin 14 OK; 7a85e2f 14 OK. Reds change only the test, greens only `verify_all`/`gate.py`.
- Pin log 5/5 KILLED. Extra: `_links` disabled KILLED; `shutil.rmtree` → `pass` and dropping the `__pycache__` exclusion survive.
- Documented lock command: `STAGE2: PASS` from `/`, the skill directory and under `python3 -I`.
- Real run: steps 01-05 PASS, 06 FAIL (round 3), 07 PASS, 08 FAIL (round 2), lock missing, `STAGE2: FAIL` (expected).
- Audit hook: the parent imports nothing after the test subprocess and opens only SKILL.md.
- Attack A: a test in `scripts/tests/` swaps in a lint-clean SKILL.md and restores the broken one 3 s later → `STAGE2: PASS`.
- Attack B: `<skill>/unittest/__main__.py` printing a bare OK, run from the skill directory → `STAGE2: PASS` (from `/` → FAIL).
- Fail-closed / non-issues: symlinked `scripts/tests`; calling `verify_all` through a symlink (ModuleNotFoundError, leaks the cache dir); `references/` and `evidence/` only feed text checks; review files are the documented record.

## Round-2 findings
Blocker (shadow modules) fixed and pinned; symlinks fixed and pinned; crafted bytecode fixed for parent and test run, pinned, doc corrected; `tests` exclusion fixed; TDD red acknowledged; lock BOM/blank line acceptable.

## New findings
- **[major] selfcheck.py:11-12, DESIGN.md:78, :116** the test run imports from the caller's cwd: a skill-root `unittest/` package fakes a passing suite when run from the skill directory. Fix: `-P` and/or `cwd=scripts`; red; DESIGN.md.
- **[major] gate.py:15-18, DESIGN.md:78** lint reads SKILL.md after the unlocked test run; a test can swap SKILL.md during the run. Fix: compute lint before `own_suite`; red; DESIGN.md; known limit for weakened tests in `scripts/tests/` plus a matching SKILL.md edit.
- [minor] gate.py:77 the `__pycache__` exclusion is untested.
- [nit] verify_all:12-19 the temporary cache leaks on a crash before `rmtree`.
- [nit] gate.py:61-72 `_verifiers` and `_links` walk `scripts/` twice.

VERDICT: FAIL
