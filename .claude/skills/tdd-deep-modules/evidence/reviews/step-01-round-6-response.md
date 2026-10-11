# Step 01, round 6: response to findings

Decision by the user after round 6: narrow `tdd-step` to vitest and bun.

| Finding | Severity | Resolution |
|---|---|---|
| Trailer exit code 5 in Dwello (unittest over the skill's own scripts) | major | Python suites removed: 7e20b25 (test refactor: generic tests ported to bun/vitest fixtures, vitest fixture scoped like Dwello's config), 46b5c78 -> d418a45 (red/green: Python repos exit 2), df52531 refactor. Also 9877572 -> 1589a6b: a detected framework without tests is an error instead of being left out, so nothing is dropped any more and the trailer is the highest exit code of the frameworks that make up the outcome; 66f059f removed the `empty` field. |
| Red b47a943 after red b04e6ae | major (TDD) | Both commits belong to the "left-out framework" behaviour, which no longer exists: its tests were Python-based and were removed with the scope change (46b5c78). History is not rewritten. |
| bun error detection scans mixed output | minor | d5a0d2d -> 43859a7: only bun's closing summary block on stderr is read; evidence/mutations/step-01-round-7-pins.txt |
| `cd backend && bun test` loses the cd | minor | documented in DESIGN.md (the segment runs in the package.json directory) |
| `is_production` public but internal | nit | kept public for the PreToolUse hook (step 3) |
