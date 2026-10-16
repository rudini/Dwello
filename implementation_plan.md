# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W7c: #115 (A-6) expired fixed-term contract

The issue's "Done means" is worded for a decision issue; its "Decided (product owner)" section (option 2) is the requirement and is implemented here (no implementation issue exists).

- [x] `@wip` scenarios in `dashboard.feature` and `contract-detail.feature`, seen red
- [x] Fachreview round 1 of the scenarios: `docs/reviews/a6-fachreview-1.md`; issue #308 opened, V-2 added to #120
- [x] Migration 0010: `rental_contracts.moved_out`, schema, `docs/data-model.md`
- [x] Backend: PUT accepts `movedOut`; any change of the end clears it; list and detail return it; API contracts (`contract-moved-out.pg.test.ts`)
- [x] Overview task «Befristeten Mietvertrag prüfen» for every expired, agreed end without successor and without `movedOut` (`overview.ts`, `dashboard/+page.server.ts`)
- [x] Contract detail: `FixedTermCheck.svelte` with «Unbefristet weiterführen» and «Mieter ist ausgezogen»; draft refusal offers delete, a sent one says it cannot continue (Fachreview V-2)
- [x] Texts in `messages/{de,fr,it,en}.json`; screen `contract-detail-expired` in `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`
- [x] `docs/anforderungen-vertragsende.md`: A-6 implemented, A-1 point 5 and the J-1 note; `docs/api-specification.md`
- [x] Code review round 1: `docs/reviews/a6-review-1.md`
- [x] Feature review: personas Anna and Dr. Weber (`docs/design/personas/anna-a6.md`, `weber-a6.md`; persona DB seeded by SQL with two expired fixed-term contracts, Lea Huber on Musterhaus 2.02 and Jonas Graf on Seepark B1), Fachreview round 2 `docs/reviews/a6-fachreview-2.md`
- [x] Fixes: consequence line and move-out dialog (personas P-1/P-2), M-3 wording, V-11/V-12/V-15; M-4 and new texts added to #308
- [ ] Persona re-run on the fixes: `anna-a6-2.md`, `weber-a6-2.md`
- [ ] Full axe and language suites (the shared a11y seed gained the building Talblick)
- [ ] Closing code review before the push: `docs/reviews/a6-review-2.md`
- [ ] Workflow review notes (skill `workflow-review`)
- [ ] Pull request `Fixes #115`, CI green, merged
