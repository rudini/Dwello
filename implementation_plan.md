# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: #292 reasons of predefined categories on the invoice (W17)

- [ ] `@wip` scenarios: invoice detail (reason of a predefined category, own non-allocable category), changed texts in `categories.feature`
- [ ] Draft texts (de, fr, it, en) and domain review by `fach-reviewer` before implementing
- [ ] Reasons end with their conclusion; OR and VMWG spelled out; Feuerlöscher and Schädlingsbekämpfung «umstritten» with the leaflet; lift with full-service contract; Gebäudeversicherung with the heating exception (204 M-2)
- [ ] Contract note and unsure-KI hint with the decided wording
- [ ] Invoice detail shows the category's reason, not styled as a warning (backend: category `type` in the invoice response, contract `invoice.json`)
- [ ] Existing tests pinning the old texts updated
- [ ] Slice review by `code-reviewer`
- [ ] Feature review: personas, `fach-reviewer`
- [ ] Archive the session, pull request, CI, merge
