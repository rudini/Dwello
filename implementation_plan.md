# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: help texts (#109, #67, #69)

- [ ] #109: `@wip` scenarios in `help.feature` (new terms, contents list to the glossary) and their steps, seen red
- [ ] #67, #69: `fach-reviewer` reads the proposed and listed help texts before implementing (help glossary, `config_help_*`, IBAN help with refunds, category sort order and translations)
- [ ] #109: contents list with anchors, glossary anchor `/help#glossary`, four new glossary terms (de, fr, it, en)
- [ ] #67: `glossary_period_text` (same wording as PR #289) and `config_help_distribution_key` follow the glossary
- [ ] #69: fach-reviewer findings fixed in all four languages; IBAN help names refunds
- [ ] Slice review (`code-reviewer`), feature review (personas, `fach-reviewer`)
- [ ] Checks: lint, check, type-check, affected unit tests, help, accessibility and language E2E
- [ ] Workflow review, session to archive, pull request
