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
- [ ] Independent review (`code-reviewer`), findings fixed

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
