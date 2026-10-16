# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16 (15): #226 statement PDF: a position over different Leistungszeiträume cannot be recomputed

Request (chat): work through the open issues without `entscheiden` one by one (session 14 in the archive); this is the second, #229 merged in #235.

Plan: the line items keep the days of each invoice when any invoice of the position bills other days than the whole period (new jsonb column `invoice_parts`: start, end, amount in the period, the tenant's days, the days billed; migration `0005`); the PDF lists them under the position («01.07.2025 – 30.09.2025: 900.00, 47/92 Tage»), so the weighted share can be recomputed and the denominator of a single Leistungszeitraum is checkable (comment V-3); positions with stored parts never use the fallback «Mietstage / Tage der Periode» (comment C-5).

- [x] Scenario «PDF nennt bei Rechnungen über verschiedene Leistungszeiträume die Tage jeder Rechnung» (`statement-detail.feature`, `@wip`) red
  Scenario red: `steht im PDF "01.04.2025 – 30.06.2025: 900.00, 0/91 Tage"` – Expected substring not in the PDF text (b170c5cc)
  Test red: `statement-pdf.pg.test.ts` «druckt den Anteil in Prozent, wenn die Rechnungen einer Position verschiedene Tage abrechnen» – Expected to contain "01.06.2025 – 30.06.2025: 600.00, 16/30 Tage"
- [x] fach-reviewer on the `@wip` scenario and the planned PDF lines before implementing
- fach-reviewer round 1 (docs/reviews/226-fachreview-1.md): fixed V-1 (Major: formula line «(600.00 × 0/91 + 1'200.00 × 47/92) / 1'800.00 = 34.06 %» under the invoices), V-2 (amounts 600/1'200 in the scenario), V-4 (the formula gives «Ihr Anteil» exactly as Wohnungsanteil × it), V-5 (rule 5 names the lines; a tenant over the whole period keeps «x/x Tage» as rule 5 says, without lines; C-5 test with 1'810/1'840), V-7 (one muted line per invoice, kept with its position on a page break; render test), V-6 for #226 (no lines when the invoices sum to zero; test); open V-3, V-8 (#236), the rest of V-6 (#237)
- [x] Test first (`statement-pdf.pg.test.ts`), column `invoice_parts` (migration, `schema.ts`, `docs/data-model.md`), calculation stores it, PDF prints it, fallback only without parts
  Test red: «druckt bei Rechnungen über verschiedene Tage die Rechnungen, auch wenn der Anteil den Mietstagen entspricht» – Expected to contain "(1'810.00 × 0/181 + 1'840.00 × 139/184) / 3'650.00 = 38.08 %"
  Test red (written after the code, shown by taking it out): render test «hält die Rechnungen beim Seitenwechsel bei ihrer Position» – Expected 5 table headers, received 3 (without the `room()` for the lines); «nennt die Tage jeder Rechnung auch auf fr/it/en» – red with «Tage» hard-coded
  Scenario red after the code: the E2E PDF reader (`backend/src/__tests__/helpers/pdf-text.ts`) under Node decodes `windows-1252` as Latin-1, so «–» read as U+0096; fixed with the 0x80–0x9F table (Bun was right already)
  Files: `backend/migrations/0005_line_item_invoice_parts.sql`, `backend/src/db/schema.ts`, `backend/src/services/{calculation,statement,statement-pdf,pdf}.service.ts`, `backend/src/__tests__/{statement-pdf.pg,statement-pdf-render}.test.ts`, `backend/src/__tests__/helpers/pdf-text.ts`, `docs/data-model.md`, `docs/nebenkostenabrechnung-anforderungen.md` (rule 5), `tests/e2e/features/statement-detail.feature`
  Skills: tdd, ponytail, ponytail-review (shrink: `LineItem.invoiceParts` takes null, no mapping helper)
- [ ] Checks: test:coverage, lint, check, backend test + type-check, deepcheck:audit, affected E2E
- [ ] code-reviewer round(s)
- [ ] Feature review: fach-reviewer, daten-pruefer, persona Dr. Weber (PDF text)
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-226.md`
- [ ] Archive session, push, PR `Fixes #226`, CI, merge
