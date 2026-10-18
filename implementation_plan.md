# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-18: E2E in Firefox and WebKit (#424)

- [x] Reproduce group 1 (page wider than 390 px) in Firefox and WebKit, find the cause: (a) test names ended in a full UUID, whose digit groups Firefox and WebKit do not break (fieldset min-content); (b) WebKit widens the field around a select by its options' flex boxes
- [x] Fix group 1: (a) test fault: `seed.unique` appends 12 hex digits, the language check masks them; (b) app fault: `select { contain: paint }` in `globals.css`, the screen checks red in WebKit before
- [x] Group 2: statement wizard stays on step «Gebäude» in Firefox: passes on current `main` (statement-generate.feature, Firefox and WebKit, 194 tests), fixed by #427 (O-37)
- [x] Group 3: sign-in race (test fault: `signOut` now waits for the sign-in page); WebKit shows a JPEG sent as attachment instead of saving it (app: `download` on the document links, `Button` prop with DOM test seen red)
- [ ] Full `bun run test:e2e` (all browsers) green
- [ ] Checks, reviews, archive, pull request
- Files: `tests/e2e/fixtures/backend.ts`, `tests/e2e/questions/language.ts`, `tests/e2e/CLAUDE.md`, `src/styles/globals.css`, `tests/e2e/tasks/authentication.ts`, `src/lib/ui/Button.svelte`, `src/__tests__/ui-button.dom.test.ts`, `src/routes/tenants/[id]/TenantDocumentRow.svelte`, `src/routes/documents/DocumentItem.svelte`
