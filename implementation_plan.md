# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-11-04: #1089 Verlauf labels and the Italian Heizprofil choice

- [x] Verlauf (`MetadataCard.svelte`): a long entry (an e-mail address) wraps its words, never its date; dates flush right on one line. Scenario «Im Verlauf stehen die Daten bündig untereinander» (statement-send.feature, 390 px), seen red (a date on 2 lines, edges 2 px apart)
- [x] Italian Heizprofil choice at 390 px: scenario «Die Wahl des Heizprofils passt auf Italienisch aufs Telefon» (statement-generate.feature); it pins kept behaviour, the base already shows the whole name (no red run)
- [x] lint, check, Chromium E2E of statement-send, statement-generate, statement-detail (243)
- [x] code-reviewer round 1 (`docs/reviews/1089-review-1.md`): no Blocker/Major; C-2 (an empty font shorthand in Firefox measured nothing) fixed, C-1 (the select's arrow not subtracted) stays
- [x] Persona Marco (phone, `docs/design/personas/marco-1089.md`): no Blocker/Major; P-1 (a long address breaks over several lines at 390 px) needs another arrangement on phones and stays in the report (`break-words` tried: the address is longer than the label column)
- [ ] code-reviewer closing round (C-2 fix)
- [ ] PR (`Fixes #1089`)
