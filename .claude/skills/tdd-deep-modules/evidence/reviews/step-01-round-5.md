# Review, round 5: `tdd-step` (fixes after the round-4 review file, HEAD `a530bd6`)

Verdict FAIL. Reviewer report (content as returned, condensed formatting). Reviewed `c65a39b..a530bd6`.

## Summary
Round-4 majors fixed for the named cases (vitest `.resolves`/`.rejects` accepted, plain throw refused; nested bun runs, crashed bun kept as error, unsupported nested script exits 2). Still FAIL: (1) bun file-level load errors next to one assertion failure are accepted as red with failed=1 (bun itself says `2 fail, 1 error`); (2) red `11f62f6` failed for the wrong reason (package.json subtest exited 2; pytest subtests refused by "no tests ran"), and green `4bb221b` edited the test file; (3) refactor `8f3b197` changed behavior: an interrupted pytest run (exit 2) next to an assertion failure is now red, before it was an error.

## Commands run (key output)
1. Full suite at HEAD: `Ran 75 tests in 99.6s OK`.
2. Every commit: reds c65a39b, 50540a2, 97d590e, 5466d6f (plus a bundled pin), 727770d fail for the right reason; 11f62f6 fails for the wrong reason (`2 != 1 : no supported test framework detected`; pytest subtests refused by `1 deselected`); greens OK; 4bb221b edits `tests/test_tdd_step.py` (its corrected test does fail 3/3 against 11f62f6's protocol.py); pin ea4d9b4 OK; refactor 8f3b197 OK.
3. vitest classification: fail for `.resolves`, `.rejects` variants, `expect.soft`, `toHaveBeenCalled`; error for thrown errors, `null.x`, `expect.assertions`, `expect.poll`; `.resolves.toSatisfy(() => { throw })` counts as fail.
4. bun: fail for assertion, `.resolves`; error for thrown error, rejected await, unhandled error, hooks throwing, todo/skip-only, no test files, preload crash. WRONGLY fail with failed=1: missing-import / syntax-error / top-level-throw / describe-throw file next to an assertion (JUnit holds only the assertion; bun says `0 pass, 2 fail, 1 error`). End to end: such a backend red was committed.
5. Dwello-like end to end: `.rejects` red committed; green committed; backend-breaking refactor refused.
6. Real Dwello clone: `error`, `bun: 0 of 0 tests failed; 6 of 1300 tests failed` (vitest failures are clone-environment; bun is the documented no-PostgreSQL case).
7. 8f3b197 behavior: `assert 1 == 2` + `pytest.exit(returncode=2)`: HEAD `fail`, 409a62d `error`.
8. bun not on PATH: `FileNotFoundError` traceback, rc=1.
9. Mixed pytest+vitest: a refactor that removes the only vitest test file commits with `TDD-Exit-Code: 0` though vitest exited 1.
10. Mutations, all SURVIVED: `at _Assertion.` -> `at `; `startswith("Error: ")` -> True; `_bun_outcome` all -> any; drop `types and`; bun `if reported else "error"`. KILLED: `package.parent` -> root, `package.name` -> `path ==`, `package.json` removed from `_TEST_CONFIG`.

## Status of round-4 findings
vitest async matchers FIXED (thrown-error side unpinned). Nested bun FIXED (new classification hole). pytest.toml/.pytest.ini FIXED in protocol (detection ignores them, nit). package.json FIXED; emptying a framework in refactor NOT addressed. No-report pytest FIXED. Unpinned guards PARTIAL. Interface nit kept. Summaries: bun crash still `0 of 0 tests failed`.

## New findings
1. [major] `suite.py:139-143,158-162`: bun file-level errors invisible in JUnit; load error hidden next to an assertion failure; red committed. Fix: read bun's `N error(s)` / `N fail` summary.
2. [major, TDD] red 11f62f6 failed for the wrong reason and green 4bb221b edited the test; the red should have been redone.
3. [major, TDD] refactor 8f3b197 changed behavior (`suite.py:235`): interrupted pytest + assertion failure now red.
4. [minor] `suite.py:45`: in a mixed repo a refactor deleting every vitest test drops vitest as empty; trailer says 0 though a command exited 1.
5. [minor] `suite.py:133`: bun missing -> FileNotFoundError traceback.
6. [minor] `suite.py:174-179`: unpinned guards (no vitest test that a plain thrown Error is refused; `_bun_outcome` guards).
7. [minor] `suite.py:123`: `NODE_ENV=test bun test` unsupported; `bun test || true` / `bun test; ...` pass shell tokens to bun; npm-init default `echo "Error: no test specified" && exit 1` makes the tool exit 2.
8. [minor] `suite.py:172-179`: a user Error thrown inside a `.resolves` matcher callback counts as an assertion.
9. [nit] green 1dff965 adds nested vitest and the nested exit-2 path without a red forcing them; pin mixed into red 5466d6f.
10. [nit] DESIGN.md:47 says green/refactor refused without DB; red too.

## Deep-module assessment
`suite.run(root) -> Run` narrow and deep (weak: `ran`/`empty`, growing string heuristics). protocol deep and small. tdd-step thin CLI. No fixture special-casing; no verifier gaming beyond unpinned guards.

VERDICT: FAIL
