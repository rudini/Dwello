# i18n step 5 – review 1

Scope: commit c6e200c (invoices, documents, `invoice.ts`, `server/invoice.ts`, `server/documents.ts`, `server/category.ts`). Independent read-only reviewer. Result: 0 blockers, 0 majors, 7 minors. Verified: 129 new German texts identical, «umlagefähig» per term table everywhere, master data names in the UI language on every invoice screen with only ids sent back, reminder titles localised with stored data unchanged, no module-level messages; 447 related unit tests green.

| # | Severity | Finding | Done |
|---|---|---|---|
| 1 | Minor | The feedback after sending a reminder still shows the stored German title | Handed to step 6 (statements), which owns `ReminderFeedback.svelte` |
| 2 | Minor | Two lines in `offene-punkte.md` outdated (reminder titles) | Corrected |
| 3 | Minor | Invoice edit page tolerates a failing categories call (empty selects) | Kept as decided: same as the new-invoice page; recorded in `offene-punkte.md` |
| 4 | Minor | Detail page makes two extra list calls | Kept: never rejects, a missing invoice still gives 404 |
| 5 | Minor | Format-only changes in `invoice.ts` and `invoices/new/+page.svelte` | Reverted |
| 6 | Minor | Suggestion mapping by id and name fallbacks not tested | Kept: fallback is `localName`'s, tested in step 2; noted |
| 7 | Minor | Masking regex in the screen check (ASCII `\b`) | Kept: can only cause a false positive, not hide UI text |

Step 5 closed after review 2.
