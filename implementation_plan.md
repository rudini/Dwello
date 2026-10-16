# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16 (#250, #254: Leistungszeitraum over several years)

- [ ] #250: help text and field examples of the Leistungszeitraum use one year (the year of the field examples), all four languages; DOM test pins it
- [ ] #254: help at the Leistungszeitraum (invoice form, upload dialog) and on the help page names a cost over several years (descaling 01.04.2026 – 31.03.2031, CHF 500 ≈ CHF 100 per year; apartment boiler only if the Mietvertrag lists it), all four languages
- [ ] #254: scenario in `statement-generate.feature`: CHF 500 over 01.04.2026 – 31.03.2031 counts CHF 75.30 in 2026 and CHF 99.95 in 2027
- [ ] #254: lower-layer test of `inPeriod` over five years if none exists
- [ ] fach-reviewer on scenarios and help texts before implementing
- [ ] slice review (code-reviewer), feature review (persona, fach-reviewer)
- [ ] pull request merged

Files:
