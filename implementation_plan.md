# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: NFR issues on my own, part 2 (#742 first)

- [x] #742: the status line of «Rechnungen hochladen» says how many invoices are ready to create; @wip scenario seen red (received «Bitte prüfen: 1.»)
- [x] #742: text «Bereit zum Erstellen» in de, fr, it, en (`InvoiceUploadDialog.svelte`, `messages/*.json`, two DOM expectations); scenario green without @wip; invoices + ki-einstellungen 59 passed; axe and language rows of the five upload screens 10 passed
- [x] #742 slice review: no Blocker/Major, Minor C-1 stays in `docs/reviews/742-review-1.md` (needs a PO decision on the exact status text)
- [x] #742 persona Sven (screen reader) on the upload dialog: P-1 to P-3 Minor, not trivial (status wording needs decisions), stay in `docs/design/personas/sven-742.md`
- [ ] #742 PR
