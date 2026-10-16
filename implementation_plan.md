# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: Remove the building map (#129)

- [x] `@wip` scenarios: building page shows the address without a map (`building-detail.feature`), privacy page no longer names CARTO (`privacy.feature`); seen red
- [ ] `fach-reviewer` on the scenario before implementing (privacy text)
- [ ] Remove `BuildingMiniMap.svelte`, its DOM test, `leaflet`, `@types/leaflet`, the `.leaflet-container` rule, the `buildings_map*` messages and the CARTO paragraph `privacy_third_2` (all four languages)
- [ ] Remove `PUBLIC_CARTO_API_KEY` from `.env.example`, `deploy/demo/.env.example`, `docker-compose.prod.yml`, `docs/tech-stack.md`, README
- [ ] Slice review (`code-reviewer`)
- [ ] Feature review: persona, `fach-reviewer` on the changed privacy text
- [ ] Workflow review, archive session, pull request

Files changed: `tests/e2e/features/building-detail.feature`, `tests/e2e/features/privacy.feature`, `tests/e2e/fixtures/backend.ts`, `tests/e2e/{targets,questions,steps}/building-detail*`
