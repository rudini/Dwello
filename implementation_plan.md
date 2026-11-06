# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end. A session that appears on `main` after this one started makes this one parallel from then on: at the merge before the push take `main`'s plan and move this checklist into the pull request.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #668 usability pass, contract edit form and rent step (personas B-15)

- [x] Read #668 and the B-15 reports (`helga-b15*.md` from history at `c893731^`; no Sven B-15 report exists, the issue text names his findings)
- [x] @wip scenarios (contract-edit, contract-new), seen red at the missing behaviour (84e7003)
- [x] fach-reviewer step 1, round 1: texts of S-4 and H15-3 in de/fr/it/en (`docs/reviews/668-fachreview-1.md`); M-1 became #1148
- [x] S-3: «Monatlich total» in a `LiveRegion` (`RentStep.svelte`, 8497f84)
- [x] H15-9: apartment written «Wohnung X · Gebäude» in the wizard's choice and review (`apartmentName` in `contract-form.ts`, `contract-wizard.ts`, edit `+page.server.ts`; 6913ed8); the tenant list's hyphen became #1149
- [x] H15-3: notice hint wording of fach review 668-1 (`messages/*.json`, dfb15f9)
- [x] S-4: heading and page title name the tenant (012dc33); Spec change approved: #668 for `contracts.feature:61`, `contract-detail.feature:138`
- [x] S-7: already fixed by #654 (`RadioGroup` labels an option by its label, describes it once); no change
- [x] H15-10: #1096 decided that a toast may briefly cover content without the focus; the «Vertragsstatus» filter is not focused after saving; no change
- [x] N-3 / n-4: product owner chose option 1; @wip scenarios and DOM tests seen red; fach-reviewer step 1 (`docs/reviews/668-n3-fachreview-1.md`): texts word for word, V-1 (every way out, breadcrumb scenario), V-2 (lands where clicked) fixed; `LeaveConfirm.svelte` with `beforeNavigate` (back button included), the form's own `goto` not asked; axe and language rows `contract-edit leave-dialog`
- [ ] code-reviewer round 1, slice 668-n3 (S-4, Helga P-1, N-3; `668-n3-review-1.md`)
- [x] code-reviewer round 1, slice 668-s3 (`docs/reviews/668-s3-review-1.md`)
- [x] code-reviewer round 1, slice 668-texts (`docs/reviews/668-texts-review-1.md`)
- [x] C-1, C-2, Sven P-2, Helga P-1 fixed, each test seen red (3b1476c)
- [x] code-reviewer round 2, slice 668-s3 (`docs/reviews/668-s3-review-2.md`): C-1, C-2 closed
- [x] Feature review round 1: personas Helga and Sven (`docs/design/personas/helga-668.md`, `sven-668.md`)
- [ ] Persona re-run after S-4 and N-3
- [ ] Before marking complete: lint, check, vitest (full, messages change), fitness, fallow, prettier, affected E2E with axe and language rows
- [ ] Archive the session
