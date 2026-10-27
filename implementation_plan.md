# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-26 d: commit hook gap, effort medium, #852

Request: (1) fix the commit subject gate that let a 51-character subject through (`git commit -F -` with a heredoc and `git push` in one command); (2) measure `effort: medium` against high on the four benchmark cases; (3) implement #852. One pull request each. No scenario: (1) and (2) change tooling and agent settings only.

- [x] (1) test red: `-F -` heredoc commit plus push in one command is let through; hook reads the heredoc message
- [x] (1) code-reviewer round 1 (`docs/reviews/hook-review-1.md`): no Blocker/Major; C-1 (heredoc of a later command), C-2 (comment) fixed; C-3 (pass case pins kept behaviour) noted in the commit
- [x] (1) closing round (`docs/reviews/hook-review-2.md`): no Blocker/Major; C-4 (redirect before the heredoc) fixed, test red first
- [x] (1) closing round 3 (`docs/reviews/hook-review-3.md`): no findings
- [x] (1) PR: pushed
- [ ] (2) medium runs: code-reviewer #233, 790a; fach-reviewer #459 B; persona Marco #233
- [ ] (2) decide effort per agent, PR
- [x] (3) #852: scenario «Ein inzwischen gelöschtes Dokument löschen» red (page showed «Document not found»), then green; `backendMessage` never shows the backend's own text, three unit tests changed to the decision and seen red; 12 frontend tests read six new contracts (`tests/contracts/*`, checked in `api-contracts.pg.test.ts`, pin kept behaviour); fuel stock with an unknown code shows the page's sentence (test red first); `slice-review` names the three checks
- [x] (3) code-reviewer round 1 (`docs/reviews/852-review-1.md`) and persona Helga (`docs/design/personas/helga-852.md`): C-1 = Helga P-1 (Major, a deleted document read «nicht gelöscht, erneut»): code `DOCUMENT_NOT_FOUND` with a message in four languages, scenario line red first, contract test red with the route reverted; C-2 (formula test fallback), C-3 (test in French), C-4 (comment) fixed
- [x] (3) code-reviewer round 2 (`docs/reviews/852-review-2.md`): C-1..C-4 closed; C-5 (PUT sent 404 untested) fixed with a contract test (red with the route reverted) and a BFF test
- [x] (3) Helga round 2 (same report): P-1 fixed; P-2 (Minor: the dialog offers no reload) stays in the report
- [x] (3) closing round (`docs/reviews/852-review-3.md`): C-5 closed, nothing new
- [x] (3) PR: pushed
- [ ] (3) PR

## Session: #715 log the new-contract load error once

- [x] The new-contract load logs the statuses only when a response came back; a network error is logged once (test red first: logged twice)
- [ ] Slice review, PR `Fixes #715`
