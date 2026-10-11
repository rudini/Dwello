# Response to step 08 (verify_all), round 1

- [major] incomplete verifier list: red "locks every script" (an edited `tddcore/__init__.py` and an added `scripts/hashlib.py` must fail; the fixture now locks every file under `scripts/` but the tests, as the documented command does), green: `gate._verifiers` lists every file under `scripts/` except `tests/` and `__pycache__/`; a file on disk but not in the lock is "not locked", a file in the lock but changed or gone is "changed since its review". DESIGN.md and TESTLIST.md updated; the lock command now hashes all of them.
- [minor] duplicate and malformed lines: red/green "lock format": every line after `reviewed:` must be `<64 lowercase hex>  <path>`, a path may appear once; a lock that is not UTF-8 is named instead of a traceback.
- [minor] no-argument path and lock conditions untested: `RealVerifiersTest` copies the real scripts into a fixture skill, locks them and runs that copy without arguments from another directory (STAGE2: PASS); a test for a lock naming a failed latest review. Mutation log `evidence/mutations/step-08-round-1-pins.txt`: 7/7 KILLED (`parents[2]`, `passed and`, `lines[1:]`, `path not in present`, `(\d+)`, the review file check, the tests/pycache exclusion).
- [minor] green a5b0b29 over-implemented: acknowledged; those rules were pinned by d27ea89 with 3/3 kills.
- [nit] normalised round number: red/green "real review filename": the lock must name an existing file of the latest round (`round-01.md` accepted when that is the file, a non-existent `round-1.md` rejected).
- [nit] non-UTF-8 lock: fixed (above).
- [nit] loose arguments: left; `verify_all` takes one optional directory, as documented.
