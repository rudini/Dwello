# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: #788 part 4c, reminders and the five-year hint in the backend

- [x] Backend: `reminderDue` on each row of `GET /statements` (null unless overdue; true when a Mahnung is to propose now: after the Mahnfrist, the next after the last Mahnung's Zahlungsfrist, none while one waits to be posted; a Rückerstattung at once), tests first
- [x] Backend: `olderThanFiveYears` on each row of `GET /statements/outdated` (Swiss day, the 29th of February to the 28th), tests first
- [x] API contracts `tests/contracts/statements.json`, `statements-outdated.json`
- [x] BFF: the overview counts `reminderDue` and reads `olderThanFiveYears`; no Mahnfrist, `nextReminderFrom` or `FIVE_YEARS_AGO` left in `src/lib/overview.ts`; `overview.test.ts`, `dashboard.test.ts`
- [x] Docs: `docs/api-specification.md`; fitness ratchet unchanged (BFF decisions stay 8)
- [x] Checks: lint, check, type-check, vitest, backend tests, E2E `dashboard`, `mahnwesen` scenarios
- [x] Slice review round 1 (`docs/reviews/p4c-review-1.md`)
- [ ] Closing round
- [ ] PR: «No scenario: behaviour unchanged», Fixes or Refs #788 per its remaining points
