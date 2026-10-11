# Response to step 08 (verify_all), round 3

The user granted one more round after this third failed round.

- [major] the test run imports from the caller's working directory: red "runner shadowed by cwd" (a skill-root `unittest/` package that prints a bare OK, a failing suite, `verify_all` run from the skill directory); green: `selfcheck.own_suite` runs `python -P -m unittest discover ...`, so the working directory is not put on the path. `verify_stage1` shares `own_suite` and is covered by the same fix.
- [major] lint read after the unlocked test run: red "lint before suite" (a test that copies a good SKILL.md over a broken one); green: `gate.stage2` computes the reviews, the lock and `lint.problems` before `own_suite`. DESIGN.md says so, and a known-limits line names what stays unlocked (`scripts/tests/` and SKILL.md: a weakened test plus a matching SKILL.md edit needs no new review; the review files and git history show it).
- [minor] `__pycache__` exclusion untested: pin "bytecode caches left by normal runs are not locked".
- Mutation log `evidence/mutations/step-08-round-3-pins.txt`: 3/3 KILLED (`-P`, the order of lint and suite, the `__pycache__` exclusion).
- [nit] the temporary cache leaks on a crash before `rmtree`: documented (no logic allowed in the entry point).
- [nit] two walks of `scripts/`: refactor "gate walks scripts once".
