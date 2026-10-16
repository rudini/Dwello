# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W6b: #63, #105 and #106 (the tenant's Sprache)

- [ ] #63 `@wip` scenario: the Sprache offers Deutsch, Französisch, Italienisch, Englisch only (`tenant-edit.feature`), seen red
- [ ] #105 `@wip` scenarios: label «Sprache für Abrechnung und Mahnungen» (`tenant-edit.feature`), «PDF auf Französisch» on the statement detail (`statement-detail.feature`), seen red
- [ ] #106 `@wip` scenario: a reminder to a French-speaking tenant has a French title (`statement-reminder.feature`), seen red
- [ ] fach-reviewer on the scenarios and the reminder texts in fr/it/en before implementing
- [ ] #63 migration `0008` (tenants and `default_language` `rm` → `de`, CHECK without `rm`), backend validators, `Language` type, frontend type and labels, help text in four languages (pg test of the migration)
- [ ] #106 `reminderLetter` per language (unit test per language for all three Mahnstufen), `reminder.service` passes the tenant's Sprache; `statements_reminder_emailed` / `_letter` name the title in quotes
- [ ] #105 label and «PDF auf {Sprache}» in `PdfAction.svelte` (DOM test)
- [ ] docs: `docs/api-specification.md`, `docs/data-model.md`, `docs/tech-stack.md`, `docs/nebenkostenabrechnung-anforderungen.md`
- [ ] code-reviewer per slice, closing round
- [ ] Feature review: persona, fach-reviewer, daten-pruefer (PDF texts)
- [ ] Checks before push; workflow review; archive session
- [ ] Push, pull request, CI and merge (CLAUDE.md, Workflow 9)
