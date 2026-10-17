# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W6d: minimum Saldo of CHF 5 (#94)

- [x] @wip scenarios: Nachzahlung and Rückerstattung below CHF 5 in the PDF sent to the tenant (no payment part, no IBAN request), settled on sending with the detail page's text, boundary with rounded examples (`statement-minimum-balance.feature`)
- [x] fach-reviewer round 1 on the scenarios and texts before implementing: `docs/reviews/w6d-fachreview-1.md` (M-1 needs the product owner: #352; glossary: #353; small Saldo noted in #291)
- [x] merged main with #341 (Saldo rounded in the tenant's favour); the threshold reads the stored, rounded `balance`
- [x] backend: settled on sending below CHF 5 with amount paid 0.00 (`updateStatementStatus`), PDF text without payment part or IBAN request (`pdf.service.ts`), Mahnung refused `REMINDER_BELOW_MINIMUM` also after a payment reset (`reminder.service.ts`), `belowMinimum` in `pdf-format.ts`
- [x] detail page: the payment panel says the amount is waived or not paid out, without Zahlungsfrist and «Bezahlt am»; no Mahnung offered (`PaymentPanel.svelte`, `+page.svelte`, `$lib/statement.ts`, `messages/*.json`)
- [x] docs: `data-model.md`, `nebenkostenabrechnung-anforderungen.md`, `PRD-Dwello.md`; O-34 (config insert race seen in E2E) in `offene-punkte.md`
- [x] slice review (code-reviewer) round 1: `docs/reviews/w6d-review-1.md` (C-1, C-2 Major fixed with a DOM test and a scenario, both seen red; C-3, C-8, C-9 fixed; C-7 rejected; C-4 to #291, C-5, C-6 left)
- [x] personas: `docs/design/personas/marco-w6d.md` (P-1 Major fixed: no deadline field below CHF 5, DOM and action test seen red), `docs/design/personas/dr-weber-w6d.md` (P-1 to #353, P-2 = M-1 #352, P-3 fixed with Marco P-1, P-4 #291); staged by SQL `stage-w6d.sql` (Seepark Weber/Brunner, Musterhaus Schmidt)
- [ ] feature review: fach-reviewer round 2, daten-pruefer
- [ ] workflow-review, session archived, pull request
