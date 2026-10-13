# Acceptance tests (Playwright + playwright-bdd)

Scenarios describe what the property manager wants. Background and rules: `docs/test-pyramid.md`.

## Run

```bash
bun run test:e2e -- --project=chromium --project=api   # routine run, as in PR CI
bun run test:e2e                                   # all browsers (Firefox and WebKit too, as on main)
bunx bddgen && bunx playwright test --project=chromium -g "Szenarioname"   # one scenario
bunx bddgen && bunx playwright test --project=api    # only the @api scenarios through the backend API
bunx bddgen --tags "@wip" && bunx playwright test --project=chromium      # a new @wip scenario, to see it fail
```

The run starts its own stack: mail catcher, backend on 3101 and a production build of the frontend on 3100, against `dwello_e2e`, recreated from `backend/migrations` before every run. Only PostgreSQL on 5432 must be running. `E2E_DATABASE_URL` overrides the database. Locally a frontend already listening on 3100 is reused, so stop it after code changes or the tests run an old build; 3101 must be free. A second, empty instance (backend 3103 on `dwello_e2e_empty`, the same build on 3102) serves the axe check's `empty` and `first-use` states; 3102 and 3103 must be free as well.

## Layers (Screenplay, after Dave Farley)

An actor (`verwalter`, `besucher`) has abilities, performs activities and answers questions. Each layer only uses the one below it; `eslint.config.js` enforces this in `bun run lint` (proof: `src/__tests__/e2e-screenplay-lint.test.ts`).

| Layer | Holds | May use |
|---|---|---|
| `features/*.feature` | what the Liegenschaftsverwalter wants, not how: no UI words such as «klickt», «Button», «Feld» | – |
| `steps/` | step definitions: call tasks and ask questions through the actor; reuse existing steps first | `tasks/`, `questions/`, `fixtures/` (`seed` for preconditions); no `page`, no locators, no `expect`, no `throw` as a check, no `driver` and no `seed.backend` (tasks choose UI or API) |
| `tasks/` | domain activities (`chooseTenant(id)`, `registerContract(…)`): compose interactions and other tasks | `screenplay/` (interactions), `targets/`, other tasks; no Playwright calls |
| `questions/` | what the actor finds out, as values (`confirmation`, `listedContract(name)`): compose web questions and memory | `screenplay/` (web questions), `targets/`; no Playwright calls, no interactions or `attemptsTo`, no timers |
| `targets/` | named places on the page: `target('Mieterauswahl', (page) => page.getByTestId('contract-tenant-select'))`, parametrized ones as functions | `screenplay/target.ts`; locators only, no actions |
| `screenplay/` | the core: `Actor`, abilities, interactions (`Navigate`, `Click`, `Enter`, `Select`, `EnterDate`, …), web questions (`Text`, `Value`, `Visibility`, `Count`, …) | Playwright |
| `fixtures/` | wiring: `test.ts` (actors, `seed`, `names`, `driver`; its `page` fixture signs the page in through `Cookies.add`), `backend.ts` (preconditions always through the backend API via `CallTheApi`, never through the UI), `screens.ts` (screens and records of the axe and language checks), session cookies, dates | Playwright fixtures and types as parameters, handed on unchanged to an ability (`BrowseTheWeb`, `CallTheApi`); no Playwright calls, no targets, of the interactions only `Cookies` |

- **Actor** (`screenplay/actor.ts`): `attemptsTo(...activities)`, `answer(question)`, `sees(question)` (an assertion retried with `expect.poll` until the expect timeout: `await verwalter.sees(confirmation).toContain('gespeichert')`), `remember`/`recall` for what a task noticed for a later question.
- **Abilities** (`screenplay/abilities.ts`): `BrowseTheWeb` (the page, the UI protocol driver) and `CallTheApi` (the backend API, the API protocol driver). The fixture `driver` (`ui` | `api`) gives the Liegenschaftsverwalter one of them; the project `api` runs the `@api` scenarios once more with `CallTheApi`. A task or question that works through both is built with `throughUiOrApi(ui, api)` and picks by ability, so steps never branch on the driver; a new `@api` step needs both paths.
- **Activities** are functions `(actor) => Promise`: interactions from `screenplay/interactions.ts` and tasks built from them (`Click.on(nextButton)`, or `(actor) => actor.attemptsTo(Select.option(id).from(tenantSelect), goToNextStep)`). A task may ask a question to decide what to do next.
- No exceptions: `eslint.config.js` has no exception list and ignores `eslint-disable` comments in `tests/e2e`.
- **Questions** answer values, never locators, and never wait for the page: `actor.sees` asks again until the expectation holds. A target that is not there answers `null`, `false` or `0`; `Text.of` normalizes whitespace like `toHaveText` and refuses several matches like Playwright's strict mode.

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

## Rules

- **Isolation:** every scenario creates its own data and removes it; `seed.names` appends a UUID to each name ("Lindenhof" becomes "Lindenhof 3f2a…"), so scenarios run in parallel. Never rely on data from another scenario or from the demo data.
- **Negative checks** ("X is not shown") need a positive anchor first (an empty-state hint or the page title); otherwise they also pass on an error page.
- `@api` is for business rules and calculations that do not depend on the UI; workflows, navigation and forms stay UI-only.
