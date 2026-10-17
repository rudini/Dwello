# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W15b: hint without Akonto, Nebenkostenpauschale, form rule for befristet (#66, #388)

Branch `claude/w15-akonto-hints-66` (PR #401). Product owner 2026-10-17: #66 option A of the comment plus the glossary term «Nebenkostenpauschale», #388 option A.

- [ ] @wip scenarios: hint without Akonto (`contract-new.feature`), form rule in the befristet running-contract hint (`contract-edit.feature`) and in the Akonto hint of the statement preview (`statement-generate.feature`)
- [ ] fach-reviewer on scenarios, texts, glossary row and translations before implementing
- [ ] `contracts_no_advance_text` per #66 (all four languages)
- [ ] Form rule appended to `contracts_running_text_fixed_term` and `statements_akonto_raise_fixed_term`; `TODO(fachlich prüfen, #388)` removed
- [ ] «Nebenkostenpauschale» in `UBIQUITOUS_LANGUAGE.md` and `docs/design/i18n-begriffe.md`
- [ ] Slice review, feature review (personas), PR says `Fixes #66`, `Fixes #388`
