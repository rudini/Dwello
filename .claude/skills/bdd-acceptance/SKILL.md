---
name: bdd-acceptance
description: Generate Gherkin acceptance criteria and executable playwright-bdd tests from an existing system (SPA, server-rendered webapp, or API). Use when the user wants to create BDD tests, write acceptance criteria, add Gherkin scenarios, generate playwright-bdd step files, document system behavior as living tests, or set up BDD for an existing project.
---

# BDD Acceptance Criteria

Turn any running system into **living documentation**: Gherkin `.feature` files that express business intent, backed by executable playwright-bdd step definitions structured with the **Screenplay Pattern**.

## Dwello project context (overrides generic defaults below)

playwright-bdd is already set up in this repo. **Extend the existing setup; never re-bootstrap it.**

- Config: `playwright.config.ts` — `defineBddConfig({ paths: ['tests/e2e/features/**/*.feature'], require: ['tests/e2e/fixtures/test.ts', 'tests/e2e/steps/**/*.ts'] })`, `tags: 'not @wip'`
- Layout: `tests/e2e/features/`, `tests/e2e/steps/`, `tests/e2e/fixtures/test.ts`. Put `tasks/`, `questions/`, `interactions/` under `tests/e2e/` too.
- Run: `npm run test:e2e` (= `bddgen && playwright test`). The `webServer` config recreates the E2E database `dwello_e2e` from the migrations, then starts the backend (3101) and the frontend (3100), both with the JWT secret from `tests/e2e/fixtures/session.ts` and Google sign-in configured with test credentials. The development servers and database are never touched. PostgreSQL must be running on 5432 (`docker compose -f docker-compose.dev.yml up -d postgres`).
- Auth: OAuth only (Google/Microsoft), BFF with HTTPOnly cookies. There is no password login and no storageState. `src/hooks.server.ts` requires a valid session JWT for every page except `/login`, `/auth/*` and `/health`; the `page` fixture adds a real session cookie (`fixtures/session.ts`), the `besucher` actor has none. Skip the global-setup login, `.env.test` credentials and per-role projects from Phase 3.
- Actor: single role **Liegenschaftsverwalter** (see `UBIQUITOUS_LANGUAGE.md`). Use no role tags. Unauthenticated scenarios belong in `authentication.feature`.
- UI copy is German. Match visible text exactly (e.g. "Neues Gebäude").
- Selectors: `data-testid` only (kebab-case, with component context, e.g. `building-card-{id}`). Add missing `data-testid` attributes to the Svelte components.
- No mocks: seed data through real backend endpoints, never `page.route()` fakes (project rule in `CLAUDE.md`).
- Before writing new steps, check `tests/e2e/steps/` for an existing step with the same text. playwright-bdd fails on duplicate step definitions.

## Leading concepts

| Term                  | Meaning                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------- |
| **Actor**             | Named role from the domain ("Student", "Lecturer", "Expert") — one per scenario, one browser |
| **Task**              | What the Actor tries to accomplish ("Submit Thesis", "Publish Review") — maps to `When`      |
| **Question**          | What the Actor observes to verify state ("How many theses are listed?") — maps to `Then`     |
| **Interaction**       | Atomic `page.getByTestId()` call — lives in `interactions/`, called by Tasks and Questions   |
| **Page scope**        | One `.feature` file per distinct page/screen — keeps scenarios short and independent         |
| **Precondition step** | A `Given` that seeds server state via API call or sets browser state via `addInitScript`     |
| **Tracer run**        | First feature fully wired and green — proves the pipeline before scaling                     |

## Phase 1 — Discover the system

**Branch here — UI system or API-only?**

Explore the codebase to build a system map:

- Routes/pages: router files, `pages/`, `app/`, controllers, view templates
- API endpoints: REST routes, GraphQL schema, OpenAPI spec
- Domain entities: model files, schema definitions, type files
- User roles: auth middleware, route guards, role enums

Output a flat list:

```
Type:     UI (SPA / server-rendered) | API-only
Pages:    /login, /dashboard, /thesis-list, /thesis/:id
Entities: Thesis, Submission, Review
Roles:    Student, Lecturer, Expert, Guest
```

**Completion criterion**: type confirmed; every route and named role listed.

## Phase 2 — Validate ubiquitous language

