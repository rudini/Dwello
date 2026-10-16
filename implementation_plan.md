# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: category descriptions with exclusions (#204, #220, #221)

- [x] Migration `0007_category_descriptions.sql`: new descriptions for Heizung, Gartenpflege, Kehricht, TV/Kabelanschluss, Gebäudeversicherung, Verwaltung, only where a row still holds the seeded text (#204, #220)
- [x] pg test: the migration changes only untouched rows (`migrations.pg.test.ts`)
- [x] pg test: the categorisation prompt carries the new descriptions (`invoice-categorization.pg.test.ts`; #220 names `llm-prompt.test.ts`, which has no database)
- [x] `llm-eval.ts`: cases for heating insurance and administration, Baumfällung, Rasensanierung, a cable installation, a clearance, base fees by value (#204, #220); `llm:eval` before and after (MiniMax-M2.5, 47 cases: before 42/47 = 89 %, after 45/47 = 96 %; default model not runnable here)
- [x] `fach-reviewer` on the wording before the tests turn green: `docs/reviews/204-fachreview-1.md` (V-1 to V-7 applied; M-1, M-2 open)
- [x] #221: implementation issue #292 with its own "Done means" (takes M-2 of the domain review), #221 closed (decision issue)
- [x] `docs/data-model.md` if it lists descriptions
- [x] Slice review round 1: `docs/reviews/204-review-1.md` (C-1, C-3 fixed; C-4 rejected)
- [ ] Persona review (Dr. Weber, Marco) of the category edit page
- [ ] Closing review, PR

Files: `backend/migrations/0007_category_descriptions.sql`, `backend/scripts/llm-eval.ts`, `backend/src/__tests__/{migrations,invoice-categorization,heating-profiles}.pg.test.ts`, `docs/data-model.md`, `docs/reviews/204-fachreview-1.md`
