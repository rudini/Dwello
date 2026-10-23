# Working rules for the redesign (resume file)

The redesign is complete (stages 0–9); its brief, analysis, plan, log and reviews are in `docs/archive/redesign/`. Nothing here is in use any more: the personas and how they run are in `docs/design/personas/README.md` (subagent `persona`), the checks before a push in `CLAUDE.md`, "Before marking anything complete".

Everything a new session needs to continue the redesign without the original prompt. Source of truth for the requirements: `docs/archive/redesign/REDESIGN_BRIEF.md`; project rules: `CLAUDE.md`; domain terms: `UBIQUITOUS_LANGUAGE.md` (edited only as `CLAUDE.md`, "Design-Regeln", allows).

## Where things are

- Status and next step: `docs/archive/redesign/progress.md` (update before each stage and after each commit).
- Analysis and plan in `docs/archive/redesign/`, decisions `design-decisions.md`, tokens `token-referenz.md`, open work in GitHub issues (non-functional ones with an `nfr:` category label).
- Reviews: `docs/archive/redesign/reviews/<stage>-review-<n>.md`. Personas: `docs/design/personas/<persona>-<stage>.md`.
- Axe screen list: `tests/a11y/screens.json`; axe test: `tests/a11y/` (from stage 2).

## Git and CI

- Branch `feature/new-design`, never `main`. Push only this branch. Commit after every stage and after every review round. App must build and run after every commit.
- Commits: Conventional Commits, ≤ 50 characters, English, scope from CLAUDE.md (e.g. `docs(styles): …`, `feat(components): …`).
- A fallow hook audits every `git commit`/`git push`: run git commands alone, fix findings (unused exports/files, duplication, complexity) instead of working around them.
- Draft PR `feature/new-design` → `main` (open since stage 0). GitHub access goes through the GitHub MCP tools (`mcp__github__*`), not `gh` (not available in the cloud session).
- CI workflow is `.github/workflows/ci.yml` (the brief says `cy.yml`); job `ui-screenshots` runs on every PR push including drafts and comments screenshots of changed routes. Never edit the workflow; suggestions become an issue with an `nfr:` category label. After each push: wait for the run, read the PR comment, judge content (missing/truncated/overlapping/empty), not the intended visual change.

## Language and terms

- UI copy German (Swiss spelling, "ss"), formal "Sie", friendly, short, concrete; error messages say what happened and what to do. Code, comments, commits, docs in English.
- Domain terms only from `UBIQUITOUS_LANGUAGE.md`, exact spelling, no synonyms, no mixing (e.g. "Gebäude", not "Liegenschaft"). Help texts derived from the definitions. Missing terms/explanations: `TODO(fachlich prüfen, #<issue>)` in code + an issue (`CLAUDE.md`, "Open work").

## Safety

- No changes to business/calculation logic, data models, migrations, seed/demo data, the glossary or the CI workflow. UI, texts, styles, components and assets only. UI-only aggregation in `+page.server.ts` (e.g. loading statements for the dashboard task list) is allowed.
- No external CDNs or tracking: fonts and icons from npm packages bundled by Vite.
- Never disable or delete tests, never disable axe rules. Changing a Gherkin scenario is allowed only when the behaviour intentionally changes (ATDD: change the scenario first, watch it fail).

## Working method per code change

1. Acceptance scenario first when behaviour changes (`tests/e2e/features`, `@wip` until green).
2. Skill `/tdd`: failing unit/DOM test (`*.dom.test.ts` for components: states, interaction, roles, labels, focus) → implementation → refactor.
3. Skill `/ponytail`: the shortest diff that works; check the finished change against it.
4. Pure styles/assets need no unit test but the automated checks and a visual check.

## Automated checks of the redesign (history; today `CLAUDE.md`, "Before marking anything complete")

```bash
bun run test:coverage   # frontend unit + DOM tests with coverage floor
bun run lint
bun run check
bun run build
cd backend && bun run test && bun run type-check   # only when backend/contracts touched
bun run test:e2e -- --project=chromium --project=api   # E2E incl. the axe check
```

