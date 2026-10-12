# Review: Stage 2b step 11 (helper swarm in depth_report), round 4 (commit 71bdf39)

Round granted by the user after three failed rounds. Reviewer report (content as returned, condensed formatting).

## Summary
The round-3 major is fixed: the "no other production file names it" check reads every file `protocol.is_production` accepts, so `.svelte` and `.vue` components count as callers (`.py` and config `.js`/`.mjs` files are read too). Red 30fc807 adds one test and fails on its new assertion for the right reason; green f923fad changes only `tddcore/depth.py` (2 lines) and the whole suite passes; HEAD 236 OK. On Dwello, `depth_report` over 78 modules gives one classitis hit, `calculation.service.ts`, which is correct; `floorLabel` and `getXsrfTokenFromCookie` are no longer counted. Only nits remain.

## Commands
- Clone at HEAD: 236 OK.
- Red worktree 30fc807 (`-p test_depth_report.py`): 38 tests, 1 failure, `test_a_helper_a_svelte_component_uses_is_no_member` (`classitis: exported helpers with one caller: formatChf, formatDate, formatArea`). Right reason.
- Green f923fad: only `tddcore/depth.py`; whole suite 236 OK (with the node_modules symlink).
- depth_report over 78 Dwello modules: 1.2 s, only `calculation.service.ts` (each helper has one caller inside, none elsewhere). Probe: only single under-threshold candidates elsewhere; production set 384 files (`.js .mjs .py .svelte .ts`).
- Known-bad (`swarm.ts.txt`) flagged and known-good (`deep.ts.txt`) passing at red-parent, green and HEAD.

## Round-3 findings
- [major] `.svelte`/`.vue` callers invisible: fixed.
- [minor] rare return-type forms: answered (Known limits), proportionate.
- [nit] pin commit with docs: acknowledged. [nit] TESTLIST "over 10 lines": fixed.

## New findings
- **[nit]** depth.py:381 — `_other_production_code` docstring still says "TypeScript/JavaScript"; the comment at :391 leaves out `.py`.
- **[nit]** depth.py:391 — Python files are read without stripping `#` comments; negligible (can only hide, Python cannot call a TS helper); limit the suffixes or name it in Known limits.
- **[nit]** comment markers inside `.svelte` script strings: covered by the existing known limit.
- Remaining Known limits proportionate; docs match the code.

VERDICT: PASS
