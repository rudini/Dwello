# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end. A session that appears on `main` after this one started makes this one parallel from then on: at the merge before the push take `main`'s plan and move this checklist into the pull request.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #1126 Kostenabstimmung (preview and «Berichte»)

- [x] `@wip` scenarios: preview (`statement-cost-reconciliation.feature`) and «Berichte» (`reports.feature`), steps seen red; `@wip` removed, all green
- [x] `fach-reviewer` round 1 on the scenarios: `docs/reviews/1126-fachreview-1.md` (M-1, V-1 decided by the PO 05.11.2026: note on statements not up to date; V-7: no notes in the preview)
- [x] `fach-reviewer` round 2 on the M-1/V-1 fix: `docs/reviews/1126-fachreview-2.md` (V-9 to V-12 fixed; V-10 partial correction and «Nicht berichtigen» not pinned)
- [x] Backend: building costs per position, tenant shares of valid statements and of the run, fee, non-allocable invoices (`cost-reconciliation.pg.test.ts`, each behaviour seen red)
- [x] Backend: «Berichte» periods list, notes (contracts without statement, drafts, statements not up to date); 404 for an unknown building
- [x] API contracts for the new responses; `docs/api-specification.md`
- [x] Preview: Kostenabstimmung per building replaces «Kosten aller Abrechnungen» and the vacancy note (Spec change approved: #1126)
- [x] «Berichte»: list building × period and the Kostenabstimmung page; replaces the coming-soon scenario (Spec change approved: #1126)
- [x] Texts in de/fr/it/en; `UBIQUITOUS_LANGUAGE.md` row for the title (product owner confirms in the PR)
- [x] Screens in `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`
- [x] Code review 1126-1 (backend): `docs/reviews/1126-review-1.md` (C-1, C-3, C-4 fixed; C-2, C-5 Minor, stay in the report)
- [ ] Code review 1126-2 (frontend)
- [ ] Feature review: personas, `fach-reviewer`, `daten-pruefer`
- [ ] Before marking complete: lint, check, fitness, backend type-check, affected tests and E2E, Prettier on added files
- [ ] Archive the session; PR `Fixes #1126`
