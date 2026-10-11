# Review: Stage 2b step 11 (helper swarm in depth_report), round 1 (commit 753e6f1)

Reviewer report (content as returned, condensed formatting).

## Summary
The TDD process holds: both reds fail on an assertion for the right reason, both greens change only production files and pass the whole suite, the pin's mutation kills it. The known-bad fixture is flagged, the known-good passes, SKILL.md and references/depth.md carry the requirement's wording.

FAIL: the rule counts callers inside the module only, so its only hit on Dwello is mostly wrong (`qr-bill.service.ts`: 3 of 4 named helpers are public functions other production modules call), and the new DESIGN.md known-limit line says the opposite of what the code does. It also misses `export { a, b, c }` lists, `export const f = function` and bare arrows, and wrongly flags recursion and overloads (overloads listed twice).

## Commands
- Clone at 753e6f1; whole suite 220 OK (169 s).
- Reds (depth tests): 19a9464 fails on `', classitis yes,' not found`; 7160962 fails on `', classitis no,' not found ... inc, dec, big`. Right reasons.
- Greens (whole suite): f9b2473 218 OK (depth_report, depth.py); 706ac1a 220 OK (depth.py).
- Pin 110f460 mutation `^(?:export\s+)?(?:async\s+)?function`: pin alone FAILED (failures=1); the depth file then fails 5 tests.
- Probes through `depth.measure` and a scan of 78 Dwello modules; `git grep` for production callers outside each module.

## Findings
- **[major]** depth.py:322-329 — public functions reported as a swarm: `qr-bill.service.ts` (`validateIBAN` used by config.service.ts:19, `isQRIBAN` and `statementQRReference` by statement-pdf.service.ts:11). Fix: count a helper only when no non-test file in the repository uses the name; at minimum say callers outside the module are not checked.
- **[major]** DESIGN.md:134 — the known-limit line says a helper called once inside and once outside is not counted; the code counts it.
- **[minor]** depth.py:316-318 — `export { a, b, c }`, `export const f = function (...)` and bare arrows (`x => ...`) are missed; resolve or list under Known limits.
- **[minor]** depth.py:326 — recursive functions look like one-caller helpers; ignore uses inside the function's own body.
- **[minor]** depth.py:324 — overload signatures count, and names are listed twice (`g, g, h, h`); de-duplicate, skip bodiless signatures.
- **[minor]** depth.py:36 — the 10-line cap misses a real swarm (`calculation.service.ts`: `calculateManagementFee`, `calculateTotalAdvancePayments` (~13 lines), `calculateBalance`, two tested directly); consider 15-20 lines or drop the cap once outside callers are checked.
- **[minor]** depth_report:24 — the CLI combines `classitis or swarm`; expose one verdict from `measure`.
- **[nit]** test_depth_report.py:406-414 — the pin repeats `test_a_deep_module_is_reported_deep`; say so or pin something new.
- **[nit]** depth.py:326 — property accesses and object keys (`obj.toRappen`) also hide a helper; add to known limits.

VERDICT: FAIL
