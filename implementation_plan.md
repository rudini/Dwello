# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16 (glossary #243)

Task: add the terms the product owner decided in #243 to `UBIQUITOUS_LANGUAGE.md`, at the product owner's request (as in #244), and remove the two `TODO(fachlich prüfen, #75)` markers the glossary now answers.

- [x] Glossary: Abgerechnete Tage, Mietstage der Position, Monatsanteil, Anteil nach Heizprofil, Hinweis auf fehlende Abrechnungen; Saldo 0.00 and the PDF sign of the rounding; «Zeitanteil» refers to the new terms
- [x] Markers `#75` removed from `backend/src/db/schema.ts` and `backend/src/services/pdf.service.ts` (comments only)
- [x] Checks: test:coverage (2606), lint, check, backend test (670) + type-check; no E2E (docs and comments only)
- [ ] fach-reviewer and code-reviewer round
  code-reviewer round 1 (`docs/reviews/glossary-243-review-1.md`): fixed C-1 (Minor, «No scenario» in the PR text), C-2 (Nit), C-3 (Nit)
- [ ] Archive session, push, PR `Fixes #243` with «No scenario: glossary and comments only, no behaviour change», CI, merge
  Skills: none (no behaviour change; tdd and ponytail do not apply to glossary text and comment removal)

Files: `UBIQUITOUS_LANGUAGE.md`, `backend/src/db/schema.ts`, `backend/src/services/pdf.service.ts`
