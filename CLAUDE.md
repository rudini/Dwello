# Dwello

Web app for Swiss property managers (Liegenschaftsverwalter): buildings, apartments, tenants, contracts, invoices categorized by a local LLM, utility cost statements (Nebenkostenabrechnungen) with Swiss QR-bills. Single-user MVP, under 50 apartments.

Stack: SvelteKit + TypeScript + Tailwind (frontend and BFF) | ElysiaJS on Bun + Drizzle + PostgreSQL (`backend/`) | an LLM for invoice categorization (any OpenAI-compatible API, by default a local Ollama).

## Commands

Frontend (repo root):

```bash
bun run dev                         # dev server; needs the backend running
bunx vitest run                      # all unit tests once (bun run test starts watch mode)
bunx vitest run src/__tests__/x.test.ts   # one file; *.dom.test.ts run in jsdom (mounting, clicking), all others in node
bun run test:coverage               # with coverage floor, as in CI
bun run lint                        # ESLint, fails on warnings
bun run check                       # svelte-check incl. tests/ and *.config.ts
bun run test:e2e                    # acceptance tests, see tests/e2e/CLAUDE.md
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

## Design-Regeln

- **Target users:** private landlords with little experience who use Dwello a few times a year. Prefer guidance, plain words and confirmations over speed for experts.
- **Copy:** German, formal "Sie", Swiss "ss", short sentences, verbs on buttons; errors say what happened and what to do. Domain terms only from `UBIQUITOUS_LANGUAGE.md` (never edit it); missing terms get `TODO(fachlich prüfen)` and an entry in `docs/design/offene-punkte.md`. Explain terms with visible help text at the field, not tooltips.
- **Tokens are mandatory:** only the token classes from `docs/design/token-referenz.md` (`bg-surface`, `text-ink`, `border-line-strong`, `rounded-control`, `shadow-raised`, 8 px grid …) and the components in `src/lib/ui`. No raw colours, no arbitrary values (`w-[…]`), no `text-xs`, no other radii or shadows; dark mode comes from the tokens. `src/__tests__/design-guard.test.ts` and `tokens.test.ts` enforce this.
- **Screens:** one primary action per screen, at most two navigation levels, controls at least 48 px high, labels above fields, list rows whose whole area is one link named by the record, no sideways scrolling at 390 px. Irreversible actions confirm with their real consequence.
- **Anti-patterns:** gradients, glow, blur/glassmorphism, emoji as icons, shadow cards everywhere, decoration without function, external fonts or icon fonts, lorem ipsum, colour as the only carrier of information.
- **Process:** every UI change goes through `/tdd` (a failing test first) and `/ponytail`; new screens or states go into `tests/a11y/screens.json` and `accessibility.feature` (axe, light and dark, desktop, tablet and mobile, 0 violations, no rule exceptions); changes get an independent review. Decisions and history: `docs/design/design-decisions.md`, `docs/design/progress.md`.

## Workflow

1. **Acceptance test first (ATDD):** every feature or behavior change starts with a German scenario in `tests/e2e/features/*.feature`, tagged `@wip` (excluded from runs). Watch it fail for the right reason.
2. **`/tdd`:** drive the implementation red-green, one behavior at a time, through public interfaces. A test must fail before the code changes. Every bug fix gets a test that reproduces it first, at the lowest layer that can show it (unit, `*.pg.test.ts` or scenario).
3. **`/ponytail`:** keep the shortest diff that works; check the finished change against it.
   **Deep modules:** after each implementation step run `bun run deepcheck:audit` (silent when clean) and fix its findings before continuing; run `bun run deepcheck:scan` only when a codebase-wide review is requested (`tools/deepcheck/README.md`).
4. **Done:** remove `@wip` once the scenario is green. A feature is done when its scenario passes, not when unit tests pass.
5. **Plan:** log the task in `implementation_plan.md` (check the items, note the files changed). The file is long: read only its latest `## Session` section (`grep -n '^## Session' implementation_plan.md`) and add new work there. The phase table at the top is no longer maintained.

Before marking anything complete, all of these pass: `bun run test:coverage`, `bun run lint`, `bun run check`, `cd backend && bun run test && bun run type-check`, and the affected E2E scenarios.

## Gotchas

- **`bun run test`, not `bun test`:** Bun is the package manager everywhere, but the frontend runs on Node. In the repo root `bun test` starts Bun's own test runner instead of Vitest, without `vitest.config.ts` (no jsdom, no coverage floor).
- **Fallow gate:** a hook runs `fallow audit` before every `git commit` and `git push` and blocks the whole Bash command on new unused exports or files, duplication, or complexity/CRAP findings. Run git commands on their own, not chained after edits, and fix the reported finding (un-export, delete, split the function) rather than working around it. `bunx fallow audit` shows the findings before committing; CI runs the same audit.
- **Deepcheck gate:** a second hook (`.claude/hooks/deepcheck-gate.sh`) runs the changed-scope deepcheck before every `git commit` and `git push` and blocks new or worsened shallow modules (pass-through layers, thin facades); CI runs the same check (job "Deep modules"). Fix the design, not the numbers; a deliberate exception needs `// deepcheck-ignore-file -- reason`.
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
- `docs/design/token-referenz.md`: design tokens (colors, typography, spacing, radius, shadow) and components
- `docs/design/design-decisions.md`: design decisions of the 2026 redesign; open points in `docs/design/offene-punkte.md`
