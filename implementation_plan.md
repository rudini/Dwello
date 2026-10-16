# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16 W4: Heizprofil on the detail page, help text, rounded months (#247, #230, #232)

- [x] @wip scenarios (statement-detail.feature, heating-profiles.feature), fach-reviewer before implementing (`docs/reviews/w4-fachreview-1.md`)
- [x] #247: a statement shared by days stores the chosen Heizprofil's names and why it was not applied; the detail page names it «(nicht angewendet: …)»
- [x] #230: help text at the Monatsanteile of an own profile: existing statements keep their shares (four languages)
- [x] #232: share from the months rounded to two places; PDF prints the division and, under a year, the period's months
- [x] #232 C-5: no recompute for statements without a stored share (no Heizprofil note)
- Files: `backend/src/services/{heating-profile,prorating,calculation,statement-pdf,pdf}.service.ts`, `backend/src/db/schema.ts`, `src/lib/server/statement.ts`, `src/routes/config/heating-profiles/HeatingProfileForm.svelte`, `messages/*.json`, `docs/data-model.md`, `docs/api-specification.md`, tests and scenarios
- [x] Code review round 1 (`docs/reviews/w4-review-1.md`)
- [x] Persona Helga (`docs/design/personas/helga-w4.md`)
- [x] Persona Dr. Weber (`docs/design/personas/dr-weber-w4.md`)
- [x] fach-reviewer round 2 (`docs/reviews/w4-fachreview-2.md`)
- [ ] daten-pruefer
- [ ] Workflow review, archive the session, pull request
