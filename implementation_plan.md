# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #997 U1 update with Compose from the last release

- [x] `tools/fitness/compose-update-check.sh`: release compose.yaml and images with demo data and a confirmed code, then `docker compose up -d` with this change's; healthy, Sicherung before new migrations, rows and sums
- [x] `--broken` negative test: failing migration stops with file and cause from the log, after a Sicherung
- [x] counts, sums and the fixture shared with `upgrade-check.sh` (`tools/fitness/data-totals.sh`)
- [x] CI job «Docker images»: both runs; on every PR with app changes and on main
- [x] Seen red locally: broken image without `--broken`; new migration without `backupBeforeMigration`
- [x] Docs: utility tree U1 (H/L), fitness-functions table and counter-checks
- [ ] Slice review and closing round
- [x] Workflow note: the local Docker daemon cannot pull from ghcr.io or reach deb.debian.org; old and new images built from the tags on local stand-in base images (`docs/reviews/workflow-notes-issue-997.md`)
- [ ] PR
