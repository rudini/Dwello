# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16 W4c: Fristen und Belegung (#64, #87, #55)

- [ ] @wip scenarios: Mahnung task after the Mahnfrist (#64), Zahlungsfrist and Mahnfrist in the settings (#87), Belegung without percentage (#55)
- [ ] fach-reviewer on the scenarios before implementing
- [ ] #55: drop the percentage and its marker in `BuildingFigures.svelte`
- [ ] #64: overview proposes a Mahnung only after Zahlungsfrist + Mahnfrist; markers in `src/lib/overview.ts` replaced
- [ ] #87: settings «Zahlungsfrist (Tage)» and «Mahnfrist (Tage)» with help and range errors; overview window follows the configured Zahlungsfrist
- [ ] slice reviews, feature review (persona, fach-reviewer), plan archived, pull request merged
