# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-14: Fix bug issues (#53 first)

Task: work off the open `bug` issues one by one (PR merged before the next). Skipped until decided (`entscheiden`): #141, #138, #136, #131, #130, #124, #93.

### #53 B-1: Apartment list search

- [x] Scenarios «Wohnungen nach Gebäude und Wohnungsnummer suchen», «Wohnungssuche ohne Treffer» (`tests/e2e/features/apartments.feature`). Scenario red: `die Wohnungsliste enthält genau 2 Wohnungen` – Expected 2, Received 4; `den Hinweis "Keine Wohnungen gefunden"` – hint not shown
- [x] Test red: `apartment-search.pg.test.ts` (3 tests) – all apartments returned, total 4 instead of 3
- [x] Backend accepts `search` (number or building name, ILIKE), count joins `buildings`
- [x] `tests/a11y/screens.json`: `queries` override of `apartments` and B-1 note removed
- [x] Scenarios green (14 incl. axe/i18n rows of `apartments`)
- [x] Checks: `test:coverage`, `check`, `lint`, backend `test` + `type-check`, `deepcheck:audit` clean
- code-reviewer round 1 (`docs/reviews/b1-review-1.md`): fixed C-1 (Minor, `search` documented in `docs/api-specification.md`), C-2 (Minor, pg test search + status); rejected C-3: ILIKE wildcards behave like the building search the issue asks to match
- persona Helga round 1 (`docs/design/personas/helga-b1.md`): open P-1 (Major, existed before: #159), P-2 (Major, needs decision: #160), P-3, P-4 (Minor: #160), P-5 (Nit: `offene-punkte.md` U-22)
- persona Marco round 1 (`docs/design/personas/marco-b1.md`): open P-1 (Major, existed before: #159), P-2 (Major, needs decision: #160), P-3 (Minor: #160), P-4 (Minor), P-5, P-6 (Nit: U-22)
- [ ] PR, CI, merge
- Skills: tdd, ponytail, ponytail-review
- Files: `backend/src/services/apartment.service.ts`, `backend/src/routes/apartments.ts`, `backend/src/__tests__/apartment-search.pg.test.ts`, `tests/e2e/{features/apartments.feature,steps/apartment-list.steps.ts,tasks,targets,questions/apartments.ts}`, `tests/a11y/screens.json`, `docs/api-specification.md`, `docs/reviews/b1-review-1.md`, `docs/design/personas/{helga,marco}-b1.md`, `docs/design/offene-punkte.md`

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
- [x] Comment on #51: once it is done, the demo needs a way to allow every account
- [x] Code review round 1; fixes: C-2 to C-10 (log rotation, required Postgres password, HSTS, trap on INT/TERM, README: Pay As You Go step, failed reset, image prune, firewall wording); C-1 becomes an issue (visitor notice, product decision)
- [x] ponytail-review on the diff: `COOKIE_SECURE` (prod default) and the `caddy_config` volume removed
- [ ] Before marking complete: test:coverage, lint, check, backend test and type-check

Files: `deploy/demo/*`, `Dockerfile`, `README.md`, `docs/design/offene-punkte.md`, `implementation_plan.md`.
Skills: ponytail-review (after review round 1; tdd and ponytail not loaded: deployment configuration and one Dockerfile line, no app code; the Dockerfile fix was shown red and green with `docker build`).

code-reviewer round 1 (docs/reviews/demo-review-1.md): open C-1 (Major, product decision: #162), fixed C-2, C-3, C-4, C-5, C-6, C-7, C-8, C-9, C-10, rejected C-11: browsers fall back to HTTP/2 over TCP, opening UDP 443 adds a port and an Oracle rule for no visible gain
