# Review, round 4: `tdd-step` (fixes `3424163..HEAD`, HEAD `451227a`)

Verdict FAIL. Reviewer report (content as returned, condensed formatting).

## Summary
Round-3 major fixed: crashed pytest (broken conftest import; pytest missing in the interpreter) makes green/refactor refuse in a mixed repo. TDD history of `3424163..HEAD` clean; round-3 pins honest (6/6 killed again); Dwello vitest still runs (1300 tests, exit 0). Still FAIL because of two in-scope problems a Dwello user would hit: (1) `.rejects`/`.resolves`/`expect.poll` assertion failures are refused as red (vitest reports them as `Error: ...`; Dwello uses `.rejects.toMatchObject`/`.rejects.toThrow` 43 times in 16 files; not documented). (2) Dwello's backend suite (46 `bun test` files) is never run: a refactor breaking backend code committed with `TDD-Exit-Code: 0` while `bun test` fails 5/5.

## Commands run (key output)
1. Suite at HEAD (fresh clone, real node_modules copy): `Ran 65 tests in 69.9s OK`.
2. Every commit in `3424163..HEAD`: reds d019aef, 71bedfc (5 subtests), e4e8fd0, cdbccac, 163ad56 fail only their new test with AssertionError; greens 5f74290, 91c04fe, 0dc2138, b54449f, 8ecfcdf, pin 01a7ce8, refactor d0afa65, docs 451227a OK. Reds touch only tests; greens only suite.py/protocol.py.
3. Round-3 repro A (broken module imported by conftest in mixed repo): refused (`exit code 4, no output`).
4. Repro B (venv without pytest): refused.
5. Dwello: `tdd-step test` rc=0, ~62 s; `suite.run('.')` 1300 pass.
6. Round-3 pins: 6/6 KILLED.
7. 14 own mutations: KILLED 6; SURVIVED 8: `^Vitest caught` anchor, `UnicodeDecodeError`->`ValueError` (equivalent), vitest empty `and not load_errors` dropped, vitest no-report `empty` False->True, combined `all(r.empty)`->False, `"Failed: "`->`"Failed"`, `exit_code == 1 and` in `_pytest_outcome`, `numTodoTests`.

## Status of round-3 findings
Crashed pytest dropped: FIXED. Config exclusion: PARTIALLY FIXED (`pytest.toml`, `.pytest.ini`, `package.json`). Unhandled substring: FIXED (anchor unpinned). Non-UTF-8 package.json: FIXED. Unreachable unittest in mixed repos: documented, accepted. Unpinned clauses: FIXED (new ones below). tdd_replay mention: FIXED. Snapshot nit: documented. quotepath: FIXED. `Failed: Timeout`: documented. TESTLIST timing: acknowledged.

## New findings
- [major] `suite.py:139-142`: vitest `.rejects`/`.resolves`/`expect.poll` assertion failures (`Error: expected 1 to be 2`, `Error: promise resolved "1" instead of rejecting`, `Error: expected { status: 401 } to match object { status: 400 }`) are refused as red.
- [major] `suite.py:31-43`: detection only at the root; Dwello's backend `bun test` suite (backend/package.json) never runs, so green/refactor can break it with exit 0, and no backend red can be committed. Fix: run or refuse nested test commands, or explicitly scope and document.
- [minor] `protocol.py:24`: `pytest.toml` and `.pytest.ini` (read by pytest 9) still let green deselect the failing test.
- [minor] `package.json` is neither test nor production: in a mixed repo green can remove vitest from devDependencies and drop the JS suite; a refactor emptying a framework is dropped as "empty".
- [minor] `suite.py:173,178-179`: a no-report pytest run with exit 0 (`os._exit(0)` in an imported module) counts as pass.
- [minor] unpinned guards (surviving mutations above).
- [nit] combined `Run.empty` never read; `ran`/`empty` widen the interface.
- [nit] green 5f74290 slightly more than its test forces (behaviour-neutral).
- [nit] unhelpful summaries (`exit code 4, no output`; `0 of 0 tests failed` for a load error).

## Deep-module assessment
suite.py deep (weak spots: `ran`/`empty` leak, root-only detection). protocol.py deep. tdd-step thin CLI, acceptable. No hard-coded special cases; tests drive real runs.

VERDICT: FAIL
