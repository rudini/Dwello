# Response to step 06 (depth_report), round 1

- [major] wrapped or generic signatures dropped: red "wrapped signatures" (surface 6 for a wrapped and a generic export), green: exports are matched from each `export` to the end of its parameter list across lines, type parameters allowed, `function` added to the name-only fallback.
- [major] comments read as code: red "comments ignored" (doc comment with "class ... {", commented-out wrappers and helpers), green: block and line comments are removed once and every metric reads the result; refactor dropped the now redundant `//` checks.
- [minor] pass-through misses arrow bodies and `return await`: red/green "arrow pass-through".
- [minor] duplicate noise: red/green "literal members" (lines ending in `,`, `({` or `[` do not count). Re-run on Dwello: bloat findings remain where query fragments repeat (`.from(table)`, `const today = ...` four times); documented as prompts, not verdicts.
- [minor] classitis on error hierarchies: red/green "error classes" (classes without methods do not count).
- [minor] untested green behaviour: pinned in one test (enum, declare, abstract class with a getter, `export *`, let, var, generator, async arrow, non-UTF-8 input, dynamic import, untracked test file); `evidence/mutations/step-06-round-1-pins.txt`, 6/6 KILLED.
- [minor] test boundary: `require()` counts (red/green); symlinked names documented as a known limit.
- [nit] function expressions: red/green "function expressions". Directory: red/green "directory message" ("not a file"). Export-free file: documented (ratio = size).
