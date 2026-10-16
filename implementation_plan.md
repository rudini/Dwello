# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16 W4b-Mietstatus: an apartment's tenancy (#117, #145, #58)

- [x] @wip scenarios: earlier contracts and the delete dialog's statements (#117), «Leer seit» (#145), «Vermietet ab» and Mieter «Künftig» (#58); fach-reviewer before implementing (`docs/reviews/w4bm-fachreview-1.md`: no Blocker/Major; V-2 wording taken, V-3 covered by `tenant-status.pg.test.ts`, V-6 translations taken)
- [x] #117: apartment page lists contracts by time, ended ones under «Frühere Mietverträge» with the history help; delete dialog of an ended contract says whether statements exist and links them; `docs/anforderungen-vertragsende.md` marks A-8 implemented
- [x] #145: backend gives the apartment's last Vertragsende; «Leer seit {Datum}» with the help on the apartment page and in the overview
- [x] #58: Mietstatus `relet` as «Vermietet ab {Datum}» on overview, building cards and apartment pages; Mieter «Künftig» with only a future contract, «Aktiv» only with a running one (backend status filter)
- [x] a11y and language rows for new states (`apartment-detail-vacant`, `contract-detail-ended`; seed: Emil 2.02 ended 2014, Fritz 2.03 from 2100)
- Files: `backend/src/services/{apartment,tenant}.service.ts`, `backend/src/routes/tenants.ts`, `src/lib/apartment.ts`, `src/lib/types.ts`, `src/lib/server/apartment.ts`, `src/routes/apartments/{+page.server.ts,[id]/ApartmentFacts.svelte,[id]/ContractHistory.svelte}`, `src/routes/buildings/{+page.server.ts,[id]/+page.server.ts}`, `src/routes/dashboard/{+page.server.ts,BuildingFigures.svelte}`, `src/routes/contracts/[id]/{+page.server.ts,+page.svelte,DeleteContract.svelte}`, `src/routes/tenants/{+page.server.ts,TenantFilters.svelte,TenantRow.svelte}`, `messages/*.json`, `tests/contracts/tenants.json`, `docs/design/i18n-begriffe.md`, `docs/anforderungen-vertragsende.md`
- [x] Code review round 1 (`docs/reviews/w4bm-review-1.md`): C-1 (Major, «keine Abrechnung» on a failed load) fixed; C-2, C-3 (API contract `apartments.json`), C-5, C-6, C-8 fixed; C-7 left (existing step wording)
- [x] fach-reviewer round 2 (`docs/reviews/w4bm-fachreview-2.md`): no Blocker/Major; V-9 fixed
- [x] Personas Anna (`docs/design/personas/anna-w4b-mietstatus.md`), Marco (`docs/design/personas/marco-w4b-mietstatus.md`): Anna P-1 (Major, overview names only empty apartments that had a contract) fixed with «Wohnung {Nr} leer»; P-3 (help on every empty apartment) fixed; Marco P-1 rejected (he typed `status=former`, not a filter value)
- [x] Fallow gate on the fixes: shared select fields in `apartment.service.ts`, `historyPeriod` for both contract histories (also `TenantContracts.svelte`, no behaviour change), dialog notes as `$derived`
- [x] Anna re-run (section «Nachprüfung» in her report): P-1 and P-3 (never-rented apartment) fixed; P-8 and the rest of P-3 Minor
- [x] Code review round 2 (`docs/reviews/w4bm-review-2.md`): C-1 closed; C-9 (Major, help on a never-rented empty apartment untested) fixed with scenario lines and a page test; C-10 (round-1 C-4 was wrong, the wizard never shows the status) reverted; C-11 rejected: the 3.02 part of Anna's P-3 is V-1 of the domain review, a product-owner decision; C-12 fixed
- [ ] Workflow notes, archive the session, pull request
