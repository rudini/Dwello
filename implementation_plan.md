# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W6d: minimum Saldo of CHF 5 (#94)

- [ ] @wip scenarios: Nachzahlung and Rückerstattung below CHF 5 in the PDF (no payment part, no IBAN request), settled on sending, no Mahnung; CHF 5.00 still claimed
- [ ] fach-reviewer on the scenarios and texts before implementing
- [ ] merge main with #341 (Saldo rounded in the tenant's favour) before turning tests green, or report it unmerged
- [ ] backend: settled on sending below CHF 5 (`updateStatementStatus`), PDF text without payment part or IBAN request (`pdf.service.ts`)
- [ ] detail page: the payment panel says the amount is not claimed or paid out
- [ ] slice review (code-reviewer)
- [ ] feature review: persona, fach-reviewer, daten-pruefer
- [ ] workflow-review, session archived, pull request
