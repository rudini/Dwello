# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W2: move occasion-bound rules out of `CLAUDE.md` (w1-review-1 C-1)

Request: «Ja mache es» (the three blocks proposed after w1-review-1 C-1). No scenario: rules and skills only.

- [x] «Open work» points 3 to 5 into a new skill `issue-work`; references in `grill-me` and `check-issues.mjs` follow
- [x] Gotchas «One build» and «Cloud sessions» (but the scratchpad sentence) into `tests/e2e/CLAUDE.md` and `docs/design/personas/README.md`
- [x] Workflow 5: the persona details shortened to a reference to `docs/design/personas/README.md`
- [x] Checks: lint, rule-file tests
- [ ] Code review W2-1, archive, push

Files: `CLAUDE.md` (22.3 → 20.4 KB), `.claude/skills/issue-work/SKILL.md` (new), `.claude/skills/grill-me/SKILL.md`, `tools/open-work/check-issues.mjs` (comment), `tests/e2e/CLAUDE.md`, `docs/design/personas/README.md`.
