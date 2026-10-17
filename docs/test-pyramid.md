# Dwello Test Pyramid (ATDD after Dave Farley)

Dwello is developed with **Acceptance Test Driven Development**: every change starts with a business acceptance scenario, and unit TDD is the inner loop. Farley distinguishes two complementary perspectives:

- **Acceptance tests** check that the code does *what the business wants*.
- **Unit tests (TDD)** check that the code does *what the developer thinks*.

## The pyramid

```
                    ┌──────────────────────┐
                    │ Acceptance tests (E2E)│   few      Gherkin, Playwright-BDD, production build
                    │  "What the business   │            ← outer loop: written first,
                    │   wants"              │              green = feature done
                ┌───┴──────────────────────┴───┐
                │  Integration (real DB)        │   more     bun test *.pg.test.ts, dwello_test, API contracts
                │  technical contracts          │            only where unit tests are not enough
           ┌────┴───────────────────────────────┴────┐
           │  Unit TDD                                │   many     Vitest (frontend), bun test (backend)
           │  "What the developer thinks"             │            ← inner loop: seconds
           └──────────────────────────────────────────┘
```

The quantities still form a pyramid, with many fast unit tests at the bottom. The **order** is reversed: the scenario at the top comes first and decides when a feature is done.

## Layers

| Layer | Location | Runner | Against | Test doubles |
|---|---|---|---|---|
| Acceptance (E2E) | `tests/e2e/features/*.feature` | Playwright + playwright-bdd | Browser → SvelteKit build (`node build`) → Elysia → PostgreSQL `dwello_e2e` (migrated fresh before each run) | no API mocks except a failing request at the browser boundary (`tests/e2e/CLAUDE.md`, "Rules", failure states); SMTP mail catcher instead of a mail provider, a KI stand-in (`backend/scripts/llm-stub.ts`) that answers only the check of a new category, signed session JWT instead of Google OAuth |
| Integration | `backend/src/__tests__/*.pg.test.ts` | `bun run test` or `bun run test:pg` (preload `scripts/test-db.ts`, set in `bunfig.toml`) | Elysia app in process (`app.handle`) → PostgreSQL `dwello_test` (migrated fresh before each run) | none; local SMTP server for mail |
| Unit backend | `backend/src/__tests__/*.test.ts` | `bun run test` (one run together with the pg tests) | pure functions of the services | none; Resend stand-in via `Bun.serve` in `mail.test.ts` |
| Unit frontend | `src/__tests__`, `src/lib/utils/__tests__`, `tests/unit` | Vitest (`server`: node, `dom`: jsdom) | load functions, actions, BFF, components | fake backend via `fetch` stub / `fakeBff` (from the API contracts in `tests/contracts`; add one when there is none), `vi.mock` for `$app/*` and for the module that reads build-time constants |

Rules:

- No test copies production logic ("mirror test"); every test imports the real code.
- CI workflows and deploy scripts: branching logic moves into a `tools/<area>/*.mjs` script with a `*.test.ts` next to it (as `tools/open-work`, `tools/release`); for the remaining glue (git, `gh`, docker) a simulation in a scratch repository is the red and green of a fix; its commands and both results go into the commit message of the fix, since no test shows them.
- Build-time constants (`__APP_VERSION__`) are read through one small module that DOM tests replace with `vi.mock`, never in the component, so each value has a test.
- No mocked database: whatever needs SQL is a `*.pg.test.ts`.
- E2E rules (isolation, negative checks, failure states, `@api`): `tests/e2e/CLAUDE.md`, "Rules".
- Selectors: `data-testid` (see `CLAUDE.md`).
- Fake backend responses in frontend tests come from `tests/contracts/*.json`; a test that reads a response without a contract adds one; `backend/src/__tests__/api-contracts.pg.test.ts` checks every field against the real API (see `tests/contracts/README.md`).

## Coverage

Target coverage:

| Area | Statements | Branches | Functions | Lines |
|---|---|---|---|---|
| Frontend | 80 % | 80 % | 80 % | 80 % |
| Backend | – | – | 80 % | 80 % |

Bun measures only lines and functions in the backend.

A floor applies: today's coverage, rounded down to whole percent. If coverage drops below it, the run fails locally and in CI. As coverage grows, the floor is raised. The backend floor (82 % lines, 85 % functions) is already above the target; the frontend floor is still below it.

| Area | Measured by | Floor stored in |
|---|---|---|
| Frontend | `bun run test:coverage` (Vitest, v8, all `src/**/*.{ts,svelte}`) | `vitest.config.ts` |
| Backend | `bun run test` (all backend tests, lcov) | `backend/scripts/coverage-check.ts` (Bun would check its own thresholds per file) |

## Farley's four layers in the acceptance tests

