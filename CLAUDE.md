# Dwello

Web app for Swiss private landlords who manage their own rented property (in the app the Liegenschaftsverwalter; target users in "Design-Regeln"): buildings, apartments, tenants, contracts, invoices categorized by an LLM, utility cost statements (Nebenkostenabrechnungen) with Swiss QR-bills. Single-user MVP, under 50 apartments.

Stack: SvelteKit + TypeScript + Tailwind (frontend and BFF) | ElysiaJS on Bun + Drizzle + PostgreSQL (`backend/`) | an LLM for invoice categorization (any OpenAI-compatible API, by default a local Ollama).

## Commands

Frontend (repo root):

```bash
bun run dev                         # dev server; needs the backend running
bunx vitest run                      # all unit tests once (bun run test starts watch mode)
bunx vitest run src/__tests__/x.test.ts   # one file; *.dom.test.ts run in jsdom (mounting, clicking), all others in node; a test using runes ($state) is *.svelte.dom.test.ts
bunx vitest run --changed origin/main   # tests that import a changed file (a test that reads one as text: name it)
bun run test:coverage               # with coverage floor, as in CI
bun run lint                        # ESLint, fails on warnings
bun run check                       # svelte-check incl. tests/ and *.config.ts
bun run test:e2e                    # acceptance tests, see tests/e2e/CLAUDE.md (test:e2e:wip for @wip)
```

Backend (`cd backend`): see `backend/CLAUDE.md`. Short form: `bun run dev:demo` (app with demo data), `bun run test`, `bun test src/__tests__/x.pg.test.ts` (one file), `bun run type-check`.

PostgreSQL on localhost:5432 (user and password `dwello`) is required for backend tests and E2E; the test databases are recreated automatically and the development database stays untouched (`backend/CLAUDE.md`, `tests/e2e/CLAUDE.md`).

## Architecture (BFF)

`Browser -> apiCall() (src/lib/api.ts) -> SvelteKit BFF (src/routes/api, src/routes/auth, src/lib/server) -> Elysia (backend/src/routes -> services) -> PostgreSQL`

- The BFF does OAuth, keeps the session JWT in HTTPOnly cookies and checks the XSRF token; the client never sees a token.
- The backend validates the JWT from the `Authorization` header and holds all business logic in `backend/src/services`.
- Pages load data in `+page.server.ts`; mapping and form handling live in `src/lib/server/*.ts`.

## Conventions

- **Language:** UI texts, Gherkin scenarios and test names in German (Swiss spelling, "ss" instead of "ß"); code, comments, commits and PR descriptions in English.
- **UI languages:** every UI text lives in `messages/{de,fr,it,en}.json` (Paraglide JS, German the base; terms and style per language: `docs/design/i18n-begriffe.md`) and is shown with `m.key()` from `$lib/paraglide/messages`, never called at module level in server code. `bun run i18n` regenerates `src/lib/paraglide/` (not committed). Every new or changed text goes into all four files in the same change; an unsure term gets an issue. A backend refusal the UI shows carries a code (`backend/src/services/coded-error.ts`) and a message `backend_<code>`, shown with `backendMessage()` from `$lib/backend-error`, never the backend's own text.
- **Domain terms:** use the words from `UBIQUITOUS_LANGUAGE.md` in code and scenarios.
- **Selectors:** `data-testid` in kebab-case with component context (`building-card-{id}`, `tenant-name-input`); no CSS selectors in tests.
- **No mock data in the app:** components and pages always use the real backend and database. Test doubles in tests follow `docs/test-pyramid.md`.
- **Commits:** Conventional Commits `<type>(<scope>): <subject>`, at most 50 characters, imperative, no period. Types: `feat`, `fix`, `docs`, `chore`. Scopes: `auth`, `buildings`, `apartments`, `tenants`, `contracts`, `invoices`, `statements`, `categories`, `privacy`, `config`, `components`, `stores`, `styles`, `api`, `db`, `middleware`, `services`, `schema`, `docker`, `types`, `i18n`, `tests`, `ci`, `build`.

