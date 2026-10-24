# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #788 part 3a, what a statement allows (capability fields)

Product owner, 24.10.2026: the backend sends per statement what it allows; the frontend shows buttons and hints by these fields and keeps only the status label. Part 3 in two pull requests: 3a the frontend decisions (`MoreActions`, `PaymentPanel`, `LaterChanges`), 3b one place for «a replaced statement does not count» in the backend. Behaviour unchanged (`No scenario: behaviour unchanged; the statement-detail and correction scenarios pin the buttons and hints`). Refs #788.

- [x] Backend `GET /statements/:id`: `editable`, `correctable`, `asksPayment` (`statement-capabilities.pg.test.ts`, red first)
- [x] API contract `tests/contracts/statement.json`; type `StatementWithDetails`; BFF mapper `toStatement`; `docs/api-specification.md`
- [x] `MoreActions`, `PaymentPanel`, `LaterChanges` read the fields (`statement-pages.dom.test.ts`, 4 tests red first: fields against the status); the test helper fills the fields for a status as the backend does
- [x] Measured `replaced`: 18 → 15 files (frontend 7 → 4, shared 1, backend 10); `fitness-functions.md`
- [x] E2E `statement-detail`, `-edit`, `-send`, `-reminder`, `statements` (Chromium and API, 142) green
- [ ] Review, PR
