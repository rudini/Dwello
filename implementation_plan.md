# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #57 «Ihre Angaben» instead of «Entwurf» for the wizard input

- [x] `@wip` scenarios: both wizards say the input is kept only in this browser and not saved yet, and «Angaben wiederhergestellt»; «Angaben verwerfen» (contract wizard); privacy notice; help `help_tenants_3`
- [x] `fach-reviewer` on the scenarios and the proposed texts before implementing (`docs/reviews/57-fachreview-1.md`)
- [x] Texts in `messages/{de,fr,it,en}.json`: `ui_draft_saved`, `ui_draft_restored`, `ui_draft_back` (V-2), `help_tenants_3`, `privacy_draft_notice`, `gallery_toast_info`; no success icon in the save status (V-1)
- [x] Unit/DOM tests updated red first (`ui-feedback`, `contract-wizard`, `statement-wizard`, `privacy-page`)
- [x] Scenarios green without `@wip`; a11y/language rows of both wizards still green
- [ ] Slice review (`code-reviewer`), feature review (persona, `fach-reviewer`)
- [ ] Pull request `Fixes #57`, merged

Files changed: `messages/{de,fr,it,en}.json`, `src/lib/ui/SaveStatus.svelte`, `src/__tests__/{ui-feedback,contract-wizard,statement-wizard,privacy-page}.dom.test.ts`, `tests/e2e/features/{contract-new,statement-generate,privacy,help}.feature`, `tests/e2e/{steps,tasks,questions,targets}/…`, `tests/a11y/screens.json`, `docs/reviews/57-fachreview-1.md`
