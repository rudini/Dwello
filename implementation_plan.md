# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: Login and header follow the browser language (#110)

Request: «Setze #110 um» (coordinator W9b). #110's "Done means" asks for an implementation issue; none exists, the decided Option 2 is the requirement, the pull request says `Fixes #110`.

- [x] `@wip` scenarios in `sprachen.feature`: login page in French for a French browser without cookie; overview follows the browser; the chosen language wins over the browser; seen red
- [x] fach-reviewer on the `@wip` scenarios before implementing (privacy text: the cookie is now set from the browser language)
- [x] fach-reviewer round 1 (`docs/reviews/p14-fachreview-1.md`): took R-1 (privacy sentence, four languages), V-1 (scenario: the first visit's language stays), V-2 (no `@wip` on «Die gewählte Sprache gilt …», its red shown by swapping the strategy order in the unit test)
- [x] Strategy `cookie, preferredLanguage, baseLocale` in `package.json` (`i18n`), `vite.config.ts`, `vitest.config.ts`; `Vary: Accept-Language` on pages
- [x] E2E and a11y language tests keep German (Playwright already pins `locale: 'de-CH'`); DOM tests pin `navigator.languages` to de-CH (`tests/mocks/browser-language.ts`)
- [x] Found: the old step «bevorzugt Englisch» never reached the server (Chromium sends the context locale over an extra header); `Browser.preferLanguages` now changes the request
- [x] code-reviewer round 1 (`docs/reviews/p14-review-1.md`): fixed C-1, C-3 (Vary on every answer), C-4; C-2, C-5 stay in the report
- [x] Feature review: personas Anna (`docs/design/personas/anna-p14.md`) and Dr. Weber (`docs/design/personas/weber-p14.md`); no second `fach-reviewer` (the privacy sentence is the one reviewed before implementing)
- [x] Workflow note: decision issue implemented directly; personas README «language stored on the account» is outdated (`docs/reviews/workflow-notes-issue-110.md`)
- [x] Checks before push; workflow review; archive session
- [ ] Push, pull request, CI and merge (CLAUDE.md, Workflow 9)

Files: `package.json`, `vite.config.ts`, `vitest.config.ts`, `src/hooks.server.ts`, `messages/*.json`, `tests/mocks/browser-language.ts`, `src/__tests__/{i18n.test.ts,privacy-page.dom.test.ts}`, `tests/e2e/features/sprachen.feature`, `tests/e2e/{screenplay/interactions,tasks/language,steps/language.steps}.ts`, `docs/reviews/p14-{fachreview,review}-1.md`, persona reports, `docs/reviews/workflow-notes-issue-110.md`
