# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W2d: Saldo rounded in the tenant's favour (#79)

- [ ] `statement-rounding.feature`: Nachzahlung rounded down, Rückerstattung up (`@wip`, seen red)
- [ ] fach-reviewer on the scenario and on stored statements (old rounding kept)
- [ ] `roundTo5Rappen` rounds in the tenant's favour (unit test red first)
- [ ] Help text «Saldo» in all four languages, `docs/nebenkostenabrechnung-anforderungen.md` (lines 94, 148)
- [ ] Slice review (code-reviewer), feature review (fach-reviewer, daten-pruefer, persona Dr. Weber)
- [ ] Lint, check, type-check, affected tests and E2E
- [ ] Session archived, pull request merged (`Fixes #79`)

Files: 
