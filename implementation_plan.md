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
- [x] Code review round 1, personas round 1 (Weber, Marco, Anna, Sven, Helga)
- [x] Fixes after round 1: privacy «Anmeldung» names the server log of sign-ins and session extensions (#165; replaces the demo section's log sentence, `privacy_demo_2` removed); notice gives the reason («deshalb»), names e-mail addresses and phone numbers, «erfundene Beispieldaten»; demo section says other visitors do not see name and e-mail; notice is a region named «Öffentliche Demo»; E2E: domain-named demo tasks, `sectionText` in `questions/app-frame.ts`. Test red: `public-pages-layout.dom.test.ts` (region, reason) and `privacy-page.dom.test.ts` (demo section, «Anmeldung»): 4 failed; scenarios red: «Datenschutzerklärung der Demo» (expected «Ihren Namen und Ihre E-Mail-Adresse sehen andere Besucher nicht») and new «Anmeldungen im Protokoll des Servers» (`privacy.feature`); then 53 chromium cases green
- [x] Code review round 2, personas Weber and Helga round 2 (new texts)
- [x] Fixes after round 2: «nur erfundene Daten …, auch bei E-Mail-Adressen und Telefonnummern»; demo section «… nur der Betreiber im Protokoll des Servers (siehe «Anmeldung»)»; session extension «etwa alle 50 Minuten, solange Dwello offen ist» (the refresh interval in `+layout.svelte`); French partitive. Test red: 3 DOM tests (notice, demo section, «Anmeldung»); then 53 chromium cases green. ponytail-review on 14c9790 and this delta: nothing to cut
- [ ] Code review round 3, persona Weber round 3 (changed legal texts)
- Skills: tdd, ponytail, ponytail-review (on be0b235 before review round 1: nothing to cut)
- Files: `src/routes/+layout.svelte`, `src/routes/+layout.server.ts`, `src/routes/privacy/+page.svelte`, `messages/*.json`, `src/__tests__/{layout-load.test.ts,public-pages-layout.dom.test.ts,privacy-page.dom.test.ts}`, `tests/e2e/{features/demo.feature,steps,tasks,questions,targets}/demo.*`, `tests/e2e/tasks/accessibility.ts`, `tests/a11y/screens.json`, `tests/e2e/features/{accessibility,sprachen-bildschirme}.feature`, `playwright.config.ts`, `deploy/demo/{docker-compose.yml,README.md}`
- [ ] Checks: test:coverage, lint, check, backend test + type-check, deepcheck:audit, affected E2E
- code-reviewer round 1 (`docs/reviews/b162-review-1.md`): fixed C-1 (Minor, session extension named), C-2 (Minor, #165), C-3 (Minor), C-4 (Minor), C-5 (Nit), C-6 (Nit), C-7 (Nit)
- persona Weber round 1 (`docs/design/personas/weber-b162.md`): fixed P-1 (Major, #165), P-8 (Minor); open P-2, P-3 (Major, existed before: #82), P-4, P-5, P-6, P-7 (Minor: #82), P-10, P-11 (Nit, existed before: wording of `privacy_third_1` in French and of the terms, added to #82); rejected P-9: the time is the operator's cron, the app does not know it
- persona Marco round 1 (`docs/design/personas/marco-b162.md`): fixed P-3 (Minor, privacy demo section); open P-1, P-2 (Minor: U-23), P-4 (Nit: U-23); rejected P-5: as Weber P-9
- persona Anna round 1 (`docs/design/personas/anna-b162.md`): fixed P-1 (Minor, privacy demo section), P-3 (Minor); open P-2, P-6, P-7 (U-23), P-4, P-5 (Minor: #82)
- persona Sven round 1 (`docs/design/personas/sven-b162.md`): fixed P-2 (Minor, named region); open P-1 (Minor: U-23), P-4 (Nit: existed before, U-6), P-5 (Minor: #82); rejected P-3: the notice is the same on every page, the section explains it in the privacy statement's own terms
- persona Helga round 1 (`docs/design/personas/helga-b162.md`): fixed P-1, P-2 (Minor), P-6 (Nit, privacy demo section; Microsoft: #82); open P-4, P-5 (Minor: U-23); rejected P-3: as Weber P-9
- code-reviewer round 2 (`docs/reviews/b162-review-2.md`): fixed C-9 (Nit), C-12 (Nit); open C-8 (Minor: retention, #82), C-10 (Nit: purpose, #82), C-11 (Nit: U-23)
- persona Weber round 2 (`docs/design/personas/weber-b162-2.md`): fixed P-1, P-3 (Minor), P-5 (Nit); open P-2, P-4 (Minor: #82)
- persona Helga round 2 (`docs/design/personas/helga-b162-2.md`): fixed P-7 (Minor), P-8 (Nit); open P-9 (Nit: sign-in page, U-23; Microsoft: #82)
