# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W7e: audit log (#357)

- [ ] Scenarios `@wip` in `settings.feature` («Änderungen im Protokoll sehen», «Eintrag im Protokoll löschen», navigation row), fach-reviewer before implementing (login data, privacy statement)
- [ ] Migration `0018_audit_log.sql`, `schema.ts`, `docs/data-model.md`
- [ ] Backend: `audit-log.service.ts` (record, list, delete) and route; entries for the Verwaltungspauschale rate, a category's Umlagefähigkeit, an invoice marked (not) umlagefähig, a reset payment, logins; `logStatementCorrection` for #358 (W2e)
- [ ] BFF: login entry from `src/routes/auth/callback`
- [ ] Page `/config/audit-log` with delete confirmation; link under «Einstellungen»; texts in four languages, term `TODO(fachlich prüfen, #370)`
- [ ] a11y: `screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`
- [ ] Privacy statement names the log (after merging main for PR #359)
- [ ] `docs/PRD-Dwello.md` audit lines point to what is built
- [ ] Slice and feature reviews, workflow review, archive the session
