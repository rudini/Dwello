# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16 (15): #226 statement PDF: a position over different Leistungszeiträume cannot be recomputed

Request (chat): work through the open issues without `entscheiden` one by one (session 14 in the archive); this is the second, #229 merged in #235.

Plan: the line items keep the days of each invoice when any invoice of the position bills other days than the whole period (new jsonb column `invoice_parts`: start, end, amount in the period, the tenant's days, the days billed; migration `0005`); the PDF lists them under the position («01.07.2025 – 30.09.2025: 900.00, 47/92 Tage»), so the weighted share can be recomputed and the denominator of a single Leistungszeitraum is checkable (comment V-3); positions with stored parts never use the fallback «Mietstage / Tage der Periode» (comment C-5).

- [x] Scenario «PDF nennt bei Rechnungen über verschiedene Leistungszeiträume die Tage jeder Rechnung» (`statement-detail.feature`, `@wip`) red
  Scenario red: `steht im PDF "01.04.2025 – 30.06.2025: 900.00, 0/91 Tage"` – Expected substring not in the PDF text (b170c5cc)
  Test red: `statement-pdf.pg.test.ts` «druckt den Anteil in Prozent, wenn die Rechnungen einer Position verschiedene Tage abrechnen» – Expected to contain "01.06.2025 – 30.06.2025: 600.00, 16/30 Tage"
- [ ] fach-reviewer on the `@wip` scenario and the planned PDF lines before implementing
- [ ] Test first (`statement-pdf.pg.test.ts`), column `invoice_parts` (migration, `schema.ts`, `docs/data-model.md`), calculation stores it, PDF prints it, fallback only without parts
- [ ] Checks: test:coverage, lint, check, backend test + type-check, deepcheck:audit, affected E2E
- [ ] code-reviewer round(s)
- [ ] Feature review: fach-reviewer, daten-pruefer, persona Dr. Weber (PDF text)
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-226.md`
- [ ] Archive session, push, PR `Fixes #226`, CI, merge
