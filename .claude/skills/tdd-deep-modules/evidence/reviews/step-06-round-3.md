# Review: Stage 2 step 2, `depth_report`, round 3 (commit 8fcac4f)

Reviewer report (content as returned, condensed formatting).

## Summary
FAIL on one new major: a guard such as `if (cache.has(key)) { return cache.get(key); }` is reported as "pass-through: has", a false finding naming a function that does not exist. Everything else holds: each new red fails on an assertion for the right reason; greens, refactor and pin pass (25 tests OK); round-2 adversarial inputs correct; fixture numbers correct by hand; no crashes and no false pass-throughs on Dwello; depth.py deep, CLI thin. Mutation testing shows the "untested green code" minor is back and wider.

## Commands
- Replay: a862695 red, 3523930 green, 9456f4d red, ab8e635 green, 8ada451 red, 82b594b green, 7aa1cba refactor (behaviour kept), d5287c8 pin: all as expected.
- Fixtures: deep 2/34/17.0/dup 1; shallow 14/22/1.6, 4 pass-throughs; bloated 27, unused 3, dup 6; cb.ts 12. Correct.
- Round-2 inputs: chained/operated/ternary bodies and groupIban no pass-through; typed function before an arrow forward gives `m`; callback types, multiple declarators, `let` before an arrow counted right.
- New inputs: regex and template literals fine; unbalanced brackets no crash; swapped/compared arguments not pass-throughs; brackets inside strings and `a = 1 < 2` defaults miscounted (first documented, second not).
- Performance: 100k lines 10.6 s in `_pass_through` (quadratic slicing); Dwello 75 files 6.5 s; 483 files 45 s, no crash.
- Mutations survived: keyword exclusion, `_expression_end` stops, function head `[^{};=\n]` → `[^{}\n]`, `_statement_end` depth, the `=>` exceptions in `_skip_type_parameters` and `_split` (cb test errors cancel out), `_names(params) and`, the end anchor (equivalent mutant), arrow return type, type parameters in `_FUNCTION`.

## Round-2 findings
- [major] arrow without end anchor: fixed.
- [minor] untested green code: round-2 items pinned; new greens add new untested code.
- [minor] parameter counting: fixed. [nit] block/generic arrow forwards: fixed.

## New findings
- **[major] depth.py:106-107, 115-131** `_FUNCTION` matches call sites; a call in an `if`/`while` condition followed by a forwarding body is reported as a pass-through function (`has`, `isValid`, `more`). Not a documented limit; contradicts DESIGN.md. Fix: accept headers only where a declaration can start; red with the guards.
- [minor] untested green code (list above); `cb.ts` cannot catch `_split`'s `=>` handling.
- [minor] `<` counts as a bracket in `_split` (`a = 1 < 2` default).
- [nit] quadratic slicing in `_pass_through`; `_tests` re-reads the repository per module.

VERDICT: FAIL
