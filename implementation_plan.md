# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: #66 Akonto and rent hints in the contract forms (W15)

- [ ] @wip scenarios in `contract-new.feature` (Akonto help, no Akonto) and `contract-edit.feature` (running contract: Art. 269d OR, befristet)
- [ ] fach-reviewer on the scenarios and texts before implementing
- [ ] Akonto help names the Nebenkosten agreed in the Mietvertrag, examples stay (option A)
- [ ] Hint for a contract without Akonto: no Nebenkosten can be billed (none agreed, or a Pauschale); does not block
- [ ] Running-contract hint names Art. 269d OR (befristet: increase only after the end unless agreed, as #76)
- [ ] `TODO(fachlich prüfen, #66)` markers removed; all four languages
- [ ] Slice review, feature review (persona), PR "Fixes #66"
