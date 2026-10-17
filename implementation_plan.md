# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W6d: minimum Saldo of CHF 5 (#94)

- [x] @wip scenarios: Nachzahlung and Rückerstattung below CHF 5 in the PDF sent to the tenant (no payment part, no IBAN request), settled on sending with the detail page's text, boundary with rounded examples (`statement-minimum-balance.feature`)
- [x] fach-reviewer round 1 on the scenarios and texts before implementing: `docs/reviews/w6d-fachreview-1.md` (M-1 needs the product owner: #352; glossary: #353; small Saldo noted in #291)
- [ ] merge main with #341 (Saldo rounded in the tenant's favour) before the push, or report it unmerged (the threshold reads the stored, rounded `balance`, so it needs no code of #341)
- [x] backend: settled on sending below CHF 5 with amount paid 0.00 (`updateStatementStatus`), PDF text without payment part or IBAN request (`pdf.service.ts`), Mahnung refused `REMINDER_BELOW_MINIMUM` also after a payment reset (`reminder.service.ts`), `belowMinimum` in `pdf-format.ts`
- [x] detail page: the payment panel says the amount is waived or not paid out, without Zahlungsfrist and «Bezahlt am»; no Mahnung offered (`PaymentPanel.svelte`, `+page.svelte`, `$lib/statement.ts`, `messages/*.json`)
- [x] docs: `data-model.md`, `nebenkostenabrechnung-anforderungen.md`, `PRD-Dwello.md`; O-34 (config insert race seen in E2E) in `offene-punkte.md`
- [ ] slice review (code-reviewer)
- [ ] feature review: persona, fach-reviewer, daten-pruefer
- [ ] workflow-review, session archived, pull request
