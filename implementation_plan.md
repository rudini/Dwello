# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #778, flaky acceptance checks (T1)

No scenario: test-only; the failing axe row «statement-generate draft-restored» covers it unchanged. The Firefox building search of #778 is #754, fixed by #832.

- [x] Cause of the axe `target-size` finding (`label:nth-child(10) > .size-6…` in step «Gebäude»): after the reload, `restoreDraft` waited for «nothing loading», which also holds before the step starts loading; the invoice counts of each building arrived during axe's look and grew the rows
- [x] `restoreDraft` waits for what the restored step shows once loaded: in the statement wizard the ticked building's invoice line (`buildingInvoiceCount`, as #424)
- [x] Checks: lint, check; the axe and language rows `draft-restored` 2–3× each in Chromium
- [ ] Review
- [ ] PR: Fixes #778
