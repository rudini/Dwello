# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #815 part C, statements: the frontend derives nothing from amounts and dates

Measured before (25.10.2026, main f430a98): frontend decision exceptions 19, of which 15 in statements.

- [x] C1 payment rules from the backend: `paymentOf` and `advanceChanged` (`backend/src/services/statement-payment.ts`) on list and detail; backend unit and pg tests, API contracts, mapping test first; the DOM test fixture takes them from `paymentOf`; frontend `unpaid`, `claimed`, `belowMinimum`, `nextReminderLater` removed; exceptions 19 → 9 (3 lines now status display)
- [x] C2 pre-check «Bezahlt am» not in the future (`PAID_DATE_IN_FUTURE`, statement-lock.pg.test.ts) into `preChecks`; the two «Bezahlt am» defaults into `display` as a field default; exceptions 9 → 6
- [x] C1 fix: the test fixture imported backend code across the boundary (fitness `boundary-import`); it now states the backend's answer
- [ ] C3 «Abrechnungsperiode läuft noch» in the run from the backend (`GET /statements/check-period?periodEnd=` → `{ running }`), as `check-start` of part B
- [ ] Review C1–C3
- [ ] Checks: lint, check, vitest, backend tests, E2E statement features, fitness (exceptions before and after)
- [ ] Closing round, workflow notes, archive
- [ ] PR: «No scenario: behaviour unchanged», Refs #815
