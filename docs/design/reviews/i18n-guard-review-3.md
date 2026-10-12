# i18n guard against German texts in code (commit d6144cd), review 3

Scope: the fixes for review 2. The reviewer replaced each of the 6625 string literals, template parts and attribute texts in `src`, one at a time, with German and checked the guard catches it; invoice.ts and format.ts are confirmed fixed.

| # | Severity | Finding | Verified | Handling |
|---|----------|---------|----------|----------|
| 1 | major | `}` in the regex-literal prefix set mistook `${…}/` in template strings for a regex; `src/lib/server/heating-profile.ts` went out of step (German planted at its end passed), and template text after `${…}/` was skipped. Caused by the review-2 fix. | Yes. | Fixed: `}` removed; self-test with `` `${a}/${b}` ``. Each file's test now also plants a German string at the end of its code and markup and requires it to be found, so no file can go out of step unnoticed; with `}` put back, exactly `heating-profile.ts` fails. |
| 2 | minor | Removing plain text nodes also cuts a `{…}` holding both `>` and `<` (e.g. `{n > 1 ? '…' : n < 0}`). | Yes, in a constructed case; the reviewer's AST mutation found no such place in `src`. | Kept; known limit. |
| 3 | minor | In nested template literals the inner text is not checked (pairing recovers after it); five places, none with UI text. | Yes. | Kept; known limit. |
| 4 | minor | Review 2 implied the pairing was in step everywhere and missed limit 3. | Yes. | This file lists the limits. |

Known limits of the guard: words that also occur in `en.json` or not in `de.json`; a string containing « //»; text inside nested template literals; a `{…}` holding both `>` and `<`. What is shown on screen in fr/it/en is covered by `sprachen-bildschirme.feature`.

The user decided after this third round: no fourth review; the planted-string check proves the fix.
