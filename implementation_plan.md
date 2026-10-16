# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: category descriptions with exclusions (#204, #220, #221)

- [ ] Migration `0007_category_descriptions.sql`: new descriptions for Heizung, Gartenpflege, Kehricht, TV/Kabelanschluss, Gebäudeversicherung, Verwaltung, only where a row still holds the seeded text (#204, #220)
- [ ] pg test: the migration changes only untouched rows (`migrations.pg.test.ts`)
- [ ] pg test: the categorisation prompt carries the new descriptions (`invoice-categorization.pg.test.ts`; #220 names `llm-prompt.test.ts`, which has no database)
- [ ] `llm-eval.ts`: cases Baumfällung, Heizungsversicherung, Verwaltung der Heizung, Anschluss ans Kabelnetz, Räumung (#204, #220); `llm:eval` before and after (MiniMax, default model not runnable here)
- [ ] `fach-reviewer` on the wording before the tests turn green
- [ ] #221: implementation issue with its own "Done means", then close #221 (decision issue)
- [ ] `docs/data-model.md` if it lists descriptions
- [ ] Slice review, closing review, PR
