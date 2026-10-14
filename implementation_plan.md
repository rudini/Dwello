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
- [x] PR #161, CI green, merged (b826af0); workflow review `docs/reviews/workflow-rules-review-2.md`
- Skills: tdd, ponytail, ponytail-review
- Files: `backend/src/services/apartment.service.ts`, `backend/src/routes/apartments.ts`, `backend/src/__tests__/apartment-search.pg.test.ts`, `tests/e2e/{features/apartments.feature,steps/apartment-list.steps.ts,tasks,targets,questions/apartments.ts}`, `tests/a11y/screens.json`, `docs/api-specification.md`, `docs/reviews/b1-review-1.md`, `docs/design/personas/{helga,marco}-b1.md`, `docs/design/offene-punkte.md`

### #81 F-19a: Privacy page states wrong facts

- [x] Scenarios «Anmeldung nur über die eingerichteten Anbieter», «Dienste Dritter, die der Browser aufruft», «Alle Cookies, die Dwello setzt» (`tests/e2e/features/privacy.feature`). Scenario red: `nennt … unter "Anmeldung" nicht "Microsoft"` – text says «Google oder Microsoft»; `… "CARTO"` – not named; `… "dwello_session"` – not named
- [x] Test red: `privacy.test.ts` «nennt nur die eingerichteten Anmeldeanbieter» – `providers` undefined; `privacy-page.dom.test.ts` (3 tests) – Microsoft named, no CARTO/OpenPLZ, Google Fonts named, cookies missing
- [x] Load returns the configured providers (`PROVIDER_NAMES` shared with the login page); page joins them per language (`Intl.ListFormat`, disjunction)
- [x] Texts in four languages: Google Fonts removed; CARTO (map on a building's page) and OpenPLZ (address search) named with what they receive; cookies `dwello_session`, `dwello_xsrf`, `dwello_oauth_state`, `dwello_login`, `PARAGLIDE_LOCALE` (400 days, readable by JavaScript)
- [x] Scenarios green (17 incl. language scenarios; axe/i18n rows `privacy`, `privacy-public`)
- [x] Checks: `test:coverage` (2286), `check`, `lint`, backend `test` (547) + `type-check`, `deepcheck:audit`, fallow clean
- code-reviewer round 1 (`docs/reviews/f19a-review-1.md`): fixed C-1 (Minor, it «immobile», «mappa»), C-2 (Minor, fr guillemets with no-break space), C-4 (Minor, Google Maps named), C-5 (Nit, comment placement), C-6 (Nit, no gendered address in fr/it); rejected C-3: without a configured provider there is no sign-in at all, the login page says so
- persona Dr. Weber round 1 (`docs/design/personas/weber-f19a.md`): fixed P-2 (Minor, address search only when adding), P-4 (Minor, Google Maps and closing sentence), P-9 (Nit, language cookie without a choice); open P-1 (Major, existed before, needs decision: added to #82), P-3, P-5, P-6, P-10 (#82), P-7, P-8, P-11, P-12 (`offene-punkte.md` U-23)
- Test red (findings): `privacy-page.dom.test.ts` (3 tests) – «Erfassen und Bearbeiten», no Google Maps, «gewählte Sprache»; `privacy-i18n.dom.test.ts` (2 tests) – no no-break space, «stabile», «carta», «vous garde connecté»
- code-reviewer round 2 (`docs/reviews/f19a-review-2.md`): fixed C-7 (Minor, scenario names Google Maps), C-8 (Nit, it «quando Lei sceglie»), C-10 (Nit, closing sentence tested); C-9 (Nit, what Google learns at sign-in) moved to #82
- persona Dr. Weber round 2 (`docs/design/personas/weber-f19a-2.md`): fixed P-2 (Nit, Google Maps receives the IP too; `Referer` to U-23), P-3 (Nit, it «registrazione»); rejected P-1: the text no longer says the language was chosen
- Test red (round 2): `privacy-page.dom.test.ts` – Google Maps sentence without IP; `privacy-i18n.dom.test.ts` – «sceglie il link» without «Lei», «inserimento»
- [x] PR #164, CI green, merged (34d18a9); workflow review `docs/reviews/workflow-rules-review-3.md`
- Skills: tdd, ponytail, ponytail-review
- Files: `src/routes/privacy/+page.{svelte,server.ts}`, `src/routes/login/+page.server.ts`, `src/lib/server/oauth.ts`, `messages/{de,fr,it,en}.json`, `src/__tests__/privacy{.test.ts,-page.dom.test.ts}`, `tests/e2e/{features/privacy.feature,steps/app-frame.steps.ts,questions/app-frame.ts}`, `src/__tests__/privacy-i18n.dom.test.ts`, `docs/reviews/f19a-review-{1,2}.md`, `docs/design/personas/weber-f19a{,-2}.md`, `docs/design/offene-punkte.md`

### #99 P-9b: Category «predefined» stored instead of guessed

- [x] Scenario «Eigene Kategorie mit gleichem englischem Namen zeigt ihre Beschreibung» (`tests/e2e/features/categories.feature`). Scenario red: `sieht … bei der Kategorie "Internet" die Beschreibung …` – Expected the description, Received null
- [x] Test red: `category-type.pg.test.ts` (2) – `type` undefined; `category-predefined.dom.test.ts` (3 of 4; the 4th guards the predefined help) – own «Internet» predefined, description hidden, predefined help shown; `api-contracts.pg.test.ts` «GET /categories/:id» – `.type: fehlt`
- [x] `categories.type` (`predefined` default for the seeded rows, `custom` from `createCategory`) in `0001_schema.sql` and `schema.ts`; list and detail return it; `toCategory` reads it; obsolete name-guess test in `categories.test.ts` removed
- [x] Contract `tests/contracts/category.json` (new) with README row; `docs/data-model.md` names the column
- [x] Scenarios green (24 incl. axe/i18n rows `categories`, `category-new`, `category-edit`)
- [x] Checks: `test:coverage` (2294), `check`, `lint`, backend `test` (550) + `type-check`, `deepcheck:audit`, fallow clean
- code-reviewer round 1 (`docs/reviews/p9b-review-1.md`): fixed C-1 (Minor, `categories_type_check`; Test red: `category-type.pg.test.ts` «lässt nur … zu» – insert of `other` accepted), C-3 (Minor, Prettier hunk outside #99 reverted), C-4 (Nit, count in plan); open C-2 (Minor, existed before: no contract for `GET /categories`, `offene-punkte.md` O-11); rejected C-5: the issue asks for the pattern of `distribution_keys.type`, and only `createCategory` inserts categories in app code
- persona Helga round 1 (`docs/design/personas/helga-p9b.md`): open P-1, P-2 (Major, existed before, need a decision: #166), P-3 to P-7, P-9 (Minor/Nit: `offene-punkte.md` U-24), P-8 (Nit, toast: U-8)
- [x] PR #167, CI green, merged (fe34de6); workflow review `docs/reviews/workflow-rules-review-4.md`
- Skills: tdd, ponytail, ponytail-review
- Files: `backend/migrations/0001_schema.sql`, `backend/src/db/schema.ts`, `backend/src/services/category.service.ts`, `backend/src/__tests__/{category-type,api-contracts}.pg.test.ts`, `src/lib/server/category.ts`, `src/routes/config/categories/CategoryRow.svelte`, `src/__tests__/{category-predefined.dom,categories}.test.ts`, `tests/contracts/{category.json,README.md}`, `docs/data-model.md`, `tests/e2e/{features/categories.feature,fixtures/backend.ts,steps/categories.steps.ts,targets/categories.ts,questions/categories.ts}`, `docs/reviews/p9b-review-1.md`, `docs/design/personas/helga-p9b.md`, `docs/design/offene-punkte.md`

### #121 B-2: Statement list ignores contract and period filters

Slice 1 (contract filter), slice 2 (period filter, «Entwürfe ansehen»). Texts name Mietvertrag, Wohnung and Abrechnungsperiode: `fach-reviewer` on the `@wip` scenarios first (Workflow 1).

- [x] `@wip` scenarios «Abrechnungen eines Mietvertrags anzeigen» (`contract-detail.feature`), «Nur die Entwürfe des Abrechnungslaufs anzeigen» (`statement-generate.feature`)
- fach-reviewer round 1 (`docs/reviews/b2-fachreview-1.md`): fixed V-1 (Minor, scenario renamed «Nach dem Erstellen die Entwürfe der Abrechnungsperiode anzeigen»), V-2 (Nit, «Sie sehen …»), V-3 (Nit, Vertragsbeginn in the sentence; the glossary term, not «Mietbeginn»)
- [x] Slice 1 Test red: `statement-list-contract.pg.test.ts` – both contracts' statements listed; `statement-list-load.test.ts` (2, plus the unloadable contract) – no `contractId`, `scope` undefined; `statement-pages.dom.test.ts` (3) – no sentence, no hidden `contract`, contract not counted as filter
- [x] Slice 1: backend `contractId` filter; load passes it and builds the sentence from `GET /contracts/:id` (contract `contract.json`); page shows it with «Alle Abrechnungen anzeigen», counts `contract` as filter, the search form keeps it. Scenario red (code taken out again, steps written after): `erfährt …, dass die Liste nur die Abrechnungen des Mietvertrags …` – Received null; green
- [x] Slice 1 checks: `test:coverage` (2299), `check`, `lint`, backend `test` (552) + `type-check`, `deepcheck:audit`; fallow gate asked to split `load` (cognitive complexity 18 > 15): `FILTERS`/`backendQuery`
- code-reviewer round 1 on slice 1 (`docs/reviews/b2-review-1.md`): fixed C-1 (Major, screen state `list-scoped` in `screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`), C-2 (Major, formatting-only hunk restored), C-3 (Minor, test checks the reset link), C-4 (Minor, contract id encoded; Test red: `statement-list-load.test.ts` «kodierten Kennung»), C-5 (Minor, `contractId` in `docs/api-specification.md`), C-6 (Minor, new load tests answer with `period-statements.json`), C-7 (Nit, link styled like `PageHeader`, 48 px), C-8 (Nit, cast), C-9 (Nit, `backendQuery` required by the fallow gate, see above)
- [x] Slice 2: period filter, sentence, «Entwürfe ansehen» link (`draftsLink`, building only when the run had one). Scenario red: `… der Abrechnungsperiode "01.01.2024 – 31.12.2024" zeigt` – Received null. Test red: `statement-wizard.test.ts` (2) – `draftsLink` is not a function; `statement-list-load.test.ts` «Periode» – no period params; `statement-pages.dom.test.ts` «Abrechnungsperiode in der Suche» – no hidden period inputs; `statement-wizard.dom.test.ts` expected the old link (updated)
- [x] Scenarios green: 61 (contract-detail, statement-generate, Abrechnungsliste, axe/i18n rows of `statements` incl. `list-scoped`)
- [x] Slice 2 checks: `test:coverage` (2305), `check`, `lint`, `deepcheck:audit`, fallow
- Skills: tdd, ponytail, ponytail-review
- Files: `backend/src/{routes/statements.ts,services/statement.service.ts,__tests__/statement-list-contract.pg.test.ts}`, `src/routes/statements/{+page.server.ts,+page.svelte,StatementSearch.svelte}`, `src/lib/types.ts`, `messages/{de,fr,it,en}.json`, `src/__tests__/{statement-list-load.test.ts,statement-pages.dom.test.ts}`, `tests/e2e/{features/contract-detail.feature,features/statement-generate.feature,steps/statements.steps.ts,questions/statements.ts,targets/statements.ts}`, `docs/reviews/b2-fachreview-1.md`, `docs/reviews/b2-review-1.md`, `src/lib/statement-wizard.ts`, `src/routes/statements/generate/{GenerationStep,StatementStep}.svelte`, `src/__tests__/{statement-wizard.test.ts,statement-wizard.dom.test.ts,generation-step.test.ts}`, `tests/a11y/screens.json`, `tests/e2e/{features/accessibility.feature,features/sprachen-bildschirme.feature,tasks/accessibility.ts,targets/accessibility.ts}`, `docs/api-specification.md`, `docs/reviews/b2-review-{2,3}.md`, `src/routes/statements/StatusFilter.svelte`, `docs/design/personas/{helga,marco}-b2.md`, `docs/design/offene-punkte.md`
