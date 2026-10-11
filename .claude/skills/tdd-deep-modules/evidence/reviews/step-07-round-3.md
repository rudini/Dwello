# Review: Stage 2 step 3 (`skill_lint`), round 3 (commit c53d4b2)

Reviewer report (content as returned, condensed formatting).

## Summary
PASS. The round-2 major (N1) is fixed: a "Do not"/"Never" in front of any bold list item fails lint (hard rules, Design It Twice, Red/Green/Refactor, depth check, design note) through `lint.ITEMS` (`^\s*(?:-|\d+\.)\s+\*\*label\*\*`). Every other round-2 finding is fixed or reasonably answered. The real skill lints OK, 22 tests pass, the four red/green pairs replay as expected. Remaining passing edits are contradictions in another sentence, one-word changes to plain sentences, qualifiers after a bold label, and one hook bypass; the first two are the documented limit (DESIGN.md:116), the hook is not a listed required element; none is major under the calibration.

## Commands
- `scripts/skill_lint` → OK; `tests.test_skill_lint` → 22 OK.
- Replay: 695c19c red (test only) / 2cfbe89 green; 81705eb red / 466e13f green; b4b9b43 red (5 assertion failures incl. traceback catches) / c5d4bf5 green; ad590d2 red / b7636de green.
- Mutants caught: negation before or inside each bold item, "Prefer classitis. **No classitis.**", "In some refactor phases". Still passing: contradictions in other sentences, plain-text edits, qualifiers after a bold label.
- Code mutants killed: `re.MULTILINE`, framing phrases, sh/bash unwrapping, `len(words) == 1`, guard path, `except ValueError`, `isinstance(entries, list)`, `isinstance(entry, dict)`, `~~~`, HTML comments, `\d+\.`. Survived: line anchor of the item regex, `.endswith` → `in`, `isinstance(front.get("hooks"), dict)`, fence back-reference (near-equivalent).
- Probes: CRLF OK; empty file, `name: [a]`, integer matcher, list command reported without traceback; `':||…/tdd-guard'` lints OK; `* `, `1)`, `***x***` rejected; `exec`, `bash -c` rejected.
- Evals: 12 entries, 12/12 with 3 runs, consistent with README and TESTLIST.

## Status of round-2 findings
N1 fixed; N2 fixed (prefix negation of plain text is the documented limit); N3 fixed; N4 fixed (`.endswith` unpinned, N9); N5, N6, N7 fixed.

## New findings
- N8 [minor] the line anchor of the item regex is untested (negation before the bold).
- N9 [minor] `.endswith(guard)` unpinned (`tdd-guard.off`).
- N10 [minor] `':||…/tdd-guard'` (operator without spaces) lints OK.
- N11 [minor] `*`/`+` bullets, `1)` numbering, `***label***` rejected with a misleading message.
- N12 [minor] qualifiers after a label without terminal punctuation weaken an item; document or end labels with a period.
- N13 [nit] `isinstance(front.get("hooks"), dict)` unpinned.
- N14 [nit] DESIGN.md "Skill lint" paragraph does not mention `lint.ITEMS`; ITEMS and REQUIRED overlap.

No blocker or major findings.

VERDICT: PASS
