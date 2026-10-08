# Acceptance tests (Playwright + playwright-bdd)

Scenarios describe what the property manager wants. Background and rules: `docs/test-pyramid.md`.

## Run

```bash
npm run test:e2e -- --project=chromium --project=api   # routine run, as in PR CI
npm run test:e2e                                   # all browsers (Firefox and WebKit too, as on main)
npx bddgen && npx playwright test --project=chromium -g "Szenarioname"   # one scenario
npx bddgen && npx playwright test --project=api    # only the @api scenarios through the backend API
npx bddgen --tags "@wip" && npx playwright test --project=chromium      # a new @wip scenario, to see it fail
```

The run starts its own stack: mail catcher, backend on 3101 and a production build of the frontend on 3100, against `dwello_e2e`, recreated from `backend/migrations` before every run. Only PostgreSQL on 5432 must be running. `E2E_DATABASE_URL` overrides the database. Locally a frontend already listening on 3100 is reused, so stop it after code changes or the tests run an old build; 3101 must be free.

## Layers (Screenplay, after Dave Farley)

- `features/*.feature`: executable specifications, one file per area.
- `steps/`: step definitions; reuse existing steps before writing new ones.
- `tasks/` (actions) and `questions/` (what the actor reads), `fixtures/actor.ts`: the domain language the steps call.
- `interactions/`: the UI protocol driver (Playwright on the page).
- `tasks/*-api.ts`: the API protocol driver. Steps that talk to the system branch on the `driver` fixture (`ui` | `api`); a scenario tagged `@api` runs through both, so a new `@api` step needs both paths.
- `fixtures/test.ts`: fixtures `verwalter` (signed in), `besucher` (no session), `seed`, `names`, `driver`.
- `fixtures/backend.ts`: preconditions always go through the backend API, never through the UI.

## Rules

- **Isolation:** every scenario creates its own data and removes it; `seed.names` appends a UUID to each name ("Lindenhof" becomes "Lindenhof 3f2a…"), so scenarios run in parallel. Never rely on data from another scenario or from the demo data.
- **Negative checks** ("X is not shown") need a positive anchor first (an empty-state hint or the page title); otherwise they also pass on an error page.
- `@api` is for business rules and calculations that do not depend on the UI; workflows, navigation and forms stay UI-only.
