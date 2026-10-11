# Review: Stage 2 step 2, `depth_report`, round 2 (commit c805a8e)

Reviewer report (content as returned, condensed formatting).

## Summary
TDD history holds: every new red fails on an assertion for the right reason, every green and refactor passes; 20 tests OK; fixture numbers right by hand. Every round-1 finding fixed or documented. depth.py stays deep, CLI thin. But the round-1 arrow pass-through fix introduced a correctness bug: the arrow branch of `_FORWARD` does not require the forwarded call to be the whole expression, so any arrow body that starts with `f(own params)` is a pass-through. On Dwello the only pass-through finding (`groupIban`, `compact(iban).replace(...)`) is a false positive; the branch can also report the wrong name. Major, as round 1 treated false findings.

## Commands
- Tests at c805a8e: 20 OK. Replay 8df1787..4076666: reds fail on the new behaviour, greens/refactor 897fe84/pin f3e991c OK.
- Hand checks: deep 34/2/17.0/dup 1; shallow 22/14/1.6, 4 pass-throughs; bloated 27, unused 3, dup 6; ledger 15, shape 11, wrapped 6.
- Mutations: many killed; survived: `"["` in the duplicate exclusion, `async`/`function` in the name-only fallback, `(?::[^=]+)?` and `(?:async\s*)?` in the arrow forward pattern.
- Dwello run: documents.ts surface 3, no classitis in error-handler.ts, plausible shallow/untested findings; duplicate bloat in 23 of 46 modules (documented); `pass-through: groupIban` false.

## Round-1 findings
All fixed or documented; the arrow fix brought the major below; untested-green pattern repeats.

## New findings
- **[major] depth.py:109** arrow branch has no end anchor (`trim(s).toUpperCase()`, `count(n) + 1`, `count(n) > 0 ? ...` counted) and a cross-line type pattern (`[^=]+`) that can name the wrong function. Fix: require the call to end the expression; keep the type annotation on one line; reds.
- [minor] untested green code: `async|function` in the fallback, `"["` in `_duplicate`, `(?::[^=]+)?` and `(?:async\s*)?` in the arrow pattern.
- [minor] depth.py:94 parameter counting: callback types end the list at the first `)`; `export const x = 1, y = 2;` counts 1; `export let x: number;` borrows a later arrow's parameters through the cross-line `[^=]+`.
- [nit] block-body arrow pass-throughs and generic arrows not detected.

VERDICT: FAIL
