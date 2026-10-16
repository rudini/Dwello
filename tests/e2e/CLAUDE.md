# Acceptance tests (Playwright + playwright-bdd)

Scenarios describe what the property manager wants. Background and rules: `docs/test-pyramid.md`.

## Run

```bash
bun run test:e2e -- --project=chromium --project=api   # routine run, as in PR CI
bun run test:e2e                                   # all browsers (Firefox and WebKit too, as on main)
bunx bddgen && bunx playwright test --project=chromium -g "Szenarioname"   # one scenario
bunx bddgen && bunx playwright test --project=api    # only the @api scenarios through the backend API
bunx bddgen && bunx playwright test --project=chromium -g "Bildschirm ohne .* contract-edit "   # axe and language rows of one screen (trailing space: not contract-edit-notice)
bun run test:e2e:wip                               # the @wip scenarios, to see them fail (-- -g "Szenarioname" for one)
```

Run `@wip` only through `test:e2e:wip`: when `bddgen` fails (a missing step, `$lib` not synced), a separate `playwright test` runs the old files in `.features-gen` and reports them green. Give a run a Bash timeout anyway; a step waiting for a missing element fails after 10 s (`actionTimeout`).

`bddgen` loads the steps, and the API driver imports BFF server code with `$lib` paths: on a fresh checkout run `bunx svelte-kit sync` once before calling `bddgen` directly (`bun run test:e2e` does it).

The run starts its own stack: mail catcher, KI stand-in on 2527 (`backend/scripts/llm-stub.ts`: answers only the check of a new category, so invoices still find no KI), backend on 3101 and a production build of the frontend on 3100, against `dwello_e2e`, recreated from `backend/migrations` before every run. Only PostgreSQL on 5432 must be running. `E2E_DATABASE_URL` overrides the database. Locally the build runs only when the frontend (`src/` without `__tests__`, `messages/`, `static/`, its configuration and packages, and `playwright.config.ts`, which sets APP_VERSION) changed since the last E2E build (`tools/e2e/build-if-changed.mjs`; on CI always), so a run after a change to steps or the backend starts in seconds. Locally a frontend already listening on 3100 is reused, so stop it after code changes or the tests run an old build; 3101 must be free. A second, empty instance (backend 3103 on `dwello_e2e_empty`, the same build on 3102) serves the axe check's `empty` and `first-use` states; 3102 and 3103 must be free as well. It and the demo frontend (3104) start only when the generated tests include `accessibility.feature`, `sprachen-bildschirme.feature` or `demo.feature` (a `@wip` run usually does not).

## Layers (Screenplay, after Dave Farley)

An actor (`verwalter`, `besucher`) has abilities, performs activities and answers questions. Each layer only uses the one below it; `eslint.config.js` enforces this in `bun run lint` (proof: `src/__tests__/e2e-screenplay-lint.test.ts`).

| Layer | Holds | May use |
|---|---|---|
| `features/*.feature` | what the Liegenschaftsverwalter wants, not how: no UI words such as «klickt», «Button», «Feld» | – |
| `steps/` | step definitions: call tasks and ask questions through the actor; reuse existing steps first (`grep -rn "Given(\|When(\|Then(" tests/e2e/steps`: `bddgen` reports only missing steps, not near-duplicates); a step that checks one place of one page names the page | `tasks/`, `questions/`, `fixtures/` (`seed` for preconditions); no `page`, no locators, no `expect` |
| `tasks/` | domain activities (`chooseTenant(id)`, `registerContract(…)`): compose interactions and other tasks | `screenplay/` (interactions), `targets/`, other tasks; no Playwright calls |
| `questions/` | what the actor finds out, as values (`confirmation`, `listedContract(name)`): compose web questions and memory | `screenplay/` (web questions), `targets/`; no Playwright calls |
| `targets/` | named places on the page: `target('Mieterauswahl', (page) => page.getByTestId('contract-tenant-select'))`, parametrized ones as functions | `screenplay/target.ts`; locators only, no actions |
| `screenplay/` | the core: `Actor`, abilities, interactions (`Navigate`, `Click`, `Enter`, `Select`, `EnterDate`, …), web questions (`Text`, `Value`, `Visibility`, `Count`, …) | Playwright; a failing request only to reach a failure state, through `FailRequests` (below) |
| `fixtures/` | wiring: `test.ts` (actors, `seed`, `names`, `driver`; its `page` fixture signs the page in through `Cookies.add`), `backend.ts` (preconditions always through the backend API via `CallTheApi`, never through the UI), `screens.ts` (screens and records of the axe and language checks), session cookies, dates | Playwright fixtures and types as parameters, handed on unchanged to an ability (`BrowseTheWeb`, `CallTheApi`); no Playwright calls |

