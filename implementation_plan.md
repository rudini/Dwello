# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: Login and header follow the browser language (#110)

Request: «Setze #110 um» (coordinator W9b). #110's "Done means" asks for an implementation issue; none exists, the decided Option 2 is the requirement, the pull request says `Fixes #110`.

- [ ] `@wip` scenarios in `sprachen.feature`: login page in French for a French browser without cookie; overview follows the browser; the chosen language wins over the browser; seen red
- [ ] fach-reviewer on the `@wip` scenarios before implementing (privacy text: the cookie is now set from the browser language)
- [ ] Strategy `cookie, preferredLanguage, baseLocale` in `package.json` (`i18n`), `vite.config.ts`, `vitest.config.ts`; `Vary: Accept-Language` on pages
- [ ] E2E and a11y language tests keep German (Playwright already pins `locale: 'de-CH'`)
- [ ] code-reviewer round 1
- [ ] Feature review (persona Anna / Sven)
- [ ] Checks before push; workflow review; archive session
- [ ] Push, pull request, CI and merge (CLAUDE.md, Workflow 9)
