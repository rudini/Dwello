# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: Remove the building map (#129)

- [x] `@wip` scenarios: building page shows the address without a map (`building-detail.feature`), privacy page no longer names CARTO (`privacy.feature`); seen red
- [x] `fach-reviewer` on the scenario before implementing (privacy text): `docs/reviews/map-fachreview-1.md`
- [x] Remove `BuildingMiniMap.svelte`, its DOM test, `leaflet`, `@types/leaflet`, the `.leaflet-container` rule, the `buildings_map*` messages and the CARTO paragraph `privacy_third_2` (all four languages); the unused `latitude`/`longitude` mapping of the building loads (columns stay)
- [x] Remove `PUBLIC_CARTO_API_KEY` and the map from `.env.example`, `deploy/demo/.env.example`, `docker-compose.prod.yml`, `docs/tech-stack.md`, README, PRD (marked dropped), U-23 in `offene-punkte.md` (no CSP exists)
- [ ] Comment on #82 that CARTO is no longer a third party (R-1)
- [ ] Slice review (`code-reviewer`)
- [ ] Feature review: persona, `fach-reviewer` on the changed privacy text
- [ ] Workflow review, archive session, pull request

Files changed: `src/routes/buildings/BuildingMiniMap.svelte` (deleted), `src/__tests__/building-mini-map.dom.test.ts` (deleted), `src/routes/buildings/[id]/BuildingFacts.svelte`, building loads, `src/lib/types.ts`, `src/routes/privacy/+page.svelte`, `messages/*.json`, `src/styles/globals.css`, `package.json`, `bun.lock`, privacy and token tests, deployment files and docs, `tests/e2e/features/building-detail.feature`, `tests/e2e/features/privacy.feature`, `tests/e2e/fixtures/backend.ts`, `tests/e2e/{targets,questions,steps}/building-detail*`
