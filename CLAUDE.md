# Dwello

Web app for Swiss private landlords who manage their own rented property (in the app the Liegenschaftsverwalter; target users in "Design-Regeln"): buildings, apartments, tenants, contracts, invoices categorized by an LLM, utility cost statements (Nebenkostenabrechnungen) with Swiss QR-bills. Single-user MVP, under 50 apartments.

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
- **UI languages:** every UI text lives in `messages/{de,fr,it,en}.json` (Paraglide JS; German is the base and default, terms per language in `docs/design/i18n-begriffe.md`) and is shown with `m.key()` from `$lib/paraglide/messages`; never call a message at module level in server code (use a getter or function). `bun run i18n` regenerates `src/lib/paraglide/` (not committed). Every new or changed text goes into all four files in the same change: formal address (Sie, vous, Lei), verbs on buttons, Swiss terms; an unsure term gets an entry in `docs/design/offene-punkte.md`. A backend refusal the UI shows carries a code (`backend/src/services/coded-error.ts`) and a message `backend_<code>`, shown with `backendMessage()` from `$lib/backend-error`; never the backend's own text.
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
- **Process:** every UI change goes through `/tdd` (a failing test first) and `/ponytail`; new screens or states go into `tests/a11y/screens.json`, `accessibility.feature` and `sprachen-bildschirme.feature` (no German in fr/it/en) (axe, light and dark, desktop, tablet and mobile, 0 violations, no rule exceptions); reviews as in "Workflow", steps 4 to 7. Decisions and history: `docs/design/design-decisions.md`, `docs/archive/redesign/progress.md`.

## Workflow

1. **Acceptance test first (ATDD):** every feature or behavior change starts with a German scenario in `tests/e2e/features/*.feature`, tagged `@wip` (excluded from runs). Watch it fail for the right reason.
   If the change touches domain rules, amounts, PDFs or domain terms: before implementing, subagent `fach-reviewer` checks the scenario against `UBIQUITOUS_LANGUAGE.md`, `docs/nebenkostenabrechnung-anforderungen.md`, `docs/anforderungen-vertragsende.md` and the law on Fedlex (quoted verbatim). Fix findings first.
2. **`/tdd`:** drive the implementation red-green, one behavior at a time, through public interfaces. A test must fail before the code changes. Every bug fix gets a test that reproduces it first, at the lowest layer that can show it (unit, `*.pg.test.ts` or scenario).
3. **`/ponytail`:** keep the shortest diff that works; check the finished change against it.
   **Deep modules:** after each implementation step run `bun run deepcheck:audit` (silent when clean) and fix its findings before continuing; run `bun run deepcheck:scan` only when a codebase-wide review is requested (`tools/deepcheck/README.md`).
4. **Slice review:** after each slice (a green scenario or a coherent group of behaviors), once lint, the affected tests and `deepcheck:audit` are clean, run subagent `code-reviewer` (fresh context: requirement + diff only). Triage its findings (step 6). Continue only when no Blocker/Major is open (limit: step 7).
5. **Feature review:** when the scenario is green, start the app once with `docs/design/tools/persona-stack.sh`, then run in parallel, only where it applies, telling each subagent the app is running:
   - UI changed: subagent `persona`, once per affected persona from `docs/design/personas/README.md`.
   - Domain rules or terms changed: `fach-reviewer`.
   - Amounts, statements, PDFs or QR-bills changed: `daten-pruefer`.
   If you cannot start subagents, do not skip the reviews: list the missing ones under "Blocked on me".
