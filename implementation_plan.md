# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16 (glossary from the entscheiden round)

Task: add to `UBIQUITOUS_LANGUAGE.md` the terms the product owner decided in the issues, at the product owner's request in this session (CLAUDE.md says Claude never edits the glossary; the product owner asked for it explicitly).

- [ ] Glossary entries and changes from #56, #58, #62, #63, #68, #75, #79, #85, #100, #102, #120, #133, #140, #205, #222, #239
- [ ] Checks: lint, open-work test, `src/__tests__/contract-rent-labels.test.ts`
- [ ] fach-reviewer round on the diff
  fach-reviewer round 1 (`docs/reviews/glossary-decisions-fachreview-1.md`): fixed V-1 (Major), V-2 (Major, product owner confirmed changing the #239 wording), V-3, M-1, M-2 (product owner: with «Ersatzmieter»), V-4, V-5, V-6, M-3, V-7, V-8, V-9 (V-4, V-7, V-9 decided by the product owner in this session), V-11, V-12, V-13, V-14, V-16, V-17, V-18, V-19; open V-10 (Minor, requirement docs follow with #79, #120: comments there), V-15 (Nit) and the missing terms -> new issue
- [ ] Archive session, push, PR (`Refs` the issues: their implementation is still open), CI, merge

Files: `UBIQUITOUS_LANGUAGE.md`
