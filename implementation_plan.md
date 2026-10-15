# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-15 (3): bug #127, schema refusals without code; invoice edit shows raw text

Task: open `bug` issues one by one (#122, #123, #125, #126 merged in rudini/Dwello#181, #182, #189, #196); now #127. Skipped while labelled `entscheiden`: #93, #124, #130, #131, #136, #138, #141.

- [x] No scenario: server-side failure. The bug needs a backend refusal with its own text and no code; a failure the browser can cause (status only, `FailRequests`) has no body and already shows «Ein unerwarteter Fehler ist aufgetreten. …» (a `@wip` scenario showed exactly that and was dropped). DOM tests show it instead
- [x] Backend: one global `onError` answers every schema refusal 422 `{ error, code: 'VALIDATION_ERROR', params }`; `error-codes.pg.test.ts`; `docs/api-specification.md` «Schema validation». Test red: «meldet eine Anfrage, die das Schema verletzt, mit Code» – received Elysia's own body without code
- [x] Invoice edit and recategorisation: a refusal without a known code shows `invoices_save_failed` / `invoices_categorisation_failed`, never the backend's text (detail: `backend_unknown_error`, the message it showed for an unreadable answer; edit: the sentence alone, without «Fehler beim Speichern:» before it); DOM tests. Test red: «zeigt einen Fehler beim Speichern in Worten der Oberfläche …» (it pinned «Fehler beim Speichern: Datenbank nicht erreichbar»), «meldet ein misslungenes Neu-Kategorisieren ohne Code …» – received «Failed to recategorize invoice»; «nennt den Grund, wenn die KI nicht kategorisieren konnte» now sends the code `KI_UNAVAILABLE` the backend sends
- [x] Skills: tdd, ponytail, ponytail-review
- [x] Checks: test:coverage (2418), lint, check, backend test + type-check, deepcheck:audit, E2E chromium + api invoice-edit, invoice-detail, invoice-new (18 passed)
- [ ] code-reviewer
- [x] Personas: not run. The changed texts appear only on a backend refusal without a code, which neither the browser nor the persona stack can produce; DOM tests show them
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-127.md`
- [ ] PR, CI, merge

Files: `backend/src/app.ts`, `backend/src/__tests__/error-codes.pg.test.ts`, `src/routes/invoices/[id]/edit/+page.svelte`, `src/routes/invoices/[id]/+page.svelte`, `src/__tests__/invoice-pages.dom.test.ts`, `docs/api-specification.md`
