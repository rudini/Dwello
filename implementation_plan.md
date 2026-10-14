# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 32 - October 2026: demo VM follow-ups (PR #163)

From setting up the demo VM with the user: the private repository, the database password, updates on every merge. No scenario: deployment scripts and docs, no app behavior changes.

- [x] `deploy/demo/README.md` step 4: read-only deploy key, clone over SSH (`7c9a858`)
- [x] `deploy/demo/.env.example`: `POSTGRES_PASSWORD` from `openssl rand -hex 24`; base64 produced `/`, `DATABASE_URL` failed with «Invalid URL» on the VM (`0d56a9d`)
- [x] `deploy/demo/update.sh`: every 5 minutes by cron, pulls `main` and rebuilds only when `main` has a commit not built yet; lock shared with `reset-demo.sh`; README section 7. Sandbox test (bare repo, docker stub): unchanged → silent; new commit → fast-forward and build; locked → silent; not on main → exit 1
- [x] Code review round 1; fixes: the last successful build is recorded in `.git/demo-deployed`, so a failed build is retried (sandbox: build fails → marker stays, next run builds again and records it); lock in `.git/demo.lock`; README: about a minute without the app, log content and logrotate, local changes stop the fast-forward, the first run builds once
- [ ] Code review round 2
- [ ] Session archived

Files: `deploy/demo/{README.md,.env.example,update.sh,reset-demo.sh}`, `docs/reviews/demo-update-review-1.md`, `implementation_plan.md`.
Skills: ponytail (shortest script that covers the cases), no tdd: shell scripts tested in a sandbox instead of the suites.

code-reviewer round 1 (`docs/reviews/demo-update-review-1.md`): fixed C-1 (Major), C-2, C-3, C-4, C-6 (Minor), C-7 (Nit); rejected C-5: wanted, a clone off main must stay loud in the log
