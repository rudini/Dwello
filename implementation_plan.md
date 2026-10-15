# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-15 (4): bug #128, FORMULA_NOT_COMPUTABLE shows the engine's English detail

Task: open `bug` issues one by one (#122, #123, #125, #126, #127 merged in rudini/Dwello#181, #182, #189, #196, #197); now #128. Skipped while labelled `entscheiden`: #93, #124, #130, #131, #136, #138, #141, #193, #194.

- [x] Scenario «Formel, die sich nicht berechnen lässt» (`distribution-keys.feature`, formula «{area} 2», which passes validation and fails when evaluated). Scenario red: the alert showed «… Die Formel kann nicht berechnet werden: Unexpected number '2'. Expected ')' to end a compound expression.» four times
- [x] `backend_formula_not_computable` without `{detail}`, saying what to check, in de/fr/it/en; the detail stays in the backend's `error` text only
- [x] Backend unit test (`formula-codes.test.ts`) with «{area} 2»; frontend unit test that `backendMessage` gives the text without the detail. Test red: «nennt eine Formel, die sich nicht berechnen lässt, ohne den englischen Text …» – params held `detail`; «sagt, was zu prüfen ist, ohne den englischen Text …» – received the old text with the detail
- [x] Skills: tdd, ponytail, ponytail-review
- [x] Checks: test:coverage (2419), lint, check, backend test + type-check, deepcheck:audit, E2E chromium + api distribution-keys (9 passed)
- [ ] code-reviewer
- [ ] Personas
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-128.md`
- [ ] PR, CI, merge

Files: `backend/src/services/formula.service.ts`, `backend/src/__tests__/formula-codes.test.ts`, `src/__tests__/backend-error.test.ts`, `messages/*.json`, `tests/e2e/features/distribution-keys.feature`
