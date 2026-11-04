# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-11-04: #1093 refused Beleg or Dokument opens the error page

- [x] Scenarios (`invoice-detail.feature`, `tenant-documents.feature`), seen red at the missing error page
- [x] `proxyFile` redirects a refusal through `pdfRefusal`; the Beleg of a deleted invoice says `INVOICE_NOT_FOUND`; the error page names a gone invoice or Dokument and leads to the invoice list
- [x] Dokument links without `download` (it saved the error page as a file); `reload` as the statement list's PDF link
- [x] Screen rows `invoice-document-refused`, `document-pdf-refused`; D7c, API spec
- [ ] Code review
- [ ] Persona (UI changed)
- [ ] CI all browsers (WebKit: an image Dokument without `download`, #424)
- [ ] PR
