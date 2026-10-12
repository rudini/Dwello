# i18n guard against German texts in code (commit d91ad13), review 2

Scope: the fixes for review 1. Findings 1, 2 and 7 of review 1 are confirmed fixed (the former counterexamples are caught, German planted in real files is caught).

| # | Severity | Finding | Verified | Handling |
|---|----------|---------|----------|----------|
| 1 | major | A quote inside a regular expression literal (`src/lib/invoice.ts:25`, `src/lib/utils/format.ts:29`) puts the quote pairing out of step, so later strings in the file went unchecked; the allowlisted `null` in `invoice.ts` was a symptom. A lone apostrophe in markup text did the same. | Yes: German planted after those lines passed. | Fixed: regular expression literals are removed from code and plain text nodes from markup before strings are paired; the `null` entry is gone; self-test with both cases. German planted after the regexes in both real files now fails the guard. |
| 2 | minor | Comment and review 1 said «every quoted string». | Yes. | Fixed: wording names what is checked. |

Known limits of the guard (kept, review 1 rows 5 and 6): words that also occur in `en.json`, and a string containing « //». The E2E check of every screen in fr/it/en covers what is shown.

Fixes checked in review 3 (`i18n-guard-review-3.md`).
