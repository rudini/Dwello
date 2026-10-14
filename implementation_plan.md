# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-14: app version and release tags (#173)

Decisions: issue #173 (grill-me with the product owner). The E2E build gets `APP_VERSION=v1.4.0` (playwright.config.ts), so the scenario can name the version.

- [x] Scenario «Die Fusszeile zeigt die Version der App» (`navigation.feature`, @wip). Scenario red: `zeigt die Fusszeile "Version 1.4.0"` – Received: null; green, @wip removed
- [x] Version string from `git describe` (`src/lib/version.ts`). Test red: version.test.ts «zeigt nach einem Tag die Commits seither …» – Received "0.4.0-3-gabc1234"; «kennt ohne Tag keine Version» – Received ""
- [x] Footer shows «Version …» in de/fr/it/en (`Footer.svelte`, `vite.config.ts` define, `vitest.config.ts`, `src/app.d.ts`, `eslint.config.js`). Test red: shell.dom.test.ts «zeigt die Version der App» – Cannot read properties of null
- [x] Next version from commit messages (`tools/release/next-version.mjs`). Test red: «erhöht bei einer neuen Funktion …» – Received "0.4.3"; «zählt einen Breaking Change vor 1.0 …» – Received "0.4.3"; «erhöht ab 1.0 …» – Received "1.3.0"
- [x] Release workflow `.github/workflows/release.yml`: tag + GitHub Release on push to main, manual version by `workflow_dispatch`
- [x] Docker build arg `APP_VERSION` (`Dockerfile`, `docker-compose.prod.yml`); demo `update.sh` waits for the tag and passes it
- [x] README and `deploy/demo/README.md`
- [ ] Baseline tag `v0.1.0` on ba76d45
Skills: tdd, ponytail, ponytail-review
- [ ] code-reviewer, persona (footer text), checks of "Before marking anything complete"
- code-reviewer round 1 (`docs/reviews/app-version-review-1.md`): open –, fixed C-1 (Major; reproduced in a scratch repo: two tags on one commit, describe names v0.5.0; the manual run now replaces the merge's tag, simulated with a stubbed gh), C-3, C-4, C-5, C-6, C-7; open work C-2 (`offene-punkte.md` O-15)
- persona Marco (`docs/design/personas/marco-app-version.md`): fixed –, rejected P-1: «Version unbekannt» decided in #173; open work P-2 (`offene-punkte.md` U-28)
- persona Sven (`docs/design/personas/sven-app-version.md`): fixed P-1 (Test red: shell.dom.test.ts «lässt den Trennpunkt vor der Version nicht vorlesen» – Received undefined)
