# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.




## Session: #788 part 5b, the backend names `replaced` at fewer places (Ä2)

- [x] `counting-statements.ts`: `isReplaced` and `replacedInSql` next to `counting` and `countingInSql`
- [x] Dashboard (paid this month), reminder (posting a replaced one), statement run (replaced in this period), «Abgerechnet bis» (replaced without counting successor) use them; the anonymisation counts every statement but drafts (`status <> 'draft'`, the same five statuses the database allows); kept behaviour, pinned by `dashboard.pg`, `reminders.pg`, `statement-run`, `billed-until.pg`, `tenant-anonymise.pg`
- [x] Measured with `tools/arch-baseline/run.sh`: `replaced` 4 files in 2 layers (Backend 3, Shared 1), Ä2 within its target; `docs/architecture/fitness-functions.md`
- [x] Checks: backend `bun run test` (1610, coverage 96.5 %), type-check, lint, fitness
- [ ] Slice review (`code-reviewer`) and closing round
- [ ] PR: «No scenario: behaviour unchanged», Fixes #788
