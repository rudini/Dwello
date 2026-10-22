# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-22: #580 KI im Browser einstellen

- [x] Design: `ki_settings` row (mode local/provider/none, address, model, provider, country, key encrypted with `ENCRYPTION_KEY`); any non-empty `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL`, `LLM_PROVIDER`, `LLM_PROVIDER_COUNTRY`, `LLM_ENABLED` locks it («vom Betreiber festgelegt»); the local KI's address `LLM_LOCAL_URL`; in provider mode the privacy statement names provider and country whatever the host
- [x] @wip scenarios (`ki-einstellungen.feature`) and steps, committed
- [x] fach-reviewer round 1: `docs/reviews/580-fachreview-1.md`; decisions under the standing instruction recorded in #580 (F-1 to F-5, F-13, glossary rows), scenarios revised
- [x] fach-reviewer round 2: `docs/reviews/580-fachreview-2.md`; F-1 to F-4 closed; F-5 (download, local KI not answering) and F-16 (check sends the stored key to a new address) answered with two scenarios and a pg test; Minors F-17 to F-20 go into the texts
- [x] fach-reviewer round 3: `docs/reviews/580-fachreview-3.md`; F-5 and F-16 closed; Minors F-21 (pg test with a closed port) and F-22 (scenario for the check of a new address) done
- [x] @wip run red at the missing behaviour (404 on `/ki-settings`, missing elements), no missing step
- [x] Backend: precedence of the environment, encryption of the key, refusal without confirmation, provider or country (pg tests red first); API contracts `ki-settings*.json` (09610ae)
- [x] Backend: «Verbindung prüfen» (success, wrong key, unreachable, model without images), only a fixed text and image
- [x] Backend: KI calls, privacy recipient and model download read the current setting; no restart; a new download aborts the running one
- [x] Frontend: page `/config/ki` linked from `/config` (BFF test, DOM tests seen red by taking the code out), texts in four languages, Protokoll entry, privacy text (8419e6c)
- [x] E2E: the fresh installation without LLM_* (`LLM_LOCAL_URL`, `ENCRYPTION_KEY`), the empty one unlocked; stub: key, image, failed and offline Ollama; axe and language looks at the fresh installation take the installation lock
- [x] Screens in `tests/a11y/screens.json` (`ki-settings`: default, ki-model-loading, ki-model-failed, ki-provider, ki-provider-submit-empty), `accessibility.feature`, `sprachen-bildschirme.feature`; 30 rows green
- [ ] `bun run llm:eval` before and after (prompt unchanged): before 47 of 48 (98 %), `qwen/qwen3-vl-8b-instruct` via OpenRouter
- [x] Docs: `docs/installation.md` section 6, README «External LLM provider», `.env.example`, `docker-compose.prod.yml` (no LLM_* defaults, test red first), data model, API spec, glossary rows decided in #580 (a408918)
- [ ] code-reviewer round 1 (backend and frontend)
- [ ] personas Dr. Weber, Helga, Marco, Sven, Anna (new screen); persona stack without LLM_* lock
- [ ] fach-reviewer round 4 (feature review of the implementation)
- [ ] closing round
- [ ] Workflow notes, archive, PR
