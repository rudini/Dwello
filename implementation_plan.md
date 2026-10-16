# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16 W4b-Mietstatus: an apartment's tenancy (#117, #145, #58)

- [ ] @wip scenarios: earlier contracts and the delete dialog's statements (#117), «Leer seit» (#145), «Vermietet ab» and Mieter «Künftig» (#58); fach-reviewer before implementing (terms)
- [ ] #117: apartment page lists contracts by time, ended ones under «Frühere Mietverträge» with the history help; delete dialog of an ended contract says whether statements exist and links them; `docs/anforderungen-vertragsende.md` marks A-8 implemented
- [ ] #145: backend gives the apartment's last Vertragsende; «Leer seit {Datum}» with the help on the apartment page and in the overview
- [ ] #58: Mietstatus `relet` as «Vermietet ab {Datum}» on overview, building cards and apartment pages; Mieter «Künftig» with only a future contract, «Aktiv» only with a running one (backend status filter)
- [ ] a11y and language rows for new states
- [ ] Code review per slice, feature review (personas, fach-reviewer)
- [ ] Workflow notes, archive the session, pull request
