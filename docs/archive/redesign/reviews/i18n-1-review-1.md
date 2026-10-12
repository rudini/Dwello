# i18n step 1 – review 1

Scope: commit cf310c0 (Paraglide setup, language switcher, frame, `src/lib/ui`, login, error, help, privacy, terms). Independent read-only reviewer, fresh context. Result: 0 blockers, 1 major, 8 minors.

## Findings and what was done

| # | Severity | Finding | Done |
|---|---|---|---|
| 1 | Major | `Button.svelte:79` «(öffnet in neuem Tab)» still German (screen reader text of every link button opening a tab) | Verified; `ui_opens_new_tab` in all four files, test `ui-i18n.dom.test.ts` (failed first) |
| 2 | Minor | `fetchRecord` callers outside step 1 still pass German record names | Planned: each area's step passes `m.*()` |
| 3 | Minor | Header at 390 px fits with ~7 px to spare | Proved per screen by the 390 px check of `sprachen-bildschirme.feature`; noted in `offene-punkte.md` |
| 4 | Minor | Language row on frameless pages: login scrolls ~64 px; row outside any landmark | Row is now a `<nav>` «Sprachwahl»; scroll noted in `offene-punkte.md` |
| 5 | Minor | Menu closes only on focus loss (Safari/Firefox do not focus on click) | Backdrop button as in the user menu |
| 6 | Minor | Scenario «auch wenn der Browser Englisch will» ran with de-CH | New step sets `Accept-Language: en-GB` |
| 7 | Minor | Privacy page names only two cookies | `offene-punkte.md` (German wording must stay) |
| 8 | Minor | Translations: circular «Nettomiete» explanation, it «Non è riuscito», it «nessun risultato», en double «until», redundant «rappel de paiement ou un rappel» | Fixed the first four; the last is a term question in `offene-punkte.md` |
| 9 | Minor | Format-only changes (`terms/+page.server.ts`, `DateInput.svelte`); Paraglide options repeated three times | Format-only changes reverted; repetition noted |

Deliberately not changed: the German wording of every moved text (verified identical by the reviewer).
