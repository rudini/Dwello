# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W5b: #166 and #219 (predefined categories marked and protected, no KI check while the KI is off)

No implementation issue exists for either decision issue: their "Decided (product owner)" sections are the requirement.

- [ ] #166 `@wip` scenarios (`categories.feature`): badges «Von Dwello» / «Eigene», delete disabled with its reason, hint on the edit page; seen red
- [ ] fach-reviewer on the scenarios and texts before implementing
- [ ] #166 backend: `deleteCategory` refuses a predefined category (`CATEGORY_PREDEFINED`), `updateCategory` keeps its key (pg tests)
- [ ] #166 list: badge, disabled delete button described by its reason; edit page: hint
- [ ] #219 new-category page loads whether the KI is on and hides «Von der KI prüfen lassen» when it is off (No scenario: the E2E backend always starts with the KI on; `LLM_ENABLED` is read at the backend start)
- [ ] messages in all four languages; `tests/a11y` states if needed
- [ ] code-reviewer slice review
- [ ] feature review: persona Helga, fach-reviewer if texts changed
- [ ] Checks before push; workflow review; archive session
- [ ] Push, pull request, CI and merge (CLAUDE.md, Workflow 9)

Files:
