# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-22: #580 KI im Browser einstellen

- [ ] Design: `ki_settings` row (mode local/provider/none, address, model, provider, country, key encrypted with `ENCRYPTION_KEY`); any non-empty `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL`, `LLM_PROVIDER`, `LLM_PROVIDER_COUNTRY`, `LLM_ENABLED` locks it («vom Betreiber festgelegt»); the local KI's address `LLM_LOCAL_URL`; in provider mode the privacy statement names provider and country whatever the host
- [x] @wip scenarios (`ki-einstellungen.feature`) and steps, committed
- [x] fach-reviewer round 1: `docs/reviews/580-fachreview-1.md`; decisions under the standing instruction recorded in #580 (F-1 to F-5, F-13, glossary rows), scenarios revised
- [ ] fach-reviewer round 2 on the revised scenarios
- [ ] Backend: precedence of the environment, encryption of the key, refusal without confirmation, provider or country (pg tests red first); API contract
- [ ] Backend: «Verbindung prüfen» (success, wrong key, unreachable, model without images)
- [ ] Backend: KI calls, privacy recipient and model download read the current setting; no restart
- [ ] Frontend: KI section in `/config` (BFF, DOM tests), texts in four languages
- [ ] E2E instance without LLM_* (its own database), stub: key and image checks
- [ ] Screens in `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`
- [ ] `bun run llm:eval` before and after (prompt unchanged): before 47 of 48 (98 %), `qwen/qwen3-vl-8b-instruct` via OpenRouter
- [ ] Docs: `docs/installation.md` section 6, README «External LLM provider», `.env.example`, `docker-compose.prod.yml`
- [ ] Slice reviews, personas, closing round
- [ ] Workflow notes, archive, PR
