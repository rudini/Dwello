# i18n step 7 – review 1

Scope: commit 609f599 (configuration, gallery, reports, analytics, home, remaining `src/lib`; `@wip` removed from the screen language check). Independent read-only reviewer. Result: 0 blockers, 0 majors, 5 minors and one note. Verified: 212 new keys, 1215 keys in each file, German identical incl. reused keys, no module-level messages, `record` prop callers updated, month labels per UI language (German abbreviations unchanged), edit forms send the same fields, network-failure text now translated (acceptable), final search of all `src/lib` and `src/routes` found no German UI text left except the items below.

| # | Severity | Finding | Done |
|---|---|---|---|
| 1 | Minor | it «Predefinito» badge collides with «predefinito» = default | «Preimpostato/Preimpostata» |
| 2 | Minor | `hooks.server.ts` «Nicht angemeldet» literal (never shown: the code is translated) | English «Not signed in», like the BFF's other API texts; auth logic unchanged |
| 3 | Minor | «Winterthur» examples while the settings city example is translated | Kept: proper noun |
| 4 | Minor | Save toast on the category edit form names the German name field | Kept and noted in `offene-punkte.md` |
| 5 | Minor | fr/it gallery «n’a pas de fin du contrat» | «n’a pas de date de fin» / «non ha una data di fine», also in the contract help texts |
| 6 | Note | Chart month abbreviations depend on the runtime's CLDR data | Kept (aria-hidden; full names are read out) |

URL parameters `?ansehen`, `?schritt` and the PDF file name stay German (not screen text).
