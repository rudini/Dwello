# i18n way back from signed-out pages (commit a725323), review 2

Scope: the fixes for review 1 (footer on every page without the app header, sign-in card centred above it, privacy link from the sign-in page).

| # | Severity | Finding | Verified | Handling |
|---|----------|---------|----------|----------|
| 1 | minor | Footer position and card centring have no test; jsdom has no layout. | Yes. | Kept without a test: checked by the full E2E run (axe, no sideways scrolling or cut-off text at 390 px on the sign-in and public pages) and by eye; a bounding-box scenario would test styling, not behaviour. |
| 2 | minor | Dr. Weber's minor on the «Se connecter» click area was not recorded. | Yes; the link is already 48 px high (`min-h-12`). | Recorded in `offene-punkte.md` as not changed. |

Flex column, sign-in card, error page, signed-in frame, tokens, landmarks, tests and docs checked without findings. No blocker or major open.
