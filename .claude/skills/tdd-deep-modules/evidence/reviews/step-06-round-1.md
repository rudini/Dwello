# Review: Stage 2 step 2, `depth_report` (round 1; c502b18..812788e)

Reviewer report (content as returned, condensed formatting).

## Summary
TDD history holds: every red fails on an assertion for the right reason, every green passes, both "red fix" commits are still red. Fixture numbers checked by hand: all right. CLI is thin; `depth.measure` is a deep single entry point. Failed on two correctness problems found on Dwello's own code: the surface undercount (wrapped parameter lists and type parameters drop whole exports; 78 of 278 exported functions in Dwello), and comments still read as code by four of six metrics (a class "for" from a doc comment in `error-handler.ts`).

## Commands run
- Replay of every commit: reds red on the expected assertion; greens and refactors (22faa3e, 62a84f4, fe611b7) pass; 12 tests OK at 812788e.
- Hand check: deep surface 2, size 34, ratio 17.0, duplicate 1; shallow surface 14, size 22, ratio 1.6, pass-through 4, classitis Cleaner, Converter; bloated surface 2, size 27, unused 3, duplicate 6; export forms 15. All correct.
- Adversarial: wrapped parameter list → surface 0; `<T>` → surface 0; commented-out wrappers reported as pass-throughs; arrow expression and `return await` forwards missed; function expressions not seen as unused; symlinked import and `require` not counted; `extends Error` classes counted as classitis. Robust on non-UTF-8, empty, huge, outside-cwd paths.
- Dwello run: `documents.ts` surface 0; `error-handler.ts` classitis "for, OAuthError, ..."; 27 of ~45 modules get a duplicate-line bloat finding (column lists).

## Findings
- **[major] depth.py:73-94** exported functions with wrapped parameter lists or type parameters are dropped from the surface. Fix: match across lines, allow `<...>`, add `function` to the fallback; tests.
- **[major] depth.py:43-48** comments are parsed by surface, classes, pass-through and unused; `//` comments never stripped. Fix: strip both once and pass the code to every metric; red test.
- [minor] pass-through misses arrow expression bodies and `return await`.
- [minor] duplicate-line bloat mostly noise (lines ending in `,`).
- [minor] classitis flags error hierarchies (classes without methods).
- [minor] greens added untested behaviour (`enum`, `declare`, `abstract`, `*`, `let|var`, async arrow, `function*`, `get|set`, `errors="replace"`, dynamic `import(`, untracked files).
- [minor] test boundary: `require` and symlinked names not counted.
- [nit] function expressions not seen as unused; directory reported as "no such file"; export-free file "shallow: ratio 0.0".

## Design
`measure` is one deep call; `_findings` keeps the rules in one place; no pass-through helpers. Smell: comments stripped once but used by only two metrics.

VERDICT: FAIL
