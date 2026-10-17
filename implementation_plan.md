# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W7e: audit log (#357)

- [x] Scenarios in `settings.feature` («Protokoll öffnen», «Änderungen im Protokoll sehen», «Eintrag im Protokoll löschen»), breadcrumb example, `privacy.feature`; fach-reviewer before implementing: `docs/reviews/w7e-fachreview-1.md` (R-1, R-2, V-1 Major fixed; V-2–V-9, R-3 fixed or answered)
- [x] Migration `0018_audit_log.sql`, `schema.ts`, `docs/data-model.md`, `docs/api-specification.md` (11a)
- [x] Backend: `audit-log.service.ts` and route; entries for the Verwaltungspauschale rate, a category's Umlagefähigkeit (with the invoices it excluded), an invoice that becomes (not) umlagefähig (form, category, KI), a reset payment, logins; `recordStatementCorrection(replaced, replacement)` for #358 (W2e); `audit-log.pg.test.ts`, contract `audit-log.json`
- [x] BFF: login entry from `src/routes/auth/callback` (`recordLogin` in `login-flow.ts`, fails open)
- [x] Page `/config/audit-log` with delete confirmation; link under «Einstellungen»; texts in four languages, term `TODO(fachlich prüfen, #370)`
- [x] a11y: `screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature` (default, empty, delete-dialog)
- [x] Privacy statement names the log (PR #359 not merged: paragraph `audit_privacy` under «Welche Daten Dwello speichert», demo note)
- [x] `docs/PRD-Dwello.md` audit lines point to what is built
- [ ] Slice review (code-reviewer), feature review (personas, fach-reviewer), workflow review, archive the session
