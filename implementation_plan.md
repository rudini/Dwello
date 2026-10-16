# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16 (faster local E2E runs)

Task (product owner, in chat): speed up E2E runs during ATDD, not on CI. Measured on `buildings.feature` (7 scenarios): 46 s per run, of which ~40 s the frontend build; recreating `dwello_e2e` 0.26 s, so a file-based database would not help. Proposals 1 and 3 accepted: build the frontend only when its inputs changed since the last E2E build (always on CI), and start the empty instance (3102/3103) and the demo frontend (3104) only when the generated tests need them. No issue (operator-only change); PR with «No scenario: test tooling only, no app behaviour change».

- [x] Build only when an input changed (`tools/e2e/build-if-changed.mjs`, unit tests), always on CI
  Test red: «baut beim ersten Lauf» – Cannot find module; «baut nicht neu, wenn sich nichts geändert hat» – expected 2 to be 1; «baut neu, wenn eine Datei geändert wurde» – expected 1 to be 2; «baut neu, wenn sich ein Text oder die Konfiguration geändert hat» – expected 1 to be 2; «baut nicht neu, wenn nur ein Unit-Test dazukam» – expected 2 to be 1 (shown by taking the filter out); «baut auf CI immer» – expected 1 to be 2
  No red: «baut neu, wenn eine Datei gelöscht wurde» passed at once (the folder's mtime changes); kept as a pin
- [x] Extra servers only for the generated features that use them (`playwright.config.ts`)
  No unit test (no test loads the Playwright config); shown by runs: after `bddgen --tags @buildings` 4 web servers and 8 s per run (46 s before), after a full `bddgen` `demo.feature` started all 7
- [x] Docs: `tests/e2e/CLAUDE.md` (Run)
  Skills: tdd, ponytail, ponytail-review (lean already), slice-review
- [ ] Checks: test:coverage, lint, check, backend test + type-check, deepcheck:audit, E2E (wip-style subset and full chromium+api)
- [ ] code-reviewer rounds
  code-reviewer round 1 (`docs/reviews/e2e-speed-review-1.md`): fixed C-1 (`src/lib/paraglide` written by the build no longer counts; likely the one 48 s run), C-2 (`playwright.config.ts` with APP_VERSION is an input; the stamp lists the inputs that existed, so a deleted configuration file counts), C-3 (test for a file saved during the build), C-4 (comments in `tasks/demo.ts`, `tasks/accessibility.ts`), C-5 (plan lines added after the reviewed commit); rejected C-6: Node 20.0 runs nowhere (CI `NODE_VERSION: 22`, local 22, Docker `node:20` takes the latest 20.x and runs no E2E)
  Test red: «baut neu, wenn während des Builds eine Datei gespeichert wurde» – expected 1 to be 2 (written after the code, shown by taking `utimesSync` out); «baut nicht neu, wenn der Build nur die Übersetzungen aus messages/ erzeugt hat» – expected 2 to be 1; «baut neu, wenn sich die Version für den Build geändert hat» and «baut neu, wenn eine Konfigurationsdatei gelöscht wurde» – expected 1 to be 2
- [x] Workflow review `docs/reviews/workflow-rules-review-e2e-speed.md`
- [ ] Archive session, push, PR, CI, merge
