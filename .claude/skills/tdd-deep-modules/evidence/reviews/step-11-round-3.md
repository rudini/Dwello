# Review: Stage 2b step 11 (helper swarm in depth_report), round 3 (commit 0e386e7)

Reviewer report (content as returned, condensed formatting).

## Summary
Round-3 TDD phases hold: reds ad1c605 and a91f061 fail on their new assertions for the stated reason; greens 801fea3 and 7a4a3df change only `tddcore/depth.py` and pass the whole suite; pin 47f4038 is real (cap 19 fails the 20-line test, cap 21 fails `test_only_small_exports_with_one_caller_count`). Whole suite at HEAD 230 OK. The round-2 major (object return type measured as the body) is fixed for the common forms.

FAIL on a finding no earlier round raised: the "no other production file names it" check reads only `.ts/.js` files (`_SOURCE`), so Svelte and Vue callers are invisible. A utility module whose exports Svelte components use is reported as "exported helpers with one caller". Reproduced with three formatters used once in their module and in a `.svelte` component; in Dwello `floorLabel` (`src/lib/apartment.ts`) and `getXsrfTokenFromCookie` (`src/lib/api.ts`) are already miscounted (neither module reaches the threshold yet). DESIGN.md says "no other production file", and DESIGN.md:40 counts `.svelte` and `.vue` as production files.

## Commands
- Clone at HEAD: 230 OK.
- Reds: ad1c605 fails `[long]` and `[recursive]` on `assertIn(", classitis no,")`; a91f061 fails its `assertIn`. Greens: 801fea3 229 OK, 7a4a3df 230 OK, 47f4038 230 OK; greens touch only depth.py.
- Pin mutations: cap 19 and cap 21 each fail a test.
- depth_report over 78 Dwello modules: 0.9 s, one hit `calculation.service.ts` (correct).
- Probes: lifting the cap adds only long functions (rightly excluded); adding `.svelte` files to "elsewhere" removes `floorLabel` and `getXsrfTokenFromCookie`.
- Return types correct: union of object types, `Promise<{...}[]>`, tuple, `(): () => void {`, `keyof`, string-literal union, `Record<string, {...}>`, multi-line object type, arrow helper with object return type, `=> ({ ... })`. Wrong: `(): (y) => { a: number } {`, conditional type with object branches, type predicate `x is { a: number }`.
- Comment markers inside strings (URLs, globs) can hide a call on the same line; covered by the existing known limit.

## Round-2 findings
- [major] object return type: fixed for common forms. [minor] comments elsewhere: fixed. [minor] no-caller exports, same-name functions: answered (Known limits). [minor] hashes, TESTLIST intro: fixed. [nit] twenty-line pin: fixed. [nit] bracketed `const`: answered.

## New findings
- **[major]** depth.py:391 (with `_SOURCE` at :318) — `.svelte` and `.vue` files are never read for the "elsewhere" check; component callers are invisible; DESIGN.md:76 and the TESTLIST intro are false by DESIGN.md:40's definition. Fix: red with a `.svelte` caller, then read all `protocol.is_production` code files.
- **[minor]** depth.py:168 `_skip_return_type` — type predicates with object types, function types returning object types and conditional types with object branches are measured as the body; list under Known limits or handle them.
- **[nit]** 47f4038 — the pin commit also carries DESIGN.md wording.
- **[nit]** TESTLIST.md:276 — "body over 10 lines" contradicts the 20-line cap; annotate.
- Known limits otherwise proportionate.

VERDICT: FAIL
