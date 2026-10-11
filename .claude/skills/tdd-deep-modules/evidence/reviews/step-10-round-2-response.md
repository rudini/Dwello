# Response to step 10 (doubles and depth rules in SKILL.md), round 2

- [major] statements inverted inside their own sentence: red/green "statements on their item" (09afa54, 07322f7). `lint.STATEMENTS` holds each doubles, test-boundary and swarm statement as a whole sentence; it must stand on the line of its bold item (hard rule 4, hard rule 6, the swarm item), start a sentence (after the label, `.`, `:` or `;`) and end as written. The red's ten cases are the round-2 attacks that linted OK, including the rule body moved under "Optional tips".
- [minor] round-1 response overstated the covered attacks: TESTLIST.md (round 2 fixes) says which attacks each red covers.
- [nit] DESIGN.md known limit: now says a contradiction in another sentence of the same line (or elsewhere) still passes, and an inversion or qualifier inside a statement, or moving it off its item, is named.
