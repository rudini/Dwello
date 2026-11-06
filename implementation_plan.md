# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end. A session that appears on `main` after this one started makes this one parallel from then on: at the merge before the push take `main`'s plan and move this checklist into the pull request.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: overlap refusal and contract wizard repetitions (#667)

- [ ] @wip scenarios: overlap refusal names the other contract and advises per case, hint gone after it (W-03, W-04, W-07); past-start warning once (W-08); stepper names unbroken at 1440 px (W-10)
- [ ] fach-reviewer step 1: every new or changed text in de/fr/it/en
- [ ] Backend: CONTRACT_OVERLAP names the other contract's tenant and period; API contract `contract-overlap.json`
- [ ] Frontend: refusal text, hint hidden after the refusal, field error without the repeated notice, stepper
- [ ] code-reviewer slice rounds
- [ ] Feature review: persona Dr. Weber
- [ ] Checks: full vitest, fitness `--base origin/main`, backend tests and p2 queries, fallow audit, Prettier on added files, lint, check, type-check, affected E2E with axe and language rows
- [ ] Archive the session
