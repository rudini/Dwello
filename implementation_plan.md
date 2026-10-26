# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: upload limit and reverse proxy (#732)

No scenario: the change touches only the Compose file and docs; the app behaves as before.

- [x] Test first: no commented nginx service in `docker-compose.prod.yml`; `docs/installation.md` names the limit of the `Dockerfile` for another proxy
- [x] Remove the nginx block from `docker-compose.prod.yml`; `docs/tech-stack.md` names Caddy instead
- [x] `docs/installation.md`: another proxy lets at least 11 MB through (nginx `client_max_body_size 11m`)
- [x] ADR 0005: global `BODY_SIZE_LIMIT=11M`, 413 page without JavaScript as known limit
- [ ] Slice review (`code-reviewer`)
- [ ] Archive the session, PR (`Fixes #732`)
