# Review: Stage 2 step 4 (`verify_all`, `tddcore/gate.py`, `verifiers.lock`), round 2 (commit 20ea023)

Reviewer report (content as returned, condensed formatting).

## Summary
Lock format, review-name nits and missing tests are fixed; replay clean; 7 pinned mutations killed again; the real run gives the expected FAIL; the documented `find | sort | xargs sha256sum` lock is accepted. The round-1 major is still open for the shipping invocation: run without an argument, `scripts/` is first on `sys.path`, so a shadow module (`scripts/hashlib.py`) runs before the gate and can print `STAGE2: PASS`. The new test runs the repo's own `verify_all` against a fixture, so the fixture's shadow file is never imported. Two more false PASS routes without touching the lock: a symlinked package directory, and a crafted `.pyc` under `scripts/tddcore/__pycache__/`.

## Commands
- Replay: e864d2c red / 66e2545 green / 1ffaa67 red (two methods) / 165432e green / 221d4eb red / a5e4404 green / 346d92a pin / 20ea023 docs: as expected.
- Pin log: 7/7 KILLED again. Extra: `"__pycache__"` exclusion and round comparison KILLED; `$` anchor, `"  "` → `\s+`, `if lines else ""` survive (harmless).
- Documented lock command on a skill-shaped dir: `STAGE2: PASS`, exit 0 (no false FAIL).
- Lock probes failing correctly: edited `__init__.py`, trailing space, `round-01` vs `round-1`, two files per round, passing round added after the lock, stale `gate.py` hash, trailing blank line, BOM, empty lock, no `reviewed:` line, `./scripts/` path.
- Real run: steps 01-05 PASS, 06 FAIL (round 3), 07 PASS, 08 FAIL (round 1), lock missing, `STAGE2: FAIL` (expected).
- False PASS attacks (no argument, locked files and lock unchanged, SKILL.md cut): A edited `__init__.py` → FAIL (fixed); B `scripts/hashlib.py` printing PASS → **PASS**; C symlinked `scripts/hashlib` package → **PASS** (`rglob`/`is_file` skip symlinked dirs); D unchecked-hash `.pyc` for `lint` → **PASS** (FAIL with `PYTHONPYCACHEPREFIX`).

## Round-1 findings
- [major] incomplete verifier list: not fixed for the no-argument invocation (B); DESIGN.md:80 claim false.
- [minor] lock lines: fixed. [minor] no-argument path: tested, but not with a shadow file. [minor] over-implemented green: acknowledged. [nit] round number, non-UTF-8: fixed. [nit] arguments: acceptable.

## New findings
- **[blocker] verify_all:6, gate.py:51-56, test_verify_all.py:111-125** a module added to `scripts/` shadows stdlib/third-party imports and runs before the gate. Fix: import only `sys`, `sys.path.pop(0)` before other imports, append the scripts directory at the end; red with a copy run without arguments; correct DESIGN.md.
- **[major] gate.py:63** symlinked directories under `scripts/` are invisible to the lock. Fix: follow them or report any symlink; test.
- **[major] gate.py:64, DESIGN.md:116** crafted bytecode inside `scripts/` gives a false PASS; the known limit misplaces it. Fix: set `sys.pycache_prefix` in `verify_all` before importing `tddcore`; test; correct the doc.
- [minor] gate.py:64 excludes any `tests` path part, broader than the documented command (false FAIL / unlocked file). Fix: top-level `tests` only.
- [minor, TDD] red 1ffaa67 started two test methods.
- [nit] BOM or trailing blank line fails the lock with an obscure message (fails closed).

VERDICT: FAIL
