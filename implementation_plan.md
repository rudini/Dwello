# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: #292 reasons of predefined categories on the invoice (W17)

- [x] `@wip` scenarios: invoice detail (reason of a predefined category, excluded invoice, own non-allocable category), changed texts in `categories.feature`
- [x] Draft texts (de, fr, it, en) and domain review by `fach-reviewer` before implementing: `docs/reviews/292-fachreview-1.md`; terms #397 (VMWG), #398 (Vollservicevertrag), Lift description #399
- [x] Reasons end with their conclusion; OR and VMWG spelled out per reason; Feuerlöscher and Schädlingsbekämpfung «umstritten» with the leaflet; lift with full-service contract; Gebäudeversicherung with the heating exception (204 M-2); help text and `invoices_legal_text` with OR spelled out
- [x] Contract note and unsure-KI hint with the decided wording
- [x] Invoice detail shows the category's reason in the categorisation panel, not as a warning; the general note only without a reason (backend: category `type` in the invoice response, contract `invoice.json`)
- [x] Demo invoices «Wartungsabonnement Lift 2024/2025»
- [x] Existing tests pinning the old texts updated

Files: `messages/{de,fr,it,en}.json`, `src/routes/config/categories/CategoryReason.svelte`, `src/routes/invoices/[id]/{+page,CategorizationPanel}.svelte`, `src/lib/types.ts`, `backend/src/services/invoice.service.ts`, `backend/demo/demo-data.sql`, `tests/contracts/invoice.json`, `tests/e2e/{features,steps,questions,targets,fixtures}`, `src/__tests__/{categories-page.dom,categories,invoice-pages.dom}.test.ts`
- [ ] Slice review by `code-reviewer`
- [ ] Feature review: personas, `fach-reviewer`
- [ ] Archive the session, pull request, CI, merge
