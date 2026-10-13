# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 19 - October 2026: Acceptance tests on a lean Screenplay pattern

Baseline before the change: `bun run test:e2e -- --project=chromium --project=api` 629 passed (617 chromium, 12 api).

- [x] Core `tests/e2e/screenplay/`: `Actor` with abilities (`BrowseTheWeb`, `CallTheApi`), `attemptsTo`, `answer`,
  `sees` (`expect.poll`), memory; interactions; web questions answering values; `target()`; `throughUiOrApi`
- [x] Template area: contract form, contract list, contract detail, common steps (`targets/`, tasks, questions, steps)
- [x] Lint rules for the layers in `eslint.config.js` with a ratchet list; proof `src/__tests__/e2e-screenplay-lint.test.ts`
- [x] `tests/e2e/CLAUDE.md`: layers, rules, example
- [x] Areas moved to Screenplay, ratchet list shrinking: buildings/apartments/tenants; invoices/categories/keys/
  heating profiles/documents/settings; statements (incl. API driver, download); accessibility/language/app frame/
  authentication/dashboard/contact/coming soon
- [x] Ratchet list and transitional `Actor.page`/`perform`, `fixtures/actor.ts`, `interactions/` removed
- [x] Full E2E suite chromium + api green with the same 629 tests (identical names); finish checks
- [x] Independent review (`code-reviewer`), three rounds; findings fixed or rejected with reason; M-1 fixed after the
  last allowed round, confirmation by the product owner pending

Files: `tests/e2e/{screenplay,targets,tasks,questions,steps,fixtures}/**`, `tests/e2e/interactions/` and
`fixtures/actor.ts` removed, `tests/e2e/CLAUDE.md`, `eslint.config.js`, `src/__tests__/e2e-screenplay-lint.test.ts`,
`docs/test-pyramid.md`, `playwright.config.ts` (comment), `.claude/skills/bdd-acceptance/SKILL.md`,
`docs/design/offene-punkte.md` (H-18).

Review round 1 (`docs/reviews/screenplay-e2e-review-1.md`):
- M-1 Major: lint gap (page via destructuring, `$eval`, mouse/keyboard chains, computed calls) - fixed
- Minor lint: assertion libraries and type imports in steps, targets importing the core - fixed
- Minor fixtures without layer rule - fixed for `besucher` (interaction); rejected for the `page` fixture: it is the
  Playwright fixture wiring itself and steps cannot destructure `page`/`context`/`browser`/`request`
- Minor mail check with raw `fetch` - rejected: the mail catcher is not Playwright and not the system under test's UI
- Minor fuel stock wait weaker - fixed (`Wait.forCount`)
- Minor API preview memory defaulting to empty - fixed (throws)
- Minor waiting calls in `single()` - fixed (1 s timeouts after counting)
- Minor `ShareInViewport` rounding - fixed (as toBeInViewport)
- Minor stale docs - fixed
- Minor UI words in features - open work H-18 (pre-existing wording)
- Nit `Wait.until` takes the first match - rejected: it only waits for a state, the checks stay strict
- Nit `**/interactions/**` patterns - fixed; Nit plan ticks - fixed

Review round 2 (`docs/reviews/screenplay-e2e-review-2.md`):
- M-1 Major (still open): fixtures without layer rule, dynamic `import()`/`require`, path variants of the abilities
  import, calls and access by computed name, `request` chains - fixed (fixtures get the rules, may take Playwright
  fixtures and types as parameters; the `page` fixture signs in through `Cookies.add`)
- Minor download object reachable from memory (`path()` etc.) - fixed (calls banned)
- Minor targets may read (`textContent`, `url` ...) - fixed
- Minor CLAUDE.md names an unchecked exception - fixed (there is none any more)
- Minor `quick` timeout throws for direct `actor.answer` - fixed (comment says so)
- Nit blank line in `tasks/building-detail.ts` - fixed

Review round 3 (`docs/reviews/screenplay-e2e-review-3.md`, last round allowed by CLAUDE.md step 7):
- M-1 Major (rest in fixtures/): calls on Playwright fixture parameters and Playwright `APIRequestContext` in
  `fixtures/backend.ts` - fixed after the round: fixtures may only hand Playwright fixtures on (any member access and
  renaming fail lint), the HTTP calls moved into the ability `CallTheApi`; not re-reviewed (round limit), listed
  under "Blocked on me"
- Minor targets: `page.on`, `page.request` - fixed (only `page.getBy…`/`page.locator`/`page.frameLocator`)
- Minor `reachState` workaround - comment added
- Nit computed string access hits e.g. `headers['content-type']` - rejected: no such code in tests/e2e; dotted access
  or a variable key is the way
- Nit `all` in the targets read list hits `Promise.all` - rejected: targets have no reason to await anything
- Nit `Download.url()/failure()/delete()` from memory - rejected: not realistic, `DownloadedFile` is the way

Final checks at 294aebf: E2E chromium + api 629 passed (same 629 test names as the baseline); `bun run lint` clean;
`bun run check` 0 errors; backend 539 pass, type-check clean, coverage 90.4 %; `test:coverage` 2232 passed, 1 failed
only locally (`open-work.test.ts` finds the agent worktrees under `.claude/worktrees/`, not part of the repo).

### Branch claude/screenplay-e2e-v2 (the commits of this session only, on main)

- [x] Expert review (`docs/reviews/screenplay-e2e-expertenreview-1.md`): M-1 questions answer values (amounts in francs,
  created count, heating share, contract history), the same for UI and API - fixed; M-2 the API driver calls the
  BFF's `previewStatements`/`generateStatements` instead of copying the contract selection - fixed; M-3 (structure test)
  does not exist on this branch
- [x] Whole-state review round 1 (`docs/reviews/screenplay-e2e-v2-review-1.md`): B-1 `test:e2e` runs `svelte-kit sync`
  first (CI had no `.svelte-kit` for the `$lib` imports) - fixed; M-1 driver branching not linted - fixed; Minors fixed
  (steps without `answer`, fixture handlers, contract history) or open work; the round-3 M-1 (fixtures) confirmed closed
- [x] Round 2 (`docs/reviews/screenplay-e2e-v2-review-2.md`): no Blocker, no Major; Minor fixtures driving the UI through
  tasks or interactions - fixed (only `Cookies`); Minor plain `fetch` past `CallTheApi` - open work H-19; Nit NaN in
  `signedFrancs` - fixed; Nit test name - fixed; Nit `$testInfo.project.name` branch - rejected (deliberate bypass, not a
  realistic pattern)

Final checks on claude/screenplay-e2e-v2 at 8528772: E2E chromium + api 629 passed (same 629 test names as the
baseline); `bun run lint` clean; `bun run check` 0 errors; backend 539 pass, type-check clean; `test:coverage` 2242
passed, 1 failed only locally (`open-work.test.ts` finds old agent worktrees under `.claude/worktrees/`, not in the repo);
`bun run test:e2e -- --list` works on a clean checkout without `.svelte-kit`.
