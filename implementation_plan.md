# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: #66 Akonto and rent hints in the contract forms (W15)

- [x] @wip scenarios in `contract-new.feature` (Akonto help) and `contract-edit.feature` (running contract: Art. 269d OR, befristet)
- [x] fach-reviewer round 1 on the scenarios and texts before implementing (`docs/reviews/66-fachreview-1.md`)
- [x] Akonto help names the Nebenkosten agreed in the Mietvertrag, examples stay (option A)
- [ ] Hint for a contract without Akonto: blocked, fach-review M-1 contradicts the decided text (question in #66)
- [x] Running-contract hint names Art. 269d OR (befristet: #76's sentence, `TODO(fachlich prüfen, #388)`)
- [x] `TODO(fachlich prüfen, #66)` markers removed; all four languages
- Files: `messages/{de,fr,it,en}.json`, `src/routes/contracts/ContractForm.svelte`, `src/routes/contracts/new/RentStep.svelte`, `src/lib/ui/MoneyInput.svelte` (help testid), `src/__tests__/contract-edit.dom.test.ts`, `src/__tests__/contract-wizard.dom.test.ts`, `tests/e2e/{features,steps,questions,targets}`
- [x] Code review round 1 (`docs/reviews/66-review-1.md`)
- [ ] Fach review round 2, feature review (personas Dr. Weber, Helga), PR "Refs #66"
