# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-14: demo deployment on demo.dwello.ch

Decided by the user: Oracle Cloud VM, subdomain `demo.dwello.ch` (DNS at Infomaniak), no data isolation per user, reset to the demo data every night, self-hosting with `docker-compose.prod.yml` stays as it is. No scenario: deployment configuration only, no app behavior changes.

- [x] `deploy/demo/docker-compose.yml`: override on `docker-compose.prod.yml` with Caddy (HTTPS), only ports 80/443 published
- [x] `deploy/demo/Caddyfile`, `deploy/demo/.env.example`
- [x] `deploy/demo/reset-demo.sh`: stop backend, recreate the database, load the demo data, start backend
- [x] `deploy/demo/README.md`: VM, firewall, DNS at Infomaniak, Google OAuth, start, cron
- [x] README "Deployment" points to the demo guide
- [x] Fix the frontend `Dockerfile`: `bun install` ran `prepare` (Paraglide) before `project.inlang` exists; `--ignore-scripts`, Paraglide compiles in `vite build`. Test red: `docker build -f Dockerfile .` – `ENOENT: no such file or directory, open '/app/project.inlang/settings.json'`; green after the fix
- [x] Stack started locally (domain `localhost`, images built with the sandbox proxy CA, Ollama left out): only Caddy publishes ports (80, 443); `/login` 200 over HTTPS, http redirects with 308; a form POST with the own origin passes the origin check, a foreign origin gets 403 (also without `ORIGIN`: adapter-node assumes https, so the override sets none); reset in 17 s, a tenant added before the reset is gone after it (11 → 10)
- [x] O-3, O-6 updated, O-11 added (CI builds no Docker image) in `docs/design/offene-punkte.md`
- [ ] Comment on #51: once it is done, the demo needs a way to allow every account
- [ ] Code review round 1
- [ ] Before marking complete: test:coverage, lint, check, backend test and type-check

Files: `deploy/demo/*`, `Dockerfile`, `README.md`, `docs/design/offene-punkte.md`, `implementation_plan.md`.
Skills: none loaded (deployment configuration and one Dockerfile line, no app code; shortest diff kept by hand, e.g. `ORIGIN` dropped once shown unnecessary).