Draft candidate domain terms from discovery. Prefer names from the code (model names, route labels, UI copy). Flag ambiguous or technical names.

Present to the user:

```
Actors:    Student, Lecturer, Expert, Guest
Entities:  Thesis, Submission, Review
Actions:   submitThesis, publishReview, lockSubmission
Ambiguous: "entry" (used 3 ways), "node"
```

If `UBIQUITOUS_LANGUAGE.md` exists, read it first — use it as ground truth.

**Do not write Gherkin until the user confirms actor and entity names.**

**Completion criterion**: user has approved actor names and key entity names.

## Phase 3 — Bootstrap playwright-bdd

Do this before writing any feature files. A broken pipeline discovered after 20 features is expensive.

**If playwright-bdd is already configured** (check `playwright.config.ts` for `defineBddConfig`), skip install and config. Only add missing fixtures and folders, then do the tracer run.

### Install

```bash
npm install -D playwright-bdd @playwright/test
```

### Directory layout

```
tests/
  .auth/              ← storageState files per role (gitignored)
  features/           ← .feature files
  steps/              ← step definitions (one file per feature)
  tasks/              ← Actor Tasks (business-level sequences)
  questions/          ← Questions (what the Actor observes)
  interactions/       ← Atomic getByTestId locators
  fixtures/           ← Actor fixture + role fixtures
  global-setup.ts     ← generates storageState, truncates test DB
```

### Actor class

```typescript
// tests/fixtures/actor.ts
import { Page } from '@playwright/test';

export class Actor {
	constructor(
		public readonly name: string,
		public readonly page: Page
	) {}

	async perform(task: (actor: Actor) => Promise<void>): Promise<void> {
		await task(this);
	}
}
```

### Fixtures

```typescript
// tests/fixtures/index.ts
import { test as base } from 'playwright-bdd';
import { Actor } from './actor';

type Fixtures = {
	student: Actor;
	lecturer: Actor;
	expert: Actor;
	guest: Actor;
	names: Map<string, string>; // Gherkin name -> UUID-namespaced name created in Given
};

export const test = base.extend<Fixtures>({
	student: async ({ page }, use) => use(new Actor('Student', page)),
	lecturer: async ({ page }, use) => use(new Actor('Lecturer', page)),
	expert: async ({ page }, use) => use(new Actor('Expert', page)),
	// Guest needs its own context: the shared `page` carries the project's storageState
	guest: async ({ browser, baseURL }, use) => {
		const context = await browser.newContext({ baseURL });
		await use(new Actor('Guest', await context.newPage()));
		await context.close();
	},
	names: async ({}, use) => use(new Map())
});
export { expect } from '@playwright/test';
```

All step files get `Given/When/Then` from `createBdd(test)`. playwright-bdd v8 has no direct `Given` export, and only `createBdd(test)` exposes the custom fixtures.

### Global setup — storageState per role + DB truncate

```typescript
// tests/global-setup.ts
import { request } from '@playwright/test';
import * as fs from 'fs';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

const ROLES = [
	{ name: 'student', email: process.env.STUDENT_EMAIL!, password: process.env.STUDENT_PASSWORD! },
	{
		name: 'lecturer',
		email: process.env.LECTURER_EMAIL!,
		password: process.env.LECTURER_PASSWORD!
	},
	{ name: 'expert', email: process.env.EXPERT_EMAIL!, password: process.env.EXPERT_PASSWORD! }
];

export default async function globalSetup() {
	fs.mkdirSync('tests/.auth', { recursive: true });

	// Truncate test data — adapt to the system's real reset mechanism (endpoint, SQL, seed script)
	const api = await request.newContext({ baseURL: BASE_URL });
	await api.post('/api/test/reset');
	await api.dispose();

	// Generate storageState per role
	for (const role of ROLES) {
		const ctx = await request.newContext({ baseURL: BASE_URL });
		await ctx.post('/api/auth/login', { data: { email: role.email, password: role.password } });
		await ctx.storageState({ path: `tests/.auth/${role.name}.json` });
		await ctx.dispose();
	}
}
```

### playwright.config.ts