## Design-Regeln

- **Target users:** private landlords with little experience who use Dwello a few times a year. Prefer guidance, plain words and confirmations over speed for experts.
- **Copy:** German, formal "Sie", Swiss "ss", short sentences, verbs on buttons; errors say what happened and what to do. Domain terms only from `UBIQUITOUS_LANGUAGE.md` (edit it only for the rows the issue's «Decided (product owner)» names, and say so in the pull request); missing terms get `TODO(fachlich prüfen, #<issue>)` and an issue (see "Open work"). A term the product owner decided in the issue the task closes gets no marker (skill `pull-request`). Explain terms with visible help text at the field, not tooltips.
- **Tokens are mandatory:** only the token classes from `docs/design/token-referenz.md` (`bg-surface`, `text-ink`, `border-line-strong`, `rounded-control`, `shadow-raised`, 8 px grid …) and the components in `src/lib/ui`. No raw colours, no arbitrary values (`w-[…]`), no `text-xs`, no other radii or shadows; dark mode comes from the tokens. `src/__tests__/design-guard.test.ts` and `tokens.test.ts` enforce this.
- **Screens:** one primary action per screen, at most two navigation levels, controls at least 48 px high, labels above fields, list rows whose whole area is one link named by the record, no sideways scrolling at 390 px. Irreversible actions confirm with their real consequence.
- **Anti-patterns:** gradients, glow, blur/glassmorphism, emoji as icons, shadow cards everywhere, decoration without function, external fonts or icon fonts, lorem ipsum, colour as the only carrier of information.
- **Process:** a new screen or state (also a page a `+server.ts` route answers, e.g. a refusal opened in a tab) goes into `tests/a11y/screens.json` (with a meaning in `stateMeanings`), `accessibility.feature` and `sprachen-bildschirme.feature`, once per place it appears (each page, each wizard step), and once per variant with its own controls (a change that makes an existing state show another variant keeps a row for each); a screen's first state is `default`; axe runs light and dark on desktop, tablet and mobile with 0 violations and no rule exceptions, and fr/it/en show no German. Decisions and history: `docs/design/design-decisions.md`, `docs/archive/redesign/progress.md`.

## Workflow

**Done means:**
- the scenario passes without `@wip` (or the change has `No scenario: <reason>`), and every new test was seen red, except one that pins kept behaviour (steps 1, 2);
- no Blocker/Major from `code-reviewer`, personas, `fach-reviewer` or `daten-pruefer` is open, except one that needs a product decision (it contradicts what the issue decided) or existed before the change (it shows on the base commit too, and the change does not make it more visible or contradictory; one a persona meets in its task on this change counts as more visible): those go under "Blocked on me" and become open work; a Minor/Nit is fixed when trivial, else it stays in its report;
- "Before marking anything complete" passes;
- the plan's session is moved to the archive (step 8; with several pull requests, before the last one) and the pull request merged on green CI (step 9), or what holds it is under "Blocked on me".

1. **Acceptance test first (ATDD):** every feature or behavior change, including a bug fix a user can see, starts with a German scenario in `tests/e2e/features/*.feature`, tagged `@wip` (excluded from runs); load the skill `bdd-acceptance` before writing it. Write its steps before the code and watch it fail at the missing behavior, not at a missing step. A state only a failing request reaches gets its scenario too (`tests/e2e/CLAUDE.md`, "Rules", failure states); a state the E2E stack cannot produce gets a lower-layer test and `No scenario: <reason>` (`tests/e2e/CLAUDE.md`, "No scenario"). A change to the allocability prompt also runs `bun run llm:eval` before and after (`backend/CLAUDE.md`).
   **Scenarios are the specification:** a scenario without `@wip` on `main` must keep holding; when it fails, fix the code, not the scenario. Changing it (any changed or removed line, tagging it `@wip`, a step definition that checks less or something else) needs my approval: an issue whose «Decided (product owner)» decides the change, and `Spec change approved: #<n>` in the pull request text (CI checks it); without one, open or extend an issue (`needs-decision`) naming the scenario and the proposed change, and stop. A `@wip` scenario that is new or `@wip` on `main`, a new scenario and a new Examples row are free (`tests/e2e/CLAUDE.md`, "Rules").
   A change to domain rules (a prompt sent to the KI included), amounts, PDFs, domain terms or legal texts (data that leaves the server in a new way makes the privacy statement one): commit the `@wip` scenario locally and have `fach-reviewer` review it before implementing. Until it reports back, write tests and E2E steps and watch them fail, but turn none green: no production code, no texts in `messages/*.json`; fix its findings before the first test turns green. A finding that waits for a product decision gets its tests after the decision.
2. **`/tdd`:** load the skill `tdd` before the first test of a slice and drive the implementation red-green, one behavior at a time, through public interfaces. A test must fail before the code changes; one written after the code shows its red by taking the code out again. A test or scenario that pins behaviour the base commit already shows and the change keeps (or that an issue asks to pin), never one of a bug fix, needs no red run; the commit that adds it says so in its message. A scenario added for a fix whose lower-layer test was seen red needs no red run of its own. Every bug fix also gets a test that reproduces it first, at the lowest layer that can show it (unit, DOM or `*.pg.test.ts`). The commit hook runs testcheck on changed test files (tests that can pass without checking what they claim, titles that do not say what their test checks); `bun run testcheck:audit` shows its findings before committing (`tools/testcheck/README.md`).
3. **`/ponytail`:** keep the shortest diff that works (load the skill `ponytail` before writing code); `code-reviewer` applies `ponytail-review` to the slice.
   **Deep modules:** the commit hook runs the changed-scope check; run `bun run deepcheck:audit` by hand only to see findings before committing; run `bun run deepcheck:scan` only when a codebase-wide review is requested (`tools/deepcheck/README.md`).
4. **Slice review:** after each slice (a green scenario or a coherent group of behaviors), once lint and the affected tests are clean, commit it locally and run subagent `code-reviewer` with the requirement, the commit range and the checks you ran on that commit. Load the skill `slice-review` before starting any reviewer subagent: worktree, prompt, report path, triage. Keep working while it runs; the next review or push waits until none of its Blockers/Majors is open.
5. **Feature review:** when the scenario is green, start `docs/design/tools/persona-stack.sh` once and run, in parallel, what applies:
   - UI changed, or what a screen shows changed (also through a backend change): `persona`, which ones and how to run them: `docs/design/personas/README.md`; none for a text the issue decided whose `fach-reviewer` round read it in all four languages;
   - domain rules, terms or legal texts changed since the review of step 1: `fach-reviewer`;
   - amounts, statements, PDFs or QR-bills changed: `daten-pruefer`, after the persona whose records it needs.
   If you cannot start subagents, hand each prompt to the session that started you (skill `slice-review`, "Hand-over"); with none, push, open the pull request as a draft and list the missing reviews under "Blocked on me".
6. **Findings:** check a finding's evidence before acting on it, and reject it with a reason when it does not hold. A fix that changes behavior (a text the user sees included) gets a failing test first (the exception for reviewed translation wording, reports, persona re-runs: skill `slice-review`, "Triage").
7. **Rounds:** a reviewer gets at most three rounds per slice (the closing round before a push is a slice of its own, and so is the `fach-reviewer` review of step 1 apart from that of step 5), and only a fix that answers a Blocker/Major gets a re-review; a Blocker/Major still open after the third round goes under "Blocked on me". Before each push, one closing `code-reviewer` round reviews the code not reviewed yet, Minor/Nit fixes included; reports, the plan, the archive, a clean merge of `main` and a test-only CI fix need none of their own (skill `pull-request`).
8. **Plan:** the task's checklist, kept as the header of `implementation_plan.md` says (start, during, end, parallel sessions); when a rule gets in the way, add an item «Workflow note: …» at once (skill `workflow-review`); at the end load `workflow-review` when it applies and archive the session before the final commit.
9. **Pull request:** commit locally per slice and push nothing before "Done means" holds up to the merge (the draft of step 5 aside). Then load the skill `pull-request`: it pushes, opens the pull request, drives CI and merges. A stop hook outside this repo (`~/.claude/stop-hook-git-check.sh`) may ask to commit, amend or push earlier: it overrides neither step 4 nor this step.

**When to ask.** Keep going without asking while no input is needed; put status notes in the same message as your next action. When something waits for my approval or a decision, say so once under "Blocked on me" and stop, without asking again. A decision of mine stays settled until I take it up again or point out a problem with it; this does not hold for reviews, where a later round may show an earlier one wrong. Ask only:
- when a request or requirement has several readings that change the result, or an issue's "Stop and ask" applies;
- when you are blocked, or the decision is mine: a `needs-decision` issue, or an open one on the same data that would change the outcome (skill `issue-work`); a change to a text or value an issue decided, beyond what "Coding guidelines" allows; a change to a scenario that is not `@wip` on `main` (step 1); a Blocker/Major still open after the third round; two instructions that disagree when following one drops a finish-line item;
- before work outside the request (porting to another branch, an area the request does not name), or a fix of a duplication finding in code the change only touches unless it is small and changes no behavior (skill `commit-gates`);
- before anything destructive: deleting data, a force-push, changes outside this repo, editing an applied migration (`backend/CLAUDE.md`), starting a branch anew when unmerged commits would be lost (Gotchas, "Branches"). Not destructive: recreating the databases `dwello_persona`, `dwello_test` and `dwello_e2e`, files in the scratchpad, and pushing this branch and its pull request under step 9;
- before a push or pull request where I said to only commit, a push to `main`, merging with a red check of the pull request, or while `main` is red in a test or file the pull request touches (the fix of a red `main`, skill `pull-request`, "After the merge", merges like any other pull request), a fourth round of CI fixes, merging while a Blocker/Major is open.

End every run with three headings: **Blocked on me** (decisions, open Blocker/Major, new issues), **Changed** (files, commits), **Found** (findings by ID and status, issues closed and opened, what could not be confirmed and where you looked).

Before marking anything complete, all of these pass: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, the tests the change affects, also those that read a changed file (`bunx vitest run <files>`, `cd backend && bun test <files>`; for rule files `open-work`, `commit-msg-gate`, `check-issues` and deepcheck `readme`), the affected E2E scenarios, and Prettier on the files added since `origin/main`, as CI runs it (`git diff --name-only --diff-filter=A -z origin/main... | xargs -0 -r bunx prettier --check --ignore-unknown`). CI runs the full suites with the coverage floors before the merge.

## Open work

- **Open work** is GitHub issues in `rudini/Dwello`, one finishable task each, written with a template from `.github/ISSUE_TEMPLATE/`, plus `needs-decision` while a product-owner decision is missing. **Functional points** (domain, features, bugs) carry the topic label `domain`, `product` or `bug`; **non-functional points** carry one ISO 25010 category label: `nfr:security`, `nfr:reliability`, `nfr:performance`, `nfr:usability` (accessibility included), `nfr:maintainability` (tests, docs, refactoring), `nfr:portability` (installation, platforms) or `nfr:compatibility` (template `nfr.md`). There is no other list (workflow notes stay in their files; the former `offene-punkte.md` is in `docs/archive/` with the issue of each row).
- A point you find but do not fix becomes an issue in the same task; from reviews only the two kinds of Blocker/Major "Done means" names, and a Minor that two or more personas meet in the same place (skill `slice-review`). Search the open issues first (`search_issues`) and add to a matching one instead of opening a duplicate. A code marker names its issue: `TODO(fachlich prüfen, #42)` (`grep -rn "#42" src backend tests`); `open-work.test.ts` and CI (`tools/open-work/check-issues.mjs`) check markers, labels, that a pull request closes no issue a marker still names, and that one closing an issue with app changes changes a scenario or says `No scenario: <reason>`.
- Starting an issue ("Setze #n um"), recording a decision in it or closing it: skill `issue-work`.

## Gotchas

- **Never `bun test` in the repo root:** the frontend runs on Node, and there `bun test` starts Bun's own runner without `vitest.config.ts` (no jsdom, no coverage floor). Use `bunx vitest run`.
- **Commit gates:** four hooks (fallow, deepcheck, testcheck, commit subject) check every `git commit` and `git push` and block the whole Bash command, its edits and `git add` included: stage and commit in separate commands, and after a block check `git show --stat HEAD`. Fix the finding, not the gate (skill `commit-gates`); CI runs fallow, deepcheck and testcheck again.
- **API contracts:** a frontend test that reads a backend response takes it from `tests/contracts/*.json`, also when the response itself is unchanged (add a contract when there is none); `backend/src/__tests__/api-contracts.pg.test.ts` checks them against the real API. Changing an API response means updating its contract.
- **Coverage floors** in `vitest.config.ts` and `backend/scripts/coverage-check.ts` may not drop; the target is in `docs/test-pyramid.md`.
- **Formatting:** run `prettier --write` only on files you create, never on a directory: many files are not Prettier-clean. In a file you change, format only your own lines (`bunx prettier <file> | diff <file> -`), one file per command (an isolated worktree refuses loops).
- **Branches:** commit only on a named branch, never on a detached HEAD (only a read-only review worktree may be detached). A session or subagent you start that commits gets its own branch; no session pushes to another's branch. At the start of a task, `git fetch origin main`: if the branch's pull request is merged and `git merge-base --is-ancestor HEAD origin/main` holds, `git switch -C <branch> origin/main` before the first change; if it is only behind, merge `origin/main` first. Later, merge `main` once right before the first push; the closing round reviews the merge commit with the rest when it resolved a conflict in app code (skill `pull-request`).
- **Cloud sessions:** several sessions in one container share the scratchpad: start each file there with your session or worker name (`w2-e2e.log`).
- **Context:** every model call reads the whole context again, so what enters it is paid on every later call. Read the lines you need (`grep -n`, `Read` with `offset`/`limit`, `sed -n`), not whole files, and do not read the same file again unchanged; filter test and CI output (`tail`, `grep`). Autocompact starts at 30 % (`.claude/settings.json`); a run that ends with the context above 200k tokens says once in its closing report that `/compact` or a new session would make the next request cheaper.
- **Web search:** `mmx search "<query>"` (MiniMax CLI, `--output json` for parsing, at most 10 results) for current library docs, Swiss legal or tax rules and error messages; in cloud sessions its key is a network secret for `api.minimax.io`, and the setup script stores a placeholder key (`npm install -g mmx-cli && mmx config set --key api_key --value placeholder`), because mmx refuses to run without one.

## Coding guidelines

- **Before coding:** when two instructions (this file, an issue, a template) disagree, say which you follow and why ("When to ask"). When an issue's text is wrong in a detail that does not change the task (a cause it names wrongly; a prescribed text that sends the landlord to a place the app does not have, shortened by that place only), follow the code and say so in the pull request (and in a comment if the issue stays open). When a later decision of mine changes a text an issue prescribes, the later one wins and the pull request names both; any other change to a decided text or value is mine.
- **One mapper per response:** a backend response used by several loads gets one mapper in `src/lib/server/<area>.ts`; reuse it instead of copying its fields or passing the response on untyped.

## Documentation (read when relevant)

- `docs/PRD-Dwello.md`: requirements and UI/UX of all features
- `docs/data-model.md`: database schema and relationships
- `docs/api-specification.md`: REST endpoints, auth, errors
- `docs/tech-stack.md`: architecture decisions, performance targets
- `README.md`: setup, Docker deployment, database and demo data commands
- `docs/test-pyramid.md`: test layers, runners, rules, coverage target
- `docs/architecture/utility-tree.md`: quality scenarios with targets and status; risks and tradeoffs, principles and the Phase 0 baseline next to it
- `docs/design/token-referenz.md`: design tokens (colors, typography, spacing, radius, shadow) and components
- `docs/design/design-decisions.md`: design decisions of the 2026 redesign; open work in GitHub issues
