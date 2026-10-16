---
name: bdd-acceptance
description: Write or change Dwello's Gherkin acceptance scenarios and their playwright-bdd steps in tests/e2e. Load before writing or changing a scenario (CLAUDE.md, Workflow 1), and when the user wants BDD tests, acceptance criteria or step files.
---

# BDD Acceptance Criteria

Gherkin `.feature` files that express business intent, backed by executable playwright-bdd steps structured with the Screenplay pattern of `tests/e2e/`.

## Dwello setup

playwright-bdd is already set up in this repo. **Extend the existing setup; never re-bootstrap it.**

- Config: `playwright.config.ts` — `defineBddConfig({ paths: ['tests/e2e/features/**/*.feature'], require: ['tests/e2e/fixtures/test.ts', 'tests/e2e/steps/**/*.ts'] })`, `tags: 'not @wip'`
- Layout and layers: Dwello's own lean Screenplay in `tests/e2e/` (`screenplay/` core with `Actor`, abilities, interactions and web questions; `targets/`, `tasks/`, `questions/`, `steps/`), described in `tests/e2e/CLAUDE.md` and enforced by `bun run lint`. Steps assert with `actor.sees(question)`, never `expect(locator)`.
- Run and the stack it starts: `tests/e2e/CLAUDE.md`, "Run".
- Auth: OAuth only (Google/Microsoft), BFF with HTTPOnly cookies. There is no password login and no storageState. `src/hooks.server.ts` requires a valid session JWT for every page except `/login`, `/auth/*` and `/health`; the `page` fixture adds a real session cookie (`fixtures/session.ts`), the `besucher` actor has none. There is no global-setup login, no `.env.test` credentials and no per-role project.
- Actor: single role **Liegenschaftsverwalter** (see `UBIQUITOUS_LANGUAGE.md`). Use no role tags. Unauthenticated scenarios belong in `authentication.feature`.
- UI copy is German. Match visible text exactly (e.g. "Neues Gebäude").
- Selectors: `data-testid` only (`CLAUDE.md`, "Conventions"); add missing ones to the Svelte components.
- No mocks: seed data through real backend endpoints, never `page.route()` fakes. The one exception, a failing request: `tests/e2e/CLAUDE.md`, "Rules", failure states.
- Before writing new steps, check `tests/e2e/steps/` for an existing step with the same text. playwright-bdd fails on duplicate step definitions.
- Do not stop for confirmations: actor and terms come from `UBIQUITOUS_LANGUAGE.md`; a missing term gets `TODO(fachlich prüfen, #<issue>)` and an issue (`CLAUDE.md`, "Open work"). The task or issue names the scenarios to write.

## Gherkin

- Actor names in steps (der Liegenschaftsverwalter), not "user" or "I".
- Describe what, not how: no button IDs, no CSS selectors, no field names.
- `Background` holds only the minimum shared state; data preconditions are explicit `Given` steps the product owner can read, not hooks or tags.
- `Scenario Outline` only for data-driven cases.
- Every exit from a page (links, buttons, guards, error redirects) gets exactly one navigation scenario that checks only that the move happened (e.g. «Dann ist der Liegenschaftsverwalter auf der Seite …» or «… auf der Detailseite von …»), not what the next page shows. Terminal pages (a confirmation, 404) have none.
- Isolation, negative checks, failure states and `@api`: `tests/e2e/CLAUDE.md`, "Rules".
