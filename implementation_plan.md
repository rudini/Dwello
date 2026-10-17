# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W6e: hints after saving an invoice of a billed period (#378, #379)

Branch `claude/w6e-invoice-hints-378-379`. #379 is not ready: the code has no rule for an invoice without a Verteilschlüssel beyond the settings' default key (preselected in the form) and «Gleichmässig» in the calculation; refuse or propose the category's key is the product owner's choice (issue "Stop and ask"). No fach-reviewer before implementing: navigation only, no domain rule or text changes.

- [x] #378: scenario «Rechnung einer schon abgerechneten Periode erfassen» in `invoice-new.feature`, `@wip`, seen red (landed on «Rechnungen»)
- [x] #378: after saving a new invoice whose periods have statements without it, Dwello opens the invoice's page with its warning (`MissedWarning`); DOM test seen red; edit already returns to that page (no `invoice-edit.feature` change). The warning's wording is #358's (PR #385), unchanged here: no new texts
- [x] slice review (code-reviewer): `docs/reviews/w6e-review-1.md`
- [x] feature review: personas `docs/design/personas/anna-w6e.md`, `docs/design/personas/marco-w6e.md`
- [x] fixes: in the statement wizard (returnTo) the save goes back to the wizard; «Speichern» stays busy until the page changes; a failed check opens the invoice's page; the warning links the building's statements of each period («Abrechnungen von … ansehen», existing text); DOM tests seen red, scenario «Von der Warnung zu den Abrechnungen der Periode» seen red
- [x] re-review (code-reviewer) of the fixes: `docs/reviews/w6e-review-2.md` (C-7 scenario checks the period, C-8 links described by their period: fixed, seen red; C-5, C-9, C-10 stay)
- [x] #379: under "Blocked on me" with the two options; what the code shows commented on #379
- [x] persona Majors not fixed here: Anna P-1 (Übersicht) → #386 (existed before); Marco P-2 / Anna P-4 (order of the warning's sentences) → comment on #338, which rewrites them
- [x] merge `main` once PR #385 (wording «Abrechnung berichtigen») is in, before the push, and check «Abrechnung berichtigen» in the scenario (review C-1): merged; the scenario checks the sentence (absent on the base commit); lint, check, type-check, DOM/open-work/design-guard tests, E2E invoice and statement-generate features with the axe and language rows (84 passed)
- [x] Workflow note: `docs/reviews/workflow-notes-issue-378-379.md` (dependency on an open PR; collected review with parallel sessions left to the coordinator)
- [ ] archive the session
- [x] closing review (code-reviewer): `docs/reviews/w6e-review-3.md` (no Blocker/Major; C-12 fixed; C-11, C-13 stay)
- [ ] PR `Fixes #378`, CI, merge
