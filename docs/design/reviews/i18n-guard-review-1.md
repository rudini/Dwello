# i18n guard against German texts in code (commit 39895f2), review 1

Scope: `src/__tests__/no-german-in-code.test.ts`, the proof for «no hard-coded UI text remains».

The reviewer's own sweep of `src` (all quoted strings, multi-line text nodes, `<svelte:head>` titles, common UI words) found no hard-coded German UI text on a production screen.

| # | Severity | Finding | Verified | Handling |
|---|----------|---------|----------|----------|
| 1 | major | Strings inside markup `{…}` expressions were not checked. | Yes. | Fixed: every quoted string of the file is checked, in scripts and markup; self-test added. |
| 2 | major | Component props (`label=`, `help=`, …) and single-quoted attributes were not checked. | Yes. | Fixed with 1. |
| 3 | minor | The allowlisted `abrechnung` is the download's file name, which users see. | Yes; already an open point (file name stays German). | Allowlist comment says so. |
| 4 | minor | The UI gallery (dev only) showed a hard-coded «Keller». | Yes. | Fixed: uses `m.tenants_example_last_name()`. |
| 5 | minor | German words that also occur in `en.json`, or not in `de.json`, pass. | Yes; e.g. the category form's example «Treppenhausreinigung», German on purpose because the field holds the German name. | Kept: the reviewer's manual sweep found no real case; the E2E check of every screen in fr/it/en covers what is shown. |
| 6 | minor | A string containing « //» loses the rest of its line to the comment filter. | Yes. | Kept: no such UI string exists. |
| 7 | minor | Multi-line template strings were not checked. | Yes. | Fixed with 1. |

Fixes checked in review 2 (`i18n-guard-review-2.md`).