- **Actor** (`screenplay/actor.ts`): `attemptsTo(...activities)`, `answer(question)`, `sees(question)` (an assertion retried with `expect.poll` until the expect timeout: `await verwalter.sees(confirmation).toContain('gespeichert')`), `remember`/`recall` for what a task noticed for a later question.
- **Abilities** (`screenplay/abilities.ts`): `BrowseTheWeb` (the page, the UI protocol driver) and `CallTheApi` (the backend API, the API protocol driver). The fixture `driver` (`ui` | `api`) gives the Liegenschaftsverwalter one of them; the project `api` runs the `@api` scenarios once more with `CallTheApi`. A task or question that works through both is built with `throughUiOrApi(ui, api)` and picks by ability, so steps never branch on the driver; a new `@api` step needs both paths, and both answer in the same form. Where the BFF holds a rule (e.g. which contracts a statement run bills, `src/lib/server/statement-generation.ts`), the API path calls that server code with `CallTheApi.fetch` instead of copying the rule into the test.
- **Activities** are functions `(actor) => Promise`: interactions from `screenplay/interactions.ts` and tasks built from them (`Click.on(nextButton)`, or `(actor) => actor.attemptsTo(Select.option(id).from(tenantSelect), goToNextStep)`). A task may ask a question to decide what to do next.
- No exceptions: `eslint.config.js` has no exception list and ignores `eslint-disable` comments in `tests/e2e`.
- **Questions** answer values, never locators, and never wait for the page: `actor.sees` asks again until the expectation holds. A question answers the value itself (a text, an amount in francs, a count), never a yes/no that hides it: a failing check then shows what the page says. Yes/no only for real states (shown, enabled, checked). A target that is not there answers `null`, `false` or `0`; `Text.of` normalizes whitespace like `toHaveText` and refuses several matches like Playwright's strict mode.

Example:

```ts
// targets/contract-form.ts
export const tenantSelect = target('Mieterauswahl', (page) => page.getByTestId('contract-tenant-select'));
// tasks/contract-form.ts
export const chooseTenant = (tenantId: string): Activity => (actor) =>
	actor.attemptsTo(Select.option(tenantId).from(tenantSelect), Click.on(nextButton));
// questions/contract-form.ts
export const chosenTenantName = Value.chosenIn(tenantSelect);
// steps/contract-form.steps.ts
When('der Liegenschaftsverwalter den Mieter {string} wählt', async ({ verwalter, seed }, tenant: string) => {
	await verwalter.attemptsTo(chooseTenant(seed.idOf(tenant)!));
});
Then('ist im Mietvertrag der Mieter {string} gewählt', async ({ verwalter, names }, tenant: string) => {
	await verwalter.sees(chosenTenantName).toBe(names.get(tenant) ?? tenant);
});
```

## No scenario

A state the E2E stack cannot produce gets a lower-layer test and `No scenario: <reason>` in the plan and the pull request instead of a scenario (`CLAUDE.md`, Workflow 1):

- a failure only between server parts (a load function, the BFF calling the backend);
- the server's clock or time zone (a test with a set clock);
- the backend start or a CLI script;
- how the UI shows a refusal its own checks never send to the backend (a DOM test with the body from a contract);
- the quality of a KI answer.

## Rules

- **Isolation:** every scenario creates its own data and removes it (temporal isolation); `seed.names` appends a UUID to each name ("Lindenhof" becomes "Lindenhof 3f2a…"), so scenarios run in parallel (functional isolation). Never rely on data from another scenario or from the demo data. Enter periods and dates that match the seeded records, never a default of the app that moves with today. A result that depends on a choice the app preselects names that choice: a preselection reads all records, also those of parallel scenarios.
- **Negative checks** ("X is not shown") need a positive anchor first (an empty-state hint or the page title); otherwise they also pass on an error page. A negative check names the shortest word every wrong variant contains («Heizprofil», not «nach Heizprofil»).
- **Failure states:** the only API mock in a scenario. A state that only a failing request produces is reached by answering that one endpoint with an error status at the browser boundary, never with invented data; only requests the browser makes, so not in `@api` scenarios. `FailRequests.to(path, query)` (`tests/e2e/screenplay/`) answers every call of that endpoint with those query values with status 500 and no data, `FailRequests.noLonger` lifts every route of the page. A form action `?/upload` is the query key `/upload` with the value `''` (`FailRequests.to('/tenants/<id>', { '/upload': '' })`). "One failing request" means one endpoint with all its calls (a page that loads contracts per apartment sends several). Set it before the page sends the calls; an axe or language state with a failure (`tasks/accessibility.ts`) sets it on the open page and then `Navigate.reload`.
- **Pages outside the app** (an HTML answer of a `+server.ts` route, without scripts): `Navigate.to` waits for `body[data-hydrated]`, so such a page sets the attribute itself (`pdfRefusal` in `src/lib/server/statement.ts`).
- `@api` is for business rules and calculations that do not depend on the UI (examples and the two drivers: `docs/test-pyramid.md`, "Two protocol drivers"); workflows, navigation and forms stay UI-only. A new `@api` step needs both paths; the API path lives in `tasks/<area>-api.ts`.
