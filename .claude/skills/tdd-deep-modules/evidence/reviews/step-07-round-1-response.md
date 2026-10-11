# Response to step 07 (skill_lint), round 1

- [major] elements pinned by keywords only: red "inverted elements" (Prefer classitis, Add pass-through wrappers, Split by size alone, Cumbersome tests are fine, Compare them by line count; Pull complexity downward already caught), green: `REQUIRED` also holds the element phrases with their negation ("no classitis", "no pass-through wrappers", "do not split by size alone", "cumbersome tests signal a wrong interface", "compare them by depth"). The keywords stay, so the older test that removes "classitis" entirely is unchanged.
- [minor] references: red/green "references linked": the three reference files must be linked from SKILL.md.
- [minor] hook check: red/green "hook rules": no, an empty or a `*` matcher matches every tool; only `type: command` hooks count; the command's program (first shell word) must end in `scripts/tdd-guard`, so `echo scripts/tdd-guard` and `type: prompt` fail.
- [minor] non-string frontmatter: red/green "frontmatter types": a list or number description is "must be text"; `name: 123` is "not kebab-case".
- [minor, TDD] refactor a01913c adding `re.error` handling: acknowledged; it is pinned (step-07-pins.txt, KILLED).
- [minor] eval set: two TDD-on-another-stack near misses added (Django/pytest, Rust/cargo); re-run with 3 runs per prompt, serial: 12 of 12 passed (`evals/trigger-result.json`).
- [nit] CRLF claim in DESIGN.md corrected. BOM: red/green, now named ("starts with a byte order mark"). Fenced headings: red/green, code blocks are removed before sections are read. Duplicate keys: red/green, named. Unreadable SKILL.md: not testable as root (the container runs as root, a skipped test would break the bare-OK suite rule); documented as a known limit.
