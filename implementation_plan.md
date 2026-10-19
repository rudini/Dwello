# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session G1: Gebäude mit allen Wohnungen aus dem Gebäuderegister (#479)

Branch `claude/nifty-tesla-gmus4a`. «Setze #479 um»: address search through the BFF against geo.admin.ch (GWR) instead of OpenPLZ; a preview of the register's Wohnungen; Gebäude and Wohnungen created in one transaction.

- [x] Scenarios in `building-new.feature` (17), `privacy.feature`; GWR stand-in `backend/scripts/gwr-stub.ts` (2529)
- [x] fach-reviewer round 1 (`docs/reviews/479-fachreview-1.md`), product owner answers in #479 (V-1, V-2, V-3, V-10); round 2 (`docs/reviews/479-fachreview-2.md`); glossary issue #488
- [x] Backend: `POST /buildings` with `apartments[]` in one transaction (`building.routes.pg.test.ts`; response unchanged, no contract change)
- [x] BFF: `/api/addresses`, `/api/addresses/[egid]`, `src/lib/server/building-register.ts`, `parseRegisterApartments` (unit tests)
- [x] UI: `AddressSearch.svelte`, `RegisterApartments.svelte`, `BuildingForm.svelte` (hints, preview); `Select` takes a `note`; OpenPLZ removed
- [x] Privacy statement, texts in four languages, docs (`tech-stack.md`, `PRD-Dwello.md`, `api-specification.md`, U-23 P-7/P-8)
- [x] a11y and language screens: `building-new` states `register-preview`, `register-submit-missing`, `register-no-apartments`, `register-no-hit`, `register-unreachable`
- [x] Code review round 1 (`docs/reviews/479-review-1.md`): C-1 contract `building-apartment-number-taken.json` and BFF test (kept behaviour), C-2 = V-15, C-3 proposals of a second address, C-5 coordinates removed; C-4 kept (no test for a failing `/api/addresses/<egid>`)
- [x] fach-reviewer round 3 (`docs/reviews/479-fachreview-3.md`): V-15 numbers checked (comma, > 0, half rooms), V-16 apartment form keeps values outside its choices, V-17, V-18 (`i18n-begriffe.md`), V-19
- [x] Persona round 1 (`docs/design/personas/{helga,marco,weber,sven,anna}-479.md`): the persona server could not reach geo.admin.ch (Node `fetch` ignores `HTTPS_PROXY`): `persona-stack.sh` starts with `NODE_USE_ENV_PROXY=1`, O-42; Sven P-1 hints announced (live region), P-3 clearing the search; P-2 existing before (O-43)
- [x] Persona round 2 (same reports, «Runde 2»): every task done; fixed: focus after a refused save behind the skip link (Sven P-2, made more visible by the Wohnungen; `focus-error.ts`, scenario), unit m² at «Fläche» (five personas), Wohnungen ordered by floor and number (Marco P-2, Weber P-12); rejected: saving an address already entered (Anna P-5, Helga P-9: decided in #479)
- [ ] Closing review
- [ ] PR `Fixes #479`
