# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to a file of its own, `docs/archive/sessions/<n>.md` (`<n>`: the lowest issue number it closes, without one its branch name; a new file, so parallel pull requests never touch the same lines), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and write the session to its own archive file at the end. A session that appears on `main` after this one started makes this one parallel from then on: at the merge before the push take `main`'s plan and move this checklist into the pull request.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History: `docs/archive/implementation-plan-verlauf.md` (phases 0–22 and the sessions up to 2026-11-08, closed: add nothing) and `docs/archive/sessions/` (one file per later session).

## Session 2026-11-08: workflow review 07.11./08.11., proposals 1 to 5

Product owner, 08.11.2026: «Setze 1 bis 5 um» (proposals of the closing report: 1 fitness per slice, 2 persona stack in a fresh container, 3 decisions name the scenarios they change, 4 the step-1 hold only for domain slices, 5 no own closing round for test-only changes). No scenario: tooling and rules only, nothing a user sees.

- [ ] 1: `fitness.ts` ends with a summary line; hook `.claude/hooks/fitness-gate.sh` runs `fitness --base origin/main` on each commit that changes `src/`, `backend/src/` or `tools/fitness/` (tests in `tools/claude-hooks/fitness-gate.test.ts`, seen red); `settings.json`, CLAUDE.md (gates, «Before marking anything complete»), skill `commit-gates`
- [ ] 2: `docs/design/tools/persona-stack.sh`: `bun run i18n` and `svelte-kit sync` before the build, «not ready» with the end of the build log on a failed build (red shown by a fresh-tree reproduction)
- [ ] 3: skill `grill-me`: list every non-`@wip` scenario whose steps reach the changed element
- [ ] 4: CLAUDE.md Workflow 1: the hold covers only behaviours whose texts or domain rules the review reads
- [ ] 5: CLAUDE.md Workflow 7 and skill `pull-request`: a change of test titles, or a Minor fix only in tests, rides the next round's prompt
- [ ] Decisions recorded in `workflow-rules-review-2026-11-07.md` and `-11-08.md`
- [ ] Slice review (`code-reviewer`), closing round
- [ ] Archive the session, PR
