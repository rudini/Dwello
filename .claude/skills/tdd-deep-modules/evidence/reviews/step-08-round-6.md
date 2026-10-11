# Review: Stage 2 step 4 (`verify_all`), round 6 (commit a09f736)

Round granted by the user after five failed rounds. Reviewer report (content as returned, condensed formatting).

## Summary
Round 6 passes. The round-5 major is fixed: the `diff` in DESIGN.md now uses `find scripts -not -type d …`, so attack S and its variant are caught, along with every other attack tried. Every edit to a locked file and every removed file is caught by `sha256sum --check`; every added file or symbolic link in the locked part is caught by the `diff` (and by `gate._lock`, except when the added file replaces a module that runs before the hashing, which is documented and covered by the `diff`). Replay clean; real run fails as expected; `verify_all` holds no logic; DESIGN.md is accurate about what each check catches.

## Commands
Copy at a09f736 with a fake passing step-08 round, lock written with the documented command (16 entries). Checks: `sha` = `sha256sum --check --quiet`, `diff` = documented diff, `gate` = `gate._lock(skill)`.
- Clean: sha 0, diff 0, gate [].
- Each of the 16 locked files edited: sha 1, gate "changed since its review".
- Added `scripts/hashlib.py`: diff 1, gate "not locked".
- Symlink `tddcore/extra.py -> gate.py`: diff 1, gate "is a symbolic link", "not locked".
- Attack S (`scripts/tddcore/gate` → package with a fake `stage2`): `verify_all` prints PASS (documented self-check limit); sha 0, diff 1 (`> scripts/tddcore/gate`). Caught.
- Real `gate/` directory with a symlinked `__init__.py`: diff 1. Real `gate/` package copy: diff 1.
- Removed `tddcore/depth.py`: sha 1, diff 1, gate "changed".
- Extension module `gate.cpython-313-x86_64-linux-gnu.so`: diff 1. `tddcore/lint/` package patching `Path.rglob`: diff 1. `scripts/evil.pth`: diff 1, gate "not locked". `tddcore/__pycache__` as a symlink: gate [], diff 1 (fails closed, harmless).
- Replay: `tests.test_verify_all` at a09f736: 18 tests OK.
- Real run (2m29s): tests OK, skill_lint OK, steps 01-07 PASS, step 08 FAIL (round 5), lock missing, `STAGE2: FAIL`, exit 1 (expected); no temp dir left.
- No logic in `verify_all`; the pass rule lives in gate.py:12-24.

## DESIGN.md accuracy
All claims check out (both commands silent and 0 when the lock holds; `sha256sum` catches edits and missing files; `diff` catches added files and symlinks; the known-limits line lists the files run before hashing and names both commands; symlink wording matches `_verifiers`/`_loadable`).

## Round-5 findings
[major] symlinks missed: fixed. [minor] symlink wording: fixed. [nit] blank lines at 342-343: fixed (another pair remains). [nit] `cut -c67-`: answered, fails closed.

## New findings
- [nit] test_verify_all.py:200-201 two blank lines inside `LockFormatTest`.
- [nit] DESIGN.md:93 a symlinked `__pycache__` is listed by the `diff` but ignored by the gate (fails closed, unrealistic).

No blocker or major findings.

VERDICT: PASS
