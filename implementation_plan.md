# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #777, CI: E2E and axe shards without apt at run time (T1)

No scenario: CI only, no app behaviour changes.

- [x] The E2E and axe jobs run in the Playwright image of the version in `bun.lock` (`mcr.microsoft.com/playwright:v<version>-noble`, browsers and system packages included); the `changes` job reads the version; no browser cache, no `playwright install --with-deps`
- [x] Postgres reached by its service name inside the container (`E2E_DATABASE_URL`)
- [ ] Review; PR run shows the shards green and no install step; a run on `main` likewise (issue «Done means»)
- [ ] PR: Fixes #777
