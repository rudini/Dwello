# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: fallback code review with MiniMax (#1007)

- [x] Workflow: review when Copilot reports an error, by hand, and when Copilot stays silent after CI (green or red) or after ready for review; once per pull request; drafts skipped
- [x] Workflow: lock files out of the diff, cut off over 400 kB with a note, review in English, one review comment
- [x] Workflow: MiniMax failure turns the run red and comments "No review: <reason>"
- [x] Skill `pull-request`: wait for a review after CI, answer it like Copilot's, merge after 15 minutes without one
- [x] Local runs against real pull requests (error, silent, real Copilot review, draft, failure)
- [x] Files: `.github/workflows/fallback-review.yml`, `.claude/skills/pull-request/SKILL.md`; local runs found a made-up tool call and a "missing file" behind the cut, both answered in the prompt (tool call: second try, then «No review»)
- [ ] Slice review (`code-reviewer`)
- [ ] PR
