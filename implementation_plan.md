# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-15: migrations frozen since the first installation

No issue (task from chat). No scenario: server-side failure (migration errors only show at backend start, not in the app).

- [x] Rule: `backend/CLAUDE.md`, `README.md`, `docs/data-model.md` and `docs/anforderungen-vertragsende.md` drop "until the first installation" (`docs/design/design-decisions.md` keeps the Session 12 row as history and gets a new row); every schema or master data change is a new file, a migration on `main` is never edited, renamed, deleted or merged into a new baseline
- [x] CI: "Lint and types" fails when a pull request modifies, renames or deletes a file in `backend/migrations` (`.github/workflows/ci.yml`; checked locally: an edit of `0001` red, a new `0003` and the clean branch green)
- [x] `migrate.ts`: the refusals no longer advise `db:reset` for an installation (`backend/src/db/migrate.ts`, `migrations.pg.test.ts`). Test red: migrations.pg.test.ts "lehnt eine Datenbank ab, die Migrationen kennt …" and "… ohne Buchführung …" – received "Bitte neu aufsetzen: bun run db:reset". Skills: tdd, ponytail, ponytail-review
- [ ] Review against the Opus 5.5 article (product owner, chat), fixes and delta review
- [ ] Checks, `code-reviewer`, workflow review, archive session, pull request

Reviews:

- general-purpose (Opus 5.5 article) round 1 (`docs/reviews/migrations-frozen-blogreview-1.md`): fixed B-1 (Major), B-2 (Minor), B-3 (Minor), B-4 (Nit) in `docs/data-model.md`, `docs/anforderungen-vertragsende.md`, `backend/CLAUDE.md`, the workflow review; no behavior change, confirmed by delta review
- code-reviewer round 1 (`docs/reviews/migrations-frozen-review-1.md`): fixed C-1 (Major, same as B-1), C-2 (Minor; Test red: migrations.pg.test.ts both refusals – received "… sonst gehen ihre Daten verloren."), C-3, C-4, C-5 (Nits)
