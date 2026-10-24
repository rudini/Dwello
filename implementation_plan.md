# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #788 part 3b, «a replaced statement does not count» in one place

Product owner, 24.10.2026 (part 3: frontend decisions, then the backend). Refactoring, behaviour unchanged: the rule is written once (`backend/src/services/counting-statements.ts`) and used by every service that skipped replaced statements on its own. `No scenario: refactoring, behaviour unchanged; the backend suite (1592 before) pins it`. Refs #788.

- [x] Module `counting-statements.ts`: `counting(statements)` and `countingInSql`
- [x] `statement-run`, `accounting-period`, `statement-invoices`, `advance-payment`, `contract.service` (billed days) use it; full backend suite 1592 before and after
- [x] Measured `replaced`: backend 10 → 8, total 15 → 13 (predicted 7 and 12: `statement-run` keeps a different rule, a replaced statement of the period is billed again by the run). The literal stays where the status is set (`statement.service`), labelled (`document.service`, `dashboard`), listed as sent (`tenant-anonymise`), or a refusal names it (`reminder`, `contract.service` successor)
- [ ] Review, PR