6. **Findings:** every reviewer reports severity (Blocker / Major / Minor / Nit) plus evidence (file:line or reproduction steps). You save each report unchanged to `docs/reviews/<slice>-review-<n>.md`, `<slice>-fachreview-<n>.md` or `<slice>-datenpruefung-<n>.md` (personas write their own to `docs/design/personas/<persona>-<slice>.md`); the latest `## Session` of `implementation_plan.md` lists only ID, severity, status (open / fixed / rejected with reason) and the report path. Check a finding's evidence before acting on it; reject it with a reason when it does not hold. A fix that changes behavior gets a failing test first. Re-review only the delta and the open findings. Findings still open when the task ends go into `docs/design/offene-punkte.md`.
7. **Done:** remove `@wip` once the scenario is green. A feature is done when its scenario passes, not when unit tests pass, and when no Blocker/Major from `code-reviewer`, personas, `fach-reviewer` or `daten-pruefer` is open. Minors/Nits left unfixed go into `docs/design/offene-punkte.md`. A round is one run of one reviewer on one slice: if the same reviewer still reports an open Blocker/Major on the same slice after its 3rd round, stop, list the open findings under "Blocked on me", ask me.
8. **Plan:** at the start of a task, add its items as a checklist to the latest `## Session` of `implementation_plan.md` (a new session for a new task); tick each item when done, add anything new you find, note the files changed. When the task is done, move its session to `docs/archive/implementation-plan-verlauf.md`.

Open points live only in `docs/design/offene-punkte.md`: a point you find but do not fix goes there with an ID; a point you fix is removed there.

Keep going without asking while no input is needed; put status notes in the same message as your next action. Ask only when blocked, or before anything destructive (deleting data, force-push, changes outside this repo). Not destructive: recreating the databases `dwello_persona`, `dwello_test` and `dwello_e2e`, and files in the scratchpad.

End every run with three headings: **Blocked on me** (decisions, open Blocker/Major, new entries in `docs/design/offene-punkte.md`), **Changed** (files, commits), **Found** (findings by ID and status, what could not be confirmed).

Before marking anything complete, all of these pass: `bun run test:coverage`, `bun run lint`, `bun run check`, `cd backend && bun run test && bun run type-check`, and the affected E2E scenarios.

## Gotchas

- **Never `bun test` in the repo root:** Bun is the package manager everywhere, but the frontend runs on Node. There `bun test` starts Bun's own test runner instead of Vitest, without `vitest.config.ts` (no jsdom, no coverage floor). Use `bunx vitest run`.
- **Fallow gate:** a hook runs `fallow audit` before every `git commit` and `git push` and blocks the whole Bash command on new unused exports or files, duplication, or complexity/CRAP findings. Run git commands on their own, not chained after edits, and fix the reported finding (un-export, delete, split the function) rather than working around it. `bunx fallow audit` shows the findings before committing; CI runs the same audit.
- **Deepcheck gate:** a second hook (`.claude/hooks/deepcheck-gate.sh`) runs the changed-scope deepcheck before every `git commit` and `git push` and blocks new or worsened shallow modules (pass-through layers, thin facades); CI runs the same check (job "Deep modules"). Fix the design, not the numbers; a deliberate exception needs `// deepcheck-ignore-file -- reason`.
- **API contracts:** frontend tests take backend responses from `tests/contracts/*.json`; `backend/src/__tests__/api-contracts.pg.test.ts` checks them against the real API. Changing an API response means updating its contract.
- **Coverage floors** in `vitest.config.ts` and `backend/scripts/coverage-check.ts` may not drop; the target is in `docs/test-pyramid.md`.
- **Web search:** use `mmx search "<query>"` (MiniMax CLI, add `--output json` for parsing; at most 10 results, no paging) for current library docs, Swiss legal or tax rules and error messages. In cloud sessions the real key is a network secret for `api.minimax.io`; the environment's setup script installs the CLI and stores a placeholder key (`npm install -g mmx-cli && mmx config set --key api_key --value placeholder`), because mmx refuses to run without a local key.

## Coding guidelines

- **Before coding:** state assumptions; if a request has several readings, name them instead of picking silently; push back when a simpler approach exists.
- **Surgical changes:** touch only what the task needs; match the surrounding style; don't reformat or refactor adjacent code. Remove what your change made unused, leave pre-existing dead code unless asked.

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
