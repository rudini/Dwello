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
- [x] Slice review round 1: `docs/reviews/71-review-1.md` (C-1, C-5 to C-8 fixed; C-2 answered by the domain review; C-3, C-4, C-9, C-10 stay in the report; C-11: V-3 stated in rule 5, V-4 stays in report 1)
- [x] Domain review round 2: `docs/reviews/71-fachreview-2.md` (M-4, V-9 to V-13 fixed)
- [x] Persona Dr. Weber: `docs/design/personas/dr-weber-71.md` (P-1 → #339 entscheiden; P-3 fixed; P-2, P-4 stay in the report)
- [ ] Closing `code-reviewer` round on the fixes
- [ ] `daten-pruefer` on Seepark Residenz A2 (Meier, Brunner)
- [ ] Pull request `Fixes #71`, CI green, merged
