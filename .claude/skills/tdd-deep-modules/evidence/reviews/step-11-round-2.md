# Review: Stage 2b step 11 (helper swarm in depth_report), round 2 (commit 21dde7a)

Reviewer report (content as returned, condensed formatting).

## Summary
The TDD process holds: all four round-2 reds fail on an assertion for the stated reason; all four greens and the refactor change only production files and pass the whole suite. Whole suite at HEAD 228 OK. The `qr-bill.service.ts` false positive is gone; Dwello's only remaining hit, `calculation.service.ts` (calculateManagementFee, calculateTotalAdvancePayments, calculateBalance), is a correct swarm.

FAIL: `_body` takes the first `{` after the parameter list as the body, so for an object-literal return type (`): { fee: number } {`, `Promise<{ ... }>`, `Array<{ ... }>`) it measures the return type. That defeats the 20-line cap and the recursion fix in a common TypeScript form (27-line functions flagged as small helpers; recursive calls count as callers again), and DESIGN.md's "at most 20 code lines" is false for them. calculateManagementFee is measured right only by accident.

## Commands
- Clone at HEAD: 228 OK.
- Reds: 5abe04e, ee053bc, 94dd4e5, d105f5c each fail once for the right reason. Greens and refactor (whole suite): 9cf2619 224, 6faa22d 225, 7cbecc0 227, 6e87014 228, b2ea1d1 228 OK; greens touch only depth.py; b2ea1d1 touches depth_report and depth.py.
- depth_report over 78 Dwello modules: 1.0 s, one swarm hit (calculation.service.ts).
- Probes: `bigobj.ts` (three 27-line helpers with `): { v: number } {`) flagged; `rec.ts` (recursive `walk(): { v: number }`) not flagged; `comment.ts` (r1 named only in a `//` comment elsewhere) not flagged; `common.ts` (`round` declared locally in an unrelated file) not flagged; `zero.ts` (exports without production caller) not flagged; `arrowobj.ts`, `asyncp.ts` correctly flagged.

## Round-1 findings
- [major] qr-bill false positive: fixed. [major] DESIGN.md known-limit line: fixed (comments missing, below).
- [minor] export forms: answered. [minor] recursion: fixed for plain return types only. [minor] overloads: fixed. [minor] cap: fixed with 20 lines (not for object return types). [minor] CLI verdict: fixed. [nits]: answered.

## New findings
- **[major]** depth.py `_body` — `_FUNCTION_HEAD` stops at the first `{` after `)`, so an object-literal return type is taken as the body: the 20-line cap is skipped, a recursive helper counts its own call, DESIGN.md's claims are false for this form. Fix: skip a balanced type annotation before the body brace; red with an object-returning 21+ line helper and a recursive object-returning helper.
- **[minor]** depth.py `_production_code` — other files are read with their comments; a helper named only in a comment elsewhere drops out. Strip comments, or list under Known limits.
- **[minor]** `calls == 1` — an exported small function with no production caller at all is never counted (prorating.service.ts: two members only). Count `calls <= 1` or list under Known limits.
- **[minor]** the `elsewhere` check — an unrelated local function with the same name elsewhere hides a helper; add to Known limits.
- **[minor]** step-11-round-1-response.md — wrong hashes: twenty-line red is d105f5c (not 5da9ba1), refactor is b2ea1d1 (not b18ef23..).
- **[minor]** TESTLIST.md step 11 intro — still defines a member by callers inside the module only.
- **[nit]** test_helpers_up_to_twenty_lines_count_as_small uses 15 lines; any cap from 15 to 20 passes; use 20.
- **[nit]** `_EXPORTED_FUNCTION` — `export const x = (a + b) * c` reads as an arrow helper; require `=>` or note it.

VERDICT: FAIL
