# i18n follow-up (commit 3bea241), review 1

Scope: public help, privacy and terms pages; public `GET /api/v1/invoices/llm-recipient`; arrow keys in the language switcher; heating profile label without «(100%)» in fr/it/en.

| # | Severity | Finding | Verified | Handling |
|---|----------|---------|----------|----------|
| 1 | major | Signed out, `/help`, `/privacy` and `/terms` render in the frameless layout without side margins: text touches the screen edge at 390 px. | Yes: the frameless `<main>` had no padding. Reproduced by `src/__tests__/public-pages-layout.dom.test.ts` (red first). | Fixed: `src/routes/+layout.svelte` gives these three pages the same margins and max width as inside the frame. |
| 2 | minor | `docs/api-specification.md` still says all endpoints except `/health` and `/swagger` need a token; `/llm-recipient` is now public. | Yes. | Fixed: base path line names the public endpoint. |
| 3 | minor | `src/routes/login/+page.svelte` not formatted by Prettier after adding the test id. | Yes. | Fixed with Prettier. |
| 4 | minor | `public-pages.test.ts` checks only one protected path; near misses (`/help/x`, `/privacy-foo`, `/terms/`) are not covered. | Yes. | Fixed: table test over five protected paths. |
| 5 | note | ArrowUp on the closed switcher opens on the current language, not on the last one. | Yes, by design (one rule for all keys from the closed button). | Kept; no change. |

Fixes checked in review 2 (`i18n-follow-up-review-2.md`).
