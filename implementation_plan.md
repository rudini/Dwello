# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16: #211, #199 one rule for missing statements

- [ ] #199/#211 shared rule: a statement that overlaps the period counts; only uncovered rent days are missing (`src/lib/accounting-period.ts`)
- [ ] Contract page: missing statements by the shared rule; warning links to the building's invoices of that period (#211)
- [ ] Dashboard «Noch nicht abgerechnet»: every ended period since the Vertragsbeginn, uncovered days only (#211, #199)
- [ ] Contract list marks a contract «Abrechnung fehlt» (#211)
- [ ] Wizard step 2: names the existing statement's period and the uncovered days, offers a short Abrechnungsperiode (#199)
- [ ] Run and preview: already overlap; remove the `#199` marker
- [x] Invoice form «Rechnung schon abgerechnet»: already the overlap rule (no change; confirmed by the domain review)
- [x] fach-reviewer on the @wip scenarios before implementing (`docs/reviews/issue-211-fachreview-1.md`: 4 Major, M-1 and V-3 need product decisions; #281 opened, #211 commented and labelled `entscheiden`)
- [x] Workflow note: readiness check misses «depends on #n»; blocked task cannot keep its branch (`docs/reviews/workflow-notes-issue-211.md`)
- [ ] Slice reviews, feature review (personas, fach-reviewer), workflow notes, archive session, PR
