# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session B1: malformed id and statement gap (2026-10-19)

Branch `claude/fix-invalid-id-and-statement-gap`. Product owner: two bugs from the persona stack. (1) A detail page with an id that is no UUID (`/invoices/abc`, `/invoices/upload`, `/buildings/abc` …) answers 500 instead of 404. (2) The statement detail page shows an empty gap of about 150 px between «Status» and «Kostenaufstellung».

- [x] @wip scenario «Eine Seite mit ungültiger Kennung gibt es nicht» (`navigation.feature`, all 17 detail and edit pages), seen red at the 500 page ("Fehler beim Laden …")
- [x] Backend test `error-codes.pg.test.ts`: a path id that is no UUID answers 404 `NOT_FOUND` (11 paths), seen red (500, 422); fix: one global `onTransform` in `backend/src/app.ts` (root cause: the id reached PostgreSQL, which refused the cast); `backend_not_found` in four languages; API spec. Tests that used a malformed id to provoke a PDF failure now use a PDF language without texts (pins kept behaviour); `fuel-stock.pg.test.ts` expects 404 instead of 422
- [ ] @wip scenario «Die Kostenaufstellung folgt im üblichen Abstand auf den Status» (`statement-detail.feature`), seen red; fix
- [ ] Slice review (code-reviewer), persona review of the statement page
- [ ] Checks of «Before marking anything complete»
- [ ] Workflow review; session to the archive; PR
