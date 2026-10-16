# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session W6c: QR payment part on reminders (#108), Art. 257d OR hint (#59)

- [ ] @wip scenarios: reminder PDF with payment part (statement-reminder.feature), help hint (help.feature); dialog after the 3rd Mahnung: DOM test (`No scenario`: the E2E stack cannot age three reminders)
- [ ] fach-reviewer on the scenarios and texts before implementing
- [ ] #108: payment part for the open Saldo on every reminder PDF, reference of the statement (`reminder-pdf.ts`, `reminder.service.ts`, `pdf.service.ts`)
- [ ] #59: hint in the help «Zahlungen und Mahnungen» and the dialog after the 3rd Mahnung, four languages; TODO marker in `ReminderModal.svelte` removed
- [ ] slice review (code-reviewer)
- [ ] feature review: persona, fach-reviewer, daten-pruefer
- [ ] workflow-review, session archived, pull request
