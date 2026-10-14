# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session 2026-10-14: open bugs, starting with #122 (favicon)

Task: work off the open `bug` issues one by one (issue, PR, merge, next). Skipped while labelled `entscheiden`: #93, #124, #130, #131, #136, #138, #141.

### #122 Favicon link points to a missing file

- [x] Scenario `Das Browser-Tab zeigt das Dwello-Symbol` (`navigation.feature`). Scenario red: `zeigt das Browser-Tab das Dwello-Symbol` – expected "image/svg+xml", received "HTTP 404"
- [x] Test red: `app-html.test.ts` «verlinkt nur Dateien, die unter static/ liegen» – received ["favicon.png"]; «verlinkt das Seitensymbol als SVG» – favicon.png link
- [x] `static/favicon.svg` (Lucide House, stroke 1.75, accent light/dark), `src/app.html` links it as SVG; production build (E2E) serves `/favicon.svg`, Docker copies `build/` with it
- [x] `docs/design/design-decisions.md` D7a
- [x] Skills: tdd, ponytail, ponytail-review
- [x] Checks: test:coverage, lint, check, backend test + type-check, deepcheck:audit
- [x] code-reviewer
  - code-reviewer round 1 (`docs/reviews/issue-122-review-1.md`): open none, fixed C-1 (Minor; `app-html.test.ts` «zeigt im Seitensymbol das Haus aus dem Header», red with a changed path), C-2 (Minor), rejected C-3: a missing href fails the question, `actor.sees` reports it; C-4: the link is written once in our own file, attribute order does not drift
- [ ] Personas Marco (phone), Anna (finding the way in)
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-122.md`
- [ ] PR, CI, merge

Files: `src/app.html`, `static/favicon.svg`, `src/__tests__/app-html.test.ts`, `tests/e2e/features/navigation.feature`, `tests/e2e/steps/app-frame.steps.ts`, `tests/e2e/questions/app-frame.ts`, `tests/e2e/screenplay/questions.ts`, `docs/design/design-decisions.md`
