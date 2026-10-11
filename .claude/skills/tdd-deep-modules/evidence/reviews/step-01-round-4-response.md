# Step 01, round 4: response to findings

| Finding | Severity | Fix |
|---|---|---|
| vitest `.resolves`/`.rejects` refused as red | major | c65a39b -> 4cc8a92: an `Error:` whose first stack frame is `at _Assertion.` counts as an assertion |
| Dwello backend `bun test` never runs | major | 50540a2 -> 1dff965: every tracked package.json runs (vitest or the `bun test` segment of `scripts.test`, in its directory); 97d590e -> 870747f bun failures classified by JUnit type; 5466d6f -> 021bdf9 a bun run without a report is an error and is never dropped; 5466d6f also pins that an unsupported nested test script exits 2. On Dwello here: vitest 1300 pass, bun cannot run without PostgreSQL -> outcome error (documented). |
| `pytest.toml`, `.pytest.ini`, `package.json` | minor | 11f62f6 -> 4bb221b (test setup corrected in the green commit, re-checked against the old protocol) |
| no-report pytest with exit 0 counted as pass | minor | 727770d -> 409a62d (summary now shows pytest's stderr) |
| unpinned guards | minor | ea4d9b4 pins: `^Vitest caught` anchor, vitest load-error/no-report not dropped, `numTodoTests`, bun/pytest no-report; evidence/mutations/step-01-round-4-pins.txt (6/7 killed; the survivor differs only when bun exits 0 without a report). 8f3b197 removed the equivalent `exit_code == 1 and` guard. `"Failed: "` vs `"Failed"` and `UnicodeDecodeError` vs `ValueError` are equivalent mutants. |
| combined `Run.empty` unread | nit | kept: `run()` returns a Run whose fields mean the same for combined and single runs |
| unhelpful summaries | nit | pytest no-report summary improved; bun summary for a crashed preload still reads `0 of 0 tests failed` |