```typescript
import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
	features: 'tests/features/**/*.feature',
	steps: ['tests/steps/**/*.steps.ts', 'tests/fixtures/index.ts'],
	outputDir: '.bdd'
});

export default defineConfig({
	testDir,
	globalSetup: 'tests/global-setup.ts',
	use: { baseURL: process.env.BASE_URL ?? 'http://localhost:3000' },
	projects: [
		{ name: 'student', use: { storageState: 'tests/.auth/student.json' }, grep: /@student/ },
		{ name: 'lecturer', use: { storageState: 'tests/.auth/lecturer.json' }, grep: /@lecturer/ },
		{ name: 'expert', use: { storageState: 'tests/.auth/expert.json' }, grep: /@expert/ },
		{ name: 'guest', grep: /@guest/ }
	]
});
```

### .gitignore entries

```
.bdd/
tests/.auth/
```

### package.json scripts

```json
{
	"test:bdd": "bddgen && playwright test",
	"test:bdd:gen": "bddgen"
}
```

### .env.test (never commit)

```
BASE_URL=http://localhost:3000
STUDENT_EMAIL=student@test.com
STUDENT_PASSWORD=secret
LECTURER_EMAIL=lecturer@test.com
LECTURER_PASSWORD=secret
EXPERT_EMAIL=expert@test.com
EXPERT_PASSWORD=secret
```

**Tracer run**: write a single trivial `.feature` (one scenario, one step) and run `npm run test:bdd`. Fix any config errors before proceeding.

**Completion criterion**: `npm run test:bdd` runs without config errors.

## Phase 4 — Write Gherkin (page scope, UI systems)

