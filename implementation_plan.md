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
- [ ] (1) code-reviewer round 1
- [ ] (1) PR
- [ ] (2) medium runs: code-reviewer #233, 790a; fach-reviewer #459 B; persona Marco #233
- [ ] (2) decide effort per agent, PR
- [ ] (3) #852
