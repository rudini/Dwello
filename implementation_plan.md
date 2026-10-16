# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W5b: #166 and #219 (predefined categories marked and protected, no KI check while the KI is off)

No implementation issue exists for either decision issue: their "Decided (product owner)" sections are the requirement.

- [x] #166 `@wip` scenarios (`categories.feature`): badges «Von Dwello» / «Eigene», delete disabled with its reason, hint on the edit page; seen red
- [x] fach-reviewer round 1 on the scenarios and texts before implementing (`docs/reviews/w5b-fachreview-1.md`); V-2 → #302
- [x] #166 backend: `deleteCategory` refuses a predefined category (`CATEGORY_PREDEFINED`), `updateCategory` keeps its key (pg tests)
- [x] #166 list: badge, disabled delete button described by its reason; edit page: hint (its KI sentence only while the KI is on)
- [x] #219 new-category page loads whether the KI is on and hides «Von der KI prüfen lassen» when it is off (No scenario: the E2E backend always starts with the KI on; `LLM_ENABLED` is read at the backend start)
- [x] messages in all four languages; no new `tests/a11y` state (list and `category-edit-predefined` are already checked)
- [x] code-reviewer round 1 (`docs/reviews/w5b-review-1.md`)
- [x] fach-reviewer round 2 (`docs/reviews/w5b-fachreview-2.md`), personas Helga (`docs/design/personas/helga-w5b.md`) and Dr. Weber (`docs/design/personas/weber-w5b.md`)
- [x] Fix slice: hint reworded (P-1 Helga/Weber), allocability sentence follows the saved choice (V-8, V-9), translations (V-10), fallback test (C-2), shared backend URL (C-3), term table (C-6); confirmation on save → #309 (Weber P-2)
- [ ] code-reviewer round 2 on the fix slice; fach-reviewer round 3 on the new texts
- [ ] Checks before push; workflow review; archive session
- [ ] Push, pull request, CI and merge (CLAUDE.md, Workflow 9)

Files: `backend/src/services/category.service.ts`, `src/lib/server/category.ts`, `src/routes/config/categories/{+page.svelte,CategoryRow.svelte,CategoryForm.svelte,new/*,[id]/edit/*}`, `messages/*.json`, `docs/api-specification.md`, tests (`category-predefined.pg`, `categories`, `categories-page.dom`, `category-predefined.dom`, `config-pages`, `focus-error.dom`, `tests/e2e/**`).
