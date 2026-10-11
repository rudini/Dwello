# Step 01, round 2: response to findings

| Finding | Severity | Fix (red -> green commits) |
|---|---|---|
| Mixed repos run only vitest | major | ee99c2b -> 08c0404 run every detected framework and combine; d9b1450 -> e824729 a framework that found no tests is left out when another has tests (keeps Dwello working: verified `suite.run` on Dwello root -> `0 of 1300 tests failed`, ran=1300). The skill's own Python tests are not root-discoverable; documented in DESIGN.md. |
| Plain pytest / setup.cfg / tox.ini | minor | 36f884d -> a15426f config markers; 3ef35b2 -> 4c2e672 module-level `def test` detection; cdb0a75 -> 5b25fa4 deleted tracked files |
| Green empties suite via config | minor | 2db25cb -> cc95720 no-tests pass is error; 1eb0481 -> b88d3bf skipped tests do not count (unittest, pytest, vitest); 97c99ac -> 846212f conftest.py / vitest.config.* are test code |
| vitest unhandled errors | minor | fead9ed -> c3d1148 |
| pytest DID NOT RAISE / pytest.fail refused | minor | c006936 -> ac8107c |
| Crashes: non-UTF-8, package.json shapes | minor | 9dae693 -> fddcd51; e2f0c40 -> c53b038 |
| Commit differs from tested tree | minor | c434f10 -> 07e4bb0 refuse when the test run changed the working tree (tree snapshot before/after via a temporary index). Gitignored inputs: documented limit; replay runs clean checkouts. |
| Surviving mutations (-uall, .spec., test dirs) | minor | 220fb95 pins, evidence/mutations/step-01-round-2-pins.txt (4/4 killed); f00c75c removed the redundant `no:cacheprovider` flag (its mutant survived because `.pytest_cache` ignores itself) |
| TESTLIST not updated | nit | updated with both review rounds |
| 3344ab9 message change | nit | acknowledged |
| sys.executable / missing pytest / subTest counting | nit | documented in DESIGN.md "Known limits" |
| `outcome` bare string, `failed` semantics per framework | assessment | kept; `failed` is only read when outcome is "fail", where it means failing tests in every framework |
