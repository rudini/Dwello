# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: #815 part B, contracts: the frontend derives nothing from dates

- [x] B1 Vertragsstatus: list, page, form and wizard show the backend's `status` (#784); `contractStatusOn` and the list's `today` removed; tests first (list, page, form, `lastRent`, loaders); the check also reads `data.today` (3 lines of the contract page, now exceptions for B2)
- [x] B1 review (`docs/reviews/i815b1-review-1.md`): no Blocker/Major; C-1 (Minor) rejected: an open-ended taken contract blocks the apartment, so the text never shows it; `lastRent` pins the status
- [x] B2 pre-checks with a backend code and test (`BILLED_UNTIL_FUTURE`, `CONTRACT_END_PAST`, `CONTRACT_END_BEFORE_START`) into `preChecks`: 9 lines, exceptions 39 → 30
- [x] B3a proposed «Gültig ab» of an Akonto from the backend (`proposedAdvanceFrom`), backend unit test and API contract first; exceptions 30 → 29
- [x] B3b apartment availability in the wizard from the backend (`blocked`, `availableFrom` on apartments), backend test, API contracts and loader/DOM tests first; exceptions 29 → 27
- [ ] B3 the remaining derivations: proposed «Gültig ab» of an Akonto, apartment availability in the wizard, drafts covered by «Abgerechnet bis», «Vertragsbeginn in der Vergangenheit»
- [ ] Checks: lint, check, vitest, backend tests, E2E contract features, fitness (`frontendDecisions` measured before and after)
- [ ] Closing round
- [ ] PR: «No scenario: behaviour unchanged», Refs #815
