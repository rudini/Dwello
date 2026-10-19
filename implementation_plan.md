# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session G1: Gebäude mit allen Wohnungen aus dem Gebäuderegister (#479)

Branch `claude/nifty-tesla-gmus4a`. «Setze #479 um»: address search through the BFF against geo.admin.ch (GWR) instead of OpenPLZ; a preview of the register's Wohnungen; Gebäude and Wohnungen created in one transaction.

- [ ] Scenarios `@wip` in `building-new.feature`, `privacy.feature`; GWR stand-in for E2E
- [ ] fach-reviewer on the scenarios and the privacy text before implementing
- [ ] Backend: `POST /buildings` with `apartments[]` in one transaction (pg test, contract)
- [ ] BFF: `/api/addresses` (search) and `/api/addresses/[egid]` (register), mapping in `src/lib/server/` (unit tests)
- [ ] UI: address search, preview table, hints (no Wohnungen, unreachable, no hit, existing address)
- [ ] Privacy statement, texts in four languages, docs (`tech-stack.md`, `PRD-Dwello.md`, U-23 P-8)
- [ ] a11y and language screens
- [ ] Slice reviews, persona review, closing review
- [ ] PR `Fixes #479`
