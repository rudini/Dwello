# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: contract wizard keeps the apartment and takes over the rent (#144)

Request: «Setze #144 um» (coordinator W10). #144's "Done means" still asks for an implementation issue; the decided Option A is the requirement, the pull request says `Fixes #144`.

- [x] The preselected apartment survives the detour to «Neuen Mieter erfassen» (scenario in `contract-new.feature`)
- [x] Nettomiete, Zusatzmiete and Akonto are preset from the apartment's last Mietvertrag, editable, marked as taken over (scenario in `contract-new.feature`)
- [x] fach-reviewer on the `@wip` scenarios before implementing (amounts)
- [x] fach-reviewer round 1 (`docs/reviews/p17-fachreview-1.md`): took V-1, V-2, V-3, V-6, M-1, M-3
- [x] axe/language state `rent-taken-over` (`tests/a11y/screens.json`)
- [x] Found: suggested Vertragsbeginn 01.01.2100 refused by the wizard's own check → #296
- [ ] Slice review (code-reviewer), feature review (persona Helga)
- [ ] Checks before push; workflow review; archive session; pull request merged

Files: `src/lib/contract-wizard.ts`, `src/routes/contracts/new/{ContractWizard,RentStep,TenantStep}.svelte`, `src/routes/tenants/TenantForm.svelte`, `src/routes/tenants/new/+page.svelte`, `src/lib/server/tenant-form.ts`, `messages/*.json`, `tests/a11y/screens.json`, tests in `src/__tests__/` and `tests/e2e/`.
