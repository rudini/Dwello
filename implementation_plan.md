# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-15: migrations frozen since the first installation

No issue (task from chat). No scenario: server-side failure (migration errors only show at backend start, not in the app).

- [x] Rule: `backend/CLAUDE.md`, `README.md` and `docs/design/design-decisions.md` drop "until the first installation"; every schema or master data change is a new file, a migration on `main` is never edited, renamed, deleted or merged into a new baseline
- [x] CI: "Lint and types" fails when a pull request modifies, renames or deletes a file in `backend/migrations` (`.github/workflows/ci.yml`; checked locally: an edit of `0001` red, a new `0003` and the clean branch green)
- [x] `migrate.ts`: the refusals no longer advise `db:reset` for an installation (`backend/src/db/migrate.ts`, `migrations.pg.test.ts`). Test red: migrations.pg.test.ts "lehnt eine Datenbank ab, die Migrationen kennt …" and "… ohne Buchführung …" – received "Bitte neu aufsetzen: bun run db:reset". Skills: tdd, ponytail, ponytail-review
- [ ] Checks, `code-reviewer`, workflow review, archive session, pull request