Environment notes for a cloud session: `service postgresql start`, create role/db `dwello`/`dwello` if missing; `bun install --frozen-lockfile`; `cd backend && bun install`. The pre-installed Chromium (build 1194) is older than the project's Playwright; symlink `/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell` to `/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell` (plus marker files `INSTALLATION_COMPLETE`, `DEPENDENCIES_VALIDATED`). Free ports 3100/3101/3102/3103/2525/2526 before E2E.

Axe: `@axe-core/playwright`, tags `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa`; all screens/states of `tests/a11y/screens.json`, desktop and mobile, light and dark. Violations are blockers. No `disableRules`; a single-element exception only for a proven false positive, with a comment and an issue with the label `nfr:usability`.

## Review cycle (after every stage)

1. Finish, checks green, commit, push, wait for `ui-screenshots`, update `docs/archive/redesign/progress.md`.
2. Start an independent read-only reviewer agent with fresh context (Plan for analysis/plan, general-purpose for code/design, Explore for remnant searches). Give it: stage goal, changed files/diff, brief requirements, glossary, axe result, ui-screenshots result, review criteria (correctness, tests, readability, tokens only, a11y incl. contrast/focus/roles/keyboard/touch size, consistency, no logic changes, old-design remnants, terminology).
3. Wait for it. Findings: Blocker / Major / Minor. Fix all Blockers and Majors (with /tdd + /ponytail), Minors if cheap, else they stay in the review report (`CLAUDE.md`, "Open work"). Rerun checks. Follow-up review after large changes, max. 3 rounds.
4. Write `docs/archive/redesign/reviews/<stage>-review-<n>.md`: findings, changes, deliberate non-changes.

## Personas (from stage 4, after every stage with operable UI)

One agent per persona operates the running app (dev stack with demo data, Playwright) without reading source code or the glossary, notes at each step what it expected and what it saw, takes screenshots, and reports: task completed (yes/partly/no), effort, confusion (incl. terms), error risks, improvement suggestions → `docs/design/personas/<persona>-<stage>.md`.

The personas, their default tasks, viewports and input: `docs/design/personas/README.md`.

Unknown terms are fixed with better help texts, never by renaming the glossary term. Fix Blockers/Majors before moving on; repeat the affected persona after larger fixes (max. 2 repetitions).

## Stages

0 analysis · 1 plan · 2 tokens + base components + axe test · 3 icons + illustrations (≥ 8) · 4 shell, navigation, dashboard (+ Anna, Helga) · 5 rental contract wizard (+ all personas) · 6 statement wizard (+ all personas, checkpoint summary in progress.md) · 7 remaining screens (+ personas) · 8 remove old design system (Explore remnant review) · 9 final docs, CLAUDE.md "Design-Regeln", final review, all personas, axe over all screens.

If blocked: record it as open work (`CLAUDE.md`, "Open work"), continue with the next stage. Do not stop early.

## Persona runs: how (history; today `docs/design/personas/README.md`, "Running a review")

- The subagent `persona` (`.claude/agents/persona.md`) runs one persona; the reviews after the redesign follow `CLAUDE.md`, Workflow steps 4 to 7, run as the skill `slice-review` says.
- Start the app for personas with `docs/design/tools/persona-stack.sh` (fresh database `dwello_persona` with the demo data, backend on 3301, its own production build in `/tmp/persona-app` on 3300, the KI stand-in on 2528; `--no-build` serves the last persona build again).
- Personas drive a signed-in Chromium through `docs/design/tools/persona-kit.mjs` (`open({ viewport, zoom })`, `shot`, `readOut` for the accessibility tree); import it in place, do not copy it (it finds Playwright relative to its own path). They write their scripts and screenshots outside the repository and only their report into `docs/design/personas/`. Only the screenshots of the last redesign and i18n round are kept in `docs/design/personas/screens/`; earlier ones are in the git history.
- Persona prompt essentials: character, task, "operate only like a user, no source code, docs, tests or glossary", report structure (completed yes/partly/no, effort, expected vs. seen per step, confusion incl. terms, error risks, suggestions marked Blocker/Major/Minor/Nit for what the task names as changed, everything else under "Beobachtungen" without severity).
