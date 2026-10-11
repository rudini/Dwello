# Review: Stage 2 step 2, `depth_report`, round 4 (commit afdf3f2)

Extra round granted by the user after three failed rounds. Reviewer report (content as returned, condensed formatting).

## Summary
No blocker or major. Every round-3 finding fixed or reasonably answered. Replay: each red fails on an assertion for the right reason, each green and refactor passes (28 tests OK). Pin log 12/12 KILLED. Fixture numbers unchanged and correct. Round-3 guard inputs no longer reported. Dwello: 479 files in 1.7 s (was 45 s), no crash, two genuine pass-throughs. depth.py deep (one entry point `measure`), CLI 32 lines of formatting. Remaining: a narrow multi-line-condition variant of the round-3 false finding, under-counted class-method parameters, a quadratic `_unused`, some untested green code; all minor.

## Commands
- Replay: 8fcac4f 25 OK; 444e001 red (`pass-through: has, more, has`); 1d8469c green 26 OK; 63d9543 red (`surface 2`); 1af2ded green 27 OK; ede3b45 pin 28 OK; 2beeaab, 50ebeb1 refactors 28 OK, behaviour kept.
- Pin log replayed on ede3b45: 12/12 KILLED.
- Fixtures: deep 2/34/dup 1; shallow 14/22, 4 pass-throughs, classitis Cleaner, Converter; bloated 2/27, unused 3, dup 6.
- Dwello: 479 files, 1.7 s, no stderr; pass-throughs only in two test files (genuine); no classitis; `openplz.ts` surface 26 hand-counted.
- Round-3 inputs: `cache.has`, `isValid`, `while`, `else if`, `switch`, `catch`, a line-broken `if (` → no pass-through.
- Common idioms correct: decorated methods, object-literal methods, `export default { async load(...) }`, async generators, abstract classes, JSX/TSX, describe/it tests, CRLF; empty, lone `export` and unbalanced input do not crash.

## Round-3 findings
[major] calls in conditions: fixed. [minor] untested green code: answered (12 survivors killed). [minor] `<`: fixed. [nit] slicing: fixed. [nit] `_tests`: fixed.

## New findings
- [minor] depth.py:106-110 a condition continued on the next line after a trailing operator (`if (!ready ||\n isStale(id)) { return refresh(id); }`) still names `isStale`; formatters never produce it; the comment and TESTLIST overclaim.
- [minor] depth.py:257-258 class-method parameters not counted by their brackets (callback types, decorators); `class C<T extends { id: string }>` gets no methods.
- [minor] depth.py:310-315 `_unused` is quadratic (4000 declarations 37 s).
- [minor] untested green code: `async|get|set` method modifiers, parts of the keyword exclusion, `or before == "_"`.
- [minor, documented] inline function types with `=`.
- [nit] `export type { A, B }` counts 1; BOM hides the first export; overloads count each; `this:` counts; some forwards not reported (misses, not false findings).

VERDICT: PASS
