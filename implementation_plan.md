# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-17 W8c: statement wizard check thresholds (#65)

- [x] #130 read: its open rhythm question refines `missingParts` only with a year before, which already needs at least 2 invoices; the two rules stay apart
- [x] Thresholds confirmed as UX choices (15 % / 30 % Akonto, 25 % and CHF 100, 92 days): `#65` markers replaced by comments naming the issue (No scenario: code comments only); the F-16 half (#76) and the #130 marker in `CategoryCheck.svelte` stay
- [ ] 3-month gap only for categories with more than one invoice the year before: blocked, the hint runs per building and only without a year before; options A/B/C asked in #65 (label `entscheiden`); its markers in `statement-wizard.ts` (`GAP_DAYS`) and `PreviewChecks.svelte` stay
- Files: `src/lib/statement-wizard.ts`, `src/routes/statements/generate/CategoryCheck.svelte`, `backend/src/services/invoice-completeness.service.ts`
- [ ] code-reviewer round
- [ ] workflow-review, session archived, pull request (`Refs #65`)
