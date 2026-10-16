# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: moves within the house and contracts that continue by law (#156, #155)

Request: «Setze #156 #155 um».

- [x] #156 «Nächste Schritte» get «Neuen Mietvertrag für {name} erfassen» to `/contracts/new?tenant=…` (scenario in `contract-detail.feature`, DOM test `NextSteps.svelte`)
- [x] #156 «Neuer Mietvertrag» hints when the chosen tenant still has an open-ended Mietvertrag for another apartment (not blocking)
- [x] #156 «Neuen Mietvertrag erfassen» on «Mietvertrag bearbeiten» fills in the tenant and the earliest start (`?start=`)
- [x] #155 help text (four languages) and `docs/anforderungen-vertragsende.md`: death keeps the Mietvertrag (heirs' address as Korrespondenzadresse); transfer or court assignment is Vertragsende plus new Mietvertrag
- [x] fach-reviewer on the `@wip` scenarios before implementing
- [x] fach-reviewer round 1 (`docs/reviews/w10-fachreview-1.md`)
- [x] #155 also in the dialog «Mietvertrag beenden» (Fachreview W10 M-1); the edit link names the tenant (V-1)
- [x] code-reviewer round 1 (`docs/reviews/w10-review-1.md`)
- [x] fach-reviewer round 2 (`docs/reviews/w10-fachreview-2.md`)
- [x] persona Helga (`docs/design/personas/helga-b16.md`), persona Dr. Weber (`docs/design/personas/weber-f23.md`)
- [ ] fach-reviewer round 3, Dr. Weber re-run on the changed texts, closing code-reviewer round
- [ ] Checks before push; workflow review; archive session; pull request merged

Files: `messages/{de,fr,it,en}.json`, `src/routes/contracts/[id]/NextSteps.svelte`, `src/routes/contracts/[id]/+page.svelte`, `src/routes/contracts/ContractForm.svelte`, `src/routes/contracts/new/ContractWizard.svelte`, `src/routes/contracts/new/OpenContracts.svelte`, `src/lib/contract-form.ts`, `src/lib/contract-wizard.ts`, `src/lib/utils/contract-availability.ts`, `docs/anforderungen-vertragsende.md`, tests in `src/__tests__/` and `tests/e2e/`.
