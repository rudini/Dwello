# Response to step 10 (doubles and depth rules in SKILL.md), round 3

Round 4 granted by the user after three failed rounds.

- [major] `:`/`;` prefixes: red/green "colon and semicolon prefixes" (f3d857d, 57d2b8b): a statement starts only right after the label or after a period (`(?:^|[.])\s+`); the red's cases are "Myth:", "Rarely true;", "Not true:", "Wrong:".
- [minor] indented sub-item: red/green "rule item at column 0" (dcfccb7, 7a90cb4): the item holding the statements must be a top-level list item. The `ITEMS` check for hard rules 1-5 keeps its old anchor (documented).
- [minor] DESIGN.md "starting a sentence": now says right after the label or after a period, top-level item.
- [nit] hard-wrapping and rewording fail the lint: in DESIGN.md Known limits.
