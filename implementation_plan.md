# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session C1: E2E in every browser on pull requests

Branch `ccr-01e823d6-yhj5kc`. Product owner 2026-10-19: instead of a merge queue (only for repositories of an organisation), pull requests run the E2E tests in every browser, so a race only Firefox or WebKit loses shows before the merge (runs 595 to 614 on `main`). No scenario: CI only.

- [x] `ci.yml`: E2E on pull requests with Chromium, Firefox, WebKit and `api` (60 min, as `main`); the axe check stays Chromium; `docs/test-pyramid.md`, `tests/e2e/CLAUDE.md`
- [x] Slice review (`docs/reviews/ci-browsers-review-1.md`): C-1 `docs/tech-stack.md` fixed; C-2 (the axe shards get 60 min on pull requests too) kept, harmless
- [ ] PR: the first pull request with every browser shows the time it takes; its first run found a Firefox failure in «Suche ohne Treffer», cause not found (O-41)
