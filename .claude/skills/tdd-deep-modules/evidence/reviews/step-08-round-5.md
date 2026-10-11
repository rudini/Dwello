# Review: Stage 2 step 4 (`verify_all`), round 5 (commit e5e3906)

Round granted by the user after four failed rounds. Reviewer report (content as returned, condensed formatting).

## Summary
All round-4 findings fixed or documented; replay clean; both pins KILLED; `verify_all` logic-free; the real run gives the expected FAIL; attack C is caught by the independent `sha256sum --check`. One new major: the independent check uses `find -type f`, which skips symbolic links, so a symlink added under `scripts/` that shadows a module `verify_all` imports before hashing (`scripts/tddcore/gate` → a directory with a fake `stage2`) gives `STAGE2: PASS` while both documented independent commands exit 0. DESIGN.md says they would catch it.

## Commands
- Copy at e5e3906 with a fake passing step-08 round: lock written with the documented command; clean copy → `sha256sum` 0, `diff` 0.
- Each of the 16 locked files tampered: `sha256sum` 1, `gate._lock` "changed since its review".
- Added `scripts/hashlib.py`: `diff` 1, gate "not locked". Added symlink `tddcore/extra.py -> gate.py`: `sha256sum` 0, `diff` 0, gate "is a symbolic link". Removed `tddcore/depth.py`: both 1, gate "changed".
- Attack C (round 4): `sha256sum` 1. Caught.
- Attack S: `ln -s ../../evidence/evil scripts/tddcore/gate` (package with `stage2` returning PASS) → `sha256sum` 0, `diff` 0, `verify_all` `STAGE2: PASS`. Variant with a real `gate/` directory holding a symlinked `__init__.py`: same.
- Replay: 8a87404 17 OK; 9ff31a1 17 OK; 2da663b 18 OK; e5e3906 18 OK.
- Pin log 2/2 KILLED; extra: lint after suite KILLED, `-P` removed KILLED.
- Real run: 01-07 PASS (06 at round 4), 08 FAIL (round 4), lock missing, `STAGE2: FAIL` (expected); no temp dir left.

## Round-4 findings
[major] self-check: answered (known limit, corrected lock paragraph, independent check); check incomplete (finding 1). [minor] ordering: fixed. [minor] Python 3.11+: documented. [nit] whitespace: documented. [nit] blank lines: removed, new pair added (finding 3).

## New findings
- **[major] DESIGN.md:80, :88-95** the independent check misses symlinks; a shadowing symlink gives a false `STAGE2: PASS` that neither `verify_all` nor the independent commands catch. Fix: `find scripts -not -type d …` in the `diff` (verified: exit 1 showing `> scripts/tddcore/gate`, exit 0 on a clean copy), or a third command `test -z "$(find scripts -type l)"`; name symlinks in the known limits.
- [minor] DESIGN.md:80 vs gate.py:62-72 "any symbolic link under `scripts/`" excludes `tests/` and `__pycache__`.
- [nit] test_verify_all.py:342-343 two blank lines inside the class.
- [nit] DESIGN.md:93 `cut -c67-` assumes plain names (fails closed).

VERDICT: FAIL
