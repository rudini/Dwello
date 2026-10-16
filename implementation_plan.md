# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16 W4c: Fristen und Belegung (#64, #87, #55)

- [x] @wip scenarios: Mahnung task after the Mahnfrist (#64), Zahlungsfrist and Mahnfrist in the settings (#87), Belegung without percentage (#55)
- [x] fach-reviewer on the scenarios before implementing (`docs/reviews/w4c-fachreview-1.md`; V-1: a Rückerstattung stays a task from the day after its Zahlungsfrist)
- [x] #55: drop the percentage and its marker in `BuildingFigures.svelte`
- [x] #64: overview proposes a Mahnung only after Zahlungsfrist + Mahnfrist; markers in `src/lib/overview.ts` replaced. No scenario for the task's absence during the Mahnfrist: the task counts the statements of every parallel scenario (unit tests in `overview.test.ts`, `dashboard.test.ts`)
- [x] #87: settings «Zahlungsfrist (Tage)» and «Mahnfrist (Tage)» with help and range errors; overview window follows the configured Zahlungsfrist (No scenario for a value other than the default: settings are global to parallel scenarios; unit tests); contract `tests/contracts/config.json`
- [x] slice review 1 (code-reviewer, `docs/reviews/w4c-review-1.md`)
- [x] feature review: persona Helga (`docs/design/personas/helga-w4c-fristen.md`), Dr. Weber (`docs/design/personas/weber-w4c-fristen.md`), fach-reviewer round 2 (`docs/reviews/w4c-fachreview-2.md`)
- [x] findings: help texts with the allowed range, the Mahnfrist only for a Nachzahlung, «vue d'ensemble» (Helga P-2/P-3/P-5, Weber P-1, V-10–V-12); config load that is not JSON keeps the defaults (C-6); step «erklärt die Einstellung» (C-1)
- No scenario for an overdue Rückerstattung shown before the Mahnfrist ends (C-5): the task counts statements of all parallel scenarios; unit tests in `overview.test.ts` and `dashboard.test.ts`
- [x] Workflow note: one pull request for #64 and #87, which refer to each other; No scenario for aggregated counts and global settings (`docs/reviews/workflow-notes-issue-64-87-55.md`)
- [ ] closing code-reviewer round, plan archived, pull request merged
- Files: `src/lib/overview.ts`, `src/routes/dashboard/+page.server.ts`, `src/routes/dashboard/BuildingFigures.svelte`, `src/lib/server/settings.ts`, `src/routes/config/+page.svelte`, `src/routes/config/SettingField.svelte`, `messages/*.json`, `tests/contracts/config.json`, `docs/nebenkostenabrechnung-anforderungen.md`, tests
