# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #788 point 5a, next steps and the fixed-term check (the backend decides)

Product owner, 24.10.2026: point 5 in two pull requests; (a) the contract page's next steps and the fixed-term check come from `GET /contracts/:id` (`nextSteps`, `fixedTermCheck`), (b) the end refusals follow with their own plan. Behaviour unchanged (`No scenario: behaviour unchanged, contract-detail.feature pins next steps and the fixed-term question`). Refs #788.

- [x] Backend `nextSteps` (`contract-next-steps.pg.test.ts`, red first): during a running notice without and with a later contract; after the end only while the tenant has the apartment's address; none without notice
- [x] Backend `fixedTermCheck` (same file, red first): an agreed end before today without a later contract; not after notice, «ausgezogen», a later contract, before or on the last day, without an end
- [x] One query for «a later contract of the apartment»: `laterContract` in its own module `later-contract.ts` (as `old-address.ts`), used by the contract and the former-tenant documents (review p5a C-2; importing it from `contract.service` had closed a module cycle)
- [x] API contract `tests/contracts/contract.json`; BFF reads both fields (`contract-actions.test.ts`, red first: the page derives nothing from the dates); no apartment contracts fetched any more
- [x] Fitness `--update` (bffDates 7 → 5, BFF decisions 15 → 13), `fitness-functions.md`, `docs/api-specification.md`
- [x] E2E `contract-detail.feature`, `contract-edit.feature` (Chromium and API, 97) green
- [x] Slice review round 1 (`docs/reviews/p5a-review-1.md`: no Blocker/Major; C-1 Minor misplaced doc comment, moved; C-2 Minor duplicate query, shared module)
- [ ] Closing round, PR
