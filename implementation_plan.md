# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: #815 part B, contracts: the frontend derives nothing from dates

- [x] B1 Vertragsstatus: list, page, form and wizard show the backend's `status` (#784); `contractStatusOn` and the list's `today` removed; tests first (list, page, form, `lastRent`, loaders); the check also reads `data.today` (3 lines of the contract page, now exceptions for B2)
- [ ] B1 review (`code-reviewer`)
- [ ] B2 pre-checks with a backend code and test (`BILLED_UNTIL_FUTURE`, `CONTRACT_END_PAST`, `CONTRACT_END_BEFORE_START`) into `preChecks`
- [ ] B3 the remaining derivations: proposed «Gültig ab» of an Akonto, apartment availability in the wizard, drafts covered by «Abgerechnet bis», «Vertragsbeginn in der Vergangenheit»
- [ ] Checks: lint, check, vitest, backend tests, E2E contract features, fitness (`frontendDecisions` measured before and after)
- [ ] Closing round
- [ ] PR: «No scenario: behaviour unchanged», Refs #815
