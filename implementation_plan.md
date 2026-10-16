# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: invoice check hints (#130, #131, #134)

- [ ] #130 rhythm: no `gap` when each slice of the period split into its own invoice count holds exactly one; totals still compared
- [ ] #130 Leistungszeitraum: a `deviation`/`gap` finding names how many invoices count only in part (unit + DOM test, four languages)
- [ ] #130 scenario: 12 monthly invoices 2023, 4 quarterly 2024: no finding, no confirmation; existing gap scenario keeps a real gap
- [ ] #131 late invoices without Leistungszeitraum within 90 days after the period end, listed per building with edit link (pg test, scenario, four languages)
- [ ] #134 period under a year: invoices without Leistungszeitraum listed per building with edit link, a hint only (scenario, four languages)
- [ ] a11y/language state for the new hints (screens.json, accessibility.feature, sprachen-bildschirme.feature)
- [ ] fach-reviewer on the scenarios before implementing; code-reviewer per slice; personas for the preview
- [ ] workflow-review; session archived
