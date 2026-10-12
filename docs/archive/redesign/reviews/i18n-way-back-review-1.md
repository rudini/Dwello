# i18n way back from signed-out pages (commit 45ed5bf), review 1

Scope: signed out, help, privacy and terms link to «Anmelden» and show the footer (persona Dr. Weber, `weber-i18n-2.md`).

| # | Severity | Finding | Verified | Handling |
|---|----------|---------|----------|----------|
| 1 | major | Only half of Dr. Weber's major was fixed: the sign-in page still did not link the privacy notice, yet the docs said «fixed». Her second rerun (`weber-i18n-3.md`) reported the same. | Yes: `login/+page.svelte` linked only the terms. | Fixed: every page without the app header shows the footer (privacy, terms); the sign-in card centres in the space above it (`flex-1` instead of `min-h-screen`). Test `public-pages-layout.dom.test.ts`, scenario «Den Datenschutz von der Anmeldeseite aus lesen». Docs corrected. |
| 2 | minor | The scenario «Die Nutzungsbedingungen von der Anmeldeseite aus lesen» was rewritten. | Yes. It was added in this work (3bea241); it now uses the existing title step of `authentication.steps.ts`, which waits, instead of a path check plus a title check. | Kept. |
| 3 | minor | The signed-out footer was not at the bottom on short pages. | Yes. | Fixed with finding 1 (column layout, `flex-1` main). |
| 4 | minor | The «Anmelden» link sits outside a landmark (axe `region`, a best-practice rule not in the WCAG tags run). | Yes. | Open point; a `header` would read as the app header to the existing checks. |
| 5 | minor | No test showed that the sign-in page does not link to itself. | Yes. | Fixed: the sign-in test checks there is no link to `/login`. |
| 6 | minor | «Décompte des charges», «Loyer supplémentaire», «66.7 %» are marked TODO(fachlich prüfen) only in `offene-punkte.md`. | Yes. | Kept: message files are JSON without comments; all translation TODOs of this work live in `offene-punkte.md`. |

Fixes checked in review 2 (`i18n-way-back-review-2.md`).
