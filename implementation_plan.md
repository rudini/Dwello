# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-14: Fix bug issues (#53 first)

Task: work off the open `bug` issues one by one (PR merged before the next). Skipped until decided (`entscheiden`): #141, #138, #136, #131, #130, #124, #93.

### #53 B-1: Apartment list search

- [x] Scenarios «Wohnungen nach Gebäude und Wohnungsnummer suchen», «Wohnungssuche ohne Treffer» (`tests/e2e/features/apartments.feature`). Scenario red: `die Wohnungsliste enthält genau 2 Wohnungen` – Expected 2, Received 4; `den Hinweis "Keine Wohnungen gefunden"` – hint not shown
- [x] Test red: `apartment-search.pg.test.ts` (3 tests) – all apartments returned, total 4 instead of 3
- [x] Backend accepts `search` (number or building name, ILIKE), count joins `buildings`
- [x] `tests/a11y/screens.json`: `queries` override of `apartments` and B-1 note removed
- [x] Scenarios green (14 incl. axe/i18n rows of `apartments`)
- [x] Checks: `test:coverage`, `check`, `lint`, backend `test` + `type-check`, `deepcheck:audit` clean
- code-reviewer round 1 (`docs/reviews/b1-review-1.md`): fixed C-1 (Minor, `search` documented in `docs/api-specification.md`), C-2 (Minor, pg test search + status); rejected C-3: ILIKE wildcards behave like the building search the issue asks to match
- persona Helga round 1 (`docs/design/personas/helga-b1.md`): open P-1 (Major, existed before: #159), P-2 (Major, needs decision: #160), P-3, P-4 (Minor: #160), P-5 (Nit: `offene-punkte.md` U-22)
- persona Marco round 1 (`docs/design/personas/marco-b1.md`): open P-1 (Major, existed before: #159), P-2 (Major, needs decision: #160), P-3 (Minor: #160), P-4 (Minor), P-5, P-6 (Nit: U-22)
- [ ] PR, CI, merge
- Skills: tdd, ponytail, ponytail-review
- Files: `backend/src/services/apartment.service.ts`, `backend/src/routes/apartments.ts`, `backend/src/__tests__/apartment-search.pg.test.ts`, `tests/e2e/{features/apartments.feature,steps/apartment-list.steps.ts,tasks,targets,questions/apartments.ts}`, `tests/a11y/screens.json`, `docs/api-specification.md`, `docs/reviews/b1-review-1.md`, `docs/design/personas/{helga,marco}-b1.md`, `docs/design/offene-punkte.md`

### #162 Demo notice (branch `ccr-3bc253a8-1qvu31`, PR #163; listed here because `open-work.test.ts` allows one session)

Decided (product owner, #162): option 1. `DEMO=on` shows a notice on every page and a demo section in the privacy statement.

- [x] Scenarios `tests/e2e/features/demo.feature` (demo instance on 3104 in `playwright.config.ts`). Scenario red: `sagt der Demo-Hinweis dem Besucher …` – Besucher sees the text of Demo-Hinweis, Received has value: null (also dashboard and the privacy section «Öffentliche Demo»); «Kein Demo-Hinweis in einer eigenen Installation» green already (guard)
- [x] Layout: notice (`Alert`, tone caution) at the top of `main` on the sign-in page, the app pages and the content pages when `demo` is set. Test red: `public-pages-layout.dom.test.ts` «warnt auf der Anmeldeseite …» – notice undefined; the other three cases (app page, `/help`, `/privacy`, `/terms`, no notice without demo) written with the code, shown red by taking the renders out (4 failed) and by `{#if true}` (1 failed)
- [x] `+layout.server.ts`: `demo` from `DEMO=on`. Test red: `layout-load.test.ts` (2) – expected { user: null } to deeply equal { user: null, demo: true }
- [x] Privacy: section «Öffentliche Demo» in demo mode. Test red: `privacy-page.dom.test.ts` «sagt, dass alle dieselben Daten sehen …» – section missing
- [x] Texts in `messages/{de,fr,it,en}.json` (`demo_notice_title`, `demo_notice_text`, `privacy_demo_1`, `privacy_demo_2`)
- [x] `deploy/demo/docker-compose.yml` sets `DEMO=on`, README names it
- [x] a11y and language rows: state `demo` (login, dashboard, privacy) on the demo instance (`tasks/accessibility.ts`)
- [x] Scenarios green, `@wip` removed: 61 chromium cases (demo, a11y and language rows of login, dashboard, privacy, authentication, privacy) passed
- [ ] Code review, personas
- Skills: tdd, ponytail (ponytail-review before the review)
- Files: `src/routes/+layout.svelte`, `src/routes/+layout.server.ts`, `src/routes/privacy/+page.svelte`, `messages/*.json`, `src/__tests__/{layout-load.test.ts,public-pages-layout.dom.test.ts,privacy-page.dom.test.ts}`, `tests/e2e/{features/demo.feature,steps,tasks,questions,targets}/demo.*`, `tests/e2e/tasks/accessibility.ts`, `tests/a11y/screens.json`, `tests/e2e/features/{accessibility,sprachen-bildschirme}.feature`, `playwright.config.ts`, `deploy/demo/{docker-compose.yml,README.md}`
- [ ] Checks: test:coverage, lint, check, backend test + type-check, deepcheck:audit, affected E2E
