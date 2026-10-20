# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W1: apply the collected workflow review of 2026-10-20

Request: «Setze alle um» (every proposal of `docs/reviews/workflow-rules-review-2026-10-20.md`). No scenario: rules, skills, agents and tooling only; no app behaviour changes.

- [x] K1 Workflow 8: parallel sessions keep the checklist in the pull request; a merged pull request's session counts as finished
- [x] K2 `slice-review` hand-over block; Workflow 4/5: no subagents and no coordinator → draft pull request
- [x] K3 scratchpad prefix, migration number at the last merge, affected features as local E2E duty, no Paraglide/merge while a run waits, `persona-stack.sh --keep-db`, longer timeout for process-spawning `tools/` tests
- [x] K4 glossary edit allowed when «Decided (product owner)» names the rows
- [x] K5 fallow 2.104 already keeps an inherited clone group `introduced: false` (tried: lines added before and after the block); `commit-gates` says so, the gate is unchanged
- [x] K6 Workflow 7: closing round has its own three rounds
- [x] K7 Workflow 2: E2E red run skipped when the fix's lower-layer test was seen red
- [x] K8 sixth "No scenario" kind: global `configuration` state
- [x] K9 personas README: probe an outside service before a round
- [x] K10 "Done means": visible in the persona's task counts as more visible
- [x] K11 native reads list keys with placeholders or escapes apart
- [x] K12 Coding guidelines: a later decision wins over a prescribed text
- [x] K13 «Formatting»: one file per command
- [x] T1 merge review only for a conflict in app code
- [x] T2 already on `main` (b5a260b6: no merges only because a branch is behind, auto-merge)
- [x] T3 test-only CI fix rides the next round
- [x] T4 report form for reviewers; native reads return only changed keys
- [x] T5 persona re-run only on the screens of its Blocker/Major
- [x] T6 native reads before the step-1 fach-review closes
- [x] T7 move plan and pull-request details out of `CLAUDE.md` into their skills
- [x] Checks: lint, check, type-check, rule-file tests
- [x] Review against the Opus 5.5 guide, points 2 and 3: `fach-reviewer` reports no Nits and a Minor starts no round (`code-reviewer` too); a settled decision is not reopened (`CLAUDE.md`, «When to ask»)
- [ ] Code review W1-1
- [ ] Archive, PR

Files: `CLAUDE.md`, `implementation_plan.md`, `backend/CLAUDE.md`, `tests/e2e/CLAUDE.md`, `docs/design/personas/README.md`, `docs/design/tools/persona-stack.sh`, `vitest.config.ts`, `.claude/skills/{slice-review,pull-request,commit-gates}/SKILL.md`, `.claude/agents/{code-reviewer,fach-reviewer}.md`.
