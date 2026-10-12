# Review: Stage 2b step 10 (doubles and depth rules in SKILL.md), round 4 (commit ae137de)

Round granted by the user after three failed rounds. Reviewer report (content as returned, condensed formatting).

## Summary
No blocker or major issues. Whole suite at HEAD 235 OK; `skill_lint` OK; SKILL.md 98 lines. Requirement (2): hard rule 6 near the top carries every element (no mocks or spies of your own logic, real objects by default, the five boundaries, a contract test suite against both fake and real implementation, the project-owned adapter around `$app/*`, many mocks signal a wrongly cut interface). Requirement (3): hard rule 4 holds the test boundary and "no tests and no public exports" for pure helpers; the functional-core and swarm-is-classitis sentence is in the section 5 item. All four round-3 findings are fixed; the round-4 reds fail for the right reason. 31 lint mutations: everything caught except contradictions in a separate sentence or a duplicate item (documented), harmless rewordings, and qualifiers ending in an abbreviation or ellipsis period (minor).

## Commands
- Clone at HEAD: 235 OK; `skill_lint` OK; SKILL.md 98 lines.
- f3d857d red: only test_skill_lint.py (+20); 57d2b8b green: only lint.py (anchor `(?:^|[.])\s+`); dcfccb7 red: only test_skill_lint.py (+11); 7a90cb4 green: only lint.py (item at column 0); 020229c, ae137de docs.
- Red replay: f3d857d 4 subtest failures (colon, semicolon, boundary, swarm), each `0 != 1 : skill_lint: OK`; dcfccb7 1 failure, same. Green replay: 57d2b8b 234 OK; 7a90cb4 235 OK.
- 31 lint mutations; hard rule 1 nested as a sub-item passes, as DESIGN.md says.

## Round-3 findings
- [major] colon/semicolon prefixes: fixed (also dash and question-mark prefixes named).
- [minor] indented sub-item for STATEMENTS items: fixed (blockquoted rule 6 named too); `ITEMS` anchor documented.
- [minor] DESIGN.md "starting a sentence": fixed. [nit] hard-wrapping and rewording: in Known limits.

## New findings
- **[minor]** lint.py:164, DESIGN.md:143 — any period starts a sentence, so a qualifier ending in an abbreviation or ellipsis ("Optional, i.e. Every fake ...") passes; document it or tighten the anchor.
- **[minor]** lint.py:161 — only the first top-level item with the label is checked; a full copy of rule 6 placed earlier (`<div hidden>`) lets the real item be cut down; name duplicate labels or document.
- **[nit]** SKILL.md:83 — the swarm-is-classitis sentence is in section 5, not the hard rules; acceptable; optional pointer in hard rule 4.

VERDICT: PASS
