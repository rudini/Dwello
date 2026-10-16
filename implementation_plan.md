# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W7c: #115 (A-6) expired fixed-term contract

The issue's "Done means" is worded for a decision issue; its "Decided (product owner)" section (option 2) is the requirement and is implemented here (no implementation issue exists).

- [ ] `@wip` scenarios in `dashboard.feature` and `contract-detail.feature`, seen red; `fach-reviewer` on them before production code
- [ ] Migration 0009: `rental_contracts.moved_out` (with check: only with an end), schema, `docs/data-model.md`
- [ ] Backend: PUT accepts `movedOut`; removing the end clears it; list and detail return it; API contracts
- [ ] Overview task «Befristeten Mietvertrag prüfen» for every expired, agreed end without successor and without `movedOut`
- [ ] Contract detail: panel with «Unbefristet weiterführen» and «Mieter ist ausgezogen», billed-days refusal shown
- [ ] Texts in `messages/{de,fr,it,en}.json`; new state in `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`
- [ ] `docs/anforderungen-vertragsende.md`: A-6 implemented; A-1 point 5 note
- [ ] Slice review (`code-reviewer`), feature review (personas, `fach-reviewer`)
- [ ] Pull request `Fixes #115`, CI green, merged
