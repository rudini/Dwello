# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 19 - October 2026: Acceptance tests on a lean Screenplay pattern

Baseline before the change: `bun run test:e2e -- --project=chromium --project=api` 629 passed (617 chromium, 12 api).

- [x] Core `tests/e2e/screenplay/`: `Actor` with abilities (`BrowseTheWeb`, `CallTheApi`), `attemptsTo`, `answer`,
  `sees` (`expect.poll`), memory; interactions; web questions answering values; `target()`; `throughUiOrApi`
- [x] Template area: contract form, contract list, contract detail, common steps (`targets/`, tasks, questions, steps)
- [x] Lint rules for the layers in `eslint.config.js` with a ratchet list; proof `src/__tests__/e2e-screenplay-lint.test.ts`
- [x] `tests/e2e/CLAUDE.md`: layers, rules, example
- [ ] Areas moved to Screenplay, ratchet list shrinking: buildings/apartments/tenants; invoices/categories/keys/
  heating profiles/documents/settings; statements (incl. API driver, download); accessibility/language/app frame/
  authentication/dashboard/contact/coming soon
- [ ] Ratchet list and transitional `Actor.page`/`perform`, `fixtures/actor.ts`, `interactions/` removed
- [ ] Full E2E suite chromium + api green with the same 629 tests; finish checks
- [ ] Independent review (`code-reviewer`), findings fixed
