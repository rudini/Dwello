# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #736 undelivered reminder e-mail: address and links

- [x] @wip scenarios in `statement-reminder.feature` (address in «Dokumente», no «Dokumente» there; ways to the tenant, from the feedback and from the tenant page to «Dokumente»), seen red
- [x] Backend: a reminder by e-mail keeps its `recipient`; a letter posted after it has none (pg tests red first)
- [x] `DeliveryFailure.svelte` in «Dokumente», tenant page and reminder feedback; texts without «unter «Dokumente»» in de/fr/it/en (DOM tests red first)
- [x] a11y/language: «Dokumente» default shows the row; new screens `tenant-detail-undelivered`, `statement-detail-undelivered` (default: its reminder list; `reminder-undelivered`: the feedback, each look reminds another of 9 overdue statements seeded for that state); list screens 114 passed
- [x] Scenarios green without @wip: statement-reminder, documents, tenant-detail 36 passed; axe/language rows of the touched screens 62 passed
- [ ] Code review: `docs/reviews/736-review-1.md` (C-1 statement page row: added; C-3, C-4 Minor: tests added); `docs/reviews/736-review-2.md` (C-2 feedback row: added, one overdue statement per look; C-5 scenario for P-1: added), round 3
- [x] Persona: `docs/design/personas/helga-736.md` (P-1 Major, «Mahnung senden» offered while the last one waits: fixed, button hidden; P-2 to P-6 Minor stay in the report)
- [x] Workflow note: `docs/reviews/workflow-notes-issue-736.md`
- [ ] Archive, PR
