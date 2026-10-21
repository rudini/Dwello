# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-21: open bugs, then ready issues (one pull request each)

- [x] #568 test first: `backend/src/__tests__/compose-prod.test.ts` red (8 mail keys missing in the backend service)
- [x] #568 `docker-compose.prod.yml` passes `MAIL_TRANSPORT`, `MAIL_FROM`, `SMTP_*`, `RESEND_API_KEY`; `docker compose config` with `.env.example` shows them; No scenario: the E2E stack does not run `docker-compose.prod.yml`
- [x] #568 slice review round 1: `docs/reviews/568-review-1.md`; Minors C-1 (comment), C-2 (test of the SMTP_PORT default, seen red) fixed
- [ ] #568 closing review, PR
