# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16 W4b-Mietstatus: an apartment's tenancy (#117, #145, #58)

- [x] @wip scenarios: earlier contracts and the delete dialog's statements (#117), «Leer seit» (#145), «Vermietet ab» and Mieter «Künftig» (#58); fach-reviewer before implementing (`docs/reviews/w4bm-fachreview-1.md`: no Blocker/Major; V-2 wording taken, V-3 covered by `tenant-status.pg.test.ts`, V-6 translations taken)
- [x] #117: apartment page lists contracts by time, ended ones under «Frühere Mietverträge» with the history help; delete dialog of an ended contract says whether statements exist and links them; `docs/anforderungen-vertragsende.md` marks A-8 implemented
- [x] #145: backend gives the apartment's last Vertragsende; «Leer seit {Datum}» with the help on the apartment page and in the overview
- [x] #58: Mietstatus `relet` as «Vermietet ab {Datum}» on overview, building cards and apartment pages; Mieter «Künftig» with only a future contract, «Aktiv» only with a running one (backend status filter)
- [x] a11y and language rows for new states (`apartment-detail-vacant`, `contract-detail-ended`; seed: Emil 2.02 ended 2014, Fritz 2.03 from 2100)
- Files: `backend/src/services/{apartment,tenant}.service.ts`, `backend/src/routes/tenants.ts`, `src/lib/apartment.ts`, `src/lib/types.ts`, `src/lib/server/apartment.ts`, `src/routes/apartments/{+page.server.ts,[id]/ApartmentFacts.svelte,[id]/ContractHistory.svelte}`, `src/routes/buildings/{+page.server.ts,[id]/+page.server.ts}`, `src/routes/dashboard/{+page.server.ts,BuildingFigures.svelte}`, `src/routes/contracts/[id]/{+page.server.ts,+page.svelte,DeleteContract.svelte}`, `src/routes/tenants/{+page.server.ts,TenantFilters.svelte,TenantRow.svelte}`, `messages/*.json`, `tests/contracts/tenants.json`, `docs/design/i18n-begriffe.md`, `docs/anforderungen-vertragsende.md`
- [ ] Code review per slice, feature review (personas, fach-reviewer)
- [ ] Workflow notes, archive the session, pull request
