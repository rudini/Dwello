# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session B1: malformed id and statement gap (2026-10-19)

Branch `claude/fix-invalid-id-and-statement-gap`. Product owner: two bugs from the persona stack. (1) A detail page with an id that is no UUID (`/invoices/abc`, `/invoices/upload`, `/buildings/abc` …) answers 500 instead of 404. (2) The statement detail page shows an empty gap of about 150 px between «Status» and «Kostenaufstellung».

- [x] @wip scenario «Eine Seite mit ungültiger Kennung gibt es nicht» (`navigation.feature`, all 17 detail and edit pages), seen red at the 500 page ("Fehler beim Laden …")
- [x] Backend test `error-codes.pg.test.ts`: a path id that is no UUID answers 404 `NOT_FOUND` (11 paths), seen red (500, 422); fix: one global `onTransform` in `backend/src/app.ts` (root cause: the id reached PostgreSQL, which refused the cast); `backend_not_found` in four languages; API spec. Tests that used a malformed id to provoke a PDF failure now use a PDF language without texts (pins kept behaviour); `fuel-stock.pg.test.ts` expects 404 instead of 422
- [x] @wip scenario «Die Kostenaufstellung folgt im üblichen Abstand auf den Status» (`statement-detail.feature`, web question `Gap.between`), seen red at 128 px: three empty items in the page column (gap-8 each): the form of `Correction`'s `FormDialog` (now `hidden`) and the live regions of `ReminderFeedback` and `SendFeedback` (kept in the accessibility tree, `empty:-mt-8` cancels their gap while empty)
- [ ] Slice review (code-reviewer) of both slices, persona review of the statement page: not run, this session cannot start subagents (Blocked on me)
- [x] Workflow note: no subagents, and an unfinished earlier session in the plan (`docs/reviews/workflow-notes-invalid-id-and-statement-gap.md`)
- [x] Checks of «Before marking anything complete»: lint, check, backend type-check, backend `bun run test` (1002, coverage 93.6 %), frontend `test:coverage` (3143), E2E chromium of `navigation`, `statement-detail`, `statement-send`, `statement-reminder` (119) and the axe and language rows of the statement detail screens (44)
- [ ] Workflow review; session to the archive; PR
