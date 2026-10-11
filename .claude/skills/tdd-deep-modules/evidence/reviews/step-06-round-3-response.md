# Response to step 06 (depth_report), round 3

The user granted one more round after this third failed round.

- [major] calls in conditions read as function headers: red "calls in conditions" (`if (cache.has(key)) { return cache.get(key); }`, `while (more(key))`, `else if (has(key))`, and `if (ok) { return g(ok); }` for the keyword exclusion); green: a function header now starts only after `function` or, for a method, at the start of its line after optional modifiers (`public`, `static`, `async`, `get`, ...), never inside an expression.
- [minor] untested green code: one pin test with ten cases (arrow ends at a comma, at a line break, at a closing bracket; a statement before the brace; no parameters; arrow return type; generic function; arrow types in type parameters and in type arguments; a statement across lines). Mutation log `evidence/mutations/step-06-round-3-pins.txt`: 12/12 KILLED, covering every survivor the review listed (keyword exclusion, the three `_expression_end` stops, the function head, `_statement_end` depth, both `=>` exceptions, `_names(params) and`, the arrow return type, type parameters in `_FUNCTION`, and the new `<` rule).
- [minor] `<` counted as a bracket: red/green "comparison defaults": `_split` counts `<` as type arguments only right after a name and closes them only with an open `<`; `f(a = 1 < 2, b = 3, c: Map<string, number>)` gives 1 + 3. DESIGN.md names the remaining limit (`a<b` without a space).
- [nit] quadratic slicing: refactor "scans without slicing" matches compiled patterns at positions; 100k lines take 0.4 s in `_pass_through` (was 10.6 s) and 0.2 s in `_surface`.
- [nit] `_tests` per module: refactor "test imports read once" caches the repository's test imports per run; 300 Dwello modules take 1.4 s.
- The end anchor in `_forwarded_args` is an equivalent mutant (the review said so); kept as the explicit rule.
