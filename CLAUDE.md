# Dwello

Web app for Swiss property managers (Liegenschaftsverwalter): buildings, apartments, tenants, contracts, invoices categorized by a local LLM, utility cost statements (Nebenkostenabrechnungen) with Swiss QR-bills. Single-user MVP, under 50 apartments.

Stack: SvelteKit + TypeScript + Tailwind (frontend and BFF) | ElysiaJS on Bun + Drizzle + PostgreSQL (`backend/`) | a local LLM through Ollama for invoice categorization.

## Commands

Frontend (repo root):

```bash
npm run dev                         # dev server; needs the backend running
npx vitest run                      # all unit tests once (npm run test starts watch mode)
npx vitest run src/__tests__/x.test.ts   # one file; *.dom.test.ts run in jsdom (mounting, clicking), all others in node
npm run test:coverage               # with coverage floor, as in CI
npm run lint                        # ESLint, fails on warnings
npm run check                       # svelte-check incl. tests/ and *.config.ts
npm run test:e2e                    # acceptance tests, see tests/e2e/CLAUDE.md
```

Backend (`cd backend`): see `backend/CLAUDE.md`. Short form: `bun run dev:demo` (app with demo data), `bun run test`, `bun run type-check`.

PostgreSQL on localhost:5432 (user and password `dwello`) is required for backend tests and E2E. The test databases `dwello_test` and `dwello_e2e` are recreated automatically; the development database `dwello` stays untouched only through the test preload (see `backend/CLAUDE.md`).

## Architecture (BFF)

`Browser -> apiCall() (src/lib/api.ts) -> SvelteKit BFF (src/routes/api, src/routes/auth, src/lib/server) -> Elysia (backend/src/routes -> services) -> PostgreSQL`

- The BFF does OAuth, keeps the session JWT in HTTPOnly cookies and checks the XSRF token; the client never sees a token.
- The backend validates the JWT from the `Authorization` header and holds all business logic in `backend/src/services`.
- Pages load data in `+page.server.ts`; mapping and form handling live in `src/lib/server/*.ts`.

## Conventions

- **Language:** UI texts, Gherkin scenarios and test names in German (Swiss spelling, "ss" instead of "ß"); code, comments, commits and PR descriptions in English.
- **Domain terms:** use the words from `UBIQUITOUS_LANGUAGE.md` in code and scenarios.
- **Selectors:** `data-testid` in kebab-case with component context (`building-card-{id}`, `tenant-name-input`); no CSS selectors in tests.
- **No mock data in the app:** components and pages always use the real backend and database. Test doubles in tests follow `docs/test-pyramid.md`.
- **Commits:** Conventional Commits `<type>(<scope>): <subject>`, at most 50 characters, imperative, no period. Types: `feat`, `fix`, `docs`, `chore`. Scopes: `auth`, `buildings`, `apartments`, `tenants`, `contracts`, `invoices`, `statements`, `config`, `components`, `stores`, `styles`, `api`, `db`, `middleware`, `services`, `schema`, `docker`, `types`, `i18n`, `tests`, `ci`, `build`.

## Workflow

1. **Acceptance test first (ATDD):** every feature or behavior change starts with a German scenario in `tests/e2e/features/*.feature`, tagged `@wip` (excluded from runs). Watch it fail for the right reason.
2. **`/tdd`:** drive the implementation red-green, one behavior at a time, through public interfaces. A test must fail before the code changes. Every bug fix gets a test that reproduces it first, at the lowest layer that can show it (unit, `*.pg.test.ts` or scenario).
3. **`/ponytail`:** keep the shortest diff that works; check the finished change against it.
4. **Done:** remove `@wip` once the scenario is green. A feature is done when its scenario passes, not when unit tests pass.
5. **Plan:** log the task in `implementation_plan.md` (check the items, note the files changed). The file is long: read only its latest `## Session` section (`grep -n '^## Session' implementation_plan.md`) and add new work there. The phase table at the top is no longer maintained.

Before marking anything complete, all of these pass: `npm run test:coverage`, `npm run lint`, `npm run check`, `cd backend && bun run test && bun run type-check`, and the affected E2E scenarios.

## Gotchas

- **Fallow gate:** a hook runs `fallow audit` before every `git commit` and `git push` and blocks the whole Bash command on new unused exports or files, duplication, or complexity/CRAP findings. Run git commands on their own, not chained after edits, and fix the reported finding (un-export, delete, split the function) rather than working around it. `npx fallow audit` shows the findings before committing; CI runs the same audit.
- **API contracts:** frontend tests take backend responses from `tests/contracts/*.json`; `backend/src/__tests__/api-contracts.pg.test.ts` checks them against the real API. Changing an API response means updating its contract.
- **Coverage floors** in `vitest.config.ts` and `backend/scripts/coverage-check.ts` may not drop; the target is in `docs/test-pyramid.md`.

## Coding guidelines

- **Think before coding:** state assumptions; if a request has several readings, name them instead of picking silently; push back when a simpler approach exists.
- **Simplicity first:** the minimum code that solves the problem. No speculative features, abstractions for single use, configurability nobody asked for, or error handling for impossible cases.
- **Surgical changes:** touch only what the task needs; match the surrounding style; don't reformat or refactor adjacent code. Remove what your change made unused, leave pre-existing dead code unless asked.
- **Goal-driven:** turn the task into a verifiable check (a failing test) before writing the fix.

## Documentation (read when relevant)

- `docs/PRD-Dwello.md`: requirements and UI/UX of all features
- `docs/data-model.md`: database schema and relationships
- `docs/api-specification.md`: REST endpoints, auth, errors
- `docs/tech-stack.md`: architecture decisions, performance targets
- `README.md`: setup, Docker deployment, database and demo data commands
- `docs/test-pyramid.md`: test layers, runners, rules, coverage target
- `docs/migration-mva.md`: Minimum Viable Architecture: quality scenarios, their status, deferred decisions
- `docs/design_system.md`: colors, typography, components
- `requirements-prosa.md`: original requirements (German)
