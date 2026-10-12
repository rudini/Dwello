# i18n step 1 – review 2

Scope: fixes of round 1 (commit 49f992a) and the new screen-language check. Fresh read-only reviewer. Result: 0 blockers, 0 majors; round-1 findings confirmed fixed.

| # | Severity | Finding | Done |
|---|---|---|---|
| 1 | Minor | Backdrop close and frameless `<nav>` without tests | Tests in `language-switcher.dom.test.ts` (click beside closes; `nav[aria-label="Sprachwahl"]`) |
| 2 | Minor | No axe state for the open language menu | `language-menu-open` (dashboard) in `screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`; passes axe in all views |
| 3 | Minor | `other-language` rows checked French three times, labelled it/en | That state is checked in French only |
| 4 | Minor | Detection misses German words not yet in `de.json` (single-word buttons) | Words with ä, ö, ü, ß are flagged too; remaining gap: an umlaut-free German word that no German message contains. Mitigated by reviewers per step |
| 5 | Minor | `cutOff` ignores ellipsis truncation, visible spill and table regions | Kept: ellipsis is deliberate for user data (e.g. the user name); sideways scrolling of the page is checked; noted here |
| 6 | Nit | Cookie added for both ports though cookies ignore ports | Kept (harmless) |
| 7 | Nit | en «Language choice»; it «non trovato» masculine; net-rent synonym dropped | «Language selection»; the other two kept (colon form; synonym was the same word in fr/it/en) |
| 8 | Nit | Duplicated helpers (messages reader, examples parser) | Kept; small and test-only |

Step 1 closed: no open blocker or major.
