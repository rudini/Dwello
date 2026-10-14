# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 27 - October 2026: improvements from the B-15 instruction check

Branch `claude/b15-instruction-improvements` (from `origin/main` `2efcd56`). Source: `docs/reviews/b15-instruktionen-pruefung.md`, section 2, points 1–16 (on the branch of PR #157, which holds Session 26). Scope: instructions, agents, skills, hooks, settings, tools, persona docs; no app changes. Decided by the user: point 1 preload in `backend/bunfig.toml` (no hook), point 4 a worktree for every reviewer, point 5 only lower-layer tests while `fach-reviewer` runs, point 16 only the task text (no new permission).

Slice 1 - tools:
- [x] 1 Backend tests: `preload` in `backend/bunfig.toml`, so every `bun test` in `backend/` recreates `dwello_test`; one-file command in the root `CLAUDE.md`; probe run
- [x] 3 `persona-stack.sh` serves a copy of `build/`; probe run
- [x] 9 Scenario outline rows named by screen (`# title-format:` comment); command for one screen's axe and language rows in `tests/e2e/CLAUDE.md`
- [x] 10 `check-issues.mjs` reports open issues with «Proposed (confirm before starting)» but without `entscheiden`; test
- [x] 15 `session-start.sh` reports a branch behind `origin/main`; probe run

Slice 1 notes:
- 1 probe: a test printing `DATABASE_URL` under a bare `bun test` showed `undefined` (the dev database's default) before, `dwello_test` after; the `--preload` flags in `backend/package.json` are gone; `bun run test` 539 pass. Files: `backend/bunfig.toml`, `backend/package.json`, `backend/CLAUDE.md`, `CLAUDE.md`, `docs/test-pyramid.md`
- 3 probe: stack started, `bun run build` again (new hashes in `build/`), the app on :3300 still served its old asset (200). Files: `docs/design/tools/persona-stack.sh`, `CLAUDE.md` (One build), `docs/design/arbeitsregeln.md`
- 9 a `# title-format: <Bildschirm> <Zustand>` comment on the two outlines (playwright-bdd) instead of the global `examplesTitleFormat`, which would rename every outline; `playwright test --list` 629 tests, no duplicate titles; the new command lists the 10 rows of `contract-edit`. Files: `tests/e2e/features/accessibility.feature`, `sprachen-bildschirme.feature`, `tests/e2e/CLAUDE.md`
- 10 Test red: `check-issues.test.ts` – «Cannot read issues of rudini/Dwello» (no `GITHUB_API_URL`, no check); all 95 open issues comply today. Files: `tools/open-work/check-issues.mjs`, `check-issues.test.ts`, `CLAUDE.md` (Open work)
- 15 probe: a worktree one commit behind `origin/main` printed the notice, the current branch nothing. File: `.claude/hooks/session-start.sh`
- Skills: tdd, ponytail-review

Slice 2 - instructions:
- [x] 2 Personas get their own records; table of demo records (name, ID, state) in `docs/design/personas/README.md`
- [x] 4 Every reviewer reads its own worktree; the main session keeps working
- [x] 5 While `fach-reviewer` checks the scenario: only lower-layer tests, no production code
- [x] 6 Skills `tdd` and `ponytail` are loaded, not only followed
- [x] 7 A changed text the user sees is a behavior change
- [x] 8 Every backend answer a frontend test reads comes from `tests/contracts`
- [x] 10 Search for a similar issue before opening one
- [x] 11 Archive the finished session before the final commit; `code-reviewer` checks the plan holds only the current session
- [x] 12 Stop hook vs. push approval: already on `main` (`CLAUDE.md`, «Keep going»); check the wording only
- [x] 13 One mapper per backend answer used by several loads
- [x] 14 Plan: one line per reviewer round, findings stay in the report
- [x] 15 Branch check at the start of a task; `code-reviewer` on a merge commit with conflicts in app code
- [x] 16 The caller tells a persona that saving in `dwello_persona` is part of its task

Slice 1 review:
- code-reviewer round 1 (`docs/reviews/b15-instructions-slice1-review-1.md`): fixed C-1 (Major), C-2, C-3, C-4, C-5, C-7, C-8; C-6 fixed by slice 2 (the rule in `CLAUDE.md`, Branches)
- C-1 Scenario/probe red: a single-branch clone, the hook's block under `set -euo pipefail`: «ambiguous argument 'HEAD..origin/main'», exit 128; after the fix (FETCH_HEAD, `timeout 20`, `|| echo 0`) the notice and the next line run, also without a remote
- Test red: `check-issues.test.ts` – «scheitert, wenn die offenen Issues nicht lesbar sind»: expected 0 to be 1; «lässt … durch» (#11, the phrase in prose): expected code 1 to be 0
- C-5 red of the label check itself: the check taken out, «meldet ein offenes Issue …» expected 0 to be 1; the 14 open issues with a proposal all match the heading pattern

Slice 2 notes:
- 2 table in `docs/design/personas/demo-records.md` (moved out of the persona README after review C-7; from `backend/demo/demo-data.sql` and `backend/src/db/demo-data.ts`; the demo data has no fixed-term and no future contract, said so); `CLAUDE.md` step 5 names it
- 4 `CLAUDE.md` step 4: a worktree for every reviewer subagent; the three reviewer agents read only there; step 5: keep working during persona runs (they use the copy from point 3), no E2E
- 8 the optional lint rule became H-22 in `docs/design/offene-punkte.md` (H-21 is taken on PR #157)
- 12 no change: `CLAUDE.md` («Keep going») already says the stop hook does not override Workflow 4 or the push rule
- 16 `CLAUDE.md` step 5 and `.claude/agents/persona.md`: saving in the persona app is part of the task
- Files: `CLAUDE.md`, `.claude/agents/{code-reviewer,fach-reviewer,daten-pruefer,persona}.md`, `docs/design/personas/README.md`, `docs/design/offene-punkte.md`
- No code changed: no `Test red`, no `ponytail-review`

Slice 2 review:
- code-reviewer round 1 (`docs/reviews/b15-instructions-slice2-review-1.md`): fixed C-1 (Major: `fach-reviewer` gets a worktree of the committed `@wip` scenario), C-2 (Major: `docs/test-pyramid.md` no longer says «where one exists»), C-3 (at most the first red test), C-4, C-5 (report path in the scratchpad, copied by the caller), C-6, C-7 (table in its own file personas do not read), C-8 (ask before the force-push), C-9 (`Skills: tdd, ponytail, ponytail-review`), C-10 (`review-<slice>-<reviewer>`)

Slice 3 - added by the user during the task:
- [x] 17 After a finished task: push, open a pull request, turn on auto-merge, resolve conflicts by merging `origin/main`, fix red CI; it merges once green. Still asked: a push to `main`, force-push, merging red or with an open Blocker/Major, and a task where the user said to only commit (as this one). Merge method: merge commit (no squash, so the slice commits stay; #149 was merged so). File: `CLAUDE.md` («Keep going»)

Finish:
- [ ] Slice reviews (`code-reviewer`), findings triaged
- [ ] All checks of `CLAUDE.md` pass
- [ ] Session archived
