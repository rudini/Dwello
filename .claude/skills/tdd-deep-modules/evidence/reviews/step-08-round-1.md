# Review: Stage 2 step 4 (`verify_all`, `tddcore/gate.py`, `verifiers.lock`), round 1 (commit ab7e4b1)

Reviewer report (content as returned, condensed formatting).

## Summary
`verify_all` has no logic and hands off to the gate. `gate.stage2` applies the documented rule correctly to the designed cases (reviews read before the suite; the lock must name step 08's latest passing round; tampered or missing hashes fail; a passing review added after the lock fails). TDD replay clean; the real run gives the expected FAIL. Major: the verifier list is incomplete. `scripts/tddcore/__init__.py` runs on every gate import and is not locked, and `scripts/` is first on `sys.path`, so a new `scripts/hashlib.py`, `re.py` or `yaml.py` replaces the real module. Two false `STAGE2: PASS` results with an unchanged lock and a broken SKILL.md. "Later changes require a new review" is not met.

## Commands
- `tests.test_verify_all` at ab7e4b1: 4 tests OK.
- Lock probes: passing round added after the lock FAIL; failing round FAIL; `reviewed:` not first FAIL; verifier deleted FAIL; uppercase hashes FAIL (false, harmless); review as directory FAIL; CRLF lock PASS; junk lines PASS; symlinked identical verifier PASS; stale hash followed by a correct line PASS (last wins); `round-01.md` on disk with the lock naming `round-1.md` PASS, naming the real file FAIL; non-UTF-8 lock traceback, exit 1.
- False PASS A: SKILL.md cut, `tddcore/__init__.py` patches `lint.problems` → `STAGE2: PASS`. False PASS B: `lint.py` gutted, a new `scripts/hashlib.py` returns the old hash → `STAGE2: PASS`.
- Replay: daabafd red / a5b0b29 green / d27ea89 pin / cc41541 red / 6733207 green / e4b427e red / a4018bc green: all as expected; pin log 3 kills.
- Extra mutations survived: `parents[2]` → `parents[1]`, `passed and` in the lock condition, `lines[1:]` → `lines`, `not file.is_file() or`, `is_file` → `exists`, `(\d+)` → `(\d)`.
- Real run: tests OK, skill_lint OK, steps 01-05 PASS, 06 FAIL (round 3), 07 PASS, 08 no review, lock missing, `STAGE2: FAIL`, exit 1 (expected).

## Findings
- **[major] gate.py:10-11, verify_all:6** verifier list misses `tddcore/__init__.py` and the module search path. Fix: lock every file in `scripts/` outside `scripts/tests/`; fail on any unlisted file there; tests for an edited `__init__.py` and an unlisted `scripts/hashlib.py`; update DESIGN/TESTLIST.
- [minor] gate.py:40 duplicate and malformed lock lines accepted.
- [minor] gate.py:14 the no-argument path (used by "Done when") untested; lock conditions unpinned.
- [minor] green a5b0b29 over-implemented (rules tested only by the next pin).
- [nit] gate.py:36-38 review name compared by normalised round number.
- [nit] gate.py:33 non-UTF-8 lock gives a traceback (fails closed).
- [nit] verify_all:9 extra arguments ignored; `verify_all ""` checks the current directory.

VERDICT: FAIL
