# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session W6e: hints after saving an invoice of a billed period (#378, #379)

Branch `claude/w6e-invoice-hints-378-379`. #379 is not ready: the code has no rule for an invoice without a Verteilschlüssel beyond the settings' default key (preselected in the form) and «Gleichmässig» in the calculation; refuse or propose the category's key is the product owner's choice (issue "Stop and ask"). No fach-reviewer before implementing: navigation only, no domain rule or text changes.

- [x] #378: scenario «Rechnung einer schon abgerechneten Periode erfassen» in `invoice-new.feature`, `@wip`, seen red (landed on «Rechnungen»)
- [x] #378: after saving a new invoice whose periods have statements without it, Dwello opens the invoice's page with its warning (`MissedWarning`); DOM test seen red; edit already returns to that page (no `invoice-edit.feature` change). The warning's wording is #358's (PR #385), unchanged here: no new texts
- [ ] slice review (code-reviewer)
- [ ] feature review: persona
- [ ] #379: under "Blocked on me" with the two options
- [ ] Workflow note; archive the session
- [ ] PR `Fixes #378`, CI, merge
