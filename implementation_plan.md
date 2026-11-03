# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-11-03: #1081 success toast never covers the focused content

- [x] Scenario outline «Die Erfolgsmeldung verdeckt nicht, was den Fokus hat» (zugangsschluessel.feature) at 390 × 844, 1024 × 768 and 960 × 600 (150 % of 1440 × 900), with the copy at the bottom edge of the window; seen red (the toast stood 96 px over the focused button)
- [x] `ToastRegion`: while a confirmation shows, `scroll-padding-bottom` and a spacer keep its height plus 16 px clear below the focused part, which scrolls above it; on phones it already sat at the bottom
- [x] lint, check, `vitest --changed`
- [x] Chromium E2E of categories, zugangsschluessel, tenant-documents, statement-detail (181); the full suite (1739 tests, hours locally) runs in the PR's CI
- [x] code-reviewer round 1 (`docs/reviews/1081-review-1.md`): C-1 a dialog opened while a confirmation shows sat under it on phones: scenario in categories.feature seen red (−80 px), fixed with `--toast-room` as the dialog's bottom padding; C-2 Minor stays in the report
- [x] Personas Helga (150 %, 200 %) and Marco (phone, 1024 px): `docs/design/personas/helga-1081.md`, `marco-1081.md`, no Blocker/Major
- [ ] code-reviewer round 2 (C-1)
- [ ] PR (`Fixes #1081`)
