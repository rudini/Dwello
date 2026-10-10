# Test list

One behavior per red-green(-refactor) cycle. Tests drive the public CLIs only.

## Step 1: `tdd-step <test|red|green|refactor> [message]`

- [ ] red with an assertion failure commits `red: <message>` with trailers `TDD-Phase: red` and `TDD-Exit-Code: <real exit code>`
- [ ] red is refused (exit 1, no commit) when the suite passes
- [ ] red is refused when the failure is an import error
- [ ] red is refused when the failure is a syntax error
- [ ] red is refused when a test errors with a non-assertion exception
- [ ] red is refused when a production file changed
- [ ] green is refused while any test fails; commits with `TDD-Exit-Code: 0` when all pass
- [ ] refactor is refused while any test fails; commits when all pass
- [ ] test (test list) commits; refused when production or test code changed
- [ ] phase order: green only after red, refactor only after green/refactor, red not after red
- [ ] the commit contains the whole working tree that was tested (untracked files too)
- [ ] no supported test framework detected -> exit 2, no commit
- [ ] unknown phase -> exit 2
- [ ] vitest projects: assertion failure is red; load error is refused; all passing is green