> **API-only systems**: see [API variant](#api-only-variant) below.

One `.feature` file per page. Role tag on every feature drives storageState automatically — no auth step in Background.

```gherkin
@student
Feature: Thesis List
  As a Student
  I want to see all my submitted theses
  So that I can track their review status

  Background:
    Given a thesis "Introduction to ML" exists for Student
    And Student is on the Thesis List page

  Scenario: View submitted theses
    Then Student sees "Introduction to ML" listed

  Scenario: Open thesis detail
    When Student opens "Introduction to ML"
    Then Student is on the Thesis Detail page

  Scenario: Navigate to new submission
    When Student starts a new submission
    Then Student is on the Submit Thesis page

  Scenario: Access Thesis List unauthenticated
    When Guest navigates to the Thesis List
    Then Guest is redirected to the Login page
```

**Gherkin rules**:

- Role tag (`@student`, `@lecturer`) on every feature — drives auth, never put `Given [Actor] is authenticated` in Background
- Actor names in steps, not "user" or "I" generically
- Describe WHAT, never HOW — no button IDs, no CSS selectors, no field names
- `Background` holds minimum shared state only — use explicit `Given` steps, not hooks/tags, for data preconditions (PO must be able to read them)
- **Every exit from a page** (links, buttons, guards, error redirects) gets exactly one navigation scenario — assert only that the transition occurred (URL check), not destination content
- Terminal pages (confirmation, 404) have no navigation scenarios
- `Scenario Outline` for data-driven cases only

**Test isolation rule**: every entity created in a `Given` step uses a UUID-namespaced identifier to prevent cross-scenario interference in parallel runs. Store the mapping in the `names` fixture, and resolve it in later steps with `names.get(title) ?? title`. Global setup truncates test data before the suite.

**Completion criterion**: every page has a `.feature` file; every exit from each page has a navigation scenario; no scenario crosses page boundaries.

## Phase 5 — Generate step definitions (Screenplay Pattern)

### Layer rules

- **Steps** → delegate only. No raw Playwright calls. `When` steps call Tasks. `Then` steps call Questions. `Given` navigation steps call Interactions.
- **Tasks** → sequences of Interactions. Business intent, no selectors.
- **Questions** → call Interactions to locate elements and return Locators. `Then` steps assert with web-first `expect(locator)`, which retries. Never return snapshot values like `isVisible()` or `textContent()`, because they don't wait and cause flaky tests.
- **Interactions** → only layer that touches `page.getByTestId()`. Require `data-testid` attributes on HTML elements.

### Interaction

```typescript
// tests/interactions/thesis-rows.interaction.ts
import { Page } from '@playwright/test';

export const thesisRows = (page: Page) => page.getByTestId('thesis-row');
export const thesisByTitle = (page: Page, title: string) =>
	page.getByTestId('thesis-row').filter({ hasText: title });
```

### Question

```typescript
// tests/questions/thesis-list.question.ts
import { Actor } from '../fixtures/actor';
import { thesisByTitle } from '../interactions/thesis-rows.interaction';

export const listedThesis = (actor: Actor, title: string) => thesisByTitle(actor.page, title);
```

### Task

```typescript
// tests/tasks/open-thesis.task.ts
import { Actor } from '../fixtures/actor';
import { thesisByTitle } from '../interactions/thesis-rows.interaction';

export const openThesis = (title: string) => async (actor: Actor) => {
	await thesisByTitle(actor.page, title).click();
};
```

### Step definitions

```typescript
// tests/steps/thesis-list.steps.ts
import { createBdd } from 'playwright-bdd';
import { test, expect } from '../fixtures/index';
import { openThesis } from '../tasks/open-thesis.task';
import { listedThesis } from '../questions/thesis-list.question';
import { randomUUID } from 'crypto';

const { Given, When, Then } = createBdd(test);

Given('a thesis {string} exists for Student', async ({ request, names }, title: string) => {
	const unique = `${title}-${randomUUID()}`;
	const res = await request.post('/api/theses', { data: { title: unique, owner: 'student' } });
	expect(res.ok()).toBe(true);
	names.set(title, unique);
});

Given('Student is on the Thesis List page', async ({ student }) => {
	await student.page.goto('/thesis');
});

Then('Student sees {string} listed', async ({ student, names }, title: string) => {
	await expect(listedThesis(student, names.get(title) ?? title)).toBeVisible();
});

When('Student opens {string}', async ({ student, names }, title: string) => {
	await student.perform(openThesis(names.get(title) ?? title));
});

Then('Student is on the Thesis Detail page', async ({ student }) => {
	await expect(student.page).toHaveURL(/\/thesis\/[^/]+$/);
});

When('Guest navigates to the Thesis List', async ({ guest }) => {
	await guest.page.goto('/thesis');
});

Then('Guest is redirected to the Login page', async ({ guest }) => {
	await expect(guest.page).toHaveURL(/\/login/);
});
```

**Multi-role preconditions**: `Given Lecturer has published thesis "X"` = API call via `request` fixture, not a second browser. One Actor holds the browser per scenario.

**Browser-only state** (localStorage, sessionStorage — not auth): use `page.addInitScript()` in a `Given` step.

**Completion criterion**: every `Given/When/Then` in every `.feature` has a matching step; every step delegates to Task/Question/Interaction; no `page.locator`/`getByTestId` outside Interactions (web-first `expect(...)` in `Then` steps is allowed); no duplicate step texts across step files; `npm run test:e2e` is green.

## API-only variant

When the system has no UI, drop the Screenplay Pattern's Interaction and Actor layers.

- **Scope**: one `.feature` file per resource (`invoices.feature`, `workspaces.feature`)
- **No** role tags, no storageState, no navigation scenarios
- **Auth**: set `extraHTTPHeaders` (e.g. Bearer token from env var) in `playwright.config.ts` `use`, or the system's session cookie. For BFF systems, test through the BFF.
- **Steps**: use `request` fixture directly — no Actor, no Tasks. Keep the response in a scenario-scoped fixture, not a module-level variable, because module state leaks between scenarios in the same worker.

```gherkin
Feature: Invoices API

  Scenario: Create invoice
    When a POST to /api/invoices with valid data
    Then the response status is 201
    And the response body contains an invoice id

  Scenario: List invoices
    Given 3 invoices exist
    When a GET to /api/invoices
    Then the response contains 3 invoices
```

```typescript
// tests/steps/invoices-api.steps.ts
import { createBdd } from 'playwright-bdd';
import { test as base, expect } from '../fixtures/index';
import type { APIResponse } from '@playwright/test';

const test = base.extend<{ last: { response?: APIResponse } }>({
	last: async ({}, use) => use({})
});
const { When, Then } = createBdd(test);

When('a POST to /api/invoices with valid data', async ({ request, last }) => {
	last.response = await request.post('/api/invoices', { data: { amount: 100 } });
});

Then('the response status is {int}', async ({ last }, status: number) => {
	expect(last.response!.status()).toBe(status);
});
```

## Iteration

After the **tracer run** is green, repeat Phase 4→5 per page. Ask the user which page to prioritize next — order by user-facing risk, not alphabetical.
