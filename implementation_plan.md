# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.



## Session #647: heating hints for a berichtigte Abrechnung

#647 (decided 23.10.2026, option 1): the contracts that count for the heating hints of a run (#339, #335) are the ones the run bills (`planRun`), a contract whose statement of the period is replaced included. Scenario «Hinweis auf Rechnungen der Heizkosten ohne Leistungszeitraum beim Lauf einer berichtigten Abrechnung» (`statement-generate.feature`).

- [x] `@wip` scenario, seen failing at the missing hint; `fach-reviewer` on it before implementing: `docs/reviews/647-fachreview-1.md` (F-1, F-2 fixed)
- [x] Unit tests in `statement-run.test.ts`: the replaced case flipped (#339), and #335 with a replaced statement; red first
- [x] `runHeatingHints` counts by `planRun`
- [x] Slice review `code-reviewer`: `docs/reviews/647-review-1.md` (no findings)
- [ ] Feature review: persona Dr. Weber (`docs/design/personas/weber-647.md`)
- [ ] Before complete, closing round, archive, PR `Fixes #647`
