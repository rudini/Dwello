# Workflow rules review: issue #173 (app version and release tags)

Rules that guided the task, with what happened and a proposed change. Review only: nothing here is applied.

## R-1 No test layer for CI workflows and deploy scripts

- **Rule:** `CLAUDE.md` Workflow 2 and 6 ("a fix that changes behavior gets a failing test first"); `docs/test-pyramid.md` names unit, DOM, `*.pg.test.ts` and E2E layers only.
- **What happened:** the release logic lives in `.github/workflows/release.yml` (shell) and `deploy/demo/update.sh`. The code-review finding C-1 (a manual 1.0.0 lost to a second tag on the same commit) changed workflow behaviour, but no layer could show it red and green; it was reproduced and the fix simulated in a scratch repo with a stubbed `gh` and a bare remote, noted only in the plan. The version rule itself was moved into `tools/release/next-version.mjs` so Vitest could reach it.
- **Proposal:** `docs/test-pyramid.md` names the layer for workflow and deploy logic: move any branching into a `tools/<area>/*.mjs` script with a `*.test.ts` next to it (as `tools/open-work`), and for the remaining glue (git, `gh`, docker) accept a recorded scratch simulation as the "red" of step 6.

## R-2 Build-time constants cannot be varied in DOM tests

- **Rule:** `CLAUDE.md` Workflow 2 (lowest layer that shows each rule); `docs/test-pyramid.md`.
- **What happened:** the footer reads `__APP_VERSION__`, which Vite replaces at build time; `vitest.config.ts` fixes it to 1.4.0, so the state «Version unbekannt» has no test at any layer (code review C-2, now `offene-punkte.md` O-15).
- **Proposal:** a line in `docs/test-pyramid.md`: read build-time constants through one small module that DOM tests can replace (`vi.mock`), never in the component.

## R-3 The persona app shows only one build state

- **Rule:** `CLAUDE.md` Workflow 5; `docs/design/tools/persona-stack.sh`.
- **What happened:** the persona stack builds without `APP_VERSION` and without tags, so both personas saw only «Version unbekannt»; the released form «Version 0.4.0» was checked only by injecting text in the browser (Marco) or not at all (Sven).
- **Proposal:** `persona-stack.sh` passes `APP_VERSION` from its environment to the build, and Workflow 5 says to name the build-time state in the persona task when a change depends on it.

## R-4 The commit-subject gate also blocks scratch repositories

- **Rule:** `.claude/hooks/commit-msg-gate.mjs` (`CLAUDE.md` Gotchas, "Commit subject gate").
- **What happened:** reproducing C-1 needed a throwaway repo in the scratchpad; `git commit -m a` there was blocked by the gate, although the commit never reaches Dwello.
- **Proposal:** the gate checks only commits whose working directory is inside the project (or skips paths under the scratchpad).

## R-5 A requested skill that does not exist

- **Rule:** harness rule "When the user types `/<skill-name>`, invoke it via Skill"; `.claude/skills` has no `grill-me`.
- **What happened:** the user asked for `/grill-me`; the skill is not installed, so the interview was run by hand (three rounds of questions with a recommended answer each) and its decisions written into issue #173.
- **Proposal:** add a `grill-me` skill to `.claude/skills` (interview the product owner until each decision of an issue is settled, then write them into "Decided (product owner)"), or tell users which skill to use instead.
