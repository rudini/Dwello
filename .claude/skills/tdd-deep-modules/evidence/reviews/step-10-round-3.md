# Review: Stage 2b step 10 (doubles and depth rules in SKILL.md), round 3 (commit 6bc6ebc)

Reviewer report (content as returned, condensed formatting).

## Summary
Whole suite 226 OK; `skill_lint` OK; SKILL.md 98 lines; hard rules 6 (doubles), 4 (test boundary, helpers) and the swarm item are at the top, short and correct. Red 09afa54 changes only test_skill_lint.py and fails 10 subtests for the right reason; green 07322f7 changes only lint.py, whole suite passes. All ten round-2 attacks are caught.

FAIL: `_statements` treats `:` and `;` as a sentence start, so a qualifier or inversion ending in a colon or semicolon in front of a required statement still lints OK ("Myth: Every fake ...", "Not true: The test boundary ...", "Rarely true; No mocks ...", "In theory; Wrap ...", "Obsolete: Pure helper ...", "Wrong: A functional core ..."). DESIGN.md says such an inversion is named. Narrowing the anchor to `(?:^|[.])` catches all six and SKILL.md still lints OK (tried in the reviewer's clone only).

## Commands
- HEAD: 226 OK; `skill_lint` OK; SKILL.md 98 lines. 09afa54 only test_skill_lint.py (+39); 07322f7 only lint.py (+36); 6bc6ebc only DESIGN.md, TESTLIST.md, the response.
- Red replay: 10 failures (9 `0 != 1 : skill_lint: OK`, "never wrap" lacks "lacks the statement:"). Green replay: 226 OK.
- 22 lint mutations: caught: not every fake, not many mocks, double anything, dropped contract sentence, strike-through, HTML comment, `~~` before the label, gutted duplicate item, trailing parenthetical. Pass: colon/semicolon prefixes (Myth:, Outdated advice, ignore it:, Rarely true;, Not true:, Obsolete:, Wrong:, If you like:, In theory;), a contradicting trailing sentence (documented), rule 6 nested under "6. **Optional extras, skip when busy:**". Rejected legitimate rewordings: hard-wrapped line, two sentences instead of one, "such as" to "e.g.".

## Round-2 findings
- [major] inverted statements: partly fixed (ten attacks named; `:`/`;` prefixes pass).
- [minor] overstated coverage: fixed. [nit] DESIGN.md limit: fixed in wording, but claims more than the code does.

## New findings
- **[major]** lint.py:164 — the anchor `(?:^|[.:;])\s+` lets a statement start after any colon or semicolon; colon/semicolon prefixes invert a statement and lint OK, contrary to DESIGN.md:140. Fix: `(?:^|[.])\s+`; red subtests for a `:` and a `;` prefix.
- **[minor]** lint.py:160 and `ITEMS` — `^\s*` accepts an indented item, so rule 6 can be demoted to a sub-item; same gap as hard rules 1-5. Fix: column 0, or document.
- **[minor]** DESIGN.md:80 — "starting a sentence" does not say `:` and `;` count as sentence starts.
- **[nit]** DESIGN.md:140 — statements may not be hard-wrapped or reworded; add to Known limits.

VERDICT: FAIL
