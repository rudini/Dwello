# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W7d: #71 Heizprofil within the Leistungszeitraum

- [x] Read #71 and the open `entscheiden` issues on the same calculation (#257, #256, #280, #237); #257 (Tankbestand) proposes that a delivery's Leistungszeitraum does not count in a tank category: tank categories keep today's sharing until #257 is decided
- [x] Scenario `@wip` in `tests/e2e/features/statement-detail.feature` (amount and PDF), seen red
- [x] `fach-reviewer` on the scenario before implementing (amounts change): `docs/reviews/71-fachreview-1.md`; M-2 → #335 (entscheiden), V-7 → #336 (entscheiden), V-6 → comment on #237
- [x] Calculation: a heating invoice with a Leistungszeitraum is shared by the Heizprofil's months inside it, normalised to 100 % (tdd, `calculation.service.ts`)
- [x] PDF: each invoice of such a position with its months and the division, recomputable from the printed values (#232)
- [x] `docs/nebenkostenabrechnung-anforderungen.md` rule 5, `docs/data-model.md` (CR2-N2)
- Files: `backend/src/services/{calculation,pdf,statement-pdf}.service.ts`, `backend/src/db/schema.ts` (`InvoicePart.profile`, jsonb, no migration), tests `heating-distribution.pg.test.ts`, `statement-pdf-render.test.ts`, `statement-detail.feature` + step, docs rule 5 and `data-model.md`
- [ ] Slice review (`code-reviewer`)
- [ ] Feature review: `fach-reviewer`, `daten-pruefer`, persona (PDF)
- [ ] Pull request `Fixes #71`, CI green, merged
