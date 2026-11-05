# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end. A session that appears on `main` after this one started makes this one parallel from then on: at the merge before the push take `main`'s plan and move this checklist into the pull request.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #1126 Kostenabstimmung (preview and «Berichte»)

- [ ] `@wip` scenarios: preview (statement-generate.feature) and «Berichte» (reports.feature), steps seen red
- [ ] `fach-reviewer` round 1 on the scenarios: title, help text, notes and row texts in all four languages
- [ ] Backend: building costs per position, tenant shares of valid statements and of the run, fee, non-allocable invoices (`*.pg.test.ts` red first)
- [ ] Backend: «Berichte» periods list, notes (contracts without statement, drafts, invoices no valid statement contains)
- [ ] API contracts for the new responses
- [ ] Preview: Kostenabstimmung per building replaces «Kosten aller Abrechnungen» and the vacancy note (Spec change approved: #1126)
- [ ] «Berichte»: list building × period and the Kostenabstimmung page; replaces the coming-soon scenario (Spec change approved: #1126)
- [ ] Texts in de/fr/it/en; `UBIQUITOUS_LANGUAGE.md` row for the title (product owner confirms in the PR)
- [ ] Screens in `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`
- [ ] Slice reviews (`code-reviewer`), feature review (personas, `fach-reviewer`, `daten-pruefer`)
- [ ] Before marking complete: lint, check, fitness, backend type-check, affected tests and E2E, Prettier on added files
- [ ] Archive the session; PR `Fixes #1126`
