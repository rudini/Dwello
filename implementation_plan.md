# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 27 - October 2026: improvements from the B-15 instruction check

Branch `claude/b15-instruction-improvements` (from `origin/main` `2efcd56`). Source: `docs/reviews/b15-instruktionen-pruefung.md`, section 2, points 1–16 (on the branch of PR #157, which holds Session 26). Scope: instructions, agents, skills, hooks, settings, tools, persona docs; no app changes. Decided by the user: point 1 preload in `backend/bunfig.toml` (no hook), point 4 a worktree for every reviewer, point 5 only lower-layer tests while `fach-reviewer` runs, point 16 only the task text (no new permission).

Slice 1 - tools:
- [x] 1 Backend tests: `preload` in `backend/bunfig.toml`, so every `bun test` in `backend/` recreates `dwello_test`; one-file command in the root `CLAUDE.md`; probe run
- [x] 3 `persona-stack.sh` serves a copy of `build/`; probe run
- [x] 9 Scenario outline rows named by screen (`examplesTitleFormat`); command for one screen's axe and language rows in `tests/e2e/CLAUDE.md`
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
- [ ] 2 Personas get their own records; table of demo records (name, ID, state) in `docs/design/personas/README.md`
- [ ] 4 Every reviewer reads its own worktree; the main session keeps working
- [ ] 5 While `fach-reviewer` checks the scenario: only lower-layer tests, no production code
- [ ] 6 Skills `tdd` and `ponytail` are loaded, not only followed
- [ ] 7 A changed text the user sees is a behavior change
- [ ] 8 Every backend answer a frontend test reads comes from `tests/contracts`
- [ ] 10 Search for a similar issue before opening one
- [ ] 11 Archive the finished session before the final commit; `code-reviewer` checks the plan holds only the current session
- [ ] 12 Stop hook vs. push approval: already on `main` (`CLAUDE.md`, «Keep going»); check the wording only
- [ ] 13 One mapper per backend answer used by several loads
- [ ] 14 Plan: one line per reviewer round, findings stay in the report
- [ ] 15 Branch check at the start of a task; `code-reviewer` on a merge commit with conflicts in app code
- [ ] 16 The caller tells a persona that saving in `dwello_persona` is part of its task

Finish:
- [ ] Slice reviews (`code-reviewer`), findings triaged
- [ ] All checks of `CLAUDE.md` pass
- [ ] Session archived
