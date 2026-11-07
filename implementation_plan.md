# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end. A session that appears on `main` after this one started makes this one parallel from then on: at the merge before the push take `main`'s plan and move this checklist into the pull request.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: #1099 Remove the code paths for Abrechnungsperioden under a year

No scenario: the paths are unreachable since #1088 (the backend refuses every period that is no whole period of the building), so no user can see the change.

- [ ] Checked on `main`: the division by the period's months (`prorating.service.ts`, `periodSums` in `pdf.service.ts`) is not only for a period under a year; a custom Heizprofil may sum to 100 % ± 0.1, so a whole year divides too (#232 M-2, `prorating.pg.test.ts`): it stays, only its comments change
- [ ] Remove `invoicesWithoutServicePeriod` (`invoice-completeness.service.ts`, contract, `docs/api-specification.md`), its hint in `PreviewChecks.svelte`, `statement-wizard.ts` and `statements_whole_*` in all four languages
- [ ] Remove the computation of `reason: 'noHeatingMonths'` (`prorating.service.ts`); keep its stored value and text for statements created before #1088 (existing statements stay as they are)
- [ ] fach-reviewer round 1 on the scope before implementing
- [ ] code-reviewer round 1
- [ ] daten-pruefer after the change
- [ ] PR
