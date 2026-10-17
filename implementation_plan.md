# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W15b: hint without Akonto, Nebenkostenpauschale, form rule for befristet (#66, #388)

Branch `claude/w15-akonto-hints-66` (PR #401). Product owner 2026-10-17: #66 option A of the comment plus the glossary term «Nebenkostenpauschale», #388 option A.

- [x] @wip scenarios: hint without Akonto (`contract-new.feature`), form rule in the befristet running-contract hint (`contract-edit.feature`) and in the Akonto hint of the statement preview (`statement-generate.feature`)
- [x] fach-reviewer round 1 before implementing (`docs/reviews/66b-fachreview-1.md`)
- [x] `contracts_no_advance_text` per #66 (all four languages)
- [x] Form rule appended to `contracts_running_text_fixed_term` and `statements_akonto_raise_fixed_term`; `TODO(fachlich prüfen, #388)` removed
- [x] «Nebenkostenpauschale» in `UBIQUITOUS_LANGUAGE.md` (product owner's instruction, against CLAUDE.md «never edit it») and `docs/design/i18n-begriffe.md`
- Files: `messages/*.json`, `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md`, `src/routes/contracts/ContractForm.svelte` (marker), tests `contract-wizard`, `contracts-i18n`, `contract-edit.dom`, `statement-wizard`, E2E `contract-new`, `contract-edit`, `statement-generate`
- [ ] Slice review, feature review (personas), PR says `Fixes #66`, `Fixes #388`
