# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W3d: Monatlich total names and «Tankbestand» title (#62, #75)

Branch `claude/w3d-monatlich-total-tankbestand-62-75`. Both issues have "Done means" worded like decision issues; their "Decided (product owner)" sections are the requirement.

- [x] #62, #75: glossary checked: «Monatlich total» no longer compares with «Bruttomiete»; «Zeitanteil», «Heizmaterial», «Empfangsschein» are entries; no `TODO(fachlich prüfen, #62|#75)` markers left
- [x] #75: scenario «Der Abschnitt zum Heizmaterial heisst Tankbestand» in `building-detail.feature`, seen red, green
- [x] fach-reviewer on the `@wip` scenario and the fr/it/en words before implementing: `docs/reviews/w3d-fachreview-1.md`
- [x] #75: `buildings_fuel_title` «Tankbestand» in four languages (fr/it/en from `docs/design/i18n-begriffe.md`, not the «citerne / serbatoio» of #315); fr intro «le dépôt» (V-1)
- [x] #62: rename `grossRent`, `rentBrutto`, `totalBrutto` and the test «Bruttomiete» to Monatlich total names (No scenario: internal names only, no behaviour change; no API field involved); `grossRent`, `rentBrutto`, `totalBrutto` → `monthlyTotal`
- [x] slice review rename (code-reviewer): `docs/reviews/rename-review-1.md`
- [x] #62 after review: tenant rental `rent` → `monthlyTotal` (V-5), E2E step «beträgt das Monatlich total der Wohnung» (V-6, C-1)
- [x] slice review title (code-reviewer): `docs/reviews/title-review-1.md` (Nits stay)
- [ ] feature review: persona (building page title), fach-reviewer if words changed after round 1
- [ ] Workflow note / workflow-review if it applies

Files: `src/lib/server/{contract-history,apartment}.ts`, `src/lib/types.ts`, `src/routes/apartments/[id]/{ContractHistory,MonthlyCostsCard}.svelte`, `src/routes/tenants/[id]/{+page.server.ts,TenantContracts.svelte,TenantRentalCard.svelte}`, `messages/*.json`, tests in `src/__tests__/{apartment,apartments-pages.dom,tenant-detail,tenant-detail-page.dom,buildings-pages.dom}.test.ts`, E2E `building-detail` and `apartment-detail` features, steps, questions, targets.
