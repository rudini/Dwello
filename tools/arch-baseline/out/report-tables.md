### History

| month | commits |
|---|---|
| 2026-01 | 54 |
| 2026-02 | 39 |
| 2026-04 | 4 |
| 2026-09 | 23 |
| 2026-10 | 2609 |

| type | units | via PR | direct on main | type from unit-types.json |
|---|---|---|---|---|
| feat | 113 | 97 | 16 | 18 |
| fix | 150 | 91 | 59 | 5 |
| docs | 80 | 37 | 43 | 3 |
| chore | 65 | 35 | 30 | 4 |

window: since 2026-04-23 on d4d508cc2; units 408; commits (non-merge) 1937

feat units by number of feat commits inside: 0: 2, 1: 82, 2-3: 21, >=4: 8

unit titles naming an issue (#n): 34 of 408

### Excluded units and commits

| sha | pr | title | reason |
|---|---|---|---|
| 8e0ef17fa2 |  | Merge remote-tracking branch 'origin/main' | sync merge on main (not a PR): diff would repeat other units |
| 75193cb938 | 19 | chore(build): format src with Prettier (#19) | formatting-only title |
| e6debb78a7 |  | Merge remote-tracking branch 'origin/claude/ecstatic-hawking-2urqri' into claude/nice-bun-b6a451 | sync merge on main (not a PR): diff would repeat other units |
| 4037e44ebf |  | fix(config): format the KI settings BFF | commit: formatting-only subject |
| e2f236d081 |  | chore(tests): format the password sign-in files | commit: formatting-only subject |
| 242e4ff642 |  | chore(build): format the merged overview load | commit: formatting-only subject |
| 9d83882e6b |  | chore(tests): format wizard draft test | commit: formatting-only subject |
| 75193cb938 |  | chore(build): format src with Prettier (#19) | commit: formatting-only subject |

### Excluded files (HEAD)

| reason | files |
|---|---|
| generated tool baseline / fixture | 4 |
| binary (screenshot, font, PDF) | 145 |
| lockfile | 2 |
| data dump (demo data SQL) | 1 |

### Layers (HEAD)

| layer | kind | files | loc | modules |
|---|---|---|---|---|
| Process | other | 1551 | 73713 | 9 |
| Tests-Unit | test | 295 | 48676 | 12 |
| FE | prod | 297 | 30175 | 50 |
| Tests-Acceptance | test | 237 | 22112 | 12 |
| Backend | prod | 69 | 13077 | 66 |
| Marketing | other | 30 | 7118 | 12 |
| BFF | prod | 122 | 6877 | 64 |
| Docs | other | 30 | 5507 | 9 |
| Tooling | other | 83 | 5176 | 15 |
| DB | prod | 41 | 1574 | 5 |
| Shared/Contracts | test | 76 | 891 | 1 |
| Shared/Contracts | prod | 1 | 398 | 1 |
| Other | other | 1 | 124 | 1 |

### Import edges between layers (file level)

| from_layer | to_layer | file_edges |
|---|---|---|
| FE | FE | 1065 |
| Tests-Acceptance | Tests-Acceptance | 567 |
| Backend | Backend | 251 |
| Tests-Unit | Tests-Unit | 241 |
| Tests-Unit | FE | 205 |
| Tests-Unit | Backend | 165 |
| BFF | BFF | 145 |
| Tests-Unit | BFF | 138 |
| Tests-Unit | DB | 102 |
| FE | Shared/Contracts | 85 |
| BFF | FE | 60 |
| Backend | DB | 57 |
| Tests-Unit | Tooling | 51 |
| Tooling | Tooling | 48 |
| BFF | Shared/Contracts | 23 |
| FE | BFF | 17 |
| Tests-Unit | Tests-Acceptance | 6 |
| Tooling | DB | 4 |
| DB | DB | 4 |
| DB | Backend | 3 |
| Tests-Unit | Shared/Contracts | 3 |
| Tooling | Backend | 2 |
| Shared/Contracts | FE | 1 |
| Tests-Acceptance | Tests-Unit | 1 |
| Tests-Acceptance | FE | 1 |
| Tests-Acceptance | BFF | 1 |
| Tooling | FE | 1 |

### Import graph

| files | edges | type_only_edges | file_cycles | runtime_cycles | module_cycles | files_with_unresolved_paths |
|---|---|---|---|---|---|---|
| 1007 | 3247 | 260 | 1 | 0 | 3 | 14 |

### Cycles

| cycle | size | runtime | files |
|---|---|---|---|
| 1 | 2 | no (type-only edges) | backend/src/services/pdf.service.ts backend/src/services/reminder-letter.ts |

| cycle | size | modules |
|---|---|---|
| 1 | 2 | be:services/pdf be:services/reminder-letter |
| 2 | 2 | fe:lib/navigation fe:ui |
| 3 | 2 | e2e:questions e2e:tasks |

fallow circular_dependencies: 0; deepcheck scan: analyzed 180, shallow 0, excluded 576

### M1 summary

| Metrik | feat Median | feat P90 | feat Max | feat (1 feat-Commit) Median | feat (1 feat-Commit) P90 | fix Median | fix P90 | feat+fix Median | feat+fix P90 |
|---|---|---|---|---|---|---|---|---|---|
| files_total | 38 | 86 | 518 | 34 | 71 | 9 | 27 | 17 | 71 |
| files_prod | 12 | 31 | 294 | 9.5 | 25 | 2 | 9 | 5 | 23 |
| files_test | 16 | 38 | 161 | 11.5 | 32 | 3 | 13 | 5 | 29 |
| files_other | 12 | 24 | 63 | 9 | 16 | 3 | 11 | 6 | 18 |
| modules_prod | 7 | 20 | 88 | 5 | 17 | 2 | 6 | 3 | 16 |
| modules_test | 7 | 11 | 12 | 7 | 10 | 2 | 7 | 4 | 10 |
| layers_prod | 3 | 5 | 5 | 2 | 5 | 1 | 3 | 1 | 5 |
| loc_prod | 182 | 797 | 20298 | 106.5 | 485 | 14.5 | 105 | 33 | 484 |
| loc_test | 265 | 1190 | 8904 | 203 | 735 | 40.5 | 188 | 95 | 735 |

| Gruppe | Anteil | % |
|---|---|---|
| feat | pct_units_with_>=3_prod_layers | 54 |
| feat | pct_units_touching_i18n | 67.3 |
| feat | pct_units_touching_Process | 92.9 |
| feat | pct_units_touching_Tests-Acceptance | 88.5 |
| fix | pct_units_with_>=3_prod_layers | 11.3 |
| fix | pct_units_touching_i18n | 22 |
| fix | pct_units_touching_Process | 82 |
| fix | pct_units_touching_Tests-Acceptance | 50.7 |

### M1 per layer (files per unit)

| Schicht | feat Median | feat P90 | fix Median | fix P90 |
|---|---|---|---|---|
| FE | 8 | 19 | 0 | 7 |
| BFF | 1 | 7 | 0 | 2 |
| Backend | 2 | 7 | 0 | 2 |
| DB | 0 | 2 | 0 | 1 |
| Shared/Contracts | 1 | 4 | 0 | 1 |
| Tests-Unit | 5 | 17 | 1 | 4 |
| Tests-Acceptance | 9 | 19 | 1 | 8 |
| Tooling | 0 | 3 | 0 | 1 |
| Docs | 2 | 6 | 0 | 2 |
| Process | 9 | 17 | 3 | 8 |
| Marketing | 0 | 0 | 0 | 0 |

file changes in feat units: 5868; prod 36.9 %, test 38.1 %, other 25.0 %

### M1 top 10 feat (by production files)

| id | date | title | commits | files_prod | files_test | files_other | modules_prod | layers_prod | n_FE | n_BFF | n_Backend | n_DB | n_Tests-Unit | n_Tests-Acceptance | n_Process |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| PR#32 | 2026-10-10 | feat: new design system and guided UI (redesign) | 96 | 294 | 161 | 63 | 56 | 3 | 269 | 24 | 0 | 0 | 82 | 79 | 33 |
| PR#48 | 2026-10-12 | feat(i18n): UI in German, French, Italian, English | 51 | 251 | 38 | 58 | 88 | 4 | 185 | 42 | 23 | 0 | 28 | 10 | 20 |
| PR#39 | 2026-10-11 | feat(statements): Swiss statement PDF, invoice check, date field | 32 | 101 | 114 | 30 | 55 | 5 | 54 | 13 | 22 | 11 | 66 | 42 | 20 |
| PR#238 | 2026-10-16 | feat(invoices): create invoices from uploaded files | 15 | 48 | 32 | 38 | 23 | 5 | 27 | 9 | 9 | 2 | 14 | 15 | 23 |
| PR#539 | 2026-10-20 | feat(categories): categories and required Verteilschlüssel (#452) | 27 | 38 | 64 | 20 | 22 | 5 | 23 | 6 | 7 | 1 | 34 | 29 | 14 |
| PR#392 | 2026-10-17 | feat(contracts): agreed Nebenkosten per Mietvertrag | 16 | 38 | 39 | 22 | 22 | 5 | 19 | 8 | 8 | 2 | 16 | 20 | 19 |
| PR#361 | 2026-10-17 | Korrespondenzadresse with country, old-address warning, LI IBAN | 20 | 37 | 55 | 27 | 29 | 5 | 14 | 8 | 12 | 2 | 18 | 32 | 22 |
| PR#43 | 2026-10-11 | feat(statements): fee of own costs, Saldo to 5 Rappen | 10 | 37 | 30 | 21 | 20 | 5 | 13 | 4 | 7 | 12 | 19 | 9 | 13 |
| PR#54 | 2026-10-12 | feat(contracts): upcoming end, statements after an end change | 23 | 34 | 39 | 11 | 21 | 4 | 22 | 8 | 3 | 0 | 17 | 19 | 8 |
| PR#527 | 2026-10-20 | feat(statements): carry over Saldo below CHF 5.00 | 13 | 33 | 47 | 24 | 20 | 5 | 17 | 6 | 7 | 2 | 22 | 23 | 17 |

### M1 modules touched by most feat units (top 25)

| name | layer | kind | units | pct_of_units | file_changes |
|---|---|---|---|---|---|
| e2e:features | Tests-Acceptance | test | 96 | 85 | 355 |
| fe-test:unit | Tests-Unit | test | 95 | 84.1 | 587 |
| e2e:steps | Tests-Acceptance | test | 93 | 82.3 | 213 |
| docs/design | Process | other | 88 | 77.9 | 415 |
| docs/reviews | Process | other | 88 | 77.9 | 591 |
| fe:i18n | FE | prod | 76 | 67.3 | 304 |
| e2e:tasks | Tests-Acceptance | test | 76 | 67.3 | 159 |
| be-test:unit | Tests-Unit | test | 73 | 64.6 | 273 |
| docs/archive | Process | other | 73 | 64.6 | 75 |
| e2e:questions | Tests-Acceptance | test | 73 | 64.6 | 133 |
| docs | Docs | other | 72 | 63.7 | 158 |
| e2e:targets | Tests-Acceptance | test | 66 | 58.4 | 116 |
| (root) | Docs | other | 58 | 51.3 | 141 |
| e2e:fixtures | Tests-Acceptance | test | 54 | 47.8 | 88 |
| contracts | Shared/Contracts | test | 53 | 46.9 | 139 |
| tests:a11y | Tests-Acceptance | test | 51 | 45.1 | 51 |
| fe:routes/statements | FE | prod | 39 | 34.5 | 223 |
| shared:types | Shared/Contracts | prod | 37 | 32.7 | 37 |
| db:migrations | DB | prod | 35 | 31 | 53 |
| db:schema | DB | prod | 35 | 31 | 35 |
| fe:routes/contracts | FE | prod | 31 | 27.4 | 128 |
| fe:ui | FE | prod | 26 | 23 | 121 |
| be:services/statement | Backend | prod | 24 | 21.2 | 24 |
| bff:load/statements | BFF | prod | 23 | 20.4 | 27 |
| be:services/pdf | Backend | prod | 22 | 19.5 | 22 |

### M2 views

| Sicht | Transaktionen | > max_tx (ausgelassen) | Paare über Schwelle | min. gemeinsam | min. Grad | max_tx |
|---|---|---|---|---|---|---|
| file/unit prod (primary) | 244 | 3 | 68 | 5 | 0.3 | 50 |
| module/unit prod | 244 | 3 | 38 | 5 | 0.3 | 50 |
| file/unit prod+test | 311 | 23 | 281 | 5 | 0.3 | 50 |
| file/commit | 1223 | 7 | 243 | 5 | 0.3 | 50 |
| module/unit | 311 | 3 | 101 | 5 | 0.3 | 50 |
| file/unit raw i18n (quartet not collapsed) | 311 | 27 | 265 | 5 | 0.3 | 50 |

| Schicht/Import (prod) | Paare |
|---|---|
| cross/no | 28 |
| same/yes | 22 |
| cross/yes | 9 |
| same/no | 9 |

production pairs: 68; cross-layer without import: 28, of which naming contract files: 11

### M2 top 20 production file pairs (primary view: unit, production files only)

| rank | a | b | shared | degree | cross_layer | import | commits_with_both | example_sha |
|---|---|---|---|---|---|---|---|---|
| 1 | messages/{de,fr,it,en}.json | src/lib/types.ts | 36 | 0.316 | cross | no | 41 | 8d6984e33c |
| 2 | be/db/schema.ts | src/lib/types.ts | 26 | 0.426 | cross | no | 28 | acdcc9ab4f |
| 3 | be/services/pdf.service.ts | be/services/statement-pdf.service.ts | 22 | 0.478 | same | yes | 37 | f0f8a92c93 |
| 4 | be/routes/contracts.ts | be/services/contract.service.ts | 15 | 0.652 | same | yes | 18 | 64d2b16fa8 |
| 5 | be/services/contract.service.ts | routes/contracts/[id]/+page.server.ts | 15 | 0.6 | cross | no | 15 | e6644bea3b |
| 6 | be/db/schema.ts | be/services/statement.service.ts | 21 | 0.35 | cross | yes | 27 | a94beff369 |
| 7 | be/db/schema.ts | be/services/calculation.service.ts | 19 | 0.358 | cross | yes | 23 | 3130fb7939 |
| 8 | be/db/schema.ts | be/services/statement-pdf.service.ts | 19 | 0.333 | cross | yes | 24 | 67053378dc |
| 9 | be/db/schema.ts | be/services/pdf.service.ts | 20 | 0.303 | cross | yes | 27 | 047d704dba |
| 10 | routes/contracts/[id]/+page.server.ts | routes/contracts/[id]/+page.svelte | 12 | 0.5 | cross | no | 24 | ad6c5cc98e |
| 11 | src/lib/contract-form.ts | routes/contracts/ContractForm.svelte | 13 | 0.448 | same | yes | 16 | 2062c4b983 |
| 12 | be/services/calculation.service.ts | be/services/statement-pdf.service.ts | 15 | 0.385 | same | no | 15 | 67053378dc |
| 13 | src/lib/overview.ts | routes/dashboard/+page.server.ts | 11 | 0.524 | cross | yes | 15 | 618786772d |
| 14 | routes/contracts/ContractForm.svelte | routes/contracts/new/ContractWizard.svelte | 12 | 0.444 | same | no | 16 | 427f893036 |
| 15 | src/lib/invoice-upload.ts | routes/invoices/InvoiceUploadDialog.svelte | 6 | 0.857 | same | yes | 11 | 87fee8a8bb |
| 16 | src/lib/server/statement-generation.ts | src/lib/statement-wizard.ts | 12 | 0.414 | cross | yes | 21 | 3edc963119 |
| 17 | be/routes/contracts.ts | routes/contracts/[id]/+page.server.ts | 11 | 0.44 | cross | no | 9 | fa6f5df227 |
| 18 | src/lib/server/statement-generation.ts | routes/statements/generate/+page.server.ts | 10 | 0.455 | same | yes | 13 | 5d6888eb28 |
| 19 | src/lib/server/statement-actions.ts | routes/statements/[id]/+page.server.ts | 7 | 0.636 | same | yes | 11 | a4fa946033 |
| 20 | be/services/contract.service.ts | routes/contracts/ContractForm.svelte | 12 | 0.364 | cross | no | 15 | b39a53d535 |

### M2 production module pairs (top 20)

| a | b | shared | degree | cross_layer | import |
|---|---|---|---|---|---|
| db:migrations | db:schema | 40 | 0.714 | same | no |
| fe:i18n | shared:types | 36 | 0.316 | cross | no |
| db:schema | shared:types | 26 | 0.426 | cross | no |
| be:services/pdf | be:services/statement-pdf | 22 | 0.478 | same | yes |
| be:routes/contracts | be:services/contract | 15 | 0.652 | same | yes |
| db:migrations | shared:types | 25 | 0.391 | cross | no |
| bff:load/statements | fe:routes/statements | 24 | 0.387 | cross | no |
| be:services/contract | bff:load/contracts | 16 | 0.571 | cross | no |
| bff:load/contracts | fe:routes/contracts | 20 | 0.392 | cross | no |
| be:services/statement | db:schema | 21 | 0.35 | cross | yes |
| be:services/statement | db:migrations | 21 | 0.339 | cross | no |
| be:services/calculation | db:schema | 19 | 0.358 | cross | yes |
| be:services/statement | fe:routes/statements | 22 | 0.306 | cross | no |
| be:services/contract | fe:routes/contracts | 18 | 0.353 | cross | no |
| be:services/statement-pdf | db:schema | 19 | 0.333 | cross | yes |
| be:services/pdf | db:schema | 20 | 0.303 | cross | yes |
| be:services/calculation | be:services/statement-pdf | 15 | 0.385 | same | no |
| bff:load/dashboard | fe:lib/overview | 11 | 0.524 | cross | yes |
| be:routes/contracts | bff:load/contracts | 12 | 0.429 | cross | no |
| bff:load/statements | bff:server/statement-generation | 13 | 0.394 | same | yes |

### M2 context: top 10 file pairs incl. tests (prod+test view)

| a | b | shared | degree | cross_layer | import |
|---|---|---|---|---|---|
| e2e/features/accessibility.feature | e2e/features/sprachen-bildschirme.feature | 43 | 0.977 | same | no |
| tests/a11y/screens.json | e2e/features/accessibility.feature | 43 | 0.827 | same | no |
| tests/a11y/screens.json | e2e/features/sprachen-bildschirme.feature | 42 | 0.808 | same | no |
| tests/a11y/screens.json | e2e/tasks/accessibility.ts | 40 | 0.656 | same | no |
| e2e/features/sprachen-bildschirme.feature | e2e/tasks/accessibility.ts | 37 | 0.661 | same | no |
| e2e/features/accessibility.feature | e2e/tasks/accessibility.ts | 37 | 0.649 | same | no |
| messages/{de,fr,it,en}.json | tests/a11y/screens.json | 44 | 0.44 | cross | no |
| messages/{de,fr,it,en}.json | e2e/features/sprachen-bildschirme.feature | 40 | 0.417 | cross | no |
| messages/{de,fr,it,en}.json | e2e/features/accessibility.feature | 40 | 0.412 | cross | no |
| messages/{de,fr,it,en}.json | e2e/tasks/accessibility.ts | 39 | 0.375 | cross | no |

### M1 production files per scope (feat+fix, scopes with >= 5 units)

| scope | units | files_prod_median | files_prod_p90 |
|---|---|---|---|
| statements | 55 | 7 | 27 |
| contracts | 35 | 10 | 26 |
|  | 25 | 18 | 29 |
| invoices | 24 | 4 | 25 |
| tests | 24 | 0 | 5 |
| config | 14 | 1 | 7 |
| services | 14 | 1 | 5 |
| ci | 10 | 0 | 0 |
| i18n | 8 | 5 | 251 |
| db | 8 | 2 | 5 |
| components | 7 | 3 | 31 |
| buildings | 7 | 3 | 22 |
| tenants | 6 | 11.5 | 21 |
| auth | 5 | 11 | 24 |
| categories | 5 | 9 | 38 |

### M2 commit-level file pairs (top 10, for comparison)

| a | b | shared | degree | cross_layer | import |
|---|---|---|---|---|---|
| tests/a11y/screens.json | e2e/features/accessibility.feature | 95 | 0.812 | same | no |
| e2e/features/accessibility.feature | e2e/features/sprachen-bildschirme.feature | 82 | 0.837 | same | no |
| tests/a11y/screens.json | e2e/features/sprachen-bildschirme.feature | 81 | 0.681 | same | no |
| e2e/features/sprachen-bildschirme.feature | e2e/tasks/accessibility.ts | 65 | 0.537 | same | no |
| tests/a11y/screens.json | e2e/tasks/accessibility.ts | 70 | 0.473 | same | no |
| e2e/features/accessibility.feature | e2e/tasks/accessibility.ts | 65 | 0.489 | same | no |
| be/__tests__/statement-pdf-render.test.ts | be/services/pdf.service.ts | 47 | 0.495 | cross | yes |
| src/__tests__/contract-edit.dom.test.ts | routes/contracts/ContractForm.svelte | 38 | 0.559 | cross | no |
| e2e/features/statement-detail.feature | e2e/steps/statement-detail.steps.ts | 50 | 0.4 | same | no |
| e2e/questions/statement-generate.ts | e2e/steps/statement-generate.steps.ts | 32 | 0.525 | same | yes |

### M3 hotspots, production (top 15, ranked by commits x total cyclomatic)

| Rang (prod) | CRAP-Rang (prod) | path | layer | commits | units | total_cyclomatic | crap_max | lines | fan_in |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | backend/src/services/pdf.service.ts | Backend | 82 | 40 | 304 | 26.5 | 1460 | 7 |
| 2 | 2 | backend/src/services/statement.service.ts | Backend | 69 | 36 | 191 | 26.5 | 1031 | 23 |
| 3 | 3 | backend/src/services/statement-pdf.service.ts | Backend | 52 | 30 | 164 | 26.5 | 385 | 9 |
| 4 | 6 | src/lib/server/statement-generation.ts | BFF | 44 | 23 | 152 | 26.5 | 459 | 6 |
| 5 | 5 | src/lib/statement-wizard.ts | FE | 45 | 24 | 128 | 26.5 | 402 | 19 |
| 6 | 12 | backend/src/services/calculation.service.ts | Backend | 43 | 27 | 104 | 17.6 | 512 | 4 |
| 7 | 14 | src/routes/contracts/[id]/+page.server.ts | BFF | 38 | 21 | 115 | 17.6 | 389 | 1 |
| 8 | 10 | backend/src/services/contract.service.ts | Backend | 37 | 23 | 88 | 21.8 | 529 | 17 |
| 9 | 9 | src/lib/server/statement.ts | BFF | 40 | 24 | 81 | 21.8 | 232 | 10 |
| 10 | 4 | src/routes/contracts/ContractForm.svelte | FE | 51 | 26 | 63 | 26.5 | 395 | 1 |
| 11 | 41 | src/lib/contract-form.ts | FE | 27 | 20 | 112 | 12.5 | 292 | 13 |
| 12 | 151 | backend/src/db/schema.ts | DB | 61 | 48 | 45 | 1.2 | 688 | 81 |
| 13 | 35 | backend/src/services/invoice.service.ts | Backend | 24 | 17 | 110 | 17.6 | 634 | 8 |
| 14 | 31 | src/routes/dashboard/+page.server.ts | BFF | 33 | 21 | 75 | 13.8 | 246 | 5 |
| 15 | 27 | backend/src/services/invoice-completeness.service.ts | Backend | 18 | 7 | 130 | 26.5 | 363 | 3 |

### M3 hotspots, tests (top 5)

| path | commits | units | total_cyclomatic | crap_max | lines |
|---|---|---|---|---|---|
| tests/e2e/tasks/accessibility.ts | 104 | 63 | 268 | 10.4 | 804 |
| src/__tests__/statement-pages.dom.test.ts | 97 | 31 | 251 | 7.5 | 1978 |
| src/__tests__/statement-wizard.dom.test.ts | 82 | 30 | 206 | 7.5 | 1972 |
| tests/e2e/fixtures/backend.ts | 92 | 55 | 154 | 21.8 | 637 |
| src/__tests__/invoice-pages.dom.test.ts | 72 | 26 | 174 | 4.9 | 1463 |

fallow coverage_model: static_estimated; files scored 951; functions above threshold 7; files whose crap_max is exactly 26.5: 46

### M4 entity mirrors (files outside DB that declare >= threshold of a table's distinctive fields)

| table | fields | distinctive | threshold | files | FE | BFF | Backend | Shared | contract_fixtures |
|---|---|---|---|---|---|---|---|---|---|
| apartments | 9 | 5 | 3 | 21 | 2 | 8 | 9 | 1 | 1 |
| distributionKeys | 8 | 5 | 3 | 21 | 3 | 4 | 7 | 1 | 6 |
| tenants | 14 | 9 | 5 | 18 | 0 | 4 | 10 | 1 | 3 |
| categories | 10 | 7 | 4 | 18 | 1 | 3 | 7 | 1 | 6 |
| buildings | 14 | 10 | 5 | 9 | 1 | 4 | 1 | 1 | 2 |
| rentalContracts | 21 | 17 | 9 | 9 | 2 | 1 | 3 | 1 | 2 |
| utilityStatements | 40 | 35 | 18 | 9 | 0 | 1 | 4 | 1 | 3 |
| invoices | 22 | 16 | 8 | 8 | 3 | 1 | 2 | 1 | 1 |
| invoiceDocuments | 7 | 6 | 3 | 8 | 0 | 1 | 5 | 1 | 1 |
| contractCategories | 4 | 4 | 3 | 7 | 1 | 1 | 4 | 1 | 0 |
| documents | 16 | 12 | 6 | 6 | 0 | 0 | 4 | 1 | 1 |
| utilityStatementLineItems | 16 | 13 | 7 | 5 | 0 | 1 | 2 | 1 | 1 |
| kiSettings | 8 | 6 | 3 | 5 | 0 | 1 | 3 | 0 | 1 |
| fuelStocks | 6 | 3 | 3 | 3 | 0 | 1 | 1 | 0 | 1 |
| auditLog | 4 | 3 | 3 | 2 | 0 | 1 | 0 | 0 | 1 |
| heatingProfiles | 26 | 20 | 10 | 1 | 0 | 0 | 1 | 0 | 0 |
| localAccounts | 8 | 4 | 3 | 1 | 0 | 0 | 1 | 0 | 0 |

### M4 type declarations per entity

| entity | type_declarations | distinct_names | files | names_in_FE | names_in_BFF | names_in_Backend | names_in_DB | names_in_Shared |
|---|---|---|---|---|---|---|---|---|
| Contract | 30 | 17 | 19 | 6 | 5 | 5 | 2 | 4 |
| Statement | 29 | 20 | 16 | 2 | 3 | 10 | 2 | 8 |
| Invoice | 18 | 14 | 8 | 2 | 0 | 8 | 4 | 4 |
| Building | 13 | 10 | 8 | 2 | 3 | 2 | 2 | 4 |
| Apartment | 13 | 8 | 5 | 0 | 2 | 5 | 2 | 4 |
| Tenant | 13 | 8 | 7 | 0 | 4 | 4 | 2 | 3 |
| Category | 11 | 7 | 8 | 2 | 1 | 5 | 2 | 1 |
| DistributionKey | 7 | 5 | 5 | 1 | 0 | 2 | 2 | 1 |
| LineItem | 7 | 5 | 5 | 0 | 0 | 4 | 2 | 1 |
| Document | 6 | 4 | 5 | 1 | 0 | 2 | 2 | 1 |
| HeatingProfile | 5 | 4 | 3 | 0 | 0 | 1 | 3 | 1 |
| Ki | 4 | 4 | 3 | 0 | 2 | 2 | 0 | 0 |
| Reminder | 3 | 3 | 3 | 0 | 1 | 2 | 0 | 0 |
| FuelStock | 1 | 1 | 1 | 0 | 1 | 0 | 0 | 0 |
| AdvancePayment | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

### M4 same type name in several files (top 15)

| name | files | layers | where |
|---|---|---|---|
| Period | 5 | BFF\|Backend | be/services/invoice-completeness.service.ts, be/services/prorating.service.ts, be/services/statement-invoices.service.ts, src/lib/server/invoice.ts, src/lib/server/statement-generation.ts |
| Apartment | 4 | BFF\|Backend\|DB\|Shared/Contracts | be/db/schema.ts, be/services/apartment.service.ts, src/lib/types.ts, routes/contracts/new/+page.server.ts |
| Tenant | 4 | BFF\|Backend\|DB\|Shared/Contracts | be/db/schema.ts, be/services/tenant.service.ts, src/lib/types.ts, routes/contracts/new/+page.server.ts |
| RefusedStatement | 4 | BFF\|FE | src/lib/contract-status.ts, routes/contracts/ContractForm.svelte, routes/contracts/[id]/+page.server.ts, routes/contracts/[id]/+page.svelte |
| Contract | 4 | BFF\|FE | src/lib/former-tenant-documents.ts, src/lib/server/statement-generation.ts, routes/statements/generate/AgreedCosts.svelte, routes/statements/generate/FeeNotAgreed.svelte |
| Row | 4 | BFF | src/lib/server/missing-statements.ts, routes/contracts/[id]/+page.server.ts, routes/dashboard/+page.server.ts, routes/statements/generate/+page.server.ts |
| Fetch | 4 | BFF | src/lib/server/password-login.ts, src/lib/server/statement-actions.ts, src/lib/server/statement-generation.ts, routes/buildings/[id]/+page.server.ts |
| Building | 3 | DB\|FE\|Shared/Contracts | be/db/schema.ts, src/lib/types.ts, routes/apartments/new/BuildingField.svelte |
| RentalContract | 3 | Backend\|DB\|Shared/Contracts | be/db/schema.ts, be/services/contract.service.ts, src/lib/types.ts |
| Category | 3 | DB\|FE\|Shared/Contracts | be/db/schema.ts, src/lib/types.ts, routes/statements/generate/AgreedCosts.svelte |
| Invoice | 3 | Backend\|DB\|Shared/Contracts | be/db/schema.ts, be/services/invoice.service.ts, src/lib/types.ts |
| Document | 3 | Backend\|DB\|FE | be/db/schema.ts, be/services/reminder.service.ts, src/lib/former-tenant-documents.ts |
| Statement | 3 | Backend\|Shared/Contracts | be/services/reminder.service.ts, be/services/statement-invoices.service.ts, src/lib/types.ts |
| Range | 3 | BFF\|FE | src/lib/accounting-period.ts, src/lib/server/missing-statements.ts, src/lib/statement-wizard.ts |
| ContractForAvailability | 3 | FE | src/lib/contract-form.ts, src/lib/utils/contract-availability.ts, routes/contracts/new/ContractWizard.svelte |

### M4 identical string-literal sets in several files

| values | files | layers | cross_layer | where |
|---|---|---|---|---|
| de\|en\|fr\|it | 6 | BFF\|Backend\|Shared/Contracts | yes | be/routes/categories.ts, be/routes/tenants.ts, be/services/config.service.ts, be/services/pdf.service.ts, src/lib/types.ts, routes/tenants/+page.server.ts |
| custom\|predefined | 6 | Backend\|FE\|Shared/Contracts | yes | be/routes/distribution-keys.ts, be/routes/heating-profiles.ts, be/services/distribution-key.service.ts, be/services/heating-profile.service.ts, src/lib/distribution-key.ts, src/lib/types.ts |
| local\|none\|provider | 4 | BFF\|Backend\|DB | yes | be/db/schema.ts, be/routes/ki-settings.ts, be/services/ki-settings.service.ts, src/lib/server/ki-settings.ts |
| active\|ended\|future | 4 | BFF\|Backend\|Shared/Contracts | yes | be/routes/contracts.ts, be/services/contract.service.ts, src/lib/types.ts, routes/contracts/+page.server.ts |
| occupied\|relet\|reserved\|vacant | 3 | Backend\|Shared/Contracts | yes | be/routes/apartments.ts, be/services/apartment.service.ts, src/lib/types.ts |
| hits\|none\|unreachable | 3 | FE | no | routes/buildings/AddressSearch.svelte, routes/buildings/BuildingForm.svelte, routes/buildings/RegisterNotices.svelte |
| failed\|loaded\|loading | 3 | FE | no | routes/contracts/ContractForm.svelte, routes/statements/generate/AgreedCosts.svelte, routes/statements/generate/AgreementsCheck.svelte |
| email\|letter | 3 | Backend\|FE\|Shared/Contracts | yes | be/routes/tenants.ts, src/lib/types.ts, routes/statements/[id]/MetadataCard.svelte |
| consumption\|deviation\|gap\|missing\|new\|stock\|tank | 2 | Backend\|FE | yes | be/services/invoice-completeness.service.ts, src/lib/statement-wizard.ts |
| draft\|overdue\|paid\|sent | 2 | Backend | no | be/routes/statements.ts, be/services/statement.service.ts |
| overdue\|paid\|sent\|settled | 2 | Backend | no | be/services/statement-invoices.service.ts, be/services/statement.service.ts |
| DELETE\|PATCH\|POST\|PUT | 2 | BFF\|FE | yes | src/lib/api.ts, src/lib/server/api-proxy.ts |
| area\|floor\|number\|rooms | 2 | BFF\|FE | yes | src/lib/server/building-register.ts, routes/buildings/RegisterApartments.svelte |
| invoice_added\|payment_received\|statement_created | 2 | BFF\|Backend | yes | be/routes/dashboard.ts, routes/dashboard/+page.server.ts |
| active\|future\|inactive | 2 | Backend | no | be/routes/tenants.ts, be/services/tenant.service.ts |
| billedUntil\|endDate\|startDate | 2 | Backend\|FE | yes | be/services/contract.service.ts, src/lib/contract-wizard.ts |
| noHeatingMonths\|wholePeriod | 2 | Backend\|DB | yes | be/db/schema.ts, be/services/prorating.service.ts |
| sent\|to_send | 2 | Backend\|Shared/Contracts | yes | be/routes/documents.ts, src/lib/types.ts |
| local\|none | 2 | Backend | no | be/routes/local-accounts.ts, be/services/setup.service.ts |
| paid\|replaced | 2 | Backend\|Shared/Contracts | yes | be/services/document.service.ts, src/lib/types.ts |
| overdue\|sent | 2 | Backend | no | be/services/reminder.service.ts, be/services/statement.service.ts |

### M4 identical regex literals in several files

| regex | files | layers | where |
|---|---|---|---|
| `/^\d{4}-\d{2}-\d{2}$/` | 7 | BFF\|FE | src/lib/backend-error.ts, src/lib/contract-status.ts, routes/contracts/[id]/+page.server.ts, routes/invoices/+page.server.ts, routes/invoices/new/+page.server.ts, routes/statements/+page.server.ts, routes/statements/generate/+page.server.ts |
| `/[\\/:*?"<>\|]/g` | 3 | Backend | be/services/reminder.service.ts, be/services/statement-send.service.ts, be/services/tenant-export.service.ts |
| `/^\d+(\.\d{1,2})?$/` | 3 | BFF\|Backend\|FE | be/services/statement.service.ts, src/lib/contract-form.ts, routes/buildings/[id]/+page.server.ts |
| `/^\d{4}$/` | 3 | BFF | src/lib/server/building-form.ts, src/lib/server/tenant-form.ts, routes/invoices/+page.server.ts |
| `/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i` | 2 | BFF\|Backend | be/app.ts, routes/buildings/[id]/+page.server.ts |
| `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | 2 | BFF\|Backend | be/services/config.service.ts, src/lib/server/tenant-form.ts |
| `/^\/(?![/\\])/` | 2 | BFF\|FE | src/lib/invoice.ts, src/lib/server/login-flow.ts |
| `/auth/` | 2 | BFF | routes/auth/me/+server.ts, routes/auth/refresh/+server.ts |
| `/overlap/i` | 2 | FE | routes/contracts/ContractForm.svelte, routes/contracts/new/ContractWizard.svelte |

### M4 validation keywords per layer

| layer | files | occurrences |
|---|---|---|
| Backend | 26 | 412 |
| FE | 14 | 23 |
| BFF | 5 | 8 |

### M4 textual clones (fallow dupes)

| total_files | files_with_clones | clone_groups | duplicated_lines | duplication_percentage |
|---|---|---|---|---|
| 679 | 34 | 22 | 585 | 0.871106081362797 |

clone groups spanning layers: 0 of 22; FE/BFF files importing backend code: 0

### S4 top 5 features (by production files)

| id | merge | title | commits | prod | test | other | prod layers | test lines | selector/text lines |
|---|---|---|---|---|---|---|---|---|---|
| PR#32 | 8c7a0e972f | feat: new design system and guided UI (redesign) | 96 | 294 | 161 | 63 | FE\|BFF\|Shared/Contracts | 7497 | 805 |
| PR#48 | e6c38be977 | feat(i18n): UI in German, French, Italian, English | 51 | 251 | 38 | 58 | Backend\|FE\|BFF\|Shared/Contracts | 1860 | 58 |
| PR#39 | 0f4b3f675a | feat(statements): Swiss statement PDF, invoice check, date f | 32 | 101 | 114 | 30 | DB\|Backend\|FE\|BFF\|Shared/Contracts | 3913 | 180 |
| PR#238 | 0d970be030 | feat(invoices): create invoices from uploaded files | 15 | 48 | 32 | 38 | DB\|Backend\|FE\|BFF\|Shared/Contracts | 1501 | 87 |
| PR#539 | 1110abb8d0 | feat(categories): categories and required Verteilschlüssel ( | 27 | 38 | 64 | 20 | DB\|Backend\|FE\|BFF\|Shared/Contracts | 1114 | 38 |

### S4 registry files and contract fixtures

| type | units | units_touching_any_ritual_file | units_touching_3plus_ritual_files | ritual_file_changes | units_touching_contract_fixtures | contract_fixture_changes | units_touching_types_ts |
|---|---|---|---|---|---|---|---|
| feat | 113 | 55 | 45 | 225 | 53 | 139 | 37 |
| fix | 150 | 20 | 10 | 58 | 17 | 30 | 6 |

### M4 status values: production files naming them, per layer

| value | files | FE | BFF | Backend | DB | Shared |
|---|---|---|---|---|---|---|
| draft | 29 | 15 | 2 | 9 | 2 | 1 |
| sent | 19 | 5 | 0 | 12 | 1 | 1 |
| paid | 21 | 8 | 1 | 10 | 1 | 1 |
| replaced | 19 | 8 | 2 | 8 | 0 | 1 |
| overdue | 12 | 6 | 0 | 5 | 0 | 1 |
| settled | 11 | 4 | 0 | 6 | 0 | 1 |
| active | 11 | 4 | 2 | 4 | 0 | 1 |
| ended | 9 | 5 | 1 | 2 | 0 | 1 |
| future | 12 | 4 | 3 | 4 | 0 | 1 |

### M4 domain decisions outside the backend (status comparisons, anchored regex)

| layer | files_with_status_comparison | status_comparisons | files_with_anchored_regex | anchored_regex | total_cyclomatic |
|---|---|---|---|---|---|
| FE | 20 | 54 | 9 | 14 | 3128 |
| BFF | 5 | 9 | 11 | 19 | 1832 |
| Backend | 9 | 33 | 6 | 9 | 2605 |

| path | status_comparisons | anchored_regex | total_cyclomatic |
|---|---|---|---|
| src/lib/server/settings.ts | 0 | 4 | 39 |
| src/lib/server/building-form.ts | 0 | 3 | 27 |
| src/lib/server/statement-generation.ts | 3 | 0 | 152 |
| routes/tenants/[id]/+page.server.ts | 3 | 0 | 26 |
| src/lib/server/tenant-form.ts | 0 | 2 | 38 |
| routes/buildings/[id]/+page.server.ts | 0 | 2 | 49 |
| routes/contracts/[id]/+page.server.ts | 1 | 1 | 115 |
| routes/invoices/+page.server.ts | 0 | 2 | 26 |
| routes/statements/generate/+page.server.ts | 1 | 1 | 64 |
| src/lib/server/apartment.ts | 1 | 0 | 22 |
| src/lib/server/jwt-config.ts | 0 | 1 | 19 |
| routes/api/addresses/[egid]/+server.ts | 0 | 1 | 3 |
| routes/invoices/new/+page.server.ts | 0 | 1 | 16 |
| routes/statements/+page.server.ts | 0 | 1 | 27 |

### Baselines for the modifiability scenarios

DB fields checked: 125 (unique to one table, not generic); production files outside DB declaring the field: median 6, P90 19, max 59

| table | field | prod_files | FE | BFF | Backend | Shared | contract_fixtures |
|---|---|---|---|---|---|---|---|
| apartments | number | 59 | 32 | 15 | 11 | 1 | 12 |
| configuration | value | 59 | 41 | 8 | 10 | 0 | 0 |
| documents | title | 40 | 25 | 4 | 10 | 1 | 2 |
| utilityStatements | periodEnd | 38 | 15 | 6 | 16 | 1 | 6 |
| utilityStatements | periodStart | 35 | 12 | 6 | 16 | 1 | 6 |
| rentalContracts | startDate | 31 | 13 | 7 | 10 | 1 | 3 |
| rentalContracts | endDate | 30 | 14 | 5 | 10 | 1 | 3 |
| utilityStatementLineItems | invoices | 26 | 12 | 5 | 8 | 1 | 5 |
| apartments | rooms | 23 | 3 | 9 | 10 | 1 | 1 |
| tenants | language | 23 | 3 | 6 | 13 | 1 | 3 |

screens in tests/a11y/screens.json: 87; files under tests/ naming a screen id: min 3, median 3, max 43; screens named in all three registries (screens.json, accessibility.feature, sprachen-bildschirme.feature): 87
