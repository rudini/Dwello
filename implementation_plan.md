# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #57 «Ihre Angaben» instead of «Entwurf» for the wizard input

- [ ] `@wip` scenarios: both wizards say the input is kept only in this browser and not saved yet, and «Angaben wiederhergestellt»; «Angaben verwerfen» (contract wizard); privacy notice; help `help_tenants_3`
- [ ] `fach-reviewer` on the scenarios and the proposed texts before implementing
- [ ] Texts in `messages/{de,fr,it,en}.json`: `ui_draft_saved`, `ui_draft_restored`, `help_tenants_3`, `privacy_draft_notice`, `gallery_toast_info`
- [ ] Unit/DOM tests updated red first (`ui-feedback`, `contract-wizard`, `statement-wizard`, `privacy-page`)
- [ ] Scenarios green without `@wip`; a11y/language rows of both wizards still green
- [ ] Slice review (`code-reviewer`), feature review (persona, `fach-reviewer`)
- [ ] Pull request `Fixes #57`, merged

Files changed:
