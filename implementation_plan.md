# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: help texts (#109, #67, #69)

- [x] #109: `@wip` scenarios in `help.feature` (new terms, contents list to the glossary) and their steps, seen red
- [x] #67, #69: `fach-reviewer` reads the proposed and listed help texts before implementing (help glossary, `config_help_*`, IBAN help with refunds, category sort order and translations): `docs/reviews/help-fachreview-{1,2}.md`, `docs/reviews/help-review-1.md`, `docs/design/personas/{helga,marco}-help-texts.md`
- [x] #109: contents list with anchors, glossary anchor `/help#glossary`, four new glossary terms (de, fr, it, en)
- [x] #67: `glossary_period_text` (same wording as PR #289) and `config_help_distribution_key` follow the glossary
- [x] #69: fach-reviewer findings fixed in all four languages; IBAN help names refunds; help under «Übersetzungen» (new `categories_translations_help`); product-owner points: #317 (new), #279, #83 (comments)
- [x] Slice review round 1 (`code-reviewer`): `docs/reviews/help-review-1.md`; C-1 (scenarios for the text fixes of #67/#69), C-2, C-4, C-5 fixed, C-3 left in its report
- [x] Feature review: `fach-reviewer` round 2 `docs/reviews/help-fachreview-2.md` (V-14 to V-17 fixed); personas `docs/design/personas/helga-help-texts.md`, `marco-help-texts.md` (no Blocker/Major)
- [ ] Closing `code-reviewer` round before the push
- [x] Checks: lint, check, type-check, unit tests (all), E2E help, settings, categories, distribution keys and the axe/language rows of help, config, category and distribution-key screens
- [ ] Workflow review, session to archive, pull request

Files: `src/lib/ui/Panel.svelte`, `src/lib/ui/PageHeader.svelte`, `src/routes/help/+page.svelte`, `src/routes/help/Glossary.svelte`, `src/routes/config/categories/CategoryForm.svelte`, `messages/{de,fr,it,en}.json`, `tests/e2e/features/{settings,distribution-keys}.feature`, `tests/e2e/{steps,questions}/settings…`, `tests/e2e/{features/help.feature,steps,questions,targets,tasks}/…app-frame…`, `src/__tests__/{help-page.dom,distribution-keys-pages.dom,categories-page.dom,config-pages}.test.ts`, `docs/reviews/help-fachreview-{1,2}.md`, `docs/reviews/help-review-1.md`, `docs/design/personas/{helga,marco}-help-texts.md`
