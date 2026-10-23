# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-23: demo.dwello.ch does not start since #577

No scenario: the E2E stack does not run the demo's compose files (`deploy/demo`).

- [x] Postgres of the demo gets no `POSTGRES_PASSWORD` beside `POSTGRES_PASSWORD_FILE` (the image refuses both); the demo's check for the password moves to `secrets` (decided by the product owner in this session) — `deploy/demo/docker-compose.yml`, test in `backend/src/__tests__/compose-prod.test.ts`, seen red
- [x] `reset-demo.sh` sets `DATABASE_URL` from `/run/dwello/db_password` (`compose run … sh -c` replaces the backend's command) — seen red
- [ ] Slice review (`code-reviewer`)
- [ ] Archive, PR
