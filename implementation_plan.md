# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W6c: QR payment part on reminders (#108), Art. 257d OR hint (#59)

- [x] @wip scenarios: reminder PDF with payment part (statement-reminder.feature), help hint (help.feature); dialog after the 3rd Mahnung: DOM test (`No scenario`: the E2E stack cannot age three reminders)
- [x] fach-reviewer on the scenarios and texts before implementing (`docs/reviews/w6c-fachreview-1.md`; V-1 open question: #322)
- [x] #108: payment part for the open Saldo on every reminder PDF, reference of the statement (`reminder-pdf.ts`, `reminder.service.ts`, `pdf.service.ts`, `statement-pdf.service.ts`); none for a statement paid since (V-1)
- [x] #59: hint in the help «Zahlungen und Mahnungen» and the dialog after the 3rd Mahnung, four languages; TODO marker in `ReminderModal.svelte` removed (`messages/*.json` `statements_reminder_257d`, `help/+page.svelte`)
- [x] slice review (code-reviewer): `docs/reviews/w6c-review-1.md`
- [x] feature review: personas `docs/design/personas/helga-w6c.md`, `dr-weber-w6c.md`; `docs/reviews/w6c-fachreview-2.md`, `w6c-datenpruefung-1.md`
- [ ] fixes: reminder with payment part on one page (D-1, C-1, V-6), tests C-2/V-9, scenario title C-7, PRD C-8, M-4; re-review daten-pruefer and code-reviewer
- [ ] workflow-review, session archived, pull request
