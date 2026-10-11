# Response to step 08 (verify_all), round 4

The user granted a fifth round.

- [major] the lock is checked by the code it locks: no code fix exists (a checker cannot detect a change to itself without logic in the entry point or a trust anchor outside the skill). DESIGN.md now (1) names the limit in the known limits: `verify_all`, `tddcore/__init__.py`, `gate.py`, `lint.py`, `selfcheck.py` and `verdicts.py` run before `gate._lock` hashes them, so an edit there that switches the check off passes `verify_all` with the lock untouched; (2) corrects the lock paragraph ("fails stage 2 until a new review passes" now names this exception); (3) gives an independent check with system tools only: `tail -n +2 verifiers.lock | sha256sum --check --quiet` plus a `diff` of the locked paths against the documented `find`. Verified on a copy: clean lock → both exit 0; an edited `tddcore/__init__.py` → `sha256sum` exit 1 ("FAILED"); an added `scripts/hashlib.py` → `diff` exit 1.
- [minor] ordering of the reviews and `_lock` before the suite not pinned: pin "the suite cannot change reviews or the lock for the gate" (a test writes a passing step-07 round, or rewrites the lock with the edited verifier's hash, during the run). Mutation log `evidence/mutations/step-08-round-4-pins.txt`: 2/2 KILLED (reviews after the suite, `_lock` after the suite).
- [minor] Python 3.11+: documented in the known limits.
- [nit] paths with whitespace: documented (they always read "not locked"; fails closed).
- [nit] two blank lines inside the test class: removed.