| Layer | Purpose | In Dwello |
|---|---|---|
| Test cases (executable specifications) | *What* the business wants, in domain language | `tests/e2e/features/*.feature` (German, role "Liegenschaftsverwalter", terms from `UBIQUITOUS_LANGUAGE.md`) |
| Domain-specific language | Reusable domain language | `tests/e2e/steps/`, Screenplay: `tasks/`, `questions/`, the actor in `screenplay/actor.ts` (layers and lint rules: `tests/e2e/CLAUDE.md`) |
| Protocol drivers | Translate the DSL into interactions | UI driver: ability `BrowseTheWeb` with `screenplay/interactions.ts`, `screenplay/questions.ts` and `targets/` (browser via Playwright). API driver: ability `CallTheApi` (backend API), used by `tasks/*-api.ts`; where the BFF holds a rule, the API driver calls that BFF server code (`src/lib/server`) instead of copying it. Preconditions always go through the API (`fixtures/backend.ts`) |
| System under test | Deployed like production | `bun run build && node build` + backend + its own database (`playwright.config.ts`) |

### Two protocol drivers

The same scenario can run through the browser or directly against the backend API. The fixture option `driver` (`ui` | `api`, `fixtures/test.ts`) gives the actor the matching ability; tasks and questions built with `throughUiOrApi` pick their path by it, so steps never branch. Scenarios tagged `@api` additionally run in the Playwright project `api`, without page visits.

What `@api` is for and how to add a step: `tests/e2e/CLAUDE.md`, "Rules". Today it covers the management fee (`statement-management-fee.feature`), preview, generation and a period without rental contracts (`statement-generate.feature`), and heating costs on a tenant change (`statement-detail.feature`).

Isolation as Farley describes it:

- **Functional and temporal:** `tests/e2e/CLAUDE.md`, "Rules", isolation.
- **System:** external systems are replaced at the boundary (mail catcher, KI stand-in, session JWT; local stand-ins via `Bun.serve` for the OpenAI-compatible LLM provider in `backend/src/__tests__/helpers/llm.ts` and for Resend in `mail.test.ts`).

## Workflow: one feature with ATDD

1. **Clarify examples:** phrase the acceptance criteria as concrete examples in the property manager's language.
2. **Scenario first:** write it into the matching `.feature` file and tag it `@wip` (excluded by `playwright.config.ts`, so the pipeline stays green).
3. **See red:** `bun run test:e2e:wip`; add missing steps through the existing DSL until the scenario fails for the right reason.
4. **Inner loop:** drive the behavior with TDD (unit tests; pg tests only for SQL, routing, mail).
5. **Green:** remove `@wip`. From now on the scenario is a regression test and a gate in the pipeline.

Example: `tests/e2e/features/statement-management-fee.feature` (management fee by allocation key).

UI behavior that is not business behavior lives in its own features: `breadcrumb.feature` (the breadcrumb of every page as one scenario outline) and `hydration.feature` (selecting before a page has finished loading).

## Running

| Layer | Local | CI (`.github/workflows/ci.yml`) |
|---|---|---|
| Lint and types | `bun run lint` (warnings fail), `bun run check` (also `tests/` and `*.config.ts`), `cd backend && bun run type-check` | job "Lint and types" |
| Unit frontend | `bunx vitest run` (with coverage: `bun run test:coverage`) | job "Unit tests": all tests with the coverage floor |
| Unit + integration backend | `cd backend && bun run test` (DB only: `bun run test:pg`) | job "Unit tests", in PRs when `backend/` or `tests/contracts/` changed, always on `main`; with the coverage floor |
| Acceptance | `bun run test:e2e` (API driver only: `-- --project=api`) | job "E2E tests" (without `@a11y`) in 5 shards ("E2E tests (1/5)" to "(5/5)"), reported together as the check "E2E tests"; PRs Chromium and `api`, `main` all browsers and `api` |
| Accessibility | `bun run test:e2e -- --project=chromium --grep @a11y` | job "Accessibility (axe)": every screen and state of `tests/a11y/screens.json` with axe-core in Chromium, light and dark, in 5 shards reported together as the check "Accessibility (axe)"; its own check so it can be required; on a pull request that changes nothing it sees (frontend code other than unit tests, `messages/`, `static/`, `project.inlang/`, styles and build config, dependencies, `tests/a11y/`, the E2E code and `accessibility.feature`, `ci.yml`; a backend-only change, demo and E2E seed data included, does not count) its steps are skipped and it passes; pushes to `main` always run it |

Local prerequisite: PostgreSQL on port 5432 with user `dwello`; how the test databases are recreated and the development database stays untouched: `backend/CLAUDE.md` (`dwello_test`) and `tests/e2e/CLAUDE.md`, "Run" (`dwello_e2e`).

## Open

Raising frontend coverage to the target: `docs/design/offene-punkte.md` H-10.
