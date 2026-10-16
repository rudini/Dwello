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
bun run test:e2e                    # acceptance tests, see tests/e2e/CLAUDE.md (test:e2e:wip for @wip)
```

Backend (`cd backend`): see `backend/CLAUDE.md`. Short form: `bun run dev:demo` (app with demo data), `bun run test`, `bun test src/__tests__/x.pg.test.ts` (one file), `bun run type-check`.

PostgreSQL on localhost:5432 (user and password `dwello`) is required for backend tests and E2E. The test databases `dwello_test` and `dwello_e2e` are recreated automatically; the development database `dwello` stays untouched through the test preload, which `backend/bunfig.toml` sets for every `bun test` started in `backend/` itself (Bun reads `bunfig.toml` only from the working directory).

## Architecture (BFF)

`Browser -> apiCall() (src/lib/api.ts) -> SvelteKit BFF (src/routes/api, src/routes/auth, src/lib/server) -> Elysia (backend/src/routes -> services) -> PostgreSQL`

- The BFF does OAuth, keeps the session JWT in HTTPOnly cookies and checks the XSRF token; the client never sees a token.
- The backend validates the JWT from the `Authorization` header and holds all business logic in `backend/src/services`.
- Pages load data in `+page.server.ts`; mapping and form handling live in `src/lib/server/*.ts`.

## Conventions

- **Language:** UI texts, Gherkin scenarios and test names in German (Swiss spelling, "ss" instead of "ß"); code, comments, commits and PR descriptions in English.
- **UI languages:** every UI text lives in `messages/{de,fr,it,en}.json` (Paraglide JS; German is the base and default, terms and style per language in `docs/design/i18n-begriffe.md`, e.g. French guillemets with U+00A0 inside) and is shown with `m.key()` from `$lib/paraglide/messages`; never call a message at module level in server code (use a getter or function). `bun run i18n` regenerates `src/lib/paraglide/` (not committed). Every new or changed text goes into all four files in the same change: formal address (Sie, vous, Lei), verbs on buttons, Swiss terms; an unsure term gets an issue (labels `fachlich`, `entscheiden`; see "Open work"). A backend refusal the UI shows carries a code (`backend/src/services/coded-error.ts`) and a message `backend_<code>`, shown with `backendMessage()` from `$lib/backend-error`; never the backend's own text.
- **Domain terms:** use the words from `UBIQUITOUS_LANGUAGE.md` in code and scenarios.
- **Selectors:** `data-testid` in kebab-case with component context (`building-card-{id}`, `tenant-name-input`); no CSS selectors in tests.
- **No mock data in the app:** components and pages always use the real backend and database. Test doubles in tests follow `docs/test-pyramid.md`.
- **Commits:** Conventional Commits `<type>(<scope>): <subject>`, at most 50 characters, imperative, no period. Types: `feat`, `fix`, `docs`, `chore`. Scopes: `auth`, `buildings`, `apartments`, `tenants`, `contracts`, `invoices`, `statements`, `categories`, `privacy`, `config`, `components`, `stores`, `styles`, `api`, `db`, `middleware`, `services`, `schema`, `docker`, `types`, `i18n`, `tests`, `ci`, `build`.

## Design-Regeln

- **Target users:** private landlords with little experience who use Dwello a few times a year. Prefer guidance, plain words and confirmations over speed for experts.
- **Copy:** German, formal "Sie", Swiss "ss", short sentences, verbs on buttons; errors say what happened and what to do. Domain terms only from `UBIQUITOUS_LANGUAGE.md` (never edit it); missing terms get `TODO(fachlich prüfen, #<issue>)` and an issue (see "Open work"). A term the product owner decided in the issue the task closes gets no marker (CI would refuse the pull request): the task finishes with that glossary edit under "Blocked on me", and its pull request is merged only after the product owner made the edit. Explain terms with visible help text at the field, not tooltips.
- **Tokens are mandatory:** only the token classes from `docs/design/token-referenz.md` (`bg-surface`, `text-ink`, `border-line-strong`, `rounded-control`, `shadow-raised`, 8 px grid …) and the components in `src/lib/ui`. No raw colours, no arbitrary values (`w-[…]`), no `text-xs`, no other radii or shadows; dark mode comes from the tokens. `src/__tests__/design-guard.test.ts` and `tokens.test.ts` enforce this.
- **Screens:** one primary action per screen, at most two navigation levels, controls at least 48 px high, labels above fields, list rows whose whole area is one link named by the record, no sideways scrolling at 390 px. Irreversible actions confirm with their real consequence.
- **Anti-patterns:** gradients, glow, blur/glassmorphism, emoji as icons, shadow cards everywhere, decoration without function, external fonts or icon fonts, lorem ipsum, colour as the only carrier of information.
- **Process:** every UI change loads the skills `tdd` and `ponytail` (Workflow 2, 3). A new screen or state (also a page a `+server.ts` route answers, e.g. a refusal opened in a tab) goes into `tests/a11y/screens.json` (with a meaning in `stateMeanings`), `accessibility.feature` and `sprachen-bildschirme.feature`, once per place it appears (each page, each wizard step); axe runs light and dark on desktop, tablet and mobile with 0 violations and no rule exceptions, and fr/it/en show no German. Decisions and history: `docs/design/design-decisions.md`, `docs/archive/redesign/progress.md`.

## Workflow

**Done means:**
- the scenario passes without `@wip` (or the change has `No scenario: <reason>`), and every new test was seen red (steps 1, 2);
- no Blocker/Major from `code-reviewer`, personas, `fach-reviewer` or `daten-pruefer` is open, except one that needs a product decision or existed before the change: those go under "Blocked on me" and become open work, as do Minors/Nits left unfixed (skill `slice-review`, "Triage");
- "Before marking anything complete" passes;
- the session is archived (step 8) and the pull request merged (step 9), or what holds it is under "Blocked on me".

1. **Acceptance test first (ATDD):** every feature or behavior change, including a bug fix a user can see, starts with a German scenario in `tests/e2e/features/*.feature`, tagged `@wip` (excluded from runs). Write its steps before the code and watch it fail at the missing behavior, not at a missing step; note the failing line in the slice's commit message (`Red: <scenario> – <assertion>`). A state only a failing request reaches is answered with an error status at the browser boundary (`docs/test-pyramid.md`; so not `@api`); a state the E2E stack cannot produce gets a lower-layer test and `No scenario: <reason>` (`tests/e2e/CLAUDE.md`, "No scenario"). A change to the allocability prompt also runs `bun run llm:eval` before and after (`backend/CLAUDE.md`).
   A change to domain rules (a prompt sent to the KI included), amounts, PDFs, domain terms or legal texts (data that leaves the server in a new way makes the privacy statement one): commit the `@wip` scenario locally and have `fach-reviewer` review it before implementing. Until it reports back, write tests and E2E steps and watch them fail, but turn none green: no production code, no texts in `messages/*.json`; fix its findings before the first test turns green.
2. **`/tdd`:** load the skill `tdd` before the first test of a slice and drive the implementation red-green, one behavior at a time, through public interfaces. Note each red in the commit message (`Red: <test> – <message>`); a test written after the code shows its red by taking the code out again. Every bug fix also gets a test that reproduces it at the lowest layer that can show it (unit, DOM or `*.pg.test.ts`).
3. **`/ponytail`:** keep the shortest diff that works (load the skill `ponytail` before writing code); `code-reviewer` applies `ponytail-review` to the slice.
   **Deep modules:** the commit hook runs the changed-scope check; run `bun run deepcheck:audit` by hand only to see findings before committing; run `bun run deepcheck:scan` only when a codebase-wide review is requested (`tools/deepcheck/README.md`).
4. **Slice review:** after each slice (a green scenario or a coherent group of behaviors), once lint and the affected tests are clean, commit it locally and run subagent `code-reviewer` with the requirement, the commit range and the checks you ran on that commit with their exit codes. Load the skill `slice-review` before starting any reviewer subagent: worktree, prompt, report path, triage. Continue only when no Blocker/Major is open.
5. **Feature review:** when the scenario is green, start `docs/design/tools/persona-stack.sh` once and run, in parallel, what applies:
   - what a screen shows changed (UI or backend): `persona`, the personas `docs/design/personas/README.md` names ("Which personas": at most two unless the change adds a screen or flow), each with a task on the change; how to run them (failure states, saving, languages, PDFs): there, "Running a review";
   - domain rules, terms or legal texts changed since the review of step 1: `fach-reviewer`;
   - amounts, statements, PDFs or QR-bills changed: `daten-pruefer`, after the persona whose records it needs.
   If you cannot start subagents, list the missing reviews under "Blocked on me".
6. **Findings:** check a finding's evidence before acting on it, and reject it with a reason when it does not hold. A fix that changes behavior (a text the user sees included) gets a failing test first. Reports, plan lines, persona re-runs: skill `slice-review`, "Triage".
7. **Rounds:** a reviewer gets at most three rounds per slice, and only a fix that answers a Blocker/Major gets a re-review; a Blocker/Major still open after the third round goes under "Blocked on me". Before each push, one closing `code-reviewer` round reviews the code not reviewed yet (skill `pull-request`). At the end of a task that changed the app, its tests or tooling, load the skill `workflow-review`.
8. **Plan:** at the start of a task, move a finished earlier session (every item ticked) to `docs/archive/implementation-plan-verlauf.md` (`open-work.test.ts` allows one session), then add the task's items as a checklist to a new `## Session` of `implementation_plan.md` (a request that covers several issues is one session, with one pull request per issue). Tick each item when done, add anything new you find, note the files changed. When the task is done, move its session to the archive before the final commit.
9. **Pull request:** commit locally per slice and push nothing before "Done means" holds up to the merge. Then load the skill `pull-request`: it pushes, opens the pull request, drives CI and merges.

**When to ask.** Keep going without asking while no input is needed; put status notes in the same message as your next action. When something waits for my approval or a decision, say so once under "Blocked on me" and stop, without asking again. Ask only:
- when you are blocked, or the decision is mine: an `entscheiden` issue, or an open one on the same data that would change the outcome ("Open work"); a change to a text or value an issue decided, beyond what "Coding guidelines" allows; a Blocker/Major still open after the third round; two instructions that disagree when following one drops a finish-line item;
- before work outside the request (porting to another branch, an area the request does not name), or a fix of a large duplication finding in code the change only touches (skill `commit-gates`);
- before anything destructive: deleting data, a force-push, changes outside this repo, editing an applied migration (`backend/CLAUDE.md`), starting a branch anew when unmerged commits would be lost (Gotchas, "Branches"). Not destructive: recreating the databases `dwello_persona`, `dwello_test` and `dwello_e2e`, files in the scratchpad, and pushing this branch and its pull request under step 9;
- before a push or pull request where I said to only commit, a push to `main`, merging with a red check (also one red on `main`), a fourth round of CI fixes, merging while a Blocker/Major is open.

End every run with three headings: **Blocked on me** (decisions, open Blocker/Major, new issues and rows in `docs/design/offene-punkte.md`), **Changed** (files, commits), **Found** (findings by ID and status, issues closed and opened, what could not be confirmed).

Before marking anything complete, all of these pass: `bun run test:coverage`, `bun run lint`, `bun run check`, `cd backend && bun run test && bun run type-check`, and the affected E2E scenarios.

## Open work

- **Functional points** (domain, features, bugs) are GitHub issues in `rudini/Dwello`, one finishable task each, written with a template from `.github/ISSUE_TEMPLATE/`, with the topic label `fachlich`, `produkt` or `bug`, plus `entscheiden` while a product-owner decision is missing. **Non-functional points** (security, operations, reliability, performance, usability and accessibility, maintainability) stay in `docs/design/offene-punkte.md` until the quality requirements are set up. There is no other list (workflow notes stay in their files).
- A point you find but do not fix becomes an issue (or, if non-functional, a row in `offene-punkte.md`) in the same task; persona "Beobachtungen" that existed before go into one collected issue or row per task. Search the open issues first (`search_issues`) and add to a matching one instead of opening a duplicate. A code marker names its issue: `TODO(fachlich prüfen, #42)`; `grep -rn "#42" src backend tests` finds them. `src/__tests__/open-work.test.ts` and CI (`tools/open-work/check-issues.mjs`) check the markers, that a pull request closes no issue a marker still names, the label `entscheiden`, and that a pull request closing an issue with app changes changes a scenario (or says `No scenario: <reason>`).
- An issue is ready when its decisions are in its text; an `entscheiden` issue is not. When the product owner confirms a section "Proposed (confirm before starting)", rename it "Decided (product owner)" and remove the label. A decision issue (template "Decision") is closed once the decision is recorded in it and, if code must change, its implementation issue exists.
- Working on an issue ("Setze #n um"): its "Done means" plus this workflow is the finish line; its bullets become the plan checklist and the scenarios of step 1. The pull request says `Fixes #n` (`Refs #n` in the KI case, `backend/CLAUDE.md`).
- Read and write issues with the GitHub MCP tools; in cloud sessions `gh issue view` can fail, `gh api repos/rudini/Dwello/issues/<n>` works.

## Gotchas

- **Never `bun test` in the repo root:** the frontend runs on Node, and there `bun test` starts Bun's own runner without `vitest.config.ts` (no jsdom, no coverage floor). Use `bunx vitest run`.
- **Commit gates:** three hooks (fallow, deepcheck, commit subject) check every `git commit` and `git push` and block the whole Bash command, its edits and `git add` included: stage and commit in separate commands, and after a block check `git show --stat HEAD`. Fix the finding, not the gate (skill `commit-gates`); CI runs fallow and deepcheck again.
- **One build:** `bun run test:e2e` builds the frontend into `build/` and its servers load their pages from there; `docs/design/tools/persona-stack.sh` builds into its own `/tmp/persona-app` (`BUILD_DIR`, `svelte.config.js`), and its KI stand-in on 2528, so E2E may run while personas run (both compete for the machine: give E2E a longer Bash timeout). Stop their servers by port (`fuser -k 3300/tcp`), never with `pkill -f <pattern>`: the pattern is in the command's own shell too, which it kills.
- **API contracts:** a frontend test that reads a backend response takes it from `tests/contracts/*.json`, also when the response itself is unchanged (add a contract when there is none); `backend/src/__tests__/api-contracts.pg.test.ts` checks them against the real API. Changing an API response means updating its contract.
- **Coverage floors** in `vitest.config.ts` and `backend/scripts/coverage-check.ts` may not drop; the target is in `docs/test-pyramid.md`.
- **Formatting:** run `prettier --write` only on files you create, never on a directory: many files are not Prettier-clean. In a file you change, format only your own lines (`bunx prettier <file> | diff <file> -`).
- **Branches:** commit only on a named branch, never on a detached HEAD (only a read-only review worktree may be detached). A session or subagent you start that commits gets its own branch; no session pushes to another's branch. At the start of a task, `git fetch origin main`: if the branch's pull request is merged and `git merge-base --is-ancestor HEAD origin/main` holds, `git switch -C <branch> origin/main` before the first change; if it is only behind, merge `origin/main` first. After merging a newer `main` with conflicts in app code, run `code-reviewer` on the merge commit.
- **Cloud sessions:** `.claude/hooks/session-start.sh` installs dependencies, starts PostgreSQL with the role `dwello` and, when Playwright expects another Chromium build than the image has, sets `PLAYWRIGHT_BROWSERS_PATH` to a shim. If E2E cannot start a browser or reach the database, run it again.
- **Web search:** `mmx search "<query>"` (MiniMax CLI, `--output json` for parsing, at most 10 results) for current library docs, Swiss legal or tax rules and error messages; in cloud sessions its key is a network secret for `api.minimax.io`, and the setup script stores a placeholder key, because mmx refuses to run without one.

## Coding guidelines

- **Before coding:** state assumptions; if a request has several readings, name them instead of picking silently; when two instructions (this file, an issue, a template) disagree, say which you follow and why before starting ("When to ask"); when an issue's text is wrong in a detail that does not change the task (a cause it names wrongly; a prescribed text that sends the landlord to a place the app does not have, shortened by that place only), follow the code and say so in the pull request (and in a comment if the issue stays open); any other change to a decided text or value is mine; push back when a simpler approach exists.
- **Stay in scope:** do what the request names; work outside it is asked first ("When to ask") or becomes open work.
- **One mapper per response:** a backend response used by several loads gets one mapper in `src/lib/server/<area>.ts`; reuse it instead of copying its fields or passing the response on untyped.
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
- `docs/design/design-decisions.md`: design decisions of the 2026 redesign; open work in GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional)
